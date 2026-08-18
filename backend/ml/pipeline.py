"""
Civic Sathi ML Pipeline
Phase 3: End-to-End Pipeline

Complete pipeline from raw data to systemic issues with recommendations.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import json

# Import all modules
from ml.data_loader import DataLoader
from ml.preprocessing import DataPreprocessor
from ml.feature_engineering import FeatureEngineer
from ml.nlp import NLPPreprocessor
from ml.clustering import SystemicClusterer
from ml.temporal_analysis import TemporalAnalyzer
from ml.risk import RiskScorer
from ml.systemic_issue import SystemicIssueDetector
from ml.root_cause import RootCauseAnalyzer
from ml.recommendations import RecommendationEngine


class Civic SathiPipeline:
    """Complete end-to-end ML pipeline"""
    
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.raw_dir = data_dir / "raw"
        self.processed_dir = data_dir / "processed"
        self.embeddings_dir = data_dir / "embeddings"
        self.reports_dir = data_dir.parent / "reports"
        
        # Initialize all components
        self.data_loader = DataLoader(data_dir)
        self.preprocessor = DataPreprocessor()
        self.feature_engineer = FeatureEngineer()
        self.nlp_preprocessor = NLPPreprocessor()
        self.clusterer = SystemicClusterer()
        self.temporal_analyzer = TemporalAnalyzer()
        self.risk_scorer = RiskScorer()
        self.issue_detector = SystemicIssueDetector()
        self.root_cause_analyzer = RootCauseAnalyzer()
        self.recommendation_engine = RecommendationEngine()
        
        # Pipeline state
        self.df = None
        self.clusters_df = None
        self.temporal_df = None
        self.risk_df = None
        self.issues_df = None
        self.root_causes_df = None
        self.recommendations_df = None
    
    def run_full_pipeline(self, use_sample: bool = True, sample_size: int = 50000):
        """Run the complete Civic Sathi ML pipeline"""
        print("\n" + "="*80)
        print("Civic Sathi COMPLETE ML PIPELINE")
        print("="*80)
        print(f"\nPipeline Started: {datetime.now()}")
        print(f"Mode: {'SAMPLE' if use_sample else 'FULL'} ({sample_size:,} records)" if use_sample else "Mode: FULL")
        print("="*80)
        
        start_time = datetime.now()
        
        # Phase 1: Data Loading & Preprocessing
        print("\n🔄 PHASE 1: DATA LOADING & PREPROCESSING")
        self.df = self.run_phase1_preprocessing(use_sample, sample_size)
        
        # Phase 2: Feature Engineering & NLP
        print("\n🔄 PHASE 2: FEATURE ENGINEERING & NLP")
        self.df = self.run_phase2_features()
        
        # Phase 3: Clustering
        print("\n🔄 PHASE 3: CLUSTERING")
        self.clusters_df = self.run_phase3_clustering()
        
        # Phase 4: Temporal Analysis
        print("\n🔄 PHASE 4: TEMPORAL ANALYSIS")
        self.temporal_df = self.run_phase4_temporal()
        
        # Phase 5: Risk Scoring
        print("\n🔄 PHASE 5: RISK SCORING")
        self.risk_df = self.run_phase5_risk()
        
        # Phase 6: Systemic Issue Detection
        print("\n🔄 PHASE 6: SYSTEMIC ISSUE DETECTION")
        self.issues_df = self.run_phase6_detection()
        
        # Phase 7: Root Cause Analysis
        print("\n🔄 PHASE 7: ROOT CAUSE ANALYSIS")
        self.root_causes_df = self.run_phase7_root_cause()
        
        # Phase 8: Recommendations
        print("\n🔄 PHASE 8: RECOMMENDATIONS")
        self.recommendations_df = self.run_phase8_recommendations()
        
        # Phase 9: Save Results
        print("\n🔄 PHASE 9: SAVING RESULTS")
        self.save_all_results(use_sample)
        
        # Phase 10: Generate Report
        print("\n🔄 PHASE 10: GENERATING REPORT")
        report = self.generate_pipeline_report(start_time)
        
        # Print Summary
        self.print_pipeline_summary(report)
        
        return report
    
    def run_phase1_preprocessing(self, use_sample: bool, sample_size: int) -> pd.DataFrame:
        """Phase 1: Load and preprocess data - Memory optimized"""
        # Check if already preprocessed
        nlp_path = self.processed_dir / "civicsathi_nlp.csv"
        
        if nlp_path.exists() and not use_sample:
            print("  ✓ Using existing preprocessed data")
            
            # Memory-optimized loading with dtype specifications
            dtype_spec = {
                'complaint_id': 'int64',
                'category': 'category',
                'subcategory': 'category',
                'ward_name': 'category',
                'status': 'category',
                'staff_name': 'category',
                'source_file': 'category',
                'source_year': 'int16',
                'category_raw': 'category',
                'subcategory_raw': 'category',
                'status_raw': 'category',
                'status_normalized': 'category',
                'ward_name_raw': 'category',
                'year': 'int16',
                'month': 'int8',
                'week': 'int8',
                'day_of_week': 'int8',
                'day_name': 'category',
                'month_name': 'category',
                'quarter': 'int8',
                'is_closed': 'bool',
                'is_reopened': 'bool',
                'is_registered': 'bool',
                'is_rejected': 'bool',
                'staff_remarks_length': 'int32',
                'has_remarks': 'bool'
            }
            
            # Load in chunks to reduce memory pressure
            print("  Loading in chunks for memory efficiency...")
            chunks = []
            chunk_size = 100000  # 100K rows per chunk
            
            for chunk in pd.read_csv(
                nlp_path, 
                dtype=dtype_spec,
                parse_dates=['grievance_date'],
                chunksize=chunk_size
            ):
                chunks.append(chunk)
                print(f"    Loaded chunk {len(chunks)}: {len(chunk):,} rows")
            
            print("  Concatenating chunks...")
            df = pd.concat(chunks, ignore_index=True)
            print(f"  ✓ Total rows loaded: {len(df):,}")
        else:
            # Load master or merge
            master_path = self.processed_dir / "civicsathi_master.csv"
            
            if not master_path.exists():
                print("  Loading and merging raw CSV files...")
                df = self.data_loader.merge_all_files()
                self.data_loader.save_master_dataset(df)
            else:
                print("  Loading master dataset...")
                df = self.data_loader.load_master_dataset()
            
            # Sample if requested
            if use_sample:
                print(f"  ⚠ Sampling {sample_size:,} records")
                df = df.head(sample_size)
            
            print("  Preprocessing...")
            df = self.preprocessor.clean_all(df)
        
        print(f"  ✓ Phase 1 complete: {len(df):,} records")
        return df
    
    def run_phase2_features(self) -> pd.DataFrame:
        """Phase 2: Feature engineering and NLP"""
        print("  Creating ML features...")
        self.df = self.feature_engineer.engineer_all_features(self.df)
        
        print("  NLP preprocessing...")
        self.df = self.nlp_preprocessor.preprocess_all(self.df)
        
        print(f"  ✓ Phase 2 complete: {len(self.df.columns)} columns")
        return self.df
    
    def run_phase3_clustering(self) -> pd.DataFrame:
        """Phase 3: Cluster into potential systemic issues"""
        print("  Clustering complaints...")
        df_clustered = self.clusterer.cluster_complaints(
            self.df,
            min_cluster_size=5,
            use_embeddings=False  # TODO: Enable after embeddings
        )
        
        # Update main df with cluster assignments
        self.df = df_clustered
        
        cluster_summary = self.clusterer.get_cluster_summary(df_clustered)
        
        print(f"  ✓ Phase 3 complete: {len(cluster_summary):,} clusters")
        return cluster_summary
    
    def run_phase4_temporal(self) -> pd.DataFrame:
        """Phase 4: Temporal pattern analysis"""
        print("  Analyzing temporal patterns...")
        temporal_df = self.temporal_analyzer.analyze_all_clusters(self.df, self.clusters_df)
        
        temporal_df = self.temporal_analyzer.classify_temporal_pattern(temporal_df)
        temporal_df = self.temporal_analyzer.calculate_temporal_risk_score(temporal_df)
        
        # Merge with clusters
        result_df = self.clusters_df.merge(temporal_df, on='cluster_id', how='left')
        
        print(f"  ✓ Phase 4 complete: {len(result_df):,} clusters analyzed")
        return result_df
    
    def run_phase5_risk(self) -> pd.DataFrame:
        """Phase 5: Risk scoring"""
        print("  Calculating risk scores...")
        risk_df = self.risk_scorer.calculate_all_risk_scores(self.temporal_df)
        
        print(f"  ✓ Phase 5 complete: Risk scores calculated")
        return risk_df
    
    def run_phase6_detection(self) -> pd.DataFrame:
        """Phase 6: Detect systemic issues"""
        print("  Detecting systemic issues...")
        issues_df = self.issue_detector.detect_systemic_issues(self.risk_df)
        
        print(f"  ✓ Phase 6 complete: {len(issues_df):,} systemic issues detected")
        return issues_df
    
    def run_phase7_root_cause(self) -> pd.DataFrame:
        """Phase 7: Root cause analysis"""
        print("  Analyzing root causes...")
        root_causes_df = self.root_cause_analyzer.analyze_root_causes(self.issues_df)
        
        print(f"  ✓ Phase 7 complete: {len(root_causes_df):,} root causes identified")
        return root_causes_df
    
    def run_phase8_recommendations(self) -> pd.DataFrame:
        """Phase 8: Generate recommendations"""
        print("  Generating recommendations...")
        recommendations_df = self.recommendation_engine.generate_recommendations(self.issues_df)
        
        print(f"  ✓ Phase 8 complete: {len(recommendations_df):,} recommendations generated")
        return recommendations_df
    
    def save_all_results(self, use_sample: bool):
        """Save all pipeline results"""
        suffix = "_sample" if use_sample else "_full"
        
        # Save dataframes
        self.df.to_csv(self.processed_dir / f"pipeline_processed{suffix}.csv", index=False)
        self.clusters_df.to_csv(self.processed_dir / f"pipeline_clusters{suffix}.csv", index=False)
        self.temporal_df.to_csv(self.processed_dir / f"pipeline_temporal{suffix}.csv", index=False)
        self.risk_df.to_csv(self.processed_dir / f"pipeline_risk{suffix}.csv", index=False)
        self.issues_df.to_csv(self.processed_dir / f"pipeline_issues{suffix}.csv", index=False)
        self.root_causes_df.to_csv(self.processed_dir / f"pipeline_root_causes{suffix}.csv", index=False)
        self.recommendations_df.to_csv(self.processed_dir / f"pipeline_recommendations{suffix}.csv", index=False)
        
        print("  ✓ All results saved")
    
    def generate_pipeline_report(self, start_time: datetime) -> dict:
        """Generate comprehensive pipeline report"""
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        report = {
            'pipeline_metadata': {
                'start_time': str(start_time),
                'end_time': str(end_time),
                'duration_seconds': duration,
                'duration_minutes': round(duration / 60, 2)
            },
            'data_metrics': {
                'total_complaints': len(self.df),
                'total_clusters': len(self.clusters_df),
                'systemic_issues_detected': len(self.issues_df),
                'root_causes_identified': len(self.root_causes_df),
                'recommendations_generated': len(self.recommendations_df)
            },
            'issue_breakdown': {
                'by_risk_level': self.issues_df['risk_level'].value_counts().to_dict(),
                'by_type': self.issues_df['issue_type'].value_counts().to_dict() if 'issue_type' in self.issues_df.columns else {},
                'by_category': self.issues_df['category'].value_counts().head(10).to_dict(),
                'by_ward': self.issues_df['ward_name'].value_counts().head(10).to_dict()
            },
            'risk_statistics': {
                'avg_risk_score': float(self.issues_df['total_risk_score'].mean()),
                'max_risk_score': float(self.issues_df['total_risk_score'].max()),
                'critical_issues': int((self.issues_df['risk_level'] == 'CRITICAL').sum()),
                'high_risk_issues': int((self.issues_df['risk_level'] == 'HIGH').sum())
            },
            'top_10_issues': self.issues_df.nlargest(10, 'total_risk_score')[
                ['issue_id', 'issue_title', 'risk_level', 'total_risk_score', 'complaint_count']
            ].to_dict('records')
        }
        
        # Save report
        report_path = self.reports_dir / "pipeline_execution_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"  ✓ Report saved: {report_path.name}")
        
        return report
    
    def print_pipeline_summary(self, report: dict):
        """Print pipeline execution summary"""
        print("\n" + "="*80)
        print("PIPELINE EXECUTION SUMMARY")
        print("="*80)
        
        print(f"\n⏱️  EXECUTION TIME:")
        print(f"  Duration: {report['pipeline_metadata']['duration_minutes']:.2f} minutes")
        
        print(f"\n📊 DATA PROCESSED:")
        print(f"  Total Complaints: {report['data_metrics']['total_complaints']:,}")
        print(f"  Clusters Formed: {report['data_metrics']['total_clusters']:,}")
        print(f"  Systemic Issues: {report['data_metrics']['systemic_issues_detected']:,}")
        print(f"  Root Causes: {report['data_metrics']['root_causes_identified']:,}")
        print(f"  Recommendations: {report['data_metrics']['recommendations_generated']:,}")
        
        print(f"\n🚨 RISK BREAKDOWN:")
        for level, count in report['issue_breakdown']['by_risk_level'].items():
            print(f"  {level}: {count:,}")
        
        print(f"\n📈 RISK STATISTICS:")
        print(f"  Average Risk Score: {report['risk_statistics']['avg_risk_score']:.1f}/100")
        print(f"  Maximum Risk Score: {report['risk_statistics']['max_risk_score']:.1f}/100")
        
        print(f"\n🏷️  TOP AFFECTED CATEGORIES:")
        for cat, count in list(report['issue_breakdown']['by_category'].items())[:5]:
            print(f"  {cat}: {count:,} issues")
        
        print(f"\n🌍 TOP AFFECTED WARDS:")
        for ward, count in list(report['issue_breakdown']['by_ward'].items())[:5]:
            print(f"  {ward}: {count:,} issues")
        
        print("\n" + "="*80)
        print("✅ PIPELINE EXECUTION COMPLETE!")
        print("="*80)


def main():
    """Run the complete pipeline"""
    print("="*80)
    print("Civic Sathi END-TO-END ML PIPELINE")
    print("="*80)
    
    data_dir = Path(__file__).parent.parent / "data"
    
    # Initialize pipeline
    pipeline = Civic SathiPipeline(data_dir)
    
    # Run pipeline (FULL DATASET)
    report = pipeline.run_full_pipeline(
        use_sample=False,
        sample_size=None
    )
    
    return pipeline, report


if __name__ == "__main__":
    pipeline, report = main()
