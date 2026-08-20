"""Municipality-scoped administration for collector/commissioner accounts."""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, require_collector
from app.models.audit import AuditLog
from app.models.procurement import City, Contractor, ContractorCityRegistration, RegistrationStatus
from app.models.user import User

router = APIRouter()


class OfficerProvisionRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    phone: Optional[str] = Field(None, min_length=7, max_length=20)
    role: str = Field("officer", pattern="^(officer|supervisor|municipality)$")
    department: str = Field(..., min_length=2, max_length=100)
    designation: str = Field("Ward Officer", min_length=2, max_length=100)
    ward: Optional[str] = Field(None, max_length=100)


class OfficerProvisionOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    city: str
    department: Optional[str]
    designation: Optional[str]
    ward: Optional[str]
    created_at: datetime


class ContractorProvisionRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    contact_person: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    login_email: EmailStr
    login_password: str = Field(..., min_length=8, max_length=100)
    registration_class: str = Field("Municipal Works", min_length=2, max_length=50)
    approved_categories: List[str] = Field(default_factory=list, max_length=20)
    registration_number: Optional[str] = Field(None, max_length=100)


class ContractorProvisionOut(BaseModel):
    id: str
    company_name: str
    contact_person: str
    email: str
    phone: str
    auth_user_id: Optional[str]
    city: str
    registration_id: str
    registration_number: str
    registration_status: str


def _officer_out(user: User) -> OfficerProvisionOut:
    return OfficerProvisionOut(
        id=str(user.id),
        name=user.name,
        email=user.email or "",
        role=user.role,
        city=user.city or "",
        department=user.department,
        designation=user.designation,
        ward=user.ward,
        created_at=user.created_at,
    )


def _collector_city(db: Session, collector: User) -> City:
    city = db.execute(
        select(City).where(func.lower(City.name) == collector.city.strip().lower())
    ).scalar_one_or_none()
    if not city:
        raise HTTPException(status_code=409, detail="Collector city is not configured in the city registry")
    return city


@router.get("/officers", response_model=List[OfficerProvisionOut])
def list_city_officers(
    db: Session = Depends(get_db),
    collector: User = Depends(require_collector),
):
    """List only operational staff in the authenticated collector's city."""
    users = (
        db.query(User)
        .filter(
            func.lower(User.city) == collector.city.strip().lower(),
            User.role.in_(("officer", "supervisor", "municipality")),
        )
        .order_by(User.created_at.desc())
        .all()
    )
    return [_officer_out(user) for user in users]


@router.post("/officers", response_model=OfficerProvisionOut, status_code=status.HTTP_201_CREATED)
def provision_city_officer(
    body: OfficerProvisionRequest,
    db: Session = Depends(get_db),
    collector: User = Depends(require_collector),
):
    """Create a non-admin staff account inside the collector's own city only."""
    email = body.email.strip().lower()
    if db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user = User(
        id=uuid4(),
        role=body.role,
        name=body.name.strip(),
        email=email,
        phone=body.phone,
        password_hash=hash_password(body.password),
        city=collector.city.strip(),
        department=body.department.strip(),
        designation=body.designation.strip(),
        ward=(body.ward or "Unassigned").strip(),
    )
    db.add(user)
    db.add(AuditLog(
        actor_id=str(collector.id),
        actor_name=collector.name,
        actor_role=collector.role,
        action="MUNICIPALITY_OFFICER_CREATED",
        entity_type="user",
        entity_id=str(user.id),
        entity_label=email,
        new_value=f"{body.role}:{collector.city}",
        reason="Collector-scoped staff provisioning",
    ))
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Unable to create officer; email may already be in use")
    return _officer_out(user)


@router.get("/contractors", response_model=List[ContractorProvisionOut])
def list_city_contractors(
    db: Session = Depends(get_db),
    collector: User = Depends(require_collector),
):
    city = _collector_city(db, collector)
    rows = db.execute(
        select(Contractor, ContractorCityRegistration)
        .join(ContractorCityRegistration, ContractorCityRegistration.contractor_id == Contractor.id)
        .where(ContractorCityRegistration.city_id == city.id)
        .order_by(Contractor.created_at.desc())
    ).all()
    return [
        ContractorProvisionOut(
            id=str(contractor.id),
            company_name=contractor.company_name,
            contact_person=contractor.contact_person or "",
            email=contractor.email,
            phone=contractor.phone or "",
            auth_user_id=contractor.auth_user_id,
            city=city.name,
            registration_id=str(registration.id),
            registration_number=registration.registration_number,
            registration_status=registration.status.value,
        )
        for contractor, registration in rows
    ]


@router.post("/contractors", response_model=ContractorProvisionOut, status_code=status.HTTP_201_CREATED)
def provision_city_contractor(
    body: ContractorProvisionRequest,
    db: Session = Depends(get_db),
    collector: User = Depends(require_collector),
):
    """Create a contractor profile and PENDING city registration in the collector's city."""
    city = _collector_city(db, collector)
    company_email = body.email.strip().lower()
    login_email = body.login_email.strip().lower()
    if db.execute(select(Contractor).where(func.lower(Contractor.email) == company_email)).scalar_one_or_none():
        raise HTTPException(status_code=409, detail="A contractor with this company email already exists")
    if db.query(User).filter(func.lower(User.email) == login_email).first():
        raise HTTPException(status_code=409, detail="The contractor login email is already in use")

    login_user = User(
        id=uuid4(),
        role="contractor",
        name=body.company_name.strip(),
        email=login_email,
        phone=body.phone,
        password_hash=hash_password(body.login_password),
        city=city.name,
        department="Contractor",
        designation="Contractor Lead",
        ward="Contractor",
    )
    db.add(login_user)
    db.flush()
    contractor = Contractor(
        company_name=body.company_name.strip(),
        contact_person=body.contact_person.strip(),
        email=company_email,
        phone=body.phone,
        auth_user_id=str(login_user.id),
    )
    db.add(contractor)
    db.flush()
    registration = ContractorCityRegistration(
        contractor_id=contractor.id,
        city_id=city.id,
        registration_number=body.registration_number or f"CS-{datetime.now(timezone.utc).year}-{str(uuid4())[:8].upper()}",
        registration_class=body.registration_class.strip(),
        status=RegistrationStatus.PENDING,
        approved_categories=body.approved_categories,
    )
    db.add(registration)
    db.add(AuditLog(
        actor_id=str(collector.id),
        actor_name=collector.name,
        actor_role=collector.role,
        action="MUNICIPALITY_CONTRACTOR_CREATED",
        entity_type="contractor",
        entity_id=str(contractor.id),
        entity_label=contractor.company_name,
        new_value=f"PENDING:{city.name}",
        reason="Collector-scoped contractor registration",
    ))
    try:
        db.commit()
        db.refresh(contractor)
        db.refresh(registration)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Unable to create contractor; one of the emails may already be in use")
    return ContractorProvisionOut(
        id=str(contractor.id),
        company_name=contractor.company_name,
        contact_person=contractor.contact_person or "",
        email=contractor.email,
        phone=contractor.phone or "",
        auth_user_id=contractor.auth_user_id,
        city=city.name,
        registration_id=str(registration.id),
        registration_number=registration.registration_number,
        registration_status=registration.status.value,
    )
