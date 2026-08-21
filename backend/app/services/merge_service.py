"""Officer-reviewed, deterministic AI-assisted complaint grouping."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
import hashlib
import math
from typing import Iterable
from uuid import UUID

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.errors import NotFoundException
from app.models.audit import AuditLog
from app.models.complaint import Complaint
from app.models.issue import IssueCluster, IssueComplaint
from app.models.procurement import City
from app.models.user import User
from app.schemas.issue import (
    MergeConfirmRequest,
    MergeMemberResponse,
    MergeProposal,
    MergeProposalResponse,
)
from app.services.canonical_grouping import (
    _distance_meters,
    _merge_groups,
    _text_score,
    normalize_category,
    normalize_area,
    same_area,
    select_canonical_group,
)
from app.services.issue_service import IssueService


ACTIVE_STATUSES = {"received", "in_review", "assigned", "in_progress", "under_review", "open"}


def city_for_officer(db: Session, officer: User) -> City:
    if officer.role == "admin":
        raise ValueError("A super-admin must select a city before grouping complaints")
    city_name = str(officer.city or "").strip().lower()
    city = db.query(City).filter(City.name.ilike(city_name)).first()
    if not city:
        raise ValueError("Officer city is not configured in the city registry")
    return city


def _complaint_query(db: Session, city: City, complaint_ids: list[UUID] | None = None) -> list[Complaint]:
    query = select(Complaint).where(
        and_(
            Complaint.city_id == city.id,
            Complaint.status.in_(ACTIVE_STATUSES),
            Complaint.status != "rejected",
        )
    )
    if complaint_ids:
        query = query.where(Complaint.id.in_(complaint_ids))
    query = query.order_by(Complaint.created_at.asc(), Complaint.id.asc()).limit(1000)
    return list(db.execute(query).scalars().unique())


def _find(parent: list[int], item: int) -> int:
    while parent[item] != item:
        parent[item] = parent[parent[item]]
        item = parent[item]
    return item


def _union(parent: list[int], left: int, right: int) -> None:
    root_left = _find(parent, left)
    root_right = _find(parent, right)
    if root_left != root_right:
        parent[root_right] = root_left


def _proposal_key(member_ids: Iterable[UUID], category: str, city_id: UUID) -> str:
    raw = f"{city_id}:{normalize_category(category)}:{','.join(sorted(str(item) for item in member_ids))}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:24]


def _area_label(members: list[Complaint]) -> str | None:
    for complaint in members:
        if complaint.ward and complaint.ward.ward_number is not None:
            return f"Ward {complaint.ward.ward_number}"
    for complaint in members:
        label = normalize_area(complaint.address_text)
        if label:
            return label.title()
    return None


def _member_response(complaint: Complaint) -> MergeMemberResponse:
    return MergeMemberResponse(
        id=complaint.id,
        public_id=complaint.public_id,
        title=complaint.title,
        description=complaint.description,
        category=normalize_category(complaint.category),
        status=str(complaint.status),
        priority=str(complaint.priority) if complaint.priority else None,
        risk_score=int(complaint.risk_score or complaint.severity_score or 0),
        city_id=complaint.city_id,
        ward_number=complaint.ward.ward_number if complaint.ward else None,
        address_text=complaint.address_text,
        lat=complaint.lat,
        lng=complaint.lng,
        created_at=complaint.created_at,
    )


def _proposal_components(complaints: list[Complaint]) -> tuple[list[list[Complaint]], dict[tuple[UUID, UUID], tuple[float, float | None]]]:
    parent = list(range(len(complaints)))
    edges: dict[tuple[UUID, UUID], tuple[float, float | None]] = {}
    threshold = float(settings.canonical_group_similarity_threshold)
    for left_index, left in enumerate(complaints):
        for right_index in range(left_index + 1, len(complaints)):
            right = complaints[right_index]
            if normalize_category(left.category) != normalize_category(right.category):
                continue
            if not same_area(left, right):
                continue
            score = _text_score(left, right, None)
            if score < threshold:
                continue
            distance = _distance_meters(left, right)
            key = tuple(sorted((left.id, right.id), key=str))
            edges[key] = (score, distance)
            _union(parent, left_index, right_index)

    groups: dict[int, list[Complaint]] = defaultdict(list)
    for index, complaint in enumerate(complaints):
        groups[_find(parent, index)].append(complaint)
    return [group for group in groups.values() if len(group) >= 2], edges


def build_merge_proposals(
    db: Session,
    officer: User,
    complaint_ids: list[UUID] | None = None,
    max_groups: int = 50,
) -> MergeProposalResponse:
    city = city_for_officer(db, officer)
    complaints = _complaint_query(db, city, complaint_ids)
    groups, edges = _proposal_components(complaints)
    proposals: list[MergeProposal] = []

    for members in sorted(groups, key=lambda group: (-len(group), str(group[0].id))):
        members = sorted(members, key=lambda item: (item.created_at, str(item.id)))
        member_ids = [item.id for item in members]
        pair_scores = []
        distances = []
        for index, left in enumerate(member_ids):
            for right in member_ids[index + 1:]:
                edge = edges.get(tuple(sorted((left, right), key=str)))
                if edge:
                    pair_scores.append(edge[0])
                    if edge[1] is not None:
                        distances.append(edge[1])
        existing_issue_ids = sorted({
            issue_id
            for issue_id, in db.query(IssueComplaint.issue_id).filter(IssueComplaint.complaint_id.in_(member_ids)).all()
        }, key=str)
        category = normalize_category(members[0].category)
        ward_number = members[0].ward.ward_number if members[0].ward else None
        area_label = _area_label(members)
        confidence = round(sum(pair_scores) / len(pair_scores), 3) if pair_scores else float(settings.canonical_group_similarity_threshold)
        proposal = MergeProposal(
            proposal_key=_proposal_key(member_ids, category, city.id),
            category=category,
            city_id=city.id,
            ward_number=ward_number,
            area_label=area_label,
            complaint_count=len(members),
            complaint_ids=member_ids,
            members=[_member_response(item) for item in members],
            confidence_score=confidence,
            min_distance_meters=round(min(distances), 1) if distances else None,
            existing_issue_ids=existing_issue_ids,
            explanation=(
                f"{len(members)} active {category.replace('_', ' ')} complaints share Vadodara/Bengaluru city scope, "
                f"a compatible ward/address or coordinate area, and text similarity above the configured threshold."
            ),
        )
        proposals.append(proposal)
        if len(proposals) >= max(1, min(max_groups, 100)):
            break

    return MergeProposalResponse(
        city=city.name,
        city_id=city.id,
        scanned_count=len(complaints),
        proposals=proposals,
        threshold=float(settings.canonical_group_similarity_threshold),
    )


def _refresh_group(db: Session, issue: IssueCluster, members: list[Complaint]) -> None:
    issue.complaint_count = len(members)
    issue.last_seen_at = max((item.created_at for item in members if item.created_at), default=issue.last_seen_at)
    coordinates = [(item.lat, item.lng) for item in members if item.lat is not None and item.lng is not None]
    if coordinates:
        issue.centroid_lat = sum(lat for lat, _ in coordinates) / len(coordinates)
        issue.centroid_lng = sum(lng for _, lng in coordinates) / len(coordinates)
    risk_scores = [int(item.risk_score or item.severity_score or 0) for item in members]
    issue.risk_score = max(risk_scores or [0])
    issue.risk_level = "critical" if issue.risk_score >= 85 else "high" if issue.risk_score >= 70 else "medium" if issue.risk_score >= 40 else "low"


def confirm_merge(db: Session, officer: User, request: MergeConfirmRequest) -> tuple[IssueCluster, str]:
    city = city_for_officer(db, officer)
    if len(request.complaint_ids) < 2 or len(request.complaint_ids) > 100:
        raise ValueError("Select between 2 and 100 complaints to merge")

    members = _complaint_query(db, city, request.complaint_ids)
    if len(members) != len(set(request.complaint_ids)):
        raise ValueError("One or more selected complaints are unavailable or outside your city")

    proposal_response = build_merge_proposals(db, officer, request.complaint_ids, max_groups=100)
    proposal = next((item for item in proposal_response.proposals if item.proposal_key == request.proposal_key), None)
    if proposal is None or set(proposal.complaint_ids) != set(request.complaint_ids):
        raise ValueError("The AI proposal is stale or the selected complaints changed; run grouping again")

    bind = db.get_bind()
    if bind is not None and bind.dialect.name == "postgresql":
        from sqlalchemy import text
        db.execute(text("SELECT pg_advisory_xact_lock(hashtext(:lock_key))"), {"lock_key": f"civic-ai-merge:{city.id}:{proposal.category}"})

    existing_ids = {
        issue_id for issue_id, in db.query(IssueComplaint.issue_id).filter(IssueComplaint.complaint_id.in_(request.complaint_ids)).all()
    }
    now = datetime.now(timezone.utc)
    operation = "created"
    if existing_ids:
        group_id = _merge_groups(db, existing_ids)
        issue = db.get(IssueCluster, group_id)
        if issue is None:
            raise NotFoundException("Existing issue group disappeared during merge")
        operation = "reused" if len(existing_ids) == 1 else "merged"
    else:
        primary = members[0]
        issue = IssueCluster(
            title=f"{proposal.category.replace('_', ' ').title()} near {proposal.area_label or 'reported area'}",
            summary=f"Officer-confirmed AI grouping of {len(members)} related citizen complaints.",
            category=proposal.category,
            department_id=primary.department_id,
            ward_id=primary.ward_id,
            city_id=city.id,
            status="approved",
            risk_level="medium",
            risk_score=0,
            complaint_count=0,
            centroid_lat=primary.lat,
            centroid_lng=primary.lng,
            first_seen_at=primary.created_at,
            last_seen_at=primary.created_at,
        )
        db.add(issue)
        db.flush()

    for index, complaint in enumerate(members):
        link = db.get(IssueComplaint, {"issue_id": issue.id, "complaint_id": complaint.id})
        if link is None:
            db.add(IssueComplaint(
                issue_id=issue.id,
                complaint_id=complaint.id,
                similarity_score=1.0 if index == 0 else proposal.confidence_score,
                relationship_type="PRIMARY" if index == 0 else "DUPLICATE",
                confidence_score=1.0 if index == 0 else proposal.confidence_score,
                added_at=now,
            ))
        if complaint.analysis is not None:
            complaint.analysis.candidate_issue_id = issue.id
            complaint.analysis.ai_status = "UNIQUE" if index == 0 else "DUPLICATE"

    issue.status = "approved"
    _refresh_group(db, issue, members)
    db.add(AuditLog(
        actor_id=str(officer.id),
        actor_name=officer.name or officer.email or "Municipal Officer",
        actor_role=officer.role,
        action="AI_GROUP_MERGE_CONFIRMED",
        entity_type="IssueCluster",
        entity_id=str(issue.id),
        entity_label=issue.title,
        new_value=str({"complaint_ids": [str(item.id) for item in members], "confidence": proposal.confidence_score}),
        reason="Officer-confirmed AI-assisted same-area/same-issue complaint grouping",
    ))
    db.commit()
    db.refresh(issue)
    return issue, operation
