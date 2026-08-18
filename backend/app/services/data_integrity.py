"""Small, idempotent data repairs needed to keep city-scoped production views correct."""

from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.complaint import Complaint
from app.models.procurement import City, Contractor, ContractorCityRegistration, RegistrationStatus
from app.models.user import User


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
