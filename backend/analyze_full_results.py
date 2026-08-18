"""Quick analysis of full dataset results"""
import pandas as pd

print("="*80)
print("Civic Sathi FULL DATASET ANALYSIS - 766,648 COMPLAINTS")
print("="*80)

# Load issues
issues = pd.read_csv('data/processed/pipeline_issues_full.csv')
causes = pd.read_csv('data/processed/pipeline_root_causes_full.csv')
recs = pd.read_csv('data/processed/pipeline_recommendations_full.csv')

print(f"\nTOTAL SYSTEMIC ISSUES DETECTED: {len(issues)}")
print("\nRisk Breakdown:")
print(issues['risk_level'].value_counts())

print(f"\nROOT CAUSES IDENTIFIED: {len(causes)}")
print(f"RECOMMENDATIONS GENERATED: {len(recs)}")

print("\n" + "="*80)
print("TOP 15 HIGHEST RISK ISSUES")
print("="*80)

top15 = issues.nlargest(15, 'total_risk_score')
for idx, (i, row) in enumerate(top15.iterrows(), 1):
    print(f"\n{idx}. {row['issue_title']}")
    print(f"   Risk Level: {row['risk_level']} ({row['total_risk_score']:.1f}/100)")
    print(f"   Complaints: {int(row['complaint_count']):,}")
    print(f"   Ward: {row['ward_name']}")

print("\n" + "="*80)
print("CATEGORY BREAKDOWN")
print("="*80)
print(issues['category'].value_counts().head(10))

print("\n" + "="*80)
print("TOP 10 AFFECTED WARDS")
print("="*80)
print(issues['ward_name'].value_counts().head(10))

print("\n" + "="*80)
print("SUCCESS! Full dataset analysis complete!")
print("="*80)
