import os
import uuid
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import json

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file.")
    exit(1)

# Create engine
engine = create_engine(DATABASE_URL)

def generate_uuid():
    return str(uuid.uuid4())

def get_random_date(start_days_ago=365, end_days_ago=0):
    start = datetime.now() - timedelta(days=start_days_ago)
    end = datetime.now() - timedelta(days=end_days_ago)
    random_days = random.randrange((end - start).days + 1)
    return start + timedelta(days=random_days)

def main():
    print("Connecting to database...")
    with engine.connect() as conn:
        with conn.begin():
            print("Fetching existing cities and departments...")
            
            # Fetch Cities
            cities_result = conn.execute(text("SELECT id, name FROM cities")).fetchall()
            cities = {row[1]: row[0] for row in cities_result}
            
            if not cities:
                print("No cities found! Please run the base seeder first.")
                return
            
            print(f"Found {len(cities)} cities: {', '.join(cities.keys())}")
            
            # Fetch Departments
            deps_result = conn.execute(text("SELECT id, name FROM departments")).fetchall()
            departments = [row[0] for row in deps_result]
            
            if not departments:
                print("No departments found! Please run the base seeder first.")
                return
            
            print(f"Found {len(departments)} departments.")
            
            # Fetch existing wards max number to start from 100
            ward_max_result = conn.execute(text("SELECT MAX(ward_number) FROM wards")).scalar()
            ward_number_start = max(100, (ward_max_result or 0) + 1)
            
            # ==========================
            # 1. WARDS
            # ==========================
            print("Seeding Wards...")
            city_wards = {
                "Vadodara": [("Alkapuri", 22.3082, 73.1706), ("Sayajigunj", 22.3101, 73.1873), ("Karelibaug", 22.3168, 73.2037), ("Akota", 22.2965, 73.1678), ("Manjalpur", 22.2755, 73.1979), ("Gotri", 22.3142, 73.1491), ("Fatehgunj", 22.3197, 73.1895), ("Harni", 22.3396, 73.2144), ("Tandalja", 22.2929, 73.1451), ("Subhanpura", 22.3183, 73.1636)],
                "Mumbai": [("Colaba", 18.9067, 72.8147), ("Andheri", 19.1136, 72.8697), ("Bandra", 19.0596, 72.8295), ("Dadar", 19.0178, 72.8406), ("Borivali", 19.2307, 72.8567), ("Malad", 19.1804, 72.8427), ("Powai", 19.1197, 72.9050), ("Kurla", 19.0726, 72.8795), ("Goregaon", 19.1663, 72.8526), ("Thane", 19.2183, 72.9781)],
                "Delhi": [("Connaught Place", 28.6304, 77.2177), ("Karol Bagh", 28.6538, 77.1888), ("Chandni Chowk", 28.6505, 77.2295), ("Dwarka", 28.5921, 77.0460), ("Rohini", 28.7366, 77.0945), ("Saket", 28.5246, 77.2066), ("Janakpuri", 28.6219, 77.0878), ("Lajpat Nagar", 28.5684, 77.2452), ("Vasant Kunj", 28.5293, 77.1531), ("Greater Kailash", 28.5414, 77.2407)],
                "Bengaluru": [("Koramangala", 12.9279, 77.6271), ("Indiranagar", 12.9719, 77.6412), ("Whitefield", 12.9698, 77.7499), ("Jayanagar", 12.9299, 77.5824), ("Malleshwaram", 13.0031, 77.5643), ("HSR Layout", 12.9081, 77.6476), ("Yelahanka", 13.1007, 77.5963), ("Electronic City", 12.8452, 77.6602), ("Banashankari", 12.9255, 77.5468), ("Hebbal", 13.0354, 77.5988)]
            }
            
            ward_ids_by_city = {city_id: [] for city_id in cities.values()}
            
            # Get existing wards to avoid duplicate names in the same city
            existing_wards = conn.execute(text("SELECT name, city_id, id FROM wards")).fetchall()
            existing_ward_names = {(row[0], row[1]): row[2] for row in existing_wards}
            
            for city_name, wards in city_wards.items():
                if city_name not in cities:
                    continue
                city_id = cities[city_name]
                for w_name, lat, lng in wards:
                    if (w_name, city_id) in existing_ward_names:
                        ward_ids_by_city[city_id].append(existing_ward_names[(w_name, city_id)])
                        continue
                    
                    w_id = generate_uuid()
                    conn.execute(
                        text("""
                        INSERT INTO wards (id, ward_number, name, city_id, centroid_lat, centroid_lng, created_at, updated_at)
                        VALUES (:id, :wn, :name, :city_id, :lat, :lng, :now, :now)
                        ON CONFLICT DO NOTHING
                        """),
                        {"id": w_id, "wn": ward_number_start, "name": w_name, "city_id": city_id, "lat": lat, "lng": lng, "now": datetime.now()}
                    )
                    ward_number_start += 1
                    ward_ids_by_city[city_id].append(w_id)
            
            # ==========================
            # 2. ISSUE CLUSTERS
            # ==========================
            print("Seeding Issue Clusters...")
            cluster_categories = ['road_damage', 'water_supply', 'sanitation', 'street_light', 'drainage', 'garbage', 'electricity', 'health', 'noise', 'encroachment']
            cluster_statuses = ['open', 'investigating', 'resolved']
            cluster_risk_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
            
            cluster_templates = [
                ("Recurring Potholes on {area} Main Road", "road_damage", 'HIGH', 85),
                ("Water Contamination Spike in {area}", "water_supply", 'CRITICAL', 92),
                ("Overflowing Garbage Bins Near {area} Market", "garbage", 'HIGH', 78),
                ("Street Light Outage in {area} Residential Zone", "street_light", 'MEDIUM', 55),
                ("Drainage Blockage in {area}", "drainage", 'HIGH', 80),
                ("Illegal Encroachment on {area} Footpath", "encroachment", 'MEDIUM', 60),
                ("Frequent Power Cuts in {area}", "electricity", 'HIGH', 75),
            ]
            
            inserted_cluster_ids = []
            
            for city_name, city_id in cities.items():
                wards = city_wards.get(city_name, [])
                for _ in range(12):
                    if not wards:
                        break
                    w_name, w_lat, w_lng = random.choice(wards)
                    template = random.choice(cluster_templates)
                    
                    c_id = generate_uuid()
                    title = template[0].format(area=w_name)
                    
                    # Fuzzy match ward id
                    ward_id = None
                    if city_id in ward_ids_by_city and ward_ids_by_city[city_id]:
                        ward_id = random.choice(ward_ids_by_city[city_id])
                        
                    conn.execute(
                        text("""
                        INSERT INTO issue_clusters (id, title, summary, category, department_id, ward_id, city_id, status, risk_level, risk_score, complaint_count, centroid_lat, centroid_lng, first_seen_at, last_seen_at, created_at, updated_at)
                        VALUES (:id, :title, :summary, :category, :dept, :ward, :city, :status, :risk_level, :risk_score, :complaint_count, :lat, :lng, :first_seen, :last_seen, :now, :now)
                        ON CONFLICT DO NOTHING
                        """),
                        {
                            "id": c_id,
                            "title": title,
                            "summary": f"Multiple complaints reported regarding {title.lower()}.",
                            "category": template[1],
                            "dept": random.choice(departments),
                            "ward": ward_id,
                            "city": city_id,
                            "status": random.choice(cluster_statuses),
                            "risk_level": template[2],
                            "risk_score": template[3] + random.randint(-5, 5),
                            "complaint_count": random.randint(20, 500),
                            "lat": w_lat + random.uniform(-0.01, 0.01),
                            "lng": w_lng + random.uniform(-0.01, 0.01),
                            "first_seen": get_random_date(60, 10),
                            "last_seen": get_random_date(10, 0),
                            "now": datetime.now()
                        }
                    )
                    inserted_cluster_ids.append(c_id)
            
            # ==========================
            # 3. CONTRACTORS & 4. REGISTRATIONS
            # ==========================
            print("Seeding Contractors and Registrations...")
            contractor_names = [
                "Bharat Infrastructure Ltd", "Tata Projects", "L&T Construction", "Shapoorji Pallonji", "NCC Limited",
                "Ashoka Buildcon", "IRB Infrastructure", "Afcons Infrastructure", "Dilip Buildcon", "JMC Projects"
            ]
            
            contractor_ids = []
            
            for name in contractor_names:
                c_id = generate_uuid()
                c_email = f"contact@{name.replace(' ', '').replace('&', 'and').lower()}.com"
                
                # Check if exists
                existing = conn.execute(text("SELECT id FROM contractors WHERE email = :email"), {"email": c_email}).scalar()
                if existing:
                    contractor_ids.append(existing)
                    continue
                
                public_rating = round(random.uniform(3.5, 4.9), 1)
                ai_rating = round(random.uniform(3.5, 4.9), 1)
                officer_rating = round(random.uniform(3.5, 4.9), 1)
                
                conn.execute(
                    text("""
                    INSERT INTO contractors (id, company_name, contact_person, email, phone, public_rating, ai_rating, officer_rating, total_reviews_count, ai_insights, created_at, updated_at)
                    VALUES (:id, :name, :person, :email, :phone, :pr, :ar, :or_rating, :trc, :insights, :now, :now)
                    ON CONFLICT DO NOTHING
                    """),
                    {
                        "id": c_id, "name": name, "person": f"Rajesh {random.choice(['Kumar', 'Sharma', 'Patel', 'Singh', 'Desai'])}",
                        "email": c_email, "phone": f"+9198{random.randint(10000000, 99999999)}",
                        "pr": public_rating, "ar": ai_rating, "or_rating": officer_rating, "trc": random.randint(10, 100),
                        "insights": json.dumps(["Delivers on time", "Good material quality", "Minor delays in monsoon"]),
                        "now": datetime.now()
                    }
                )
                contractor_ids.append(c_id)
                
                # Registrations
                for _ in range(random.randint(1, 3)):
                    reg_city = random.choice(list(cities.values()))
                    conn.execute(
                        text("""
                        INSERT INTO contractor_city_registrations (id, contractor_id, city_id, registration_number, registration_class, status, approved_categories, current_risk_level, created_at, updated_at)
                        VALUES (:id, :cid, :city, :reg_num, :cls, :status, :cats, :risk, :now, :now)
                        ON CONFLICT DO NOTHING
                        """),
                        {
                            "id": generate_uuid(), "cid": c_id, "city": reg_city,
                            "reg_num": f"REG-{random.randint(10000, 99999)}",
                            "cls": random.choice(['A', 'B', 'C']),
                            "status": 'APPROVED',
                            "cats": json.dumps(['Roads', 'Water', 'Drainage']),
                            "risk": random.choice(['LOW', 'MEDIUM', 'HIGH']),
                            "now": datetime.now()
                        }
                    )
            
            # ==========================
            # 5. TENDERS
            # ==========================
            print("Seeding Tenders...")
            tender_statuses = ['DRAFT', 'PUBLISHED', 'CLOSED', 'EVALUATING', 'AWARDED', 'CANCELLED']
            tender_weights = [3, 5, 4, 3, 4, 1]
            tender_ids = []
            tender_objects = [] # (id, estimated_budget, status)
            
            for i in range(20):
                t_id = generate_uuid()
                status = random.choices(tender_statuses, weights=tender_weights)[0]
                city_id = random.choice(list(cities.values()))
                budget = random.randint(500000, 50000000)
                
                city_name = [k for k, v in cities.items() if v == city_id][0]
                zone_num = random.randint(1, 5)
                
                titles = [
                    f"Road Resurfacing Package Zone-{zone_num} {city_name}",
                    f"Storm Water Drain Rehabilitation {city_name}",
                    f"LED Street Light Installation Ward-{zone_num} {city_name}",
                    f"Public Toilet Construction Package {city_name}",
                    f"Water Pipeline Extension Zone-{zone_num} {city_name}"
                ]
                
                conn.execute(
                    text("""
                    INSERT INTO tenders (id, city_id, department_id, civic_issue_id, title, description, estimated_budget, status, published_at, closed_at, created_at, updated_at)
                    VALUES (:id, :city, :dept, :issue, :title, :desc, :budget, :status, :pub, :closed, :now, :now)
                    ON CONFLICT DO NOTHING
                    """),
                    {
                        "id": t_id, "city": city_id, "dept": random.choice(departments),
                        "issue": random.choice(inserted_cluster_ids) if inserted_cluster_ids else None,
                        "title": random.choice(titles),
                        "desc": "Comprehensive tender for civic infrastructure improvements.",
                        "budget": budget,
                        "status": status,
                        "pub": get_random_date(180, 60) if status != 'DRAFT' else None,
                        "closed": get_random_date(60, 10) if status in ['CLOSED', 'EVALUATING', 'AWARDED'] else None,
                        "now": datetime.now()
                    }
                )
                tender_ids.append(t_id)
                tender_objects.append({"id": t_id, "budget": budget, "status": status})
            
            # ==========================
            # 6. BIDS
            # ==========================
            print("Seeding Bids...")
            bids = []
            for tender in tender_objects:
                if tender["status"] == 'DRAFT':
                    continue
                
                num_bids = random.randint(2, 4)
                t_contractors = random.sample(contractor_ids, num_bids)
                
                won_assigned = False
                for i, cid in enumerate(t_contractors):
                    b_id = generate_uuid()
                    
                    b_status = 'SUBMITTED'
                    if tender["status"] in ['EVALUATING', 'AWARDED', 'CLOSED']:
                        b_status = 'QUALIFIED'
                    
                    if tender["status"] == 'AWARDED' and not won_assigned:
                        b_status = 'WON'
                        won_assigned = True
                    elif tender["status"] == 'AWARDED' and won_assigned:
                        b_status = random.choice(['QUALIFIED', 'REJECTED'])
                        
                    quoted = tender["budget"] * random.uniform(0.8, 1.2)
                    
                    conn.execute(
                        text("""
                        INSERT INTO bids (id, tender_id, contractor_id, quoted_amount, technical_proposal, status, created_at, updated_at)
                        VALUES (:id, :tid, :cid, :quoted, :prop, :status, :now, :now)
                        ON CONFLICT DO NOTHING
                        """),
                        {
                            "id": b_id, "tid": tender["id"], "cid": cid,
                            "quoted": quoted, "prop": "Standard technical proposal document.",
                            "status": b_status, "now": datetime.now()
                        }
                    )
                    bids.append({"id": b_id, "tender_id": tender["id"], "contractor_id": cid, "status": b_status, "amount": quoted})
                    
            # ==========================
            # 7. WORK ORDERS
            # ==========================
            print("Seeding Work Orders...")
            wo_statuses = ['ISSUED', 'ACCEPTED', 'IN_PROGRESS', 'INSPECTION_PENDING', 'COMPLETED', 'CLOSED']
            work_order_ids = []
            
            # Create WOs for WON bids
            won_bids = [b for b in bids if b["status"] == 'WON']
            
            for b in won_bids:
                wo_id = generate_uuid()
                status = random.choice(wo_statuses)
                progress = 0.0
                if status == 'IN_PROGRESS':
                    progress = random.uniform(10, 90)
                elif status in ['INSPECTION_PENDING', 'COMPLETED', 'CLOSED']:
                    progress = 100.0
                    
                conn.execute(
                    text("""
                    INSERT INTO work_orders (id, tender_id, bid_id, contractor_id, award_value, status, target_completion_date, planned_progress_pct, reported_progress_pct, verified_progress_pct, risk_level, risk_reasons, defect_liability_period_days, liquidated_damages_pct_per_day, created_at, updated_at)
                    VALUES (:id, :tid, :bid, :cid, :val, :status, :target, :planned, :reported, :verified, :risk, :reasons, :dlp, :ld, :now, :now)
                    ON CONFLICT DO NOTHING
                    """),
                    {
                        "id": wo_id, "tid": b["tender_id"], "bid": b["id"], "cid": b["contractor_id"],
                        "val": b["amount"], "status": status,
                        "target": get_random_date(0, -180),
                        "planned": min(100.0, progress + random.uniform(0, 20)),
                        "reported": progress,
                        "verified": progress * random.uniform(0.9, 1.0),
                        "risk": random.choice(['LOW', 'MEDIUM', 'HIGH']),
                        "reasons": json.dumps(["Monsoon delays", "Material shortage"] if random.random() > 0.5 else []),
                        "dlp": 365, "ld": 0.5, "now": datetime.now()
                    }
                )
                work_order_ids.append(wo_id)
                
            # ==========================
            # 8. CONTRACTOR REVIEWS
            # ==========================
            print("Seeding Contractor Reviews...")
            review_categories = ['Workmanship', 'Punctuality', 'Material Quality', 'Safety', 'Communication']
            
            for _ in range(40):
                conn.execute(
                    text("""
                    INSERT INTO contractor_reviews (id, contractor_id, work_order_id, author_type, author_name, rating, comment, category, created_at, updated_at)
                    VALUES (:id, :cid, :wo, :atype, :aname, :rating, :comment, :cat, :now, :now)
                    ON CONFLICT DO NOTHING
                    """),
                    {
                        "id": generate_uuid(),
                        "cid": random.choice(contractor_ids),
                        "wo": random.choice(work_order_ids) if work_order_ids else None,
                        "atype": random.choice(['PUBLIC', 'AI', 'OFFICER']),
                        "aname": f"User_{random.randint(100, 999)}",
                        "rating": round(random.uniform(2.0, 5.0), 1),
                        "comment": "Review based on field inspection.",
                        "cat": random.choice(review_categories),
                        "now": datetime.now()
                    }
                )
                
            # ==========================
            # 9. AUDIT LOGS
            # ==========================
            print("Seeding Audit Logs...")
            actions = ['LOGIN', 'APPROVE_CONTRACTOR', 'PUBLISH_TENDER', 'AWARD_TENDER', 'ASSIGN_COMPLAINT', 'RESOLVE_COMPLAINT', 'CREATE_WORK_ORDER', 'UPDATE_PROGRESS', 'INSPECTION_PASS', 'INSPECTION_FAIL']
            
            for _ in range(50):
                aid = generate_uuid()
                conn.execute(
                    text("""
                    INSERT INTO platform_audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, reason, at)
                    VALUES (:id, :actor_id, :actor, :role, :action, :etype, :entity_id, :reason, :at)
                    ON CONFLICT DO NOTHING
                    """),
                    {
                        "id": generate_uuid(),
                        "actor_id": generate_uuid(),
                        "actor": f"Officer_{random.randint(1, 10)}",
                        "role": "OFFICER",
                        "action": random.choice(actions),
                        "etype": "TENDER",
                        "entity_id": generate_uuid(),
                        "reason": "System generated audit log",
                        "at": get_random_date(30, 0)
                    }
                )

            print("Commit successful!")

        # After transaction, verify counts
        tables = [
            "wards", "issue_clusters", "contractors", "contractor_city_registrations", 
            "tenders", "bids", "work_orders", "contractor_reviews", "platform_audit_logs"
        ]
        print("\n--- DB Counts ---")
        for t in tables:
            count = conn.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
            print(f"{t.ljust(30)}: {count}")
            
if __name__ == "__main__":
    main()
