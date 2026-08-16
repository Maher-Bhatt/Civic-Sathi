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
    field_evidence_id: UUID
    inspector_user_id: UUID
    result: str
    feedback: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
