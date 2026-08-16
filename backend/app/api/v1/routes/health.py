"""Health check endpoint"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db, check_db_connection
from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint for monitoring and deployment.
    Returns app version and database connectivity status.
    """
    db_healthy = check_db_connection()
    
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "database": "connected" if db_healthy else "disconnected",
    }
