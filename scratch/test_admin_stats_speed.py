import sys
import time
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from app.core.database import SessionLocal
from app.models.user import User
from app.models.procurement import Contractor, City, Tender, WorkOrder, WorkOrderStatus
from app.models.complaint import Complaint
from app.models.issue import IssueCluster
from sqlalchemy import func

db = SessionLocal()

start = time.time()
user_counts = dict(db.query(User.role, func.count(User.id)).group_by(User.role).all())
complaint_counts = dict(db.query(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status).all())
issue_counts = dict(db.query(IssueCluster.status, func.count(IssueCluster.id)).group_by(IssueCluster.status).all())
wo_counts = dict(db.query(WorkOrder.status, func.count(WorkOrder.id)).group_by(WorkOrder.status).all())
tenders_count = db.query(func.count(Tender.id)).scalar() or 0
cities_count = db.query(func.count(City.id)).scalar() or 0
contractors_count = db.query(func.count(Contractor.id)).scalar() or 0

total_complaints = sum(complaint_counts.values())
resolved_complaints = complaint_counts.get("resolved", 0)
open_complaints = sum(v for k, v in complaint_counts.items() if k not in ("resolved", "rejected", "closed"))

elapsed = time.time() - start
print(f"Stats calculated in {elapsed:.3f} seconds!")
print(f"Total users: {sum(user_counts.values())}")
print(f"Total complaints: {total_complaints}")
print(f"Resolved: {resolved_complaints} | Open: {open_complaints}")
print(f"Contractors: {contractors_count} | Cities: {cities_count}")

db.close()
