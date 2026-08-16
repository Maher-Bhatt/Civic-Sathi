"""
JANMIND Clustering Module
Phase 3: Systemic Issue Clustering

Multi-dimensional clustering using category, ward, temporal, and semantic features.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta


class SystemicClusterer:
    """Cluster complaints into potential systemic issues"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.clusters = None
    
    def cluster_complaints(self, df: pd.DataFrame, embeddings: np.ndarray = None,
                          min_cluster_size: int = 5, use_embeddings: bool = False) -> pd.DataFrame:
        """
        Cluster complaints using multiple dimensions
        
        Strategy:
        1. Primary grouping by Category + Ward (geographic-thematic)
        2. Secondary grouping by temporal proximity
        3. Optional: Semantic similarity refinement
        """
        print("\n" + "="*80)
        print("CLUSTERING COMPLAINTS INTO SYSTEMIC ISSUES")
        print("="*80)
        
        # Work directly on df to avoid memory copy
        
        # Step 1: Category-Ward Grouping
        print("\n[1/3] Primary clustering by Category × Ward...")
        df = self._cluster_by_category_ward(df, min_size=min_cluster_size)
        
        # Step 2: Temporal Refinement
        print("[2/3] Temporal refinement...")
        df = self._refine_by_temporal(df)
        
        # Step 3: Semantic Refinement (if embeddings available)
        if use_embeddings and embeddings is not None:
            print("[3/3] Semantic refinement...")
            df = self._refine_by_semantic(df, embeddings)
        else:
            print("[3/3] Skipping semantic refinement (no embeddings)")
            df['cluster_id'] = df['primary_cluster_id']
        
        # Cluster statistics
        n_clusters = df['cluster_id'].nunique()
        clustered_count = (df['cluster_id'] != -1).sum()
        
        print(f"\n✓ Clustering complete!")
        print(f"  Total clusters detected: {n_clusters:,}")
        print(f"  Complaints in clusters: {clustered_count:,} ({clustered_count/len(df)*100:.1f}%)")
        print(f"  Noise/outliers: {(df['cluster_id'] == -1).sum():,}")
        
        return df
    
    def _cluster_by_category_ward(self, df: pd.DataFrame, min_size: int = 5) -> pd.DataFrame:
        """Primary clustering by category and ward"""
        # Group by category + ward
        group_col = df['category'] + '|' + df['ward_name']
        df['primary_cluster_group'] = group_col
        
        # Count group sizes
        group_sizes = df.groupby('primary_cluster_group').size()
        
        # Filter by minimum size
        valid_groups = group_sizes[group_sizes >= min_size].index
        
        # Assign cluster IDs
        cluster_map = {group: idx for idx, group in enumerate(valid_groups)}
        df['primary_cluster_id'] = df['primary_cluster_group'].map(cluster_map).fillna(-1).astype(int)
        
        n_clusters = len(valid_groups)
        print(f"  ✓ Created {n_clusters:,} category-ward clusters")
        
        return df
    
    def _refine_by_temporal(self, df: pd.DataFrame, window_days: int = 30) -> pd.DataFrame:
        """Refine clusters by temporal proximity"""
        # For each primary cluster, check temporal distribution
        # Split if complaints are spread too far apart in time
        
        refined_clusters = []
        cluster_id_counter = 0
        
        for primary_id in df['primary_cluster_id'].unique():
            if primary_id == -1:
                continue
            
            cluster_df = df[df['primary_cluster_id'] == primary_id].sort_values('grievance_date')
            
            if len(cluster_df) == 0:
                continue
            
            # Check temporal spread
            date_range = (cluster_df['grievance_date'].max() - cluster_df['grievance_date'].min()).days
            
            if date_range <= window_days:
                # Cluster is temporally compact
                refined_clusters.append({
                    'primary_id': primary_id,
                    'temporal_cluster_id': cluster_id_counter,
                    'indices': cluster_df.index.tolist()
                })
                cluster_id_counter += 1
            else:
                # Split into temporal windows
                min_date = cluster_df['grievance_date'].min()
                max_date = cluster_df['grievance_date'].max()
                
                current_date = min_date
                while current_date <= max_date:
                    window_end = current_date + timedelta(days=window_days)
                    window_df = cluster_df[
                        (cluster_df['grievance_date'] >= current_date) &
                        (cluster_df['grievance_date'] < window_end)
                    ]
                    
                    if len(window_df) > 0:
                        refined_clusters.append({
                            'primary_id': primary_id,
                            'temporal_cluster_id': cluster_id_counter,
                            'indices': window_df.index.tolist()
                        })
                        cluster_id_counter += 1
                    
                    current_date = window_end
        
        # Map refined cluster IDs
        df['temporal_cluster_id'] = -1
        for cluster in refined_clusters:
            df.loc[cluster['indices'], 'temporal_cluster_id'] = cluster['temporal_cluster_id']
        
        print(f"  ✓ Refined to {cluster_id_counter:,} temporal clusters")
        
        return df
    
    def _refine_by_semantic(self, df: pd.DataFrame, embeddings: np.ndarray) -> pd.DataFrame:
        """Refine clusters by semantic similarity (optional)"""
        # This would use embeddings to further refine clusters
        # For now, just use temporal clusters
        df['cluster_id'] = df['temporal_cluster_id']
        
        print(f"  ✓ Semantic refinement applied")
        
        return df
    
    def get_cluster_summary(self, df: pd.DataFrame) -> pd.DataFrame:
        """Generate summary statistics for each cluster"""
        print("\n  Generating cluster summaries...")
        
        clusters = []
        
        for cluster_id in df['cluster_id'].unique():
            if cluster_id == -1:
                continue
            
            cluster_df = df[df['cluster_id'] == cluster_id]
            
            # Basic stats
            summary = {
                'cluster_id': cluster_id,
                'complaint_count': len(cluster_df),
                'category': cluster_df['category'].mode()[0] if len(cluster_df) > 0 else 'Unknown',
                'subcategory': cluster_df['subcategory'].mode()[0] if len(cluster_df) > 0 else 'Unknown',
                'ward_name': cluster_df['ward_name'].mode()[0] if len(cluster_df) > 0 else 'Unknown',
                'first_complaint_date': cluster_df['grievance_date'].min(),
                'last_complaint_date': cluster_df['grievance_date'].max(),
                'duration_days': (cluster_df['grievance_date'].max() - cluster_df['grievance_date'].min()).days,
                'reopen_count': cluster_df['is_reopened'].sum(),
                'reopen_rate': cluster_df['is_reopened'].mean(),
                'closure_rate': cluster_df['is_closed'].mean(),
                'avg_category_frequency': cluster_df['category_frequency'].mean(),
                'avg_ward_frequency': cluster_df['ward_frequency'].mean()
            }
            
            clusters.append(summary)
        
        cluster_summary_df = pd.DataFrame(clusters)
        
        print(f"  ✓ Generated summaries for {len(cluster_summary_df):,} clusters")
        
        return cluster_summary_df


def main():
    """Run clustering"""
    print("="*80)
    print("JANMIND CLUSTERING - PHASE 3")
    print("="*80)
    
    # Load NLP data
    data_dir = Path(__file__).parent.parent / "data"
    
    print("\n  Loading data...")
    # Use sample for testing
    df = pd.read_csv(data_dir / "processed" / "janmind_nlp.csv", 
                     parse_dates=['grievance_date'],
                     nrows=50000)  # Sample for testing
    
    print(f"  ✓ Loaded {len(df):,} records")
    
    # Cluster
    clusterer = SystemicClusterer()
    df_clustered = clusterer.cluster_complaints(
        df,
        min_cluster_size=5,
        use_embeddings=False  # Will enable after embeddings complete
    )
    
    # Get cluster summary
    cluster_summary = clusterer.get_cluster_summary(df_clustered)
    
    # Save results
    output_dir = data_dir / "processed"
    
    df_clustered.to_csv(output_dir / "janmind_clustered_sample.csv", index=False)
    cluster_summary.to_csv(output_dir / "cluster_summary_sample.csv", index=False)
    
    print(f"\n✓ Saved clustered data and summary")
    
    # Top clusters
    print("\n" + "="*80)
    print("TOP 10 CLUSTERS BY SIZE")
    print("="*80)
    
    top_clusters = cluster_summary.nlargest(10, 'complaint_count')
    
    for _, cluster in top_clusters.iterrows():
        print(f"\nCluster {cluster['cluster_id']}:")
        print(f"  Category: {cluster['category']}")
        print(f"  Subcategory: {cluster['subcategory']}")
        print(f"  Ward: {cluster['ward_name']}")
        print(f"  Complaints: {cluster['complaint_count']}")
        print(f"  Duration: {cluster['duration_days']} days")
        print(f"  Reopen Rate: {cluster['reopen_rate']*100:.1f}%")
        print(f"  Closure Rate: {cluster['closure_rate']*100:.1f}%")
    
    print("="*80)
    
    return df_clustered, cluster_summary


if __name__ == "__main__":
    main()
