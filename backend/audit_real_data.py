"""
JANMIND Backend - Real Data Audit Script
Analyzes all 6 CSV files (2020-2025) for quality, consistency, and completeness
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import json

def audit_file(filepath: Path, year: str) -> dict:
    """Audit a single CSV file"""
    print(f"\n{'='*60}")
    print(f"Auditing: {filepath.name}")
    print(f"{'='*60}")
    
    df = pd.read_csv(filepath)
    
    audit = {
        'file': filepath.name,
        'year': year,
        'row_count': len(df),
        'column_count': len(df.columns),
        'columns': list(df.columns),
        'memory_mb': df.memory_usage(deep=True).sum() / 1024 / 1024,
    }
    
    # Basic stats
    print(f"Rows: {audit['row_count']:,}")
    print(f"Columns: {audit['column_count']}")
    print(f"Memory: {audit['memory_mb']:.2f} MB")
    print(f"Columns: {audit['columns']}")
    
    # Missing values
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    audit['missing_values'] = {
        col: {'count': int(missing[col]), 'percent': float(missing_pct[col])}
        for col in df.columns if missing[col] > 0
    }
    
    print(f"\n--- Missing Values ---")
    for col, stats in audit['missing_values'].items():
        print(f"  {col}: {stats['count']:,} ({stats['percent']:.2f}%)")
    
    # Empty strings (not null but empty)
    empty_counts = {}
    for col in df.columns:
        if df[col].dtype == 'object':
            empty = (df[col].astype(str).str.strip() == '').sum()
            if empty > 0:
                empty_counts[col] = int(empty)
    
    audit['empty_strings'] = empty_counts
    if empty_counts:
        print(f"\n--- Empty Strings ---")
        for col, count in empty_counts.items():
            print(f"  {col}: {count:,}")
    
    # Duplicate Complaint IDs
    if 'Complaint ID' in df.columns:
        duplicates = df['Complaint ID'].duplicated().sum()
        audit['duplicate_ids'] = int(duplicates)
        print(f"\n--- Duplicates ---")
        print(f"  Duplicate Complaint IDs: {duplicates:,}")
    
    # Unique values for categorical columns
    categorical_cols = ['Category', 'Sub Category', 'Ward Name', 'Grievance Status']
    audit['unique_values'] = {}
    
    for col in categorical_cols:
        if col in df.columns:
            unique = df[col].nunique()
            audit['unique_values'][col] = {
                'count': int(unique),
                'top_10': df[col].value_counts().head(10).to_dict()
            }
            print(f"\n--- {col} (unique: {unique}) ---")
            for val, count in list(df[col].value_counts().head(10).items()):
                print(f"  {val}: {count:,}")
    
    # Date range
    if 'Grievance Date' in df.columns:
        try:
            df['parsed_date'] = pd.to_datetime(df['Grievance Date'], errors='coerce')
            date_nulls = df['parsed_date'].isnull().sum()
            
            if date_nulls < len(df):
                min_date = df['parsed_date'].min()
                max_date = df['parsed_date'].max()
                audit['date_range'] = {
                    'min': str(min_date),
                    'max': str(max_date),
                    'unparseable': int(date_nulls)
                }
                print(f"\n--- Date Range ---")
                print(f"  Min: {min_date}")
                print(f"  Max: {max_date}")
                print(f"  Unparseable: {date_nulls:,}")
        except Exception as e:
            audit['date_range'] = {'error': str(e)}
            print(f"\n--- Date Range ---")
            print(f"  Error parsing dates: {e}")
    
    return audit


def cross_file_analysis(all_audits: list, dfs: dict):
    """Analyze consistency across all files"""
    print(f"\n{'='*60}")
    print("CROSS-FILE ANALYSIS")
    print(f"{'='*60}")
    
    analysis = {
        'total_records': sum(a['row_count'] for a in all_audits),
        'files': len(all_audits)
    }
    
    print(f"\nTotal Records: {analysis['total_records']:,}")
    print(f"Total Files: {analysis['files']}")
    
    # Check schema consistency
    base_columns = set(all_audits[0]['columns'])
    schema_consistent = all(set(a['columns']) == base_columns for a in all_audits)
    analysis['schema_consistent'] = schema_consistent
    
    print(f"\nSchema Consistent: {schema_consistent}")
    if not schema_consistent:
        print("  WARNING: Column mismatches detected!")
        for audit in all_audits:
            diff = set(audit['columns']) - base_columns
            if diff:
                print(f"    {audit['file']}: Extra columns {diff}")
    
    # Check for duplicate Complaint IDs across files
    all_ids = []
    for year, df in dfs.items():
        if 'Complaint ID' in df.columns:
            all_ids.extend(df['Complaint ID'].dropna().tolist())
    
    total_ids = len(all_ids)
    unique_ids = len(set(all_ids))
    cross_file_duplicates = total_ids - unique_ids
    
    analysis['complaint_ids'] = {
        'total': total_ids,
        'unique': unique_ids,
        'duplicates_across_files': cross_file_duplicates
    }
    
    print(f"\n--- Complaint IDs Across All Files ---")
    print(f"  Total IDs: {total_ids:,}")
    print(f"  Unique IDs: {unique_ids:,}")
    print(f"  Cross-file Duplicates: {cross_file_duplicates:,}")
    
    # Category consistency
    all_categories = set()
    all_subcategories = set()
    all_wards = set()
    all_statuses = set()
    
    for year, df in dfs.items():
        if 'Category' in df.columns:
            all_categories.update(df['Category'].dropna().unique())
        if 'Sub Category' in df.columns:
            all_subcategories.update(df['Sub Category'].dropna().unique())
        if 'Ward Name' in df.columns:
            all_wards.update(df['Ward Name'].dropna().unique())
        if 'Grievance Status' in df.columns:
            all_statuses.update(df['Grievance Status'].dropna().unique())
    
    analysis['global_unique_values'] = {
        'categories': len(all_categories),
        'subcategories': len(all_subcategories),
        'wards': len(all_wards),
        'statuses': len(all_statuses)
    }
    
    print(f"\n--- Global Unique Values ---")
    print(f"  Categories: {len(all_categories)}")
    print(f"  Sub Categories: {len(all_subcategories)}")
    print(f"  Wards: {len(all_wards)}")
    print(f"  Statuses: {len(all_statuses)}")
    
    print(f"\nAll Categories: {sorted(all_categories)[:20]}")
    print(f"\nAll Statuses: {sorted(all_statuses)}")
    
    return analysis


def main():
    """Run complete data audit"""
    data_dir = Path('data/raw')
    
    if not data_dir.exists():
        print(f"ERROR: Directory {data_dir} not found!")
        return
    
    # Load all files
    years = ['2020', '2021', '2022', '2023', '2024', '2025']
    dfs = {}
    all_audits = []
    
    for year in years:
        filepath = data_dir / f'grievances_{year}.csv'
        if filepath.exists():
            audit = audit_file(filepath, year)
            all_audits.append(audit)
            dfs[year] = pd.read_csv(filepath)
        else:
            print(f"WARNING: {filepath} not found!")
    
    # Cross-file analysis
    if len(dfs) > 0:
        cross_analysis = cross_file_analysis(all_audits, dfs)
    
    # Save complete audit report
    report = {
        'audit_timestamp': datetime.now().isoformat(),
        'individual_files': all_audits,
        'cross_file_analysis': cross_analysis if len(dfs) > 0 else {}
    }
    
    report_path = Path('data/processed/data_audit_report.json')
    report_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n{'='*60}")
    print(f"AUDIT COMPLETE")
    print(f"{'='*60}")
    print(f"Report saved to: {report_path}")
    print(f"\nSummary:")
    print(f"  Files audited: {len(all_audits)}")
    print(f"  Total records: {sum(a['row_count'] for a in all_audits):,}")
    print(f"  Schema consistent: {cross_analysis.get('schema_consistent', False)}")
    print(f"  Cross-file duplicates: {cross_analysis.get('complaint_ids', {}).get('duplicates_across_files', 0):,}")


if __name__ == '__main__':
    main()
