"""Complaint and ComplaintAnalysis models"""

from sqlalchemy import String, Text, Integer, Float, ForeignKey, Index, Sequence, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin
from app.models.procurement import City
from datetime import datetime


class Complaint(Base, UUIDMixin, TimestampMixin):
    """Complaint model for citizen reports"""
    
    __tablename__ = "complaints"
    
    # Sequence-backed public ID number (used to generate JN-YYYY-NNNNN)
    public_id_seq: Mapped[int] = mapped_column(
        Integer,
        Sequence("complaint_public_seq", start=1),
        nullable=False,
        unique=True,
        index=True
    )
    public_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    department_id: Mapped[UUID] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
    city_id: Mapped[UUID] = mapped_column(ForeignKey("cities.id"), index=True, nullable=False)
    
    status: Mapped[str] = mapped_column(String(20), default="received", nullable=False, index=True)
    assigned_officer_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id"), index=True)
    assigned_officer_name: Mapped[str | None] = mapped_column(String(255))
    assigned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    assignment_notes: Mapped[str | None] = mapped_column(Text)
    rejection_reason: Mapped[str | None] = mapped_column(Text)
    rejected_by_name: Mapped[str | None] = mapped_column(String(255))
    rejected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    timeline_json: Mapped[list | None] = mapped_column(JSONB)
    priority: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    
    severity_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    risk_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    ward_id: Mapped[UUID | None] = mapped_column(ForeignKey("wards.id"), index=True)
    lat: Mapped[float | None] = mapped_column(Float)
    lng: Mapped[float | None] = mapped_column(Float)
    address_text: Mapped[str | None] = mapped_column(Text)
    
    submitted_by_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id"))
    submitted_by_name: Mapped[str | None] = mapped_column(String(100))
    submitted_by_phone: Mapped[str | None] = mapped_column(String(20))
    
    source: Mapped[str] = mapped_column(String(20), default="web", nullable=False)
    
    # Relationships
    department: Mapped["Department"] = relationship("Department", lazy="joined")
    ward: Mapped["Ward"] = relationship("Ward", lazy="joined")
    analysis: Mapped["ComplaintAnalysis"] = relationship(
        "ComplaintAnalysis",
        back_populates="complaint",
        foreign_keys="ComplaintAnalysis.complaint_id",
        uselist=False,
        lazy="selectin"
    )
    
    __table_args__ = (
        Index("ix_complaints_ward_category", "ward_id", "category"),
        Index("ix_complaints_status_priority", "status", "priority"),
        Index("ix_complaints_created_at", "created_at"),
    )


class ComplaintAnalysis(Base, UUIDMixin, TimestampMixin):
    """AI/ML analysis output for each complaint"""
    
    __tablename__ = "complaint_analysis"
    
    complaint_id: Mapped[UUID] = mapped_column(
        ForeignKey("complaints.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    
    language: Mapped[str | None] = mapped_column(String(10))
    cleaned_text: Mapped[str | None] = mapped_column(Text)
    
    entities_json: Mapped[dict | None] = mapped_column(JSONB)
    sentiment_score: Mapped[float | None] = mapped_column(Float)
    keywords_json: Mapped[list | None] = mapped_column(JSONB)
    
    embedding_model: Mapped[str | None] = mapped_column(String(100))
    embedding_vector: Mapped[list | None] = mapped_column(JSONB)
    
    duplicate_of_id: Mapped[UUID | None] = mapped_column(ForeignKey("complaints.id"))
    confidence_score: Mapped[float | None] = mapped_column(Float)
    
    duplicate_score: Mapped[float | None] = mapped_column(Float)
    spam_score: Mapped[float | None] = mapped_column(Float)
    candidate_issue_id: Mapped[UUID | None] = mapped_column(ForeignKey("issue_clusters.id"))
    ai_status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False)
    
    # Relationships
    complaint: Mapped["Complaint"] = relationship(
        "Complaint",
        back_populates="analysis",
        foreign_keys=[complaint_id]
    )
    duplicate_of: Mapped["Complaint"] = relationship(
        "Complaint",
        foreign_keys=[duplicate_of_id],
        remote_side="Complaint.id",
        uselist=False
    )
