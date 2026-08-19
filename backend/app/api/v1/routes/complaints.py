from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy import func as sqlfunc
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_officer_permission
from app.models.procurement import City
from app.models.user import User
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate,
    SimilarComplaintsResponse,
)
from app.schemas.common import ComplaintStatus
from app.services.complaint_service import ComplaintService

router = APIRouter()
OFFICER_ROLES = {"officer", "supervisor", "admin", "municipality"}


def resolve_city_id(db: Session, city_value: str | None) -> str | None:
    if not city_value:
        return None
    try:
        city = db.get(City, UUID(city_value))
    except (ValueError, TypeError, AttributeError):
        city = db.query(City).filter(
            sqlfunc.lower(City.name) == city_value.strip().lower()
        ).first()
    return str(city.id) if city else None


@router.post("", response_model=ComplaintResponse, status_code=http_status.HTTP_201_CREATED)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a complaint owned by the authenticated citizen."""
    service = ComplaintService(db)
    return service.create_complaint(
        complaint_data,
        submitted_by_id=current_user.id,
        submitted_by_name=current_user.name,
    )


@router.get("")
def list_complaints(
    ward: int | None = None,
    status_filter: str | None = Query(None, alias="status"),
    category: str | None = None,
    city: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List only the caller's complaints or an officer's permitted city data."""
    service = ComplaintService(db)
    requested_city_id = resolve_city_id(db, city)
    owner_id = None

    if current_user.role not in OFFICER_ROLES:
        owner_id = current_user.id
        requested_city_id = None
    elif current_user.role != "admin" and current_user.city:
        officer_city_id = resolve_city_id(db, current_user.city)
        if officer_city_id:
            requested_city_id = officer_city_id

    status_enum = None
    if status_filter:
        try:
            status_enum = ComplaintStatus(status_filter)
        except ValueError:
            raise HTTPException(
                status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid complaint status",
            )

    return service.list_complaints(
        ward=ward,
        status=status_enum,
        category=category,
        limit=limit,
        offset=offset,
        city=requested_city_id,
        submitted_by_id=owner_id,
    )


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get complaint detail for its owner or an authorized officer."""
    service = ComplaintService(db)
    try:
        uuid_id = UUID(complaint_id)
    except (ValueError, AttributeError):
        complaint = service.get_complaint_by_public_id_for_user(complaint_id, current_user)
        if not complaint:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail=f"Complaint {complaint_id} not found",
            )
        return complaint

    return service.get_complaint_for_user(uuid_id, current_user)


@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: str,
    status_update: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_officer = Depends(require_officer_permission("complaints.update")),
):
    """Update complaint status for designations permitted to operate the queue."""
    service = ComplaintService(db)
    return service.update_status(
        complaint_id,
        status_update.status,
        actor=current_officer,
        notes=status_update.notes,
    )


@router.get("/{complaint_id}/similar", response_model=SimilarComplaintsResponse)
def get_similar_complaints(
    complaint_id: UUID,
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_officer = Depends(require_officer_permission("complaints.read")),
):
    """Get similar complaints for an authorized municipal operator."""
    service = ComplaintService(db)
    return service.get_similar_complaints(complaint_id, limit)
