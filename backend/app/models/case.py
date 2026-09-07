"""CivicCase and CaseDepartment models for multi-department orchestration"""

from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import String, Text, Integer, Float, ForeignKey, Index, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin


class CivicCase(Base, UUIDMixin, TimestampMixin):
    """
    Unified Master Case model representing a citizen's civic report that may
    fan out into multiple child departmental tickets with dependency tracking.
    """
    __tablename__ = "civic_cases"

    case_number: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
    )
    citizen_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    address_text: Mapped[str | None] = mapped_column(Text, nullable=True)

    city_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("cities.id"),
        nullable=True,
        index=True,
    )
    ward_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("wards.id"),
        nullable=True,
        index=True,
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        default="MEDIUM",
        nullable=False,
        index=True,
    )  # LOW | MEDIUM | HIGH | CRITICAL
    priority: Mapped[str] = mapped_column(
        String(10),
        default="P3",
        nullable=False,
        index=True,
    )  # P1 | P2 | P3 | P4

    root_cause: Mapped[str | None] = mapped_column(Text, nullable=True)
    preventive_warning: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_plan_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(
        String(30),
        default="SUBMITTED",
        nullable=False,
        index=True,
    )  # SUBMITTED | IN_PROGRESS | RESOLVED | CLOSED

    estimated_total_sla_hours: Mapped[int] = mapped_column(Integer, default=48, nullable=False)
    photo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    timeline_json: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    metadata_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Relationships
    departments: Mapped[list["CaseDepartment"]] = relationship(
        "CaseDepartment",
        back_populates="case",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="CaseDepartment.sequence_order",
    )
    citizen: Mapped["User"] = relationship("User", foreign_keys=[citizen_id], lazy="joined")
    city: Mapped["City"] = relationship("City", foreign_keys=[city_id], lazy="joined")
    ward: Mapped["Ward"] = relationship("Ward", foreign_keys=[ward_id], lazy="joined")

    @property
    def timeline(self) -> list:
        return self.timeline_json or []

    @property
    def city_name(self) -> str | None:
        return self.city.name if self.city else None

    @property
    def ward_name(self) -> str | None:
        return self.ward.name if self.ward else None

    __table_args__ = (
        Index("ix_civic_cases_status_priority", "status", "priority"),
        Index("ix_civic_cases_city_created", "city_id", "created_at"),
    )


class CaseDepartment(Base, UUIDMixin, TimestampMixin):
    """
    Child departmental ticket linked to a CivicCase.
    Supports cross-department dependency (e.g. Road repair blocked by Water repair).
    """
    __tablename__ = "case_departments"

    case_id: Mapped[UUID] = mapped_column(
        ForeignKey("civic_cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    department_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("departments.id"),
        nullable=True,
        index=True,
    )

    department_name: Mapped[str] = mapped_column(String(100), nullable=False)
    department_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    # External system mapping (e.g., 'water_board', 'pwd_roads', 'swd_drainage')
    external_system_key: Mapped[str | None] = mapped_column(String(50), nullable=True)
    external_ticket_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)

    sequence_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Cross-department dependency: this ticket cannot start until dependency ticket is COMPLETED
    dependency_case_dept_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("case_departments.id"),
        nullable=True,
        index=True,
    )
    dependency_note: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(
        String(30),
        default="WAITING",
        nullable=False,
        index=True,
    )  # WAITING | READY_FOR_REPAIR | IN_PROGRESS | COMPLETED | FAILED

    action_required: Mapped[str | None] = mapped_column(Text, nullable=True)
    sla_hours: Mapped[int] = mapped_column(Integer, default=24, nullable=False)
    sla_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    assigned_officer_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    assigned_officer_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    assigned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    completion_evidence_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    completion_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    case: Mapped["CivicCase"] = relationship("CivicCase", back_populates="departments")
    dependency: Mapped["CaseDepartment | None"] = relationship(
        "CaseDepartment",
        remote_side="CaseDepartment.id",
        foreign_keys=[dependency_case_dept_id],
        lazy="joined",
    )

    @property
    def is_blocked(self) -> bool:
        """Ticket is blocked if it depends on an unfinished upstream department ticket."""
        if not self.dependency_case_dept_id:
            return False
        if self.dependency is not None:
            return self.dependency.status != "COMPLETED"
        return self.status == "WAITING"
