"""Analytics schemas"""

from pydantic import BaseModel
from typing import Any


class StatusDistribution(BaseModel):
    """Status distribution data"""
    received: int = 0
    in_review: int = 0
    assigned: int = 0
    resolved: int = 0
    rejected: int = 0


class RiskDistribution(BaseModel):
    """Risk level distribution"""
    low: int = 0
    medium: int = 0
    high: int = 0
    critical: int = 0


class DepartmentDistribution(BaseModel):
    """Department distribution"""
    name: str
    count: int


class DailyTrend(BaseModel):
    """Daily complaint trend"""
    date: str
    count: int


class CategoryDistribution(BaseModel):
    """Complaint distribution by normalized category."""
    name: str
    count: int


class DashboardSummary(BaseModel):
    """Dashboard summary response"""
    total_complaints: int
    total_issues: int
    unresolved_complaints: int
    critical_issues: int
    status_distribution: StatusDistribution
    risk_distribution: RiskDistribution
    department_distribution: list[DepartmentDistribution]
    category_distribution: list[CategoryDistribution] = []
    daily_trends: list[DailyTrend]


class WardPolygon(BaseModel):
    """Ward polygon for map"""
    ward_number: int
    name: str
    risk_level: str
    complaint_count: int
    geojson: dict | None


class IssueMarker(BaseModel):
    """Issue marker for map"""
    issue_id: str
    title: str
    lat: float
    lng: float
    risk_level: str
    risk_score: int


class MapDataResponse(BaseModel):
    """Map data response"""
    ward_polygons: list[WardPolygon]
    issue_markers: list[IssueMarker]


class PublicLocalityActivity(BaseModel):
    """Locality activity for public civic map"""
    id: str
    name: str
    city: str
    total: int
    last7: int = 0
    trend_pct: int = 0
    health: str
    top_issue: str
    risk: int
    resolved: int = 0


class PublicMapResponse(BaseModel):
    """Public civic map aggregated statistics response"""
    city: str
    time: str
    total_reports: int
    last7_days: int
    localities_mapped: int
    health_distribution: dict[str, int]
    issue_breakdown: dict[str, int]
    daily_trends: list[DailyTrend]
    areas: list[dict[str, Any]]
