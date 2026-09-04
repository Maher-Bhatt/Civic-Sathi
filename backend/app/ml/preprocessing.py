"""Text preprocessing with spaCy"""

import re
from typing import Any
from app.ml.model_registry import get_spacy_model
from app.schemas.common import EntityResult


def _extract_lexical_keywords(text: str, max_keywords: int) -> list[str]:
    """Provide stable keywords when the lightweight spaCy model has no POS tagger."""
    words = re.findall(r'\b\w{3,}\b', text.lower())
    return list(dict.fromkeys(words))[:max_keywords]


def detect_language(text: str) -> str:
    """
    Detect text language (simplified for MVP).
    Returns 'en' for English or 'unknown'.
    """
    # Simple heuristic: check for common English words
    english_indicators = ['the', 'is', 'and', 'of', 'to', 'in', 'for', 'on', 'at']
    text_lower = text.lower()
    
    matches = sum(1 for word in english_indicators if f' {word} ' in f' {text_lower} ')
    return 'en' if matches >= 2 else 'unknown'


def clean_text(text: str) -> str:
    """
    Normalize and clean text.
    
    Args:
        text: Raw input text
        
    Returns:
        Cleaned text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    
    # Trim
    text = text.strip()
    
    return text


def extract_entities(text: str) -> list[EntityResult]:
    """
    Extract named entities using spaCy.
    
    Args:
        text: Input text
        
    Returns:
        List of extracted entities
    """
    try:
        nlp = get_spacy_model()
        doc = nlp(text)
        
        entities = []
        for ent in doc.ents:
            entities.append(EntityResult(
                text=ent.text,
                label=ent.label_,
                start=ent.start_char,
                end=ent.end_char
            ))
        
        return entities
    except Exception:
        return []


def extract_keywords(text: str, max_keywords: int = 10) -> list[str]:
    """
    Extract important keywords using spaCy.
    
    Args:
        text: Input text
        max_keywords: Maximum number of keywords to extract
        
    Returns:
        List of keywords
    """
    try:
        nlp = get_spacy_model()
        doc = nlp(text)
        
        # Extract nouns and proper nouns
        keywords = []
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop and len(token.text) > 2:
                keywords.append(token.text.lower())
        
        # Remove duplicates while preserving order
        seen = set()
        unique_keywords = []
        for kw in keywords:
            if kw not in seen:
                seen.add(kw)
                unique_keywords.append(kw)
        
        # ``spacy.blank("en")`` is a supported low-memory fallback but has no
        # POS tagger. In that case, use the same deterministic lexical fallback
        # as an unavailable spaCy installation instead of returning no signal.
        return unique_keywords[:max_keywords] or _extract_lexical_keywords(text, max_keywords)
    except Exception:
        return _extract_lexical_keywords(text, max_keywords)


def preprocess_text(text: str) -> dict[str, Any]:
    """
    Complete text preprocessing pipeline.
    
    Args:
        text: Raw input text
        
    Returns:
        Dictionary with processed text components
    """
    language = detect_language(text)
    cleaned = clean_text(text)
    entities = extract_entities(text)
    keywords = extract_keywords(text)
    
    return {
        'language': language,
        'cleaned_text': cleaned,
        'entities': entities,
        'keywords': keywords,
    }
