"""
Civic Sathi Risk Scoring Module
Phase 3: 6-Factor Risk Assessment

Calculates comprehensive risk scores for systemic issues.
"""

import pandas as pd
import numpy as np
from pathlib import Path


class RiskScorer:
    """Calculate 6-factor risk scores for systemic issues"""
    
    def __init__(self):
        # Risk score weights (total = 100)
        self.weights = {
            'frequency': 20,      # Complaint volume
            'temporal': 15,       # Recent spikes & growth
            'geographic': 15,     # Ward concentration
            'category': 25,       # Category criticality
            'recurrence': 15,     # Reopen rate
            'persistence': 10     # Duration & continuity
        }
    
    def calculate_all_risk_scores(self, cluster_df: pd.DataFrame) -> pd.DataFrame:
        """Calculate all 6 risk factors"""
        print("\n" + "="*80)
        print("RISK SCORING (6-FACTOR MODEL)")
        print("="*80)
        
        risk_df = cluster_df.copy()
        
        # 1. Frequency Risk (0-20)
        print("\n[1/6] Calculating frequency risk...")
        risk_df = self.calculate_frequency_risk(risk_df)
        
        # 2. Temporal Risk (0-15) - already calculated
        print("[2/6] Using temporal risk scores...")
        if 'temporal_risk_score' not in risk_df.columns:
            risk_df['temporal_risk_score'] = 0
        
        # 3. Geographic Risk (0-15)
        print("[3/6] Calculating geographic risk...")
        risk_df = self.calculate_geographic_risk(risk_df)
        
        # 4. Category Risk (0-25)
        print("[4/6] Calculating category risk...")
        risk_df = self.calculate_category_risk(risk_df)
        
        # 5. Recurrence Risk (0-15)
        print("[5/6] Calculating recurrence risk...")
        risk_df = self.calculate_recurrence_risk(risk_df)
        
        # 6. Persistence Risk (0-10)
        print("[6/6] Calculating persistence risk...")
        risk_df = self.calculate_persistence_risk(risk_df)
        
        # Calculate total risk score
        print("\n  Calculating total risk scores...")
        risk_df = self.calculate_total_risk(risk_df)
        
        # Classify risk levels
        risk_df = self.classify_risk_level(risk_df)
        
        print(f"\n✓ Risk scoring complete!")
        
        return risk_df
    
    def calculate_frequency_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """Frequency risk: Higher volume = higher risk (0-20)"""
        max_count = df['complaint_count'].max()
        
        if max_count > 0:
            df['frequency_risk_score'] = (df['complaint_count'] / max_count) * self.weights['frequency']
        else:
            df['frequency_risk_score'] = 0
        
        print(f"  ✓ Frequency risk (max: {df['frequency_risk_score'].max():.2f}/{self.weights['frequency']})")
        
        return df
    
    def calculate_geographic_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """Geographic risk: Ward concentration (0-15)"""
        # Use ward frequency if available
        if 'avg_ward_frequency' in df.columns:
            max_ward_freq = df['avg_ward_frequency'].max()
            
            if max_ward_freq > 0:
                df['geographic_risk_score'] = (df['avg_ward_frequency'] / max_ward_freq) * self.weights['geographic']
            else:
                df['geographic_risk_score'] = 0
        else:
            df['geographic_risk_score'] = 0
        
        print(f"  ✓ Geographic risk (max: {df['geographic_risk_score'].max():.2f}/{self.weights['geographic']})")
        
        return df
    
    def calculate_category_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """Category risk: Based on category criticality (0-25)"""
        # Category criticality mapping (domain knowledge)
        criticality_map = {
            'Water Crisis': 1.0,
            'CORONA COVID19': 0.96,
            'Health Dept': 0.88,
            'Sanitation': 0.84,
            'Electrical': 0.80,
            'Storm  Water Drain(SWD)': 0.76,
            'Solid Waste (Garbage) Related': 0.72,
            'Road Maintenance(Engg)': 0.68,
            'Road Infrastructure': 0.64,
            'veterinary': 0.60,
            'Revenue Department': 0.52,
            'Traffic Engineer Cell (TEC)': 0.56,
            'Lakes': 0.48,
            'Town Planning': 0.44,
            'Forest': 0.40,
            'Markets': 0.36,
            'Parks and Play grounds': 0.32,
            'Optical Fiber Cables (OFC)': 0.28,
            'Estate': 0.24,
            'Advertisement': 0.20
        }
        
        df['category_criticality'] = df['category'].map(criticality_map).fillna(0.5)
        df['category_risk_score'] = df['category_criticality'] * self.weights['category']
        
        print(f"  ✓ Category risk (max: {df['category_risk_score'].max():.2f}/{self.weights['category']})")
        
        return df
    
    def calculate_recurrence_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """Recurrence risk: Reopen rate (0-15)"""
        if 'reopen_rate' in df.columns:
            # Higher reopen rate = systemic issue
            df['recurrence_risk_score'] = df['reopen_rate'] * self.weights['recurrence']
        else:
            df['recurrence_risk_score'] = 0
        
        print(f"  ✓ Recurrence risk (max: {df['recurrence_risk_score'].max():.2f}/{self.weights['recurrence']})")
        
        return df
    
    def calculate_persistence_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """Persistence risk: Duration & persistence score (0-10)"""
        if 'persistence_score' in df.columns and 'duration_days' in df.columns:
            # Normalize duration (60+ days = high persistence)
            duration_normalized = (df['duration_days'] / 60).clip(0, 1)
            
            # Combine persistence score and duration
            persistence_factor = (df['persistence_score'] * 0.6 + duration_normalized * 0.4)
            
            df['persistence_risk_score'] = persistence_factor * self.weights['persistence']
        else:
            df['persistence_risk_score'] = 0
        
        print(f"  ✓ Persistence risk (max: {df['persistence_risk_score'].max():.2f}/{self.weights['persistence']})")
        
        return df
    
    def calculate_total_risk(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate total risk score (0-100)"""
        risk_columns = [
            'frequency_risk_score',
            'temporal_risk_score',
            'geographic_risk_score',
            'category_risk_score',
            'recurrence_risk_score',
            'persistence_risk_score'
        ]
        
        # Sum all risk scores
        df['total_risk_score'] = df[risk_columns].sum(axis=1)
        
        # Ensure 0-100 range
        df['total_risk_score'] = df['total_risk_score'].clip(0, 100)
        
        print(f"  ✓ Total risk scores:")
        print(f"    Mean: {df['total_risk_score'].mean():.2f}/100")
        print(f"    Median: {df['total_risk_score'].median():.2f}/100")
        print(f"    Max: {df['total_risk_score'].max():.2f}/100")
        
        return df
    
    def classify_risk_level(self, df: pd.DataFrame) -> pd.DataFrame:
        """Classify risk into levels"""
        def get_risk_level(score):
            if score >= 67:
                return 'CRITICAL'
            elif score >= 50:
                return 'HIGH'
            elif score >= 34:
                return 'MEDIUM'
            else:
                return 'LOW'
        
        df['risk_level'] = df['total_risk_score'].apply(get_risk_level)
        
        # Print distribution
        print(f"\n  Risk Level Distribution:")
        risk_counts = df['risk_level'].value_counts()
        for level in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
            count = risk_counts.get(level, 0)
            pct = (count / len(df)) * 100 if len(df) > 0 else 0
            print(f"    - {level}: {count:,} ({pct:.1f}%)")
        
        return df
    
    def get_risk_breakdown(self, df: pd.DataFrame) -> pd.DataFrame:
        """Get detailed risk factor breakdown"""
        risk_breakdown = df[[
            'cluster_id',
            'category',
            'ward_name',
            'complaint_count',
            'frequency_risk_score',
            'temporal_risk_score',
            'geographic_risk_score',
            'category_risk_score',
            'recurrence_risk_score',
            'persistence_risk_score',
            'total_risk_score',
            'risk_level'
        ]].copy()
        
        return risk_breakdown


def main():
    """Run risk scoring"""
    print("="*80)
    print("Civic Sathi RISK SCORING - PHASE 3")
    print("="*80)
    
    # Load temporal analysis results
    data_dir = Path(__file__).parent.parent / "data"
    
    print("\n  Loading temporal analysis results...")
    cluster_df = pd.read_csv(
        data_dir / "processed" / "cluster_temporal_analysis_sample.csv",
        parse_dates=['first_complaint_date', 'last_complaint_date']
    )
    
    print(f"  ✓ Loaded {len(cluster_df):,} clusters")
    
    # Calculate risk scores
    scorer = RiskScorer()
    risk_df = scorer.calculate_all_risk_scores(cluster_df)
    
    # Get risk breakdown
    risk_breakdown = scorer.get_risk_breakdown(risk_df)
    
    # Save
    output_path = data_dir / "processed" / "cluster_risk_scores_sample.csv"
    risk_df.to_csv(output_path, index=False)
    
    print(f"\n✓ Saved risk scores: {output_path.name}")
    
    # Top 10 highest risk issues
    print("\n" + "="*80)
    print("TOP 10 HIGHEST RISK SYSTEMIC ISSUES")
    print("="*80)
    
    top_risk = risk_df.nlargest(10, 'total_risk_score')
    
    for idx, (_, issue) in enumerate(top_risk.iterrows(), 1):
        print(f"\n{idx}. Cluster {issue['cluster_id']} - {issue['risk_level']} RISK")
        print(f"   Category: {issue['category']}")
        print(f"   Subcategory: {issue['subcategory']}")
        print(f"   Ward: {issue['ward_name']}")
        print(f"   Total Risk Score: {issue['total_risk_score']:.1f}/100")
        print(f"   Breakdown:")
        print(f"     • Frequency: {issue['frequency_risk_score']:.1f}/20")
        print(f"     • Temporal: {issue['temporal_risk_score']:.1f}/15")
        print(f"     • Geographic: {issue['geographic_risk_score']:.1f}/15")
        print(f"     • Category: {issue['category_risk_score']:.1f}/25")
        print(f"     • Recurrence: {issue['recurrence_risk_score']:.1f}/15")
        print(f"     • Persistence: {issue['persistence_risk_score']:.1f}/10")
        print(f"   Complaints: {issue['complaint_count']}")
        print(f"   Duration: {issue['duration_days']} days")
        if issue.get('temporal_pattern'):
            print(f"   Pattern: {issue['temporal_pattern']}")
    
    print("\n" + "="*80)
    
    return risk_df


if __name__ == "__main__":
    main()
