"""Issue clustering service"""

import time
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.issue import IssueCluster, IssueComplaint
from app.models.user import Ward
from app.repositories.complaint_repository import ComplaintRepository
from app.repositories.issue_repository import IssueRepository
from app.ml.embeddings import embed_batch
from app.ml.similarity import rebuild_similarity_index
from app.ml.clustering import group_complaints_by_similarity, generate_cluster_title, generate_cluster_summary
from app.ml.risk import calculate_issue_risk_score, get_risk_level
from app.ml.root_cause import generate_root_cause
from app.ml.recommendations import generate_recommendations
from app.core.config import settings
from app.core.errors import NotFoundException


class IssueService:
    """Service for issue cluster operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.issue_repo = IssueRepository(db)
        self.complaint_repo = ComplaintRepository(db)
    
    def rebuild_issues(self) -> dict:
        """
        Rebuild issue clusters from recent complaints.
        
        Returns:
            Dictionary with rebuild statistics
        """
        start_time = time.time()
        
        # 1. Get recent complaints with embeddings
        complaints = self.complaint_repo.get_recent_with_embeddings(
            days=settings.systemic_window_days
        )
        
        if not complaints:
            return {
                'success': True,
                'issues_created': 0,
                'issues_updated': 0,
                'complaints_processed': 0,
                'duration_ms': int((time.time() - start_time) * 1000)
            }
        
        # 2. Generate embeddings for any missing
        complaints_to_embed = [
            c for c in complaints
            if not c.analysis or not c.analysis.embedding_vector
        ]
        
        if complaints_to_embed:
            texts = [f"{c.title}. {c.description}" for c in complaints_to_embed]
            embeddings = embed_batch(texts)
            
            from app.ml.preprocessing import preprocess_text
            for complaint, embedding in zip(complaints_to_embed, embeddings):
                if complaint.analysis:
                    complaint.analysis.embedding_vector = embedding
                else:
                    from app.models.complaint import ComplaintAnalysis
                    processed = preprocess_text(f"{complaint.title}. {complaint.description}")
                    analysis = ComplaintAnalysis(
                        complaint_id=complaint.id,
                        language=processed['language'],
                        cleaned_text=processed['cleaned_text'],
                        keywords_json=processed['keywords'],
                        embedding_model=settings.sentence_model_name,
                        embedding_vector=embedding,
                    )
                    self.db.add(analysis)
            
            self.db.commit()
        
        # 3. Rebuild FAISS index
        all_embeddings = [c.analysis.embedding_vector for c in complaints if c.analysis]
        all_ids = [c.id for c in complaints if c.analysis]
        rebuild_similarity_index(all_embeddings, all_ids)
        
        # 4. Prepare complaint data for clustering
        complaints_data = []
        for c in complaints:
            ward_number = c.ward.ward_number if c.ward else None
            keywords = c.analysis.keywords_json if c.analysis else []
            
            complaints_data.append({
                'id': c.id,
                'city_id': c.city_id,
                'category': c.category,
                'ward_id': c.ward_id,
                'ward_number': ward_number,
                'keywords': keywords,
                'created_at': c.created_at,
                'severity_score': c.severity_score,
                'lat': c.lat,
                'lng': c.lng,
            })
        
        # 5. Group into clusters
        clusters = group_complaints_by_similarity(complaints_data)
        
        # 6. Delete old issues and create new ones
        self.issue_repo.delete_all_issues()
        self.db.commit()
        
        issues_created = 0
        for cluster in clusters:
            issue = self._create_issue_from_cluster(cluster)
            issues_created += 1
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        return {
            'success': True,
            'issues_created': issues_created,
            'issues_updated': 0,
            'complaints_processed': len(complaints),
            'duration_ms': duration_ms
        }
    
    def _create_issue_from_cluster(self, cluster) -> IssueCluster:
        """Create issue cluster from complaint cluster"""
        # Get department
        from app.models.user import Department
        category_to_dept = {
            'sanitation': 'sanitation',
            'roads': 'public_works',
            'water': 'water_works',
            'electricity': 'electricity',
            'drainage': 'drainage',
            'safety': 'safety',
        }
        
        dept_slug = category_to_dept.get(cluster.category, 'general')
        department = self.db.query(Department).filter(Department.slug == dept_slug).first()
        
        # Calculate risk
        risk_score = calculate_issue_risk_score(cluster)
        risk_level = get_risk_level(risk_score)
        
        # Get time range
        first_seen, last_seen = cluster.get_time_range()
        
        # Get centroid
        centroid = cluster.get_centroid()
        
        # Create issue
        issue = IssueCluster(
            title=generate_cluster_title(cluster),
            summary=generate_cluster_summary(cluster),
            category=cluster.category,
            department_id=department.id if department else None,
            ward_id=cluster.ward_id,
            status='open',
            risk_level=risk_level,
            risk_score=risk_score,
            complaint_count=cluster.size(),
            centroid_lat=centroid[0] if centroid else None,
            centroid_lng=centroid[1] if centroid else None,
            first_seen_at=first_seen,
            last_seen_at=last_seen,
        )
        
        issue = self.issue_repo.create(issue)
        
        # Link complaints
        for complaint_id in cluster.complaint_ids:
            issue_complaint = IssueComplaint(
                issue_id=issue.id,
                complaint_id=complaint_id,
                similarity_score=0.85,  # Simplified for MVP
                added_at=datetime.now(timezone.utc)
            )
            self.issue_repo.add_complaint_to_issue(issue_complaint)
        
        # Generate root cause
        root_cause_data = generate_root_cause(cluster)
        from app.models.issue import RootCause
        root_cause = RootCause(
            issue_id=issue.id,
            cause_type=root_cause_data['cause_type'],
            explanation=root_cause_data['explanation'],
            evidence_json=root_cause_data['evidence'],
            confidence_score=root_cause_data['confidence_score'],
        )
        self.issue_repo.create_root_cause(root_cause)
        
        # Generate recommendations
        recommendations = generate_recommendations(cluster, root_cause_data['cause_type'])
        for rec_data in recommendations:
            from app.models.recommendation import Recommendation
            rec = Recommendation(
                issue_id=issue.id,
                title=rec_data['title'],
                action_type=rec_data['action_type'],
                priority=rec_data['priority'],
                effort_level=rec_data.get('effort_level'),
                expected_impact=rec_data.get('expected_impact'),
                steps_json=rec_data.get('steps', []),
            )
            self.issue_repo.create_recommendation(rec)
        
        return issue
    
    def list_issues(self, risk: str | None = None, status: str | None = None, ward: int | None = None, city_id: UUID | None = None):
        """List issues with filters"""
        from app.schemas.common import RiskLevel
        
        risk_enum = None
        if risk:
            try:
                risk_enum = RiskLevel(risk)
            except ValueError:
                pass
        
        issues = self.issue_repo.list_issues(risk=risk_enum, status=status, ward=ward, city_id=city_id)
        
        from app.schemas.issue import IssueListItem
        from app.schemas.common import Coordinates
        
        items = []
        for issue in issues:
            ward_number = issue.ward.ward_number if issue.ward else None
            
            centroid = None
            if issue.centroid_lat and issue.centroid_lng:
                centroid = Coordinates(lat=issue.centroid_lat, lng=issue.centroid_lng)
            
            root_cause_summary = None
            if issue.root_causes:
                root_cause_summary = issue.root_causes[0].explanation
            
            top_recommendation = None
            if issue.recommendations:
                top_recommendation = issue.recommendations[0].title
            
            items.append(IssueListItem(
                id=issue.id,
                title=issue.title,
                category=issue.category,
                department=issue.department.name if issue.department else "General",
                department_id=issue.department_id,
                ward_number=ward_number,
                complaint_count=issue.complaint_count,
                risk_level=RiskLevel(issue.risk_level),
                risk_score=issue.risk_score,
                root_cause_summary=root_cause_summary,
                top_recommendation=top_recommendation,
                centroid=centroid,
                first_seen_at=issue.first_seen_at,
                last_seen_at=issue.last_seen_at,
            ))
        
        return {'items': items}
    
    def get_issue(self, issue_id: UUID):
        """Get issue detail"""
        issue = self.issue_repo.get_by_id(issue_id)
        if not issue:
            raise NotFoundException("Issue not found")
        
        from app.schemas.issue import IssueDetailResponse, RootCauseResponse, RecommendationResponse
        from app.schemas.common import Coordinates
        
        ward_number = issue.ward.ward_number if issue.ward else None
        
        centroid = None
        if issue.centroid_lat and issue.centroid_lng:
            centroid = Coordinates(lat=issue.centroid_lat, lng=issue.centroid_lng)
        
        root_causes = [RootCauseResponse.model_validate(rc) for rc in issue.root_causes]
        recommendations = [RecommendationResponse.model_validate(rec) for rec in issue.recommendations]
        
        return IssueDetailResponse(
            id=issue.id,
            title=issue.title,
            summary=issue.summary,
            category=issue.category,
            department=issue.department.name if issue.department else "General",
            department_id=issue.department_id,
            ward_number=ward_number,
            status=issue.status,
            risk_level=issue.risk_level,
            risk_score=issue.risk_score,
            complaint_count=issue.complaint_count,
            centroid=centroid,
            first_seen_at=issue.first_seen_at,
            last_seen_at=issue.last_seen_at,
            root_causes=root_causes,
            recommendations=recommendations,
        )

    def update_issue(self, issue_id: UUID, patch_data: dict):
        """Update systemic issue status, department, etc."""
        issue = self.issue_repo.get_by_id(issue_id)
        if not issue:
            raise NotFoundException("Issue not found")
        
        if "status" in patch_data and patch_data["status"] is not None:
            issue.status = str(patch_data["status"]).lower()
        if "title" in patch_data and patch_data["title"] is not None:
            issue.title = patch_data["title"]
        if "summary" in patch_data and patch_data["summary"] is not None:
            issue.summary = patch_data["summary"]
        if "department" in patch_data and patch_data["department"] is not None:
            from app.models.user import Department
            dept_name = str(patch_data["department"])
            dept = self.db.query(Department).filter(
                (Department.name.ilike(f"%{dept_name}%")) | (Department.slug == dept_name.lower())
            ).first()
            if dept:
                issue.department_id = dept.id
        
        self.db.commit()
        self.db.refresh(issue)
        return self.get_issue(issue_id)
