"""
JANMIND Backend - Data Cleaning and Master Dataset Creation
Cleans all 6 CSV files and creates a master dataset
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import json

# Column name standardization
STANDARD_COLUMNS = [
    'complaint_id',
    'category',
    'sub_category', 
    'grievance_date',
    'ward_name',
    'grievance_status',
    'staff_remarks',
    'staff_name',
    'source_file',
    'source_year'
]

# Category normalization mapping
CATEGORY_MAPPING = {
    'solid waste (garbage) related': 'sanitation',
    'garbage': 'sanitation',
    'forest': 'forest',
    'electrical': 'electricity',
    'road maintenance(engg)': 'roads',
    'road maintenance': 'roads',
    'road infrastructure': 'roads',
    'storm  water drain(swd)': 'drainage',
    'storm water drain': 'drainage',
    'swd': 'drainage',
    'water supply': 'water',
    'health dept': 'health',
    'veterinary': 'veterinary',
    'revenue department': 'revenue',
    'corona covid19': 'health',
    'covid': 'health',
    'town planning': 'planning',
    'parks and play grounds': 'parks',
    'others': 'other',
}

# Status normalization
STATUS_MAPPING = {
    'closed': 'resolved',
    'resolved': 'resolved',
    'rejected': 'rejected',
    'non relevant': 'rejected',
    'registered': 'received',
    'in progress': 'in_progress',
    'reopen': 'in_progress',
    'long term solution': 'acknowledged',
}


def normalize_text(text: str) -> str:
    """Normalize text field"""
    if pd.isna(text):
        return ''
    
    text = str(text).strip()
    text = ' '.join(text.split())  # Normalize whitespace
    return text


def normalize_category(category: str) -> str:
    """Normalize category to standard values"""
    if pd.isna(category):
        return 'other'
    
    category_lower = str(category).lower().strip()
    return CATEGORY_MAPPING.get(category_lower, 'other')


def normalize_status(status: str) -> str:
    """Normalize status to standard values"""
    if pd.isna(status):
        return 'received'
    
    status_lower = str(status).lower().strip()
    return STATUS_MAPPING.get(status_lower, 'received')


def normalize_ward(ward: str) -> str:
    """Normalize ward name"""
    if pd.isna(ward):
        return ''
    
    ward = str(ward).strip()
    # Remove extra spaces
    ward = ' '.join(ward.split())
    return ward


def clean_dataframe(df: pd.DataFrame, year: str, filename: str) -> pd.DataFrame:
    """Clean a single dataframe"""
    print(f"\nCleaning {filename}...")
    print(f"  Initial rows: {len(df):,}")
    
    # Create a copy
    df_clean = df.copy()
    
    # Standardize column names
    df_clean.columns = [col.strip().lower().replace(' ', '_') for col in df_clean.columns]
    
    # Rename to standard names
    column_rename = {
        'complaint_id': 'complaint_id',
        'category': 'category',
        'sub_category': 'sub_category',
        'grievance_date': 'grievance_date',
        'ward_name': 'ward_name',
        'grievance_status': 'grievance_status',
        'staff_remarks': 'staff_remarks',
        'staff_name': 'staff_name',
    }
    df_clean = df_clean.rename(columns=column_rename)
    
    # Add source tracking
    df_clean['source_file'] = filename
    df_clean['source_year'] = year
    
    # Normalize text fields
    for col in ['complaint_id', 'category', 'sub_category', 'ward_name', 
                'grievance_status', 'staff_remarks', 'staff_name']:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].apply(normalize_text)
    
    # Normalize categories
    df_clean['category_original'] = df_clean['category']
    df_clean['category_normalized'] = df_clean['category'].apply(normalize_category)
    
    # Normalize status
    df_clean['status_original'] = df_clean['grievance_status']
    df_clean['status_normalized'] = df_clean['grievance_status'].apply(normalize_status)
    
    # Normalize ward names
    df_clean['ward_original'] = df_clean['ward_name']
    df_clean['ward_normalized'] = df_clean['ward_name'].apply(normalize_ward)
    
    # Parse dates
    df_clean['grievance_date_parsed'] = pd.to_datetime(
        df_clean['grievance_date'], 
        errors='coerce'
    )
    
    # Extract date components
    df_clean['year'] = df_clean['grievance_date_parsed'].dt.year
    df_clean['month'] = df_clean['grievance_date_parsed'].dt.month
    df_clean['day_of_week'] = df_clean['grievance_date_parsed'].dt.day_name()
    
    # Quality flags
    df_clean['has_valid_date'] = df_clean['grievance_date_parsed'].notna()
    df_clean['has_ward'] = df_clean['ward_normalized'] != ''
    df_clean['has_staff_remarks'] = df_clean['staff_remarks'] != ''
    df_clean['has_staff_name'] = df_clean['staff_name'] != ''
    
    # Create text for NLP (combines title-like info from sub_category + staff remarks)
    df_clean['text_for_nlp'] = (
        df_clean['sub_category'].fillna('') + '. ' + 
        df_clean['staff_remarks'].fillna('')
    ).str.strip()
    
    print(f"  After cleaning: {len(df_clean):,} rows")
    print(f"  Valid dates: {df_clean['has_valid_date'].sum():,}")
    print(f"  With ward: {df_clean['has_ward'].sum():,}")
    print(f"  With staff remarks: {df_clean['has_staff_remarks'].sum():,}")
    
    return df_clean


def create_master_dataset(cleaned_dfs: list[pd.DataFrame]) -> pd.DataFrame:
    """Merge all cleaned dataframes"""
    print(f"\n{'='*60}")
    print("Creating Master Dataset")
    print(f"{'='*60}")
    
    # Concatenate all
    master = pd.concat(cleaned_dfs, ignore_index=True)
    
    print(f"\nTotal records: {len(master):,}")
    print(f"Date range: {master['grievance_date_parsed'].min()} to {master['grievance_date_parsed'].max()}")
    print(f"Unique complaint IDs: {master['complaint_id'].nunique():,}")
    
    # Check for duplicates
    duplicates = master[master['complaint_id'].duplicated(keep=False)]
    if len(duplicates) > 0:
        print(f"\nWARNING: {len(duplicates):,} duplicate complaint IDs found!")
        print(duplicates[['complaint_id', 'source_file']].head(20))
    
    # Category distribution
    print(f"\n--- Category Distribution (Normalized) ---")
    category_dist = master['category_normalized'].value_counts()
    for cat, count in category_dist.head(15).items():
        pct = (count / len(master) * 100)
        print(f"  {cat}: {count:,} ({pct:.1f}%)")
    
    # Status distribution
    print(f"\n--- Status Distribution (Normalized) ---")
    status_dist = master['status_normalized'].value_counts()
    for status, count in status_dist.items():
        pct = (count / len(master) * 100)
        print(f"  {status}: {count:,} ({pct:.1f}%)")
    
    # Ward distribution
    print(f"\n--- Top 20 Wards ---")
    ward_dist = master['ward_normalized'].value_counts()
    for ward, count in ward_dist.head(20).items():
        if ward:
            print(f"  {ward}: {count:,}")
    
    # Year distribution
    print(f"\n--- Records by Year ---")
    year_dist = master['source_year'].value_counts().sort_index()
    for year, count in year_dist.items():
        print(f"  {year}: {count:,}")
    
    # Data quality summary
    print(f"\n--- Data Quality Summary ---")
    print(f"  Valid dates: {master['has_valid_date'].sum():,} ({master['has_valid_date'].mean()*100:.1f}%)")
    print(f"  With ward: {master['has_ward'].sum():,} ({master['has_ward'].mean()*100:.1f}%)")
    print(f"  With staff remarks: {master['has_staff_remarks'].sum():,} ({master['has_staff_remarks'].mean()*100:.1f}%)")
    print(f"  With staff name: {master['has_staff_name'].sum():,} ({master['has_staff_name'].mean()*100:.1f}%)")
    
    return master


def save_datasets(master: pd.DataFrame):
    """Save cleaned datasets"""
    output_dir = Path('data/processed')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Full master dataset
    master_path = output_dir / 'janmind_master.csv'
    master.to_csv(master_path, index=False)
    print(f"\n✓ Saved master dataset: {master_path}")
    print(f"  Rows: {len(master):,}")
    print(f"  Size: {master_path.stat().st_size / 1024 / 1024:.2f} MB")
    
    # Create a sample for quick testing (10k records)
    sample = master.sample(n=min(10000, len(master)), random_state=42)
    sample_path = output_dir / 'janmind_master_sample_10k.csv'
    sample.to_csv(sample_path, index=False)
    print(f"\n✓ Saved sample dataset: {sample_path}")
    print(f"  Rows: {len(sample):,}")
    
    # Save metadata
    metadata = {
        'created_at': datetime.now().isoformat(),
        'total_records': len(master),
        'unique_complaint_ids': int(master['complaint_id'].nunique()),
        'date_range': {
            'min': str(master['grievance_date_parsed'].min()),
            'max': str(master['grievance_date_parsed'].max()),
        },
        'categories': master['category_normalized'].value_counts().to_dict(),
        'statuses': master['status_normalized'].value_counts().to_dict(),
        'years': master['source_year'].value_counts().sort_index().to_dict(),
        'data_quality': {
            'valid_dates': int(master['has_valid_date'].sum()),
            'with_ward': int(master['has_ward'].sum()),
            'with_staff_remarks': int(master['has_staff_remarks'].sum()),
        },
        'columns': list(master.columns),
    }
    
    metadata_path = output_dir / 'janmind_master_metadata.json'
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2, default=str)
    
    print(f"\n✓ Saved metadata: {metadata_path}")


def main():
    """Main execution"""
    print("="*60)
    print("JANMIND DATA CLEANING & MASTER DATASET CREATION")
    print("="*60)
    
    data_dir = Path('data/raw')
    years = ['2020', '2021', '2022', '2023', '2024', '2025']
    
    cleaned_dfs = []
    
    # Clean each file
    for year in years:
        filepath = data_dir / f'grievances_{year}.csv'
        if filepath.exists():
            df = pd.read_csv(filepath)
            df_clean = clean_dataframe(df, year, filepath.name)
            cleaned_dfs.append(df_clean)
        else:
            print(f"WARNING: {filepath} not found!")
    
    if not cleaned_dfs:
        print("ERROR: No data files found!")
        return
    
    # Create master dataset
    master = create_master_dataset(cleaned_dfs)
    
    # Save
    save_datasets(master)
    
    print(f"\n{'='*60}")
    print("DATA CLEANING COMPLETE")
    print(f"{'='*60}")
    print(f"\nMaster dataset ready for ML pipeline!")
    print(f"Location: data/processed/janmind_master.csv")
    print(f"Records: {len(master):,}")


if __name__ == '__main__':
    main()
