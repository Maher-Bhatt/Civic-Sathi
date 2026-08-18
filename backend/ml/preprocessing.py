"""
Civic Sathi Data Preprocessing Module
Phase 2: Data Cleaning & Standardization

Cleans and standardizes the merged master dataset.
"""

import pandas as pd
import numpy as np
import re
from pathlib import Path
from datetime import datetime


class DataPreprocessor:
    """Clean and standardize Civic Sathi data"""
    
    def __init__(self):
        self.category_mapping = {}
        self.subcategory_mapping = {}
        self.ward_mapping = {}
        self.status_mapping = {}
    
    def clean_all(self, df: pd.DataFrame) -> pd.DataFrame:
        """Run all cleaning operations"""
        print("\n" + "="*80)
        print("DATA PREPROCESSING")
        print("="*80)
        
        # Create a copy
        df_clean = df.copy()
        
        # 1. Clean column names
        print("\n[1/8] Cleaning column names...")
        df_clean = self.clean_column_names(df_clean)
        
        # 2. Parse dates
        print("[2/8] Parsing dates...")
        df_clean = self.parse_dates(df_clean)
        
        # 3. Handle missing values
        print("[3/8] Handling missing values...")
        df_clean = self.handle_missing_values(df_clean)
        
        # 4. Standardize text fields
        print("[4/8] Standardizing text fields...")
        df_clean = self.standardize_text_fields(df_clean)
        
        # 5. Standardize categories
        print("[5/8] Standardizing categories...")
        df_clean = self.standardize_categories(df_clean)
        
        # 6. Standardize statuses
        print("[6/8] Standardizing statuses...")
        df_clean = self.standardize_statuses(df_clean)
        
        # 7. Standardize wards
        print("[7/8] Standardizing wards...")
        df_clean = self.standardize_wards(df_clean)
        
        # 8. Add derived fields
        print("[8/8] Adding derived fields...")
        df_clean = self.add_derived_fields(df_clean)
        
        print("\n✓ Preprocessing complete!")
        
        return df_clean
    
    def clean_column_names(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize column names"""
        # Rename to snake_case
        column_map = {
            'Complaint ID': 'complaint_id',
            'Category': 'category',
            'Sub Category': 'subcategory',
            'Grievance Date': 'grievance_date',
            'Ward Name': 'ward_name',
            'Grievance Status': 'status',
            'Staff Remarks': 'staff_remarks',
            'Staff Name': 'staff_name',
            'source_file': 'source_file',
            'source_year': 'source_year'
        }
        
        df = df.rename(columns=column_map)
        print(f"  ✓ Renamed {len(column_map)} columns to snake_case")
        
        return df
    
    def parse_dates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Parse date columns"""
        df['grievance_date'] = pd.to_datetime(df['grievance_date'], errors='coerce')
        
        # Check for parsing errors
        null_dates = df['grievance_date'].isnull().sum()
        if null_dates > 0:
            print(f"  ⚠ {null_dates} dates could not be parsed")
        else:
            print(f"  ✓ All dates parsed successfully")
        
        return df
    
    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values"""
        before = df.isnull().sum().sum()
        
        # Status: Fill with 'Unknown'
        df['status'] = df['status'].fillna('Unknown')
        
        # Staff Remarks: Fill with empty string
        df['staff_remarks'] = df['staff_remarks'].fillna('')
        
        # Staff Name: Fill with 'Unassigned'
        df['staff_name'] = df['staff_name'].fillna('Unassigned')
        
        after = df.isnull().sum().sum()
        
        print(f"  ✓ Missing values: {before} → {after}")
        
        return df
    
    def standardize_text_fields(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize text fields"""
        text_columns = ['category', 'subcategory', 'ward_name', 'status', 'staff_remarks', 'staff_name']
        
        for col in text_columns:
            if col in df.columns:
                # Strip whitespace
                df[col] = df[col].astype(str).str.strip()
                
                # Remove multiple spaces
                df[col] = df[col].str.replace(r'\s+', ' ', regex=True)
        
        print(f"  ✓ Standardized {len(text_columns)} text fields")
        
        return df
    
    def standardize_categories(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize category names"""
        # Keep original
        df['category_raw'] = df['category']
        df['subcategory_raw'] = df['subcategory']
        
        # Count unique values
        unique_categories = df['category'].nunique()
        unique_subcategories = df['subcategory'].nunique()
        
        print(f"  ✓ {unique_categories} unique categories")
        print(f"  ✓ {unique_subcategories} unique subcategories")
        
        # Top categories
        top_5 = df['category'].value_counts().head()
        print(f"\n  Top 5 Categories:")
        for cat, count in top_5.items():
            print(f"    - {cat}: {count:,}")
        
        return df
    
    def standardize_statuses(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize status values"""
        # Keep original
        df['status_raw'] = df['status']
        
        # Map to standard statuses
        status_map = {
            'Closed': 'closed',
            'Registered': 'registered',
            'Rejected': 'rejected',
            'Resolved': 'resolved',
            'ReOpen': 'reopened',
            'Non Relevant': 'non_relevant',
            'In Progress': 'in_progress',
            'Long Term Solution': 'long_term',
            'Unknown': 'unknown'
        }
        
        df['status_normalized'] = df['status'].map(status_map).fillna('other')
        
        # Count statuses
        status_counts = df['status_normalized'].value_counts()
        print(f"\n  Status Distribution:")
        for status, count in status_counts.items():
            pct = (count / len(df)) * 100
            print(f"    - {status}: {count:,} ({pct:.1f}%)")
        
        return df
    
    def standardize_wards(self, df: pd.DataFrame) -> pd.DataFrame:
        """Standardize ward names"""
        # Keep original
        df['ward_name_raw'] = df['ward_name']
        
        # Count unique wards
        unique_wards = df['ward_name'].nunique()
        print(f"  ✓ {unique_wards} unique wards")
        
        # Top wards
        top_10 = df['ward_name'].value_counts().head(10)
        print(f"\n  Top 10 Wards:")
        for ward, count in top_10.items():
            print(f"    - {ward}: {count:,}")
        
        return df
    
    def add_derived_fields(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add derived features"""
        # Temporal features
        df['year'] = df['grievance_date'].dt.year
        df['month'] = df['grievance_date'].dt.month
        df['week'] = df['grievance_date'].dt.isocalendar().week
        df['day_of_week'] = df['grievance_date'].dt.dayofweek
        df['day_name'] = df['grievance_date'].dt.day_name()
        df['month_name'] = df['grievance_date'].dt.month_name()
        df['quarter'] = df['grievance_date'].dt.quarter
        
        # Date components
        df['date_only'] = df['grievance_date'].dt.date
        
        # Boolean flags
        df['is_closed'] = df['status_normalized'] == 'closed'
        df['is_reopened'] = df['status_normalized'] == 'reopened'
        df['is_registered'] = df['status_normalized'] == 'registered'
        df['is_rejected'] = df['status_normalized'] == 'rejected'
        
        # Text length
        df['staff_remarks_length'] = df['staff_remarks'].str.len()
        df['has_remarks'] = df['staff_remarks_length'] > 5
        
        print(f"  ✓ Added 17 derived fields")
        
        return df
    
    def get_preprocessing_report(self, df_before: pd.DataFrame, df_after: pd.DataFrame) -> dict:
        """Generate preprocessing report"""
        return {
            "rows_before": len(df_before),
            "rows_after": len(df_after),
            "rows_removed": len(df_before) - len(df_after),
            "columns_before": len(df_before.columns),
            "columns_after": len(df_after.columns),
            "columns_added": len(df_after.columns) - len(df_before.columns),
            "missing_before": int(df_before.isnull().sum().sum()),
            "missing_after": int(df_after.isnull().sum().sum()),
            "unique_categories": int(df_after['category'].nunique()),
            "unique_subcategories": int(df_after['subcategory'].nunique()),
            "unique_wards": int(df_after['ward_name'].nunique()),
            "date_range": {
                "min": str(df_after['grievance_date'].min()),
                "max": str(df_after['grievance_date'].max())
            }
        }


def main():
    """Run preprocessing"""
    from ml.data_loader import DataLoader
    
    print("="*80)
    print("Civic Sathi DATA PREPROCESSING - PHASE 2")
    print("="*80)
    
    # Load master dataset
    data_dir = Path(__file__).parent.parent / "data"
    loader = DataLoader(data_dir)
    
    df = loader.load_master_dataset()
    df_before = df.copy()
    
    # Preprocess
    preprocessor = DataPreprocessor()
    df_clean = preprocessor.clean_all(df)
    
    # Save cleaned dataset
    output_path = data_dir / "processed" / "civicsathi_cleaned.csv"
    df_clean.to_csv(output_path, index=False, encoding='utf-8')
    
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"\n✓ Saved cleaned dataset: {output_path.name} ({size_mb:.2f} MB)")
    
    # Report
    report = preprocessor.get_preprocessing_report(df_before, df_clean)
    
    print("\n" + "="*80)
    print("PREPROCESSING SUMMARY")
    print("="*80)
    print(f"  Rows: {report['rows_before']:,} → {report['rows_after']:,}")
    print(f"  Columns: {report['columns_before']} → {report['columns_after']} (+{report['columns_added']})")
    print(f"  Missing Values: {report['missing_before']} → {report['missing_after']}")
    print(f"  Unique Categories: {report['unique_categories']}")
    print(f"  Unique Subcategories: {report['unique_subcategories']}")
    print(f"  Unique Wards: {report['unique_wards']}")
    print("="*80)
    
    return df_clean


if __name__ == "__main__":
    main()
