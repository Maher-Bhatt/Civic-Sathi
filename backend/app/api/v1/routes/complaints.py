"""Complaint API endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_officer
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate,
    SimilarComplaintsResponse,
)
from app.schemas.common import ComplaintStatus, PaginatedResponse
from app.services.complaint_service import ComplaintService

router = APIRouter()


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
):
    """Create a new complaint"""
    service = ComplaintService(db)
    return service.create_complaint(complaint_data)


@router.get("")
def list_complaints(
    ward: int | None = None,
    status: str | None = None,
    category: str | None = None,
    limit: int = 20,
    offset: int = 0,
    request: Request = None,
    db: Session = Depends(get_db),
):
    """
    List complaints with filters.
    Public endpoint with pagination - returns recent complaints.
    Officers can use X-Officer-Key header for full access.
    """
    service = ComplaintService(db)
    
    # Optional auth for officers
    from app.models.user import User
    import jwt
    from app.core.security import SECRET_KEY, ALGORITHM
    
    city_filter = None
    try:
        # Check if requested by an authenticated officer
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            token_data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if token_data and token_data.get("sub"):
                officer = db.query(User).filter(User.id == token_data["sub"]).first()
                if officer and officer.city:
                    # Resolve officer's city name → City UUID
                    from app.models.procurement import City
                    from sqlalchemy import func as sqlfunc
                    city_obj = db.execute(
                        select(City).where(sqlfunc.lower(City.name) == officer.city.lower())
                    ).scalar_one_or_none()
                    if city_obj:
                        city_filter = str(city_obj.id)
    except Exception:
        pass
    
    status_enum = None
    if status:
        try:
            status_enum = ComplaintStatus(status)
        except ValueError:
            pass
    
    return service.list_complaints(
        ward=ward,
        status=status_enum,
        category=category,
        limit=limit,
        offset=offset,
        city=city_filter, # Assuming the service layer handles this
    )


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
):
    """
    Get complaint detail by public_id (JN-YYYY-NNNNN) or UUID.
    Public endpoint - no auth required for citizens to track their complaints.
    """
    from fastapi import HTTPException
    
    service = ComplaintService(db)
    
    # Try to parse as UUID first
    try:
        uuid_id = UUID(complaint_id)
        return service.get_complaint(uuid_id)
    except (ValueError, AttributeError):
        # Not a UUID, treat as public_id
        pass
    
    # Look up by public_id
    complaint = service.get_complaint_by_public_id(complaint_id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint {complaint_id} not found"
        )
    return complaint


@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: UUID,
    status_update: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Update complaint status (officer only)"""
    service = ComplaintService(db)
    return service.update_status(complaint_id, status_update.status)


@router.get("/{complaint_id}/similar", response_model=SimilarComplaintsResponse)
def get_similar_complaints(
    complaint_id: UUID,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Get similar complaints (officer only)"""
    service = ComplaintService(db)
    return service.get_similar_complaints(complaint_id, limit)
