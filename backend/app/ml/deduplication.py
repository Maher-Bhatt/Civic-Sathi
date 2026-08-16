"""Deduplication and candidate retrieval logic"""

from datetime import datetime, timedelta, timezone
from uuid import UUID
from sqlalchemy import select, and_, func
from sqlalchemy.orm import Session

from app.models.issue import IssueCluster
from app.models.complaint import Complaint
from app.schemas.common import ComplaintCategory


def haversine_distance(lat1, lng1, lat2, lng2):
    """SQLAlchemy expression for Haversine distance in meters"""
    # 6371000 is Earth's radius in meters
    return func.acos(
        func.sin(func.radians(lat1)) * func.sin(func.radians(lat2)) +
        func.cos(func.radians(lat1)) * func.cos(func.radians(lat2)) *
        func.cos(func.radians(lng1) - func.radians(lng2))
    ) * 6371000


def get_candidate_issues(
    db: Session,
    city_id: UUID,
    category: str,
    lat: float | None = None,
    lng: float | None = None,
    time_window_days: int = 30,
    radius_meters: float = 500.0,
    limit: int = 20
) -> list[IssueCluster]:
    """
    Stage 1: Fast Candidate Retrieval.
    Finds active civic issues in the same city, category, and within geographic/time windows.
    """
    
    # Base query for ACTIVE or RECENTLY RESOLVED issues in the same city and category
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=time_window_days)
    
    query = select(IssueCluster).where(
        and_(
            IssueCluster.city_id == city_id,
            IssueCluster.category == category,
            IssueCluster.last_seen_at >= cutoff_date,
            IssueCluster.status.in_(["open", "in_progress", "planned"])
        )
    )
    
    # If location is provided, filter by geographic radius
    if lat is not None and lng is not None:
        distance = haversine_distance(
            lat, lng, 
            IssueCluster.centroid_lat, 
            IssueCluster.centroid_lng
        )
        query = query.where(distance <= radius_meters)
        # Order by distance (closest first)
        query = query.order_by(distance.asc())
    else:
        # Fallback to recency
        query = query.order_by(IssueCluster.last_seen_at.desc())
        
    query = query.limit(limit)
    
    return list(db.execute(query).scalars())


def calculate_similarity_score(
    text_sim: float, 
    geo_dist: float | None, 
    time_diff_days: float
) -> float:
    """
    Stage 2: Multi-signal scoring.
    Combines text similarity, geographic distance, and temporal difference.
    Returns score between 0.0 and 1.0.
    """
    # Base text similarity weight
    score = text_sim * 0.5
    
    # Geo weight (0.3)
    if geo_dist is not None:
        # 1.0 at 0m, drops to 0.0 at 500m
        geo_score = max(0.0, 1.0 - (geo_dist / 500.0))
        score += geo_score * 0.3
    else:
        # If no geo data, redistribute weight (make text worth more)
        score += (text_sim * 0.3)
        
    # Time weight (0.2)
    # 1.0 at 0 days, drops to 0.0 at 30 days
    time_score = max(0.0, 1.0 - (time_diff_days / 30.0))
    score += time_score * 0.2
    
    return min(max(score, 0.0), 1.0)
