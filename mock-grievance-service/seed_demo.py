"""Seed synthetic demonstration data for the mock grievance service.

Run once before starting the service:
    python seed_demo.py

Uses only synthetic names and phone numbers. Not real citizen data.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from main import Base, Grievance, SessionLocal, engine


DEMO_RECORDS = [
    {
        "grievance_ref": "MGS-2026-000001",
        "legacy_citizen_ref": "LEG-0042",
        "citizen_name": "Rahul K.",
        "mobile_no": "9876543210",
        "contact_email": "rahul.demo@example.com",
        "complaint_text": "Broken street light on MG Road near Shivaji Nagar signal. The light has been off for over a week causing accidents at night.",
        "case_state": "RECEIVED",
        "district": "Pune",
        "priority": "HIGH",
    },
    {
        "grievance_ref": "MGS-2026-000002",
        "legacy_citizen_ref": "LEG-0099",
        "citizen_name": "Priya Sharma",
        "mobile_no": "8765432190",
        "contact_email": "priya.sharma.demo@example.com",
        "complaint_text": "Open drain on Karve Road is causing mosquito breeding and flooding during rains.",
        "case_state": "UNDER_REVIEW",
        "district": "Pune",
        "priority": "NORMAL",
    },
    {
        "grievance_ref": "MGS-2026-000003",
        "legacy_citizen_ref": "LEG-0201",
        "citizen_name": "Amol Patil",
        "mobile_no": "7654321098",
        "contact_email": None,
        "complaint_text": "No garbage collection in Hadapsar area for past 5 days. Waste piling up on street corners.",
        "case_state": "ASSIGNED",
        "district": "Pune",
        "priority": "URGENT",
    },
]


def main():
    Base.metadata.create_all(engine)
    from sqlalchemy import select
    with SessionLocal() as db:
        for data in DEMO_RECORDS:
            existing = db.scalar(select(Grievance).where(Grievance.grievance_ref == data["grievance_ref"]))
            if existing:
                print(f"  skip (exists): {data['grievance_ref']}")
                continue
            db.add(Grievance(**data))
            print(f"  seeded: {data['grievance_ref']}")
        db.commit()
    print("Done. Mock Maharashtra State Grievance Service demo data seeded.")


if __name__ == "__main__":
    main()
