"""Analytics API endpoints"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_officer, is_super_admin_user
from app.schemas.analytics import DashboardSummary, MapDataResponse
from app.services.analytics_service import AnalyticsService
from app.models.user import User

router = APIRouter()


def _resolve_officer_city(token: dict, db: Session) -> str | None:
    """
    Return the city UUID string for the current officer.
    BUG-013: Only genuine super-admins (email in allowlist) see platform-wide analytics.
    Any user with role='admin' who is NOT in the super-admin allowlist is scoped to
    their own city, preventing unintended cross-city data exposure.
    """
    from app.models.procurement import City
    from sqlalchemy import select, func

    user = db.get(User, UUID(token["sub"]))
    if not user:
        return None

    # is_super_admin_user checks both role == "admin" AND email in allowlist
    if is_super_admin_user(user):
        return None  # super-admins see everything

    if not user.city:
        return None

    city = db.execute(
        select(City).where(func.lower(City.name) == user.city.strip().lower())
    ).scalar_one_or_none()
    return str(city.id) if city else None


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    days: int = 30,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Get dashboard summary statistics (officer only, scoped to their city)."""
    city_id = _resolve_officer_city(current_officer, db)
    service = AnalyticsService(db)
    return service.get_dashboard_summary(days=days, city_id=city_id)


@router.get("/map", response_model=MapDataResponse)
def get_map_data(
    days: int = 30,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Get map data for Leaflet visualization (officer only, scoped to their city)."""
    city_id = _resolve_officer_city(current_officer, db)
    service = AnalyticsService(db)
    return service.get_map_data(days=days, city_id=city_id)


@router.get("/public-map")
def get_public_map_data(
    city: str = "vadodara",
    time: str = "30d",
    issue: str = "all",
    health: str = "all",
    db: Session = Depends(get_db),
):
    """Get live aggregated statistics for the public civic map (open endpoint)."""
    service = AnalyticsService(db)
    return service.get_authoritative_map_data(
        city=city,
        time_window=time,
        issue_filter=issue,
        health_filter=health,
    )


@router.post("/hotspots/detect")
def trigger_hotspot_detection(
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Run hotspot detection logic on civic issues (officer only)."""
    service = AnalyticsService(db)
    return service.detect_hotspots()


@router.get("/state-command-center")
def get_state_command_center():
    """
    State-level command center telemetry for Government of Maharashtra (SIH26129).
    Aggregates active cases, SLA metrics, and digital twin coordinates across 27 municipal corporations.
    """
    from app.services.state_command_service import get_state_command_center_telemetry
    return get_state_command_center_telemetry()


@router.get("/predict-systemic-risk")
def predict_systemic_risk(
    title: str = "High-Pressure Water Conduit Rupture Causing Road Subsidence",
    description: str = "A 300mm underground municipal water main has burst beneath asphalt. Water gushing onto carriageway, causing sub-base soil erosion, crater, and pavement collapse.",
    severity: str = "CRITICAL",
    priority: str = "P1",
    departments: str = "water,roads",
    lat: float = 19.0596,
    lng: float = 72.8295,
    ward_name: str = "Ward H-West (Bandra West)",
    city_name: str = "Mumbai",
):
    """
    "What Happens If We Don't Fix This?"
    Predictive systemic risk simulator computing cascading infrastructure collapse radius,
    affected population, and financial escalation cost multiplier.
    """
    from app.services.predictive_risk import calculate_systemic_risk
    dept_list = [d.strip() for d in departments.split(",") if d.strip()]
    return calculate_systemic_risk(
        case_title=title,
        description=description,
        severity=severity,
        priority=priority,
        departments=dept_list,
        lat=lat,
        lng=lng,
        ward_name=ward_name,
        city_name=city_name,
    )

