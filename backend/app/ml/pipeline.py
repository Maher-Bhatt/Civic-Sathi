"""Main ML/AI pipeline orchestration"""

from uuid import UUID
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ml.preprocessing import preprocess_text
from app.ml.embeddings import embed_text, get_embedding_model_name
from app.ml.similarity import find_similar_complaints
from app.ml.risk import calculate_complaint_risk_score
from app.schemas.complaint import ComplaintCreate
from app.ml.deduplication import get_candidate_issues, calculate_similarity_score


from app.schemas.common import ComplaintCategory, EntityResult

class ComplaintMLResult(BaseModel):
    """Result of ML analysis for a complaint"""
    category: ComplaintCategory
    department_slug: str
    severity_score: int
    risk_score: int
    keywords: list[str]
    entities: list[EntityResult]
    embedding_model: str
    embedding_vector: list[float]
    similar_complaint_ids: list[UUID]
    confidence_score: float
    language: str
    cleaned_text: str


def classify_category(text: str, category_hint: str | None = None) -> tuple[ComplaintCategory, str, float]:
    """
    Classify complaint category using keyword-based fallback.
    
    Args:
        text: Complaint text
        category_hint: Optional category hint from user
        
    Returns:
        Tuple of (category, department_slug, confidence)
    """
    text_lower = text.lower()
    
    # Category keyword mapping - expanded to support all 9 frontend categories
    category_keywords = {
        'water_supply': ['water', 'leak', 'pipe', 'tap', 'supply', 'pressure', 'contamination', 'tanker', 'drinking'],
        'road_damage': ['pothole', 'road', 'street', 'pavement', 'crack', 'repair', 'asphalt', 'broken'],
        'garbage_collection': ['garbage', 'waste', 'trash', 'bin', 'dump', 'litter', 'collection', 'refuse'],
        'drainage': ['drain', 'block', 'flood', 'waterlog', 'monsoon', 'gutter', 'channel'],
        'sewage': ['sewage', 'overflow', 'smell', 'toilet', 'septic', 'waste water'],
        'street_lighting': ['streetlight', 'lamp', 'bulb', 'dark', 'lighting', 'illuminate'],
        'electricity': ['electricity', 'power', 'outage', 'transformer', 'wire', 'cable', 'blackout'],
        'public_transport': ['bus', 'transport', 'traffic', 'vehicle', 'route', 'stop', 'service'],
        'sanitation': ['dirty', 'clean', 'hygiene', 'sanitary', 'public health', 'disease'],
    }
    
    # Department mapping
    department_map = {
        'water_supply': 'water_works',
        'road_damage': 'public_works',
        'garbage_collection': 'sanitation',
        'drainage': 'drainage',
        'sewage': 'drainage',
        'street_lighting': 'electricity',
        'electricity': 'electricity',
        'public_transport': 'general',
        'sanitation': 'sanitation',
        'other': 'general',
    }
    
    # Check if hint matches a known category
    if category_hint:
        hint_normalized = category_hint.lower().replace(' ', '_')
        if hint_normalized in category_keywords:
            category = hint_normalized
            confidence = 0.85
        else:
            # Try to match hint to keywords
            scores = {}
            for cat, keywords in category_keywords.items():
                score = sum(1 for kw in keywords if kw in text_lower)
                scores[cat] = score
            
            category = max(scores, key=scores.get) if max(scores.values()) > 0 else 'sanitation'
            confidence = min(0.7 + (scores[category] * 0.05), 0.95)
    else:
        # Score each category
        scores = {}
        for cat, keywords in category_keywords.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            scores[cat] = score
        
        # Get best match
        if max(scores.values()) > 0:
            category = max(scores, key=scores.get)
            confidence = min(0.7 + (scores[category] * 0.05), 0.95)
        else:
            category = 'other'
            confidence = 0.5
    
    department_slug = department_map.get(category, 'general')
    
    try:
        category_enum = ComplaintCategory(category)
    except ValueError:
        category_enum = ComplaintCategory.OTHER
    
    return category_enum, department_slug, confidence


def calculate_severity(text: str, keywords: list[str]) -> int:
    """
    Calculate severity score based on text and keywords.
    
    Args:
        text: Complaint text
        keywords: Extracted keywords
        
    Returns:
        Severity score (0-100)
    """
    text_lower = text.lower()
    keywords_lower = [kw.lower() for kw in keywords]
    
    # High severity indicators
    severe_keywords = [
        'emergency', 'urgent', 'critical', 'dangerous', 'hazard', 'unsafe',
        'accident', 'injury', 'health', 'severe', 'overflow', 'broken',
        'blocked', 'major', 'serious'
    ]
    
    # Medium severity indicators
    medium_keywords = [
        'problem', 'issue', 'concern', 'difficult', 'bad', 'poor',
        'inconvenient', 'affecting', 'spreading'
    ]
    
    # Count matches
    severe_count = sum(1 for kw in severe_keywords if kw in text_lower)
    medium_count = sum(1 for kw in medium_keywords if kw in text_lower)
    
    # Base score
    severity = 40
    
    # Add points for severity indicators
    severity += min(severe_count * 15, 45)
    severity += min(medium_count * 5, 15)
    
    # Clamp to 0-100
    return min(max(severity, 0), 100)


def analyze_complaint(complaint_data: ComplaintCreate, db: Session) -> ComplaintMLResult:
    """
    Run complete ML analysis pipeline on a complaint.
    
    Args:
        complaint_data: Complaint input data
        db: Database session
        
    Returns:
        ComplaintMLResult with all analysis outputs
    """
    # Combine title and description
    full_text = f"{complaint_data.title}. {complaint_data.description}"
    
    # 1. Preprocessing
    preprocessed = preprocess_text(full_text)
    
    # 2. Generate embedding
    embedding = embed_text(preprocessed['cleaned_text'])
    embedding_model = get_embedding_model_name()
    
    # 3. Candidate Retrieval & Similarity Search
    similar_ids = []
    
    # 4. Classify category
    category, department_slug, confidence = classify_category(
        full_text,
        complaint_data.category_hint
    )
    
    # Fast Candidate Retrieval (Phase 3)
    if hasattr(complaint_data, 'city_id') and complaint_data.city_id:
        # If city_id is provided, find candidates
        pass # Will be done in async job normally
    
    # (Since analysis might happen before city is known, or async, we just use FAISS fallback here for the basic pipeline, but real deduplication happens in the async job)
    
    # 5. Calculate severity
    severity = calculate_severity(full_text, preprocessed['keywords'])
    
    # 6. Calculate risk
    risk = calculate_complaint_risk_score(
        severity_score=severity,
        keywords=preprocessed['keywords'],
        similar_count=0,
        days_old=0  # New complaint
    )
    
    return ComplaintMLResult(
        category=category,
        department_slug=department_slug,
        severity_score=severity,
        risk_score=risk,
        keywords=preprocessed['keywords'],
        entities=preprocessed['entities'],
        embedding_model=embedding_model,
        embedding_vector=embedding,
        similar_complaint_ids=[], # Deprecated, use deduplication job
        confidence_score=confidence,
        language=preprocessed['language'],
        cleaned_text=preprocessed['cleaned_text'],
    )
