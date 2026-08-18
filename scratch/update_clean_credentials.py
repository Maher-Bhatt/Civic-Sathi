import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath("backend"))
load_dotenv(os.path.join("backend", ".env"))

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password
from uuid import uuid4

def run():
    db = SessionLocal()
    print("Updating clean demo credentials in PostgreSQL...")

    accounts = [
        {
            "email": "admin@janmind.in",
            "name": "Super Admin",
            "role": "admin",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Administration",
        },
        {
            "email": "maherbhatt01@gmail.com",
            "name": "Maher Bhatt (Admin)",
            "role": "admin",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Administration",
        },
        {
            "email": "officer@vmc.gov.in",
            "name": "Dhruv Patel (VMC Officer)",
            "role": "officer",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Roads",
        },
        {
            "email": "dhruv.patel@vmc.gov.in",
            "name": "Dhruv Patel",
            "role": "officer",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Roads",
        },
        {
            "email": "officer@bbmp.gov.in",
            "name": "Priya Sharma (BBMP Officer)",
            "role": "officer",
            "password": "Janmind@2026",
            "city": "bengaluru",
            "department": "Roads",
        },
        {
            "email": "priya.sharma@bbmp.gov.in",
            "name": "Priya Sharma",
            "role": "officer",
            "password": "Janmind@2026",
            "city": "bengaluru",
            "department": "Roads",
        },
        {
            "email": "supervisor@vmc.gov.in",
            "name": "Sneha Desai (VMC Supervisor)",
            "role": "supervisor",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Sanitation",
        },
        {
            "email": "sneha.desai@vmc.gov.in",
            "name": "Sneha Desai",
            "role": "supervisor",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Sanitation",
        },
        {
            "email": "municipality@vmc.gov.in",
            "name": "Mihir Shah (VMC Dept Head)",
            "role": "municipality",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Electricity",
        },
        {
            "email": "mihir.shah@vmc.gov.in",
            "name": "Mihir Shah",
            "role": "municipality",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Electricity",
        },
        {
            "email": "contractor@bharat.in",
            "name": "Suresh Patel (Bharat Infra)",
            "role": "contractor",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Civil Construction",
        },
        {
            "email": "contractor@janmind.in",
            "name": "Bharat Infra Lead",
            "role": "contractor",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": "Civil Works",
        },
        {
            "email": "citizen@janmind.in",
            "name": "Maher Citizen",
            "role": "citizen",
            "password": "Janmind@2026",
            "city": "vadodara",
            "department": None,
        },
    ]

    for acc in accounts:
        user = db.query(User).filter(User.email == acc["email"]).first()
        hashed = hash_password(acc["password"])
        if user:
            user.name = acc["name"]
            user.role = acc["role"]
            user.city = acc["city"]
            user.department = acc["department"]
            user.password_hash = hashed
            print(f"  [UPDATED] {acc['role']:12} -> {acc['email']} | Pass: {acc['password']}")
        else:
            new_u = User(
                id=uuid4(),
                email=acc["email"],
                name=acc["name"],
                role=acc["role"],
                city=acc["city"],
                department=acc["department"],
                password_hash=hashed,
                ward="Ward 14" if acc["city"] == "vadodara" else "Ward 84",
            )
            db.add(new_u)
            print(f"  [CREATED] {acc['role']:12} -> {acc['email']} | Pass: {acc['password']}")

    db.commit()
    db.close()
    print("\nAll database accounts successfully updated and active!")

if __name__ == "__main__":
    run()
