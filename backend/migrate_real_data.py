# -*- coding: utf-8 -*-
"""
Migrate Real Complaint Data to Database
Replaces demo data with actual historical grievance data from 2020-2025
"""

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from pathlib import Path
import os
import sys

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from dotenv import load_dotenv
from datetime import datetime, timezone
from uuid import uuid4
import sys

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.user import Ward, Department
from app.ml.preprocessing import preprocess_text
from app.ml.pipeline import classify_category
from app.ml.risk import calculate_complaint_risk_score

# Load environment
load_dotenv()


def clear_demo_data():
    """Clear all demo/seed data from database"""
    print("\n" + "="*80)
    print("CLEARING DEMO DATA")
    print("="*80)
    
    db = SessionLocal()
    try:
        # Count before
        demo_count = db.query(Complaint).filter(Complaint.source == "demo").count()
        print(f"\nFound {demo_count} demo complaints to remove")
        
        if demo_count > 0:
            # Delete demo complaints (CASCADE will handle related records)
            db.query(Complaint).filter(Complaint.source == "demo").delete()
            db.commit()
            print(f"[OK] Removed {demo_count} demo complaints")
        else:
            print("[OK] No demo data found")
            
    except Exception as e:
        print(f"[X] Error clearing demo data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def load_departments_and_wards(db: Session):
    """Create departments and wards if they don't exist"""
    print("\n" + "="*80)
    print("LOADING DEPARTMENTS & WARDS")
    print("="*80)
    
    # Check if departments exist
    dept_count = db.query(Department).count()
    if dept_count == 0:
        # Create default departments
        departments = [
            Department(id=uuid4(), name="Water Supply", code="WATER"),
            Department(id=uuid4(), name="Roads", code="ROADS"),
            Department(id=uuid4(), name="Solid Waste Management", code="SWM"),
            Department(id=uuid4(), name="Sewerage", code="SEW"),
            Department(id=uuid4(), name="Street Lighting", code="LIGHT"),
            Department(id=uuid4(), name="Public Transport", code="TRANS"),
            Department(id=uuid4(), name="Health & Sanitation", code="HEALTH"),
            Department(id=uuid4(), name="Drainage", code="DRAIN"),
            Department(id=uuid4(), name="Electricity", code="ELEC"),
        ]
        db.add_all(departments)
        db.commit()
        print(f"[OK] Created {len(departments)} departments")
    else:
        print(f"[OK] Using existing {dept_count} departments")
    
    # Check if wards exist
    ward_count = db.query(Ward).count()
    if ward_count == 0:
        # Load wards from demo JSON
        import json
        wards_file = Path(__file__).parent / "app" / "seed" / "demo_wards.json"
        if wards_file.exists():
            with open(wards_file) as f:
                wards_data = json.load(f)
            
            wards = []
            for w in wards_data:
                ward = Ward(
                    id=uuid4(),
                    ward_number=w['ward_number'],
                    ward_name=w['ward_name'],
                    zone=w.get('zone'),
                    population=w.get('population'),
                    area_sqkm=w.get('area_sqkm')
                )
                wards.append(ward)
            
            db.add_all(wards)
            db.commit()
            print(f"[OK] Created {len(wards)} wards")
        else:
            print("[!] Ward data file not found, skipping")
    else:
        print(f"[OK] Using existing {ward_count} wards")
    
    return db.query(Department).all(), db.query(Ward).all()


def map_category_to_department(category: str, departments: list) -> Department:
    """Map complaint category to department"""
    category_lower = category.lower()
    
    dept_map = {
        'water': 'water_works',
        'road': 'public_works',
        'garbage': 'sanitation',
        'waste': 'sanitation',
        'sewage': 'drainage',
        'sewer': 'drainage',
        'light': 'electricity',
        'street light': 'electricity',
        'transport': 'public_works',
        'bus': 'public_works',
        'sanitation': 'sanitation',
        'health': 'sanitation',
        'drain': 'drainage',
        'electric': 'electricity',
        'power': 'electricity',
    }
    
    for key, slug in dept_map.items():
        if key in category_lower:
            dept = next((d for d in departments if d.slug == slug), None)
            if dept:
                return dept
    
    # Default to first department or general
    general_dept = next((d for d in departments if d.slug == 'general'), None)
    return general_dept if general_dept else departments[0]


def map_ward_name_to_ward(ward_name: str, wards: list) -> Ward | None:
    """Map ward name from CSV to Ward object"""
    if not ward_name or pd.isna(ward_name):
        return None
    
    ward_name_lower = str(ward_name).lower().strip()
    
    # Try exact match on 'name' attribute
    for ward in wards:
        if ward.name.lower() == ward_name_lower:
            return ward
    
    # Try partial match
    for ward in wards:
        if ward_name_lower in ward.name.lower() or ward.name.lower() in ward_name_lower:
            return ward
    
    # Try ward number extraction
    import re
    match = re.search(r'\d+', ward_name)
    if match:
        ward_num = int(match.group())
        ward = next((w for w in wards if w.ward_number == ward_num), None)
        if ward:
            return ward
    
    return None


def load_real_complaints(batch_size=100, limit=None):
    """
    Load real complaints from CSV to database with ML analysis
    
    Args:
        batch_size: Number of complaints to process in each batch
        limit: Optional limit on total complaints to load (for testing)
    """
    print("\n" + "="*80)
    print("LOADING REAL COMPLAINTS")
    print("="*80)
    
    # Load master CSV
    csv_path = Path(__file__).parent / "data" / "processed" / "civicsathi_master.csv"
    if not csv_path.exists():
        print(f"[X] Master CSV not found: {csv_path}")
        return 0
    
    print(f"\nReading from: {csv_path}")
    
    # Read CSV in chunks to avoid memory issues
    print("Loading data in chunks to avoid memory issues...")
    
    # First, count total rows if limit not specified
    if limit:
        total_to_load = limit
        print(f"Will load: {limit:,} records")
    else:
        # Count rows without loading full file (use UTF-8 encoding)
        row_count = sum(1 for _ in open(csv_path, encoding='utf-8')) - 1  # -1 for header
        total_to_load = row_count
        print(f"Total records in CSV: {row_count:,}")
    
    # Get departments and wards
    db = SessionLocal()
    try:
        departments, wards = load_departments_and_wards(db)
        
        total_loaded = 0
        total_errors = 0
        batch_num = 0
        
        # Read CSV in chunks
        chunk_size = 1000  # Read 1000 rows at a time from CSV
        
        for chunk_df in pd.read_csv(csv_path, chunksize=chunk_size, encoding='utf-8'):
            # Check if we've reached the limit
            if limit and total_loaded >= limit:
                break
            
            # Apply limit to this chunk
            if limit:
                remaining = limit - total_loaded
                if remaining < len(chunk_df):
                    chunk_df = chunk_df.head(remaining)
            
            # Process this chunk in smaller batches
            for start_idx in range(0, len(chunk_df), batch_size):
                batch_num += 1
                end_idx = min(start_idx + batch_size, len(chunk_df))
                batch = chunk_df.iloc[start_idx:end_idx]
                
                print(f"\n[Batch {batch_num}] Processing records {total_loaded+1:,} to {total_loaded+len(batch):,}...")
                
                batch_complaints = []
                batch_analyses = []
                
                for idx, row in batch.iterrows():
                    try:
                        # Extract data from CSV - pandas Series behaves like dict
                        complaint_id = str(row['complaint_id']) if pd.notna(row['complaint_id']) else ''
                        category_raw = str(row['category_normalized']) if pd.notna(row['category_normalized']) else 'Other'
                        subcategory = str(row['sub_category']) if pd.notna(row['sub_category']) else ''
                        text_for_nlp = str(row['text_for_nlp']) if pd.notna(row['text_for_nlp']) else ''
                        grievance_date = row['grievance_date_parsed'] if pd.notna(row['grievance_date_parsed']) else None
                        ward_name = str(row['ward_normalized']) if pd.notna(row['ward_normalized']) else None
                        status = str(row['status_normalized']).lower() if pd.notna(row['status_normalized']) else 'pending'
                        
                        # Skip if no text
                        if not text_for_nlp or text_for_nlp == 'nan':
                            continue
                        
                        # Classify category using ML - returns (category, department, confidence)
                        classification_result = classify_category(text_for_nlp)
                        if isinstance(classification_result, tuple):
                            category_enum, suggested_dept, confidence = classification_result
                            category_normalized = category_enum.value if hasattr(category_enum, 'value') else str(category_enum)
                        else:
                            category_normalized = str(classification_result)
                        
                        # Map to department
                        department = map_category_to_department(category_normalized, departments)
                        
                        # Map to ward
                        ward = map_ward_name_to_ward(ward_name, wards)
                        if not ward:
                            continue
                        
                        # Map status
                        status_map = {
                            'pending': 'received',
                            'received': 'received',
                            'in progress': 'investigating',
                            'resolved': 'resolved',
                            'closed': 'resolved',
                            'rejected': 'rejected'
                        }
                        mapped_status = status_map.get(status, 'received')
                        
                        # Create title and description
                        title = f"{category_normalized.replace('_', ' ').title()}"
                        if subcategory and subcategory != 'nan':
                            title += f" - {subcategory[:50]}"
                        
                        description = text_for_nlp[:1000]  # Limit to 1000 chars
                        
                        # Generate public ID
                        public_id = f"JN-2026-{str(uuid4())[:5].upper()}"
                        
                        # Preprocess text for ML
                        processed = preprocess_text(text_for_nlp)
                        
                        # Calculate risk using severity and keywords
                        keywords = processed.get('keywords', [])
                        days_old = 0
                        if pd.notna(grievance_date):
                            try:
                                complaint_date = pd.to_datetime(grievance_date)
                                days_old = (datetime.now(timezone.utc) - complaint_date).days
                            except:
                                days_old = 0
                        
                        risk_score = calculate_complaint_risk_score(
                            severity_score=50,  # Default severity
                            keywords=keywords,
                            similar_count=0,
                            days_old=max(0, days_old)
                        )
                        
                        # Create Complaint
                        complaint = Complaint(
                            id=uuid4(),
                            public_id=public_id,
                            title=title,
                            description=description,
                            category=category_normalized,
                            department_id=department.id,
                            status=mapped_status,
                            priority='medium',
                            severity_score=50,
                            risk_score=risk_score,
                            ward_id=ward.id if ward else None,
                            source='historical',
                            created_at=pd.to_datetime(grievance_date) if pd.notna(grievance_date) else datetime.now(timezone.utc),
                        )
                        
                        # Create ComplaintAnalysis
                        analysis = ComplaintAnalysis(
                            id=uuid4(),
                            complaint_id=complaint.id,
                            language=processed.get('language', 'en'),
                            cleaned_text=processed.get('cleaned_text', ''),
                            sentiment_score=processed.get('sentiment_score', 0.0),
                            keywords_json=processed.get('keywords', []),
                            entities_json=processed.get('entities', {}),
                            embedding_model=settings.sentence_model_name,
                            # Note: Embeddings would be calculated in a separate batch job
                            )
                        
                        batch_complaints.append(complaint)
                        batch_analyses.append(analysis)
                        
                    except Exception as e:
                        import traceback
                        print(f"  Error processing row {idx}: {e}")
                        if total_errors < 2:  # Show detailed traceback for first 2 errors
                            print("  Full traceback:")
                            traceback.print_exc()
                        total_errors += 1
                        continue
            
            # Bulk insert batch (after processing all rows in this batch)
            try:
                db.bulk_save_objects(batch_complaints)
                db.flush()  # Flush to get IDs
                db.bulk_save_objects(batch_analyses)
                db.commit()
                
                total_loaded += len(batch_complaints)
                print(f"  [OK] Loaded {len(batch_complaints)} complaints (Total: {total_loaded:,}, Errors: {total_errors})")
                
            except Exception as e:
                print(f"  [X] Batch insert error: {e}")
                db.rollback()
                total_errors += len(batch_complaints)
        
        print(f"\n{'='*80}")
        print(f"[OK] COMPLETED")
        print(f"{'='*80}")
        print(f"  Total loaded: {total_loaded:,}")
        print(f"  Total errors: {total_errors}")
        print(f"  Success rate: {(total_loaded/(total_loaded+total_errors)*100):.1f}%")
        
        return total_loaded
        
    except Exception as e:
        print(f"\n[X] Fatal error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return 0
    finally:
        db.close()


def verify_migration(db: Session):
    """Verify the migration was successful"""
    print("\n" + "="*80)
    print("VERIFICATION")
    print("="*80)
    
    # Count by source
    historical_count = db.query(Complaint).filter(Complaint.source == 'historical').count()
    demo_count = db.query(Complaint).filter(Complaint.source == 'demo').count()
    web_count = db.query(Complaint).filter(Complaint.source == 'web').count()
    
    print(f"\nComplaints by source:")
    print(f"  Historical: {historical_count:,}")
    print(f"  Demo: {demo_count:,}")
    print(f"  Web: {web_count:,}")
    
    # Count by category
    print(f"\nTop 5 categories:")
    from sqlalchemy import func
    top_categories = (
        db.query(Complaint.category, func.count(Complaint.id))
        .filter(Complaint.source == 'historical')
        .group_by(Complaint.category)
        .order_by(func.count(Complaint.id).desc())
        .limit(5)
        .all()
    )
    
    for cat, count in top_categories:
        print(f"  {cat}: {count:,}")
    
    # Check analyses
    analysis_count = db.query(ComplaintAnalysis).count()
    print(f"\nComplaint analyses: {analysis_count:,}")


def main():
    """Main migration process"""
    print("="*80)
    print("REAL DATA MIGRATION")
    print("="*80)
    print(f"\nStart Time: {datetime.now()}")
    
    import argparse
    parser = argparse.ArgumentParser(description='Migrate real complaint data to database')
    parser.add_argument('--limit', type=int, help='Limit number of complaints to load (for testing)')
    parser.add_argument('--batch-size', type=int, default=100, help='Batch size for processing')
    parser.add_argument('--skip-clear', action='store_true', help='Skip clearing demo data')
    args = parser.parse_args()
    
    try:
        # Step 1: Clear demo data
        if not args.skip_clear:
            clear_demo_data()
        else:
            print("\n[!] Skipping demo data clearing")
        
        # Step 2: Load real complaints
        print(f"\nLoading complaints (batch_size={args.batch_size}" + 
              (f", limit={args.limit}" if args.limit else "") + ")...")
        loaded_count = load_real_complaints(
            batch_size=args.batch_size,
            limit=args.limit
        )
        
        if loaded_count == 0:
            print("\n[X] No complaints loaded. Aborting.")
            return False
        
        # Step 3: Verify
        db = SessionLocal()
        try:
            verify_migration(db)
        finally:
            db.close()
        
        print(f"\n{'='*80}")
        print("[OK] MIGRATION COMPLETE")
        print(f"{'='*80}")
        print(f"\nLoaded {loaded_count:,} real complaints")
        print(f"End Time: {datetime.now()}")
        
        return True
        
    except Exception as e:
        print(f"\n[X] Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    import sys
    
    print("\n!!! WARNING !!!")
    print("This will replace demo data with real historical complaints.")
    print("Make sure you have backed up any important data.")
    print("\nPress Enter to continue or Ctrl+C to cancel...")
    
    try:
        pass
        # input()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
        sys.exit(0)
    
    success = main()
    
    if success:
        print("\n" + "="*80)
        print("NEXT STEPS")
        print("="*80)
        print("\n1. Restart the backend server to see changes:")
        print("   python -m uvicorn app.main:app --reload --port 8000")
        print("\n2. Test the citizen and officer portals")
        print("\n3. Run ML clustering on new data:")
        print("   POST /api/v1/issues/rebuild")
        print("\n4. For embeddings (optional, takes time):")
        print("   python generate_embeddings.py")
    else:
        print("\n[X] Migration incomplete. Check errors above.")
        sys.exit(1)

