"""Small, idempotent data repairs needed to keep city-scoped production views correct."""

from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.complaint import Complaint
from app.models.procurement import City, Contractor, ContractorCityRegistration, RegistrationStatus
from app.models.user import User


def ensure_historical_city_separation(db: Session) -> int:
    """Assign every complaint to the city indicated by address or coordinates.

    Imported rows and older web-test rows can carry a stale city assignment, so
    the repair uses explicit city names, known locality names, and city bounding
    boxes for all complaints. Rows without a reliable signal retain their current
    city assignment rather than being guessed across municipalities.
    """
    vadodara = db.query(City).filter(func.lower(City.name) == "vadodara").first()
    if not vadodara:
        vadodara = City(name="Vadodara", state_code="GJ")
        db.add(vadodara)
        db.flush()
    bengaluru = db.query(City).filter(func.lower(City.name).in_(["bengaluru", "bangalore"])).first()
    if not bengaluru:
        bengaluru = City(name="Bengaluru", state_code="KA")
        db.add(bengaluru)
        db.flush()

    vadodara_tokens = {
        "vadodara", "baroda", "gotri", "manjalpur", "bhayli", "atladara",
        "vasna", "fatehgunj", "sevasi", "sayajigunj", "karelibaug", "alkapuri",
        "makarpura", "waghodia", "akota", "tarsali", "harni", "ajwa",
    }
    bengaluru_tokens = {
        "bengaluru", "bangalore", "indiranagar", "yelahanka", "electronic city",
        "hsr layout", "jayanagar", "whitefield", "basavanagudi", "vijayanagar",
        "marathahalli", "btm layout", "malleshwaram", "hebbal", "peenya",
        "bommanahalli", "kengeri", "rajajinagar", "shivajinagar", "bellandur",
        "banaswadi", "mahadevapura", "c.v. raman nagar", "koramangala",
    }

    complaints = db.query(Complaint).all()
    updated = 0
    for complaint in complaints:
        address = (complaint.address_text or "").lower()
        city_id = None
        if any(token in address for token in vadodara_tokens) or (
            complaint.lat is not None and complaint.lng is not None
            and 21.95 <= float(complaint.lat) <= 22.55
            and 72.85 <= float(complaint.lng) <= 73.55
        ):
            city_id = vadodara.id
        elif any(token in address for token in bengaluru_tokens) or (
            complaint.lat is not None and complaint.lng is not None
            and 12.70 <= float(complaint.lat) <= 13.25
            and 77.30 <= float(complaint.lng) <= 77.85
        ):
            city_id = bengaluru.id
        elif complaint.city_id is None:
            city_id = bengaluru.id

        if city_id is not None and complaint.city_id != city_id:
            complaint.city_id = city_id
            updated += 1

    if updated:
        db.commit()
    return updated


def ensure_working_contractor_access(db: Session) -> int:
    """Make the documented working contractor account eligible for both cities."""
    user = db.query(User).filter(User.email == "contractor@janmind.in").first()
    if not user:
        return 0

    user.role = "contractor"
    user.city = user.city or "vadodara"
    profile = (
        db.query(Contractor)
        .filter(Contractor.auth_user_id == str(user.id))
        .first()
        or db.query(Contractor).filter(Contractor.company_name == "Bharat Infra Ltd").first()
    )
    changed = 0
    if not profile:
        profile = Contractor(
            company_name="Bharat Infra Ltd",
            contact_person=user.name or "Bharat Infra Lead",
            email=user.email,
            phone=user.phone or "+91 90000 00000",
            auth_user_id=str(user.id),
            approved_categories=["roads", "sanitation", "electricity", "water-supply"],
        )
        db.add(profile)
        db.flush()
        changed += 1
    else:
        if profile.auth_user_id != str(user.id):
            profile.auth_user_id = str(user.id)
            changed += 1
        if profile.email != user.email:
            profile.email = user.email
            changed += 1

    cities = db.query(City).filter(func.lower(City.name).in_(["vadodara", "bengaluru", "bangalore"])).all()
    for city in cities:
        registration = (
            db.query(ContractorCityRegistration)
            .filter(
                ContractorCityRegistration.contractor_id == profile.id,
                ContractorCityRegistration.city_id == city.id,
            )
            .first()
        )
        if not registration:
            db.add(
                ContractorCityRegistration(
                    contractor_id=profile.id,
                    city_id=city.id,
                    registration_number=f"REG-{city.state_code}-{uuid4().hex[:8].upper()}",
                    registration_class="Class-I",
                    status=RegistrationStatus.APPROVED,
                    approved_categories=["roads", "sanitation", "electricity", "water-supply"],
                    current_risk_level="LOW",
                )
            )
            changed += 1
        elif registration.status != RegistrationStatus.APPROVED:
            registration.status = RegistrationStatus.APPROVED
            changed += 1

    if changed:
        db.commit()
    return changed
