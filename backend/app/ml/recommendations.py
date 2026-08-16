"""Recommendation generation for systemic issues"""

from app.ml.clustering import ComplaintCluster


# Recommendation templates by category and cause type
RECOMMENDATION_TEMPLATES = {
    'sanitation': [
        {
            'title': 'Increase collection frequency',
            'action_type': 'dispatch',
            'priority': 'high',
            'effort_level': 'medium',
            'expected_impact': 'high',
            'steps': [
                'Schedule additional pickup for affected zone',
                'Deploy extra collection vehicles during peak times',
                'Monitor for 7 days and adjust schedule',
            ]
        },
        {
            'title': 'Inspect bin capacity and placement',
            'action_type': 'inspect',
            'priority': 'medium',
            'effort_level': 'low',
            'expected_impact': 'medium',
            'steps': [
                'Site inspection of current bin locations',
                'Assess bin sizes vs. waste volume',
                'Recommend additional bins or larger capacity',
            ]
        },
        {
            'title': 'Deploy cleaning crew for immediate action',
            'action_type': 'clean',
            'priority': 'urgent',
            'effort_level': 'low',
            'expected_impact': 'medium',
            'steps': [
                'Dispatch cleaning team to affected area',
                'Clear accumulated waste immediately',
                'Sanitize the location',
            ]
        },
    ],
    'roads': [
        {
            'title': 'Schedule road surface inspection',
            'action_type': 'inspect',
            'priority': 'high',
            'effort_level': 'low',
            'expected_impact': 'high',
            'steps': [
                'Send inspection team to assess damage extent',
                'Document potholes and surface issues',
                'Prioritize by safety risk',
            ]
        },
        {
            'title': 'Emergency pothole repair',
            'action_type': 'repair',
            'priority': 'urgent',
            'effort_level': 'medium',
            'expected_impact': 'high',
            'steps': [
                'Deploy road repair crew immediately',
                'Fill potholes with temporary or permanent material',
                'Mark repaired areas and monitor',
            ]
        },
        {
            'title': 'Install hazard warning signage',
            'action_type': 'notify',
            'priority': 'high',
            'effort_level': 'low',
            'expected_impact': 'medium',
            'steps': [
                'Place warning signs at hazardous locations',
                'Add reflective markers for night visibility',
                'Update motorists via public channels',
            ]
        },
    ],
    'water': [
        {
            'title': 'Send water works inspection team',
            'action_type': 'inspect',
            'priority': 'urgent',
            'effort_level': 'medium',
            'expected_impact': 'high',
            'steps': [
                'Inspect water lines and connections in affected area',
                'Check for leaks, pressure issues, or contamination',
                'Test water quality if contamination reported',
            ]
        },
        {
            'title': 'Isolate and repair water line',
            'action_type': 'repair',
            'priority': 'urgent',
            'effort_level': 'high',
            'expected_impact': 'high',
            'steps': [
                'Identify exact leak or failure point',
                'Isolate affected section of water network',
                'Repair or replace damaged pipes',
                'Restore and test water supply',
            ]
        },
        {
            'title': 'Arrange emergency tanker water supply',
            'action_type': 'dispatch',
            'priority': 'urgent',
            'effort_level': 'medium',
            'expected_impact': 'medium',
            'steps': [
                'Deploy water tankers to affected area',
                'Set up distribution points',
                'Publish tanker schedule and locations',
            ]
        },
    ],
    'electricity': [
        {
            'title': 'Dispatch electrical inspection team',
            'action_type': 'inspect',
            'priority': 'urgent',
            'effort_level': 'medium',
            'expected_impact': 'high',
            'steps': [
                'Send electrical engineers to affected area',
                'Inspect transformers, lines, and connections',
                'Identify root cause of power issues',
            ]
        },
        {
            'title': 'Replace faulty transformer or equipment',
            'action_type': 'repair',
            'priority': 'urgent',
            'effort_level': 'high',
            'expected_impact': 'high',
            'steps': [
                'Arrange replacement transformer/equipment',
                'Schedule installation with minimal downtime',
                'Test and restore power supply',
                'Monitor for stability',
            ]
        },
        {
            'title': 'Restore street lighting',
            'action_type': 'repair',
            'priority': 'high',
            'effort_level': 'low',
            'expected_impact': 'medium',
            'steps': [
                'Replace non-functional street lights',
                'Check wiring and connections',
                'Test all lights in affected stretch',
            ]
        },
    ],
    'drainage': [
        {
            'title': 'Desilt and clear drainage channels',
            'action_type': 'clean',
            'priority': 'high',
            'effort_level': 'medium',
            'expected_impact': 'high',
            'steps': [
                'Deploy desilting equipment to affected area',
                'Clear blocked drains and remove debris',
                'Ensure water flow is restored',
            ]
        },
        {
            'title': 'Deploy pumps for immediate relief',
            'action_type': 'dispatch',
            'priority': 'urgent',
            'effort_level': 'medium',
            'expected_impact': 'medium',
            'steps': [
                'Set up temporary pumps to remove standing water',
                'Monitor water levels during monsoon',
                'Plan permanent drainage solution',
            ]
        },
        {
            'title': 'Inspect for illegal blockages',
            'action_type': 'inspect',
            'priority': 'medium',
            'effort_level': 'low',
            'expected_impact': 'medium',
            'steps': [
                'Check for illegal encroachments blocking drains',
                'Identify construction debris or dumping',
                'Take enforcement action and clear blockages',
            ]
        },
    ],
}


def generate_recommendations(cluster: ComplaintCluster, root_cause_type: str) -> list[dict]:
    """
    Generate actionable recommendations for an issue cluster.
    
    Args:
        cluster: Complaint cluster
        root_cause_type: Determined root cause type
        
    Returns:
        List of recommendation dictionaries
    """
    category = cluster.category.lower()
    
    # Get templates for this category
    templates = RECOMMENDATION_TEMPLATES.get(category, [])
    
    if not templates:
        # Fallback generic recommendations
        templates = [
            {
                'title': f'Inspect and assess {category} issues',
                'action_type': 'inspect',
                'priority': 'high',
                'effort_level': 'medium',
                'expected_impact': 'high',
                'steps': [
                    f'Send inspection team to affected area',
                    f'Document all {category}-related issues',
                    'Develop action plan based on findings',
                ]
            }
        ]
    
    # Return top 3 recommendations
    recommendations = []
    for template in templates[:3]:
        recommendations.append({
            **template,
            'category': category,
            'cluster_size': cluster.size(),
        })
    
    return recommendations
