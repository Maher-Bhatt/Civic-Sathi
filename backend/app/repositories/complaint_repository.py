from uuid import UUID
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, and_, or_, not_
from sqlalchemy.orm import Session

from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.user import Ward
from app.models.procurement import City
from app.schemas.common import ComplaintStatus, ComplaintCategory


class ComplaintRepository:
    """Repository for complaint data access."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, complaint: Complaint) -> Complaint:
        """Create a new complaint."""
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        return complaint

    def get_by_id(self, complaint_id: UUID) -> Complaint | None:
        """Get complaint by ID with relationships."""
        return self.db.execute(
            select(Complaint).where(Complaint.id == complaint_id)
        ).scalar_one_or_none()

    def get_by_public_id(self, public_id: str) -> Complaint | None:
        """Get complaint by public ID."""
        return self.db.execute(
            select(Complaint).where(Complaint.public_id == public_id)
        ).scalar_one_or_none()

    def list_complaints(
        self,
        ward: int | None = None,
        status: ComplaintStatus | None = None,
        category: ComplaintCategory | None = None,
        limit: int = 20,
        offset: int = 0,
        city: str | None = None,
        submitted_by_id: UUID | None = None,
    ) -> tuple[list[Complaint], int]:
        """List complaints with filters and optional owner/city scoping."""
        query = select(Complaint)

        filters = []
        if ward:
            filters.append(Complaint.ward_id.in_(
                select(Ward.id).where(Ward.ward_number == ward)
            ))
        if status:
            filters.append(Complaint.status == status.value)
        if category:
            filters.append(Complaint.category == category.value)
        if city:
            filters.append(Complaint.city_id == city)
            city_record = self.db.execute(
                select(City).where(City.id == city)
            ).scalar_one_or_none()
            city_name = (city_record.name if city_record else "").strip().lower()
            if city_name in {"vadodara", "baroda"}:
                opposite_address = or_(*[
                    Complaint.address_text.ilike(f"%{token}%")
                    for token in (
                        "bengaluru", "bangalore", "indiranagar", "yelahanka",
                        "electronic city", "whitefield", "hsr layout", "jayanagar",
                        "basavanagudi", "vijayanagar", "marathahalli", "btm layout",
                        "malleshwaram", "hebbal", "peenya", "bommanahalli",
                        "kengeri", "rajajinagar", "shivajinagar", "bellandur",
                        "banaswadi", "mahadevapura", "koramangala",
                    )
                ])
                opposite_coordinates = and_(
                    Complaint.lat.between(12.70, 13.25),
                    Complaint.lng.between(77.30, 77.85),
                )
                filters.append(not_(or_(opposite_address, opposite_coordinates)))
            elif city_name in {"bengaluru", "bangalore"}:
                opposite_address = or_(*[
                    Complaint.address_text.ilike(f"%{token}%")
                    for token in (
                        "vadodara", "baroda", "gotri", "manjalpur", "bhayli",
                        "atladara", "vasna", "fatehgunj", "sevasi", "sayajigunj",
                        "karelibaug", "alkapuri", "makarpura", "waghodia", "akota",
                        "tarsali", "harni", "ajwa",
                    )
                ])
                opposite_coordinates = and_(
                    Complaint.lat.between(21.95, 22.55),
                    Complaint.lng.between(72.85, 73.55),
                )
                filters.append(not_(or_(opposite_address, opposite_coordinates)))
        if submitted_by_id:
            filters.append(Complaint.submitted_by_id == submitted_by_id)

        if filters:
            query = query.where(and_(*filters))

        if ward:
            query = query.join(Ward).filter(Ward.ward_number == ward)

        total = self.db.execute(
            select(func.count()).select_from(query.subquery())
        ).scalar()

        query = query.order_by(Complaint.created_at.desc()).limit(limit).offset(offset)
        complaints = list(self.db.execute(query).scalars())

        return complaints, total or 0

    def update_status(self, complaint_id: UUID, status: ComplaintStatus) -> Complaint | None:
        """Update complaint status."""
        complaint = self.get_by_id(complaint_id)
        if complaint:
            complaint.status = status.value
            self.db.commit()
            self.db.refresh(complaint)
        return complaint

    def get_recent_with_embeddings(self, days: int = 30) -> list[Complaint]:
        """Get recent complaints that have embeddings."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        return list(self.db.execute(
            select(Complaint)
            .join(ComplaintAnalysis, Complaint.id == ComplaintAnalysis.complaint_id)
            .where(
                and_(
                    Complaint.created_at >= cutoff,
                    ComplaintAnalysis.embedding_vector.isnot(None),
                )
            )
        ).scalars())

    def get_next_public_id_number(self) -> int:
        """Get next public ID sequence number from Postgres sequence."""
        result = self.db.execute(
            select(func.nextval("complaint_public_seq"))
        ).scalar()
        return result

    def create_analysis(self, analysis: ComplaintAnalysis) -> ComplaintAnalysis:
        """Create complaint analysis."""
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis

    def get_by_ward(self, ward_id: UUID) -> list[Complaint]:
        """Get all complaints in a ward."""
        return list(self.db.execute(
            select(Complaint).where(Complaint.ward_id == ward_id)
        ).scalars())

    def delete_demo_data(self):
        """Delete demo/seed data."""
        self.db.query(Complaint).filter(Complaint.source == "demo").delete()
        self.db.commit()
