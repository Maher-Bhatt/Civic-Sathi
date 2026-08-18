import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.models.user import User, Department
from app.models.procurement import City
from app.core.security import hash_password
from uuid import uuid4

def seed_data():
    db = SessionLocal()
    try:
        # Create Cities
        cities = ["Bengaluru", "Mumbai", "Delhi"]
        for city_name in cities:
            if not db.query(City).filter(City.name == city_name).first():
                city = City(id=uuid4(), name=city_name, state_code="KA" if city_name == "Bengaluru" else ("MH" if city_name == "Mumbai" else "DL"))
                db.add(city)
                print(f"Added city: {city_name}")

        # Create Departments
        departments = [
            ("Water Supply", "water_works", "water@civicsathi.com"),
            ("Roads", "public_works", "roads@civicsathi.com"),
            ("Solid Waste Management", "sanitation", "swm@civicsathi.com"),
            ("Sewerage", "drainage", "sewage@civicsathi.com"),
            ("Electricity", "electricity", "elec@civicsathi.com"),
        ]
        
        dept_obj = None
        for name, slug, email in departments:
            dept = db.query(Department).filter(Department.slug == slug).first()
            if not dept:
                dept = Department(id=uuid4(), name=name, slug=slug, contact_email=email)
                db.add(dept)
                print(f"Added department: {name}")
            if not dept_obj:
                dept_obj = dept

        # Commit before using department in user
        db.commit()
        db.refresh(dept_obj)

        # Create Admin User
        admin_email = "admin@civicsathi.com"
        if not db.query(User).filter(User.email == admin_email).first():
            hashed_pwd = hash_password("Admin@123456")
            admin = User(
                id=uuid4(),
                name="Admin User",
                email=admin_email,
                phone="0000000000",
                password_hash=hashed_pwd,
                role="admin",
                department=dept_obj.name if dept_obj else None
            )
            db.add(admin)
            db.commit()
            print("Added admin user: admin@civicsathi.com (Password: Admin@123456)")
        else:
            print("Admin user already exists")
            
        print("Seeding completed successfully.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
