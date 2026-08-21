"""Procurement, Bidding, and Work Order Models"""

from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
import enum

from app.models.base import Base, UUIDMixin, TimestampMixin


class City(Base, UUIDMixin, TimestampMixin):
    """City representation for multitenancy and isolation"""
    __tablename__ = "cities"
    
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    state_code: Mapped[str] = mapped_column(String(10), nullable=False)


class Contractor(Base, UUIDMixin, TimestampMixin):
    """Contractor company representing a business entity"""
    __tablename__ = "contractors"
    
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_person: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(20), index=True)
    auth_user_id: Mapped[str | None] = mapped_column(String(50), index=True) # ID of user that logs in
    
    # 3-Dimensional Tri-Party Performance Ratings (1.0 - 5.0)
    public_rating: Mapped[float | None] = mapped_column(Float, nullable=True)     # Citizen feedback rating
    ai_rating: Mapped[float | None] = mapped_column(Float, nullable=True)         # AI Algorithmic SLA & Quality Audit
    officer_rating: Mapped[float | None] = mapped_column(Float, nullable=True)    # Municipal Engineer Inspection Score
    total_reviews_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    ai_insights: Mapped[list[str] | None] = mapped_column(JSONB)        # AI-generated performance strengths & recommendations


class RegistrationStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REVOKED = "REVOKED"
    REJECTED = "REJECTED"


class ContractorCityRegistration(Base, UUIDMixin, TimestampMixin):
    """City-specific eligibility and registration for a contractor"""
    __tablename__ = "contractor_city_registrations"
    
    contractor_id = mapped_column(ForeignKey("contractors.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = mapped_column(ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    
    registration_number: Mapped[str] = mapped_column(String(100), nullable=False)
    registration_class: Mapped[str] = mapped_column(String(50))
    status: Mapped[RegistrationStatus] = mapped_column(Enum(RegistrationStatus), default=RegistrationStatus.PENDING)
    approved_categories: Mapped[list[str] | None] = mapped_column(JSONB) # List of category strings
    
    current_risk_level: Mapped[str] = mapped_column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL


class TenderStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CLOSED = "CLOSED"
    EVALUATING = "EVALUATING"
    AWARDED = "AWARDED"
    CANCELLED = "CANCELLED"


class Tender(Base, UUIDMixin, TimestampMixin):
    """Municipal Procurement Opportunity"""
    __tablename__ = "tenders"
    
    city_id = mapped_column(ForeignKey("cities.id"), nullable=False, index=True)
    department_id = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
    civic_issue_id = mapped_column(ForeignKey("issue_clusters.id"), nullable=True) # Linked to public issue cluster if any
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    scope_of_work: Mapped[str | None] = mapped_column(Text)
    estimated_budget: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[TenderStatus] = mapped_column(Enum(TenderStatus), default=TenderStatus.DRAFT, index=True)
    
    published_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
    closed_at: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))


class BidStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    QUALIFIED = "QUALIFIED"
    REJECTED = "REJECTED"
    WON = "WON"


class Bid(Base, UUIDMixin, TimestampMixin):
    """Contractor's sealed bid for a tender"""
    __tablename__ = "bids"
    
    tender_id = mapped_column(ForeignKey("tenders.id"), nullable=False, index=True)
    contractor_id = mapped_column(ForeignKey("contractors.id"), nullable=False, index=True)
    
    quoted_amount: Mapped[float] = mapped_column(Float, nullable=False)
    technical_proposal: Mapped[str | None] = mapped_column(Text)
    status: Mapped[BidStatus] = mapped_column(Enum(BidStatus), default=BidStatus.SUBMITTED, index=True)


class WorkOrderStatus(str, enum.Enum):
    ISSUED = "ISSUED"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    INSPECTION_PENDING = "INSPECTION_PENDING"
    INSPECTION_FAILED = "INSPECTION_FAILED"
    REWORK = "REWORK"
    COMPLETED = "COMPLETED"
    CLOSED = "CLOSED"
    CANCELLED = "CANCELLED"


class WorkOrder(Base, UUIDMixin, TimestampMixin):
    """Execution contract awarded to a contractor"""
    __tablename__ = "work_orders"
    
    tender_id = mapped_column(ForeignKey("tenders.id"), nullable=False, index=True)
    bid_id = mapped_column(ForeignKey("bids.id"), nullable=False)
    contractor_id = mapped_column(ForeignKey("contractors.id"), nullable=False, index=True)
    
    award_value: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[WorkOrderStatus] = mapped_column(Enum(WorkOrderStatus), default=WorkOrderStatus.ISSUED, index=True)
    target_completion_date: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True))
    
    # Advanced Governance & Performance Tracking
    planned_progress_pct: Mapped[float] = mapped_column(Float, default=0.0)
    reported_progress_pct: Mapped[float] = mapped_column(Float, default=0.0)
    verified_progress_pct: Mapped[float] = mapped_column(Float, default=0.0)
    
    risk_level: Mapped[str] = mapped_column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    risk_reasons: Mapped[list[str] | None] = mapped_column(JSONB)
    
    defect_liability_period_days: Mapped[int] = mapped_column(Integer, default=365)
    liquidated_damages_pct_per_day: Mapped[float] = mapped_column(Float, default=0.0)


class FieldEvidence(Base, UUIDMixin, TimestampMixin):
    """Proof of work uploaded by contractor"""
    __tablename__ = "field_evidence"
    
    work_order_id = mapped_column(ForeignKey("work_orders.id"), nullable=False, index=True)
    photo_url: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)


class ReviewAuthorType(str, enum.Enum):
    PUBLIC = "PUBLIC"       # Citizen rating
    AI = "AI"               # Automated AI audit
    OFFICER = "OFFICER"     # Municipal engineering inspection


class ContractorReview(Base, UUIDMixin, TimestampMixin):
    """Tri-Party Rating and Review on a contractor's civic execution"""
    __tablename__ = "contractor_reviews"
    
    contractor_id = mapped_column(ForeignKey("contractors.id", ondelete="CASCADE"), nullable=False, index=True)
    work_order_id = mapped_column(ForeignKey("work_orders.id", ondelete="SET NULL"), nullable=True, index=True)
    
    author_type: Mapped[ReviewAuthorType] = mapped_column(Enum(ReviewAuthorType), nullable=False, index=True)
    author_name: Mapped[str] = mapped_column(String(255), nullable=False)
    author_id: Mapped[str | None] = mapped_column(String(50))
    
    rating: Mapped[float] = mapped_column(Float, nullable=False) # 1.0 to 5.0
    comment: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String(100)) # e.g. "Workmanship", "Punctuality", "Material Quality"
    evidence_urls: Mapped[list[str] | None] = mapped_column(JSONB)


class InspectionResult(str, enum.Enum):
    PASS = "PASS"
    REWORK = "REWORK"
    FAIL = "FAIL"


class Inspection(Base, UUIDMixin, TimestampMixin):
    """Municipal verification of FieldEvidence"""
    __tablename__ = "inspections"
    
    field_evidence_id = mapped_column(ForeignKey("field_evidence.id"), nullable=False, index=True)
    inspector_user_id = mapped_column(ForeignKey("users.id"), nullable=False)
    
    result: Mapped[InspectionResult] = mapped_column(Enum(InspectionResult), nullable=False)
    feedback: Mapped[str | None] = mapped_column(Text)
