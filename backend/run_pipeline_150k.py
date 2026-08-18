"""
Run Civic Sathi ML Pipeline - 150K Sample Mode
Memory-optimized for systems with limited RAM
Expected: 1,000+ systemic issues in 30-40 minutes
"""

import sys
from pathlib import Path
from datetime import datetime
import traceback

sys.path.insert(0, str(Path(__file__).parent))
from ml.pipeline import Civic SathiPipeline


def print_header(text):
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80 + "\n")


def main():
    print_header("Civic Sathi ML PIPELINE - 150K SAMPLE MODE")
    print(f"Start Time: {datetime.now()}")
    print(f"Sample Size: 150,000 complaints (20% of 766K)")
    print(f"Estimated Duration: 30-40 minutes")
    print(f"Expected Results: 1,000-1,200 systemic issues")
    print()
    
    try:
        data_dir = Path(__file__).parent / "data"
        pipeline = Civic SathiPipeline(data_dir)
        
        print("✓ Pipeline initialized")
        print()
        print_header("STARTING PIPELINE EXECUTION")
        
        # Run with 150K sample
        report = pipeline.run_full_pipeline(
            use_sample=True,
            sample_size=150000
        )
        
        print()
        print_header("✅ PIPELINE COMPLETE!")
        
        print(f"End Time: {datetime.now()}")
        print(f"Duration: {report['pipeline_metadata']['duration_minutes']:.2f} minutes")
        print()
        
        # Results summary
        metrics = report['data_metrics']
        print("📊 RESULTS SUMMARY:")
        print("-" * 80)
        print(f"  Total Complaints Processed: {metrics['total_complaints']:,}")
        print(f"  Clusters Formed: {metrics['total_clusters']:,}")
        print(f"  Clustering Success Rate: {metrics.get('clustering_success_rate', 0):.1f}%")
        print()
        print(f"  🎯 Systemic Issues Detected: {metrics['systemic_issues_detected']:,}")
        print(f"  🔍 Root Causes Identified: {metrics['root_causes_identified']:,}")
        print(f"  💡 Recommendations Generated: {metrics['recommendations_generated']:,}")
        print()
        
        # Risk breakdown
        if 'risk_breakdown' in metrics:
            risk = metrics['risk_breakdown']
            print("  Risk Level Breakdown:")
            print(f"    ├── CRITICAL (67-100): {risk.get('CRITICAL', 0)} issues")
            print(f"    ├── HIGH (50-66): {risk.get('HIGH', 0)} issues")
            print(f"    ├── MEDIUM (34-49): {risk.get('MEDIUM', 0)} issues")
            print(f"    └── LOW (0-33): {risk.get('LOW', 0)} issues")
            print()
        
        # Top 10 issues
        print("🔥 TOP 10 HIGHEST RISK ISSUES:")
        print("=" * 80)
        for i, issue in enumerate(report['top_10_issues'], 1):
            print(f"\n{i}. {issue['issue_title']}")
            print(f"   Risk Level: {issue['risk_level']} ({issue['total_risk_score']:.1f}/100)")
            print(f"   Complaints: {issue['complaint_count']:,}")
            if 'ward' in issue:
                print(f"   Ward: {issue['ward']}")
        
        print()
        print_header("✅ SUCCESS!")
        print("📁 Output Files:")
        print("   - data/processed/pipeline_issues_sample.csv (systemic issues)")
        print("   - data/processed/pipeline_root_causes_sample.csv (root causes)")
        print("   - data/processed/pipeline_recommendations_sample.csv (actions)")
        print("   - reports/SAMPLE_PIPELINE_REPORT_*.json (full report)")
        print()
        print("💡 Next Steps:")
        print("   1. Review top CRITICAL and HIGH risk issues")
        print("   2. Validate findings with domain knowledge")
        print("   3. Use results for dashboard/presentation")
        print("   4. For full dataset: run on system with 8GB+ RAM")
        print()
        
        return pipeline, report
        
    except KeyboardInterrupt:
        print("\n\n[WARNING] Interrupted by user")
        sys.exit(1)
        
    except Exception as e:
        print("\n\n[ERROR]:")
        print(f"   {str(e)}")
        print("\nFull traceback:")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
