"""Complaint service - business logic layer"""

from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.user import Ward, Department
from app.repositories.complaint_repository import ComplaintRepository
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintAnalysisResponse, ComplaintLinks
from app.schemas.common import ComplaintStatus, EntityResult
from app.ml.pipeline import analyze_complaint
from app.ml.similarity import find_similar_complaints
from app.core.config import settings
from app.core.errors import NotFoundException


class ComplaintService:
    """Service for complaint operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = ComplaintRepository(db)
    
    def create_complaint(self, complaint_data: ComplaintCreate) -> ComplaintResponse:
        """
        Create a new complaint with ML analysis.
        
        Args:
            complaint_data: Complaint input data
        """
        # Get or create department
        from app.models.user import Department, Ward
        from app.models.procurement import City
        from sqlalchemy import func as sqlfunc
        
        category_slug = complaint_data.category or complaint_data.category_hint or "general"
        department = None
        if category_slug:
            clean_cat = category_slug.strip().lower().replace(" ", "_").replace("-", "_")
            department = self.db.query(Department).filter(
                (sqlfunc.lower(Department.slug) == clean_cat) |
                (sqlfunc.lower(Department.name).like(f"%{clean_cat}%"))
            ).first()
        if not department:
            department = self.db.query(Department).first()
        
        # Get ward if provided
        ward = None
        if complaint_data.ward_number:
            ward = self.db.query(Ward).filter(
                Ward.ward_number == complaint_data.ward_number
            ).first()

        # Resolve valid city_id
        city_id = None
        if complaint_data.city_id:
            try:
                c = self.db.get(City, UUID(complaint_data.city_id))
                if c: city_id = c.id
            except Exception:
                pass
        if not city_id and complaint_data.city:
            c = self.db.query(City).filter(sqlfunc.lower(City.name) == complaint_data.city.strip().lower()).first()
            if c: city_id = c.id
        if not city_id and ward and getattr(ward, "city_id", None):
            city_id = ward.city_id
        if not city_id:
            default_city = self.db.query(City).first()
            if default_city:
                city_id = default_city.id
            else:
                # If table is completely empty, create default city
                default_city = City(name="Vadodara", state_code="GJ")
                self.db.add(default_city)
                self.db.flush()
                city_id = default_city.id
            
        # Generate public ID using Postgres sequence
        next_num = self.repo.get_next_public_id_number()
        year = datetime.now(timezone.utc).year
        public_id = f"JN-{year}-{next_num:05d}"
        
        priority = "medium"
        
        # Create complaint
        complaint = Complaint(
            public_id_seq=next_num,
            public_id=public_id,
            title=complaint_data.title or (complaint_data.description[:50] + "..."),
            description=complaint_data.description,
            category=department.slug if department else "general",
            department_id=department.id if department else None,
            status=ComplaintStatus.RECEIVED.value,
            priority=priority,
            ward_id=ward.id if ward else None,
            city_id=city_id,
            lat=complaint_data.lat,
            lng=complaint_data.lng,
            address_text=complaint_data.address_text,
            submitted_by_name=complaint_data.submitted_by.name if complaint_data.submitted_by else None,
            submitted_by_phone=complaint_data.submitted_by.phone if complaint_data.submitted_by else None,
            source='web',
        )
        # We need a proper city_id. In the route, we should inject city_id to complaint_data.
        # But for now, we'll try to extract it from the ward or default.
        
        complaint = self.repo.create(complaint)
        
        # Create job
        from app.services.job_service import JobService
        job_service = JobService(self.db)
        job_service.create_analysis_job(complaint.id)
        
        # Background task processing (in real app, use Celery or BackgroundTasks)
        # We'll just run it synchronously here for the demo, or assume a worker picks it up
        
        # Refresh to get relationships
        self.db.refresh(complaint)
        
        return self._to_response(complaint, include_links=True)
    
    def get_complaint(self, complaint_id: UUID) -> ComplaintResponse:
        """Get complaint by UUID"""
        complaint = self.repo.get_by_id(complaint_id)
        if not complaint:
            raise NotFoundException("Complaint not found")
        
        return self._to_response(complaint, include_links=True)
    
    def get_complaint_by_public_id(self, public_id: str) -> ComplaintResponse | None:
        """Get complaint by public_id (JN-YYYY-NNNNN format)"""
        complaint = self.repo.get_by_public_id(public_id)
        if not complaint:
            return None
        
        return self._to_response(complaint, include_links=True)
    
    def list_complaints(
        self,
        ward: int | None = None,
        status: ComplaintStatus | None = None,
        category: str | None = None,
        limit: int = 20,
        offset: int = 0,
        city: str | None = None,
    ):
        """List complaints with filters"""
        from app.schemas.common import ComplaintCategory
        
        category_enum = None
        if category:
            try:
                category_enum = ComplaintCategory(category)
            except ValueError:
                pass
        complaints, total = self.repo.list_complaints(
            ward=ward,
            status=status,
            category=category_enum,
            limit=limit,
            offset=offset,
            city=city,
        )
        
        items = [self._to_list_item(c) for c in complaints]
        
        return {
            'items': items,
            'total': total,
            'limit': limit,
            'offset': offset,
        }
    
    def update_status(self, complaint_id: UUID, status: ComplaintStatus) -> ComplaintResponse:
        """Update complaint status"""
        complaint = self.repo.update_status(complaint_id, status)
        if not complaint:
            raise NotFoundException("Complaint not found")
        
        return self._to_response(complaint)
    
    def get_similar_complaints(self, complaint_id: UUID, limit: int = 5):
        """Get similar complaints"""
        complaint = self.repo.get_by_id(complaint_id)
        if not complaint:
            raise NotFoundException("Complaint not found")
        
        if not complaint.analysis or not complaint.analysis.embedding_vector:
            return {
                'complaint_id': complaint_id,
                'embedding_model': settings.sentence_model_name,
                'items': []
            }
        
        # Find similar
        similar_results = find_similar_complaints(
            complaint.analysis.embedding_vector,
            k=limit,
            exclude_id=complaint_id
        )
        
        # Build response
        items = []
        for similar_id, similarity_score in similar_results:
            similar_complaint = self.repo.get_by_id(similar_id)
            if similar_complaint:
                # Calculate distance if both have coordinates
                distance_meters = None
                if (complaint.lat and complaint.lng and 
                    similar_complaint.lat and similar_complaint.lng):
                    distance_meters = self._calculate_distance(
                        complaint.lat, complaint.lng,
                        similar_complaint.lat, similar_complaint.lng
                    )
                
                items.append({
                    'id': similar_complaint.id,
                    'public_id': similar_complaint.public_id,
                    'title': similar_complaint.title,
                    'similarity_score': round(similarity_score, 3),
                    'distance_meters': distance_meters,
                    'created_at': similar_complaint.created_at,
                })
        
        return {
            'complaint_id': complaint_id,
            'embedding_model': complaint.analysis.embedding_model,
            'items': items
        }
    
    def _determine_priority(self, severity: int, risk: int) -> str:
        """Determine priority from severity and risk"""
        avg_score = (severity + risk) / 2
        
        if avg_score >= 80:
            return 'urgent'
        elif avg_score >= 60:
            return 'high'
        elif avg_score >= 35:
            return 'medium'
        else:
            return 'low'
    
    def _to_response(self, complaint: Complaint, include_links: bool = False) -> ComplaintResponse:
        """Convert complaint model to response schema"""
        analysis_response = None
        if complaint.analysis:
            analysis_response = ComplaintAnalysisResponse(
                language=complaint.analysis.language,
                keywords=complaint.analysis.keywords_json or [],
                entities=[EntityResult(**e) for e in (complaint.analysis.entities_json or [])],
                similar_count=0,  # Computed separately if needed
                possible_duplicate=False,
                confidence_score=complaint.analysis.confidence_score,
            )
        
        links = None
        if include_links:
            links = ComplaintLinks(
                self=f"{settings.api_v1_prefix}/complaints/{complaint.id}",
                similar=f"{settings.api_v1_prefix}/complaints/{complaint.id}/similar"
            )
        
        ward_number = None
        if complaint.ward:
            ward_number = complaint.ward.ward_number
        
        return ComplaintResponse(
            id=complaint.id,
            public_id=complaint.public_id,
            title=complaint.title,
            description=complaint.description,
            status=ComplaintStatus(complaint.status),
            category=complaint.category,
            department=complaint.department.name,
            priority=complaint.priority,
            severity_score=complaint.severity_score,
            risk_score=complaint.risk_score,
            ward_number=ward_number,
            lat=complaint.lat,
            lng=complaint.lng,
            address_text=complaint.address_text,
            created_at=complaint.created_at,
            updated_at=complaint.updated_at,
            analysis=analysis_response,
            links=links,
        )
    
    def _to_list_item(self, complaint: Complaint):
        """Convert to list item"""
        from app.schemas.complaint import ComplaintListItem
        
        ward_number = None
        if complaint.ward:
            ward_number = complaint.ward.ward_number
        
        return ComplaintListItem(
            id=complaint.id,
            public_id=complaint.public_id,
            title=complaint.title,
            status=ComplaintStatus(complaint.status),
            category=complaint.category,
            priority=complaint.priority,
            risk_score=complaint.risk_score,
            ward_number=ward_number,
            created_at=complaint.created_at,
        )
    
    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance between two points in meters (Haversine formula)"""
        from math import radians, cos, sin, asin, sqrt
        
        R = 6371000  # Earth radius in meters
        
        lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
        c = 2 * asin(sqrt(a))
        
        return R * c
