import sys
from pathlib import Path
from uuid import uuid4

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from app.core.database import SessionLocal
from app.models.user import User
from app.models.procurement import Contractor, City, ContractorCityRegistration, RegistrationStatus
from app.core.security import hash_password

db = SessionLocal()

demo_accounts = [
    {
        "name": "Maher Bhatt (Super Admin)",
        "email": "admin@janmind.in",
        "phone": "+91 98765 43210",
        "role": "admin",
        "city": "vadodara",
        "department": "Administration",
        "password": "Janmind@2026",
    },
    {
        "name": "Maher Bhatt (Admin)",
        "email": "maherbhatt01@gmail.com",
        "phone": "+91 98765 43211",
        "role": "admin",
        "city": "vadodara",
        "department": "Administration",
        "password": "Janmind@2026",
    },
    {
        "name": "Dhruv Patel (VMC Officer)",
        "email": "officer@vmc.gov.in",
        "phone": "+91 98250 12345",
        "role": "officer",
        "city": "vadodara",
        "department": "Roads",
        "password": "Janmind@2026",
    },
    {
        "name": "Priya Sharma (BBMP Officer)",
        "email": "officer@bbmp.gov.in",
        "phone": "+91 98450 67890",
        "role": "officer",
        "city": "bengaluru",
        "department": "Roads",
        "password": "Janmind@2026",
    },
    {
        "name": "Sneha Desai (VMC Supervisor)",
        "email": "supervisor@vmc.gov.in",
        "phone": "+91 98251 54321",
        "role": "supervisor",
        "city": "vadodara",
        "department": "Sanitation",
        "password": "Janmind@2026",
    },
    {
        "name": "Mihir Shah (VMC Municipality)",
        "email": "municipality@vmc.gov.in",
        "phone": "+91 98252 98765",
        "role": "municipality",
        "city": "vadodara",
        "department": "Electricity",
        "password": "Janmind@2026",
    },
    {
        "name": "Suresh Patel (Bharat Infra)",
        "email": "contractor@bharat.in",
        "phone": "+91 98253 11223",
        "role": "contractor",
        "city": "vadodara",
        "department": "Roads",
        "password": "Janmind@2026",
    },
]

print("Seeding/updating demo accounts...")
for acc in demo_accounts:
    user = db.query(User).filter(User.email == acc["email"]).first()
    hashed = hash_password(acc["password"])
    if not user:
        user = User(
            id=uuid4(),
            name=acc["name"],
            email=acc["email"],
            phone=acc["phone"],
            role=acc["role"],
            city=acc["city"],
            department=acc["department"],
            password_hash=hashed,
        )
        db.add(user)
        print(f" [+] Created {acc['role']}: {acc['email']}")
    else:
        user.name = acc["name"]
        user.role = acc["role"]
        user.city = acc["city"]
        user.department = acc["department"]
        user.password_hash = hashed
        print(f" [~] Updated {acc['role']}: {acc['email']}")

# Also update existing named officers
for em in ["priya.sharma@bbmp.gov.in", "dhruv.patel@vmc.gov.in", "sneha.desai@vmc.gov.in", "mihir.shah@vmc.gov.in"]:
    u = db.query(User).filter(User.email == em).first()
    if u:
        u.password_hash = hash_password("Janmind@2026")
        print(f" [~] Synchronized password for {em}")

# Ensure contractor company exists for contractor@bharat.in
c_user = db.query(User).filter(User.email == "contractor@bharat.in").first()
if c_user:
    contractor = db.query(Contractor).filter(Contractor.auth_user_id == c_user.id).first()
    if not contractor:
        contractor = Contractor(
            id=uuid4(),
            company_name="Bharat Infrastructure Pvt Ltd",
            contact_person="Suresh Patel",
            email="contractor@bharat.in",
            phone="+91 98253 11223",
            auth_user_id=c_user.id,
        )
        db.add(contractor)
        db.flush()
        # Add city registration for Vadodara
        v_city = db.query(City).filter(City.name.ilike("vadodara")).first()
        if v_city:
            reg = ContractorCityRegistration(
                id=uuid4(),
                contractor_id=contractor.id,
                city_id=v_city.id,
                status=RegistrationStatus.APPROVED,
                approved_categories=["road_damage", "drainage"],
            )
            db.add(reg)
        print(" [+] Created Contractor company registration for Bharat Infrastructure")

db.commit()
db.close()
print("\n>>> ALL DEMO ACCOUNTS SEEDED & VERIFIED SUCCESSFULLY! <<<")
