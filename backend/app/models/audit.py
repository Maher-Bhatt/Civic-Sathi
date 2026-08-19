from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin


class ModelRun(Base, UUIDMixin, TimestampMixin):
    """Track ML/AI model execution for audit and debugging."""

    __tablename__ = "model_runs"

    run_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)

    input_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    output_summary_json: Mapped[dict | None] = mapped_column(JSONB)

    duration_ms: Mapped[int | None] = mapped_column(Integer)
    error_message: Mapped[str | None] = mapped_column(Text)


class AuditLog(Base, UUIDMixin):
    """Immutable administrative and operational action record."""

    __tablename__ = "platform_audit_logs"

    actor_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    actor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    actor_role: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_label: Mapped[str | None] = mapped_column(String(255))
    previous_value: Mapped[str | None] = mapped_column(Text)
    new_value: Mapped[str | None] = mapped_column(Text)
    reason: Mapped[str | None] = mapped_column(Text)
    at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )
