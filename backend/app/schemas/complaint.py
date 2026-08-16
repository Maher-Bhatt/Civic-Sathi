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
    title: str = Field(..., min_length=5, max_length=120)
    description: str = Field(..., min_length=20, max_length=2500)
    category_hint: str | None = None
    address_text: str | None = Field(None, max_length=500)
    ward_number: int | None = Field(None, ge=1, le=100)
    lat: float | None = Field(None, ge=-90, le=90)
    lng: float | None = Field(None, ge=-180, le=180)
    submitted_by: SubmittedBy | None = None
    
    @field_validator("title", "description")
    @classmethod
    def trim_whitespace(cls, v: str) -> str:
        """Trim whitespace from text fields"""
        return v.strip()
    
    @model_validator(mode="after")
    def validate_location(self):
        """Ensure either ward_number or lat/lng is provided"""
        if not self.ward_number and not (self.lat and self.lng):
            raise ValueError("Either ward_number or both lat and lng must be provided")
        return self


class ComplaintAnalysisResponse(BaseModel):
    """AI/ML analysis results for a complaint"""
    language: str | None = None
    keywords: list[str] = []
    entities: list[EntityResult] = []
    similar_count: int = 0
    possible_duplicate: bool = False
    confidence_score: float | None = None


class ComplaintLinks(BaseModel):
    """HATEOAS links for complaint resource"""
    self: str
    similar: str


class ComplaintResponse(BaseModel):
    """Response schema for a complaint"""
    id: UUID
    public_id: str
    title: str
    description: str | None = None
    status: ComplaintStatus
    category: ComplaintCategory
    department: str
    priority: Priority
    severity_score: int
    risk_score: int
    ward_number: int | None = None
    lat: float | None = None
    lng: float | None = None
    address_text: str | None = None
    created_at: datetime
    updated_at: datetime
    analysis: ComplaintAnalysisResponse | None = None
    links: ComplaintLinks | None = None
    
    class Config:
        from_attributes = True


class ComplaintListItem(BaseModel):
    """Simplified complaint for list views"""
    id: UUID
    public_id: str
    title: str
    status: ComplaintStatus
    category: ComplaintCategory
    priority: Priority
    risk_score: int
    ward_number: int | None
    created_at: datetime
    
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
    items: list[SimilarComplaintItem]
