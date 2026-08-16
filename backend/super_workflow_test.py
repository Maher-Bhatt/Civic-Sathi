from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

from app.main import app
from app.core.database import get_db
from app.models.base import Base
from app.models.procurement import TenderStatus, BidStatus, WorkOrderStatus, Contractor
from app.models.issue import IssueCluster
from app.models.complaint import Complaint
from app.models.user import User

# Use an in-memory SQLite database for the test
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_super_workflow():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # 1. Setup mock users
    officer_id = uuid4()
    contractor_id = uuid4()
    
    officer = User(id=officer_id, name="Test Officer", email="officer@test.com", hashed_password="pw", role="officer")
    contractor_user = User(id=contractor_id, name="Test Contractor", email="contractor@test.com", hashed_password="pw", role="contractor")
    
    db.add(officer)
    db.add(contractor_user)
    db.commit()
    
    # Setup contractor profile
    contractor_profile = Contractor(
        id=uuid4(),
        auth_user_id=str(contractor_id),
        company_name="Acme Corp"
    )
    db.add(contractor_profile)
    
    # 2. Setup mock Citizen Complaint and Issue
    issue_id = uuid4()
    issue = IssueCluster(id=issue_id, title="Broken Road", description="Potholes everywhere", status="open", city_id="vadodara", ai_confidence=0.9, severity="High")
    db.add(issue)
    
    complaint_id = uuid4()
    complaint = Complaint(id=complaint_id, title="Pothole", description="Bad pothole", status="open", city="vadodara", ward="A", area="Center", lat=22.3, lng=73.1, urgency="High")
    db.add(complaint)
    db.commit()
    
    # Link complaint to issue (Simulating AI behavior)
    from app.models.issue import IssueComplaint
    link = IssueComplaint(issue_id=issue_id, complaint_id=complaint_id)
    db.add(link)
    db.commit()
    
    print("\n[✓] Setup complete: Issue and Complaint created.")

    # 3. Create Tender
    # We must mock get_current_officer / get_current_user
    app.dependency_overrides[app.dependency_overrides.get(get_db, get_db)] = override_get_db
    
    from app.core.security import get_current_officer, get_current_user
    app.dependency_overrides[get_current_officer] = lambda: officer
    app.dependency_overrides[get_current_user] = lambda: officer
    
    res = client.post("/api/v1/procurement/tenders", json={
        "title": "Fix Broken Road",
        "description": "Fix the potholes",
        "estimated_budget": 50000,
        "city_id": str(uuid4()),
        "department_id": str(uuid4()),
        "civic_issue_id": str(issue_id)
    })
    assert res.status_code == 200
    tender = res.json()
    tender_id = tender["id"]
    print(f"[✓] Tender created: {tender_id}")
    
    # 4. Contractor Bids
    app.dependency_overrides[get_current_user] = lambda: contractor_user
    res = client.post(f"/api/v1/procurement/tenders/{tender_id}/bids", json={
        "quoted_amount": 45000,
        "technical_proposal": "Will use best asphalt"
    })
    assert res.status_code == 200
    bid = res.json()
    bid_id = bid["id"]
    print(f"[✓] Bid submitted: {bid_id}")
    
    # 5. Award Bid -> Work Order
    app.dependency_overrides[get_current_officer] = lambda: officer
    res = client.post(f"/api/v1/procurement/tenders/{tender_id}/bids/{bid_id}/award")
    assert res.status_code == 200
    work_order = res.json()
    wo_id = work_order["id"]
    print(f"[✓] Bid awarded, Work Order created: {wo_id}")
    
    # 6. Submit Evidence
    app.dependency_overrides[get_current_user] = lambda: contractor_user
    res = client.post(f"/api/v1/procurement/work-orders/{wo_id}/evidence", json={
        "photo_url": "http://example.com/photo.jpg",
        "description": "Road fixed"
    })
    assert res.status_code == 200
    print("[✓] Field Evidence submitted")
    
    # 7. Inspect Work Order (PASS)
    app.dependency_overrides[get_current_officer] = lambda: officer
    res = client.post(f"/api/v1/procurement/work-orders/{wo_id}/inspections", json={
        "result": "PASS",
        "feedback": "Looks good"
    })
    assert res.status_code == 200
    print("[✓] Inspection Passed")
    
    # 8. VERIFY AUTO-RESOLUTION
    db.refresh(issue)
    db.refresh(complaint)
    
    assert issue.status == "resolved"
    assert complaint.status == "resolved"
    print("\n====================================")
    print("SUCCESS: SUPER WORKFLOW VERIFIED!")
    print("Citizen Complaint -> AI Issue Cluster -> Tender -> Bid -> Work Order -> Evidence -> Inspection -> Complaint Auto-Resolved!")
    print("====================================\n")
    
    Base.metadata.drop_all(bind=engine)

if __name__ == "__main__":
    test_super_workflow()
