"""Security and authentication utilities"""

from typing import Annotated
from datetime import datetime, timedelta, timezone
from fastapi import Header, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import bcrypt

from app.core.config import settings
from app.core.database import get_db


# JWT Configuration
SECRET_KEY = settings.jwt_secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security_scheme = HTTPBearer()
optional_security_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to check against
        
    Returns:
        True if password matches, False otherwise
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create JWT access token.
    
    Args:
        data: Payload data to encode
        expires_delta: Optional expiration time delta
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
    """
    Verify JWT token from Authorization header.
    
    Args:
        credentials: HTTP Bearer credentials
        
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_officer_key(
    x_officer_key: Annotated[str | None, Header()] = None
) -> None:
    """
    Verify officer API key from request header.
    
    Args:
        x_officer_key: API key from X-Officer-Key header
        
    Raises:
        HTTPException: If key is missing or invalid
    """
    if not x_officer_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-Officer-Key header",
        )
    
    if x_officer_key != settings.officer_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid officer API key",
        )


OFFICER_ROLES = {"officer", "supervisor", "admin", "municipality", "collector"}

# Designation-level permissions are intentionally explicit. The broad legacy
# roles (admin, supervisor, municipality) retain full operational access, while
# ordinary officers are constrained by their persisted designation.
DESIGNATION_PERMISSIONS: dict[str, set[str]] = {
    "Ward Officer": {"dashboard.read", "map.read", "complaints.read", "complaints.update", "alerts.read"},
    "Field Inspector": {"dashboard.read", "map.read", "complaints.read", "complaints.update", "areas.read", "work_orders.inspect"},
    "Triage Officer": {"dashboard.read", "map.read", "complaints.read", "issues.read", "triage.review"},
    "Municipal Supervisor": {"*"},
    "Chief Engineer": {"dashboard.read", "map.read", "complaints.read", "tenders.manage", "work_orders.manage", "work_orders.inspect", "analytics.read"},
    "Commissioner": {"*"},
    "Department Head": {"*"},
}


def get_current_officer(token_data: dict = Depends(verify_token)) -> dict:
    """Get the verified JWT payload for any authenticated officer role."""
    role = token_data.get("role")
    if role not in OFFICER_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied - officer role required",
        )
    return token_data


def get_current_officer_user(
    token_data: dict = Depends(verify_token),
    db=Depends(get_db),
):
    """Resolve the current officer to the authoritative database User row."""
    from app.models.user import User

    if token_data.get("role") not in OFFICER_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied - officer role required",
        )
    user = db.query(User).filter(User.id == token_data.get("sub")).first()
    if not user or user.role not in OFFICER_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Officer account not found")
    return user


def is_super_admin_user(user) -> bool:
    """Return whether the persisted account may access the private admin command center."""
    email = str(getattr(user, "email", "") or "").strip().lower()
    return getattr(user, "role", None) == "admin" and email in settings.super_admin_email_set


def officer_has_permission(user, permission: str) -> bool:
    """Return whether a persisted officer designation may perform an action."""
    if getattr(user, "role", None) in {"admin", "supervisor", "municipality", "collector"}:
        return True
    designation = str(getattr(user, "designation", "") or "").strip()
    permissions = DESIGNATION_PERMISSIONS.get(designation, {"dashboard.read", "map.read", "complaints.read"})
    return "*" in permissions or permission in permissions


def require_officer_permission(permission: str):
    """FastAPI dependency factory for designation-aware officer authorization."""
    def dependency(user=Depends(get_current_officer_user)):
        if not officer_has_permission(user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your designation does not permit: {permission}",
            )
        return user

    return dependency


def get_current_user(token_data: dict = Depends(verify_token), db = Depends(get_db)):

    from app.models.user import User
    user = db.query(User).filter(User.id == token_data.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_security_scheme),
    db = Depends(get_db),
):
    """Return the authenticated user when a bearer token is supplied.

    Missing credentials are allowed so public map/list projections can remain
    reachable, but an invalid supplied token is still rejected instead of
    silently downgrading the caller to anonymous access.
    """
    if credentials is None:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired", headers={"WWW-Authenticate": "Bearer"})
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials", headers={"WWW-Authenticate": "Bearer"})

    from app.models.user import User
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found", headers={"WWW-Authenticate": "Bearer"})
    return user



def require_collector(user=Depends(get_current_user)):
    """Resolve a collector/commissioner account for municipality-scoped provisioning."""
    if getattr(user, "role", None) != "collector":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Collector-level municipality access is required",
        )
    if not getattr(user, "city", None):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Collector account has no assigned city",
        )
    return user
