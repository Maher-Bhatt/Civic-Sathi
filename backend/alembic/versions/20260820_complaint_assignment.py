"""Persist complaint officer assignment metadata.

Revision ID: 20260820_complaint_assignment
Revises: 20260820_complaint_state_events
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect
from sqlalchemy.dialects import postgresql


revision: str = "20260820_complaint_assignment"
down_revision: Union[str, None] = "20260820_complaint_state_events"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa_inspect(bind)
    existing_columns = {column["name"] for column in inspector.get_columns("complaints")}
    if "assigned_officer_id" not in existing_columns:
        op.add_column(
            "complaints",
            sa.Column(
                "assigned_officer_id",
                postgresql.UUID(as_uuid=True),
                sa.ForeignKey("users.id"),
                nullable=True,
            ),
        )
    if "assigned_officer_name" not in existing_columns:
        op.add_column("complaints", sa.Column("assigned_officer_name", sa.String(length=255), nullable=True))
    if "assigned_at" not in existing_columns:
        op.add_column("complaints", sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=True))
    if "assignment_notes" not in existing_columns:
        op.add_column("complaints", sa.Column("assignment_notes", sa.Text(), nullable=True))

    indexes = {index["name"] for index in inspector.get_indexes("complaints")}
    if "ix_complaints_assigned_officer_id" not in indexes:
        op.create_index("ix_complaints_assigned_officer_id", "complaints", ["assigned_officer_id"])


def downgrade() -> None:
    bind = op.get_bind()
    indexes = {index["name"] for index in sa_inspect(bind).get_indexes("complaints")}
    if "ix_complaints_assigned_officer_id" in indexes:
        op.drop_index("ix_complaints_assigned_officer_id", table_name="complaints")
    for column in ("assignment_notes", "assigned_at", "assigned_officer_name", "assigned_officer_id"):
        if column in {item["name"] for item in sa_inspect(bind).get_columns("complaints")}:
            op.drop_column("complaints", column)
