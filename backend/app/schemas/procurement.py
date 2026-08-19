from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, List

from app.models.procurement import TenderStatus, BidStatus, WorkOrderStatus, RegistrationStatus

class TenderBase(BaseModel):
    title: str
    description: str
    scope_of_work: Optional[str] = None
    estimated_budget: float

class TenderCreate(TenderBase):
    city_id: UUID
    department_id: UUID
    civic_issue_id: Optional[UUID] = None

class TenderResponse(TenderBase):
    id: UUID
    city_id: UUID
    department_id: UUID
    civic_issue_id: Optional[UUID]
    status: TenderStatus
    published_at: Optional[datetime]
    closed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class BidCreate(BaseModel):
    quoted_amount: float
    technical_proposal: Optional[str] = None

class BidResponse(BaseModel):
    id: UUID
    tender_id: UUID
    contractor_id: UUID
    quoted_amount: float
    technical_proposal: Optional[str]
    status: BidStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class WorkOrderResponse(BaseModel):
    id: UUID
    tender_id: UUID
    bid_id: UUID
    contractor_id: UUID
    award_value: float
    status: WorkOrderStatus
    target_completion_date: Optional[datetime]
    created_at: datetime

    # ── Enriched fields joined from Tender ──────────────────────────────
    title: Optional[str] = None
    description: Optional[str] = None
    estimated_budget: Optional[float] = None
    city_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    published_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    tender_status: Optional[str] = None  # TenderStatus of the parent tender

    # ── Enriched fields joined from Contractor ──────────────────────────
    contractor_name: Optional[str] = None  # Contractor.company_name
    contractor_email: Optional[str] = None

    # ── Progress fields from WorkOrder model ────────────────────────────
    planned_progress_pct: Optional[float] = None
    reported_progress_pct: Optional[float] = None
    verified_progress_pct: Optional[float] = None
    risk_level: Optional[str] = None

    class Config:
        from_attributes = True

class FieldEvidenceCreate(BaseModel):
    photo_url: str
    description: Optional[str] = None

class FieldEvidenceResponse(BaseModel):
    id: UUID
    work_order_id: UUID
    photo_url: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class InspectionCreate(BaseModel):
    result: str # "PASS", "REWORK", "FAIL"
    feedback: Optional[str] = None

class InspectionResponse(BaseModel):
    id: UUID
    work_order_id: UUID
    inspector_id: UUID
    result: str
    feedback: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class ContractorReviewCreate(BaseModel):
    work_order_id: Optional[UUID] = None
    rating: float = Field(..., ge=1.0, le=5.0)
    comment: Optional[str] = None
    category: Optional[str] = None
    evidence_urls: Optional[List[str]] = None


class ContractorReviewResponse(BaseModel):
    id: UUID
    contractor_id: UUID
    work_order_id: Optional[UUID] = None
    author_type: str
    author_name: str
    rating: float
    comment: Optional[str] = None
    category: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ContractorProfileResponse(BaseModel):
    id: UUID
    company_name: str
    contact_person: str
    email: str
    phone: str
    public_rating: Optional[float] = None
    ai_rating: Optional[float] = None
    officer_rating: Optional[float] = None
    overall_rating: Optional[float] = None
    total_reviews_count: int = 0
    ai_insights: Optional[List[str]] = None
    
    class Config:
        from_attributes = True
