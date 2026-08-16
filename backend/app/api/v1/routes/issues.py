"""Issue API endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_officer
from app.schemas.issue import IssueDetailResponse, RebuildIssuesResponse
from app.services.issue_service import IssueService

router = APIRouter()


@router.get("", dependencies=[Depends(get_current_officer)])
def list_issues(
    risk: str | None = None,
    status: str | None = None,
    ward: int | None = None,
    db: Session = Depends(get_db),
):
    """List systemic issues (officer only)"""
    service = IssueService(db)
    return service.list_issues(risk=risk, status=status, ward=ward)


@router.get("/{issue_id}", response_model=IssueDetailResponse, dependencies=[Depends(get_current_officer)])
def get_issue(
    issue_id: UUID,
    db: Session = Depends(get_db),
):
    """Get issue detail (officer only)"""
    service = IssueService(db)
    return service.get_issue(issue_id)


@router.post("/rebuild", response_model=RebuildIssuesResponse, dependencies=[Depends(get_current_officer)])
def rebuild_issues(db: Session = Depends(get_db)):
    """Rebuild issue clusters from complaints (officer only)"""
    service = IssueService(db)
    return service.rebuild_issues()
