"""
Civic Sathi Temporal Analysis Module
Phase 3: Spike Detection & Trend Analysis

Detects temporal patterns, spikes, and persistence in complaint clusters.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta


class TemporalAnalyzer:
    """Analyze temporal patterns in complaint clusters"""
    
    def __init__(self):
        pass
    
    def analyze_all_clusters(self, df: pd.DataFrame, cluster_summary: pd.DataFrame) -> pd.DataFrame:
        """Analyze temporal patterns for all clusters"""
        print("\n" + "="*80)
        print("TEMPORAL ANALYSIS")
        print("="*80)
        
        temporal_features = []
        
        print(f"\n  Analyzing {len(cluster_summary)} clusters...")
        
        for _, cluster in cluster_summary.iterrows():
            cluster_id = cluster['cluster_id']
            cluster_df = df[df['cluster_id'] == cluster_id]
            
            if len(cluster_df) == 0:
                continue
            
            # Analyze this cluster
            features = self.analyze_cluster_temporal(cluster_df, cluster)
            features['cluster_id'] = cluster_id
            
            temporal_features.append(features)
        
        temporal_df = pd.DataFrame(temporal_features)
        
        print(f"\n✓ Temporal analysis complete for {len(temporal_df):,} clusters")
        
        return temporal_df
    
    def analyze_cluster_temporal(self, cluster_df: pd.DataFrame, cluster_info: dict) -> dict:
        """Analyze temporal patterns for a single cluster"""
        features = {}
        
        # Sort by date
        cluster_df = cluster_df.sort_values('grievance_date')
        
        # 1. Duration
        first_date = cluster_df['grievance_date'].min()
        last_date = cluster_df['grievance_date'].max()
        duration_days = (last_date - first_date).days + 1
        
        features['first_complaint_date'] = first_date
        features['last_complaint_date'] = last_date
        features['duration_days'] = duration_days
        
        # 2. Frequency metrics
        features['total_complaints'] = len(cluster_df)
        features['avg_complaints_per_day'] = len(cluster_df) / max(duration_days, 1)
        
        # 3. Temporal distribution
        # Check if complaints are evenly distributed or concentrated
        daily_counts = cluster_df.groupby(cluster_df['grievance_date'].dt.date).size()
        
        features['active_days'] = len(daily_counts)
        features['max_complaints_single_day'] = daily_counts.max() if len(daily_counts) > 0 else 0
        features['avg_complaints_per_active_day'] = daily_counts.mean() if len(daily_counts) > 0 else 0
        
        # 4. Persistence score (0-1, higher = more persistent)
        # Complaints spread over time vs. concentrated
        if duration_days > 0:
            persistence = features['active_days'] / duration_days
        else:
            persistence = 0
        
        features['persistence_score'] = persistence
        
        # 5. Recent activity
        # Complaints in last 7 days, 30 days
        now = cluster_df['grievance_date'].max()  # Use latest date in dataset
        
        last_7_days = (cluster_df['grievance_date'] >= now - timedelta(days=7)).sum()
        last_30_days = (cluster_df['grievance_date'] >= now - timedelta(days=30)).sum()
        
        features['complaints_last_7_days'] = last_7_days
        features['complaints_last_30_days'] = last_30_days
        
        # 6. Spike detection
        # Compare recent volume to historical average
        if duration_days > 30:
            historical_avg = (len(cluster_df) - last_30_days) / max(duration_days - 30, 1)
            recent_avg = last_30_days / 30
            
            if historical_avg > 0:
                spike_ratio = recent_avg / historical_avg
            else:
                spike_ratio = 1.0
        else:
            spike_ratio = 1.0
        
        features['spike_ratio'] = spike_ratio
        features['has_recent_spike'] = spike_ratio > 1.5  # 50% increase
        
        # 7. Growth trend
        # Simple: compare first half vs. second half
        if len(cluster_df) >= 10:
            mid_point = len(cluster_df) // 2
            first_half = cluster_df.iloc[:mid_point]
            second_half = cluster_df.iloc[mid_point:]
            
            first_half_days = (first_half['grievance_date'].max() - first_half['grievance_date'].min()).days + 1
            second_half_days = (second_half['grievance_date'].max() - second_half['grievance_date'].min()).days + 1
            
            first_rate = len(first_half) / max(first_half_days, 1)
            second_rate = len(second_half) / max(second_half_days, 1)
            
            if first_rate > 0:
                growth_rate = ((second_rate - first_rate) / first_rate) * 100
            else:
                growth_rate = 0
            
            features['growth_rate_pct'] = growth_rate
            features['is_growing'] = growth_rate > 10  # 10% growth
        else:
            features['growth_rate_pct'] = 0
            features['is_growing'] = False
        
        # 8. Recurrence pattern
        # Complaints keep appearing after being marked closed
        if 'is_reopened' in cluster_df.columns:
            features['reopen_count'] = cluster_df['is_reopened'].sum()
            features['reopen_rate'] = cluster_df['is_reopened'].mean()
        else:
            features['reopen_count'] = 0
            features['reopen_rate'] = 0
        
        return features
    
    def classify_temporal_pattern(self, temporal_df: pd.DataFrame) -> pd.DataFrame:
        """Classify clusters by temporal pattern"""
        print("\n  Classifying temporal patterns...")
        
        temporal_df['temporal_pattern'] = 'stable'
        
        # Spike pattern
        temporal_df.loc[temporal_df['has_recent_spike'], 'temporal_pattern'] = 'spike'
        
        # Growing pattern
        temporal_df.loc[temporal_df['is_growing'] & ~temporal_df['has_recent_spike'], 'temporal_pattern'] = 'growing'
        
        # Persistent pattern
        temporal_df.loc[
            (temporal_df['persistence_score'] > 0.5) & 
            (temporal_df['duration_days'] > 60),
            'temporal_pattern'
        ] = 'persistent'
        
        # Recurrent pattern (reopens)
        temporal_df.loc[temporal_df['reopen_rate'] > 0.1, 'temporal_pattern'] = 'recurrent'
        
        # Print distribution
        pattern_counts = temporal_df['temporal_pattern'].value_counts()
        print(f"\n  Temporal Pattern Distribution:")
        for pattern, count in pattern_counts.items():
            print(f"    - {pattern}: {count:,}")
        
        return temporal_df
    
    def calculate_temporal_risk_score(self, temporal_df: pd.DataFrame) -> pd.DataFrame:
        """Calculate temporal risk score (0-15 points)"""
        print("\n  Calculating temporal risk scores...")
        
        temporal_df['temporal_risk_score'] = 0.0
        
        # Recent activity (0-5 points)
        # More complaints in last 30 days = higher risk
        max_recent = temporal_df['complaints_last_30_days'].max()
        if max_recent > 0:
            temporal_df['temporal_risk_score'] += (temporal_df['complaints_last_30_days'] / max_recent) * 5
        
        # Spike (0-5 points)
        temporal_df.loc[temporal_df['spike_ratio'] > 2.0, 'temporal_risk_score'] += 5
        temporal_df.loc[
            (temporal_df['spike_ratio'] > 1.5) & (temporal_df['spike_ratio'] <= 2.0),
            'temporal_risk_score'
        ] += 3
        
        # Persistence (0-3 points)
        temporal_df['temporal_risk_score'] += temporal_df['persistence_score'] * 3
        
        # Growth (0-2 points)
        temporal_df.loc[temporal_df['is_growing'], 'temporal_risk_score'] += 2
        
        # Normalize to 0-15
        temporal_df['temporal_risk_score'] = temporal_df['temporal_risk_score'].clip(0, 15)
        
        print(f"  ✓ Temporal risk scores calculated (0-15 scale)")
        print(f"    Mean: {temporal_df['temporal_risk_score'].mean():.2f}")
        print(f"    Max: {temporal_df['temporal_risk_score'].max():.2f}")
        
        return temporal_df


def main():
    """Run temporal analysis"""
    print("="*80)
    print("Civic Sathi TEMPORAL ANALYSIS - PHASE 3")
    print("="*80)
    
    # Load clustered data
    data_dir = Path(__file__).parent.parent / "data"
    
    print("\n  Loading clustered data...")
    df = pd.read_csv(
        data_dir / "processed" / "civicsathi_clustered_sample.csv",
        parse_dates=['grievance_date']
    )
    
    cluster_summary = pd.read_csv(
        data_dir / "processed" / "cluster_summary_sample.csv",
        parse_dates=['first_complaint_date', 'last_complaint_date']
    )
    
    print(f"  ✓ Loaded {len(df):,} complaints in {len(cluster_summary):,} clusters")
    
    # Analyze
    analyzer = TemporalAnalyzer()
    temporal_df = analyzer.analyze_all_clusters(df, cluster_summary)
    
    # Classify patterns
    temporal_df = analyzer.classify_temporal_pattern(temporal_df)
    
    # Calculate risk scores
    temporal_df = analyzer.calculate_temporal_risk_score(temporal_df)
    
    # Merge with cluster summary
    cluster_summary_full = cluster_summary.merge(
        temporal_df,
        on='cluster_id',
        how='left',
        suffixes=('', '_temporal')
    )
    
    # Save
    output_path = data_dir / "processed" / "cluster_temporal_analysis_sample.csv"
    cluster_summary_full.to_csv(output_path, index=False)
    
    print(f"\n✓ Saved temporal analysis: {output_path.name}")
    
    # Top risky clusters by temporal score
    print("\n" + "="*80)
    print("TOP 10 CLUSTERS BY TEMPORAL RISK")
    print("="*80)
    
    top_temporal = cluster_summary_full.nlargest(10, 'temporal_risk_score')
    
    for _, cluster in top_temporal.iterrows():
        print(f"\nCluster {cluster['cluster_id']}:")
        print(f"  Category: {cluster['category']}")
        print(f"  Ward: {cluster['ward_name']}")
        print(f"  Complaints: {cluster['complaint_count']}")
        print(f"  Pattern: {cluster['temporal_pattern']}")
        print(f"  Temporal Risk: {cluster['temporal_risk_score']:.1f}/15")
        if cluster['has_recent_spike']:
            print(f"  ⚠ Recent spike detected (ratio: {cluster['spike_ratio']:.2f}x)")
        if cluster['is_growing']:
            print(f"  ⚠ Growing trend ({cluster['growth_rate_pct']:.1f}% growth)")
    
    print("="*80)
    
    return cluster_summary_full


if __name__ == "__main__":
    main()
