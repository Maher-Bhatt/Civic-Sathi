import sys
import random
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.procurement import Contractor

def run():
    db = SessionLocal()
    contractors = db.execute(select(Contractor)).scalars().all()
    
    mock_insights = [
        ['Consistently meets SLA deadlines', 'High quality material used', 'Excellent community feedback'],
        ['Minor delays in monsoon season', 'Good structural integrity', 'Responsive to officer feedback'],
        ['Needs improvement in site safety', 'Fast execution speed', 'Average material quality'],
        ['Outstanding performance', 'Zero safety incidents', 'Highly recommended for road works'],
        ['Requires frequent rework', 'Poor communication', 'Low citizen satisfaction']
    ]

    for i, contractor in enumerate(contractors):
        # Give some good, some average, some bad ratings
        if i % 4 == 0:
            contractor.public_rating = round(random.uniform(2.5, 3.5), 1)
            contractor.ai_rating = round(random.uniform(3.0, 4.0), 1)
            contractor.officer_rating = round(random.uniform(2.8, 3.8), 1)
            contractor.ai_insights = mock_insights[2]
            contractor.total_reviews_count = random.randint(5, 15)
        elif i % 5 == 0:
            contractor.public_rating = round(random.uniform(1.5, 2.8), 1)
            contractor.ai_rating = round(random.uniform(2.0, 3.2), 1)
            contractor.officer_rating = round(random.uniform(1.8, 3.0), 1)
            contractor.ai_insights = mock_insights[4]
            contractor.total_reviews_count = random.randint(12, 40)
        else:
            contractor.public_rating = round(random.uniform(4.0, 4.9), 1)
            contractor.ai_rating = round(random.uniform(4.2, 5.0), 1)
            contractor.officer_rating = round(random.uniform(4.0, 4.8), 1)
            contractor.ai_insights = mock_insights[0] if i % 2 == 0 else mock_insights[1]
            contractor.total_reviews_count = random.randint(25, 150)
            
    db.commit()
    print(f"Patched {len(contractors)} contractors with mock ratings.")
    db.close()

if __name__ == '__main__':
    run()
