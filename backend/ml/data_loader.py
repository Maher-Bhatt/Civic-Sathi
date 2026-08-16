"""
JANMIND Data Loader Module
Phase 2: Data Loading & Merging

Safely loads and merges the 6 CSV files into a master dataset.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import json


class DataLoader:
    """Load and merge JANMIND grievance datasets"""
    
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.raw_dir = data_dir / "raw"
        self.processed_dir = data_dir / "processed"
        self.processed_dir.mkdir(exist_ok=True)
        
        self.files = [f"grievances_{year}.csv" for year in range(2020, 2026)]
    
    def load_single_file(self, filename: str) -> pd.DataFrame:
        """Load a single CSV file with validation"""
        filepath = self.raw_dir / filename
        
        print(f"  Loading {filename}...")
        
        # Load CSV
        df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
        
        # Add source tracking
        year = filename.split('_')[1].split('.')[0]
        df['source_file'] = filename
        df['source_year'] = int(year)
        
        print(f"    ✓ Loaded {len(df):,} rows")
        
        return df
    
    def merge_all_files(self) -> pd.DataFrame:
        """Merge all 6 CSV files safely"""
        print("\n" + "="*80)
        print("MERGING 6 DATASETS")
        print("="*80)
        
        all_dfs = []
        total_rows_before = 0
        
        # Load each file
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                print(f"  ⚠ {filename} not found, skipping")
                continue
            
            df = self.load_single_file(filename)
            total_rows_before += len(df)
            all_dfs.append(df)
        
        # Merge
        print(f"\n  Concatenating {len(all_dfs)} dataframes...")
        merged_df = pd.concat(all_dfs, ignore_index=True)
        
        print(f"\n  ✓ Rows before merge: {total_rows_before:,}")
        print(f"  ✓ Rows after merge: {len(merged_df):,}")
        print(f"  ✓ Difference: {total_rows_before - len(merged_df):,}")
        
        # Validate
        assert len(merged_df) == total_rows_before, "Row count mismatch!"
        
        return merged_df
    
    def save_master_dataset(self, df: pd.DataFrame, filename: str = "janmind_master.csv"):
        """Save the merged master dataset"""
        filepath = self.processed_dir / filename
        
        print(f"\n  Saving master dataset to {filename}...")
        df.to_csv(filepath, index=False, encoding='utf-8')
        
        size_mb = filepath.stat().st_size / (1024 * 1024)
        print(f"  ✓ Saved {len(df):,} rows ({size_mb:.2f} MB)")
        
        return filepath
    
    def load_master_dataset(self, filename: str = "janmind_master.csv") -> pd.DataFrame:
        """Load the master dataset"""
        filepath = self.processed_dir / filename
        
        if not filepath.exists():
            raise FileNotFoundError(f"Master dataset not found: {filepath}")
        
        print(f"  Loading master dataset from {filename}...")
        df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
        print(f"  ✓ Loaded {len(df):,} rows")
        
        return df
    
    def get_data_summary(self, df: pd.DataFrame) -> dict:
        """Get summary statistics"""
        return {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "memory_usage_mb": df.memory_usage(deep=True).sum() / (1024 * 1024),
            "date_range": {
                "min": str(pd.to_datetime(df['Grievance Date']).min()),
                "max": str(pd.to_datetime(df['Grievance Date']).max())
            },
            "years": sorted(df['source_year'].unique().tolist()),
            "categories": df['Category'].nunique(),
            "subcategories": df['Sub Category'].nunique(),
            "wards": df['Ward Name'].nunique(),
            "statuses": df['Grievance Status'].nunique()
        }


def main():
    """Run data loading and merging"""
    print("="*80)
    print("JANMIND DATA LOADER - PHASE 2")
    print("="*80)
    
    data_dir = Path(__file__).parent.parent / "data"
    loader = DataLoader(data_dir)
    
    # Merge all files
    df = loader.merge_all_files()
    
    # Save master dataset
    loader.save_master_dataset(df)
    
    # Summary
    summary = loader.get_data_summary(df)
    
    print("\n" + "="*80)
    print("MERGE SUMMARY")
    print("="*80)
    print(f"  Total Records: {summary['total_rows']:,}")
    print(f"  Date Range: {summary['date_range']['min']} to {summary['date_range']['max']}")
    print(f"  Years: {summary['years']}")
    print(f"  Unique Categories: {summary['categories']}")
    print(f"  Unique Subcategories: {summary['subcategories']}")
    print(f"  Unique Wards: {summary['wards']}")
    print(f"  Memory Usage: {summary['memory_usage_mb']:.2f} MB")
    print("="*80)
    
    return df


if __name__ == "__main__":
    main()
