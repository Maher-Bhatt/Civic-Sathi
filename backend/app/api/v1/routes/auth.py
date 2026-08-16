"""Authentication API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.officer import OfficerLoginRequest, OfficerLoginResponse, OfficerInfo
from app.schemas.citizen import CitizenRegisterRequest, CitizenLoginRequest, CitizenAuthResponse, CitizenInfo
from app.models.user import User
from uuid import uuid4

router = APIRouter()


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
            detail="User with this email already exists"
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
            detail="User with this email already exists"
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

