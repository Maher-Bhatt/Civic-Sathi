"""
Load ML Pipeline Results into PostgreSQL Database
Rule 28-29 Compliance: Database Integration & Bulk Loading
"""

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment
load_dotenv()

def get_db_engine():
    """Create database engine"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL not found in .env file")
    
    # Handle Neon PostgreSQL URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    return create_engine(database_url)

def bulk_load_complaints(engine, chunk_size=10000):
    """
    Bulk load complaints from processed CSV to database
    Uses chunked loading for efficiency
    """
    print("\n" + "="*80)
    print("BULK LOADING COMPLAINTS")
    print("="*80)
    
    # Load processed data
    csv_path = 'data/processed/pipeline_processed_full.csv'
    print(f"\nLoading from: {csv_path}")
    
    total_rows = 0
    chunk_num = 0
    
    # Read and process in chunks
    for chunk in pd.read_csv(csv_path, chunksize=chunk_size):
        chunk_num += 1
        
        # Map to database schema
        complaints_data = chunk[[
            'complaint_id', 'category', 'subcategory',
            'grievance_date', 'ward_name', 'status',
            'staff_remarks', 'staff_name', 'source_year'
        ]].copy()
        
        # Rename columns to match database
        complaints_data.rename(columns={
            'complaint_id': 'public_id',
            'grievance_date': 'created_at',
            'subcategory': 'description'  # Using subcategory as description
        }, inplace=True)
        
        # Add required fields
        complaints_data['title'] = chunk['category'] + ' - ' + chunk['subcategory']
        complaints_data['priority'] = 'MEDIUM'  # Default
        complaints_data['severity_score'] = 50  # Default
        
        # Load to database using pandas to_sql (efficient bulk insert)
        complaints_data.to_sql(
            'complaints',
            engine,
            if_exists='append',
            index=False,
            method='multi',  # Use multi-row INSERT
            chunksize=1000
        )
        
        total_rows += len(chunk)
        print(f"  Chunk {chunk_num}: Loaded {len(chunk):,} rows (Total: {total_rows:,})")
    
    print(f"\n✓ Total complaints loaded: {total_rows:,}")
    return total_rows

def load_systemic_issues(engine):
    """Load detected systemic issues"""
    print("\n" + "="*80)
    print("LOADING SYSTEMIC ISSUES")
    print("="*80)
    
    # Load issues
    issues = pd.read_csv('data/processed/pipeline_issues_full.csv')
    
    # Map to database schema
    issues_data = issues[[
        'issue_id', 'issue_title', 'category', 'ward_name',
        'risk_level', 'total_risk_score', 'complaint_count'
    ]].copy()
    
    issues_data.rename(columns={
        'issue_title': 'title',
        'ward_name': 'ward',
        'total_risk_score': 'risk_score',
        'complaint_count': 'affected_count'
    }, inplace=True)
    
    # Add description
    issues_data['description'] = (
        issues['category'] + ' in ' + issues['ward_name'] + 
        '. ' + issues['complaint_count'].astype(str) + ' complaints detected.'
    )
    
    # Load to database
    issues_data.to_sql(
        'issue_clusters',
        engine,
        if_exists='append',
        index=False,
        method='multi'
    )
    
    print(f"✓ Loaded {len(issues_data):,} systemic issues")
    return len(issues_data)

def load_root_causes(engine):
    """Load root cause analysis"""
    print("\n" + "="*80)
    print("LOADING ROOT CAUSES")
    print("="*80)
    
    causes = pd.read_csv('data/processed/pipeline_root_causes_full.csv')
    
    # Map to schema
    causes_data = causes[[
        'issue_id', 'possible_cause', 'confidence'
    ]].copy()
    
    causes_data.rename(columns={
        'possible_cause': 'description'
    }, inplace=True)
    
    causes_data['cause_type'] = 'INFERRED'
    causes_data['evidence'] = 'Based on complaint patterns and volume'
    
    # Load to database
    causes_data.to_sql(
        'root_causes',
        engine,
        if_exists='append',
        index=False,
        method='multi'
    )
    
    print(f"✓ Loaded {len(causes_data):,} root causes")
    return len(causes_data)

def load_recommendations(engine):
    """Load recommendations"""
    print("\n" + "="*80)
    print("LOADING RECOMMENDATIONS")
    print("="*80)
    
    recs = pd.read_csv('data/processed/pipeline_recommendations_full.csv')
    
    # Map to schema
    recs_data = recs[[
        'issue_id', 'title', 'description', 'priority'
    ]].copy()
    
    # Load to database
    recs_data.to_sql(
        'recommendations',
        engine,
        if_exists='append',
        index=False,
        method='multi'
    )
    
    print(f"✓ Loaded {len(recs_data):,} recommendations")
    return len(recs_data)

def verify_database_counts(engine):
    """Verify data was loaded correctly"""
    print("\n" + "="*80)
    print("VERIFYING DATABASE COUNTS")
    print("="*80)
    
    with Session(engine) as session:
        # Count records in each table
        tables = ['complaints', 'issue_clusters', 'root_causes', 'recommendations']
        
        for table in tables:
            try:
                result = session.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.scalar()
                print(f"  {table}: {count:,} records")
            except Exception as e:
                print(f"  {table}: Error - {e}")

def create_summary_stats(engine):
    """Create summary statistics in database"""
    print("\n" + "="*80)
    print("CREATING SUMMARY STATISTICS")
    print("="*80)
    
    with Session(engine) as session:
        # Create summary view (if supported)
        summary_query = """
        CREATE OR REPLACE VIEW ml_results_summary AS
        SELECT 
            (SELECT COUNT(*) FROM complaints) as total_complaints,
            (SELECT COUNT(*) FROM issue_clusters) as total_issues,
            (SELECT COUNT(*) FROM issue_clusters WHERE risk_level = 'CRITICAL') as critical_issues,
            (SELECT COUNT(*) FROM issue_clusters WHERE risk_level = 'HIGH') as high_issues,
            (SELECT COUNT(*) FROM root_causes) as total_root_causes,
            (SELECT COUNT(*) FROM recommendations) as total_recommendations
        """
        
        try:
            session.execute(text(summary_query))
            session.commit()
            print("✓ Created summary view: ml_results_summary")
        except Exception as e:
            print(f"Note: Could not create view: {e}")

def main():
    """Main bulk loading process"""
    print("="*80)
    print("ML RESULTS → DATABASE BULK LOADER")
    print("="*80)
    print(f"\nStart Time: {datetime.now()}")
    
    try:
        # Get database engine
        print("\n[1/6] Connecting to database...")
        engine = get_db_engine()
        print("✓ Connected to PostgreSQL")
        
        # Note: In production, you'd load complaints here
        # For demo, we skip the 766K complaints to save time
        # Uncomment below to load all complaints:
        
        # print("\n[2/6] Loading complaints...")
        # complaint_count = bulk_load_complaints(engine)
        
        print("\n[2/6] Skipping complaints (use full load for production)")
        complaint_count = 0
        
        # Load ML results
        print("\n[3/6] Loading systemic issues...")
        issue_count = load_systemic_issues(engine)
        
        print("\n[4/6] Loading root causes...")
        cause_count = load_root_causes(engine)
        
        print("\n[5/6] Loading recommendations...")
        rec_count = load_recommendations(engine)
        
        print("\n[6/6] Verifying database...")
        verify_database_counts(engine)
        
        # Create summary
        create_summary_stats(engine)
        
        # Final summary
        print("\n" + "="*80)
        print("✅ DATABASE LOADING COMPLETE")
        print("="*80)
        print(f"\nLoaded:")
        print(f"  Complaints: {complaint_count:,} (skipped in demo)")
        print(f"  Systemic Issues: {issue_count:,}")
        print(f"  Root Causes: {cause_count:,}")
        print(f"  Recommendations: {rec_count:,}")
        
        print(f"\nEnd Time: {datetime.now()}")
        print("\n✓ All ML results loaded into PostgreSQL!")
        print("✓ Ready for API queries")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    
    if success:
        print("\n" + "="*80)
        print("NEXT STEPS")
        print("="*80)
        print("\n1. Test API endpoints:")
        print("   GET /api/v1/analytics/systemic-issues")
        print("   GET /api/v1/analytics/systemic-issues?risk_level=CRITICAL")
        print("\n2. Query database directly:")
        print("   SELECT * FROM issue_clusters WHERE risk_level='CRITICAL';")
        print("\n3. For full production deployment:")
        print("   - Uncomment bulk_load_complaints() in main()")
        print("   - Run with full 766K complaint loading")
