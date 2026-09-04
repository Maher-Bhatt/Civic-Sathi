"""Complaint API endpoint tests"""

import pytest
from uuid import uuid4


def test_create_complaint(client):
    """Test creating a complaint"""
    response = client.post("/api/v1/complaints", json={
        "title": "Test garbage overflow",
        "description": "This is a test complaint with enough description text to meet minimum requirements.",
        "category_hint": "sanitation",
        "ward_number": 14,
        "lat": 28.6139,
        "lng": 77.2090,
        "address_text": "Test address",
        "submitted_by": {
            "name": "Test User",
            "phone": "+91-9000000000"
        }
    })
    
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert "public_id" in data
    assert data["status"] == "received"
    assert data["category"] == "sanitation"


def test_create_complaint_validation_error(client):
    """Test validation error for short description"""
    response = client.post("/api/v1/complaints", json={
        "title": "Test",
        "description": "Too short",
        "ward_number": 14
    })
    
    assert response.status_code == 422


def test_list_complaints_requires_auth(unauthenticated_client):
    """Test that listing complaints requires officer key"""
    response = unauthenticated_client.get("/api/v1/complaints")
    assert response.status_code == 401
