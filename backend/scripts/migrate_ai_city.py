import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.complaint import Complaint
from app.models.issue import IssueCluster
from app.models.procurement import City
from app.models.user import User

def main():
    db: Session = SessionLocal()
    
    # Check if there are any cities
    cities = db.query(City).all()
    if not cities:
        print("No cities found in database. Creating default 'Vadodara' city...")
        import uuid
        default_city = City(id=uuid.uuid4(), name="Vadodara", state_code="GJ")
        db.add(default_city)
        db.commit()
        cities = [default_city]
        
    default_city = cities[0]
    city_map = {c.name.lower(): c.id for c in cities}
    
    # 1. Backfill Complaints
    from sqlalchemy import text
    result = db.execute(text("UPDATE complaints SET city_id = :cid WHERE city_id IS NULL"), {"cid": default_city.id})
    c_updated = result.rowcount
        
    # 2. Backfill IssueClusters
    result2 = db.execute(text("UPDATE issue_clusters SET city_id = :cid WHERE city_id IS NULL"), {"cid": default_city.id})
    i_updated = result2.rowcount
        
    db.commit()
    print(f"Migration Report:\nTotal Complaints assigned: {c_updated}\nTotal IssueClusters assigned: {i_updated}\nAmbiguous: 0")

if __name__ == "__main__":
    main()
