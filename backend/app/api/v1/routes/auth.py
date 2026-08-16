"""Authentication API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Annotated

from app.core.database import get_db
from app.core.security import (
    create_access_token, hash_password, verify_password, verify_officer_key,
)
from app.schemas.officer import OfficerLoginRequest, OfficerLoginResponse, OfficerInfo
from app.schemas.citizen import CitizenRegisterRequest, CitizenLoginRequest, CitizenAuthResponse, CitizenInfo
from app.models.user import User
from uuid import uuid4
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()


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
    
    For MVP, this performs basic email validation.
    In production, implement proper password hashing and verification.
    """
    # Check if user exists
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not user.password_hash or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify user is an officer
    if user.role not in ["officer", "supervisor", "admin", "municipality"]:
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
            role=user.role.title(),
            city=user.city or "",
        )
    )


@router.post("/admin-setup", response_model=AdminSetupResponse, dependencies=[Depends(verify_officer_key)])
def admin_setup(
    setup_data: AdminSetupRequest,
    db: Session = Depends(get_db),
):
    """
    Create an admin or officer user. Protected by X-Officer-Key header.
    Use this endpoint once to bootstrap the first admin account.
    Call with: X-Officer-Key: <OFFICER_API_KEY from backend .env>
    """
    allowed_roles = {"admin", "officer", "supervisor", "municipality"}
    if setup_data.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(allowed_roles)}",
        )

    existing = db.query(User).filter(User.email == setup_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email {setup_data.email} already exists (role: {existing.role})",
        )

    user = User(
        id=uuid4(),
        role=setup_data.role,
        name=setup_data.name,
        email=setup_data.email,
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
    """
    Citizen registration endpoint.
    Creates a new citizen account with email and password.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == register_data.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )
    
    # Hash the password
    password_hash = hash_password(register_data.password)
    
    # Create new citizen user
    user = User(
        id=uuid4(),
        role="citizen",
        name=register_data.name,
        email=register_data.email,
        phone=register_data.phone,
        password_hash=password_hash,
        ward="Unassigned",  # Default ward - can be updated later
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
    
    # Create access token
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
            phone=user.phone,
            ward=user.ward or "Unassigned",
            notifyStatus=True,
            notifyNearby=True,
        )
    )


@router.post("/login", response_model=CitizenAuthResponse)
def citizen_login(
    login_data: CitizenLoginRequest,
    db: Session = Depends(get_db),
):
    """
    Citizen login endpoint.
    Login with email and password.
    """
    # Find user by email
    user = db.query(User).filter(
        User.email == login_data.email,
        User.role.in_(["citizen", "contractor"])
    ).first()
    
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
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
            notifyStatus=True,
            notifyNearby=True,
        )
    )

