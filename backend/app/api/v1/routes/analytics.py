"""Analytics API endpoints"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_officer
from app.schemas.analytics import DashboardSummary, MapDataResponse
from app.services.analytics_service import AnalyticsService
from app.models.user import User

router = APIRouter()


def _resolve_officer_city(token: dict, db: Session) -> str | None:
    """
    Return the city UUID string for the current officer.
    Looks up the User row to get the city name, then resolves it to a City UUID.
    Falls back to None (no city filter) for admin/supervisor roles.
    """
    role = token.get("role", "")
    if role in ("admin", "supervisor"):
        return None  # admins see all data

    user = db.get(User, UUID(token["sub"]))
    if not user or not user.city:
        return None

    from app.models.procurement import City
    from sqlalchemy import select, func
    city = db.execute(
        select(City).where(func.lower(City.name) == user.city.lower())
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
