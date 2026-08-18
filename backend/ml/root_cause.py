"""
Civic Sathi Root Cause Analysis Module
Phase 3: Evidence-Based Root Cause Signals

Generates possible root cause signals based on evidence from patterns.
"""

import pandas as pd
from pathlib import Path


class RootCauseAnalyzer:
    """Generate root cause signals for systemic issues"""
    
    def __init__(self):
        # Category-specific root cause templates
        self.root_cause_templates = self._initialize_templates()
    
    def _initialize_templates(self) -> dict:
        """Initialize root cause templates by category"""
        return {
            'Electrical': [
                {
                    'cause': 'Infrastructure Aging',
                    'indicators': ['persistent', 'high_frequency', 'recurring'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Insufficient Maintenance',
                    'indicators': ['high_reopen_rate', 'growing'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Capacity Shortage',
                    'indicators': ['geographic_concentration', 'spike'],
                    'confidence': 'medium'
                }
            ],
            'Solid Waste (Garbage) Related': [
                {
                    'cause': 'Collection Route Inefficiency',
                    'indicators': ['geographic_concentration', 'recurring'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Vehicle/Resource Shortage',
                    'indicators': ['high_frequency', 'persistent'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Population Density Mismatch',
                    'indicators': ['geographic_concentration', 'growing'],
                    'confidence': 'low'
                }
            ],
            'Road Maintenance(Engg)': [
                {
                    'cause': 'Poor Road Quality',
                    'indicators': ['high_reopen_rate', 'persistent'],
                    'confidence': 'high'
                },
                {
                    'cause': 'Incomplete Repairs',
                    'indicators': ['recurring', 'high_reopen_rate'],
                    'confidence': 'high'
                },
                {
                    'cause': 'Heavy Traffic Damage',
                    'indicators': ['geographic_concentration', 'growing'],
                    'confidence': 'medium'
                }
            ],
            'Water Crisis': [
                {
                    'cause': 'Supply Infrastructure Failure',
                    'indicators': ['spike', 'geographic_concentration'],
                    'confidence': 'high'
                },
                {
                    'cause': 'Seasonal Water Shortage',
                    'indicators': ['spike', 'temporal_pattern'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Pipeline Leakage',
                    'indicators': ['persistent', 'geographic_concentration'],
                    'confidence': 'medium'
                }
            ],
            'Health Dept': [
                {
                    'cause': 'Service Capacity Issue',
                    'indicators': ['high_frequency', 'growing'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Resource Shortage',
                    'indicators': ['persistent', 'geographic_concentration'],
                    'confidence': 'medium'
                }
            ],
            'Sanitation': [
                {
                    'cause': 'Infrastructure Gap',
                    'indicators': ['persistent', 'geographic_concentration'],
                    'confidence': 'medium'
                },
                {
                    'cause': 'Maintenance Failure',
                    'indicators': ['recurring', 'high_reopen_rate'],
                    'confidence': 'high'
                }
            ],
            'Storm  Water Drain(SWD)': [
                {
                    'cause': 'Drainage System Blockage',
                    'indicators': ['recurring', 'geographic_concentration'],
                    'confidence': 'high'
                },
                {
                    'cause': 'Design Inadequacy',
                    'indicators': ['persistent', 'growing'],
                    'confidence': 'medium'
                }
            ],
            'Road Infrastructure': [
                {
                    'cause': 'Structural Deficiency',
                    'indicators': ['persistent', 'high_reopen_rate'],
                    'confidence': 'high'
                },
                {
                    'cause': 'Construction Quality Issues',
                    'indicators': ['recurring', 'growing'],
                    'confidence': 'medium'
                }
            ]
        }
    
    def analyze_root_causes(self, issues_df: pd.DataFrame) -> pd.DataFrame:
        """Analyze root causes for all issues"""
        print("\n" + "="*80)
        print("ROOT CAUSE ANALYSIS")
        print("="*80)
        
        print(f"\n  Analyzing {len(issues_df):,} systemic issues...")
        
        root_causes = []
        
        for _, issue in issues_df.iterrows():
            causes = self.identify_root_causes(issue)
            
            for cause in causes:
                root_causes.append({
                    'issue_id': issue['issue_id'],
                    'cluster_id': issue['cluster_id'],
                    'category': issue['category'],
                    'ward_name': issue['ward_name'],
                    'possible_cause': cause['cause'],
                    'confidence': cause['confidence'],
                    'evidence': ', '.join(cause['evidence']),
                    'evidence_count': len(cause['evidence'])
                })
        
        root_causes_df = pd.DataFrame(root_causes)
        
        print(f"\n  ✓ Identified {len(root_causes_df):,} possible root causes")
        
        # Confidence distribution
        if len(root_causes_df) > 0:
            print(f"\n  Confidence Distribution:")
            conf_counts = root_causes_df['confidence'].value_counts()
            for conf, count in conf_counts.items():
                print(f"    - {conf}: {count:,}")
        
        return root_causes_df
    
    def identify_root_causes(self, issue: dict) -> list:
        """Identify possible root causes for a single issue"""
        category = issue['category']
        
        # Get templates for this category
        templates = self.root_cause_templates.get(category, [])
        
        if not templates:
            # Generic template for categories without specific templates
            templates = [
                {
                    'cause': 'Service Delivery Issue',
                    'indicators': ['persistent', 'high_frequency'],
                    'confidence': 'low'
                }
            ]
        
        # Extract indicators from issue
        issue_indicators = self._extract_indicators(issue)
        
        # Match templates
        matched_causes = []
        
        for template in templates:
            # Count matching indicators
            matching_indicators = [
                ind for ind in template['indicators']
                if ind in issue_indicators
            ]
            
            if len(matching_indicators) > 0:
                # Calculate confidence
                match_ratio = len(matching_indicators) / len(template['indicators'])
                
                # Adjust confidence
                conf = template['confidence']
                if match_ratio >= 0.7:
                    if conf == 'low':
                        conf = 'medium'
                    elif conf == 'medium':
                        conf = 'high'
                
                matched_causes.append({
                    'cause': template['cause'],
                    'confidence': conf,
                    'evidence': matching_indicators
                })
        
        # If no matches, provide generic cause
        if not matched_causes:
            matched_causes.append({
                'cause': 'Recurring Service Issue (requires investigation)',
                'confidence': 'low',
                'evidence': list(issue_indicators)[:3]  # Top 3 indicators
            })
        
        return matched_causes
    
    def _extract_indicators(self, issue: dict) -> set:
        """Extract indicators from issue characteristics"""
        indicators = set()
        
        # Temporal patterns
        if issue.get('temporal_pattern') == 'persistent':
            indicators.add('persistent')
        if issue.get('temporal_pattern') == 'spike':
            indicators.add('spike')
        if issue.get('temporal_pattern') == 'growing':
            indicators.add('growing')
        if issue.get('temporal_pattern') == 'recurrent':
            indicators.add('recurring')
        
        # Frequency
        if issue.get('frequency_risk_score', 0) > 12:  # >60% of max
            indicators.add('high_frequency')
        
        # Geographic
        if issue.get('geographic_risk_score', 0) > 9:  # >60% of max
            indicators.add('geographic_concentration')
        
        # Recurrence
        if issue.get('reopen_rate', 0) > 0.15:  # >15% reopen rate
            indicators.add('high_reopen_rate')
        if issue.get('reopen_rate', 0) > 0.05:
            indicators.add('recurring')
        
        # Risk level
        if issue.get('risk_level') == 'CRITICAL':
            indicators.add('critical')
        
        return indicators


def main():
    """Analyze root causes"""
    print("="*80)
    print("Civic Sathi ROOT CAUSE ANALYSIS - PHASE 3")
    print("="*80)
    
    # Load systemic issues
    data_dir = Path(__file__).parent.parent / "data"
    
    print("\n  Loading systemic issues...")
    issues_df = pd.read_csv(
        data_dir / "processed" / "systemic_issues_sample.csv",
        parse_dates=['first_complaint_date', 'last_complaint_date']
    )
    
    print(f"  ✓ Loaded {len(issues_df):,} systemic issues")
    
    # Analyze root causes
    analyzer = RootCauseAnalyzer()
    root_causes_df = analyzer.analyze_root_causes(issues_df)
    
    # Save
    output_path = data_dir / "processed" / "root_causes_sample.csv"
    root_causes_df.to_csv(output_path, index=False)
    
    print(f"\n✓ Saved root causes: {output_path.name}")
    
    # Sample root causes
    print("\n" + "="*80)
    print("SAMPLE ROOT CAUSE ANALYSIS")
    print("="*80)
    
    # Group by issue
    for issue_id in root_causes_df['issue_id'].unique()[:5]:  # Top 5 issues
        issue_causes = root_causes_df[root_causes_df['issue_id'] == issue_id]
        
        if len(issue_causes) == 0:
            continue
        
        first_row = issue_causes.iloc[0]
        
        print(f"\n{issue_id}:")
        print(f"  Category: {first_row['category']}")
        print(f"  Ward: {first_row['ward_name']}")
        print(f"\n  Possible Root Causes:")
        
        for _, cause in issue_causes.iterrows():
            print(f"    • {cause['possible_cause']}")
            print(f"      Confidence: {cause['confidence'].upper()}")
            print(f"      Evidence: {cause['evidence']}")
    
    print("\n" + "="*80)
    
    return root_causes_df


if __name__ == "__main__":
    main()
