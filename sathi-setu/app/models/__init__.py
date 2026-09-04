"""Sathi Setu persistence models.

All records belong to the dedicated Sathi Setu database.  They intentionally
do not reference Civic Sathi tables or migrations.
"""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class Record:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )


class ExternalSystem(Record, Base):
    __tablename__ = "external_systems"

    key: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(180))
    classification: Mapped[str] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(32), default="SANDBOX")
    description: Mapped[str] = mapped_column(Text)


class ConnectorConfig(Record, Base):
    __tablename__ = "connector_configs"
    __table_args__ = (UniqueConstraint("system_id", "version", name="uq_connector_system_version"),)

    system_id: Mapped[str] = mapped_column(ForeignKey("external_systems.id"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    version: Mapped[int] = mapped_column(default=1)
    field_mapping: Mapped[dict] = mapped_column(JSON, default=dict)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)


class Identity(Record, Base):
    __tablename__ = "identities"

    canonical_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(160))
    contact_fingerprint: Mapped[str | None] = mapped_column(String(128), index=True, nullable=True)
    email_normalized: Mapped[str | None] = mapped_column(String(254), index=True, nullable=True)
    match_status: Mapped[str] = mapped_column(String(32), default="VERIFIED_DEMO")


class IdentityLink(Record, Base):
    __tablename__ = "identity_links"
    __table_args__ = (UniqueConstraint("system_id", "source_identity_id", name="uq_identity_source_link"),)

    identity_id: Mapped[str] = mapped_column(ForeignKey("identities.id"), index=True)
    system_id: Mapped[str] = mapped_column(ForeignKey("external_systems.id"), index=True)
    source_identity_id: Mapped[str] = mapped_column(String(160))
    confidence: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(Text)


class Consent(Record, Base):
    __tablename__ = "consents"

    identity_id: Mapped[str] = mapped_column(ForeignKey("identities.id"), index=True)
    source_system_id: Mapped[str] = mapped_column(ForeignKey("external_systems.id"))
    target_system_id: Mapped[str] = mapped_column(ForeignKey("external_systems.id"))
    purpose: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(32), default="PENDING")
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    granted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class UnifiedApplication(Record, Base):
    __tablename__ = "unified_applications"

    unified_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    identity_id: Mapped[str] = mapped_column(ForeignKey("identities.id"), index=True)
    service_type: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(80))
    summary: Mapped[str] = mapped_column(Text)
    source_records: Mapped[list] = mapped_column(JSON, default=list)


class SetuEvent(Record, Base):
    __tablename__ = "events"

    event_type: Mapped[str] = mapped_column(String(80), index=True)
    unified_application_id: Mapped[str | None] = mapped_column(ForeignKey("unified_applications.id"), nullable=True)
    source_system_id: Mapped[str] = mapped_column(ForeignKey("external_systems.id"))
    target_system_id: Mapped[str | None] = mapped_column(ForeignKey("external_systems.id"), nullable=True)
    correlation_id: Mapped[str] = mapped_column(String(100), index=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class DataQualityIssue(Record, Base):
    __tablename__ = "data_quality_issues"

    issue_type: Mapped[str] = mapped_column(String(80))
    severity: Mapped[str] = mapped_column(String(32), default="MEDIUM")
    status: Mapped[str] = mapped_column(String(32), default="OPEN")
    identity_id: Mapped[str | None] = mapped_column(ForeignKey("identities.id"), nullable=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    resolution: Mapped[str | None] = mapped_column(Text, nullable=True)


class AuditEntry(Record, Base):
    __tablename__ = "audit_entries"

    actor: Mapped[str] = mapped_column(String(160))
    action: Mapped[str] = mapped_column(String(120), index=True)
    resource_type: Mapped[str] = mapped_column(String(80))
    resource_id: Mapped[str] = mapped_column(String(160))
    correlation_id: Mapped[str] = mapped_column(String(100), index=True)
    payload_digest: Mapped[str] = mapped_column(String(64))


class IdempotencyRecord(Record, Base):
    __tablename__ = "idempotency_records"

    key: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    operation: Mapped[str] = mapped_column(String(100))
    response_reference: Mapped[str] = mapped_column(String(160))
