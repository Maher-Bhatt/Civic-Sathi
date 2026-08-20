"""Cities API endpoint"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import get_db
from app.models.procurement import City

router = APIRouter()


@router.get("")
def list_cities(db: Session = Depends(get_db)):
    """List all registered cities. Public endpoint — no auth required."""
    cities = db.execute(
        select(City).where(City.name.in_(("Vadodara", "Bengaluru"))).order_by(City.name)
    ).scalars().all()
    return [
        {"id": str(c.id), "name": c.name, "state_code": c.state_code}
        for c in cities
    ]
