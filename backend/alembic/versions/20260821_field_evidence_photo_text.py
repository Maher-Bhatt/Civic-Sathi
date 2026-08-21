"""Allow real field evidence data URLs to be stored without truncation.

Revision ID: 20260821_field_evidence_photo_text
Revises: 20260820_password_reset
Create Date: 2026-08-21
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260821_field_evidence_photo_text"
down_revision: Union[str, None] = "20260820_password_reset"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {column["name"]: column for column in inspector.get_columns("field_evidence")}
    if "photo_url" not in columns:
        return

    # PostgreSQL safely widens varchar to text without changing existing values.
    op.alter_column(
        "field_evidence",
        "photo_url",
        existing_type=sa.String(length=1024),
        type_=sa.Text(),
        existing_nullable=False,
    )


def downgrade() -> None:
    raise RuntimeError("Downgrading field_evidence.photo_url would truncate stored evidence")
