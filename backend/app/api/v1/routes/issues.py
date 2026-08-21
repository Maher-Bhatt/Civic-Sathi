"""Issue API endpoints"""

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_officer, require_officer_permission
from app.models.complaint import Complaint
from app.models.issue import IssueCluster, IssueComplaint
from app.models.procurement import City
from app.models.user import User
from app.schemas.issue import (
    IssueDetailResponse,
    RebuildIssuesResponse,
    MergeConfirmRequest,
    MergeConfirmResponse,
    MergeProposalRequest,
    MergeProposalResponse,
)
from app.services.issue_service import IssueService
from app.services.merge_service import build_merge_proposals, confirm_merge

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


@router.post("/merge-proposals", response_model=MergeProposalResponse)
def propose_ai_merge_groups(
    body: MergeProposalRequest,
    db: Session = Depends(get_db),
    officer: User = Depends(require_officer_permission("issues.merge")),
):
    """Return reviewable, non-mutating AI-assisted complaint grouping proposals."""
    try:
        return build_merge_proposals(db, officer, body.complaint_ids or None, body.max_groups)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.post("/merge-proposals/confirm", response_model=MergeConfirmResponse)
def confirm_ai_merge_group(
    body: MergeConfirmRequest,
    db: Session = Depends(get_db),
    officer: User = Depends(require_officer_permission("issues.merge")),
):
    """Confirm one reviewed proposal and persist one canonical civic issue."""
    try:
        issue, operation = confirm_merge(db, officer, body)
        issue_response = IssueService(db).get_issue(issue.id)
        return MergeConfirmResponse(
            success=True,
            issue=issue_response,
            complaint_ids=body.complaint_ids,
            operation=operation,
            audit_action="AI_GROUP_MERGE_CONFIRMED",
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=422, detail=str(exc)) from exc


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


@router.post("/materialize/{complaint_id}", response_model=IssueDetailResponse)
def materialize_complaint_issue(
    complaint_id: str,
    db: Session = Depends(get_db),
    current: dict = Depends(get_current_officer),
):
    """Create or return an approved civic issue for a complaint-backed demo handoff.

    This makes the human-approved municipality action explicit: a complaint-derived
    fallback card is converted into a persistent IssueCluster and linked through
    IssueComplaint before procurement can reference it.
    """
    officer = db.get(User, UUID(current["sub"]))
    if not officer:
        raise HTTPException(status_code=401, detail="Officer session not found")

    existing_issue = None
    try:
        issue_uuid = UUID(complaint_id)
        existing_issue = db.get(IssueCluster, issue_uuid)
    except (ValueError, TypeError):
        pass

    if existing_issue:
        if officer.role != "admin" and officer.city:
            city = db.query(City).filter(func.lower(City.name) == officer.city.strip().lower()).first()
            if not city or city.id != existing_issue.city_id:
                raise HTTPException(status_code=403, detail="This account cannot materialize an issue in another city")
        if existing_issue.status.lower() not in {"approved", "open", "assigned", "investigating"}:
            existing_issue.status = "approved"
            db.commit()
        return IssueService(db).get_issue(existing_issue.id)

    try:
        complaint_uuid = UUID(complaint_id)
        complaint = db.get(Complaint, complaint_uuid)
    except (ValueError, TypeError):
        complaint = db.query(Complaint).filter(Complaint.public_id == complaint_id.strip()).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if officer.role != "admin" and officer.city:
        city = db.query(City).filter(func.lower(City.name) == officer.city.strip().lower()).first()
        if not city or city.id != complaint.city_id:
            raise HTTPException(status_code=403, detail="This account cannot materialize an issue in another city")

    existing_link = db.query(IssueComplaint).filter(IssueComplaint.complaint_id == complaint.id).first()
    if existing_link:
        existing_issue = db.get(IssueCluster, existing_link.issue_id)
        if existing_issue:
            if existing_issue.status.lower() not in {"approved", "open", "assigned", "investigating"}:
                existing_issue.status = "approved"
                db.commit()
            return IssueService(db).get_issue(existing_issue.id)

    now = datetime.now(timezone.utc)
    severity = str(complaint.priority or "moderate").lower()
    risk_level = "critical" if severity == "critical" else "high" if severity == "high" else "medium"
    issue = IssueCluster(
        title=complaint.title,
        summary=complaint.description,
        category=complaint.category,
        department_id=complaint.department_id,
        ward_id=complaint.ward_id,
        city_id=complaint.city_id,
        status="approved",
        risk_level=risk_level,
        risk_score=int(complaint.risk_score or complaint.severity_score or 0),
        complaint_count=1,
        centroid_lat=complaint.lat,
        centroid_lng=complaint.lng,
        first_seen_at=complaint.created_at or now,
        last_seen_at=complaint.created_at or now,
    )
    db.add(issue)
    db.flush()
    db.add(IssueComplaint(
        issue_id=issue.id,
        complaint_id=complaint.id,
        similarity_score=1.0,
        relationship_type="PRIMARY",
        confidence_score=1.0,
        added_at=now,
    ))
    if complaint.analysis and not complaint.analysis.candidate_issue_id:
        complaint.analysis.candidate_issue_id = issue.id
    db.commit()
    db.refresh(issue)
    return IssueService(db).get_issue(issue.id)
