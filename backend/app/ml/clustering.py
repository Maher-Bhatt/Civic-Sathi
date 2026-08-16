"""Issue clustering logic"""

from datetime import datetime, timezone
from collections import defaultdict
from uuid import UUID
from typing import Any

from app.core.config import settings


class ComplaintCluster:
    """Represents a cluster of similar complaints"""
    
    def __init__(self):
        self.complaint_ids: list[UUID] = []
        self.category: str = ""
        self.ward_id: UUID | None = None
        self.ward_number: int | None = None
        self.keywords: list[str] = []
        self.created_ats: list[datetime] = []
        self.severities: list[int] = []
        self.locations: list[tuple[float, float]] = []
    
    def add_complaint(
        self,
        complaint_id: UUID,
        category: str,
        ward_id: UUID | None,
        ward_number: int | None,
        keywords: list[str],
        created_at: datetime,
        severity: int,
        lat: float | None,
        lng: float | None
    ):
        """Add a complaint to the cluster"""
        self.complaint_ids.append(complaint_id)
        
        if not self.category:
            self.category = category
        
        if not self.ward_id and ward_id:
            self.ward_id = ward_id
            self.ward_number = ward_number
        
        self.keywords.extend(keywords)
        self.created_ats.append(created_at)
        self.severities.append(severity)
        
        if lat is not None and lng is not None:
            self.locations.append((lat, lng))
    
    def size(self) -> int:
        """Get cluster size"""
        return len(self.complaint_ids)
    
    def is_systemic(self) -> bool:
        """Check if cluster meets systemic threshold"""
        return self.size() >= settings.min_cluster_size
    
    def get_centroid(self) -> tuple[float, float] | None:
        """Calculate geographic centroid"""
        if not self.locations:
            return None
        
        avg_lat = sum(loc[0] for loc in self.locations) / len(self.locations)
        avg_lng = sum(loc[1] for loc in self.locations) / len(self.locations)
        
        return (avg_lat, avg_lng)
    
    def get_top_keywords(self, n: int = 10) -> list[str]:
        """Get most frequent keywords"""
        keyword_counts = defaultdict(int)
        for kw in self.keywords:
            keyword_counts[kw] += 1
        
        sorted_keywords = sorted(
            keyword_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [kw for kw, _ in sorted_keywords[:n]]
    
    def get_time_range(self) -> tuple[datetime, datetime]:
        """Get first and last seen timestamps"""
        if not self.created_ats:
            now = datetime.now(timezone.utc)
            return now, now
        
        return min(self.created_ats), max(self.created_ats)
    
    def get_avg_severity(self) -> float:
        """Get average severity score"""
        if not self.severities:
            return 0.0
        return sum(self.severities) / len(self.severities)


def group_complaints_by_similarity(
    complaints_data: list[dict[str, Any]],
    similarity_threshold: float | None = None
) -> list[ComplaintCluster]:
    """
    Group complaints into clusters based on similarity, category, and ward.
    
    Args:
        complaints_data: List of complaint dictionaries with similarity info
        similarity_threshold: Minimum similarity threshold
        
    Returns:
        List of complaint clusters
    """
    if similarity_threshold is None:
        similarity_threshold = settings.similarity_threshold
    
    # Group by category and ward first
    groups: dict[tuple[str, int | None], ComplaintCluster] = {}
    
    for complaint in complaints_data:
        key = (complaint['category'], complaint.get('ward_number'))
        
        if key not in groups:
            groups[key] = ComplaintCluster()
        
        groups[key].add_complaint(
            complaint_id=complaint['id'],
            category=complaint['category'],
            ward_id=complaint.get('ward_id'),
            ward_number=complaint.get('ward_number'),
            keywords=complaint.get('keywords', []),
            created_at=complaint['created_at'],
            severity=complaint.get('severity_score', 0),
            lat=complaint.get('lat'),
            lng=complaint.get('lng')
        )
    
    # Filter to systemic clusters only
    systemic_clusters = [
        cluster for cluster in groups.values()
        if cluster.is_systemic()
    ]
    
    return systemic_clusters


def generate_cluster_title(cluster: ComplaintCluster) -> str:
    """
    Generate a descriptive title for an issue cluster.
    
    Args:
        cluster: Complaint cluster
        
    Returns:
        Generated title
    """
    category = cluster.category.replace('_', ' ').title()
    ward_info = f"Ward {cluster.ward_number}" if cluster.ward_number else "Multiple Wards"
    
    # Get top keywords for context
    top_keywords = cluster.get_top_keywords(3)
    keyword_str = ', '.join(top_keywords) if top_keywords else ""
    
    if keyword_str:
        return f"Recurring {category} Issues in {ward_info}: {keyword_str}"
    else:
        return f"Recurring {category} Issues in {ward_info}"


def generate_cluster_summary(cluster: ComplaintCluster) -> str:
    """
    Generate a summary description for an issue cluster.
    
    Args:
        cluster: Complaint cluster
        
    Returns:
        Generated summary
    """
    count = cluster.size()
    category = cluster.category.replace('_', ' ')
    ward_info = f"Ward {cluster.ward_number}" if cluster.ward_number else "multiple wards"
    
    first_seen, last_seen = cluster.get_time_range()
    days_span = (last_seen - first_seen).days + 1
    
    top_keywords = cluster.get_top_keywords(5)
    keyword_str = ', '.join(top_keywords) if top_keywords else "various issues"
    
    summary = (
        f"Pattern detected: {count} related {category} complaints in {ward_info} "
        f"over {days_span} days. Common themes include {keyword_str}. "
        f"This clustering suggests a systemic issue requiring coordinated response."
    )
    
    return summary
