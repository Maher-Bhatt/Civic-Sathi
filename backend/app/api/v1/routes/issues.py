"""Issue API endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_officer
from app.models.user import User
from app.models.procurement import City
from sqlalchemy import func
from app.schemas.issue import IssueDetailResponse, RebuildIssuesResponse
from app.services.issue_service import IssueService

router = APIRouter()


@router.get("", dependencies=[Depends(get_current_officer)])
def list_issues(
    risk: str | None = None,
    status: str | None = None,
    ward: int | None = None,
    db: Session = Depends(get_db),
    current: dict = Depends(get_current_officer),
):
    """List systemic issues (officer only)"""
    city_id = None
    if current.get("role") != "admin":
        user = db.get(User, UUID(current["sub"]))
        if user and user.city:
            city = db.query(City).filter(func.lower(City.name) == user.city.strip().lower()).first()
            city_id = city.id if city else None
    service = IssueService(db)
    return service.list_issues(risk=risk, status=status, ward=ward, city_id=city_id)


@router.get("/{issue_id}", response_model=IssueDetailResponse, dependencies=[Depends(get_current_officer)])
def get_issue(
    issue_id: UUID,
    db: Session = Depends(get_db),
):
    """Get issue detail (officer only)"""
    service = IssueService(db)
    return service.get_issue(issue_id)


@router.patch("/{issue_id}", response_model=IssueDetailResponse, dependencies=[Depends(get_current_officer)])
def update_issue(
    issue_id: UUID,
    patch_data: dict,
    db: Session = Depends(get_db),
):
    """Update issue status or department (officer only)"""
    service = IssueService(db)
    return service.update_issue(issue_id, patch_data)


@router.post("/rebuild", response_model=RebuildIssuesResponse, dependencies=[Depends(get_current_officer)])
def rebuild_issues(db: Session = Depends(get_db)):
    """Rebuild issue clusters from complaints (officer only)"""
    service = IssueService(db)
    return service.rebuild_issues()
