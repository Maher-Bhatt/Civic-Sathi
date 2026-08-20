"""add password reset otp state

Revision ID: 20260820_password_reset
Revises: 20260820_cleanup_sih_demo_company
Create Date: 2026-08-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260820_password_reset"
down_revision: Union[str, None] = "20260820_cleanup_sih_demo_company"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {column["name"] for column in inspector.get_columns("users")}
    definitions = {
        "reset_otp_hash": sa.Column("reset_otp_hash", sa.String(length=128), nullable=True),
        "reset_otp_expires_at": sa.Column("reset_otp_expires_at", sa.DateTime(timezone=True), nullable=True),
        "reset_otp_attempts": sa.Column("reset_otp_attempts", sa.Integer(), nullable=False, server_default="0"),
        "reset_otp_channel": sa.Column("reset_otp_channel", sa.String(length=16), nullable=True),
        "reset_otp_requested_at": sa.Column("reset_otp_requested_at", sa.DateTime(timezone=True), nullable=True),
    }
    for name, column in definitions.items():
        if name not in columns:
            op.add_column("users", column)


def downgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in sa.inspect(bind).get_columns("users")}
    for name in ("reset_otp_requested_at", "reset_otp_channel", "reset_otp_attempts", "reset_otp_expires_at", "reset_otp_hash"):
        if name in columns:
            op.drop_column("users", name)
            columns.remove(name)
