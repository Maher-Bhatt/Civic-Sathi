"""Authentication API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from typing import Annotated, Optional
import datetime

from app.core.database import get_db
from app.core.config import settings

from app.core.security import (
    create_access_token, hash_password, verify_password, verify_officer_key,
    is_super_admin_user,
)

from app.schemas.officer import OfficerLoginRequest, OfficerLoginResponse, OfficerInfo
from app.schemas.citizen import CitizenRegisterRequest, CitizenLoginRequest, CitizenAuthResponse, CitizenInfo
from app.models.user import User
from app.models.audit import AuditLog
from app.models.procurement import Contractor, ContractorCityRegistration, City, RegistrationStatus
from app.services.password_reset import (
    ResetDeliveryUnavailable,
    choose_target,
    deliver_otp,
    digest_otp,
    generate_otp,
    mask_destination,
    otp_matches,
)

from uuid import uuid4, UUID
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()


# ── /me — works for ALL authenticated users (citizen, officer, admin, contractor) ──

class MeOut(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    city: Optional[str] = None
    department: Optional[str] = None
    ward: Optional[str] = None
    designation: Optional[str] = None
    is_super_admin: bool = False


@router.get("/me", response_model=MeOut)
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: Session = Depends(get_db),
):
    """Return the current authenticated user's profile. Works for all roles."""
    from app.core.security import SECRET_KEY, ALGORITHM
    import jwt as pyjwt
    try:
        payload = pyjwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.get(User, UUID(payload["sub"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return MeOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        city=user.city,
        department=user.department,
        ward=user.ward,
        designation=user.designation,
        is_super_admin=is_super_admin_user(user),
    )


# ── Admin / Officer setup schema ──────────────────────────────────────────────

class AdminSetupRequest(BaseModel):
    """Create the first admin or officer user — requires OFFICER_API_KEY header."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(default="admin", description="admin | officer | supervisor | municipality | collector")
    city: str | None = None
    department: str | None = None
    phone: str = Field(..., min_length=7, max_length=20)


class AdminSetupResponse(BaseModel):
    message: str
    user_id: str
    email: str
    role: str


@router.post("/officer-login", response_model=OfficerLoginResponse)
def officer_login(
    login_data: OfficerLoginRequest,
    db: Session = Depends(get_db),
):
    """
    Officer login endpoint - returns JWT token.
    """
    email = login_data.email.strip().lower()

    # Check if user exists
    user = db.query(User).filter(User.email == email).first()

    if not user or not user.password_hash or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify user is an officer
    if user.role not in ["admin", "officer", "supervisor", "municipality", "collector"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied - officer role required"
        )

    def normalize_context(value: str | None) -> str:
        return (value or "").strip().lower().replace("_", " ").replace("-", " ")

    if login_data.city and user.city and normalize_context(login_data.city) != normalize_context(user.city):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This officer account is assigned to a different city")
    # Designation is returned from the account record and is not an
    # authentication factor. Older municipality bundles still submit a
    # default designation, so never reject a valid account for that legacy
    # client value.

    # Record a durable authentication event for the admin audit trail.
    db.add(AuditLog(
        actor_id=str(user.id),
        actor_name=user.name,
        actor_role=user.role,
        action="LOGIN_SUCCESS",
        entity_type="auth",
        entity_id=str(user.id),
        entity_label=user.email,
        reason="Successful authenticated session",
    ))
    db.commit()

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return OfficerLoginResponse(
        access_token=access_token,
        token_type="bearer",
        officer=OfficerInfo(
            id=str(user.id),
            name=user.name,
            email=user.email,
            department=user.department or "General",
            designation=user.designation,
            role=user.role.title(),
            city=user.city or "",
            is_super_admin=is_super_admin_user(user),
        ),
    )


@router.post("/admin-setup", response_model=AdminSetupResponse, dependencies=[Depends(verify_officer_key)])
def admin_setup(
    setup_data: AdminSetupRequest,
    db: Session = Depends(get_db),
):
    email = setup_data.email.strip().lower()

    allowed_roles = {"admin", "officer", "supervisor", "municipality", "collector"}
    if setup_data.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(allowed_roles)}",
        )

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email {email} already exists (role: {existing.role})",
        )

    user = User(
        id=uuid4(),
        role=setup_data.role,
        name=setup_data.name,
        email=email,
        password_hash=hash_password(setup_data.password),
        city=setup_data.city,
        department=setup_data.department,
        phone=setup_data.phone.strip(),
        ward="Admin",
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    return AdminSetupResponse(
        message=f"User '{setup_data.name}' created with role '{setup_data.role}'",
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )


@router.post("/register", response_model=CitizenAuthResponse)
def citizen_register(
    register_data: CitizenRegisterRequest,
    db: Session = Depends(get_db),
):
    email = register_data.email.strip().lower()

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    password_hash = hash_password(register_data.password)

    user = User(
        id=uuid4(),
        role="citizen",
        name=register_data.name,
        email=email,
        phone=register_data.phone,
        password_hash=password_hash,
        ward="Unassigned",
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return CitizenAuthResponse(
        access_token=access_token,
        token_type="bearer",
        citizen=CitizenInfo(
            id=str(user.id),
            name=user.name,
            email=user.email,
            phone=user.phone or "",
            ward=user.ward or "Unassigned",
            city=user.city,
            role=user.role,
            notifyStatus=True,
            notifyNearby=True,
        )
    )


@router.post("/login", response_model=CitizenAuthResponse)
def citizen_login(
    login_data: CitizenLoginRequest,
    db: Session = Depends(get_db),
):
    email = login_data.email.strip().lower()

    user = db.query(User).filter(
        User.email == email,
        User.role.in_(["citizen", "contractor"])
    ).first()

    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return CitizenAuthResponse(
        access_token=access_token,
        token_type="bearer",
        citizen=CitizenInfo(
            id=str(user.id),
            name=user.name,
            email=user.email,
            phone=user.phone or "",
            ward=user.ward or "Unassigned",
            city=user.city,
            role=user.role,
            notifyStatus=True,
            notifyNearby=True,
        )
    )

@router.post("/contractor-login", response_model=CitizenAuthResponse)
def contractor_login(
    login_data: CitizenLoginRequest,
    db: Session = Depends(get_db),
):
    email = login_data.email.strip().lower()

    user = db.query(User).filter(
        User.email == email,
        User.role == "contractor"
    ).first()

    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    requested_city = (login_data.city or "").strip().lower()
    if not requested_city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Municipality city is required for contractor login"
        )

    contractor = db.query(Contractor).filter(
        Contractor.auth_user_id == str(user.id)
    ).first()
    if not contractor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Contractor company profile is not linked to this login"
        )

    eligible_registration = (
        db.query(ContractorCityRegistration)
        .join(City, City.id == ContractorCityRegistration.city_id)
        .filter(
            ContractorCityRegistration.contractor_id == contractor.id,
            ContractorCityRegistration.status == RegistrationStatus.APPROVED,
            func.lower(City.name) == requested_city,
        )
        .first()
    )
    if not eligible_registration:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This contractor is not approved for the selected municipality"
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role, "city": requested_city}
    )

    return CitizenAuthResponse(
        access_token=access_token,
        token_type="bearer",
        citizen=CitizenInfo(
            id=str(user.id),
            name=user.name,
            email=user.email,
            phone=user.phone or "",
            ward=user.ward or "Unassigned",
            city=requested_city,
            role=user.role,
            notifyStatus=True,
            notifyNearby=True,
        )
    )


class PasswordResetRequest(BaseModel):
    identifier: str = Field(..., min_length=3, max_length=255, description="Account email or phone")
    channel: str = Field(default="auto", pattern="^(auto|email|sms)$")


class PasswordResetRequestResponse(BaseModel):
    accepted: bool
    message: str
    channel: str | None = None
    destination: str | None = None


class PasswordResetConfirm(BaseModel):
    identifier: str = Field(..., min_length=3, max_length=255)
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")
    new_password: str = Field(..., min_length=8, max_length=100)


class PasswordResetConfirmResponse(BaseModel):
    success: bool
    message: str


@router.post("/password-reset/request", response_model=PasswordResetRequestResponse, status_code=status.HTTP_202_ACCEPTED)
async def request_password_reset(
    reset_data: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    """Issue a short-lived OTP through configured Brevo email or MSG91 SMS delivery."""
    identifier = reset_data.identifier.strip()
    email_identifier = identifier.lower()
    user = db.query(User).filter(func.lower(User.email) == email_identifier).first()
    if not user:
        user = db.query(User).filter(User.phone == identifier).first()

    generic_message = "If the account exists, a password reset code has been sent to its verified contact."
    if not user:
        return PasswordResetRequestResponse(accepted=True, message=generic_message)

    try:
        target = choose_target(user, reset_data.channel)
    except ResetDeliveryUnavailable:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset delivery is not configured yet. Please contact the platform administrator.",
        )

    otp = generate_otp()
    now = datetime.datetime.now(datetime.timezone.utc)
    user.reset_otp_hash = digest_otp(otp)
    user.reset_otp_expires_at = now + datetime.timedelta(seconds=settings.password_reset_otp_ttl_seconds)
    user.reset_otp_attempts = 0
    user.reset_otp_channel = target.channel
    user.reset_otp_requested_at = now
    db.commit()

    try:
        await deliver_otp(target, otp, user.name)
    except Exception as exc:
        db.rollback()
        user = db.get(User, user.id)
        if user:
            user.reset_otp_hash = None
            user.reset_otp_expires_at = None
            user.reset_otp_attempts = 0
            user.reset_otp_channel = None
            user.reset_otp_requested_at = None
            db.commit()
        print(f"[PasswordReset] delivery failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The reset provider could not deliver the code. Please retry or contact the platform administrator.",
        )

    return PasswordResetRequestResponse(
        accepted=True,
        message=generic_message,
        channel=target.channel,
        destination=mask_destination(target.channel, target.destination),
    )


@router.post("/password-reset/confirm", response_model=PasswordResetConfirmResponse)
def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db),
):
    """Verify an OTP once and replace the account password."""
    identifier = reset_data.identifier.strip()
    user = db.query(User).filter(func.lower(User.email) == identifier.lower()).first()
    if not user:
        user = db.query(User).filter(User.phone == identifier).first()
    if not user or not user.reset_otp_hash or not user.reset_otp_expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The reset code is invalid or expired.")

    now = datetime.datetime.now(datetime.timezone.utc)
    expires_at = user.reset_otp_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=datetime.timezone.utc)
    if now >= expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The reset code is invalid or expired.")
    if user.reset_otp_attempts >= settings.password_reset_max_attempts:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many reset attempts. Request a new code.")

    user.reset_otp_attempts += 1
    if not otp_matches(reset_data.otp, user.reset_otp_hash):
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The reset code is invalid or expired.")

    user.password_hash = hash_password(reset_data.new_password)
    user.reset_otp_hash = None
    user.reset_otp_expires_at = None
    user.reset_otp_attempts = 0
    user.reset_otp_channel = None
    user.reset_otp_requested_at = None
    db.commit()
    return PasswordResetConfirmResponse(success=True, message="Password reset successfully. You can now sign in.")
