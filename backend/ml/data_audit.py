"""
Civic Sathi Data Audit Module
Phase 1: Dataset Inventory & Quality Audit

This module performs comprehensive auditing of the 6 real grievance CSV files.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import json


class DataAuditor:
    """Comprehensive data quality auditor for Civic Sathi datasets"""
    
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.raw_dir = data_dir / "raw"
        self.reports_dir = data_dir.parent / "reports"
        self.reports_dir.mkdir(exist_ok=True)
        
        # Files to audit
        self.files = [f"grievances_{year}.csv" for year in range(2020, 2026)]
        
    def audit_all(self):
        """Run complete audit on all datasets"""
        print("="*80)
        print("Civic Sathi DATASET AUDIT - PHASE 1")
        print("="*80)
        print(f"\nAudit Started: {datetime.now()}")
        print(f"Data Directory: {self.raw_dir}")
        print(f"Files to Audit: {len(self.files)}")
        print("="*80)
        
        # 1. File Inventory
        print("\n[1/8] FILE INVENTORY")
        file_inventory = self.audit_file_inventory()
        
        # 2. Schema Discovery
        print("\n[2/8] SCHEMA DISCOVERY")
        schema_info = self.audit_schemas()
        
        # 3. Data Quality
        print("\n[3/8] DATA QUALITY AUDIT")
        quality_info = self.audit_data_quality()
        
        # 4. Duplicate Detection
        print("\n[4/8] DUPLICATE DETECTION")
        duplicate_info = self.audit_duplicates()
        
        # 5. Value Distributions
        print("\n[5/8] VALUE DISTRIBUTIONS")
        distribution_info = self.audit_distributions()
        
        # 6. Temporal Analysis
        print("\n[6/8] TEMPORAL ANALYSIS")
        temporal_info = self.audit_temporal_coverage()
        
        # 7. Text Field Analysis
        print("\n[7/8] TEXT FIELD ANALYSIS")
        text_info = self.audit_text_fields()
        
        # 8. Schema Compatibility
        print("\n[8/8] CROSS-FILE COMPATIBILITY")
        compatibility_info = self.audit_compatibility()
        
        # Generate comprehensive report
        report = {
            "audit_timestamp": datetime.now().isoformat(),
            "file_inventory": file_inventory,
            "schemas": schema_info,
            "data_quality": quality_info,
            "duplicates": duplicate_info,
            "distributions": distribution_info,
            "temporal": temporal_info,
            "text_fields": text_info,
            "compatibility": compatibility_info
        }
        
        # Save report
        self.save_report(report)
        
        # Print summary
        self.print_summary(report)
        
        return report
    
    def audit_file_inventory(self):
        """Audit basic file information"""
        inventory = []
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                inventory.append({
                    "filename": filename,
                    "exists": False,
                    "error": "File not found"
                })
                continue
            
            try:
                # Get file size
                size_bytes = filepath.stat().st_size
                size_kb = size_bytes / 1024
                size_mb = size_kb / 1024
                
                # Quick line count
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    line_count = sum(1 for _ in f)
                
                # Load to get row count
                df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
                
                inventory.append({
                    "filename": filename,
                    "exists": True,
                    "size_bytes": size_bytes,
                    "size_kb": round(size_kb, 2),
                    "size_mb": round(size_mb, 2),
                    "total_lines": line_count,
                    "rows": len(df),
                    "columns": len(df.columns)
                })
                
                print(f"  ✓ {filename}: {len(df):,} rows × {len(df.columns)} cols ({size_kb:.1f} KB)")
                
            except Exception as e:
                inventory.append({
                    "filename": filename,
                    "exists": True,
                    "error": str(e)
                })
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return inventory
    
    def audit_schemas(self):
        """Discover and document schemas"""
        schemas = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, nrows=1000, encoding='utf-8', low_memory=False)
                
                schema = {
                    "columns": list(df.columns),
                    "column_count": len(df.columns),
                    "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
                    "sample_row": df.iloc[0].to_dict() if len(df) > 0 else {}
                }
                
                schemas[filename] = schema
                
                print(f"  ✓ {filename}: {len(df.columns)} columns")
                for col in df.columns:
                    print(f"      - {col} ({df[col].dtype})")
                
            except Exception as e:
                schemas[filename] = {"error": str(e)}
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return schemas
    
    def audit_data_quality(self):
        """Audit data quality metrics"""
        quality = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
                
                # Missing values
                missing = df.isnull().sum()
                missing_pct = (missing / len(df) * 100).round(2)
                
                # Empty strings
                empty_strings = {}
                for col in df.select_dtypes(include=['object']).columns:
                    empty_count = (df[col].astype(str).str.strip() == '').sum()
                    if empty_count > 0:
                        empty_strings[col] = int(empty_count)
                
                quality[filename] = {
                    "total_rows": len(df),
                    "missing_values": {
                        col: {"count": int(count), "percentage": float(missing_pct[col])}
                        for col, count in missing.items() if count > 0
                    },
                    "empty_strings": empty_strings,
                    "completely_null_columns": [col for col in df.columns if df[col].isnull().all()]
                }
                
                print(f"  ✓ {filename}:")
                print(f"      Rows: {len(df):,}")
                print(f"      Missing values: {missing.sum():,} ({(missing.sum()/(len(df)*len(df.columns))*100):.2f}% of all cells)")
                
            except Exception as e:
                quality[filename] = {"error": str(e)}
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return quality
    
    def audit_duplicates(self):
        """Detect duplicates"""
        duplicates = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
                
                # Exact duplicates
                exact_dupes = df.duplicated().sum()
                
                # ID duplicates (if ID column exists)
                id_columns = [col for col in df.columns if 'id' in col.lower() or 'no' in col.lower()]
                id_dupes = {}
                
                for id_col in id_columns:
                    if id_col in df.columns:
                        dupe_count = df[id_col].duplicated().sum()
                        if dupe_count > 0:
                            id_dupes[id_col] = int(dupe_count)
                
                duplicates[filename] = {
                    "exact_duplicates": int(exact_dupes),
                    "id_duplicates": id_dupes
                }
                
                print(f"  ✓ {filename}: {exact_dupes:,} exact duplicates")
                
            except Exception as e:
                duplicates[filename] = {"error": str(e)}
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return duplicates
    
    def audit_distributions(self):
        """Analyze value distributions"""
        distributions = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
                
                dist = {}
                
                # Categorical columns
                for col in df.select_dtypes(include=['object']).columns:
                    unique_count = df[col].nunique()
                    
                    # Only analyze if reasonable number of unique values
                    if unique_count < 100:
                        value_counts = df[col].value_counts().head(20)
                        dist[col] = {
                            "unique_count": int(unique_count),
                            "top_values": value_counts.to_dict()
                        }
                
                distributions[filename] = dist
                
                print(f"  ✓ {filename}: Analyzed {len(dist)} categorical columns")
                
            except Exception as e:
                distributions[filename] = {"error": str(e)}
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return distributions
    
    def audit_temporal_coverage(self):
        """Analyze temporal coverage"""
        temporal = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
                
                # Find date columns
                date_columns = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
                
                temp_info = {}
                
                for date_col in date_columns:
                    try:
                        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
                        
                        temp_info[date_col] = {
                            "min_date": str(df[date_col].min()),
                            "max_date": str(df[date_col].max()),
                            "null_count": int(df[date_col].isnull().sum())
                        }
                    except:
                        pass
                
                temporal[filename] = temp_info
                
                print(f"  ✓ {filename}: Found {len(date_columns)} date columns")
                
            except Exception as e:
                temporal[filename] = {"error": str(e)}
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return temporal
    
    def audit_text_fields(self):
        """Analyze text fields for NLP potential"""
        text_fields = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, encoding='utf-8', low_memory=False)
                
                text_info = {}
                
                for col in df.select_dtypes(include=['object']).columns:
                    # Calculate average length
                    avg_length = df[col].astype(str).str.len().mean()
                    max_length = df[col].astype(str).str.len().max()
                    
                    # Check if potentially useful for NLP
                    if avg_length > 10:  # Arbitrary threshold for meaningful text
                        text_info[col] = {
                            "avg_length": round(avg_length, 2),
                            "max_length": int(max_length),
                            "null_count": int(df[col].isnull().sum()),
                            "sample": str(df[col].dropna().iloc[0]) if len(df[col].dropna()) > 0 else None
                        }
                
                text_fields[filename] = text_info
                
                print(f"  ✓ {filename}: Found {len(text_info)} potential text fields")
                
            except Exception as e:
                text_fields[filename] = {"error": str(e)}
                print(f"  ✗ {filename}: ERROR - {e}")
        
        return text_fields
    
    def audit_compatibility(self):
        """Check if all files have compatible schemas for merging"""
        print("\n  Checking schema compatibility across all files...")
        
        all_columns = {}
        
        for filename in self.files:
            filepath = self.raw_dir / filename
            
            if not filepath.exists():
                continue
            
            try:
                df = pd.read_csv(filepath, nrows=10, encoding='utf-8', low_memory=False)
                all_columns[filename] = set(df.columns)
            except:
                pass
        
        if len(all_columns) < 2:
            return {"error": "Not enough files to compare"}
        
        # Find common columns
        common_cols = set.intersection(*all_columns.values())
        all_unique_cols = set.union(*all_columns.values())
        
        compatibility = {
            "total_files": len(all_columns),
            "common_columns": list(common_cols),
            "common_column_count": len(common_cols),
            "all_unique_columns": list(all_unique_cols),
            "all_unique_column_count": len(all_unique_cols),
            "files_compatible": len(common_cols) == len(all_unique_cols),
            "per_file_columns": {k: list(v) for k, v in all_columns.items()}
        }
        
        print(f"  ✓ Common columns: {len(common_cols)}")
        print(f"  ✓ All unique columns: {len(all_unique_cols)}")
        print(f"  ✓ Compatible: {compatibility['files_compatible']}")
        
        return compatibility
    
    def save_report(self, report):
        """Save audit report"""
        report_path = self.reports_dir / "data_audit_report.json"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"\n✓ Report saved: {report_path}")
    
    def print_summary(self, report):
        """Print executive summary"""
        print("\n" + "="*80)
        print("AUDIT SUMMARY")
        print("="*80)
        
        total_rows = sum(
            inv.get('rows', 0) 
            for inv in report['file_inventory'] 
            if inv.get('exists')
        )
        
        total_size_mb = sum(
            inv.get('size_mb', 0) 
            for inv in report['file_inventory'] 
            if inv.get('exists')
        )
        
        print(f"\n✓ Total Records: {total_rows:,}")
        print(f"✓ Total Size: {total_size_mb:.2f} MB")
        print(f"✓ Files Processed: {len([i for i in report['file_inventory'] if i.get('exists')])}/6")
        
        if report['compatibility']['files_compatible']:
            print(f"✓ Schema Compatibility: ALL FILES COMPATIBLE")
        else:
            print(f"⚠ Schema Compatibility: SCHEMAS DIFFER")
        
        print(f"\n✓ Full report: reports/data_audit_report.json")
        print("="*80)


def main():
    """Run the audit"""
    data_dir = Path(__file__).parent.parent / "data"
    auditor = DataAuditor(data_dir)
    report = auditor.audit_all()
    
    return report


if __name__ == "__main__":
    main()
