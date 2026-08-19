"""Add civic reputation and impact domain tables.

Revision ID: 20260819_civic_reputation
Revises: 326bdd8f9ffc
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect
from sqlalchemy.dialects import postgresql


revision: str = "20260819_civic_reputation"
down_revision: Union[str, None] = "326bdd8f9ffc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _uuid(name: str, fk: str | None = None, nullable: bool = False):
    return sa.Column(name, postgresql.UUID(as_uuid=True), sa.ForeignKey(fk, ondelete="CASCADE") if fk else None, nullable=nullable)


def _timestamps():
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    ]


def upgrade() -> None:
    # The application previously used Base.metadata.create_all() at startup.
    # If that path already materialized the reputation schema, record this
    # revision as applied without attempting duplicate CREATE TABLE statements.
    if sa_inspect(op.get_bind()).has_table("civic_profiles"):
        return

    op.create_table(
        "civic_profiles",
        _uuid("id"),
        _uuid("user_id", "users.id"),
        sa.Column("xp_total", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("impact_score", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("reputation_score", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("level", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("display_mode", sa.String(20), nullable=False, server_default="initials"),
        sa.Column("leaderboard_opt_in", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("sharing_opt_in", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("animation_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("reward_notifications_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("streak_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_meaningful_activity_at", sa.DateTime(timezone=True)),
        *_timestamps(),
        sa.UniqueConstraint("user_id", name="uq_civic_profiles_user"),
    )
    op.create_index("ix_civic_profiles_user_id", "civic_profiles", ["user_id"])

    op.create_table(
        "civic_xp_transactions",
        _uuid("id"),
        _uuid("user_id", "users.id"),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("action", sa.String(60), nullable=False),
        sa.Column("reason", sa.String(255), nullable=False),
        sa.Column("source_type", sa.String(60), nullable=False),
        sa.Column("source_id", sa.String(100)),
        sa.Column("idempotency_key", sa.String(180), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="granted"),
        sa.Column("verification_status", sa.String(30), nullable=False, server_default="verified"),
        sa.Column("metadata_json", postgresql.JSONB),
        sa.Column("at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("idempotency_key", name="uq_civic_xp_idempotency"),
    )
    op.create_index("ix_civic_xp_user_at", "civic_xp_transactions", ["user_id", "at"])
    op.create_index("ix_civic_xp_source", "civic_xp_transactions", ["source_type", "source_id"])

    op.create_table(
        "civic_impact_events",
        _uuid("id"),
        _uuid("user_id", "users.id"),
        sa.Column("city_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cities.id", ondelete="SET NULL")),
        sa.Column("event_type", sa.String(60), nullable=False),
        sa.Column("impact_points", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("source_type", sa.String(60), nullable=False),
        sa.Column("source_id", sa.String(100)),
        sa.Column("idempotency_key", sa.String(180), nullable=False),
        sa.Column("verification_status", sa.String(30), nullable=False, server_default="verified"),
        sa.Column("metadata_json", postgresql.JSONB),
        sa.Column("at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("idempotency_key", name="uq_civic_impact_idempotency"),
    )
    op.create_index("ix_civic_impact_city_at", "civic_impact_events", ["city_id", "at"])

    op.create_table(
        "civic_achievements",
        _uuid("id"),
        sa.Column("code", sa.String(80), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("role", sa.String(30)),
        sa.Column("city_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cities.id", ondelete="SET NULL")),
        sa.Column("criteria_json", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_timestamps(),
        sa.UniqueConstraint("code", name="uq_civic_achievements_code"),
    )

    op.create_table(
        "civic_user_achievements",
        _uuid("id"),
        _uuid("user_id", "users.id"),
        sa.Column("achievement_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("civic_achievements.id", ondelete="CASCADE"), nullable=False),
        sa.Column("source_event_id", sa.String(100)),
        sa.Column("awarded_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        sa.UniqueConstraint("user_id", "achievement_id", name="uq_civic_user_achievement"),
    )

    op.create_table(
        "civic_missions",
        _uuid("id"),
        sa.Column("code", sa.String(80), nullable=False),
        sa.Column("title", sa.String(160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("city_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("cities.id", ondelete="SET NULL")),
        sa.Column("category", sa.String(60)),
        sa.Column("criteria_json", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("xp_reward", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("starts_at", sa.DateTime(timezone=True)),
        sa.Column("ends_at", sa.DateTime(timezone=True)),
        *_timestamps(),
        sa.UniqueConstraint("code", name="uq_civic_missions_code"),
    )

    op.create_table(
        "civic_mission_progress",
        _uuid("id"),
        _uuid("mission_id", "civic_missions.id"),
        _uuid("user_id", "users.id"),
        sa.Column("progress_value", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("target_value", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        *_timestamps(),
        sa.UniqueConstraint("mission_id", "user_id", name="uq_civic_mission_user"),
    )

    op.create_table(
        "civic_reward_configs",
        _uuid("id"),
        sa.Column("key", sa.String(100), nullable=False),
        sa.Column("value_json", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("updated_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL")),
        *_timestamps(),
        sa.UniqueConstraint("key", name="uq_civic_reward_configs_key"),
    )

    op.create_table(
        "civic_reputation_flags",
        _uuid("id"),
        _uuid("user_id", "users.id"),
        sa.Column("reason", sa.String(160), nullable=False),
        sa.Column("severity", sa.String(20), nullable=False, server_default="low"),
        sa.Column("source_type", sa.String(60)),
        sa.Column("source_id", sa.String(100)),
        sa.Column("signals_json", postgresql.JSONB()),
        sa.Column("status", sa.String(20), nullable=False, server_default="open"),
        sa.Column("reviewed_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("review_reason", sa.Text()),
        *_timestamps(),
    )


def downgrade() -> None:
    op.drop_table("civic_reputation_flags")
    op.drop_table("civic_reward_configs")
    op.drop_table("civic_mission_progress")
    op.drop_table("civic_missions")
    op.drop_table("civic_user_achievements")
    op.drop_table("civic_achievements")
    op.drop_table("civic_impact_events")
    op.drop_table("civic_xp_transactions")
    op.drop_table("civic_profiles")
