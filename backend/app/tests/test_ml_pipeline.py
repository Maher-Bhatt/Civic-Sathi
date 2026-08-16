"""ML pipeline tests"""

import pytest
from app.ml.preprocessing import clean_text, extract_keywords
from app.ml.embeddings import embed_text
from app.ml.risk import calculate_complaint_risk_score, get_risk_level


def test_clean_text():
    """Test text cleaning"""
    text = "  HELLO   WORLD  "
    cleaned = clean_text(text)
    assert cleaned == "hello world"


def test_extract_keywords():
    """Test keyword extraction"""
    text = "Garbage overflow bins market smell school"
    keywords = extract_keywords(text)
    assert len(keywords) > 0
    assert any(kw in ["garbage", "bins", "market"] for kw in keywords)


def test_embed_text():
    """Test text embedding"""
    text = "Test complaint about sanitation"
    embedding = embed_text(text)
    assert isinstance(embedding, list)
    assert len(embedding) == 384  # all-MiniLM-L6-v2 dimension


def test_calculate_risk_score():
    """Test risk score calculation"""
    risk = calculate_complaint_risk_score(
        severity_score=75,
        keywords=["urgent", "emergency", "market"],
        similar_count=5,
        days_old=3
    )
    assert 0 <= risk <= 100
    assert risk > 50  # Should be relatively high


def test_get_risk_level():
    """Test risk level mapping"""
    assert get_risk_level(90) == "critical"
    assert get_risk_level(70) == "high"
    assert get_risk_level(50) == "medium"
    assert get_risk_level(20) == "low"
