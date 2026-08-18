"""Authentication API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Annotated, Optional

from app.core.database import get_db
from app.core.security import (
    create_access_token, hash_password, verify_password, verify_officer_key,
)
from app.schemas.officer import OfficerLoginRequest, OfficerLoginResponse, OfficerInfo
from app.schemas.citizen import CitizenRegisterRequest, CitizenLoginRequest, CitizenAuthResponse, CitizenInfo
from app.models.user import User
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
    )


# ── Admin / Officer setup schema ──────────────────────────────────────────────

class AdminSetupRequest(BaseModel):
    """Create the first admin or officer user — requires OFFICER_API_KEY header."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: str = Field(default="admin", description="admin | officer | supervisor | municipality")
    city: str | None = None
    department: str | None = None


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
    if user.role not in ["admin", "officer", "supervisor", "municipality"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied - officer role required"
        )
        


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
        )
    )


@router.post("/admin-setup", response_model=AdminSetupResponse, dependencies=[Depends(verify_officer_key)])
def admin_setup(
    setup_data: AdminSetupRequest,
    db: Session = Depends(get_db),
):
    email = setup_data.email.strip().lower()

    allowed_roles = {"admin", "officer", "supervisor", "municipality"}
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
            role=user.role,
            notifyStatus=True,
            notifyNearby=True,
        )
    )
