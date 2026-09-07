"""Add civic_cases and case_departments for multi-department orchestration

Revision ID: 20260822_master_case_routing
Revises: 20260821_evidence_photo_text
Create Date: 2026-08-22
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260822_master_case_routing"
down_revision: Union[str, None] = "20260821_evidence_photo_text"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    # 1. Create civic_cases table
    if "civic_cases" not in tables:
        op.create_table(
            "civic_cases",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("case_number", sa.String(length=64), nullable=False, unique=True),
            sa.Column("citizen_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("title", sa.String(length=255), nullable=False),
            sa.Column("description", sa.Text(), nullable=False),
            sa.Column("latitude", sa.Float(), nullable=True),
            sa.Column("longitude", sa.Float(), nullable=True),
            sa.Column("address_text", sa.Text(), nullable=True),
            sa.Column("city_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cities.id"), nullable=True),
            sa.Column("ward_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("wards.id"), nullable=True),
            sa.Column("severity", sa.String(length=20), nullable=False, server_default="MEDIUM"),
            sa.Column("priority", sa.String(length=10), nullable=False, server_default="P3"),
            sa.Column("root_cause", sa.Text(), nullable=True),
            sa.Column("preventive_warning", sa.Text(), nullable=True),
            sa.Column("action_plan_summary", sa.Text(), nullable=True),
            sa.Column("status", sa.String(length=30), nullable=False, server_default="SUBMITTED"),
            sa.Column("estimated_total_sla_hours", sa.Integer(), nullable=False, server_default="48"),
            sa.Column("photo_url", sa.Text(), nullable=True),
            sa.Column("timeline_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
            sa.Column("metadata_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_civic_cases_case_number", "civic_cases", ["case_number"], unique=True)
        op.create_index("ix_civic_cases_citizen_id", "civic_cases", ["citizen_id"])
        op.create_index("ix_civic_cases_city_id", "civic_cases", ["city_id"])
        op.create_index("ix_civic_cases_ward_id", "civic_cases", ["ward_id"])
        op.create_index("ix_civic_cases_status_priority", "civic_cases", ["status", "priority"])
        op.create_index("ix_civic_cases_city_created", "civic_cases", ["city_id", "created_at"])

    # 2. Create case_departments table
    if "case_departments" not in tables:
        op.create_table(
            "case_departments",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("case_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("civic_cases.id", ondelete="CASCADE"), nullable=False),
            sa.Column("department_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("departments.id"), nullable=True),
            sa.Column("department_name", sa.String(length=100), nullable=False),
            sa.Column("department_code", sa.String(length=50), nullable=False),
            sa.Column("external_system_key", sa.String(length=50), nullable=True),
            sa.Column("external_ticket_id", sa.String(length=64), nullable=True),
            sa.Column("sequence_order", sa.Integer(), nullable=False, server_default="1"),
            sa.Column("dependency_case_dept_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("case_departments.id"), nullable=True),
            sa.Column("dependency_note", sa.Text(), nullable=True),
            sa.Column("status", sa.String(length=30), nullable=False, server_default="WAITING"),
            sa.Column("action_required", sa.Text(), nullable=True),
            sa.Column("sla_hours", sa.Integer(), nullable=False, server_default="24"),
            sa.Column("sla_deadline", sa.DateTime(timezone=True), nullable=True),
            sa.Column("assigned_officer_name", sa.String(length=100), nullable=True),
            sa.Column("assigned_officer_phone", sa.String(length=20), nullable=True),
            sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("completion_evidence_url", sa.Text(), nullable=True),
            sa.Column("completion_notes", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_case_departments_case_id", "case_departments", ["case_id"])
        op.create_index("ix_case_departments_department_id", "case_departments", ["department_id"])
        op.create_index("ix_case_departments_department_code", "case_departments", ["department_code"])
        op.create_index("ix_case_departments_external_ticket_id", "case_departments", ["external_ticket_id"])
        op.create_index("ix_case_departments_dependency_id", "case_departments", ["dependency_case_dept_id"])
        op.create_index("ix_case_departments_status", "case_departments", ["status"])


def downgrade() -> None:
    op.drop_table("case_departments")
    op.drop_table("civic_cases")
