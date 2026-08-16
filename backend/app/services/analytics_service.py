"""Analytics service for dashboard data"""

from sqlalchemy.orm import Session

from app.repositories.analytics_repository import AnalyticsRepository
from app.schemas.analytics import (
    DashboardSummary,
    StatusDistribution,
    RiskDistribution,
    DepartmentDistribution,
    DailyTrend,
    MapDataResponse,
    WardPolygon,
    IssueMarker,
)
from app.ml.risk import get_risk_level


class AnalyticsService:
    """Service for analytics and dashboard data"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = AnalyticsRepository(db)
    
    def get_dashboard_summary(self, days: int = 30) -> DashboardSummary:
        """
        Get dashboard summary statistics.
        
        Args:
            days: Time window in days
            
        Returns:
            Dashboard summary data
        """
        # Get basic stats
        stats = self.repo.get_summary_stats(days)
        
        # Get distributions
        status_dist = self.repo.get_status_distribution()
        risk_dist = self.repo.get_risk_distribution()
        dept_dist = self.repo.get_department_distribution()
        trends = self.repo.get_daily_trends(days=7)
        
        # Build status distribution
        status_distribution = StatusDistribution(
            received=status_dist.get('received', 0),
            in_review=status_dist.get('in_review', 0),
            assigned=status_dist.get('assigned', 0),
            resolved=status_dist.get('resolved', 0),
            rejected=status_dist.get('rejected', 0),
        )
        
        # Build risk distribution
        risk_distribution = RiskDistribution(
            low=risk_dist.get('low', 0),
            medium=risk_dist.get('medium', 0),
            high=risk_dist.get('high', 0),
            critical=risk_dist.get('critical', 0),
        )
        
        # Build department distribution
        department_distribution = [
            DepartmentDistribution(name=dept['name'], count=dept['count'])
            for dept in dept_dist
        ]
        
        # Build daily trends
        daily_trends = [
            DailyTrend(date=trend['date'], count=trend['count'])
            for trend in trends
        ]
        
        return DashboardSummary(
            total_complaints=stats['total_complaints'],
            total_issues=stats['total_issues'],
            unresolved_complaints=stats['unresolved_complaints'],
            critical_issues=stats['critical_issues'],
            status_distribution=status_distribution,
            risk_distribution=risk_distribution,
            department_distribution=department_distribution,
            daily_trends=daily_trends,
        )
    
    def get_map_data(self, days: int = 30) -> MapDataResponse:
        """
        Get map data for Leaflet visualization.
        
        Args:
            days: Time window in days
            
        Returns:
            Map data with ward polygons and issue markers
        """
        # Get ward data
        ward_data = self.repo.get_ward_data()
        
        # Build ward polygons
        ward_polygons = []
        for ward_number, name, geojson, complaint_count in ward_data:
            # Calculate risk level based on complaint count
            if complaint_count >= 20:
                risk_level = 'high'
            elif complaint_count >= 10:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            ward_polygons.append(WardPolygon(
                ward_number=ward_number,
                name=name,
                risk_level=risk_level,
                complaint_count=complaint_count,
                geojson=geojson,
            ))
        
        # Get issue markers
        issues = self.repo.get_issue_markers()
        
        issue_markers = []
        for issue in issues:
            if issue.centroid_lat and issue.centroid_lng:
                issue_markers.append(IssueMarker(
                    issue_id=str(issue.id),
                    title=issue.title,
                    lat=issue.centroid_lat,
                    lng=issue.centroid_lng,
                    risk_level=issue.risk_level,
                    risk_score=issue.risk_score,
                ))
        
        return MapDataResponse(
            ward_polygons=ward_polygons,
            issue_markers=issue_markers,
        )

    def detect_hotspots(self) -> dict:
        """
        Rank IssueCluster objects based on risk_score and complaint_count,
        updating status to 'Emerging' or 'Critical'.
        """
        from app.models.issue import IssueCluster
        
        # Get all open/active issues
        issues = self.db.query(IssueCluster).filter(
            IssueCluster.status.notin_(['resolved', 'closed'])
        ).all()
        
        updated_count = 0
        for issue in issues:
            # Simple heuristic
            score = (issue.complaint_count * 10) + issue.risk_score
            old_status = issue.status
            
            if score >= 100:
                issue.status = 'critical'
                issue.risk_level = 'critical'
            elif score >= 50:
                issue.status = 'emerging'
                issue.risk_level = 'high'
                
            if old_status != issue.status:
                updated_count += 1
                
        self.db.commit()
        return {"processed": len(issues), "updated": updated_count}
