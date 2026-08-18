"""
Civic Sathi Recommendations Module
Phase 3: Actionable Recommendations

Generates category-specific actionable recommendations for systemic issues.
"""

import pandas as pd
from pathlib import Path


class RecommendationEngine:
    """Generate actionable recommendations for systemic issues"""
    
    def __init__(self):
        self.recommendation_templates = self._initialize_templates()
    
    def _initialize_templates(self) -> dict:
        """Initialize recommendation templates by category and issue type"""
        return {
            'Electrical': {
                'Infrastructure Failure': [
                    {
                        'title': 'Conduct Infrastructure Audit',
                        'description': 'Perform comprehensive audit of electrical infrastructure in affected area',
                        'priority': 'high',
                        'timeline': '2-4 weeks',
                        'resources': 'Technical team, inspection equipment'
                    },
                    {
                        'title': 'Schedule Preventive Maintenance',
                        'description': 'Implement regular maintenance schedule for electrical systems',
                        'priority': 'high',
                        'timeline': 'Ongoing',
                        'resources': 'Maintenance crew, spare parts'
                    },
                    {
                        'title': 'Upgrade Aging Equipment',
                        'description': 'Replace outdated electrical equipment identified in audit',
                        'priority': 'medium',
                        'timeline': '3-6 months',
                        'resources': 'Budget allocation, procurement team'
                    }
                ],
                'Service Gap': [
                    {
                        'title': 'Increase Service Coverage',
                        'description': 'Deploy additional resources to high-complaint areas',
                        'priority': 'high',
                        'timeline': '1-2 weeks',
                        'resources': 'Additional staff, vehicles'
                    },
                    {
                        'title': 'Optimize Response Routes',
                        'description': 'Review and optimize service routes for faster response',
                        'priority': 'medium',
                        'timeline': '2-3 weeks',
                        'resources': 'Planning team, route optimization tools'
                    }
                ],
                'Emerging Crisis': [
                    {
                        'title': 'Emergency Response Team',
                        'description': 'Deploy emergency response team immediately',
                        'priority': 'critical',
                        'timeline': '24-48 hours',
                        'resources': 'Emergency crew, backup equipment'
                    },
                    {
                        'title': 'Public Communication',
                        'description': 'Issue public advisory about the situation and expected resolution',
                        'priority': 'high',
                        'timeline': 'Immediate',
                        'resources': 'Communication team'
                    }
                ]
            },
            'Solid Waste (Garbage) Related': {
                'Service Gap': [
                    {
                        'title': 'Increase Collection Frequency',
                        'description': 'Add extra collection rounds in high-density areas',
                        'priority': 'high',
                        'timeline': '1-2 weeks',
                        'resources': 'Additional vehicles, staff'
                    },
                    {
                        'title': 'Review Collection Routes',
                        'description': 'Optimize routes based on complaint hotspots',
                        'priority': 'high',
                        'timeline': '2-3 weeks',
                        'resources': 'Route planning, GPS data'
                    },
                    {
                        'title': 'Add Collection Points',
                        'description': 'Install additional waste bins in underserved areas',
                        'priority': 'medium',
                        'timeline': '1 month',
                        'resources': 'Bins, installation team'
                    }
                ],
                'Recurring Problem': [
                    {
                        'title': 'Root Cause Investigation',
                        'description': 'Investigate why collections are repeatedly missed',
                        'priority': 'high',
                        'timeline': '1 week',
                        'resources': 'Investigation team'
                    },
                    {
                        'title': 'Vehicle Maintenance Check',
                        'description': 'Audit vehicle availability and maintenance status',
                        'priority': 'high',
                        'timeline': '1-2 weeks',
                        'resources': 'Fleet management team'
                    }
                ]
            },
            'Road Maintenance(Engg)': {
                'Infrastructure Failure': [
                    {
                        'title': 'Comprehensive Road Assessment',
                        'description': 'Conduct structural assessment of affected road segments',
                        'priority': 'high',
                        'timeline': '2-3 weeks',
                        'resources': 'Civil engineers, assessment tools'
                    },
                    {
                        'title': 'Permanent Repair Solution',
                        'description': 'Implement permanent repair instead of temporary fixes',
                        'priority': 'high',
                        'timeline': '1-3 months',
                        'resources': 'Contractor, materials, budget'
                    },
                    {
                        'title': 'Quality Assurance',
                        'description': 'Establish quality checks for road repair work',
                        'priority': 'medium',
                        'timeline': 'Ongoing',
                        'resources': 'QA team, inspection protocol'
                    }
                ],
                'Recurring Problem': [
                    {
                        'title': 'Verify Previous Repairs',
                        'description': 'Inspect quality of previous repair work',
                        'priority': 'high',
                        'timeline': '1 week',
                        'resources': 'Inspection team'
                    },
                    {
                        'title': 'Identify Underlying Cause',
                        'description': 'Investigate why repairs are failing repeatedly',
                        'priority': 'high',
                        'timeline': '2 weeks',
                        'resources': 'Engineering team'
                    }
                ]
            },
            'Water Crisis': {
                'Emerging Crisis': [
                    {
                        'title': 'Emergency Water Supply',
                        'description': 'Arrange temporary water tankers for affected areas',
                        'priority': 'critical',
                        'timeline': 'Immediate',
                        'resources': 'Water tankers, coordination team'
                    },
                    {
                        'title': 'Pipeline Inspection',
                        'description': 'Urgent inspection of water supply infrastructure',
                        'priority': 'critical',
                        'timeline': '24-48 hours',
                        'resources': 'Technical team, detection equipment'
                    },
                    {
                        'title': 'Public Advisory',
                        'description': 'Issue water conservation advisory and status updates',
                        'priority': 'high',
                        'timeline': 'Immediate',
                        'resources': 'Communication team'
                    }
                ]
            },
            'Health Dept': {
                'Service Gap': [
                    {
                        'title': 'Increase Service Capacity',
                        'description': 'Add temporary staff or extend service hours',
                        'priority': 'high',
                        'timeline': '1-2 weeks',
                        'resources': 'Additional personnel, equipment'
                    },
                    {
                        'title': 'Streamline Processes',
                        'description': 'Review and optimize service delivery processes',
                        'priority': 'medium',
                        'timeline': '2-4 weeks',
                        'resources': 'Process improvement team'
                    }
                ]
            },
            'Sanitation': {
                'Infrastructure Failure': [
                    {
                        'title': 'Infrastructure Upgrade',
                        'description': 'Upgrade or repair sanitation infrastructure',
                        'priority': 'high',
                        'timeline': '1-3 months',
                        'resources': 'Construction crew, materials'
                    },
                    {
                        'title': 'Regular Maintenance Schedule',
                        'description': 'Establish preventive maintenance routine',
                        'priority': 'high',
                        'timeline': 'Ongoing',
                        'resources': 'Maintenance team'
                    }
                ]
            },
            'Storm  Water Drain(SWD)': {
                'Recurring Problem': [
                    {
                        'title': 'Drain Cleaning Campaign',
                        'description': 'Comprehensive cleaning of blocked drainage systems',
                        'priority': 'high',
                        'timeline': '1-2 weeks',
                        'resources': 'Cleaning crew, equipment'
                    },
                    {
                        'title': 'Install Debris Filters',
                        'description': 'Install filters to prevent future blockages',
                        'priority': 'medium',
                        'timeline': '1 month',
                        'resources': 'Installation materials, crew'
                    },
                    {
                        'title': 'Community Awareness',
                        'description': 'Educate community about proper waste disposal',
                        'priority': 'low',
                        'timeline': 'Ongoing',
                        'resources': 'Awareness campaign materials'
                    }
                ]
            }
        }
    
    def generate_recommendations(self, issues_df: pd.DataFrame) -> pd.DataFrame:
        """Generate recommendations for all issues"""
        print("\n" + "="*80)
        print("RECOMMENDATION GENERATION")
        print("="*80)
        
        print(f"\n  Generating recommendations for {len(issues_df):,} issues...")
        
        recommendations = []
        
        for _, issue in issues_df.iterrows():
            recs = self.get_recommendations_for_issue(issue)
            
            for rec in recs:
                recommendations.append({
                    'issue_id': issue['issue_id'],
                    'cluster_id': issue['cluster_id'],
                    'category': issue['category'],
                    'ward_name': issue['ward_name'],
                    'risk_level': issue['risk_level'],
                    **rec
                })
        
        recommendations_df = pd.DataFrame(recommendations)
        
        print(f"\n  ✓ Generated {len(recommendations_df):,} recommendations")
        
        # Priority distribution
        if len(recommendations_df) > 0:
            print(f"\n  Recommendation Priority Distribution:")
            pri_counts = recommendations_df['priority'].value_counts()
            for pri, count in pri_counts.items():
                print(f"    - {pri}: {count:,}")
        
        return recommendations_df
    
    def get_recommendations_for_issue(self, issue: dict) -> list:
        """Get recommendations for a single issue"""
        category = issue['category']
        issue_type = issue.get('issue_type', 'Other')
        
        # Get templates
        category_templates = self.recommendation_templates.get(category, {})
        type_templates = category_templates.get(issue_type, [])
        
        if not type_templates:
            # Generic recommendations
            type_templates = self._get_generic_recommendations(issue_type)
        
        return type_templates
    
    def _get_generic_recommendations(self, issue_type: str) -> list:
        """Generic recommendations for categories without specific templates"""
        if issue_type == 'Emerging Crisis':
            return [
                {
                    'title': 'Immediate Investigation',
                    'description': 'Deploy team to investigate and assess situation',
                    'priority': 'critical',
                    'timeline': '24-48 hours',
                    'resources': 'Investigation team'
                },
                {
                    'title': 'Temporary Mitigation',
                    'description': 'Implement temporary measures to address immediate concerns',
                    'priority': 'high',
                    'timeline': '1 week',
                    'resources': 'Response team, resources'
                }
            ]
        elif issue_type == 'Service Gap':
            return [
                {
                    'title': 'Service Assessment',
                    'description': 'Assess service delivery gaps and capacity',
                    'priority': 'high',
                    'timeline': '1-2 weeks',
                    'resources': 'Assessment team'
                },
                {
                    'title': 'Resource Allocation',
                    'description': 'Allocate additional resources to affected area',
                    'priority': 'high',
                    'timeline': '2-4 weeks',
                    'resources': 'Budget, personnel'
                }
            ]
        else:
            return [
                {
                    'title': 'Detailed Investigation',
                    'description': 'Conduct comprehensive investigation of recurring issue',
                    'priority': 'high',
                    'timeline': '2-3 weeks',
                    'resources': 'Investigation team'
                },
                {
                    'title': 'Action Plan',
                    'description': 'Develop and implement remediation action plan',
                    'priority': 'high',
                    'timeline': '1-2 months',
                    'resources': 'Project team, budget'
                }
            ]


def main():
    """Generate recommendations"""
    print("="*80)
    print("Civic Sathi RECOMMENDATION ENGINE - PHASE 3")
    print("="*80)
    
    # Load systemic issues
    data_dir = Path(__file__).parent.parent / "data"
    
    print("\n  Loading systemic issues...")
    issues_df = pd.read_csv(
        data_dir / "processed" / "systemic_issues_sample.csv",
        parse_dates=['first_complaint_date', 'last_complaint_date']
    )
    
    print(f"  ✓ Loaded {len(issues_df):,} systemic issues")
    
    # Generate recommendations
    engine = RecommendationEngine()
    recommendations_df = engine.generate_recommendations(issues_df)
    
    # Save
    output_path = data_dir / "processed" / "recommendations_sample.csv"
    recommendations_df.to_csv(output_path, index=False)
    
    print(f"\n✓ Saved recommendations: {output_path.name}")
    
    # Sample recommendations
    print("\n" + "="*80)
    print("SAMPLE RECOMMENDATIONS")
    print("="*80)
    
    # Group by issue
    for issue_id in recommendations_df['issue_id'].unique()[:3]:  # Top 3 issues
        issue_recs = recommendations_df[recommendations_df['issue_id'] == issue_id]
        
        if len(issue_recs) == 0:
            continue
        
        first_row = issue_recs.iloc[0]
        
        print(f"\n{issue_id}:")
        print(f"  Category: {first_row['category']}")
        print(f"  Ward: {first_row['ward_name']}")
        print(f"  Risk: {first_row['risk_level']}")
        print(f"\n  Recommended Actions:")
        
        for idx, (_, rec) in enumerate(issue_recs.iterrows(), 1):
            print(f"\n    {idx}. {rec['title']} [{rec['priority'].upper()} PRIORITY]")
            print(f"       {rec['description']}")
            print(f"       Timeline: {rec['timeline']}")
            print(f"       Resources: {rec['resources']}")
    
    print("\n" + "="*80)
    
    return recommendations_df


if __name__ == "__main__":
    main()
