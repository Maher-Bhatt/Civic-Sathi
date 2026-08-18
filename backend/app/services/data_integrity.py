"""Small, idempotent data repairs needed to keep city-scoped production views correct."""

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.models.procurement import City


def ensure_historical_city_separation(db: Session) -> int:
    """Assign the bundled historical grievance dataset to Bengaluru.

    The raw grievance files inspected in this repository contain BBMP/Bengaluru
    ward names (for example Bagalagunte and Indiranagar) and do not contain a
    city column. Historical rows must therefore be scoped to Bengaluru rather
    than left NULL (which makes them appear in unscoped/demo municipality views).
    Web submissions keep their explicitly supplied city untouched.
    """
    bengaluru = (
        db.query(City)
        .filter(func.lower(City.name).in_(["bengaluru", "bangalore"]))
        .first()
    )
    if not bengaluru:
        bengaluru = City(name="Bengaluru", state_code="KA")
        db.add(bengaluru)
        db.flush()

    updated = (
        db.query(Complaint)
        .filter(Complaint.source == "historical")
        .filter(Complaint.city_id != bengaluru.id)
        .update({Complaint.city_id: bengaluru.id}, synchronize_session=False)
    )
    if updated:
        db.commit()
    return int(updated or 0)
