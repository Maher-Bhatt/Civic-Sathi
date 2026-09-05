from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.complaint import Complaint
from app.models.procurement import Contractor, WorkOrder, WorkOrderStatus
from app.models.reputation import CivicAchievement, CivicImpactEvent, CivicMission, CivicProfile, MissionProgress, UserAchievement, XPTransaction
from app.models.user import User
from app.schemas.reputation import (
    CityReputationOut,
    CivicProfileSummaryOut,
    CityImpactOut,
    ImpactEventOut,
    MissionOut,
    ReputationBadgeOut,
    ReputationMeOut,
    ReputationPreferencesPatch,
    ReputationTransactionOut,
    ResolutionConfirmationOut,
    RolePerformanceOut,
)
from app.services.reputation_service import (
    city_impact,
    confirm_resolution,
    get_or_create_profile,
    profile_summary,
    reconcile_citizen,
    top_contributors,
)

router = APIRouter()


def _profile_summary(db: Session, user: User) -> tuple[CivicProfile, dict]:
    profile = reconcile_citizen(db, user) if user.role == "citizen" else get_or_create_profile(db, user)
    return profile, profile_summary(db, user, profile)


def _badges(db: Session, user: User) -> list[ReputationBadgeOut]:
    rows = db.query(CivicAchievement, UserAchievement).join(
        UserAchievement, UserAchievement.achievement_id == CivicAchievement.id
    ).filter(
        UserAchievement.user_id == user.id,
        UserAchievement.revoked_at.is_(None),
        CivicAchievement.active.is_(True),
    ).order_by(UserAchievement.awarded_at.desc()).limit(50).all()
    return [ReputationBadgeOut(
        code=achievement.code,
        name=achievement.name,
        description=achievement.description,
        awarded_at=award.awarded_at,
        revoked_at=award.revoked_at,
    ) for achievement, award in rows]


def _transactions(db: Session, user: User, limit: int = 20) -> list[ReputationTransactionOut]:
    rows = db.query(XPTransaction).filter(XPTransaction.user_id == user.id).order_by(XPTransaction.at.desc()).limit(limit).all()
    return [ReputationTransactionOut(
        id=str(row.id),
        amount=row.amount,
        action=row.action,
        reason=row.reason,
        source_type=row.source_type,
        source_id=row.source_id,
        status=row.status,
        verification_status=row.verification_status,
        at=row.at,
    ) for row in rows]


def _impact_events(db: Session, user: User, limit: int = 20) -> list[ImpactEventOut]:
    rows = db.query(CivicImpactEvent).filter(CivicImpactEvent.user_id == user.id).order_by(CivicImpactEvent.at.desc()).limit(limit).all()
    return [ImpactEventOut(
        id=str(row.id),
        event_type=row.event_type,
        impact_points=row.impact_points,
        source_type=row.source_type,
        source_id=row.source_id,
        verification_status=row.verification_status,
        at=row.at,
    ) for row in rows]


def _missions(db: Session, user: User) -> list[MissionOut]:
    now = datetime.now(timezone.utc)
    missions = db.query(CivicMission).filter(
        CivicMission.active.is_(True),
        (CivicMission.starts_at.is_(None) | (CivicMission.starts_at <= now)),
        (CivicMission.ends_at.is_(None) | (CivicMission.ends_at >= now)),
    ).order_by(CivicMission.ends_at.asc().nullslast()).limit(20).all()
    if not missions:
        return []
    progress_rows = db.query(MissionProgress).filter(
        MissionProgress.user_id == user.id,
        MissionProgress.mission_id.in_([mission.id for mission in missions]),
    ).all()
    progress_by_mission = {row.mission_id: row for row in progress_rows}
    return [MissionOut(
        code=mission.code,
        title=mission.title,
        description=mission.description,
        category=mission.category,
        progress=int(progress_by_mission.get(mission.id).progress_value if mission.id in progress_by_mission else 0),
        target=int(progress_by_mission.get(mission.id).target_value if mission.id in progress_by_mission else (mission.criteria_json or {}).get("target", 1)),
        xp_reward=mission.xp_reward,
        completed=bool(progress_by_mission.get(mission.id) and progress_by_mission[mission.id].completed_at),
        ends_at=mission.ends_at,
    ) for mission in missions]


def _city_impacts(db: Session, user: User) -> list[CityImpactOut]:
    # BUG-012: Complaint.city_id is a UUID FK, not a city name.
    # Fetch distinct city UUIDs, then resolve names, filtering out NULL city_ids.
    city_uuid_rows = db.query(func.distinct(Complaint.city_id)).filter(
        Complaint.submitted_by_id == user.id,
        Complaint.city_id.is_not(None),
    ).all()
    if not city_uuid_rows:
        return []
    city_uuids = [row[0] for row in city_uuid_rows if row[0] is not None]
    if not city_uuids:
        return []
    from app.models.procurement import City
    city_names = [name for (name,) in db.query(City.name).filter(City.id.in_(city_uuids)).order_by(City.name).all()]
    return [CityImpactOut(**city_impact(db, name)) for name in city_names]


@router.get("/me", response_model=ReputationMeOut)
def get_my_reputation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile, summary = _profile_summary(db, current_user)
    db.commit()
    return ReputationMeOut(
        profile=CivicProfileSummaryOut(**summary),
        badges=_badges(db, current_user),
        missions=_missions(db, current_user),
        transactions=_transactions(db, current_user),
        impact_events=_impact_events(db, current_user),
        city_impact=_city_impacts(db, current_user),
    )


@router.get("/me/ledger", response_model=list[ReputationTransactionOut])
def get_my_ledger(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _transactions(db, current_user, limit)


@router.patch("/me/preferences", response_model=CivicProfileSummaryOut)
def update_my_preferences(
    patch: ReputationPreferencesPatch,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_profile(db, current_user)
    for field in ("display_mode", "leaderboard_opt_in", "sharing_opt_in", "animation_enabled", "reward_notifications_enabled"):
        value = getattr(patch, field)
        if value is not None:
            setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return CivicProfileSummaryOut(**profile_summary(db, current_user, profile))


@router.post("/complaints/{complaint_id}/confirm-resolution", response_model=ResolutionConfirmationOut)
def confirm_my_resolution(
    complaint_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "citizen":
        raise HTTPException(status_code=403, detail="Only the citizen who submitted the complaint can confirm its resolution")
    try:
        xp_awarded, impact_awarded, profile = confirm_resolution(db, current_user, complaint_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        # BUG-011: Catch ORM errors (DetachedInstanceError etc.) and surface as 400/500
        db.rollback()
        import logging
        logging.getLogger("civicsathi.reputation").warning("confirm_resolution failed: %s", exc)
        raise HTTPException(status_code=500, detail="Could not record resolution confirmation at this time. Please try again.") from exc
    db.commit()
    return ResolutionConfirmationOut(
        success=True,
        xp_awarded=xp_awarded,
        impact_awarded=impact_awarded,
        message="Your resolution confirmation was recorded as a verified civic contribution.",
        profile=CivicProfileSummaryOut(**profile_summary(db, current_user, profile)),
    )


@router.get("/city/{city_name}", response_model=CityReputationOut)
def get_city_reputation(
    city_name: str,
    db: Session = Depends(get_db),
):
    if city_name.strip().lower() not in settings.command_center_city_name_set:
        raise HTTPException(status_code=404, detail="City is outside the active Civic Sathi scope")
    return CityReputationOut(
        city=CityImpactOut(**city_impact(db, city_name)),
        top_contributors=top_contributors(db, city_name),
    )


@router.get("/performance/me", response_model=RolePerformanceOut)
def get_my_role_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "citizen":
        profile, summary = _profile_summary(db, current_user)
        return RolePerformanceOut(
            role=current_user.role,
            subject_name=current_user.name,
            score=summary["reputation_score"],
            metrics={"xp": summary["xp_total"], "impact": summary["impact_score"], "verified_contributions": summary["verified_contributions"], "data_status": "live"},
            achievements=_badges(db, current_user),
        )
    if current_user.role in {"officer", "supervisor", "municipality", "admin"}:
        city_name = str(current_user.city or "").strip()
        base = db.query(Complaint).filter(Complaint.city_id.is_not(None))
        if city_name:
            from app.models.procurement import City
            city = db.query(City).filter(func.lower(City.name) == city_name.lower()).first()
            if city:
                base = base.filter(Complaint.city_id == city.id)
        handled = int(base.count())
        resolved = int(base.filter(Complaint.status == "resolved").count())
        rate = round((resolved / handled) * 100) if handled else 0
        return RolePerformanceOut(role=current_user.role, subject_name=current_user.name, score=rate, metrics={"handled_complaints": handled, "resolved_complaints": resolved, "resolution_rate": rate, "data_status": "live; quality metrics expand with inspection confirmations"}, achievements=[])
    if current_user.role == "contractor":
        contractor = db.query(Contractor).filter(Contractor.auth_user_id == str(current_user.id)).first()
        if not contractor:
            return RolePerformanceOut(role=current_user.role, subject_name=current_user.name, score=0, metrics={"data_status": "no linked contractor profile"}, achievements=[])
        total = int(db.query(func.count(WorkOrder.id)).filter(WorkOrder.contractor_id == contractor.id).scalar() or 0)
        completed = int(db.query(func.count(WorkOrder.id)).filter(WorkOrder.contractor_id == contractor.id, WorkOrder.status.in_((WorkOrderStatus.COMPLETED, WorkOrderStatus.CLOSED))).scalar() or 0)
        rework = int(db.query(func.count(WorkOrder.id)).filter(WorkOrder.contractor_id == contractor.id, WorkOrder.status == WorkOrderStatus.REWORK).scalar() or 0)
        score = round(((completed / total) * 70) + (max(0, 1 - (rework / max(total, 1))) * 30)) if total else 0
        return RolePerformanceOut(role=current_user.role, subject_name=contractor.company_name, score=score, metrics={"work_orders": total, "completed": completed, "rework": rework, "data_status": "live; inspection quality expands score"}, achievements=[])
    raise HTTPException(status_code=403, detail="No reputation performance is available for this role")
