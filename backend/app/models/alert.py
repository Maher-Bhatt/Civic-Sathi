"""Alert model for dashboard notifications"""

from sqlalchemy import String, Text, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base, UUIDMixin, TimestampMixin


class Alert(Base, UUIDMixin, TimestampMixin):
    """Alert notifications for the officer dashboard"""
    
    __tablename__ = "alerts"
    
    issue_id: Mapped[UUID | None] = mapped_column(ForeignKey("issue_clusters.id"), index=True)
    
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    
    __table_args__ = (
        Index("ix_alerts_unread", "is_read", "created_at"),
    )
