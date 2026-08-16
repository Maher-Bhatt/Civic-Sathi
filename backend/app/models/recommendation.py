"""Recommendation model for officer actions"""

from sqlalchemy import String, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin


class Recommendation(Base, UUIDMixin, TimestampMixin):
    """Action recommendations for systemic issues"""
    
    __tablename__ = "recommendations"
    
    issue_id: Mapped[UUID] = mapped_column(
        ForeignKey("issue_clusters.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False)
    priority: Mapped[str] = mapped_column(String(20), nullable=False)
    
    effort_level: Mapped[str | None] = mapped_column(String(20))
    expected_impact: Mapped[str | None] = mapped_column(String(20))
    
    steps_json: Mapped[list | None] = mapped_column(JSONB)
    
    # Relationships
    issue: Mapped["IssueCluster"] = relationship("IssueCluster", back_populates="recommendations")
