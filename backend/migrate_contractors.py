import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.procurement import Contractor, ContractorCityRegistration, City, RegistrationStatus
from app.models.user import User
from app.core.security import hash_password
from uuid import uuid4

def run_migration():
    db = SessionLocal()
    try:
        vadodara = db.query(City).filter(City.name == "Vadodara").first()
        bengaluru = db.query(City).filter(City.name == "Bengaluru").first()

        if not vadodara or not bengaluru:
            print("Cities not found!")
            return

        print("Deleting existing contractor registrations...")
        db.query(ContractorCityRegistration).delete()
        db.commit()

        contractors = db.query(Contractor).all()
        
        print("Re-assigning contractors strictly city-wise...")
        for i, c in enumerate(contractors):
            # Alternate cities
            assigned_city = vadodara if i % 2 == 0 else bengaluru
            
            reg = ContractorCityRegistration(
                contractor_id=c.id,
                city_id=assigned_city.id,
                registration_number=f"REG-{assigned_city.state_code}-{uuid4().hex[:6].upper()}",
                registration_class="Class-I",
                status=RegistrationStatus.APPROVED,
                approved_categories=["roads", "sanitation", "electricity", "water-supply"],
                current_risk_level="LOW",
            )
            db.add(reg)
            print(f"Assigned {c.company_name} to {assigned_city.name}")
            
        db.commit()
        
        # Update demo contractor to specific cities
        print("Fixing demo contractor accounts...")
        # 1. Vadodara Demo Contractor
        email_vad = "contractor@vadodara-infra.in"
        user_vad = db.query(User).filter(User.email == email_vad).first()
        if not user_vad:
            user_vad = User(
                id=uuid4(), role="contractor", name="Vadodara Infra (Demo)",
                email=email_vad, password_hash=hash_password("Janmind@2026"), ward="Contractor"
            )
            db.add(user_vad)
            db.flush()
            c_vad = Contractor(
                company_name="Vadodara Infra (Demo)", contact_person="VMC Lead",
                email=email_vad, phone="9999999991", auth_user_id=str(user_vad.id)
            )
            db.add(c_vad)
            db.flush()
            db.add(ContractorCityRegistration(
                contractor_id=c_vad.id, city_id=vadodara.id, registration_number="VAD-DEMO-1",
                registration_class="Class-I",
                status=RegistrationStatus.APPROVED, approved_categories=["roads"]
            ))
            print(f"Created Vadodara demo contractor: {email_vad}")
        
        # 2. Bengaluru Demo Contractor
        email_blr = "contractor@bbmp-infra.in"
        user_blr = db.query(User).filter(User.email == email_blr).first()
        if not user_blr:
            user_blr = User(
                id=uuid4(), role="contractor", name="BBMP Infra (Demo)",
                email=email_blr, password_hash=hash_password("Janmind@2026"), ward="Contractor"
            )
            db.add(user_blr)
            db.flush()
            c_blr = Contractor(
                company_name="BBMP Infra (Demo)", contact_person="BBMP Lead",
                email=email_blr, phone="9999999992", auth_user_id=str(user_blr.id)
            )
            db.add(c_blr)
            db.flush()
            db.add(ContractorCityRegistration(
                contractor_id=c_blr.id, city_id=bengaluru.id, registration_number="BLR-DEMO-1",
                registration_class="Class-I",
                status=RegistrationStatus.APPROVED, approved_categories=["roads"]
            ))
            print(f"Created Bengaluru demo contractor: {email_blr}")
        
        # Remove old bharat.in demo contractor if exists (skip deleting contractor to avoid FK constraints)
        old_user = db.query(User).filter(User.email == "contractor@bharat.in").first()
        if old_user:
            old_c = db.query(Contractor).filter(Contractor.auth_user_id == str(old_user.id)).first()
            if old_c:
                old_c.email = "deprecated_contractor@bharat.in"
            old_user.email = "deprecated_contractor@bharat.in"
            print("Renamed old generic contractor@bharat.in to deprecated")

        db.commit()
        print("Migration complete!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
