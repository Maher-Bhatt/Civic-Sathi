"""Civic reputation, impact, achievement, mission, and trust-and-safety models."""

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin, TimestampMixin


class CivicProfile(Base, UUIDMixin, TimestampMixin):
    """One privacy-aware progress profile per platform user."""

    __tablename__ = "civic_profiles"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    xp_total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    impact_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    reputation_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    display_mode: Mapped[str] = mapped_column(String(20), nullable=False, default="initials")
    leaderboard_opt_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sharing_opt_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    animation_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    reward_notifications_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    streak_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_meaningful_activity_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class XPTransaction(Base, UUIDMixin):
    """Immutable, idempotent, explainable XP grant or reversal."""

    __tablename__ = "civic_xp_transactions"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    action: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    source_id: Mapped[str | None] = mapped_column(String(100), index=True)
    idempotency_key: Mapped[str] = mapped_column(String(180), nullable=False, unique=True, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="granted", index=True)
    verification_status: Mapped[str] = mapped_column(String(30), nullable=False, default="verified")
    metadata_json: Mapped[dict | None] = mapped_column(JSON)
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True)


class CivicImpactEvent(Base, UUIDMixin):
    """Outcome-weighted civic impact separate from activity XP."""

    __tablename__ = "civic_impact_events"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id: Mapped[UUID | None] = mapped_column(ForeignKey("cities.id", ondelete="SET NULL"), index=True)
    event_type: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    impact_points: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    source_type: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    source_id: Mapped[str | None] = mapped_column(String(100), index=True)
    idempotency_key: Mapped[str] = mapped_column(String(180), nullable=False, unique=True, index=True)
    verification_status: Mapped[str] = mapped_column(String(30), nullable=False, default="verified")
    metadata_json: Mapped[dict | None] = mapped_column(JSON)
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True)


class CivicAchievement(Base, UUIDMixin, TimestampMixin):
    """Centralized, admin-activatable achievement catalog."""

    __tablename__ = "civic_achievements"

    code: Mapped[str] = mapped_column(String(80), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str | None] = mapped_column(String(30), index=True)
    city_id: Mapped[UUID | None] = mapped_column(ForeignKey("cities.id", ondelete="SET NULL"), index=True)
    criteria_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)


class UserAchievement(Base, UUIDMixin):
    """Achievement award with revocation and source traceability."""

    __tablename__ = "civic_user_achievements"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id: Mapped[UUID] = mapped_column(ForeignKey("civic_achievements.id", ondelete="CASCADE"), nullable=False, index=True)
    source_event_id: Mapped[str | None] = mapped_column(String(100), index=True)
    awarded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (UniqueConstraint("user_id", "achievement_id", name="uq_civic_user_achievement"),)


class CivicMission(Base, UUIDMixin, TimestampMixin):
    """Optional mission tied to a real civic need or city aggregate."""

    __tablename__ = "civic_missions"

    code: Mapped[str] = mapped_column(String(80), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    city_id: Mapped[UUID | None] = mapped_column(ForeignKey("cities.id", ondelete="SET NULL"), index=True)
    category: Mapped[str | None] = mapped_column(String(60), index=True)
    criteria_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    xp_reward: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class MissionProgress(Base, UUIDMixin, TimestampMixin):
    """Per-user mission progress with a single completion reward."""

    __tablename__ = "civic_mission_progress"

    mission_id: Mapped[UUID] = mapped_column(ForeignKey("civic_missions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    progress_value: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    target_value: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (UniqueConstraint("mission_id", "user_id", name="uq_civic_mission_user"),)


class CivicRewardConfig(Base, UUIDMixin, TimestampMixin):
    """Versioned admin-editable reward, level, and anti-abuse configuration."""

    __tablename__ = "civic_reward_configs"

    key: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    value_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    updated_by_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))


class CivicReputationFlag(Base, UUIDMixin, TimestampMixin):
    """Reviewable trust-and-safety signal; not an automatic punishment record."""

    __tablename__ = "civic_reputation_flags"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    reason: Mapped[str] = mapped_column(String(160), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="low", index=True)
    source_type: Mapped[str | None] = mapped_column(String(60), index=True)
    source_id: Mapped[str | None] = mapped_column(String(100), index=True)
    signals_json: Mapped[dict | None] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="open", index=True)
    reviewed_by_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    review_reason: Mapped[str | None] = mapped_column(Text)


Index("ix_civic_xp_user_at", XPTransaction.user_id, XPTransaction.at)
Index("ix_civic_impact_city_at", CivicImpactEvent.city_id, CivicImpactEvent.at)
