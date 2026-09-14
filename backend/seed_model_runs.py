import os, sys, uuid, random, json
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))

def get_random_timestamp(days_ago_max=30):
    now = datetime.now(timezone.utc)
    delta_seconds = random.randint(0, days_ago_max * 86400)
    return now - timedelta(seconds=delta_seconds)

with engine.connect() as conn:
    print('Seeding realistic ModelRun records for AI Oversight dashboard...')
    
    run_configs = [
        {
            'run_type': 'triage_classification',
            'model_name': 'groq/llama-3.3-70b-versatile',
            'duration_range': (160, 320),
            'inputs': lambda: 1,
            'summary': lambda: {
                'detected_category': random.choice(['road_damage', 'water_supply', 'sanitation', 'electricity', 'drainage']),
                'confidence': round(random.uniform(0.88, 0.99), 3),
                'sla_recommended_hours': random.choice([24, 48, 72]),
                'sentiment': random.choice(['urgent', 'frustrated', 'neutral'])
            }
        },
        {
            'run_type': 'similarity_embedding',
            'model_name': 'sentence-transformers/all-MiniLM-L6-v2',
            'duration_range': (35, 95),
            'inputs': lambda: random.choice([1, 4, 8, 16]),
            'summary': lambda: {
                'vector_dim': 384,
                'candidate_matches': random.randint(0, 5),
                'max_cosine_similarity': round(random.uniform(0.72, 0.96), 3)
            }
        },
        {
            'run_type': 'cluster_hdbscan',
            'model_name': 'hdbscan-spatial-v2',
            'duration_range': (420, 1150),
            'inputs': lambda: random.randint(150, 600),
            'summary': lambda: {
                'clusters_formed': random.randint(3, 12),
                'noise_points': random.randint(5, 30),
                'silhouette_score': round(random.uniform(0.68, 0.84), 3)
            }
        },
        {
            'run_type': 'root_cause_analysis',
            'model_name': 'groq/llama-3.3-70b-versatile',
            'duration_range': (310, 580),
            'inputs': lambda: random.randint(10, 50),
            'summary': lambda: {
                'hypothesized_cause': random.choice(['Aging distribution pipe', 'Monsoon drain silting', 'Substation transformer overload', 'Paver block base wash-out']),
                'confidence': round(random.uniform(0.85, 0.97), 3),
                'preventive_actions': 3
            }
        },
        {
            'run_type': 'vision_evidence_audit',
            'model_name': 'multimodal-vision-triage',
            'duration_range': (210, 460),
            'inputs': lambda: 1,
            'summary': lambda: {
                'object_detected': random.choice(['Pothole', 'Overflowing Dumpster', 'Water Pipe Breach', 'Fallen Electric Pole']),
                'severity_estimate': random.choice(['P1', 'P2', 'P3']),
                'gps_cross_verified': True
            }
        }
    ]

    total_runs = 1280
    batch_size = 200
    inserted = 0

    for i in range(0, total_runs, batch_size):
        batch = []
        for _ in range(batch_size):
            cfg = random.choices(run_configs, weights=[0.45, 0.25, 0.10, 0.10, 0.10])[0]
            is_error = random.random() < 0.007 # ~0.7% error rate
            err_msg = random.choice(['Groq rate limit exceeded (429)', 'Upstream inference timeout (504)']) if is_error else None
            duration = random.randint(*cfg['duration_range']) if not is_error else random.randint(5000, 10000)
            created = get_random_timestamp(30)
            
            batch.append({
                'id': str(uuid.uuid4()),
                'run_type': cfg['run_type'],
                'model_name': cfg['model_name'],
                'inputs': cfg['inputs'](),
                'summary': json.dumps(cfg['summary']()) if not is_error else None,
                'duration': duration,
                'error': err_msg,
                'created_at': created,
                'updated_at': created
            })
            
        conn.execute(text('''
            INSERT INTO model_runs (
                id, run_type, model_name, input_count, output_summary_json,
                duration_ms, error_message, created_at, updated_at
            ) VALUES (
                :id, :run_type, :model_name, :inputs, :summary,
                :duration, :error, :created_at, :updated_at
            )
        '''), batch)
        conn.commit()
        inserted += len(batch)
        print(f'  Inserted {inserted}/{total_runs} model runs...')

    # Verify counts
    count = conn.execute(text('SELECT COUNT(*) FROM model_runs')).scalar()
    avg_d = conn.execute(text('SELECT AVG(duration_ms) FROM model_runs')).scalar()
    errs = conn.execute(text('SELECT COUNT(*) FROM model_runs WHERE error_message IS NOT NULL')).scalar()
    print(f'\nSUCCESS! Total model_runs: {count}, Avg Duration: {avg_d:.1f}ms, Errors: {errs} ({errs/count*100:.1f}%)')
