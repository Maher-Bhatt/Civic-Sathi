"""Complaint schemas"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Any

from app.schemas.common import (
    ComplaintStatus,
    ComplaintCategory,
    Priority,
    EntityResult,
)


class SubmittedBy(BaseModel):
    """Citizen submitter information"""
    name: str = Field(..., min_length=2, max_length=100)
    phone: str | None = Field(None, max_length=20)


class ComplaintCreate(BaseModel):
    """Schema for creating a new complaint"""
    title: str | None = Field(None, min_length=2, max_length=120)
    description: str = Field(..., min_length=1, max_length=2500)
    category: str | None = None
    category_hint: str | None = None
    severity: str | None = None
    address_text: str | None = Field(None, max_length=500)

    ward_number: int | None = Field(None, ge=1, le=500)
    lat: float | None = Field(None, ge=-90, le=90)
    lng: float | None = Field(None, ge=-180, le=180)
    city_id: str | None = None
    city: str | None = None
    photo: str | None = None
    language: str | None = Field(None, max_length=20)
    ai_interpreted_text: str | None = Field(None, max_length=1000)
    ai_suggested_action: str | None = Field(None, max_length=1000)
    submitted_by: SubmittedBy | None = None
    submitted_by_name: str | None = None
    submitted_by_phone: str | None = None
    
    @field_validator("description")
    @classmethod
    def trim_whitespace(cls, v: str) -> str:
        """Trim whitespace from text fields"""
        return v.strip()
    
    @model_validator(mode="after")
    def validate_title_and_location(self):
        """Auto-populate title if missing and ensure description exists"""
        if not self.title:
            self.title = self.description[:50] + ("..." if len(self.description) > 50 else "")
        return self


class ComplaintAnalysisResponse(BaseModel):
    """AI/ML analysis results for a complaint"""
    language: str | None = None
    keywords: list[str] = []
    entities: list[EntityResult] = []
    similar_count: int = 0
    possible_duplicate: bool = False
    confidence_score: float | None = None
    interpreted_text: str | None = None
    suggested_action: str | None = None


class RelatedComplaint(BaseModel):
    """A complaint member of the current complaint's canonical problem group."""
    id: UUID
    public_id: str
    title: str
    category: str
    similarity_score: float | None = None
    created_at: datetime


class ProblemGroupResponse(BaseModel):
    """Authoritative canonical group membership returned with a complaint."""
    id: UUID
    related_count: int
    members: list[RelatedComplaint] = []
    matching_state: str = "complete"


class ComplaintLinks(BaseModel):
    """HATEOAS links for complaint resource"""
    self: str
    similar: str


class ComplaintTimelineEvent(BaseModel):
    """Persisted operational event surfaced in the complaint timeline."""
    label: str
    at: datetime
    actor: str | None = None
    reason: str | None = None


class ComplaintResponse(BaseModel):
    """Response schema for a complaint with privacy protection"""
    id: UUID
    public_id: str
    title: str
    description: str | None = None
    status: str
    assigned_officer_id: UUID | None = None
    assigned_officer_name: str | None = None
    assigned_at: datetime | None = None
    assignment_notes: str | None = None
    rejection_reason: str | None = None
    rejected_by_name: str | None = None
    rejected_at: datetime | None = None
    category: str
    department: str
    city_id: UUID
    city_name: str
    priority: str
    severity_score: int
    risk_score: int
    ward_number: int | None = None
    lat: float | None = None
    lng: float | None = None
    address_text: str | None = None
    submitted_by_name: str | None = None
    submitted_by_phone: str | None = None
    privacy_status: str = "Protected (Anti-Retaliation)"
    created_at: datetime
    updated_at: datetime
    timeline: list[ComplaintTimelineEvent] = []
    analysis: ComplaintAnalysisResponse | None = None
    problem_group_id: UUID | None = None
    related_count: int = 0
    related_complaints: list[RelatedComplaint] = []
    matching_state: str = "complete"
    links: ComplaintLinks | None = None
    
    class Config:
        from_attributes = True


class ComplaintListItem(BaseModel):
    """Privacy-safe complaint list item with operational fields."""
    id: UUID
    public_id: str
    title: str
    description: str | None = None
    status: str
    assigned_officer_id: UUID | None = None
    assigned_officer_name: str | None = None
    assigned_at: datetime | None = None
    assignment_notes: str | None = None
    rejection_reason: str | None = None
    rejected_by_name: str | None = None
    rejected_at: datetime | None = None
    category: str
    department: str | None = None
    city_id: UUID
    city_name: str
    priority: str
    severity_score: int = 0
    risk_score: int = 0
    ward_number: int | None = None
    lat: float | None = None
    lng: float | None = None
    address_text: str | None = None
    created_at: datetime
    updated_at: datetime | None = None
    language: str | None = None
    interpreted_text: str | None = None
    suggested_action: str | None = None

    class Config:
        from_attributes = True


class ComplaintStatusUpdate(BaseModel):
    """Schema for updating complaint status"""
    status: ComplaintStatus
    notes: str | None = Field(None, max_length=500)


class SimilarComplaintItem(BaseModel):
    """Similar complaint result"""
    id: UUID
    public_id: str
    title: str
    similarity_score: float
    distance_meters: float | None = None
    created_at: datetime


class SimilarComplaintsResponse(BaseModel):
    """Response for similar complaints endpoint"""
    complaint_id: UUID
    embedding_model: str
    problem_group_id: UUID | None = None
    related_count: int = 0
    matching_state: str = "complete"
    items: list[SimilarComplaintItem]
