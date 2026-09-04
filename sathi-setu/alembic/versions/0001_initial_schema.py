"""Initial Sathi Setu schema.

Creates all 10 tables for the Sathi Setu interoperability service:
external_systems, connector_configs, identities, identity_links, consents,
unified_applications, events, data_quality_issues, audit_entries, and
idempotency_records.

This migration targets the dedicated Sathi Setu database.  It never
references Civic Sathi tables or migrations.

Revision ID: 0001
Revises: (none — initial)
Create Date: 2026-09-04
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "external_systems",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("key", sa.String(80), nullable=False, unique=True),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("classification", sa.String(32), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="SANDBOX"),
        sa.Column("description", sa.Text, nullable=False),
    )
    op.create_index("ix_external_systems_key", "external_systems", ["key"])

    op.create_table(
        "connector_configs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("system_id", sa.String(36), sa.ForeignKey("external_systems.id"), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("version", sa.Integer, nullable=False, server_default="1"),
        sa.Column("field_mapping", sa.JSON, nullable=False),
        sa.Column("enabled", sa.Boolean, nullable=False, server_default="true"),
        sa.UniqueConstraint("system_id", "version", name="uq_connector_system_version"),
    )
    op.create_index("ix_connector_configs_system_id", "connector_configs", ["system_id"])

    op.create_table(
        "identities",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("canonical_id", sa.String(32), nullable=False, unique=True),
        sa.Column("display_name", sa.String(160), nullable=False),
        sa.Column("contact_fingerprint", sa.String(128), nullable=True),
        sa.Column("email_normalized", sa.String(254), nullable=True),
        sa.Column("match_status", sa.String(32), nullable=False, server_default="VERIFIED_DEMO"),
    )
    op.create_index("ix_identities_canonical_id", "identities", ["canonical_id"])
    op.create_index("ix_identities_contact_fingerprint", "identities", ["contact_fingerprint"])
    op.create_index("ix_identities_email_normalized", "identities", ["email_normalized"])

    op.create_table(
        "identity_links",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("identity_id", sa.String(36), sa.ForeignKey("identities.id"), nullable=False),
        sa.Column("system_id", sa.String(36), sa.ForeignKey("external_systems.id"), nullable=False),
        sa.Column("source_identity_id", sa.String(160), nullable=False),
        sa.Column("confidence", sa.Float, nullable=False),
        sa.Column("reason", sa.Text, nullable=False),
        sa.UniqueConstraint("system_id", "source_identity_id", name="uq_identity_source_link"),
    )
    op.create_index("ix_identity_links_identity_id", "identity_links", ["identity_id"])
    op.create_index("ix_identity_links_system_id", "identity_links", ["system_id"])

    op.create_table(
        "consents",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("identity_id", sa.String(36), sa.ForeignKey("identities.id"), nullable=False),
        sa.Column("source_system_id", sa.String(36), sa.ForeignKey("external_systems.id"), nullable=False),
        sa.Column("target_system_id", sa.String(36), sa.ForeignKey("external_systems.id"), nullable=False),
        sa.Column("purpose", sa.String(200), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="PENDING"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("granted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_consents_identity_id", "consents", ["identity_id"])

    op.create_table(
        "unified_applications",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("unified_id", sa.String(32), nullable=False, unique=True),
        sa.Column("identity_id", sa.String(36), sa.ForeignKey("identities.id"), nullable=False),
        sa.Column("service_type", sa.String(100), nullable=False),
        sa.Column("status", sa.String(80), nullable=False),
        sa.Column("summary", sa.Text, nullable=False),
        sa.Column("source_records", sa.JSON, nullable=False),
    )
    op.create_index("ix_unified_applications_unified_id", "unified_applications", ["unified_id"])
    op.create_index("ix_unified_applications_identity_id", "unified_applications", ["identity_id"])

    op.create_table(
        "events",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("event_type", sa.String(80), nullable=False),
        sa.Column("unified_application_id", sa.String(36), sa.ForeignKey("unified_applications.id"), nullable=True),
        sa.Column("source_system_id", sa.String(36), sa.ForeignKey("external_systems.id"), nullable=False),
        sa.Column("target_system_id", sa.String(36), sa.ForeignKey("external_systems.id"), nullable=True),
        sa.Column("correlation_id", sa.String(100), nullable=False),
        sa.Column("payload", sa.JSON, nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_events_event_type", "events", ["event_type"])
    op.create_index("ix_events_correlation_id", "events", ["correlation_id"])

    op.create_table(
        "data_quality_issues",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("issue_type", sa.String(80), nullable=False),
        sa.Column("severity", sa.String(32), nullable=False, server_default="MEDIUM"),
        sa.Column("status", sa.String(32), nullable=False, server_default="OPEN"),
        sa.Column("identity_id", sa.String(36), sa.ForeignKey("identities.id"), nullable=True),
        sa.Column("details", sa.JSON, nullable=False),
        sa.Column("resolution", sa.Text, nullable=True),
    )

    op.create_table(
        "audit_entries",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("actor", sa.String(160), nullable=False),
        sa.Column("action", sa.String(120), nullable=False),
        sa.Column("resource_type", sa.String(80), nullable=False),
        sa.Column("resource_id", sa.String(160), nullable=False),
        sa.Column("correlation_id", sa.String(100), nullable=False),
        sa.Column("payload_digest", sa.String(64), nullable=False),
    )
    op.create_index("ix_audit_entries_action", "audit_entries", ["action"])
    op.create_index("ix_audit_entries_correlation_id", "audit_entries", ["correlation_id"])

    op.create_table(
        "idempotency_records",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("key", sa.String(160), nullable=False, unique=True),
        sa.Column("operation", sa.String(100), nullable=False),
        sa.Column("response_reference", sa.String(160), nullable=False),
    )
    op.create_index("ix_idempotency_records_key", "idempotency_records", ["key"])


def downgrade() -> None:
    op.drop_table("idempotency_records")
    op.drop_table("audit_entries")
    op.drop_table("data_quality_issues")
    op.drop_table("events")
    op.drop_table("unified_applications")
    op.drop_table("consents")
    op.drop_table("identity_links")
    op.drop_table("identities")
    op.drop_table("connector_configs")
    op.drop_table("external_systems")
