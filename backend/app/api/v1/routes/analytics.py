"""Analytics API endpoints"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_officer
from app.schemas.analytics import DashboardSummary, MapDataResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    days: int = 30,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Get dashboard summary statistics (officer only, scoped to their city)"""
    city_id = current_officer.get("city_id") or current_officer.get("sub")
    service = AnalyticsService(db)
    return service.get_dashboard_summary(days=days, city_id=city_id)


@router.get("/map", response_model=MapDataResponse)
def get_map_data(
    days: int = 30,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Get map data for Leaflet visualization (officer only, scoped to their city)"""
    city_id = current_officer.get("city_id") or current_officer.get("sub")
    service = AnalyticsService(db)
    return service.get_map_data(days=days, city_id=city_id)


@router.post("/hotspots/detect")
def trigger_hotspot_detection(
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer),
):
    """Run hotspot detection logic on civic issues (officer only)"""
    service = AnalyticsService(db)
    return service.detect_hotspots()
