"""
Run Civic Sathi Full Dataset ML Pipeline - Auto Mode (No Confirmation)
Processes all 766,648 complaints
Estimated time: 2-3 hours
"""

import sys
from pathlib import Path
from datetime import datetime
import traceback

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from ml.pipeline import CivicSathiPipeline


def print_header(text):
    """Print formatted header"""
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80 + "\n")


def main():
    """Run the full pipeline with comprehensive logging"""
    
    print_header("Civic Sathi FULL DATASET ML PIPELINE - AUTO MODE")
    print(f"Start Time: {datetime.now()}")
    print(f"Dataset Size: 766,648 complaints")
    print(f"Estimated Duration: 2-3 hours")
    print()
    
    try:
        # Initialize pipeline
        data_dir = Path(__file__).parent / "data"
        pipeline = CivicSathiPipeline(data_dir)
        
        print("✓ Pipeline initialized")
        print()
        
        print_header("STARTING FULL PIPELINE EXECUTION")
        
        # Run full pipeline
        report = pipeline.run_full_pipeline(
            use_sample=False,
            sample_size=None
        )
        
        # Print success message
        print()
        print_header("✅ PIPELINE EXECUTION COMPLETE!")
        
        print(f"End Time: {datetime.now()}")
        print(f"Duration: {report['pipeline_metadata']['duration_minutes']:.2f} minutes")
        print()
        print(f"Results:")
        print(f"  - Total Complaints Processed: {report['data_metrics']['total_complaints']:,}")
        print(f"  - Clusters Formed: {report['data_metrics']['total_clusters']:,}")
        print(f"  - Systemic Issues Detected: {report['data_metrics']['systemic_issues_detected']:,}")
        print(f"  - Root Causes Identified: {report['data_metrics']['root_causes_identified']:,}")
        print(f"  - Recommendations Generated: {report['data_metrics']['recommendations_generated']:,}")
        print()
        
        # Show top issues
        print("Top 10 Highest Risk Issues:")
        print("-" * 80)
        for i, issue in enumerate(report['top_10_issues'], 1):
            print(f"{i}. {issue['issue_title']}")
            print(f"   Risk: {issue['risk_level']} ({issue['total_risk_score']:.1f}/100)")
            print(f"   Complaints: {issue['complaint_count']:,}")
            print()
        
        print_header("✅ SUCCESS - All results saved to data/processed/")
        
        return pipeline, report
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Pipeline execution interrupted by user.")
        print("Partial results may be available in data/processed/")
        sys.exit(1)
        
    except Exception as e:
        print("\n\n❌ ERROR during pipeline execution:")
        print(f"   {str(e)}")
        print("\nFull traceback:")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
