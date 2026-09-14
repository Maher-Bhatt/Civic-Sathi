import os, sys, uuid, random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))

def get_random_date():
    start = datetime.now() - timedelta(days=150)
    return start + timedelta(days=random.randint(0, 149), hours=random.randint(0, 23), minutes=random.randint(0, 59))

with engine.connect() as conn:
    cities = {r[1]: r[0] for r in conn.execute(text('SELECT id, name FROM cities')).fetchall()}
    deps = [r[0] for r in conn.execute(text('SELECT id FROM departments')).fetchall()]
    
    # Get max public_id_seq
    max_seq = conn.execute(text('SELECT COALESCE(MAX(public_id_seq), 100000) FROM complaints')).scalar()
    
    target_cities = ['Mumbai', 'Delhi', 'Vadodara']
    categories = ['road_damage', 'water_supply', 'sanitation', 'street_light', 'drainage', 'garbage', 'electricity', 'health']
    statuses = ['resolved', 'in_progress', 'received']
    status_weights = [0.55, 0.30, 0.15]
    priorities = ['low', 'medium', 'high', 'critical']
    priority_weights = [0.25, 0.45, 0.20, 0.10]
    
    titles_by_cat = {
        'road_damage': ['Severe Pothole Cluster', 'Damaged Asphalt Surface', 'Road Cavity Near Junction', 'Uneven Paver Blocks'],
        'water_supply': ['Contaminated Tap Water', 'Low Water Pressure', 'Pipeline Leakage on Main Road', 'Irregular Water Timing'],
        'sanitation': ['Overflowing Public Dustbin', 'Garbage Dumped on Sidewalk', 'Uncleaned Street Litter', 'Waste Collection Delayed'],
        'street_light': ['Non-functional Street Light', 'Flickering High-Mast Lamp', 'Exposed Electrical Cable on Pole', 'Dark Stretch on Ring Road'],
        'drainage': ['Clogged Stormwater Drain', 'Sewage Overflowing on Road', 'Broken Manhole Cover', 'Waterlogging After Rain'],
        'garbage': ['Debris Dumped in Open Plot', 'Commercial Waste Near Market', 'Garbage Bin Overturned', 'Bio-waste Dump Issue'],
        'electricity': ['Transformer Sparking', 'Low Voltage in Residential Area', 'Power Tripping Frequently', 'Overhanging Wires'],
        'health': ['Mosquito Breeding in Stagnant Water', 'Stray Animal Menace', 'Foul Odor from Canal', 'Pest Infestation Near Eateries']
    }
    
    coords_by_city = {
        'Mumbai': (19.0760, 72.8777),
        'Delhi': (28.6139, 77.2090),
        'Vadodara': (22.3072, 73.1812)
    }

    print('Starting bulk complaint generation for Mumbai, Delhi, Vadodara...')
    total_added = 0

    for city_name in target_cities:
        if city_name not in cities:
            continue
        city_id = cities[city_name]
        c_lat, c_lng = coords_by_city.get(city_name, (20.0, 75.0))
        
        # Get wards for this city
        wards = [r[0] for r in conn.execute(text('SELECT id FROM wards WHERE city_id = :cid'), {'cid': city_id}).fetchall()]
        
        batch_size = 1000
        city_target = 8000 # Add 8,000 complaints to each city
        
        for b in range(0, city_target, batch_size):
            rows = []
            for _ in range(batch_size):
                max_seq += 1
                cat = random.choice(categories)
                status = random.choices(statuses, weights=status_weights)[0]
                priority = random.choices(priorities, weights=priority_weights)[0]
                dt = get_random_date()
                title = random.choice(titles_by_cat[cat])
                
                rows.append({
                    'id': str(uuid.uuid4()),
                    'seq': max_seq,
                    'pid': f'JN-{dt.year}-{max_seq:05d}',
                    'title': title,
                    'desc': f'Automated civic inspection identified: {title} in {city_name}. Immediate redressal recommended.',
                    'cat': cat,
                    'dept': random.choice(deps),
                    'city': city_id,
                    'status': status,
                    'priority': priority,
                    'sev': random.randint(2, 9),
                    'risk': random.randint(20, 95),
                    'ward': random.choice(wards) if wards else None,
                    'lat': c_lat + random.uniform(-0.06, 0.06),
                    'lng': c_lng + random.uniform(-0.06, 0.06),
                    'src': 'web',
                    'dt': dt
                })
                
            conn.execute(text('''
                INSERT INTO complaints (
                    id, public_id_seq, public_id, title, description, category,
                    department_id, city_id, status, priority, severity_score, risk_score,
                    ward_id, lat, lng, source, created_at, updated_at
                ) VALUES (
                    :id, :seq, :pid, :title, :desc, :cat,
                    :dept, :city, :status, :priority, :sev, :risk,
                    :ward, :lat, :lng, :src, :dt, :dt
                ) ON CONFLICT DO NOTHING
            '''), rows)
            conn.commit()
            total_added += len(rows)
            print(f'  Added {len(rows)} complaints to {city_name} (Total: {total_added})')

    print(f'DONE! Successfully inserted {total_added} complaints across Mumbai, Delhi, and Vadodara.')
