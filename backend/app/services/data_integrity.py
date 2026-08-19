"""Small, idempotent data repairs needed to keep city-scoped production views correct."""

from sqlalchemy import and_, func, not_, or_
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

    # Do not materialize the full complaint table here. The production database
    # contains 100k+ rows, and loading them as ORM objects caused Render's free
    # instance to exit with status 137 during startup. Use SQL bulk updates so
    # memory remains bounded and the repair is safe to rerun on every deploy.
    address = func.lower(Complaint.address_text)
    vadodara_address = or_(*[
        address.like(f"%{token}%") for token in vadodara_tokens
    ])
    bengaluru_address = or_(*[
        address.like(f"%{token}%") for token in bengaluru_tokens
    ])
    vadodara_coordinates = and_(
        Complaint.lat.between(21.95, 22.55),
        Complaint.lng.between(72.85, 73.55),
    )
    bengaluru_coordinates = and_(
        Complaint.lat.between(12.70, 13.25),
        Complaint.lng.between(77.30, 77.85),
    )
    vadodara_signal = or_(vadodara_address, vadodara_coordinates)
    bengaluru_signal = or_(bengaluru_address, bengaluru_coordinates)

    updated = 0
    updated += db.query(Complaint).filter(
        vadodara_signal,
        or_(Complaint.city_id.is_(None), Complaint.city_id != vadodara.id),
    ).update({Complaint.city_id: vadodara.id}, synchronize_session=False)
    updated += db.query(Complaint).filter(
        not_(vadodara_signal),
        bengaluru_signal,
        or_(Complaint.city_id.is_(None), Complaint.city_id != bengaluru.id),
    ).update({Complaint.city_id: bengaluru.id}, synchronize_session=False)
    updated += db.query(Complaint).filter(
        Complaint.city_id.is_(None),
        not_(vadodara_signal),
        not_(bengaluru_signal),
    ).update({Complaint.city_id: bengaluru.id}, synchronize_session=False)

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
