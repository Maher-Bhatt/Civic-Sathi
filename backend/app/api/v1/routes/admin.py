"""Admin API — full platform management endpoints.

Only accessible to users with role: admin or supervisor.
Covers: user management, contractor approvals, SLA config, platform stats, audit trail.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from typing import Any, List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    get_current_officer, hash_password, verify_password,
    create_access_token, is_super_admin_user,
)
from app.models.user import User
from app.models.procurement import (
    Contractor, ContractorCityRegistration, RegistrationStatus,
    City, Tender, Bid, WorkOrder, WorkOrderStatus,
)
from app.models.complaint import Complaint
from app.models.audit import AuditLog
from app.models.issue import IssueCluster
from app.models.sla import SLARule

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Guards
# ─────────────────────────────────────────────────────────────────────────────

def require_admin(
    current: dict = Depends(get_current_officer),
    db: Session = Depends(get_db),
) -> dict:
    """Only an allowlisted admin identity may call private admin endpoints."""
    user = db.get(User, UUID(current.get("sub", "")))
    if not user or not is_super_admin_user(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Private super-admin access required",
        )
    return current


# ─────────────────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    role: str
    city: Optional[str]
    department: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CreateUserRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(..., description="officer | supervisor | municipality | contractor | citizen")
    city: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None


class UpdateUserRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    city: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8, max_length=100)


class ContractorOut(BaseModel):
    id: str
    company_name: str
    contact_person: str
    email: str
    phone: str
    auth_user_id: Optional[str]
    registrations: List[dict] = []

    class Config:
        from_attributes = True


class ContractorCreateRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    contact_person: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    login_email: Optional[EmailStr] = None
    login_password: Optional[str] = Field(None, min_length=8, max_length=100)


class RegistrationUpdateRequest(BaseModel):
    status: RegistrationStatus
    approved_categories: Optional[List[str]] = None
    registration_class: Optional[str] = None


class PlatformStatsOut(BaseModel):
    total_users: int
    total_citizens: int
    total_officers: int
    total_contractors: int
    total_admins: int
    total_complaints: int
    open_complaints: int
    resolved_complaints: int
    total_issues: int
    open_issues: int
    total_tenders: int
    active_work_orders: int
    total_cities: int


class CommandCenterCityOut(BaseModel):
    id: str
    name: str
    state_code: str
    complaints: int = 0
    open_complaints: int = 0
    resolved_complaints: int = 0
    issues: int = 0
    critical_issues: int = 0
    tenders: int = 0
    published_tenders: int = 0
    work_orders: int = 0
    active_work_orders: int = 0
    contractor_registrations: int = 0
    high_risk_work_orders: int = 0


class CommandCenterPipelineStageOut(BaseModel):
    id: str
    label: str
    count: int = 0
    signal: str = ""
    state: str = "quiet"
    tone: str = "indigo"
    href: str = "/admin/audit-logs"


class CommandCenterCityLaneOut(BaseModel):
    id: str
    name: str
    state_code: str
    health: str = "operational"
    open_complaints: int = 0
    critical_issues: int = 0
    active_work_orders: int = 0
    high_risk_work_orders: int = 0
    stages: List[CommandCenterPipelineStageOut] = []


class CommandCenterLiveEventOut(BaseModel):
    id: str
    city_name: str
    stage: str
    label: str
    detail: str
    severity: str = "info"
    at: datetime | None = None
    href: str = "/admin/audit-logs"


class CommandCenterSnapshotOut(BaseModel):
    generated_at: datetime
    refresh_after_seconds: int = 30
    platform: PlatformStatsOut
    cities: List[CommandCenterCityOut]
    city_lanes: List[CommandCenterCityLaneOut] = []
    live_events: List[CommandCenterLiveEventOut] = []
    complaint_status: dict[str, int]
    issue_status: dict[str, int]
    tender_status: dict[str, int]
    work_order_status: dict[str, int]
    workflow: List[dict[str, Any]]
    recent_audit: List[dict[str, Any]]
    system_health: dict[str, Any]


class SLARuleOut(BaseModel):
    id: str
    category: str
    severity: str
    response_hours: int
    resolution_hours: int
    escalation_hours: int
    is_active: bool


class SLARulePatch(BaseModel):
    response_hours: Optional[int] = Field(None, ge=1, le=8760)
    resolution_hours: Optional[int] = Field(None, ge=1, le=8760)
    escalation_hours: Optional[int] = Field(None, ge=1, le=8760)
    is_active: Optional[bool] = None


class AuditLogCreate(BaseModel):
    actor_id: str = Field(..., min_length=1, max_length=100)
    actor_name: str = Field(..., min_length=1, max_length=255)
    actor_role: str = Field(..., min_length=1, max_length=50)
    action: str = Field(..., min_length=1, max_length=100)
    entity_type: str = Field(..., min_length=1, max_length=100)
    entity_id: str = Field(..., min_length=1, max_length=100)
    entity_label: Optional[str] = Field(None, max_length=255)
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    reason: Optional[str] = None


class AuditLogOut(AuditLogCreate):
    id: str
    at: datetime


class MeResponse(BaseModel):
    id: str
    name: str
    email: Optional[str]
    role: str
    city: Optional[str]
    department: Optional[str]
    phone: Optional[str]
    is_super_admin: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# SLA configuration
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/sla-rules", response_model=List[SLARuleOut])
def list_sla_rules(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    rules = db.query(SLARule).order_by(SLARule.category, SLARule.severity).all()
    if not rules:
        defaults = {
            "CRITICAL": (2, 24, 4),
            "HIGH": (4, 48, 8),
            "MODERATE": (12, 120, 24),
            "LOW": (24, 240, 48),
        }
        categories = ["Road Damage", "Water Supply", "Sanitation", "Drainage", "Street Lighting"]
        rules = [
            SLARule(category=category, severity=severity, response_hours=values[0], resolution_hours=values[1], escalation_hours=values[2], is_active=True)
            for category in categories
            for severity, values in defaults.items()
        ]
        db.add_all(rules)
        db.commit()
    return [SLARuleOut(id=str(r.id), category=r.category, severity=r.severity, response_hours=r.response_hours, resolution_hours=r.resolution_hours, escalation_hours=r.escalation_hours, is_active=r.is_active) for r in rules]


@router.patch("/sla-rules/{rule_id}", response_model=SLARuleOut)
def patch_sla_rule(
    rule_id: UUID,
    patch: SLARulePatch,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    rule = db.get(SLARule, rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail="SLA rule not found")
    for field in ("response_hours", "resolution_hours", "escalation_hours", "is_active"):
        value = getattr(patch, field)
        if value is not None:
            setattr(rule, field, value)
    db.commit()
    db.refresh(rule)
    return SLARuleOut(id=str(rule.id), category=rule.category, severity=rule.severity, response_hours=rule.response_hours, resolution_hours=rule.resolution_hours, escalation_hours=rule.escalation_hours, is_active=rule.is_active)


# ─────────────────────────────────────────────────────────────────────────────
# /me — current user profile
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/me", response_model=MeResponse)
def get_me(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Return the currently authenticated super-admin's profile."""
    user = db.get(User, UUID(current["sub"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return MeResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        city=user.city,
        department=user.department,
        phone=user.phone,
        is_super_admin=is_super_admin_user(user),
    )


@router.patch("/me", response_model=MeResponse)
def update_me(
    patch: UpdateUserRequest,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Update the currently authenticated super-admin's own profile."""
    user = db.get(User, UUID(current["sub"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if patch.name is not None:
        user.name = patch.name
    if patch.phone is not None:
        user.phone = patch.phone
    if patch.password is not None:
        user.password_hash = hash_password(patch.password)
    db.commit()
    db.refresh(user)
    return MeResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        city=user.city,
        department=user.department,
        phone=user.phone,
        is_super_admin=is_super_admin_user(user),
    )


# Platform Stats Cache
_stats_cache = {"data": None, "expires_at": 0.0}

@router.get("/stats", response_model=PlatformStatsOut)
def get_platform_stats(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Return real platform-wide statistics for the admin dashboard (cached for 60s)."""
    import time
    now = time.time()
    if _stats_cache["data"] is not None and now < _stats_cache["expires_at"]:
        return _stats_cache["data"]

    # 1. Grouped user counts
    user_counts = dict(db.query(User.role, func.count(User.id)).group_by(User.role).all())
    
    # 2. Grouped complaint counts
    complaint_counts = dict(db.query(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status).all())
    
    # 3. Grouped issue counts
    issue_counts = dict(db.query(IssueCluster.status, func.count(IssueCluster.id)).group_by(IssueCluster.status).all())
    
    # 4. Grouped work order counts
    wo_counts = dict(db.query(WorkOrder.status, func.count(WorkOrder.id)).group_by(WorkOrder.status).all())

    total_complaints = sum(complaint_counts.values())
    resolved_complaints = complaint_counts.get("resolved", 0)
    open_complaints = sum(v for k, v in complaint_counts.items() if k not in ("resolved", "rejected", "closed"))

    total_issues = sum(issue_counts.values())
    open_issues = sum(v for k, v in issue_counts.items() if k not in ("resolved", "closed"))

    active_work_orders = sum(
        v for k, v in wo_counts.items() 
        if k not in (WorkOrderStatus.COMPLETED, WorkOrderStatus.CLOSED, WorkOrderStatus.CANCELLED)
    )

    tenders_count = db.query(func.count(Tender.id)).scalar() or 0
    cities_count = db.query(func.count(City.id)).scalar() or 0

    result = PlatformStatsOut(
        total_users=sum(user_counts.values()),
        total_citizens=user_counts.get("citizen", 0),
        total_officers=user_counts.get("officer", 0),
        total_contractors=user_counts.get("contractor", 0),
        total_admins=(
            user_counts.get("admin", 0) 
            + user_counts.get("supervisor", 0) 
            + user_counts.get("municipality", 0)
        ),
        total_complaints=total_complaints,
        open_complaints=open_complaints,
        resolved_complaints=resolved_complaints,
        total_issues=total_issues,
        open_issues=open_issues,
        total_tenders=tenders_count,
        active_work_orders=active_work_orders,
        total_cities=cities_count,
    )

    _stats_cache["data"] = result
    _stats_cache["expires_at"] = now + 60.0
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Live super-admin command center
# ─────────────────────────────────────────────────────────────────────────────


def _status_key(value: Any) -> str:
    return str(getattr(value, "value", value)).lower()


@router.get("/command-center", response_model=CommandCenterSnapshotOut)
def get_command_center_snapshot(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Return a bounded live snapshot for the configured Civic Sathi city scope."""
    degraded: list[str] = []
    scope_names = settings.command_center_city_name_set

    def grouped(query, label: str) -> dict[str, int]:
        try:
            return {_status_key(key): int(value) for key, value in query.all()}
        except Exception:
            db.rollback()
            degraded.append(label)
            return {}

    def by_city(query, label: str) -> dict[Any, int]:
        try:
            return {key: int(value) for key, value in query.all()}
        except Exception:
            db.rollback()
            degraded.append(label)
            return {}

    try:
        city_rows = db.execute(
            select(City)
            .where(func.lower(City.name).in_(sorted(scope_names)))
            .order_by(City.name)
        ).scalars().all()
    except Exception:
        db.rollback()
        degraded.append("cities")
        city_rows = []

    scoped_city_ids = [city.id for city in city_rows]
    if len(city_rows) != len(scope_names):
        degraded.append("configured_city_scope")

    def scoped(query, city_column):
        return query.filter(city_column.in_(scoped_city_ids)) if scoped_city_ids else query.filter(False)

    try:
        platform = get_platform_stats(db=db, current=current)
    except Exception:
        db.rollback()
        degraded.append("platform")
        platform = PlatformStatsOut(
            total_users=0, total_citizens=0, total_officers=0, total_contractors=0,
            total_admins=0, total_complaints=0, open_complaints=0, resolved_complaints=0,
            total_issues=0, open_issues=0, total_tenders=0, active_work_orders=0, total_cities=0,
        )

    complaint_status = grouped(
        scoped(db.query(Complaint.status, func.count(Complaint.id)), Complaint.city_id)
        .group_by(Complaint.status),
        "complaint_status",
    )
    issue_status = grouped(
        scoped(db.query(IssueCluster.status, func.count(IssueCluster.id)), IssueCluster.city_id)
        .group_by(IssueCluster.status),
        "issue_status",
    )
    tender_status = grouped(
        scoped(db.query(Tender.status, func.count(Tender.id)), Tender.city_id)
        .group_by(Tender.status),
        "tender_status",
    )
    work_order_status = grouped(
        db.query(WorkOrder.status, func.count(WorkOrder.id))
        .join(Tender, WorkOrder.tender_id == Tender.id)
        .filter(Tender.city_id.in_(scoped_city_ids) if scoped_city_ids else False)
        .group_by(WorkOrder.status),
        "work_order_status",
    )

    complaint_by_city = by_city(
        scoped(db.query(Complaint.city_id, func.count(Complaint.id)), Complaint.city_id)
        .group_by(Complaint.city_id),
        "complaints_by_city",
    )
    open_complaint_by_city = by_city(
        scoped(db.query(Complaint.city_id, func.count(Complaint.id)), Complaint.city_id)
        .filter(Complaint.status.notin_(("resolved", "rejected", "closed")))
        .group_by(Complaint.city_id),
        "open_complaints_by_city",
    )
    resolved_complaint_by_city = by_city(
        scoped(db.query(Complaint.city_id, func.count(Complaint.id)), Complaint.city_id)
        .filter(Complaint.status == "resolved")
        .group_by(Complaint.city_id),
        "resolved_complaints_by_city",
    )
    issues_by_city = by_city(
        scoped(db.query(IssueCluster.city_id, func.count(IssueCluster.id)), IssueCluster.city_id)
        .group_by(IssueCluster.city_id),
        "issues_by_city",
    )
    critical_issues_by_city = by_city(
        scoped(db.query(IssueCluster.city_id, func.count(IssueCluster.id)), IssueCluster.city_id)
        .filter(func.lower(IssueCluster.risk_level) == "critical")
        .group_by(IssueCluster.city_id),
        "critical_issues_by_city",
    )
    tenders_by_city = by_city(
        scoped(db.query(Tender.city_id, func.count(Tender.id)), Tender.city_id)
        .group_by(Tender.city_id),
        "tenders_by_city",
    )
    published_tenders_by_city = by_city(
        scoped(db.query(Tender.city_id, func.count(Tender.id)), Tender.city_id)
        .filter(Tender.status == "PUBLISHED")
        .group_by(Tender.city_id),
        "published_tenders_by_city",
    )
    work_orders_by_city = by_city(
        scoped(db.query(Tender.city_id, func.count(WorkOrder.id)), Tender.city_id)
        .join(WorkOrder, WorkOrder.tender_id == Tender.id)
        .group_by(Tender.city_id),
        "work_orders_by_city",
    )
    active_work_orders_by_city = by_city(
        scoped(db.query(Tender.city_id, func.count(WorkOrder.id)), Tender.city_id)
        .join(WorkOrder, WorkOrder.tender_id == Tender.id)
        .filter(WorkOrder.status.notin_((WorkOrderStatus.COMPLETED, WorkOrderStatus.CLOSED, WorkOrderStatus.CANCELLED)))
        .group_by(Tender.city_id),
        "active_work_orders_by_city",
    )
    high_risk_work_orders_by_city = by_city(
        scoped(db.query(Tender.city_id, func.count(WorkOrder.id)), Tender.city_id)
        .join(WorkOrder, WorkOrder.tender_id == Tender.id)
        .filter(func.lower(WorkOrder.risk_level).in_(("high", "critical")))
        .group_by(Tender.city_id),
        "high_risk_work_orders_by_city",
    )
    registrations_by_city = by_city(
        scoped(db.query(ContractorCityRegistration.city_id, func.count(ContractorCityRegistration.id)), ContractorCityRegistration.city_id)
        .group_by(ContractorCityRegistration.city_id),
        "registrations_by_city",
    )

    scoped_total_complaints = sum(complaint_by_city.values())
    scoped_open_complaints = sum(open_complaint_by_city.values())
    scoped_resolved_complaints = sum(resolved_complaint_by_city.values())
    scoped_total_issues = sum(issues_by_city.values())
    scoped_total_tenders = sum(tenders_by_city.values())
    scoped_active_work_orders = sum(active_work_orders_by_city.values())
    platform = platform.model_copy(update={
        "total_complaints": scoped_total_complaints,
        "open_complaints": scoped_open_complaints,
        "resolved_complaints": scoped_resolved_complaints,
        "total_issues": scoped_total_issues,
        "open_issues": sum(v for key, v in issue_status.items() if key not in ("resolved", "closed")),
        "total_tenders": scoped_total_tenders,
        "active_work_orders": scoped_active_work_orders,
        "total_cities": len(city_rows),
    })

    cities = [
        CommandCenterCityOut(
            id=str(city.id),
            name=city.name,
            state_code=city.state_code,
            complaints=int(complaint_by_city.get(city.id, 0)),
            open_complaints=int(open_complaint_by_city.get(city.id, 0)),
            resolved_complaints=int(resolved_complaint_by_city.get(city.id, 0)),
            issues=int(issues_by_city.get(city.id, 0)),
            critical_issues=int(critical_issues_by_city.get(city.id, 0)),
            tenders=int(tenders_by_city.get(city.id, 0)),
            published_tenders=int(published_tenders_by_city.get(city.id, 0)),
            work_orders=int(work_orders_by_city.get(city.id, 0)),
            active_work_orders=int(active_work_orders_by_city.get(city.id, 0)),
            contractor_registrations=int(registrations_by_city.get(city.id, 0)),
            high_risk_work_orders=int(high_risk_work_orders_by_city.get(city.id, 0)),
        )
        for city in city_rows
    ]

    workflow = [
        {"id": "reports", "label": "Citizen reports", "count": scoped_total_complaints, "tone": "teal"},
        {"id": "issues", "label": "Issue clusters", "count": scoped_total_issues, "tone": "saffron"},
        {"id": "tenders", "label": "Municipal tenders", "count": scoped_total_tenders, "tone": "indigo"},
        {"id": "execution", "label": "Contractor work orders", "count": scoped_active_work_orders, "tone": "blue"},
        {"id": "resolved", "label": "Resolved complaints", "count": scoped_resolved_complaints, "tone": "teal"},
    ]

    try:
        audit_models = list_audit_logs(limit=10, offset=0, db=db, current=current)
        recent_audit = [
            entry.model_dump(mode="json") if hasattr(entry, "model_dump") else entry
            for entry in audit_models
        ]
    except Exception:
        db.rollback()
        degraded.append("recent_audit")
        recent_audit = []

    city_name_by_id = {city.id: city.name for city in city_rows}
    lane_href = {
        "reports": "/admin/audit-logs",
        "issues": "/admin/audit-logs",
        "tenders": "/admin/audit-logs",
        "execution": "/admin/work-orders-overview",
        "resolved": "/admin/audit-logs",
    }

    def pipeline_stage(stage_id: str, label: str, count: int, tone: str, signal: str, *, completed: bool = False, critical: bool = False):
        state = "critical" if critical else "complete" if completed and count > 0 else "active" if count > 0 else "quiet"
        return CommandCenterPipelineStageOut(
            id=stage_id,
            label=label,
            count=int(count),
            signal=signal,
            state=state,
            tone=tone,
            href=lane_href[stage_id],
        )

    city_lanes = []
    for city in cities:
        city_critical = city.critical_issues > 0 or city.high_risk_work_orders > 0
        city_lanes.append(CommandCenterCityLaneOut(
            id=city.id,
            name=city.name,
            state_code=city.state_code,
            health="critical" if city_critical else "active" if city.open_complaints or city.active_work_orders else "quiet",
            open_complaints=city.open_complaints,
            critical_issues=city.critical_issues,
            active_work_orders=city.active_work_orders,
            high_risk_work_orders=city.high_risk_work_orders,
            stages=[
                pipeline_stage("reports", "Citizen reports", city.complaints, "teal", f"{city.open_complaints:,} open"),
                pipeline_stage("issues", "Issue clusters", city.issues, "saffron", f"{city.critical_issues:,} critical", critical=city.critical_issues > 0),
                pipeline_stage("tenders", "Municipal tenders", city.tenders, "indigo", f"{city.published_tenders:,} published"),
                pipeline_stage("execution", "Contractor execution", city.active_work_orders, "blue", f"{city.high_risk_work_orders:,} high risk", critical=city.high_risk_work_orders > 0),
                pipeline_stage("resolved", "Resolved complaints", city.resolved_complaints, "teal", "closed loop", completed=True),
            ],
        ))

    live_events: list[CommandCenterLiveEventOut] = []
    try:
        recent_complaints = (
            scoped(db.query(Complaint), Complaint.city_id)
            .order_by(Complaint.created_at.desc())
            .limit(4)
            .all()
        )
        live_events.extend(
            CommandCenterLiveEventOut(
                id=f"complaint-{complaint.id}",
                city_name=city_name_by_id.get(complaint.city_id, "Unknown city"),
                stage="Citizen reports",
                label=complaint.title,
                detail=f"{complaint.public_id} · {complaint.status.upper()} · {complaint.category}",
                severity=str(complaint.priority or "info").lower(),
                at=complaint.created_at,
                href="/admin/audit-logs",
            )
            for complaint in recent_complaints
        )
    except Exception:
        db.rollback()
        degraded.append("recent_complaint_events")

    try:
        recent_tenders = (
            scoped(db.query(Tender), Tender.city_id)
            .order_by(Tender.created_at.desc())
            .limit(4)
            .all()
        )
        live_events.extend(
            CommandCenterLiveEventOut(
                id=f"tender-{tender.id}",
                city_name=city_name_by_id.get(tender.city_id, "Unknown city"),
                stage="Municipal tenders",
                label=tender.title,
                detail=f"{_status_key(tender.status).upper()} · INR {float(tender.estimated_budget or 0):,.0f}",
                severity="info",
                at=tender.created_at,
                href="/admin/audit-logs",
            )
            for tender in recent_tenders
        )
    except Exception:
        db.rollback()
        degraded.append("recent_tender_events")

    try:
        recent_work_orders = (
            db.query(WorkOrder, Tender)
            .join(Tender, WorkOrder.tender_id == Tender.id)
            .filter(Tender.city_id.in_(scoped_city_ids) if scoped_city_ids else False)
            .order_by(WorkOrder.created_at.desc())
            .limit(4)
            .all()
        )
        live_events.extend(
            CommandCenterLiveEventOut(
                id=f"work-order-{work_order.id}",
                city_name=city_name_by_id.get(tender.city_id, "Unknown city"),
                stage="Contractor execution",
                label=tender.title,
                detail=f"{_status_key(work_order.status).upper()} · {float(work_order.verified_progress_pct or work_order.reported_progress_pct or 0):.0f}% verified",
                severity=str(work_order.risk_level or "info").lower(),
                at=work_order.created_at,
                href="/admin/work-orders-overview",
            )
            for work_order, tender in recent_work_orders
        )
    except Exception:
        db.rollback()
        degraded.append("recent_execution_events")

    live_events = sorted(live_events, key=lambda event: event.at or datetime.min.replace(tzinfo=timezone.utc), reverse=True)[:12]

    degraded = sorted(set(degraded))
    health_status = "degraded" if degraded else "operational"
    return CommandCenterSnapshotOut(
        generated_at=datetime.now(timezone.utc),
        platform=platform,
        cities=cities,
        city_lanes=city_lanes,
        live_events=live_events,
        complaint_status=complaint_status,
        issue_status=issue_status,
        tender_status=tender_status,
        work_order_status=work_order_status,
        workflow=workflow,
        recent_audit=recent_audit,
        system_health={
            "backend": {"status": "operational", "source": "request path"},
            "database": {"status": health_status, "source": "bounded scoped aggregate queries"},
            "admin_api": {"status": health_status, "source": "super-admin endpoint"},
            "scope": {
                "cities": [city.name for city in city_rows],
                "supported_only": True,
                "configured_city_names": sorted(scope_names),
            },
            "degraded_sections": degraded,
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# User Management
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[UserOut])
def list_users(
    role: Optional[str] = Query(None, description="Filter by role"),
    city: Optional[str] = Query(None, description="Filter by city"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """List all users. Admin/supervisor only."""
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    if city:
        q = q.filter(User.city == city)
    users = q.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return [
        UserOut(
            id=str(u.id),
            name=u.name,
            email=u.email,
            phone=u.phone,
            role=u.role,
            city=u.city,
            department=u.department,
            created_at=u.created_at,
        )
        for u in users
    ]


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    body: CreateUserRequest,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Create any type of user (officer, municipality, contractor login, etc.). Admin only."""
    allowed_roles = {"officer", "supervisor", "municipality", "admin", "contractor", "citizen"}
    if body.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Must be one of: {', '.join(allowed_roles)}",
        )
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Email {body.email} already exists")
    user = User(
        id=uuid4(),
        role=body.role,
        name=body.name,
        email=body.email,
        phone=body.phone,
        password_hash=hash_password(body.password),
        city=body.city,
        department=body.department,
        ward="Admin" if body.role in ("admin", "supervisor", "municipality", "officer") else "Unassigned",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        city=user.city,
        department=user.department,
        created_at=user.created_at,
    )


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Get a single user by ID. Admin only."""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        city=user.city,
        department=user.department,
        created_at=user.created_at,
    )


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: UUID,
    patch: UpdateUserRequest,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Update any user's details. Admin only."""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if patch.name is not None:
        user.name = patch.name
    if patch.email is not None:
        user.email = patch.email
    if patch.role is not None:
        user.role = patch.role
    if patch.city is not None:
        user.city = patch.city
    if patch.department is not None:
        user.department = patch.department
    if patch.phone is not None:
        user.phone = patch.phone
    if patch.password is not None:
        user.password_hash = hash_password(patch.password)
    db.commit()
    db.refresh(user)
    return UserOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        city=user.city,
        department=user.department,
        created_at=user.created_at,
    )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Delete a user. Admin only. Cannot delete yourself."""
    if str(user_id) == current["sub"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# Contractor Management
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/contractors", response_model=List[ContractorOut])
def list_contractors(
    city_id: Optional[UUID] = Query(None),
    status_filter: Optional[RegistrationStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """List all contractors with their city registrations. Admin only."""
    contractors = db.execute(select(Contractor)).scalars().all()
    result = []
    for c in contractors:
        regs_q = db.execute(
            select(ContractorCityRegistration).where(
                ContractorCityRegistration.contractor_id == c.id
            )
        ).scalars().all()
        if city_id and not any(r.city_id == city_id for r in regs_q):
            continue
        if status_filter and not any(r.status == status_filter for r in regs_q):
            continue
        regs = []
        for r in regs_q:
            city = db.get(City, r.city_id)
            regs.append({
                "id": str(r.id),
                "city_id": str(r.city_id),
                "city_name": city.name if city else str(r.city_id),
                "status": r.status.value,
                "registration_number": r.registration_number,
                "registration_class": r.registration_class,
                "approved_categories": r.approved_categories or [],
                "current_risk_level": r.current_risk_level,
            })
        result.append(ContractorOut(
            id=str(c.id),
            company_name=c.company_name,
            contact_person=c.contact_person or "",
            email=c.email,
            phone=c.phone or "",
            auth_user_id=c.auth_user_id,
            registrations=regs,
        ))
    return result


@router.post("/contractors", response_model=ContractorOut, status_code=201)
def create_contractor(
    body: ContractorCreateRequest,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Create a contractor company + optionally a login user for them. Admin only."""
    existing = db.execute(
        select(Contractor).where(Contractor.email == body.email)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Contractor with this email already exists")

    auth_user_id = None
    if body.login_email and body.login_password:
        existing_user = db.query(User).filter(User.email == body.login_email).first()
        if existing_user:
            raise HTTPException(status_code=409, detail=f"Login email {body.login_email} already in use")
        login_user = User(
            id=uuid4(),
            role="contractor",
            name=body.company_name,
            email=body.login_email,
            password_hash=hash_password(body.login_password),
            ward="Contractor",
        )
        db.add(login_user)
        db.flush()
        auth_user_id = str(login_user.id)

    contractor = Contractor(
        company_name=body.company_name,
        contact_person=body.contact_person,
        email=body.email,
        phone=body.phone,
        auth_user_id=auth_user_id,
    )
    db.add(contractor)
    db.commit()
    db.refresh(contractor)
    return ContractorOut(
        id=str(contractor.id),
        company_name=contractor.company_name,
        contact_person=contractor.contact_person,
        email=contractor.email,
        phone=contractor.phone,
        auth_user_id=contractor.auth_user_id,
        registrations=[],
    )


@router.patch("/contractors/{contractor_id}/registrations/{reg_id}", response_model=dict)
def update_contractor_registration(
    contractor_id: UUID,
    reg_id: UUID,
    body: RegistrationUpdateRequest,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Approve, reject, or revoke a contractor's city registration. Admin only."""
    reg = db.get(ContractorCityRegistration, reg_id)
    if not reg or reg.contractor_id != contractor_id:
        raise HTTPException(status_code=404, detail="Registration not found")
    reg.status = body.status
    if body.approved_categories is not None:
        reg.approved_categories = body.approved_categories
    if body.registration_class is not None:
        reg.registration_class = body.registration_class
    db.commit()
    db.refresh(reg)
    return {
        "id": str(reg.id),
        "contractor_id": str(reg.contractor_id),
        "city_id": str(reg.city_id),
        "status": reg.status.value,
        "registration_class": reg.registration_class,
        "approved_categories": reg.approved_categories or [],
    }


@router.post("/contractors/{contractor_id}/registrations", response_model=dict, status_code=201)
def add_contractor_registration(
    contractor_id: UUID,
    body: dict,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Add a new city registration for a contractor. Admin only."""
    contractor = db.get(Contractor, contractor_id)
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    city_id = body.get("city_id")
    if not city_id:
        raise HTTPException(status_code=400, detail="city_id required")
    reg = ContractorCityRegistration(
        contractor_id=contractor_id,
        city_id=UUID(city_id),
        registration_number=body.get("registration_number", f"REG-{uuid4().hex[:8].upper()}"),
        registration_class=body.get("registration_class", "Class-I"),
        status=RegistrationStatus.PENDING,
        approved_categories=body.get("approved_categories", []),
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return {
        "id": str(reg.id),
        "contractor_id": str(reg.contractor_id),
        "city_id": str(reg.city_id),
        "status": reg.status.value,
        "registration_number": reg.registration_number,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Cities Management
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/cities", response_model=List[dict])
def admin_list_cities(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """List all cities with full details. Admin only."""
    cities = db.execute(select(City)).scalars().all()
    return [{"id": str(c.id), "name": c.name, "state_code": c.state_code} for c in cities]


@router.post("/cities", response_model=dict, status_code=201)
def create_city(
    body: dict,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """Create a new city. Admin only."""
    name = body.get("name", "").strip()
    state_code = body.get("state_code", "").strip()
    if not name or not state_code:
        raise HTTPException(status_code=400, detail="name and state_code required")
    existing = db.execute(
        select(City).where(func.lower(City.name) == name.lower())
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail=f"City '{name}' already exists")
    city = City(name=name, state_code=state_code.upper())
    db.add(city)
    db.commit()
    db.refresh(city)
    return {"id": str(city.id), "name": city.name, "state_code": city.state_code}


# ─────────────────────────────────────────────────────────────────────────────
# Work Orders overview (real data for admin dashboard)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/work-orders", response_model=List[dict])
def admin_list_work_orders(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    """List ALL work orders across all cities. Admin only."""
    from app.models.procurement import Tender
    rows = db.execute(
        select(WorkOrder).order_by(WorkOrder.created_at.desc()).offset(offset).limit(limit)
    ).scalars().all()
    result = []
    for wo in rows:
        tender = db.get(Tender, wo.tender_id)
        contractor = db.get(Contractor, wo.contractor_id)
        city = db.get(City, tender.city_id) if tender else None
        result.append({
            "id": str(wo.id),
            "title": tender.title if tender else "—",
            "contractor_name": contractor.company_name if contractor else "—",
            "city": city.name if city else "—",
            "status": wo.status.value,
            "award_value": wo.award_value,
            "risk_level": wo.risk_level,
            "created_at": wo.created_at.isoformat(),
        })
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Persistent platform audit trail
# ─────────────────────────────────────────────────────────────────────────────


def _audit_out(log: AuditLog) -> AuditLogOut:
    return AuditLogOut(
        id=str(log.id),
        actor_id=log.actor_id,
        actor_name=log.actor_name,
        actor_role=log.actor_role,
        action=log.action,
        entity_type=log.entity_type,
        entity_id=log.entity_id,
        entity_label=log.entity_label,
        previous_value=log.previous_value,
        new_value=log.new_value,
        reason=log.reason,
        at=log.at,
    )


@router.get("/audit-logs", response_model=List[AuditLogOut])
def list_audit_logs(
    limit: int = Query(200, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    actor_role: Optional[str] = None,
    entity_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    query = select(AuditLog).order_by(AuditLog.at.desc()).offset(offset).limit(limit)
    if actor_role:
        query = query.where(AuditLog.actor_role == actor_role)
    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)
    return [_audit_out(log) for log in db.execute(query).scalars().all()]


@router.post("/audit-logs", response_model=AuditLogOut, status_code=201)
def create_audit_log(
    body: AuditLogCreate,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    log = AuditLog(**body.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return _audit_out(log)


# ─────────────────────────────────────────────────────────────────────────────
# Civic reputation administration
# ─────────────────────────────────────────────────────────────────────────────

class ReputationConfigPatch(BaseModel):
    value_json: dict[str, Any]


@router.get("/reputation/summary")
def reputation_summary(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    from app.models.reputation import CivicReputationFlag, CivicProfile, XPTransaction, CivicImpactEvent
    since = datetime.now(timezone.utc) - __import__("datetime").timedelta(days=1)
    return {
        "profiles": int(db.query(func.count(CivicProfile.id)).scalar() or 0),
        "xp_granted_last_24h": int(db.query(func.coalesce(func.sum(XPTransaction.amount), 0)).filter(XPTransaction.at >= since, XPTransaction.status == "granted").scalar() or 0),
        "impact_events_last_24h": int(db.query(func.count(CivicImpactEvent.id)).filter(CivicImpactEvent.at >= since).scalar() or 0),
        "open_review_flags": int(db.query(func.count(CivicReputationFlag.id)).filter(CivicReputationFlag.status == "open").scalar() or 0),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/reputation/ledger")
def reputation_ledger(
    user_id: str | None = None,
    source_type: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    from app.models.reputation import XPTransaction
    query = db.query(XPTransaction).order_by(XPTransaction.at.desc())
    if user_id:
        query = query.filter(XPTransaction.user_id == UUID(user_id))
    if source_type:
        query = query.filter(XPTransaction.source_type == source_type)
    if status_filter:
        query = query.filter(XPTransaction.status == status_filter)
    rows = query.offset(offset).limit(limit).all()
    return {
        "items": [{
            "id": str(row.id), "user_id": str(row.user_id), "amount": row.amount, "action": row.action,
            "reason": row.reason, "source_type": row.source_type, "source_id": row.source_id,
            "status": row.status, "verification_status": row.verification_status, "at": row.at,
        } for row in rows],
        "limit": limit,
        "offset": offset,
    }


@router.get("/reputation/config")
def get_reputation_config(
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    from app.services.reputation_service import DEFAULT_RULES
    from app.models.reputation import CivicRewardConfig
    row = db.query(CivicRewardConfig).filter(CivicRewardConfig.key == "default").first()
    return {"key": "default", "value_json": row.value_json if row else DEFAULT_RULES, "version": row.version if row else 0, "active": row.active if row else True}


@router.patch("/reputation/config")
def update_reputation_config(
    patch: ReputationConfigPatch,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    from app.models.reputation import CivicRewardConfig
    actor_id = UUID(current.get("sub"))
    row = db.query(CivicRewardConfig).filter(CivicRewardConfig.key == "default").first()
    if not row:
        row = CivicRewardConfig(key="default", value_json=patch.value_json, version=1, active=True, updated_by_id=actor_id)
        db.add(row)
    else:
        row.value_json = patch.value_json
        row.version = int(row.version or 0) + 1
        row.updated_by_id = actor_id
    db.add(AuditLog(
        actor_id=str(actor_id), actor_name="Super Admin", actor_role="admin",
        action="reputation_config_updated", entity_type="civic_reward_config", entity_id="default",
        new_value=str(patch.value_json), reason="Admin-edited civic reputation rules",
    ))
    db.commit()
    return {"key": row.key, "value_json": row.value_json, "version": row.version, "active": row.active}


@router.post("/reputation/ledger/{transaction_id}/revoke")
def revoke_reputation_transaction(
    transaction_id: UUID,
    reason: str = Query(..., min_length=3, max_length=500),
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    from app.models.reputation import XPTransaction, CivicProfile
    transaction = db.get(XPTransaction, transaction_id)
    if not transaction or transaction.status != "granted":
        raise HTTPException(status_code=404, detail="Active reward transaction not found")
    reversal_key = f"reversal:{transaction.id}"
    if db.query(XPTransaction).filter(XPTransaction.idempotency_key == reversal_key).first():
        return {"success": True, "already_reversed": True}
    transaction.status = "reversed"
    profile = db.query(CivicProfile).filter(CivicProfile.user_id == transaction.user_id).first()
    if profile:
        profile.xp_total = max(0, int(profile.xp_total or 0) - max(0, int(transaction.amount or 0)))
    reversal = XPTransaction(
        user_id=transaction.user_id, amount=-abs(int(transaction.amount or 0)), action="reward_revoked",
        reason=reason, source_type="xp_reversal", source_id=str(transaction.id), idempotency_key=reversal_key,
        status="reversed", verification_status="reviewed", metadata_json={"original_transaction_id": str(transaction.id)},
    )
    db.add(reversal)
    actor_id = UUID(current.get("sub"))
    db.add(AuditLog(
        actor_id=str(actor_id), actor_name="Super Admin", actor_role="admin",
        action="reputation_reward_revoked", entity_type="xp_transaction", entity_id=str(transaction.id),
        previous_value=str(transaction.amount), new_value="0", reason=reason,
    ))
    db.commit()
    return {"success": True, "reversed_transaction_id": str(transaction.id), "reversal_id": str(reversal.id)}


@router.post("/reputation/reconcile")
def reconcile_reputation(
    limit: int = Query(500, ge=1, le=5000),
    city: str | None = None,
    db: Session = Depends(get_db),
    current: dict = Depends(require_admin),
):
    from app.services.reputation_service import reconcile_all_citizens
    result = reconcile_all_citizens(db, limit=limit, city_name=city)
    db.add(AuditLog(
        actor_id=str(current.get("sub")), actor_name="Super Admin", actor_role="admin",
        action="reputation_reconciled", entity_type="civic_reputation", entity_id="batch",
        new_value=str(result), reason="Bounded server-side reputation reconciliation",
    ))
    db.commit()
    return {"success": True, **result}
