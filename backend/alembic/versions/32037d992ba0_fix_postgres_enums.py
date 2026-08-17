"""fix_postgres_enums

Revision ID: 32037d992ba0
Revises: 028d201305f6
Create Date: 2026-08-17 18:04:14.958875

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '32037d992ba0'
down_revision: Union[str, None] = '028d201305f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE registrationstatus ADD VALUE IF NOT EXISTS 'REJECTED'")
        op.execute("ALTER TYPE workorderstatus ADD VALUE IF NOT EXISTS 'INSPECTION_FAILED'")
        op.execute("ALTER TYPE workorderstatus ADD VALUE IF NOT EXISTS 'REWORK'")
        op.execute("ALTER TYPE workorderstatus ADD VALUE IF NOT EXISTS 'CANCELLED'")


def downgrade() -> None:
    # Postgres doesn't support DROP VALUE easily, so downgrade does nothing for enums
    pass
