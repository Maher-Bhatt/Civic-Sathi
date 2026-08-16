"""Root cause analysis generation"""

from collections import Counter
from app.ml.clustering import ComplaintCluster


# Root cause templates by category
ROOT_CAUSE_TEMPLATES = {
    'sanitation': {
        'overflow': "Collection frequency appears insufficient based on {count} overflow reports concentrated in {location}.",
        'bins': "Bin capacity or placement issues detected with {count} related complaints about bins and waste accumulation.",
        'smell': "Persistent sanitation concerns with {count} smell-related reports suggesting inadequate cleaning.",
        'market': "Market area sanitation challenges with {count} complaints indicating high-traffic zone needs.",
        'default': "Recurring sanitation issues with {count} complaints showing pattern of service gaps.",
    },
    'roads': {
        'pothole': "Road surface degradation with {count} pothole reports in concentrated area, likely due to weather damage or wear.",
        'accident': "Safety concerns with {count} accident-related reports suggesting hazardous road conditions.",
        'repair': "Delayed maintenance evident from {count} repair requests in the same stretch.",
        'default': "Road infrastructure issues with {count} complaints indicating maintenance backlog.",
    },
    'water': {
        'leak': "Water distribution system integrity issues with {count} leak reports in nearby locations.",
        'pressure': "Supply pressure problems with {count} complaints suggesting pump or pipeline issues.",
        'contamination': "Water quality concerns with {count} contamination reports requiring immediate investigation.",
        'supply': "Supply continuity issues with {count} complaints about irregular or no water supply.",
        'default': "Water system problems with {count} complaints showing infrastructure or supply challenges.",
    },
    'electricity': {
        'outage': "Power supply stability issues with {count} outage reports indicating grid or transformer problems.",
        'streetlight': "Street lighting infrastructure degradation with {count} non-functional light reports.",
        'transformer': "Electrical infrastructure concerns with {count} transformer-related reports.",
        'default': "Electrical system issues with {count} complaints suggesting infrastructure needs.",
    },
    'drainage': {
        'flooding': "Drainage capacity insufficient with {count} flooding reports during wet conditions.",
        'sewage': "Sewage system blockage or overflow with {count} related complaints.",
        'blocked': "Drain blockage issues with {count} reports of clogged or non-functional drains.",
        'default': "Drainage system problems with {count} complaints indicating maintenance or capacity issues.",
    },
}


def generate_root_cause(cluster: ComplaintCluster) -> dict:
    """
    Generate root cause analysis for an issue cluster.
    
    Args:
        cluster: Complaint cluster
        
    Returns:
        Dictionary with cause_type, explanation, evidence, and confidence
    """
    category = cluster.category.lower()
    count = cluster.size()
    
    # Get templates for this category
    templates = ROOT_CAUSE_TEMPLATES.get(category, {})
    if not templates:
        templates = {'default': f"Recurring {category} issues with {{count}} complaints showing pattern."}
    
    # Analyze keywords to determine cause type
    top_keywords = cluster.get_top_keywords(15)
    keywords_lower = [kw.lower() for kw in top_keywords]
    
    # Find matching template
    cause_type = 'default'
    max_matches = 0
    
    for template_key in templates.keys():
        if template_key == 'default':
            continue
        matches = sum(1 for kw in keywords_lower if template_key in kw or kw in template_key)
        if matches > max_matches:
            max_matches = matches
            cause_type = template_key
    
    # Build explanation
    template = templates.get(cause_type, templates['default'])
    
    ward_info = f"Ward {cluster.ward_number}" if cluster.ward_number else "the affected area"
    explanation = template.format(count=count, location=ward_info)
    
    # Build evidence
    first_seen, last_seen = cluster.get_time_range()
    days_span = (last_seen - first_seen).days + 1
    
    evidence = {
        'complaint_count': count,
        'time_span_days': days_span,
        'top_keywords': top_keywords[:10],
        'ward': cluster.ward_number,
        'category': category,
        'first_seen': first_seen.isoformat(),
        'last_seen': last_seen.isoformat(),
    }
    
    # Calculate confidence
    confidence = calculate_root_cause_confidence(cluster, max_matches)
    
    return {
        'cause_type': cause_type,
        'explanation': explanation,
        'evidence': evidence,
        'confidence_score': confidence,
    }


def calculate_root_cause_confidence(cluster: ComplaintCluster, keyword_matches: int) -> float:
    """
    Calculate confidence score for root cause analysis.
    
    Based on:
    - Cluster size (more complaints = higher confidence)
    - Keyword matches (more specific keywords = higher confidence)
    - Temporal consistency (longer span = higher confidence)
    - Geographic concentration (tighter location = higher confidence)
    
    Args:
        cluster: Complaint cluster
        keyword_matches: Number of keyword matches
        
    Returns:
        Confidence score (0.0-1.0)
    """
    confidence = 0.0
    
    # Size factor (up to 0.4)
    size = cluster.size()
    size_score = min(size / 20, 1.0) * 0.4
    confidence += size_score
    
    # Keyword specificity (up to 0.3)
    keyword_score = min(keyword_matches / 5, 1.0) * 0.3
    confidence += keyword_score
    
    # Temporal consistency (up to 0.15)
    first_seen, last_seen = cluster.get_time_range()
    days_span = (last_seen - first_seen).days + 1
    temporal_score = min(days_span / 14, 1.0) * 0.15
    confidence += temporal_score
    
    # Geographic concentration (up to 0.15)
    if cluster.locations:
        geo_score = 0.15
    else:
        geo_score = 0.05
    confidence += geo_score
    
    return round(confidence, 2)
