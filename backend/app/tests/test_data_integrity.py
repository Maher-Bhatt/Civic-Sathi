"""Tests for explicit repair operations and query-only complaint data access."""

from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.models.procurement import City
from app.models.user import Department
from app.repositories.complaint_repository import ComplaintRepository
from app.services.data_integrity import ensure_historical_city_separation


def _complaint(
    sequence: int,
    city: City,
    department: Department,
    address: str,
    lat: float,
    lng: float,
) -> Complaint:
    """Build the minimum valid complaint needed to exercise city repair rules."""
    return Complaint(
        public_id_seq=sequence,
        public_id=f"JN-2026-{sequence:05d}",
        title="City repair test complaint",
        description="A complaint used to verify explicit city repair behavior.",
        category="sanitation",
        department_id=department.id,
        city_id=city.id,
        priority="medium",
        address_text=address,
        lat=lat,
        lng=lng,
        source="test",
    )


def test_city_separation_repair_updates_only_misassigned_complaints(db_session: Session):
    """Repair city assignment explicitly from known locality and coordinate signals."""
    vadodara = db_session.query(City).filter_by(name="Vadodara").one()
    bengaluru = db_session.query(City).filter_by(name="Bengaluru").one()
    department = db_session.query(Department).filter_by(slug="sanitation").one()
    vadodara_complaint = _complaint(
        1,
        bengaluru,
        department,
        "Gotri market, Vadodara",
        22.3072,
        73.1812,
    )
    bengaluru_complaint = _complaint(
        2,
        vadodara,
        department,
        "Whitefield, Bengaluru",
        12.9698,
        77.7500,
    )
    db_session.add_all([vadodara_complaint, bengaluru_complaint])
    db_session.commit()

    assert ensure_historical_city_separation(db_session) == 2

    db_session.refresh(vadodara_complaint)
    db_session.refresh(bengaluru_complaint)
    assert vadodara_complaint.city_id == vadodara.id
    assert bengaluru_complaint.city_id == bengaluru.id


def test_repository_city_filter_does_not_apply_address_repair_heuristics(db_session: Session):
    """Repository filters only by persisted city identity, never address content."""
    vadodara = db_session.query(City).filter_by(name="Vadodara").one()
    department = db_session.query(Department).filter_by(slug="sanitation").one()
    complaint = _complaint(
        3,
        vadodara,
        department,
        "Whitefield reference retained for audit history",
        22.3072,
        73.1812,
    )
    db_session.add(complaint)
    db_session.commit()

    complaints, total = ComplaintRepository(db_session).list_complaints(city=str(vadodara.id))

    assert total == 1
    assert [item.id for item in complaints] == [complaint.id]
