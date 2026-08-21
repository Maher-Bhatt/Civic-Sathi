"""Issue cluster schemas"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

from app.schemas.common import ComplaintCategory, RiskLevel, RecommendationActionType, Coordinates


class RootCauseResponse(BaseModel):
    """Root cause analysis response"""
    id: UUID
    cause_type: str
    explanation: str
    evidence: dict | None = None
    confidence_score: float
    
    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """Recommendation response"""
    id: UUID
    title: str
    action_type: RecommendationActionType
    priority: str
    effort_level: str | None = None
    expected_impact: str | None = None
    steps: list[str] = []
    
    class Config:
        from_attributes = True


class IssueListItem(BaseModel):
    """Issue cluster for list views"""
    id: UUID
    title: str
    category: ComplaintCategory
    department: str
    department_id: UUID
    ward_number: int | None
    complaint_count: int
    risk_level: RiskLevel
    risk_score: int
    root_cause_summary: str | None = None
    top_recommendation: str | None = None
    centroid: Coordinates | None = None
    first_seen_at: datetime
    last_seen_at: datetime
    
    class Config:
        from_attributes = True


class IssueDetailResponse(BaseModel):
    """Detailed issue cluster response"""
    id: UUID
    title: str
    summary: str | None
    category: ComplaintCategory
    department: str
    department_id: UUID
    ward_number: int | None
    status: str
    risk_level: RiskLevel
    risk_score: int
    complaint_count: int
    centroid: Coordinates | None = None
    first_seen_at: datetime
    last_seen_at: datetime
    root_causes: list[RootCauseResponse] = []
    recommendations: list[RecommendationResponse] = []
    
    class Config:
        from_attributes = True


class RebuildIssuesResponse(BaseModel):
    """Response for issue rebuild endpoint"""
    success: bool
    issues_created: int
    issues_updated: int
    complaints_processed: int
    duration_ms: int
