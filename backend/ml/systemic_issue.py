"""
Civic Sathi Systemic Issue Detection Module
Phase 3: Final Systemic Issue Identification

Combines all signals to identify and classify systemic issues.
"""

import pandas as pd
import numpy as np
from pathlib import Path


class SystemicIssueDetector:
    """Detect and classify systemic issues from risk-scored clusters"""
    
    def __init__(self, min_risk_score: float = 34.0, min_complaints: int = 5):
        self.min_risk_score = min_risk_score  # Minimum MEDIUM risk
        self.min_complaints = min_complaints
    
    def detect_systemic_issues(self, risk_df: pd.DataFrame) -> pd.DataFrame:
        """Identify systemic issues from risk-scored clusters"""
        print("\n" + "="*80)
        print("SYSTEMIC ISSUE DETECTION")
        print("="*80)
        
        # Filter by criteria
        print(f"\n  Filtering clusters...")
        print(f"    Min risk score: {self.min_risk_score}/100")
        print(f"    Min complaints: {self.min_complaints}")
        
        systemic_issues = risk_df[
            (risk_df['total_risk_score'] >= self.min_risk_score) &
            (risk_df['complaint_count'] >= self.min_complaints)
        ].copy()
        
        print(f"\n  ✓ Detected {len(systemic_issues):,} systemic issues")
        print(f"    ({len(systemic_issues)/len(risk_df)*100:.1f}% of all clusters)")
        
        # Add issue metadata
        systemic_issues = self.add_issue_metadata(systemic_issues)
        
        # Classify by type
        systemic_issues = self.classify_issue_type(systemic_issues)
        
        # Priority ranking
        systemic_issues = self.calculate_priority(systemic_issues)
        
        # Sort by priority
        systemic_issues = systemic_issues.sort_values('priority_rank', ascending=True)
        
        return systemic_issues
    
    def add_issue_metadata(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add metadata for systemic issues"""
        # Generate issue IDs
        df['issue_id'] = 'ISSUE-' + (df.index + 1).astype(str).str.zfill(4)
        
        # Create descriptive titles
        df['issue_title'] = (
            df['category'] + ' - ' +
            df['subcategory'] + ' in ' +
            df['ward_name']
        )
        
        # Affected area
        df['affected_area'] = df['ward_name']
        
        # Timeline - handle missing duration_days column
        if 'duration_days' in df.columns:
            df['days_active'] = df['duration_days']
        else:
            # Calculate from date range if available
            if 'first_complaint_date' in df.columns and 'last_complaint_date' in df.columns:
                df['days_active'] = (pd.to_datetime(df['last_complaint_date']) - pd.to_datetime(df['first_complaint_date'])).dt.days + 1
            else:
                df['days_active'] = 0  # Fallback
        
        return df
    
    def classify_issue_type(self, df: pd.DataFrame) -> pd.DataFrame:
        """Classify systemic issues by pattern type"""
        print("\n  Classifying issue types...")
        
        df['issue_type'] = 'Other'
        
        # Infrastructure failure (persistent + high category risk)
        df.loc[
            (df['persistence_risk_score'] > 5) &
            (df['category_risk_score'] > 15),
            'issue_type'
        ] = 'Infrastructure Failure'
        
        # Service gap (high frequency + geographic concentration)
        df.loc[
            (df['frequency_risk_score'] > 10) &
            (df['geographic_risk_score'] > 8),
            'issue_type'
        ] = 'Service Gap'
        
        # Emerging crisis (temporal spike)
        df.loc[
            df['temporal_risk_score'] > 10,
            'issue_type'
        ] = 'Emerging Crisis'
        
        # Recurring problem (high recurrence)
        df.loc[
            df['recurrence_risk_score'] > 7,
            'issue_type'
        ] = 'Recurring Problem'
        
        # Print distribution
        type_counts = df['issue_type'].value_counts()
        print(f"  Issue Type Distribution:")
        for issue_type, count in type_counts.items():
            print(f"    - {issue_type}: {count:,}")
        
        return df
    
    def calculate_priority(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate priority ranking for issues"""
        print("\n  Calculating priority rankings...")
        
        # Priority score based on:
        # 1. Risk level (40%)
        # 2. Complaint count (30%)
        # 3. Recent activity (20%)
        # 4. Recurrence (10%)
        
        # Normalize factors
        max_risk = df['total_risk_score'].max() or 1
        max_count = df['complaint_count'].max() or 1
        max_recent = df.get('complaints_last_30_days', pd.Series([0])).max() or 1
        max_reopen = df.get('reopen_rate', pd.Series([0])).max() or 1
        
        df['priority_score'] = (
            (df['total_risk_score'] / max_risk) * 40 +
            (df['complaint_count'] / max_count) * 30 +
            (df.get('complaints_last_30_days', 0) / max_recent) * 20 +
            (df.get('reopen_rate', 0) / max_reopen) * 10
        )
        
        # Rank (1 = highest priority)
        df['priority_rank'] = df['priority_score'].rank(ascending=False, method='dense').astype(int)
        
        print(f"  ✓ Priority rankings calculated (1 = highest)")
        
        return df
    
    def generate_issue_summary(self, issues_df: pd.DataFrame) -> dict:
        """Generate summary statistics"""
        summary = {
            'total_issues': len(issues_df),
            'critical_issues': (issues_df['risk_level'] == 'CRITICAL').sum(),
            'high_risk_issues': (issues_df['risk_level'] == 'HIGH').sum(),
            'medium_risk_issues': (issues_df['risk_level'] == 'MEDIUM').sum(),
            'total_complaints_affected': int(issues_df['complaint_count'].sum()),
            'avg_risk_score': float(issues_df['total_risk_score'].mean()),
            'issue_types': issues_df['issue_type'].value_counts().to_dict(),
            'top_categories': issues_df['category'].value_counts().head(5).to_dict(),
            'top_wards': issues_df['ward_name'].value_counts().head(5).to_dict()
        }
        
        return summary


def main():
    """Detect systemic issues"""
    print("="*80)
    print("Civic Sathi SYSTEMIC ISSUE DETECTION - PHASE 3")
    print("="*80)
    
    # Load risk scores
    data_dir = Path(__file__).parent.parent / "data"
    
    print("\n  Loading risk-scored clusters...")
    risk_df = pd.read_csv(
        data_dir / "processed" / "cluster_risk_scores_sample.csv",
        parse_dates=['first_complaint_date', 'last_complaint_date']
    )
    
    print(f"  ✓ Loaded {len(risk_df):,} risk-scored clusters")
    
    # Detect systemic issues
    detector = SystemicIssueDetector(
        min_risk_score=34.0,  # MEDIUM or higher
        min_complaints=5
    )
    
    systemic_issues = detector.detect_systemic_issues(risk_df)
    
    # Generate summary
    summary = detector.generate_issue_summary(systemic_issues)
    
    # Save
    output_path = data_dir / "processed" / "systemic_issues_sample.csv"
    systemic_issues.to_csv(output_path, index=False)
    
    print(f"\n✓ Saved systemic issues: {output_path.name}")
    
    # Save summary
    import json
    summary_path = data_dir / "processed" / "systemic_issues_summary_sample.json"
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    
    print(f"✓ Saved summary: {summary_path.name}")
    
    # Print summary
    print("\n" + "="*80)
    print("SYSTEMIC ISSUES SUMMARY")
    print("="*80)
    print(f"\n📊 OVERVIEW:")
    print(f"  Total Systemic Issues: {summary['total_issues']:,}")
    print(f"  Total Complaints Affected: {summary['total_complaints_affected']:,}")
    print(f"  Average Risk Score: {summary['avg_risk_score']:.1f}/100")
    
    print(f"\n🚨 BY RISK LEVEL:")
    print(f"  CRITICAL: {summary['critical_issues']:,}")
    print(f"  HIGH: {summary['high_risk_issues']:,}")
    print(f"  MEDIUM: {summary['medium_risk_issues']:,}")
    
    print(f"\n🏷️ BY TYPE:")
    for issue_type, count in summary['issue_types'].items():
        print(f"  {issue_type}: {count:,}")
    
    print(f"\n📍 TOP AFFECTED CATEGORIES:")
    for category, count in list(summary['top_categories'].items())[:3]:
        print(f"  {category}: {count:,} issues")
    
    print(f"\n🌍 TOP AFFECTED WARDS:")
    for ward, count in list(summary['top_wards'].items())[:3]:
        print(f"  {ward}: {count:,} issues")
    
    # Top 10 priority issues
    print("\n" + "="*80)
    print("TOP 10 PRIORITY SYSTEMIC ISSUES")
    print("="*80)
    
    top_issues = systemic_issues.head(10)
    
    for idx, (_, issue) in enumerate(top_issues.iterrows(), 1):
        print(f"\n{idx}. {issue['issue_id']} - Priority Rank #{issue['priority_rank']}")
        print(f"   {issue['issue_title']}")
        print(f"   Risk: {issue['risk_level']} ({issue['total_risk_score']:.1f}/100)")
        print(f"   Type: {issue['issue_type']}")
        print(f"   Complaints: {issue['complaint_count']} over {issue['days_active']} days")
        if issue.get('temporal_pattern'):
            print(f"   Pattern: {issue['temporal_pattern']}")
        if issue.get('reopen_rate', 0) > 0:
            print(f"   ⚠ Reopen Rate: {issue['reopen_rate']*100:.1f}%")
    
    print("\n" + "="*80)
    
    return systemic_issues


if __name__ == "__main__":
    main()
