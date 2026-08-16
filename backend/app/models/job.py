"""Analysis Job model for async processing"""

from datetime import datetime
from sqlalchemy import String, Integer, Text, ForeignKey, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base, UUIDMixin, TimestampMixin


class AnalysisJob(Base, UUIDMixin, TimestampMixin):
    """Background job for complaint ML analysis"""
    
    __tablename__ = "analysis_jobs"
    
    job_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    complaint_id: Mapped[UUID] = mapped_column(
        ForeignKey("complaints.id", ondelete="CASCADE"), 
        nullable=False, 
        index=True
    )
    
    status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False, index=True)
    attempt_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    available_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    
    last_error: Mapped[str | None] = mapped_column(Text)
    
    # Relationships
    complaint: Mapped["Complaint"] = relationship("Complaint", lazy="selectin")
    
    __table_args__ = (
        Index("ix_analysis_jobs_status_available", "status", "available_at"),
    )
