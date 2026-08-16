"""Common schemas and enums"""

from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class ComplaintStatus(str, Enum):
    """Complaint status enumeration"""
    RECEIVED = "received"
    IN_REVIEW = "in_review"
    ASSIGNED = "assigned"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class ComplaintCategory(str, Enum):
    """Complaint category enumeration"""
    WATER_SUPPLY = "water_supply"
    ROAD_DAMAGE = "road_damage"
    GARBAGE_COLLECTION = "garbage_collection"
    DRAINAGE = "drainage"
    SEWAGE = "sewage"
    STREET_LIGHTING = "street_lighting"
    ELECTRICITY = "electricity"
    PUBLIC_TRANSPORT = "public_transport"
    SANITATION = "sanitation"
    OTHER = "other"


class Priority(str, Enum):
    """Priority level enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class RiskLevel(str, Enum):
    """Risk level enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RecommendationActionType(str, Enum):
    """Recommendation action type enumeration"""
    INSPECT = "inspect"
    DISPATCH = "dispatch"
    REPAIR = "repair"
    CLEAN = "clean"
    NOTIFY = "notify"
    MONITOR = "monitor"


class DepartmentSlug(str, Enum):
    """Department slug enumeration"""
    SANITATION = "sanitation"
    PUBLIC_WORKS = "public_works"
    WATER_WORKS = "water_works"
    ELECTRICITY = "electricity"
    DRAINAGE = "drainage"
    SAFETY = "safety"
    GENERAL = "general"


class PaginatedResponse(BaseModel):
    """Generic paginated response"""
    items: list[Any]
    total: int
    limit: int
    offset: int


class Coordinates(BaseModel):
    """Geographic coordinates"""
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class EntityResult(BaseModel):
    """NLP entity extraction result"""
    text: str
    label: str
    start: int | None = None
    end: int | None = None
