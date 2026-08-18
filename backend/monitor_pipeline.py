"""
Monitor CivicSathi Pipeline Execution
Shows progress of ongoing pipeline run
"""

import time
from pathlib import Path
from datetime import datetime
import json


def format_size(bytes):
    """Format bytes to human readable"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.2f} TB"


def check_file_progress(file_path):
    """Check if file exists and show size"""
    if file_path.exists():
        size = file_path.stat().st_size
        modified = datetime.fromtimestamp(file_path.stat().st_mtime)
        return True, size, modified
    return False, 0, None


def main():
    """Monitor pipeline progress"""
    print("="*80)
    print("CivicSathi PIPELINE MONITOR")
    print("="*80)
    print("\nMonitoring data/processed/ directory for pipeline progress...")
    print("Press Ctrl+C to stop monitoring\n")
    
    data_dir = Path(__file__).parent / "data" / "processed"
    
    # Files to monitor
    files_to_check = [
        "civicsathi_nlp.csv",
        "pipeline_processed_full.csv",
        "pipeline_clusters_full.csv",
        "pipeline_temporal_full.csv",
        "pipeline_risk_full.csv",
        "pipeline_issues_full.csv",
        "pipeline_root_causes_full.csv",
        "pipeline_recommendations_full.csv"
    ]
    
    embeddings_dir = Path(__file__).parent / "data" / "embeddings"
    embedding_files = [
        "embeddings_full.npy",
        "embeddings_metadata.json",
        "id_mapping_full.csv"
    ]
    
    last_status = {}
    
    try:
        while True:
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Pipeline Status:")
            print("-" * 80)
            
            current_status = {}
            
            # Check processed files
            print("\n📁 Processed Data Files:")
            for filename in files_to_check:
                file_path = data_dir / filename
                exists, size, modified = check_file_progress(file_path)
                
                if exists:
                    status = f"✓ {filename}: {format_size(size)}"
                    if modified:
                        status += f" (modified {modified.strftime('%H:%M:%S')})"
                    print(f"  {status}")
                    current_status[filename] = (exists, size)
                else:
                    print(f"  ⏳ {filename}: Waiting...")
                    current_status[filename] = (False, 0)
            
            # Check embeddings
            print("\n🧠 Embeddings:")
            for filename in embedding_files:
                file_path = embeddings_dir / filename
                exists, size, modified = check_file_progress(file_path)
                
                if exists:
                    status = f"✓ {filename}: {format_size(size)}"
                    if modified:
                        status += f" (modified {modified.strftime('%H:%M:%S')})"
                    print(f"  {status}")
                    current_status[filename] = (exists, size)
                else:
                    print(f"  ⏳ {filename}: Waiting...")
                    current_status[filename] = (False, 0)
            
            # Check for completion
            report_path = Path(__file__).parent / "reports" / "pipeline_execution_report.json"
            if report_path.exists():
                print("\n✅ PIPELINE COMPLETE!")
                print(f"   Report generated: {report_path.name}")
                
                # Load and display summary
                with open(report_path) as f:
                    report = json.load(f)
                
                print(f"\n📊 Results Summary:")
                print(f"   Duration: {report['pipeline_metadata']['duration_minutes']:.2f} minutes")
                print(f"   Complaints: {report['data_metrics']['total_complaints']:,}")
                print(f"   Clusters: {report['data_metrics']['total_clusters']:,}")
                print(f"   Systemic Issues: {report['data_metrics']['systemic_issues_detected']:,}")
                print(f"   Root Causes: {report['data_metrics']['root_causes_identified']:,}")
                print(f"   Recommendations: {report['data_metrics']['recommendations_generated']:,}")
                
                print("\nMonitoring complete. Pipeline has finished execution.")
                break
            
            # Check for changes
            if last_status and current_status != last_status:
                print("\n💫 Progress detected - files are being updated")
            
            last_status = current_status.copy()
            
            print("\n⏰ Next check in 30 seconds... (Ctrl+C to stop)")
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\n\nMonitoring stopped by user.")


if __name__ == "__main__":
    main()
