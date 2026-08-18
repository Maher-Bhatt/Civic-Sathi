import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from app.core.database import SessionLocal
from app.models.user import User
from app.models.procurement import Contractor, City
from app.core.security import hash_password

db = SessionLocal()

print("--- Current Users in DB ---")
users = db.query(User).all()
for u in users:
    print(f"ID: {u.id} | Email: {u.email} | Role: {u.role} | City: {u.city} | Dept: {u.department}")

print("\n--- Current Contractors in DB ---")
contractors = db.query(Contractor).all()
for c in contractors:
    print(f"ID: {c.id} | Company: {c.company_name} | Email: {c.email} | AuthUser: {c.auth_user_id}")

db.close()
