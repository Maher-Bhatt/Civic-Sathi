"""Analytics repository"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy import select, func, and_, case
from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.models.issue import IssueCluster
from app.models.user import Ward, Department


class AnalyticsRepository:
    """Repository for analytics data, all queries optionally scoped to a city."""

    def __init__(self, db: Session):
        self.db = db

    # ── helpers ──────────────────────────────────────────────────────────────

    def _complaint_city_filter(self, city_id: Optional[str]):
        """Return a filter clause for city, or True (no-op) if city_id is None."""
        if city_id:
            return Complaint.city_id == city_id
        return True  # SQLAlchemy ignores literal True

    def _issue_city_filter(self, city_id: Optional[str]):
        if city_id:
            return IssueCluster.city_id == city_id
        return True

    # ── summary stats ────────────────────────────────────────────────────────

    def get_summary_stats(self, days: int = 30, city_id: Optional[str] = None) -> dict:
        """Get summary statistics, optionally scoped to a city."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        cf = self._complaint_city_filter(city_id)
        isf = self._issue_city_filter(city_id)

        total_complaints = self.db.execute(
            select(func.count(Complaint.id)).where(cf)
        ).scalar() or 0

        total_issues = self.db.execute(
            select(func.count(IssueCluster.id)).where(isf)
        ).scalar() or 0

        unresolved = self.db.execute(
            select(func.count(Complaint.id))
            .where(and_(cf, Complaint.status.notin_(["resolved", "rejected", "closed"])))
        ).scalar() or 0

        critical_issues = self.db.execute(
            select(func.count(Complaint.id))
            .where(and_(cf, Complaint.risk_score >= 80))
        ).scalar() or 0

        return {
            "total_complaints": total_complaints,
            "total_issues": total_issues,
            "unresolved_complaints": unresolved,
            "critical_issues": critical_issues,
        }

    def get_status_distribution(self, city_id: Optional[str] = None) -> dict:
        """Get complaint status distribution, optionally scoped to a city."""
        cf = self._complaint_city_filter(city_id)
        results = self.db.execute(
            select(Complaint.status, func.count(Complaint.id))
            .where(cf)
            .group_by(Complaint.status)
        ).all()
        return {status: count for status, count in results}

    def get_risk_distribution(self, city_id: Optional[str] = None) -> dict:
        """Get complaint-backed risk distribution, optionally scoped to a city.

        Historical rows frequently have no IssueCluster, so aggregating only issue
        rows incorrectly produced four zeros while complaints were visible.
        Prefer stored risk/severity scores, then fall back to the complaint
        priority assigned during ingestion.
        """
        cf = self._complaint_city_filter(city_id)
        score = case(
            (Complaint.risk_score > 0, Complaint.risk_score),
            (Complaint.severity_score > 0, Complaint.severity_score),
            (Complaint.priority.ilike("critical"), 90),
            (Complaint.priority.ilike("high"), 70),
            (Complaint.priority.ilike("medium"), 45),
            else_=20,
        )
        level = case(
            (score >= 80, "critical"),
            (score >= 60, "high"),
            (score >= 35, "medium"),
            else_="low",
        )
        results = self.db.execute(
            select(level.label("risk_level"), func.count(Complaint.id))
            .where(cf)
            .group_by(level)
        ).all()
        return {risk: count for risk, count in results}

    def get_department_distribution(self, city_id: Optional[str] = None) -> list[dict]:
        """Get complaint distribution by department, optionally scoped to a city."""
        cf = self._complaint_city_filter(city_id)
        results = self.db.execute(
            select(Department.name, func.count(Complaint.id))
            .join(Complaint, Complaint.department_id == Department.id)
            .where(cf)
            .group_by(Department.name)
            .order_by(func.count(Complaint.id).desc())
        ).all()
        return [{"name": name, "count": count} for name, count in results]

    def get_category_distribution(self, city_id: Optional[str] = None) -> list[dict]:
        """Get complaint distribution by category, optionally scoped to a city."""
        cf = self._complaint_city_filter(city_id)
        results = self.db.execute(
            select(Complaint.category, func.count(Complaint.id))
            .where(cf)
            .group_by(Complaint.category)
            .order_by(func.count(Complaint.id).desc())
        ).all()
        return [{"name": category or "other", "count": count} for category, count in results]

    def get_daily_trends(self, days: int = 7, city_id: Optional[str] = None) -> list[dict]:
        """Get daily complaint trends, optionally scoped to a city."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        cf = self._complaint_city_filter(city_id)
        results = self.db.execute(
            select(
                func.date_trunc("day", Complaint.created_at).label("date"),
                func.count(Complaint.id).label("count"),
            )
            .where(and_(cf, Complaint.created_at >= cutoff))
            .group_by("date")
            .order_by("date")
        ).all()
        return [{"date": date.isoformat(), "count": count} for date, count in results]

    def get_ward_data(self, city_id: Optional[str] = None) -> list[tuple]:
        """Get ward-level data for map."""
        # Ward model has no city_id — filtering via complaints that match the city
        results = self.db.execute(
            select(
                Ward.ward_number,
                Ward.name,
                Ward.boundary_geojson,
                func.count(Complaint.id).label("complaint_count"),
            )
            .outerjoin(Complaint, Complaint.ward_id == Ward.id)
            .where(self._complaint_city_filter(city_id) if city_id else True)
            .group_by(Ward.id, Ward.ward_number, Ward.name, Ward.boundary_geojson)
        ).all()
        return results

    def get_issue_markers(self, city_id: Optional[str] = None) -> list[IssueCluster]:
        """Get issue clusters for map markers."""
        isf = self._issue_city_filter(city_id)
        return list(
            self.db.execute(
                select(IssueCluster).where(and_(isf, IssueCluster.status == "open"))
            ).scalars()
        )
