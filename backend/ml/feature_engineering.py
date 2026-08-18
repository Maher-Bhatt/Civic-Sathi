"""
Civic Sathi Feature Engineering Module
Phase 3: Advanced Feature Creation for ML

Creates frequency, temporal, and aggregation features for systemic issue detection.
"""

import pandas as pd
import numpy as np
from pathlib import Path


class FeatureEngineer:
    """Create ML features for systemic issue detection"""
    
    def __init__(self):
        pass
    
    def engineer_all_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create all ML features - Memory optimized (no copy)"""
        print("\n" + "="*80)
        print("FEATURE ENGINEERING FOR ML")
        print("="*80)
        
        # Work directly on df to avoid memory-intensive copy operation
        # (df is already loaded, no need to copy for feature engineering)
        
        # 1. Frequency Features
        print("\n[1/5] Creating frequency features...")
        df = self.create_frequency_features(df)
        
        # 2. Rolling Window Features
        print("[2/5] Creating rolling window features...")
        df = self.create_rolling_features(df)
        
        # 3. Category Criticality Scores
        print("[3/5] Creating category criticality scores...")
        df = self.create_category_scores(df)
        
        # 4. Ward Concentration Metrics
        print("[4/5] Creating ward concentration metrics...")
        df = self.create_ward_metrics(df)
        
        # 5. Recurrence Features
        print("[5/5] Creating recurrence features...")
        df = self.create_recurrence_features(df)
        
        print(f"\n✓ Feature engineering complete!")
        print(f"  Total columns: {len(df.columns)}")
        
        return df
    
    def create_frequency_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create frequency-based features"""
        # Complaints per category
        df['category_frequency'] = df.groupby('category')['complaint_id'].transform('count')
        
        # Complaints per subcategory
        df['subcategory_frequency'] = df.groupby('subcategory')['complaint_id'].transform('count')
        
        # Complaints per ward
        df['ward_frequency'] = df.groupby('ward_name')['complaint_id'].transform('count')
        
        # Complaints per category-ward combination
        df['category_ward_frequency'] = df.groupby(['category', 'ward_name'])['complaint_id'].transform('count')
        
        # Complaints per category-subcategory
        df['category_subcat_frequency'] = df.groupby(['category', 'subcategory'])['complaint_id'].transform('count')
        
        print(f"  ✓ Created 5 frequency features")
        
        return df
    
    def create_rolling_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create rolling window aggregations - Memory optimized"""
        # Sort by date
        df = df.sort_values('grievance_date')
        
        # Create date-based groups for rolling calculations
        df['date_only_str'] = df['date_only'].astype(str)
        
        # Daily complaint counts - using map (efficient)
        daily_counts = df.groupby('date_only_str').size()
        df['complaints_same_day'] = df['date_only_str'].map(daily_counts)
        
        # Weekly rolling average - using merge instead of apply
        weekly_counts = df.groupby(['year', 'week']).size().reset_index(name='complaints_same_week')
        df = df.merge(weekly_counts, on=['year', 'week'], how='left')
        
        # Monthly rolling average - using merge instead of apply
        monthly_counts = df.groupby(['year', 'month']).size().reset_index(name='complaints_same_month')
        df = df.merge(monthly_counts, on=['year', 'month'], how='left')
        
        print(f"  ✓ Created 3 rolling window features")
        
        return df
    
    def create_category_scores(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create category criticality scores"""
        # Define category criticality (domain knowledge)
        criticality_map = {
            'Electrical': 20,
            'Solid Waste (Garbage) Related': 18,
            'Road Maintenance(Engg)': 17,
            'Water Crisis': 25,
            'Health Dept': 22,
            'Sanitation': 21,
            'Storm  Water Drain(SWD)': 19,
            'Road Infrastructure': 16,
            'Forest': 10,
            'Parks and Play grounds': 8,
            'Lakes': 12,
            'veterinary': 15,
            'Town Planning': 11,
            'Advertisement': 5,
            'Revenue Department': 13,
            'Traffic Engineer Cell (TEC)': 14,
            'CORONA COVID19': 24,
            'Markets': 9,
            'Optical Fiber Cables (OFC)': 7,
            'Estate': 6
        }
        
        df['category_criticality'] = df['category'].map(criticality_map).fillna(10)
        
        # Normalize to 0-1
        df['category_criticality_normalized'] = df['category_criticality'] / 25.0
        
        print(f"  ✓ Created 2 category criticality features")
        
        return df
    
    def create_ward_metrics(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create ward-level concentration metrics"""
        # Complaints per ward normalized
        ward_max = df['ward_frequency'].max()
        df['ward_frequency_normalized'] = df['ward_frequency'] / ward_max
        
        # Ward rank (1 = highest complaints)
        ward_ranks = df.groupby('ward_name')['complaint_id'].count().rank(ascending=False).to_dict()
        df['ward_rank'] = df['ward_name'].map(ward_ranks)
        
        print(f"  ✓ Created 2 ward concentration features")
        
        return df
    
    def create_recurrence_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create recurrence-based features"""
        # Reopen rate per category
        reopen_rates = df.groupby('category')['is_reopened'].mean().to_dict()
        df['category_reopen_rate'] = df['category'].map(reopen_rates)
        
        # Reopen rate per ward
        ward_reopen_rates = df.groupby('ward_name')['is_reopened'].mean().to_dict()
        df['ward_reopen_rate'] = df['ward_name'].map(ward_reopen_rates)
        
        # Closure rate per category
        closure_rates = df.groupby('category')['is_closed'].mean().to_dict()
        df['category_closure_rate'] = df['category'].map(closure_rates)
        
        print(f"  ✓ Created 3 recurrence features")
        
        return df
    
    def get_feature_summary(self, df: pd.DataFrame) -> dict:
        """Get summary of engineered features"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        return {
            "total_columns": len(df.columns),
            "numeric_features": len(numeric_cols),
            "categorical_features": len(df.select_dtypes(include=['object']).columns),
            "date_features": len(df.select_dtypes(include=['datetime64']).columns),
            "sample_features": list(df.columns[-20:])  # Last 20 columns
        }


def main():
    """Run feature engineering"""
    print("="*80)
    print("Civic Sathi FEATURE ENGINEERING - PHASE 3")
    print("="*80)
    
    # Load cleaned data
    data_dir = Path(__file__).parent.parent / "data"
    df = pd.read_csv(data_dir / "processed" / "civicsathi_cleaned.csv", parse_dates=['grievance_date'])
    
    print(f"\nLoaded {len(df):,} cleaned records")
    print(f"Starting columns: {len(df.columns)}")
    
    # Engineer features
    engineer = FeatureEngineer()
    df_features = engineer.engineer_all_features(df)
    
    # Save
    output_path = data_dir / "processed" / "civicsathi_features.csv"
    df_features.to_csv(output_path, index=False)
    
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"\n✓ Saved feature dataset: {output_path.name} ({size_mb:.2f} MB)")
    
    # Summary
    summary = engineer.get_feature_summary(df_features)
    
    print("\n" + "="*80)
    print("FEATURE ENGINEERING SUMMARY")
    print("="*80)
    print(f"  Total Columns: {summary['total_columns']}")
    print(f"  Numeric Features: {summary['numeric_features']}")
    print(f"  Categorical Features: {summary['categorical_features']}")
    print("="*80)
    
    return df_features


if __name__ == "__main__":
    main()
