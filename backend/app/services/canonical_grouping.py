"""Durable, order-independent grouping for complaints describing one civic issue."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from difflib import SequenceMatcher
import logging
import math
import re
from typing import Iterable
from uuid import UUID, uuid4

from sqlalchemy import and_, select, text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.issue import IssueCluster, IssueComplaint

logger = logging.getLogger(__name__)

CATEGORY_ALIASES = {
    "road": "road_damage",
    "roads": "road_damage",
    "pothole": "road_damage",
    "water": "water_supply",
    "garbage": "garbage_collection",
    "waste": "garbage_collection",
    "streetlight": "street_lighting",
    "street_lights": "street_lighting",
    "street_light": "street_lighting",
}
STOP_WORDS = {
    "a", "an", "and", "are", "at", "be", "been", "for", "from", "has", "have",
    "in", "is", "it", "near", "of", "on", "our", "the", "there", "this", "to", "with",
    "we", "was", "were", "area", "please", "reported", "complaint", "issue",
}

def normalize_comparison_text(value: str | None) -> str:
    """Normalize text for matching while preserving the original complaint fields."""
    if not value:
        return ""
    value = value.casefold().replace("&", " and ")
    value = re.sub(r"[^\w\s]", " ", value, flags=re.UNICODE)
    return re.sub(r"\s+", " ", value).strip()


def normalize_category(value: str | None) -> str:
    normalized = normalize_comparison_text(value).replace(" ", "_")
    return CATEGORY_ALIASES.get(normalized, normalized or "other")


def normalize_area(value: str | None) -> str:
    normalized = normalize_comparison_text(value)
    normalized = re.sub(r"\bbaroda\b", "vadodara", normalized)
    normalized = re.sub(r"\bbangalore\b", "bengaluru", normalized)
    return normalized


def _tokens(value: str | None) -> set[str]:
    return {
        token for token in normalize_comparison_text(value).split()
        if len(token) >= 3 and token not in STOP_WORDS
    }


def _cosine(left: Iterable[float] | None, right: Iterable[float] | None) -> float | None:
    if not left or not right:
        return None
    try:
        a = [float(item) for item in left]
        b = [float(item) for item in right]
        if len(a) != len(b) or not a:
            return None
        numerator = sum(x * y for x, y in zip(a, b))
        left_norm = math.sqrt(sum(x * x for x in a))
        right_norm = math.sqrt(sum(y * y for y in b))
        if not left_norm or not right_norm:
            return None
        return max(0.0, min(1.0, numerator / (left_norm * right_norm)))
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def _text_score(new_complaint: Complaint, candidate: Complaint, new_embedding: list[float] | None) -> float:
    new_text = normalize_comparison_text(f"{new_complaint.title} {new_complaint.description}")
    candidate_text = normalize_comparison_text(f"{candidate.title} {candidate.description}")
    new_tokens = _tokens(new_text)
    candidate_tokens = _tokens(candidate_text)
    lexical = (2.0 * len(new_tokens & candidate_tokens) / (len(new_tokens) + len(candidate_tokens))) if new_tokens and candidate_tokens else 0.0
    sequence = SequenceMatcher(None, new_text, candidate_text).ratio() if new_text and candidate_text else 0.0
    candidate_embedding = candidate.analysis.embedding_vector if candidate.analysis else None
    semantic = _cosine(new_embedding, candidate_embedding)
    if semantic is not None:
        return round(max(semantic * 0.75 + lexical * 0.25, lexical), 6)
    return round(lexical * 0.7 + sequence * 0.3, 6)


def _distance_meters(left: Complaint, right: Complaint) -> float | None:
    if left.lat is None or left.lng is None or right.lat is None or right.lng is None:
        return None
    radius = 6371000.0
    lat1, lng1, lat2, lng2 = map(math.radians, [left.lat, left.lng, right.lat, right.lng])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
    return radius * 2 * math.asin(math.sqrt(max(0.0, min(1.0, a))))


def same_area(left: Complaint, right: Complaint) -> bool:
    """Require the same city plus a reliable ward, address, or coordinate match."""
    if left.city_id != right.city_id:
        return False

    distance = _distance_meters(left, right)
    if distance is not None:
        return distance <= float(settings.canonical_group_radius_meters)

    if left.ward_id is not None and right.ward_id is not None:
        return left.ward_id == right.ward_id

    left_area = normalize_area(left.address_text)
    right_area = normalize_area(right.address_text)
    if not left_area or not right_area:
        return False
    if left_area == right_area:
        return True
    left_tokens = _tokens(left_area)
    right_tokens = _tokens(right_area)
    return bool(left_tokens and right_tokens and len(left_tokens & right_tokens) >= 2 and (left_tokens <= right_tokens or right_tokens <= left_tokens))


def _candidate_complaints(db: Session, complaint: Complaint) -> list[Complaint]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=int(settings.canonical_group_window_days))
    query = select(Complaint).where(
        and_(
            Complaint.id != complaint.id,
            Complaint.city_id == complaint.city_id,
            Complaint.created_at >= cutoff,
            Complaint.status != "rejected",
        )
    ).order_by(Complaint.created_at.asc(), Complaint.id.asc())
    candidates = list(db.execute(query).scalars().unique())
    expected_category = normalize_category(complaint.category)
    return [candidate for candidate in candidates if normalize_category(candidate.category) == expected_category]


def _matched_candidates(db: Session, complaint: Complaint, embedding: list[float] | None) -> list[tuple[Complaint, float, float | None]]:
    candidates = _candidate_complaints(db, complaint)
    matched: list[tuple[Complaint, float, float | None]] = []
    for candidate in candidates:
        distance = _distance_meters(complaint, candidate)
        if not same_area(complaint, candidate):
            continue
        score = _text_score(complaint, candidate, embedding)
        if score >= float(settings.canonical_group_similarity_threshold):
            matched.append((candidate, score, distance))
    logger.info(
        "complaint_group_matching complaint_id=%s candidates=%d area_candidates=%d matches=%d threshold=%.3f",
        complaint.id,
        len(candidates),
        sum(1 for candidate in candidates if same_area(complaint, candidate)),
        len(matched),
        settings.canonical_group_similarity_threshold,
    )
    return matched


def select_canonical_group(group_ids: set[UUID]) -> UUID:
    """Choose the lexicographically lowest stable UUID when groups must merge."""
    if not group_ids:
        raise ValueError("At least one group ID is required")
    return sorted(group_ids, key=str)[0]


def _merge_groups(db: Session, group_ids: set[UUID]) -> UUID:
    ordered_ids = sorted(group_ids, key=str)
    canonical_id = select_canonical_group(group_ids)
    if len(group_ids) == 1:
        return canonical_id

    canonical = db.get(IssueCluster, canonical_id)
    if canonical is None:
        raise ValueError(f"Canonical issue group {canonical_id} not found")
    for obsolete_id in ordered_ids[1:]:
        obsolete_links = list(db.execute(select(IssueComplaint).where(IssueComplaint.issue_id == obsolete_id)).scalars())
        for old_link in obsolete_links:
            existing = db.get(IssueComplaint, {"issue_id": canonical_id, "complaint_id": old_link.complaint_id})
            if existing is None:
                db.add(IssueComplaint(
                    issue_id=canonical_id,
                    complaint_id=old_link.complaint_id,
                    similarity_score=old_link.similarity_score,
                    relationship_type=old_link.relationship_type,
                    confidence_score=old_link.confidence_score,
                    added_at=old_link.added_at,
                ))
            db.query(ComplaintAnalysis).filter(ComplaintAnalysis.complaint_id == old_link.complaint_id).update(
                {ComplaintAnalysis.candidate_issue_id: canonical_id}, synchronize_session=False
            )
        db.query(IssueComplaint).filter(IssueComplaint.issue_id == obsolete_id).delete(synchronize_session=False)
        db.query(IssueCluster).filter(IssueCluster.id == obsolete_id).delete(synchronize_session=False)
    db.flush()
    return canonical_id


def assign_canonical_group(db: Session, complaint: Complaint, embedding: list[float] | None) -> tuple[UUID, list[tuple[Complaint, float, float | None]], str]:
    """Assign a complaint to one durable group and merge matched groups deterministically."""
    bind = db.get_bind()
    if bind is not None and bind.dialect.name == "postgresql":
        db.execute(
            text("SELECT pg_advisory_xact_lock(hashtext(:lock_key))"),
            {"lock_key": f"civic-group:{complaint.city_id}:{normalize_category(complaint.category)}"},
        )
    matches = _matched_candidates(db, complaint, embedding)
    matched_group_ids = {
        group_id for group_id, in db.query(IssueComplaint.issue_id).filter(
            IssueComplaint.complaint_id.in_([candidate.id for candidate, _, _ in matches])
        ).all()
    }

    now = datetime.now(timezone.utc)
    if matched_group_ids:
        group_id = _merge_groups(db, matched_group_ids)
        group = db.get(IssueCluster, group_id)
        operation = "reused" if len(matched_group_ids) == 1 else "merged"
    else:
        group = IssueCluster(
            id=uuid4(),
            title=complaint.title,
            summary=complaint.description,
            category=normalize_category(complaint.category),
            department_id=complaint.department_id,
            ward_id=complaint.ward_id,
            city_id=complaint.city_id,
            status="open",
            risk_level="medium",
            risk_score=complaint.risk_score,
            complaint_count=0,
            centroid_lat=complaint.lat,
            centroid_lng=complaint.lng,
            first_seen_at=complaint.created_at or now,
            last_seen_at=now,
        )
        db.add(group)
        db.flush()
        group_id = group.id
        operation = "created"

    candidate_scores = {candidate.id: score for candidate, score, _ in matches}
    members_to_link = [complaint] + [candidate for candidate, _, _ in matches]
    for member in members_to_link:
        link = db.get(IssueComplaint, {"issue_id": group_id, "complaint_id": member.id})
        if link is None:
            score = candidate_scores.get(member.id, 1.0)
            db.add(IssueComplaint(
                issue_id=group_id,
                complaint_id=member.id,
                similarity_score=score,
                relationship_type="DUPLICATE" if member.id in candidate_scores else "UNIQUE",
                confidence_score=score,
                added_at=now,
            ))
        if member.analysis is not None:
            member.analysis.candidate_issue_id = group_id
            if member.id in candidate_scores:
                member.analysis.ai_status = "DUPLICATE"

    member_rows = list(db.execute(
        select(Complaint).join(IssueComplaint, IssueComplaint.complaint_id == Complaint.id).where(IssueComplaint.issue_id == group_id).order_by(Complaint.created_at.asc(), Complaint.id.asc())
    ).scalars().unique())
    group.complaint_count = len(member_rows)
    group.last_seen_at = max((member.created_at for member in member_rows if member.created_at), default=now)
    coords = [(member.lat, member.lng) for member in member_rows if member.lat is not None and member.lng is not None]
    if coords:
        group.centroid_lat = sum(lat for lat, _ in coords) / len(coords)
        group.centroid_lng = sum(lng for _, lng in coords) / len(coords)
    logger.info(
        "complaint_group_assigned complaint_id=%s group_id=%s operation=%s matched_groups=%s members=%d",
        complaint.id,
        group_id,
        operation,
        sorted(str(item) for item in matched_group_ids),
        len(member_rows),
    )
    return group_id, matches, operation


def group_members(db: Session, group_id: UUID, exclude_id: UUID | None = None) -> list[tuple[Complaint, IssueComplaint]]:
    query = select(Complaint, IssueComplaint).join(IssueComplaint, IssueComplaint.complaint_id == Complaint.id).where(IssueComplaint.issue_id == group_id)
    if exclude_id is not None:
        query = query.where(Complaint.id != exclude_id)
    query = query.order_by(Complaint.created_at.asc(), Complaint.id.asc())
    return list(db.execute(query).all())
