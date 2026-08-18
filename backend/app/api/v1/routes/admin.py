"""Admin API — full platform management endpoints.

Only accessible to users with role: admin or supervisor.
Covers: user management, contractor approvals, SLA config, platform stats, audit trail.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field

from app.core.database import get_db
from app.core.security import (
    get_current_officer, hash_password, verify_password,
    create_access_token,
)
from app.models.user import User
from app.models.procurement import (
    Contractor, ContractorCityRegistration, RegistrationStatus,
    City, Tender, Bid, WorkOrder, WorkOrderStatus,
)
from app.models.complaint import Complaint
from app.models.issue import IssueCluster

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Guards
# ─────────────────────────────────────────────────────────────────────────────

def require_admin(current: dict = Depends(get_current_officer)) -> dict:
    """Only admin or supervisor roles may call admin endpoints."""
    if current.get("role") not in ("admin", "supervisor"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or supervisor role required",
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


class SLARuleOut(BaseModel):
    id: str
    category: str
    severity: str
    response_hours: int
    resolution_hours: int
    escalation_hours: int
    is_active: bool


class MeResponse(BaseModel):
    id: str
    name: str
    email: Optional[str]
    role: str
    city: Optional[str]
    department: Optional[str]
    phone: Optional[str]


# ─────────────────────────────────────────────────────────────────────────────
# /me — current user profile
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/me", response_model=MeResponse)
def get_me(
    db: Session = Depends(get_db),
    current: dict = Depends(get_current_officer),
):
    """Return the currently authenticated officer/admin's profile."""
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
    )


@router.patch("/me", response_model=MeResponse)
def update_me(
    patch: UpdateUserRequest,
    db: Session = Depends(get_db),
    current: dict = Depends(get_current_officer),
):
    """Update the currently authenticated user's own profile."""
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
