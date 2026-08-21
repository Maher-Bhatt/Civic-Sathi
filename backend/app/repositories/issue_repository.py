"""Issue repository for database operations"""

from uuid import UUID
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session, joinedload

from app.models.issue import IssueCluster, IssueComplaint, RootCause
from app.models.complaint import Complaint
from app.models.recommendation import Recommendation
from app.schemas.common import RiskLevel, ComplaintCategory


class IssueRepository:
    """Repository for issue cluster data access"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, issue: IssueCluster) -> IssueCluster:
        """Create a new issue cluster"""
        self.db.add(issue)
        self.db.commit()
        self.db.refresh(issue)
        return issue
    
    def get_by_id(self, issue_id: UUID) -> IssueCluster | None:
        """Get issue by ID with relationships"""
        return self.db.execute(
            select(IssueCluster)
            .where(IssueCluster.id == issue_id)
            .options(
                joinedload(IssueCluster.root_causes),
                joinedload(IssueCluster.recommendations)
            )
        ).unique().scalar_one_or_none()

    def list_issues(
        self,
        risk: RiskLevel | None = None,
        status: str | None = None,
        ward: int | None = None,
        city_id: UUID | None = None,
    ) -> list[IssueCluster]:
        """List issues with filters"""
        query = select(IssueCluster)
        
        filters = []
        if city_id:
            query = query.join(IssueComplaint, IssueCluster.id == IssueComplaint.issue_id).join(
                Complaint, IssueComplaint.complaint_id == Complaint.id
            )
            filters.append(Complaint.city_id == city_id)
        if risk:
            filters.append(IssueCluster.risk_level == risk.value)
        if status:
            filters.append(IssueCluster.status == status)
        if ward:
            from app.models.user import Ward
            filters.append(IssueCluster.ward_id.in_(
                select(Ward.id).where(Ward.ward_number == ward)
            ))
        
        if filters:
            query = query.where(and_(*filters))
        
        query = query.distinct().order_by(IssueCluster.risk_score.desc(), IssueCluster.created_at.desc())
        
        return list(self.db.execute(query).scalars())
    
    def add_complaint_to_issue(self, issue_complaint: IssueComplaint):
        """Add complaint to issue cluster"""
        self.db.add(issue_complaint)
        self.db.commit()
    
    def create_root_cause(self, root_cause: RootCause) -> RootCause:
        """Create root cause"""
        self.db.add(root_cause)
        self.db.commit()
        self.db.refresh(root_cause)
        return root_cause
    
    def create_recommendation(self, recommendation: Recommendation) -> Recommendation:
        """Create recommendation"""
        self.db.add(recommendation)
        self.db.commit()
        self.db.refresh(recommendation)
        return recommendation
    
    def delete_all_issues(self):
        """Delete all issues (for rebuild)"""
        self.db.query(IssueCluster).delete()
        self.db.commit()
    
    def get_open_issues(self) -> list[IssueCluster]:
        """Get all open issues"""
        return list(self.db.execute(
            select(IssueCluster).where(IssueCluster.status == "open")
        ).scalars())
