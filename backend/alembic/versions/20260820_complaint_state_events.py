"""Persist complaint rejection metadata and operational timeline events.

Revision ID: 20260820_complaint_state_events
Revises: 20260819_civic_reputation
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260820_complaint_state_events"
down_revision: Union[str, None] = "20260819_civic_reputation"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("complaints", sa.Column("rejection_reason", sa.Text(), nullable=True))
    op.add_column("complaints", sa.Column("rejected_by_name", sa.String(length=255), nullable=True))
    op.add_column("complaints", sa.Column("rejected_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("complaints", sa.Column("timeline_json", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    op.drop_column("complaints", "timeline_json")
    op.drop_column("complaints", "rejected_at")
    op.drop_column("complaints", "rejected_by_name")
    op.drop_column("complaints", "rejection_reason")
