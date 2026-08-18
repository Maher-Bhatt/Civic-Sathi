"""
JANMIND Master Seed Script
==========================
Run this ONCE against your production Neon database to:
  1. Create Bengaluru and Vadodara cities
  2. Create all departments for both cities
  3. Create Maher Bhatt as super admin (maherbhatt01@gmail.com / MHB@2007)
  4. Create sample municipality officers for both cities
  5. Load ~100k Bengaluru complaints from raw CSV data
  6. Generate mock Vadodara complaints based on Bengaluru patterns
  7. Create sample contractors with city registrations

Usage:
    cd backend
    python seed_master.py

Environment:
    Reads DATABASE_URL from .env file automatically.
    Make sure .env has the correct Neon DATABASE_URL.
"""

import os
import sys
import random
import csv
import json
from datetime import datetime, timezone, timedelta
from uuid import uuid4
from pathlib import Path

# ── Setup path so we can import app modules ─────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.user import User, Department, Ward
from app.models.procurement import City, Contractor, ContractorCityRegistration, RegistrationStatus
from app.models.complaint import Complaint
from app.models.issue import IssueCluster
from app.core.security import hash_password

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL, echo=False)
Session = sessionmaker(bind=engine)
db = Session()

print("=" * 60)
print("JANMIND Master Seed Script")
print("=" * 60)

# ─────────────────────────────────────────────────────────────────
# 1. Cities
# ─────────────────────────────────────────────────────────────────
print("\n[1/7] Seeding cities...")

def get_or_create_city(name: str, state_code: str) -> City:
    from sqlalchemy import select, func
    city = db.execute(
        select(City).where(func.lower(City.name) == name.lower())
    ).scalar_one_or_none()
    if not city:
        city = City(name=name, state_code=state_code)
        db.add(city)
        db.flush()
        print(f"  ✓ Created city: {name}")
    else:
        print(f"  · City already exists: {name}")
    return city

bengaluru = get_or_create_city("Bengaluru", "KA")
vadodara  = get_or_create_city("Vadodara", "GJ")
db.commit()

# ─────────────────────────────────────────────────────────────────
# 2. Departments
# ─────────────────────────────────────────────────────────────────
print("\n[2/7] Seeding departments...")

DEPARTMENTS = [
    ("Electricity",    "electricity",    "electricity@bbmp.gov.in"),
    ("Sanitation",     "sanitation",     "sanitation@bbmp.gov.in"),
    ("Roads",          "roads",          "roads@bbmp.gov.in"),
    ("Health",         "health",         "health@bbmp.gov.in"),
    ("Parks",          "parks",          "parks@bbmp.gov.in"),
    ("Water Supply",   "water-supply",   "water@bbmp.gov.in"),
    ("Revenue",        "revenue",        "revenue@bbmp.gov.in"),
    ("Planning",       "planning",       "planning@bbmp.gov.in"),
    ("Forest",         "forest",         "forest@bbmp.gov.in"),
    ("Veterinary",     "veterinary",     "veterinary@bbmp.gov.in"),
    ("General",        "general",        "general@bbmp.gov.in"),
]

dept_map: dict = {}  # slug → Department
from sqlalchemy import select as sel
for name, slug, email in DEPARTMENTS:
    existing = db.execute(sel(Department).where(Department.slug == slug)).scalar_one_or_none()
    if not existing:
        d = Department(name=name, slug=slug, contact_email=email)
        db.add(d)
        db.flush()
        dept_map[slug] = d
        print(f"  ✓ Created dept: {name}")
    else:
        dept_map[slug] = existing
        print(f"  · Dept exists: {name}")

db.commit()

# ─────────────────────────────────────────────────────────────────
# 3. Super Admin — Maher Bhatt
# ─────────────────────────────────────────────────────────────────
print("\n[3/7] Creating super admin (Maher Bhatt)...")

ADMIN_EMAIL    = "maherbhatt01@gmail.com"
ADMIN_PASSWORD = "MHB@2007"
ADMIN_NAME     = "Maher Bhatt"

existing_admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
if existing_admin:
    # Update name and password to ensure it's correct
    existing_admin.name          = ADMIN_NAME
    existing_admin.role          = "admin"
    existing_admin.password_hash = hash_password(ADMIN_PASSWORD)
    existing_admin.city          = None   # Admin has access to ALL cities
    existing_admin.department    = None
    db.commit()
    print(f"  ✓ Updated existing admin: {ADMIN_NAME} ({ADMIN_EMAIL})")
else:
    admin = User(
        id=uuid4(),
        role="admin",
        name=ADMIN_NAME,
        email=ADMIN_EMAIL,
        password_hash=hash_password(ADMIN_PASSWORD),
        ward="Admin",
        city=None,
        department=None,
    )
    db.add(admin)
    db.commit()
    print(f"  ✓ Created super admin: {ADMIN_NAME} ({ADMIN_EMAIL})")

print(f"  → Login: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")

# ─────────────────────────────────────────────────────────────────
# 4. Sample Officers for Both Cities
# ─────────────────────────────────────────────────────────────────
print("\n[4/7] Creating sample officers...")

OFFICERS = [
    # Bengaluru officers
    ("Priya Sharma",      "priya.sharma@bbmp.gov.in",   "officer",      "bengaluru", "Roads"),
    ("Rajan Nair",        "rajan.nair@bbmp.gov.in",     "officer",      "bengaluru", "Electricity"),
    ("Kavya Reddy",       "kavya.reddy@bbmp.gov.in",    "supervisor",   "bengaluru", "Sanitation"),
    ("Arjun Menon",       "arjun.menon@bbmp.gov.in",    "municipality", "bengaluru", "Health"),
    # Vadodara officers
    ("Dhruv Patel",       "dhruv.patel@vmc.gov.in",     "officer",      "vadodara",  "Roads"),
    ("Sneha Desai",       "sneha.desai@vmc.gov.in",     "supervisor",   "vadodara",  "Sanitation"),
    ("Mihir Shah",        "mihir.shah@vmc.gov.in",      "municipality", "vadodara",  "Electricity"),
    # Frontend demo quick-login accounts
    ("Demo Admin",        "admin@janmind.in",           "admin",        None,        None),
    ("Demo VMC Officer",  "officer@vmc.gov.in",         "officer",      "vadodara",  "Roads"),
    ("Demo BBMP Officer", "officer@bbmp.gov.in",        "officer",      "bengaluru", "Roads"),
    ("Demo Supervisor",   "supervisor@vmc.gov.in",      "supervisor",   "vadodara",  "Administration"),
    ("Demo Municipality", "municipality@vmc.gov.in",    "municipality", "vadodara",  "Administration"),
    ("Demo Citizen",      "citizen@janmind.in",         "citizen",      "vadodara",  None),
]

for name, email, role, city, dept in OFFICERS:
    existing = db.query(User).filter(User.email == email).first()
    if not existing:
        u = User(
            id=uuid4(),
            role=role,
            name=name,
            email=email,
            password_hash=hash_password("Janmind@2026"),
            city=city,
            department=dept,
            ward="Admin",
        )
        db.add(u)
        print(f"  ✓ Created officer: {name} ({city})")
        existing.password_hash = hash_password("Janmind@2026")
        existing.role = role
        db.commit()
        print(f"  · Officer updated: {name}")

db.commit()
print("  → Default password for all officers: Janmind@2026")

# ─────────────────────────────────────────────────────────────────
# 5. Sample Contractors
# ─────────────────────────────────────────────────────────────────
print("\n[5/7] Creating contractors...")

CONTRACTORS = [
    ("BuildRight Infrastructure",  "Ramesh Kumar",   "buildright@contractor.com",   "+91-9845012345"),
    ("CivicTech Solutions",         "Preethi Iyer",   "civictech@contractor.com",    "+91-9876543210"),
    ("Greenway Constructions",      "Suresh Patel",   "greenway@contractor.com",     "+91-9900112233"),
    ("Pioneer Public Works",        "Anil Verma",     "pioneer@contractor.com",      "+91-9811223344"),
    ("Urban Infra Ltd",             "Nalini Reddy",   "urbaninfra@contractor.com",   "+91-9722334455"),
]

contractor_objs = []
for company, contact, email, phone in CONTRACTORS:
    existing = db.execute(sel(Contractor).where(Contractor.email == email)).scalar_one_or_none()
    if existing:
        contractor_objs.append(existing)
        print(f"  · Contractor exists: {company}")
        continue

    # Create login user for contractor
    login_email = email.replace("@contractor.com", ".login@contractor.com")
    login_user = db.query(User).filter(User.email == login_email).first()
    if not login_user:
        login_user = User(
            id=uuid4(),
            role="contractor",
            name=company,
            email=login_email,
            password_hash=hash_password("Janmind@2026"),
            ward="Contractor",
        )
        db.add(login_user)
        db.flush()

    c = Contractor(
        company_name=company,
        contact_person=contact,
        email=email,
        phone=phone,
        auth_user_id=str(login_user.id),
    )
    db.add(c)
    db.flush()
    contractor_objs.append(c)
    print(f"  ✓ Created contractor: {company}")

db.commit()

# Register each contractor in both cities as APPROVED
for c in contractor_objs:
    for city_obj in [bengaluru, vadodara]:
        existing_reg = db.execute(
            sel(ContractorCityRegistration).where(
                ContractorCityRegistration.contractor_id == c.id,
                ContractorCityRegistration.city_id == city_obj.id,
            )
        ).scalar_one_or_none()
        if not existing_reg:
            reg = ContractorCityRegistration(
                contractor_id=c.id,
                city_id=city_obj.id,
                registration_number=f"REG-{city_obj.state_code}-{uuid4().hex[:6].upper()}",
                registration_class="Class-I",
                status=RegistrationStatus.APPROVED,
                approved_categories=["roads", "sanitation", "electricity", "water-supply"],
                current_risk_level="LOW",
            )
            db.add(reg)

db.commit()
print(f"  → Contractor login: <email>.login@contractor.com / Janmind@2026")

# Add demo contractor account referenced by frontend quick-login
demo_contractor_email = "contractor@bharat.in"
existing_demo = db.query(User).filter(User.email == demo_contractor_email).first()
if not existing_demo:
    demo_contractor_user = User(
        id=uuid4(),
        role="contractor",
        name="Demo Contractor",
        email=demo_contractor_email,
        password_hash=hash_password("Janmind@2026"),
        ward="Contractor",
    )
    db.add(demo_contractor_user)
    db.commit()
    print(f"  ✓ Created demo contractor: {demo_contractor_email}")
else:
    existing_demo.password_hash = hash_password("Janmind@2026")
    db.commit()
    print(f"  · Updated demo contractor: {demo_contractor_email}")

# ─────────────────────────────────────────────────────────────────
# 6. Bengaluru Complaints from Real CSV Data (≤100k records)
# ─────────────────────────────────────────────────────────────────
print("\n[6/7] Loading Bengaluru complaints from CSV data...")

MAX_COMPLAINTS = 100_000
BATCH_SIZE = 500

# Check existing count
existing_count = db.query(Complaint).filter(
    Complaint.city_id == bengaluru.id
).count()
print(f"  · Existing Bengaluru complaints: {existing_count:,}")

if existing_count >= MAX_COMPLAINTS:
    print(f"  · Skipping: already have {existing_count:,} complaints")
else:
    target = MAX_COMPLAINTS - existing_count
    print(f"  · Will load up to {target:,} more complaints...")

    # Get a default department and ward for fallback
    general_dept = dept_map.get("general") or list(dept_map.values())[0]

    CATEGORY_TO_DEPT = {
        "electricity": dept_map.get("electricity", general_dept),
        "sanitation":  dept_map.get("sanitation", general_dept),
        "roads":       dept_map.get("roads", general_dept),
        "health":      dept_map.get("health", general_dept),
        "parks":       dept_map.get("parks", general_dept),
        "forest":      dept_map.get("forest", general_dept),
        "veterinary":  dept_map.get("veterinary", general_dept),
        "revenue":     dept_map.get("revenue", general_dept),
        "planning":    dept_map.get("planning", general_dept),
        "water":       dept_map.get("water-supply", general_dept),
        "other":       general_dept,
    }

    STATUS_MAP = {
        "resolved":      "resolved",
        "rejected":      "rejected",
        "received":      "received",
        "in_progress":   "in_progress",
        "acknowledged":  "in_progress",
    }

    RAW_DIR = Path(__file__).parent / "data" / "raw"
    csv_files = sorted(RAW_DIR.glob("grievances_*.csv"))

    if not csv_files:
        print("  ⚠ No CSV files found in data/raw/ — skipping real data load")
    else:
        loaded = 0
        seq_counter = db.execute(text("SELECT last_value FROM complaint_public_seq")).scalar() or 0

        for csv_path in csv_files:
            if loaded >= target:
                break
            print(f"  · Reading {csv_path.name}...")
            year = csv_path.stem.split("_")[-1]

            try:
                with open(csv_path, encoding="utf-8", errors="replace") as f:
                    reader = csv.DictReader(f)
                    batch = []
                    for row in reader:
                        if loaded >= target:
                            break

                        category_raw = (row.get("category_normalized") or row.get("category", "other")).lower().strip()
                        category_key = next(
                            (k for k in CATEGORY_TO_DEPT if k in category_raw), "other"
                        )
                        dept = CATEGORY_TO_DEPT[category_key]

                        status_raw = (row.get("status_normalized") or row.get("grievance_status", "received")).lower().strip()
                        status = STATUS_MAP.get(status_raw, "received")

                        ward_name = (row.get("ward_normalized") or row.get("ward_name", "")).strip()
                        sub_category = (row.get("sub_category") or "").strip()
                        title_text = sub_category if sub_category else f"{category_raw.title()} issue"
                        title_text = title_text[:120]
                        description = (row.get("staff_remarks") or row.get("text_for_nlp", "")).strip()
                        if not description:
                            description = f"Civic complaint regarding {category_raw}. Reported by citizen."
                        description = description[:2500]

                        # Parse date
                        date_str = row.get("grievance_date_parsed") or row.get("grievance_date") or ""
                        try:
                            created_at = datetime.fromisoformat(date_str.replace(" ", "T"))
                            if created_at.tzinfo is None:
                                created_at = created_at.replace(tzinfo=timezone.utc)
                        except Exception:
                            created_at = datetime.now(timezone.utc) - timedelta(days=random.randint(1, 1800))

                        seq_counter += 1
                        public_id = f"JN-{created_at.year}-{seq_counter:05d}"

                        priority = "high" if category_key in ("electricity", "health") else \
                                   "medium" if category_key in ("roads", "sanitation") else "low"

                        complaint = Complaint(
                            id=uuid4(),
                            public_id_seq=seq_counter,
                            public_id=public_id,
                            title=title_text,
                            description=description,
                            category=category_key if category_key != "other" else category_raw[:50],
                            department_id=dept.id,
                            city_id=bengaluru.id,
                            status=status,
                            priority=priority,
                            severity_score=random.randint(1, 10),
                            risk_score=random.randint(1, 100),
                            ward_id=None,
                            submitted_by_name=row.get("staff_name", "Citizen")[:100] if row.get("staff_name") else None,
                            source="import",
                            created_at=created_at,
                            updated_at=created_at,
                        )
                        batch.append(complaint)
                        loaded += 1

                        if len(batch) >= BATCH_SIZE:
                            db.bulk_save_objects(batch)
                            db.commit()
                            batch = []
                            print(f"    → Loaded {loaded:,} complaints...", end="\r")

                    if batch:
                        db.bulk_save_objects(batch)
                        db.commit()

            except Exception as e:
                print(f"  ⚠ Error reading {csv_path.name}: {e}")
                db.rollback()
                continue

        # Update the sequence so future inserts don't collide
        db.execute(text(f"SELECT setval('complaint_public_seq', {seq_counter + 1}, false)"))
        db.commit()
        print(f"\n  ✓ Loaded {loaded:,} Bengaluru complaints from real CSV data")


# ─────────────────────────────────────────────────────────────────
# 7. Mock Vadodara Complaints (based on Bengaluru patterns)
# ─────────────────────────────────────────────────────────────────
print("\n[7/7] Generating mock Vadodara complaints...")

existing_vadodara = db.query(Complaint).filter(Complaint.city_id == vadodara.id).count()
print(f"  · Existing Vadodara complaints: {existing_vadodara:,}")

VADODARA_TARGET = 5000

if existing_vadodara >= VADODARA_TARGET:
    print(f"  · Skipping: already have {existing_vadodara:,} Vadodara complaints")
else:
    to_add = VADODARA_TARGET - existing_vadodara

    VADODARA_TEMPLATES = {
        "electricity": [
            "Street light not working on main road",
            "Power outage in residential area",
            "Transformer damaged near market",
            "Frequent load shedding in colony",
            "Electric pole broken and dangerous",
        ],
        "roads": [
            "Large pothole causing accidents near school",
            "Road damaged after heavy rain",
            "Footpath broken and dangerous for pedestrians",
            "Divider damaged on highway",
            "Encroachment on main road reducing lanes",
        ],
        "sanitation": [
            "Garbage not collected for 5 days",
            "Stray dogs near garbage dump creating nuisance",
            "Blocked drain causing flooding in area",
            "Open defecation near public park",
            "Garbage bin overflowing for days",
        ],
        "water": [
            "No water supply for 3 days",
            "Dirty water from tap causing health concerns",
            "Water pipeline leakage near school",
            "Low pressure in water supply",
            "Contaminated water supply in colony",
        ],
        "health": [
            "Mosquito breeding in stagnant water",
            "Stray animals near school posing health risk",
            "Hospital toilet not clean",
            "Medical waste disposal issue near colony",
            "Unhygienic food stalls near market",
        ],
        "parks": [
            "Park equipment broken and dangerous for children",
            "Park lights not working",
            "Garbage dumped in public garden",
            "Garden maintenance neglected",
            "Illegal construction in park boundary",
        ],
    }

    VADODARA_WARDS = [
        "Sayajigunj", "Alkapuri", "Fatehgunj", "Vadiwadi", "Manjalpur",
        "Karelibaug", "Waghodia Road", "Old Padra Road", "Akota",
        "Productivity Road", "Chhani", "Gorwa", "Harni", "Bil",
    ]

    seq_counter_v = (db.execute(text("SELECT last_value FROM complaint_public_seq")).scalar() or 0)
    batch = []

    for i in range(to_add):
        category = random.choice(list(VADODARA_TEMPLATES.keys()))
        dept = CATEGORY_TO_DEPT.get(category, general_dept)
        title = random.choice(VADODARA_TEMPLATES[category])
        days_ago = random.randint(1, 730)
        created_at = datetime.now(timezone.utc) - timedelta(days=days_ago)
        status = random.choices(
            ["received", "in_progress", "resolved", "rejected"],
            weights=[25, 20, 50, 5]
        )[0]

        seq_counter_v += 1
        public_id = f"JN-{created_at.year}-{seq_counter_v:05d}"

        complaint = Complaint(
            id=uuid4(),
            public_id_seq=seq_counter_v,
            public_id=public_id,
            title=title,
            description=f"Citizen complaint in {random.choice(VADODARA_WARDS)} ward: {title}. Requires immediate attention from {dept.name} department.",
            category=category,
            department_id=dept.id,
            city_id=vadodara.id,
            status=status,
            priority=random.choice(["low", "medium", "high"]),
            severity_score=random.randint(1, 10),
            risk_score=random.randint(1, 100),
            submitted_by_name=f"Citizen {i+1}",
            source="import",
            created_at=created_at,
            updated_at=created_at,
        )
        batch.append(complaint)

        if len(batch) >= BATCH_SIZE:
            db.bulk_save_objects(batch)
            db.commit()
            batch = []

    if batch:
        db.bulk_save_objects(batch)
        db.commit()

    db.execute(text(f"SELECT setval('complaint_public_seq', {seq_counter_v + 1}, false)"))
    db.commit()
    print(f"  ✓ Generated {to_add:,} mock Vadodara complaints")

# ─────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("SEED COMPLETE")
print("=" * 60)

total_complaints = db.query(Complaint).count()
total_users      = db.query(User).count()
total_contractors = db.execute(sel(Contractor)).scalars().all()
bengaluru_complaints = db.query(Complaint).filter(Complaint.city_id == bengaluru.id).count()
vadodara_complaints  = db.query(Complaint).filter(Complaint.city_id == vadodara.id).count()

print(f"""
  Cities        : Bengaluru (KA), Vadodara (GJ)
  Departments   : {len(dept_map)}
  Total Users   : {total_users}
  Contractors   : {len(total_contractors)}
  Complaints    : {total_complaints:,} total
    Bengaluru   : {bengaluru_complaints:,}
    Vadodara    : {vadodara_complaints:,}

  ┌─────────────────────────────────────────────────────┐
  │  SUPER ADMIN LOGIN                                  │
  │  Email   : maherbhatt01@gmail.com                   │
  │  Password: MHB@2007                                 │
  │  Role    : admin (full access to everything)        │
  └─────────────────────────────────────────────────────┘

  Officer default password : JANMIND@2026
  Contractor default login : <email>.login@contractor.com / CONTRACTOR@2026

  Backend URL : https://janmind.onrender.com
  Admin Docs  : (disabled in production, use /docs on local)
""")

db.close()
print("Done! ✓")
