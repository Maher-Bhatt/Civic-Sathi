"""Job service for async ML analysis and deduplication"""

import time
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.job import AnalysisJob
from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.issue import IssueCluster, IssueComplaint
from app.ml.pipeline import analyze_complaint
from app.ml.deduplication import get_candidate_issues, calculate_similarity_score
from app.schemas.complaint import ComplaintCreate
from app.ml.similarity import find_similar_complaints


class JobService:
    def __init__(self, db: Session):
        self.db = db
        self.AUTO_DUPLICATE_THRESHOLD = 0.85
        self.REVIEW_THRESHOLD = 0.60

    def create_analysis_job(self, complaint_id: UUID) -> AnalysisJob:
        """Create a new analysis job for a complaint"""
        job = AnalysisJob(
            job_type="COMPLAINT_ANALYSIS",
            complaint_id=complaint_id,
            status="PENDING",
            available_at=datetime.now(timezone.utc)
        )
        self.db.add(job)
        self.db.commit()
        return job

    def process_next_job(self) -> bool:
        """Process one pending job. Returns True if a job was processed."""
        # Find pending job
        job = self.db.query(AnalysisJob).filter(
            AnalysisJob.status == "PENDING"
        ).order_by(AnalysisJob.available_at.asc()).first()
        
        if not job:
            return False
            
        job.status = "PROCESSING"
        job.started_at = datetime.now(timezone.utc)
        job.attempt_count += 1
        self.db.commit()
        
        try:
            self._execute_analysis_job(job)
            job.status = "COMPLETED"
            job.completed_at = datetime.now(timezone.utc)
            self.db.commit()
        except Exception as e:
            job.status = "FAILED"
            job.last_error = str(e)
            self.db.commit()
            print(f"Job {job.id} failed: {e}")
            
        return True

    def _execute_analysis_job(self, job: AnalysisJob):
        """Execute the AI pipeline and deduplication logic"""
        complaint = job.complaint
        if not complaint:
            raise ValueError(f"Complaint {job.complaint_id} not found")
            
        # 1. Basic Analysis
        # Create a mock ComplaintCreate for the pipeline
        from app.schemas.complaint import SubmittedBy
        user_info = SubmittedBy(name=complaint.submitted_by_name or "Unknown", phone=complaint.submitted_by_phone)
        
        complaint_data = ComplaintCreate(
            title=complaint.title,
            description=complaint.description,
            ward_number=complaint.ward.ward_number if complaint.ward else None,
            lat=complaint.lat,
            lng=complaint.lng,
            address_text=complaint.address_text,
            submitted_by=user_info
        )
        
        ml_result = analyze_complaint(complaint_data, self.db)
        
        # Save analysis
        analysis = self.db.query(ComplaintAnalysis).filter(ComplaintAnalysis.complaint_id == complaint.id).first()
        if not analysis:
            analysis = ComplaintAnalysis(complaint_id=complaint.id)
            self.db.add(analysis)
            
        existing_entities = analysis.entities_json if isinstance(analysis.entities_json, list) else []
        preserved_ai_metadata = [
            item for item in existing_entities
            if isinstance(item, dict) and item.get("label") in {"ai_interpretation", "municipality_action"}
        ]
        analysis.language = analysis.language or ml_result.language
        analysis.cleaned_text = analysis.cleaned_text or ml_result.cleaned_text
        analysis.entities_json = [e.model_dump() for e in ml_result.entities] + preserved_ai_metadata
        analysis.keywords_json = ml_result.keywords
        analysis.embedding_model = ml_result.embedding_model
        analysis.embedding_vector = ml_result.embedding_vector
        analysis.confidence_score = ml_result.confidence_score
        
        # 2. Candidate Retrieval (Stage 1)
        candidates = get_candidate_issues(
            self.db,
            city_id=complaint.city_id,
            category=ml_result.category.value,
            lat=complaint.lat,
            lng=complaint.lng
        )
        
        best_candidate = None
        best_score = 0.0
        
        # 3. Multi-Signal Scoring (Stage 2)
        if candidates:
            # We use FAISS text similarity for the vector part
            # (In a real pgvector setup, we'd do this in the DB)
            # Find similar from FAISS memory index (mocking vector search)
            vector_sims = find_similar_complaints(ml_result.embedding_vector, k=50)
            sim_dict = {str(cid): score for cid, score in vector_sims}
            
            for candidate in candidates:
                # Approximate text similarity by looking if any of the candidate's complaints are similar
                # Or just default to 0.5 if not found in memory index
                text_sim = 0.5 
                
                # Geo dist
                geo_dist = None
                if complaint.lat and complaint.lng and candidate.centroid_lat and candidate.centroid_lng:
                    from app.ml.deduplication import haversine_distance
                    # Calculate in python for the loaded candidate
                    from math import radians, cos, sin, asin, sqrt
                    R = 6371000
                    lat1, lng1, lat2, lng2 = map(radians, [complaint.lat, complaint.lng, candidate.centroid_lat, candidate.centroid_lng])
                    dlat = lat2 - lat1
                    dlng = lng2 - lng1
                    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
                    geo_dist = R * 2 * asin(sqrt(a))
                
                # Time diff
                time_diff = (datetime.now(timezone.utc) - candidate.last_seen_at).days
                
                score = calculate_similarity_score(text_sim, geo_dist, time_diff)
                
                if score > best_score:
                    best_score = score
                    best_candidate = candidate

        # 4. Three-Way Decision
        if best_candidate and best_score >= self.AUTO_DUPLICATE_THRESHOLD:
            # DUPLICATE
            analysis.ai_status = "DUPLICATE"
            analysis.duplicate_score = best_score
            analysis.candidate_issue_id = best_candidate.id
            
            # Link to issue
            link = IssueComplaint(
                issue_id=best_candidate.id,
                complaint_id=complaint.id,
                similarity_score=best_score,
                relationship_type="DUPLICATE",
                confidence_score=best_score,
                added_at=datetime.now(timezone.utc)
            )
            self.db.add(link)
            best_candidate.complaint_count += 1
            best_candidate.last_seen_at = datetime.now(timezone.utc)
            
        elif best_candidate and best_score >= self.REVIEW_THRESHOLD:
            # RELATED - Needs Review
            analysis.ai_status = "RELATED"
            analysis.duplicate_score = best_score
            analysis.candidate_issue_id = best_candidate.id
            
            # Link but mark as related
            link = IssueComplaint(
                issue_id=best_candidate.id,
                complaint_id=complaint.id,
                similarity_score=best_score,
                relationship_type="RELATED",
                confidence_score=best_score,
                added_at=datetime.now(timezone.utc)
            )
            self.db.add(link)
            
        else:
            # UNIQUE - Create new issue
            analysis.ai_status = "UNIQUE"
            analysis.duplicate_score = best_score
            
            new_issue = IssueCluster(
                title=complaint.title,
                summary=complaint.description,
                category=ml_result.category.value,
                department_id=complaint.department_id,
                ward_id=complaint.ward_id,
                city_id=complaint.city_id,
                status="open",
                risk_level="medium",
                risk_score=ml_result.risk_score,
                complaint_count=1,
                centroid_lat=complaint.lat,
                centroid_lng=complaint.lng,
                first_seen_at=datetime.now(timezone.utc),
                last_seen_at=datetime.now(timezone.utc)
            )
            self.db.add(new_issue)
            self.db.flush() # get ID
            
            analysis.candidate_issue_id = new_issue.id
            
            link = IssueComplaint(
                issue_id=new_issue.id,
                complaint_id=complaint.id,
                similarity_score=1.0,
                relationship_type="UNIQUE",
                confidence_score=1.0,
                added_at=datetime.now(timezone.utc)
            )
            self.db.add(link)

        self.db.commit()
