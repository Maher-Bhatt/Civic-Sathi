"""Complaint repository for database operations"""

from uuid import UUID
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import Session

from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.user import Ward, Department
from app.schemas.common import ComplaintStatus, ComplaintCategory


class ComplaintRepository:
    """Repository for complaint data access"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, complaint: Complaint) -> Complaint:
        """Create a new complaint"""
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        return complaint
    
    def get_by_id(self, complaint_id: UUID) -> Complaint | None:
        """Get complaint by ID with relationships"""
        return self.db.execute(
            select(Complaint)
            .where(Complaint.id == complaint_id)
        ).scalar_one_or_none()
    
    def get_by_public_id(self, public_id: str) -> Complaint | None:
        """Get complaint by public ID"""
        return self.db.execute(
            select(Complaint).where(Complaint.public_id == public_id)
        ).scalar_one_or_none()
    
    def list_complaints(
        self,
        ward: int | None = None,
        status: ComplaintStatus | None = None,
        category: ComplaintCategory | None = None,
        limit: int = 20,
        offset: int = 0,
        city: str | None = None,
    ) -> tuple[list[Complaint], int]:
        """List complaints with filters and pagination"""
        query = select(Complaint)
        
        filters = []
        if ward:
            filters.append(Complaint.ward_id.in_(
                select(Ward.id).where(Ward.ward_number == ward)
            ))
        if status:
            filters.append(Complaint.status == status.value)
        if category:
            filters.append(Complaint.category == category.value)
        
        if filters:
            query = query.where(and_(*filters))
        
        if ward:
            query = query.join(Ward).filter(Ward.ward_number == ward)
            
        if city:
            query = query.filter(Complaint.city_id == city)
            
        # Get total count
        total = self.db.execute(
            select(func.count()).select_from(query.subquery())
        ).scalar()
        
        # Get paginated results
        query = query.order_by(Complaint.created_at.desc()).limit(limit).offset(offset)
        complaints = list(self.db.execute(query).scalars())
        
        return complaints, total or 0
    
    def update_status(self, complaint_id: UUID, status: ComplaintStatus) -> Complaint | None:
        """Update complaint status"""
        complaint = self.get_by_id(complaint_id)
        if complaint:
            complaint.status = status.value
            self.db.commit()
            self.db.refresh(complaint)
        return complaint
    
    def get_recent_with_embeddings(self, days: int = 30) -> list[Complaint]:
        """Get recent complaints that have embeddings"""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        
        return list(self.db.execute(
            select(Complaint)
            .join(ComplaintAnalysis, Complaint.id == ComplaintAnalysis.complaint_id)
            .where(
                and_(
                    Complaint.created_at >= cutoff,
                    ComplaintAnalysis.embedding_vector.isnot(None)
                )
            )
        ).scalars())
    
    def get_next_public_id_number(self) -> int:
        """Get next public ID sequence number from Postgres sequence"""
        result = self.db.execute(
            select(func.nextval("complaint_public_seq"))
        ).scalar()
        return result
    
    def create_analysis(self, analysis: ComplaintAnalysis) -> ComplaintAnalysis:
        """Create complaint analysis"""
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis
    
    def get_by_ward(self, ward_id: UUID) -> list[Complaint]:
        """Get all complaints in a ward"""
        return list(self.db.execute(
            select(Complaint).where(Complaint.ward_id == ward_id)
        ).scalars())
    
    def delete_demo_data(self):
        """Delete demo/seed data"""
        self.db.execute(
            select(Complaint).where(Complaint.source == "demo")
        ).delete()
        self.db.commit()
