"""Server-authoritative Civic Sathi reputation and impact calculations."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import and_, distinct, func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.complaint import Complaint
from app.models.issue import IssueComplaint
from app.models.procurement import City
from app.models.reputation import (
    CivicAchievement,
    CivicImpactEvent,
    CivicProfile,
    CivicReputationFlag,
    CivicRewardConfig,
    MissionProgress,
    UserAchievement,
    XPTransaction,
)
from app.models.user import User


LEVELS = [
    (1, 0, "Civic Observer"),
    (2, 100, "Community Reporter"),
    (3, 250, "Civic Contributor"),
    (4, 500, "Civic Guardian"),
    (5, 1000, "City Advocate"),
    (6, 2000, "Civic Champion"),
    (7, 3500, "Community Leader"),
    (8, 5500, "City Steward"),
    (9, 8000, "Civic Sathi"),
    (10, 12000, "Civic Sathi Mentor"),
]
DEFAULT_RULES: dict[str, Any] = {
    "xp": {
        "report_submitted": 5,
        "accurate_location": 3,
        "issue_confirmed": 10,
        "resolution_confirmed": 5,
    },
    "impact": {
        "issue_confirmed": 5,
        "resolution_confirmed": 8,
    },
    "daily_positive_xp_cap": 60,
}
BADGE_SEEDS = [
    ("first_report", "First Civic Report", "Submitted a genuine civic report.", {"reports": 1}),
    ("verified_reporter", "Verified Reporter", "Contributed to a report linked to a verified civic issue.", {"verified_reports": 1}),
    ("issue_identifier", "Issue Identifier", "Helped surface a recurring civic pattern.", {"verified_reports": 1}),
    ("resolution_contributor", "Resolution Contributor", "Confirmed a genuine civic resolution.", {"resolutions": 1}),
    ("community_contributor", "Community Contributor", "Supported three verified civic contributions.", {"verified_reports": 3}),
    ("civic_guardian", "Civic Guardian", "Reached Level 4 through meaningful participation.", {"level": 4}),
]


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _rules(db: Session) -> dict[str, Any]:
    row = db.query(CivicRewardConfig).filter(CivicRewardConfig.key == "default").first()
    if not row or not row.active:
        return DEFAULT_RULES
    merged = {**DEFAULT_RULES, **(row.value_json or {})}
    merged["xp"] = {**DEFAULT_RULES["xp"], **(merged.get("xp") or {})}
    merged["impact"] = {**DEFAULT_RULES["impact"], **(merged.get("impact") or {})}
    return merged


def get_or_create_profile(db: Session, user: User) -> CivicProfile:
    profile = db.query(CivicProfile).filter(CivicProfile.user_id == user.id).first()
    if profile:
        return profile
    profile = CivicProfile(user_id=user.id)
    db.add(profile)
    db.flush()
    return profile


def level_for_xp(xp: int) -> tuple[int, int, str, int]:
    current = LEVELS[0]
    for candidate in LEVELS:
        if xp >= candidate[1]:
            current = candidate
        else:
            break
    next_xp = next((entry[1] for entry in LEVELS if entry[1] > current[1]), current[1])
    return current[0], current[1], current[2], next_xp


def _refresh_profile_metrics(db: Session, profile: CivicProfile) -> None:
    xp = max(0, int(profile.xp_total or 0))
    level, _, _, _ = level_for_xp(xp)
    profile.level = level
    impact = db.query(func.coalesce(func.sum(CivicImpactEvent.impact_points), 0)).filter(
        CivicImpactEvent.user_id == profile.user_id,
        CivicImpactEvent.verification_status == "verified",
    ).scalar()
    profile.impact_score = max(0, int(impact or 0))
    verified = db.query(func.count(distinct(IssueComplaint.complaint_id))).join(
        Complaint, Complaint.id == IssueComplaint.complaint_id
    ).filter(
        Complaint.submitted_by_id == profile.user_id,
        Complaint.status != "rejected",
    ).scalar()
    profile.reputation_score = min(100, max(0, int(verified or 0) * 10 + min(profile.impact_score, 40)))


def award_xp(
    db: Session,
    user: User,
    *,
    amount: int,
    action: str,
    reason: str,
    source_type: str,
    source_id: str | None,
    idempotency_key: str,
    verification_status: str = "verified",
    metadata: dict | None = None,
) -> XPTransaction | None:
    """Create a single idempotent XP transaction subject to the daily cap."""
    existing = db.query(XPTransaction).filter(XPTransaction.idempotency_key == idempotency_key).first()
    if existing:
        return existing
    if amount <= 0:
        return None
    start = _now().replace(hour=0, minute=0, second=0, microsecond=0)
    daily = db.query(func.coalesce(func.sum(XPTransaction.amount), 0)).filter(
        XPTransaction.user_id == user.id,
        XPTransaction.status == "granted",
        XPTransaction.amount > 0,
        XPTransaction.at >= start,
    ).scalar()
    cap = int((_rules(db).get("daily_positive_xp_cap") or 60))
    if int(daily or 0) + amount > cap:
        flag = CivicReputationFlag(
            user_id=user.id,
            reason="daily_xp_cap_reached",
            severity="low",
            source_type=source_type,
            source_id=source_id,
            signals_json={"daily_total": int(daily or 0), "requested": amount, "cap": cap},
        )
        db.add(flag)
        return None
    transaction = XPTransaction(
        user_id=user.id,
        amount=amount,
        action=action,
        reason=reason,
        source_type=source_type,
        source_id=source_id,
        idempotency_key=idempotency_key,
        status="granted",
        verification_status=verification_status,
        metadata_json=metadata,
    )
    db.add(transaction)
    profile = get_or_create_profile(db, user)
    profile.xp_total = max(0, int(profile.xp_total or 0) + amount)
    profile.last_meaningful_activity_at = _now()
    _refresh_profile_metrics(db, profile)
    return transaction


def award_impact(
    db: Session,
    user: User,
    *,
    city_id,
    event_type: str,
    impact_points: int,
    source_type: str,
    source_id: str | None,
    idempotency_key: str,
    metadata: dict | None = None,
) -> CivicImpactEvent | None:
    existing = db.query(CivicImpactEvent).filter(CivicImpactEvent.idempotency_key == idempotency_key).first()
    if existing:
        return existing
    if impact_points <= 0:
        return None
    event = CivicImpactEvent(
        user_id=user.id,
        city_id=city_id,
        event_type=event_type,
        impact_points=impact_points,
        source_type=source_type,
        source_id=source_id,
        idempotency_key=idempotency_key,
        verification_status="verified",
        metadata_json=metadata,
    )
    db.add(event)
    profile = get_or_create_profile(db, user)
    profile.impact_score = int(profile.impact_score or 0) + impact_points
    _refresh_profile_metrics(db, profile)
    return event


def _ensure_badge_catalog(db: Session) -> None:
    for code, name, description, criteria in BADGE_SEEDS:
        existing = db.query(CivicAchievement).filter(CivicAchievement.code == code).first()
        if not existing:
            db.add(CivicAchievement(code=code, name=name, description=description, role="citizen", criteria_json=criteria, active=True))


def _award_badge_if_missing(db: Session, user: User, code: str, source_event_id: str | None = None) -> None:
    achievement = db.query(CivicAchievement).filter(CivicAchievement.code == code, CivicAchievement.active.is_(True)).first()
    if not achievement:
        return
    exists = db.query(UserAchievement).filter(
        UserAchievement.user_id == user.id,
        UserAchievement.achievement_id == achievement.id,
        UserAchievement.revoked_at.is_(None),
    ).first()
    if not exists:
        db.add(UserAchievement(user_id=user.id, achievement_id=achievement.id, source_event_id=source_event_id))


def reconcile_citizen(db: Session, user: User) -> CivicProfile:
    """Backfill only explainable rewards from persisted complaint/issue state."""
    profile = get_or_create_profile(db, user)
    _ensure_badge_catalog(db)
    rules = _rules(db)
    complaints = db.query(Complaint).filter(Complaint.submitted_by_id == user.id).all()
    verified_ids = {
        complaint_id for complaint_id, in db.query(IssueComplaint.complaint_id).join(
            Complaint, Complaint.id == IssueComplaint.complaint_id
        ).filter(Complaint.submitted_by_id == user.id).all()
    }
    for complaint in complaints:
        if complaint.status == "rejected":
            continue
        award_xp(
            db, user,
            amount=int(rules["xp"].get("report_submitted", 5)),
            action="report_submitted",
            reason="Genuine civic report entered the platform",
            source_type="complaint",
            source_id=str(complaint.id),
            idempotency_key=f"report:{complaint.id}",
            metadata={"public_id": complaint.public_id},
        )
        _award_badge_if_missing(db, user, "first_report", str(complaint.id))
        if complaint.lat is not None and complaint.lng is not None:
            award_xp(
                db, user,
                amount=int(rules["xp"].get("accurate_location", 3)),
                action="accurate_location",
                reason="Report included a usable civic location",
                source_type="complaint",
                source_id=str(complaint.id),
                idempotency_key=f"location:{complaint.id}",
            )
        if complaint.id in verified_ids:
            award_xp(
                db, user,
                amount=int(rules["xp"].get("issue_confirmed", 10)),
                action="issue_confirmed",
                reason="Report contributed to a verified civic issue cluster",
                source_type="issue_link",
                source_id=str(complaint.id),
                idempotency_key=f"issue-confirmed:{complaint.id}",
            )
            award_impact(
                db, user,
                city_id=complaint.city_id,
                event_type="issue_confirmed",
                impact_points=int(rules["impact"].get("issue_confirmed", 5)),
                source_type="issue_link",
                source_id=str(complaint.id),
                idempotency_key=f"impact:issue-confirmed:{complaint.id}",
            )
            _award_badge_if_missing(db, user, "verified_reporter", str(complaint.id))
            _award_badge_if_missing(db, user, "issue_identifier", str(complaint.id))
    _refresh_profile_metrics(db, profile)
    if len(verified_ids) >= 3:
        _award_badge_if_missing(db, user, "community_contributor")
    if profile.level >= 4:
        _award_badge_if_missing(db, user, "civic_guardian")
    db.flush()
    return profile


def confirm_resolution(db: Session, user: User, complaint_id) -> tuple[int, int, CivicProfile]:
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id,
        Complaint.submitted_by_id == user.id,
    ).first()
    if not complaint:
        raise ValueError("Complaint not found for this citizen")
    if str(complaint.status).lower() != "resolved":
        raise ValueError("Resolution can be confirmed only after the complaint is resolved")
    rules = _rules(db)
    transaction = award_xp(
        db, user,
        amount=int(rules["xp"].get("resolution_confirmed", 5)),
        action="resolution_confirmed",
        reason="Citizen confirmed that a civic resolution was genuine",
        source_type="complaint",
        source_id=str(complaint.id),
        idempotency_key=f"resolution-confirmed:{complaint.id}",
    )
    event = award_impact(
        db, user,
        city_id=complaint.city_id,
        event_type="resolution_confirmed",
        impact_points=int(rules["impact"].get("resolution_confirmed", 8)),
        source_type="complaint",
        source_id=str(complaint.id),
        idempotency_key=f"impact:resolution-confirmed:{complaint.id}",
    )
    _ensure_badge_catalog(db)
    _award_badge_if_missing(db, user, "resolution_contributor", str(complaint.id))
    profile = get_or_create_profile(db, user)
    _refresh_profile_metrics(db, profile)
    db.flush()
    return int(transaction.amount if transaction else 0), int(event.impact_points if event else 0), profile


def profile_summary(db: Session, user: User, profile: CivicProfile) -> dict[str, Any]:
    level, current_xp, level_name, next_xp = level_for_xp(int(profile.xp_total or 0))
    denominator = max(1, next_xp - current_xp)
    pct = int(min(100, max(0, ((int(profile.xp_total or 0) - current_xp) / denominator) * 100)))
    reports_submitted = db.query(func.count(Complaint.id)).filter(
        Complaint.submitted_by_id == user.id,
        Complaint.status != "rejected",
    ).scalar()
    verified = db.query(func.count(distinct(IssueComplaint.complaint_id))).join(
        Complaint, Complaint.id == IssueComplaint.complaint_id
    ).filter(Complaint.submitted_by_id == user.id, Complaint.status != "rejected").scalar()
    resolutions = db.query(func.count(CivicImpactEvent.id)).filter(
        CivicImpactEvent.user_id == user.id,
        CivicImpactEvent.event_type == "resolution_confirmed",
        CivicImpactEvent.verification_status == "verified",
    ).scalar()
    return {
        "user_id": str(user.id),
        "role": str(user.role),
        "xp_total": int(profile.xp_total or 0),
        "impact_score": int(profile.impact_score or 0),
        "reputation_score": int(profile.reputation_score or 0),
        "level": level,
        "level_name": level_name,
        "current_level_xp": current_xp,
        "next_level_xp": next_xp,
        "level_progress_pct": pct,
        "streak_days": int(profile.streak_days or 0),
        "display_mode": profile.display_mode,
        "leaderboard_opt_in": profile.leaderboard_opt_in,
        "sharing_opt_in": profile.sharing_opt_in,
        "animation_enabled": profile.animation_enabled,
        "reward_notifications_enabled": profile.reward_notifications_enabled,
        "reports_submitted": int(reports_submitted or 0),
        "verified_contributions": int(verified or 0),
        "resolutions_supported": int(resolutions or 0),
    }


def city_impact(db: Session, city_name: str) -> dict[str, Any]:
    city = db.query(City).filter(func.lower(City.name) == city_name.strip().lower()).first()
    if not city:
        return {"city_name": city_name, "milestone": None}
    reports = int(db.query(func.count(Complaint.id)).filter(Complaint.city_id == city.id).scalar() or 0)
    resolved = int(db.query(func.count(Complaint.id)).filter(Complaint.city_id == city.id, Complaint.status == "resolved").scalar() or 0)
    verified = int(db.query(func.count(distinct(IssueComplaint.complaint_id))).join(
        Complaint, Complaint.id == IssueComplaint.complaint_id
    ).filter(Complaint.city_id == city.id, Complaint.status != "rejected").scalar() or 0)
    contributing = int(db.query(func.count(distinct(Complaint.submitted_by_id))).filter(
        Complaint.city_id == city.id,
        Complaint.submitted_by_id.is_not(None),
    ).scalar() or 0)
    impact = int(db.query(func.coalesce(func.sum(CivicImpactEvent.impact_points), 0)).filter(
        CivicImpactEvent.city_id == city.id,
        CivicImpactEvent.verification_status == "verified",
    ).scalar() or 0)
    milestone = None
    if resolved >= 1000:
        milestone = "1,000 resolved civic reports"
    elif resolved >= 100:
        milestone = "100 resolved civic reports"
    elif verified >= 100:
        milestone = "100 verified civic reports"
    return {
        "city_name": city.name,
        "contributing_citizens": contributing,
        "reports": reports,
        "verified_reports": verified,
        "resolved_reports": resolved,
        "impact_points": impact,
        "milestone": milestone,
    }


def display_name(user: User, profile: CivicProfile) -> str:
    name = str(user.name or "Civic Contributor").strip()
    if profile.display_mode == "alias":
        return f"Civic Contributor #{str(user.id).replace('-', '')[-4:]}"
    if profile.display_mode == "first_name":
        return name.split(" ")[0]
    initials = "".join(part[:1] for part in name.split()[:2]).upper()
    return initials or "CS"


def top_contributors(db: Session, city_name: str, limit: int = 10) -> list[dict[str, Any]]:
    rows = db.query(User, CivicProfile).join(CivicProfile, CivicProfile.user_id == User.id).filter(
        CivicProfile.leaderboard_opt_in.is_(True),
        func.lower(User.city) == city_name.strip().lower(),
        User.role == "citizen",
    ).order_by(CivicProfile.impact_score.desc(), CivicProfile.reputation_score.desc()).limit(limit).all()
    return [
        {"display_name": display_name(user, profile), "impact_score": int(profile.impact_score or 0), "reputation_score": int(profile.reputation_score or 0)}
        for user, profile in rows
    ]


def reconcile_all_citizens(db: Session, *, limit: int = 500, city_name: str | None = None) -> dict[str, int]:
    """Reconcile a bounded citizen batch from persisted complaint and issue state.

    This is intentionally callable rather than silently launching a worker. A
    deployment scheduler can invoke the protected admin endpoint at a low
    frequency, while normal user reads remain fast and event hooks provide
    immediate rewards for new activity.
    """
    query = db.query(User).filter(User.role == "citizen").order_by(User.created_at.asc()).limit(max(1, min(limit, 5000)))
    users = query.all()
    if city_name:
        normalized = city_name.strip().lower()
        users = [user for user in users if str(user.city or "").strip().lower() == normalized]
    for user in users:
        reconcile_citizen(db, user)
    db.commit()
    return {"users_scanned": len(users), "city_scoped": 1 if city_name else 0}
