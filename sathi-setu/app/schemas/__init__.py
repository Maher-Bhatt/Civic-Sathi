"""Validated Sathi Setu API contracts."""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class CitizenInput(BaseModel):
    source_identity_id: str = Field(min_length=2, max_length=160)
    name: str = Field(min_length=2, max_length=160)
    phone: str | None = Field(default=None, max_length=32)
    email: str | None = Field(default=None, max_length=254)


class CanonicalApplicationInput(BaseModel):
    source_reference: str = Field(min_length=2, max_length=160)
    citizen: CitizenInput
    service_type: str = Field(min_length=2, max_length=100)
    summary: str = Field(min_length=2, max_length=4000)
    status: str = Field(min_length=2, max_length=80)
    metadata: dict[str, Any] = Field(default_factory=dict)


class IngestRequest(BaseModel):
    source_system_key: Literal["civic-sathi", "mock-grievance-service"]
    payload: dict[str, Any]
    correlation_id: str = Field(min_length=8, max_length=100)
    idempotency_key: str = Field(min_length=12, max_length=160)


class ConsentRequest(BaseModel):
    identity_id: str
    source_system_key: str
    target_system_key: str
    purpose: str = Field(min_length=4, max_length=200)
    expires_at: datetime | None = None


class ConsentDecision(BaseModel):
    decision: Literal["GRANTED", "DENIED", "REVOKED"]
    actor: str = Field(min_length=3, max_length=160)
    correlation_id: str = Field(min_length=8, max_length=100)


class StatusUpdate(BaseModel):
    source_system_key: Literal["civic-sathi", "mock-grievance-service"]
    source_reference: str = Field(min_length=2, max_length=160)
    status: str = Field(min_length=2, max_length=80)
    correlation_id: str = Field(min_length=8, max_length=100)
    idempotency_key: str = Field(min_length=12, max_length=160)


class MappingUpdate(BaseModel):
    field_mapping: dict[str, str] = Field(min_length=1)
    actor: str = Field(min_length=3, max_length=160)
    correlation_id: str = Field(min_length=8, max_length=100)


class DataQualityResolution(BaseModel):
    action: Literal["MERGED", "KEPT_SEPARATE", "DISMISSED"]
    actor: str = Field(min_length=3, max_length=160)
    notes: str = Field(min_length=3, max_length=1000)
    correlation_id: str = Field(min_length=8, max_length=100)
