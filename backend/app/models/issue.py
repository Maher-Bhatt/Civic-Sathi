"""Issue cluster and root cause models"""

from datetime import datetime
from sqlalchemy import String, Text, Integer, Float, ForeignKey, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin


class IssueCluster(Base, UUIDMixin, TimestampMixin):
    """Systemic issue cluster derived from complaint patterns"""
    
    __tablename__ = "issue_clusters"
    
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    department_id: Mapped[UUID] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
    ward_id: Mapped[UUID | None] = mapped_column(ForeignKey("wards.id"), index=True)
    city_id: Mapped[UUID] = mapped_column(ForeignKey("cities.id"), index=True, nullable=False)
    
    status: Mapped[str] = mapped_column(String(20), default="open", nullable=False, index=True)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    risk_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    complaint_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    centroid_lat: Mapped[float | None] = mapped_column(Float)
    centroid_lng: Mapped[float | None] = mapped_column(Float)
    
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    department: Mapped["Department"] = relationship("Department", lazy="joined")
    ward: Mapped["Ward"] = relationship("Ward", lazy="joined")
    root_causes: Mapped[list["RootCause"]] = relationship(
        "RootCause",
        back_populates="issue",
        cascade="all, delete-orphan"
    )
    recommendations: Mapped[list["Recommendation"]] = relationship(
        "Recommendation",
        back_populates="issue",
        cascade="all, delete-orphan"
    )
    
    __table_args__ = (
        Index("ix_issues_risk_status", "risk_level", "status"),
        Index("ix_issues_ward_category", "ward_id", "category"),
    )


class IssueComplaint(Base, TimestampMixin):
    """Many-to-many relationship between issues and complaints"""
    
    __tablename__ = "issue_complaints"
    
    issue_id: Mapped[UUID] = mapped_column(
        ForeignKey("issue_clusters.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )
    complaint_id: Mapped[UUID] = mapped_column(
        ForeignKey("complaints.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )
    
    similarity_score: Mapped[float | None] = mapped_column(Float)
    relationship_type: Mapped[str | None] = mapped_column(String(50))
    confidence_score: Mapped[float | None] = mapped_column(Float)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    __table_args__ = (
        Index("ix_issue_complaints_issue", "issue_id"),
        Index("ix_issue_complaints_complaint", "complaint_id"),
    )


class RootCause(Base, UUIDMixin, TimestampMixin):
    """Probable root cause analysis for systemic issues"""
    
    __tablename__ = "root_causes"
    
    issue_id: Mapped[UUID] = mapped_column(
        ForeignKey("issue_clusters.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    cause_type: Mapped[str] = mapped_column(String(50), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_json: Mapped[dict | None] = mapped_column(JSONB)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    
    # Relationships
    issue: Mapped["IssueCluster"] = relationship("IssueCluster", back_populates="root_causes")
