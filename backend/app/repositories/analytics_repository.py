"""Analytics repository"""

from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.models.issue import IssueCluster
from app.models.user import Ward, Department


class AnalyticsRepository:
    """Repository for analytics data"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_summary_stats(self, days: int = 30) -> dict:
        """Get summary statistics"""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        
        total_complaints = self.db.execute(
            select(func.count(Complaint.id))
        ).scalar() or 0
        
        total_issues = self.db.execute(
            select(func.count(IssueCluster.id))
        ).scalar() or 0
        
        unresolved = self.db.execute(
            select(func.count(Complaint.id))
            .where(Complaint.status.in_(["received", "in_review", "assigned"]))
        ).scalar() or 0
        
        critical_issues = self.db.execute(
            select(func.count(IssueCluster.id))
            .where(IssueCluster.risk_level == "critical")
        ).scalar() or 0
        
        return {
            "total_complaints": total_complaints,
            "total_issues": total_issues,
            "unresolved_complaints": unresolved,
            "critical_issues": critical_issues,
        }
    
    def get_status_distribution(self) -> dict:
        """Get complaint status distribution"""
        results = self.db.execute(
            select(Complaint.status, func.count(Complaint.id))
            .group_by(Complaint.status)
        ).all()
        
        return {status: count for status, count in results}
    
    def get_risk_distribution(self) -> dict:
        """Get issue risk distribution"""
        results = self.db.execute(
            select(IssueCluster.risk_level, func.count(IssueCluster.id))
            .group_by(IssueCluster.risk_level)
        ).all()
        
        return {risk: count for risk, count in results}
    
    def get_department_distribution(self) -> list[dict]:
        """Get complaint distribution by department"""
        results = self.db.execute(
            select(Department.name, func.count(Complaint.id))
            .join(Complaint, Complaint.department_id == Department.id)
            .group_by(Department.name)
            .order_by(func.count(Complaint.id).desc())
        ).all()
        
        return [{"name": name, "count": count} for name, count in results]
    
    def get_daily_trends(self, days: int = 7) -> list[dict]:
        """Get daily complaint trends"""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        
        results = self.db.execute(
            select(
                func.date_trunc('day', Complaint.created_at).label('date'),
                func.count(Complaint.id).label('count')
            )
            .where(Complaint.created_at >= cutoff)
            .group_by('date')
            .order_by('date')
        ).all()
        
        return [
            {"date": date.isoformat(), "count": count}
            for date, count in results
        ]
    
    def get_ward_data(self) -> list[tuple]:
        """Get ward-level data for map"""
        results = self.db.execute(
            select(
                Ward.ward_number,
                Ward.name,
                Ward.boundary_geojson,
                func.count(Complaint.id).label('complaint_count')
            )
            .outerjoin(Complaint, Complaint.ward_id == Ward.id)
            .group_by(Ward.id, Ward.ward_number, Ward.name, Ward.boundary_geojson)
        ).all()
        
        return results
    
    def get_issue_markers(self) -> list[IssueCluster]:
        """Get issue clusters for map markers"""
        return list(self.db.execute(
            select(IssueCluster)
            .where(IssueCluster.status == "open")
        ).scalars())
