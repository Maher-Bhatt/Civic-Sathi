"""Pydantic schemas for CivicCase and multi-department routing"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class DepartmentRoutingItem(BaseModel):
    department_code: str = Field(..., description="Machine slug, e.g. 'water', 'roads', 'drainage'")
    department_name: str = Field(..., description="Display name, e.g. 'Water Supply & Sewerage'")
    external_system_key: str | None = Field(default=None, description="External system connector key")
    action_required: str = Field(..., description="Action to be executed by this department")
    sla_hours: int = Field(default=24, ge=1, le=720)
    sequence_order: int = Field(default=1, ge=1, le=10)
    depends_on: str | None = Field(default=None, description="department_code this action depends on")
    dependency_note: str | None = Field(default=None, description="Reason for blocking dependency")
    status: str = Field(default="WAITING", description="Initial status for child ticket")


class AnalyzeCaseRequest(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    description: str = Field(..., min_length=5, max_length=4000)
    latitude: float | None = None
    longitude: float | None = None
    image_url: str | None = None
    city: str | None = None


class AnalyzeCaseResponse(BaseModel):
    title: str
    summary: str
    severity: str = Field(default="MEDIUM", description="LOW | MEDIUM | HIGH | CRITICAL")
    priority: str = Field(default="P3", description="P1 | P2 | P3 | P4")
    root_cause: str
    preventive_warning: str
    departments: list[DepartmentRoutingItem]
    estimated_total_sla_hours: int = 48
    source: str = "ai-engine"


class CaseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10, max_length=4000)
    latitude: float | None = None
    longitude: float | None = None
    city: str | None = None
    ward: str | None = None
    address_text: str | None = None
    photo_url: str | None = None
    pre_analyzed_routing: AnalyzeCaseResponse | None = None


class CaseDepartmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    case_id: UUID
    department_id: UUID | None = None
    department_name: str
    department_code: str
    external_system_key: str | None = None
    external_ticket_id: str | None = None
    sequence_order: int
    dependency_case_dept_id: UUID | None = None
    dependency_note: str | None = None
    status: str
    action_required: str | None = None
    sla_hours: int
    sla_deadline: datetime | None = None
    assigned_officer_name: str | None = None
    assigned_officer_phone: str | None = None
    assigned_at: datetime | None = None
    completed_at: datetime | None = None
    completion_evidence_url: str | None = None
    completion_notes: str | None = None
    is_blocked: bool = False


class TimelineEvent(BaseModel):
    id: str
    title: str
    description: str
    timestamp: str | datetime
    status: str  # completed, in-progress, blocked, pending
    actor: str | None = None
    department: str | None = None


class CivicCaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    case_number: str
    title: str
    description: str
    latitude: float | None = None
    longitude: float | None = None
    address_text: str | None = None
    city_name: str | None = None
    ward_name: str | None = None
    severity: str
    priority: str
    root_cause: str | None = None
    preventive_warning: str | None = None
    action_plan_summary: str | None = None
    status: str
    estimated_total_sla_hours: int
    photo_url: str | None = None
    created_at: datetime
    updated_at: datetime
    departments: list[CaseDepartmentOut] = []
    timeline: list[TimelineEvent] = []
