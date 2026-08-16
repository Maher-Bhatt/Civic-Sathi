"""Risk scoring for complaints and issues"""

from datetime import datetime, timedelta, timezone
from app.ml.clustering import ComplaintCluster


# Civic impact keywords
CIVIC_IMPACT_KEYWORDS = {
    'market', 'school', 'hospital', 'clinic', 'temple', 'church', 'mosque',
    'transport', 'bus', 'station', 'water', 'electricity', 'main road',
    'highway', 'bridge', 'emergency', 'safety', 'children', 'elderly'
}

# Urgent keywords
URGENT_KEYWORDS = {
    'urgent', 'emergency', 'dangerous', 'hazard', 'accident', 'injury',
    'health', 'risk', 'critical', 'immediate', 'severe', 'overflow',
    'flooded', 'blocked', 'broken'
}


def calculate_complaint_risk_score(
    severity_score: int,
    keywords: list[str],
    similar_count: int = 0,
    days_old: int = 0
) -> int:
    """
    Calculate risk score for a single complaint.
    
    Risk factors:
    - Severity: base severity score (0-100)
    - Keywords: urgent and civic impact keywords add weight
    - Similarity: more similar complaints = higher risk
    - Age: older unresolved complaints increase risk
    
    Args:
        severity_score: Base severity (0-100)
        keywords: Extracted keywords from complaint
        similar_count: Number of similar complaints
        days_old: Days since complaint was created
        
    Returns:
        Risk score (0-100)
    """
    # Start with severity
    risk = severity_score * 0.4  # 40% weight
    
    # Keyword boost
    keywords_lower = [kw.lower() for kw in keywords]
    
    urgent_boost = sum(5 for kw in keywords_lower if kw in URGENT_KEYWORDS)
    civic_boost = sum(3 for kw in keywords_lower if kw in CIVIC_IMPACT_KEYWORDS)
    
    risk += min(urgent_boost + civic_boost, 25)  # Up to 25 points
    
    # Similar complaints boost
    similarity_boost = min(similar_count * 2, 20)  # Up to 20 points
    risk += similarity_boost
    
    # Age penalty for unresolved
    age_boost = min(days_old * 0.5, 15)  # Up to 15 points
    risk += age_boost
    
    # Clamp to 0-100
    return int(min(max(risk, 0), 100))


def calculate_issue_risk_score(cluster: ComplaintCluster) -> int:
    """
    Calculate risk score for an issue cluster using PRD formula.
    
    Risk Factor Weights:
    - Frequency: 25% (min(25, complaint_count * 3))
    - Velocity: 20% (complaints in last 72h vs prior 72h)
    - Severity: 25% (mean severity + urgent keyword boost)
    - Civic impact: 15% (civic keywords boost)
    - Age unresolved: 10% (oldest complaint age)
    - Confidence: 5% (data completeness)
    
    Args:
        cluster: Complaint cluster
        
    Returns:
        Risk score (0-100)
    """
    risk = 0.0
    
    # 1. Frequency (25%)
    frequency_score = min(25, cluster.size() * 3)
    risk += frequency_score
    
    # 2. Velocity (20%)
    now = datetime.now(timezone.utc)
    cutoff_72h = now - timedelta(hours=72)
    cutoff_144h = now - timedelta(hours=144)
    
    recent_count = sum(1 for dt in cluster.created_ats if dt >= cutoff_72h)
    prior_count = sum(1 for dt in cluster.created_ats if cutoff_144h <= dt < cutoff_72h)
    
    if prior_count > 0:
        velocity_ratio = recent_count / prior_count
        velocity_score = min(velocity_ratio * 10, 20)
    else:
        velocity_score = recent_count * 2  # No prior data
    
    risk += min(velocity_score, 20)
    
    # 3. Severity (25%)
    avg_severity = cluster.get_avg_severity()
    severity_base = avg_severity * 0.2  # Scale to 20 points max
    
    # Urgent keyword boost
    top_keywords = cluster.get_top_keywords(20)
    keywords_lower = [kw.lower() for kw in top_keywords]
    urgent_count = sum(1 for kw in keywords_lower if kw in URGENT_KEYWORDS)
    urgent_boost = min(urgent_count * 1, 5)
    
    severity_score = min(severity_base + urgent_boost, 25)
    risk += severity_score
    
    # 4. Civic impact (15%)
    civic_count = sum(1 for kw in keywords_lower if kw in CIVIC_IMPACT_KEYWORDS)
    civic_score = min(civic_count * 3, 15)
    risk += civic_score
    
    # 5. Age unresolved (10%)
    first_seen, _ = cluster.get_time_range()
    days_old = (now - first_seen).days
    age_score = min(days_old * 0.5, 10)
    risk += age_score
    
    # 6. Confidence (5%)
    # Based on data completeness
    has_location = len(cluster.locations) > 0
    has_keywords = len(top_keywords) > 0
    has_temporal = len(cluster.created_ats) > 0
    
    confidence = (
        (2 if has_location else 0) +
        (2 if has_keywords else 0) +
        (1 if has_temporal else 0)
    )
    risk += confidence
    
    # Clamp to 0-100
    return int(min(max(risk, 0), 100))


def get_risk_level(risk_score: int) -> str:
    """
    Map risk score to risk level.
    
    Levels:
    - low: 0-34
    - medium: 35-59
    - high: 60-79
    - critical: 80-100
    
    Args:
        risk_score: Risk score (0-100)
        
    Returns:
        Risk level string
    """
    if risk_score >= 80:
        return 'critical'
    elif risk_score >= 60:
        return 'high'
    elif risk_score >= 35:
        return 'medium'
    else:
        return 'low'
