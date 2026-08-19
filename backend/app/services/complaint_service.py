from uuid import UUID
from datetime import datetime, timezone
import re
from sqlalchemy.orm import Session

from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.user import Ward, Department, User
from app.repositories.complaint_repository import ComplaintRepository
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintAnalysisResponse, ComplaintLinks
from app.schemas.common import ComplaintStatus, EntityResult
from app.ml.similarity import find_similar_complaints
from app.core.config import settings
from app.core.errors import NotFoundException


class ComplaintService:
    """Service for complaint operations."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = ComplaintRepository(db)

    def create_complaint(
        self,
        complaint_data: ComplaintCreate,
        submitted_by_id: UUID | None = None,
        submitted_by_name: str | None = None,
    ) -> ComplaintResponse:
        """Create a new complaint with ML analysis."""
        from app.models.procurement import City
        from sqlalchemy import func as sqlfunc

        raw_category = complaint_data.category or complaint_data.category_hint or "other"
        category_slug = raw_category.strip().lower().replace(" ", "_").replace("-", "_")
        category_aliases = {
            "roads": "road_damage",
            "road": "road_damage",
            "water": "water_supply",
            "garbage": "garbage_collection",
            "streetlight": "street_lighting",
            "street_lights": "street_lighting",
        }
        category_slug = category_aliases.get(category_slug, category_slug)
        department_by_category = {
            "road_damage": "public_works",
            "water_supply": "water_works",
            "garbage_collection": "sanitation",
            "sanitation": "sanitation",
            "drainage": "drainage",
            "sewage": "drainage",
            "street_lighting": "electricity",
            "electricity": "electricity",
            "public_transport": "safety",
            "other": "general",
        }
        department_slug = department_by_category.get(category_slug, "general")
        department = self.db.query(Department).filter(
            sqlfunc.lower(Department.slug) == department_slug
        ).first()
        if not department:
            department = self.db.query(Department).first()

        # The legacy Ward table is not city-scoped. Never attach a global ward row
        # to a new complaint, because that can leak another municipality's ward.
        ward = None

        severity_slug = (complaint_data.severity or "").strip().lower()
        if not severity_slug:
            description_lower = complaint_data.description.lower()
            if any(term in description_lower for term in ("life-threatening", "dangerous", "accident", "collapsed", "overflowing into homes")):
                severity_slug = "high"
            elif any(term in description_lower for term in ("urgent", "blocked", "overflowing", "no water", "unsafe")):
                severity_slug = "moderate"
            else:
                severity_slug = "low"
        severity_score = {
            "critical": 100,
            "high": 80,
            "moderate": 60,
            "medium": 60,
            "low": 35,
        }.get(severity_slug, 60)
        priority = {
            "critical": "urgent",
            "high": "high",
            "moderate": "medium",
            "medium": "medium",
            "low": "low",
        }.get(severity_slug, "medium")

        city_id = None
        if complaint_data.city_id:
            try:
                city = self.db.get(City, UUID(complaint_data.city_id))
                if city:
                    city_id = city.id
            except Exception:
                pass
        if not city_id and complaint_data.city:
            city = self.db.query(City).filter(
                sqlfunc.lower(City.name) == complaint_data.city.strip().lower()
            ).first()
            if city:
                city_id = city.id
        if not city_id and ward and getattr(ward, "city_id", None):
            city_id = ward.city_id
        if not city_id:
            default_city = self.db.query(City).first()
            if default_city:
                city_id = default_city.id
            else:
                default_city = City(name="Vadodara", state_code="GJ")
                self.db.add(default_city)
                self.db.flush()
                city_id = default_city.id

        next_num = self.repo.get_next_public_id_number()
        year = datetime.now(timezone.utc).year
        public_id = f"JN-{year}-{next_num:05d}"

        complaint = Complaint(
            public_id_seq=next_num,
            public_id=public_id,
            title=complaint_data.title or (complaint_data.description[:50] + "..."),
            description=complaint_data.description,
            category=category_slug,
            department_id=department.id if department else None,
            status=ComplaintStatus.RECEIVED.value,
            priority=priority,
            severity_score=severity_score,
            risk_score=severity_score,
            ward_id=ward.id if ward else None,
            city_id=city_id,
            lat=complaint_data.lat,
            lng=complaint_data.lng,
            address_text=complaint_data.address_text,
            submitted_by_id=submitted_by_id,
            submitted_by_name=(
                submitted_by_name
                or (complaint_data.submitted_by.name if complaint_data.submitted_by else None)
                or complaint_data.submitted_by_name
            ),
            submitted_by_phone=(
                complaint_data.submitted_by.phone
                if complaint_data.submitted_by
                else complaint_data.submitted_by_phone
            ),
            source="web",
        )

        complaint = self.repo.create(complaint)

        # Start the civic identity loop from the persisted complaint itself. The
        # ledger key is stable, so profile reconciliation cannot double-award it.
        if submitted_by_id:
            from app.services.reputation_service import award_xp
            award_xp(
                self.db,
                self.db.get(User, submitted_by_id),
                amount=5,
                action="report_submitted",
                reason="Genuine civic report entered the platform",
                source_type="complaint",
                source_id=str(complaint.id),
                idempotency_key=f"report:{complaint.id}",
                metadata={"public_id": complaint.public_id},
            )
            self.db.commit()

        # Preserve the backend AI interpretation for municipal officers.
        # These
        # metadata entries live in the existing JSONB analysis payload so this
        # repair does not require a destructive schema migration.
        if complaint_data.language or complaint_data.ai_interpreted_text or complaint_data.ai_suggested_action:
            metadata = []
            if complaint_data.ai_interpreted_text:
                metadata.append({"text": complaint_data.ai_interpreted_text, "label": "ai_interpretation"})
            if complaint_data.ai_suggested_action:
                metadata.append({"text": complaint_data.ai_suggested_action, "label": "municipality_action"})
            self.db.add(ComplaintAnalysis(
                complaint_id=complaint.id,
                language=complaint_data.language,
                cleaned_text=complaint_data.ai_interpreted_text or complaint.description,
                entities_json=metadata,
                keywords_json=[],
                confidence_score=1.0 if complaint_data.ai_interpreted_text else None,
                ai_status="AI_ROUTED" if metadata else "PENDING",
            ))
            self.db.commit()

        from app.services.job_service import JobService
        JobService(self.db).create_analysis_job(complaint.id)

        self.db.refresh(complaint)
        return self._to_response(complaint, include_links=True)

    def get_complaint(self, complaint_id: UUID) -> ComplaintResponse:
        """Get complaint by UUID for trusted internal callers."""
        complaint = self.repo.get_by_id(complaint_id)
        if not complaint:
            raise NotFoundException("Complaint not found")
        return self._to_response(complaint, include_links=True, include_private=True)

    def get_complaint_for_user(self, complaint_id: UUID, current_user) -> ComplaintResponse:
        """Return a complaint only to its owner or an authorized officer."""
        complaint = self.repo.get_by_id(complaint_id)
        if not complaint:
            raise NotFoundException("Complaint not found")
        self._assert_read_access(complaint, current_user)
        return self._to_response(complaint, include_links=True, include_private=True)

    def get_complaint_by_public_id_for_user(
        self,
        public_id: str,
        current_user,
    ) -> ComplaintResponse | None:
        """Return a public-id complaint only to its owner or an authorized officer."""
        complaint = self.repo.get_by_public_id(public_id)
        if not complaint:
            return None
        self._assert_read_access(complaint, current_user)
        return self._to_response(complaint, include_links=True, include_private=True)

    @staticmethod
    def _assert_read_access(complaint: Complaint, current_user) -> None:
        officer_roles = {"officer", "supervisor", "admin", "municipality"}
        if getattr(current_user, "role", None) in officer_roles:
            return
        if getattr(current_user, "id", None) == complaint.submitted_by_id:
            return
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="You do not have access to this complaint")

    def get_complaint_by_public_id(self, public_id: str) -> ComplaintResponse | None:
        """Get complaint by public_id for trusted internal callers."""
        complaint = self.repo.get_by_public_id(public_id)
        if not complaint:
            return None
        return self._to_response(complaint, include_links=True, include_private=True)

    def list_complaints(
        self,
        ward: int | None = None,
        status: ComplaintStatus | None = None,
        category: str | None = None,
        limit: int = 20,
        offset: int = 0,
        city: str | None = None,
        submitted_by_id: UUID | None = None,
    ):
        """List complaints with filters and optional ownership/city scoping."""
        from app.schemas.common import ComplaintCategory

        limit = max(1, min(limit, 100))
        offset = max(0, offset)
        category_enum = None
        if category:
            try:
                category_enum = ComplaintCategory(category)
            except ValueError:
                pass

        complaints, total = self.repo.list_complaints(
            ward=ward,
            status=status,
            category=category_enum,
            limit=limit,
            offset=offset,
            city=city,
            submitted_by_id=submitted_by_id,
        )

        return {
            "items": [self._to_list_item(c) for c in complaints],
            "total": total,
            "limit": limit,
            "offset": offset,
        }

    def update_status(self, complaint_id: UUID, status: ComplaintStatus) -> ComplaintResponse:
        """Update complaint status."""
        complaint = self.repo.update_status(complaint_id, status)
        if not complaint:
            raise NotFoundException("Complaint not found")
        return self._to_response(complaint)

    def get_similar_complaints(self, complaint_id: UUID, limit: int = 5):
        """Get similar complaints."""
        complaint = self.repo.get_by_id(complaint_id)
        if not complaint:
            raise NotFoundException("Complaint not found")

        if not complaint.analysis or not complaint.analysis.embedding_vector:
            return {
                "complaint_id": complaint_id,
                "embedding_model": settings.sentence_model_name,
                "items": [],
            }

        similar_results = find_similar_complaints(
            complaint.analysis.embedding_vector,
            k=limit,
            exclude_id=complaint_id,
        )

        items = []
        for similar_id, similarity_score in similar_results:
            similar_complaint = self.repo.get_by_id(similar_id)
            if similar_complaint:
                distance_meters = None
                if (
                    complaint.lat
                    and complaint.lng
                    and similar_complaint.lat
                    and similar_complaint.lng
                ):
                    distance_meters = self._calculate_distance(
                        complaint.lat,
                        complaint.lng,
                        similar_complaint.lat,
                        similar_complaint.lng,
                    )
                items.append({
                    "id": similar_complaint.id,
                    "public_id": similar_complaint.public_id,
                    "title": similar_complaint.title,
                    "similarity_score": round(similarity_score, 3),
                    "distance_meters": distance_meters,
                    "created_at": similar_complaint.created_at,
                })

        return {
            "complaint_id": complaint_id,
            "embedding_model": complaint.analysis.embedding_model,
            "items": items,
        }

    def _to_response(
        self,
        complaint: Complaint,
        include_links: bool = False,
        include_private: bool = True,
    ) -> ComplaintResponse:
        """Convert complaint model to a privacy-aware response schema."""
        analysis_response = None
        if complaint.analysis:
            raw_entities = complaint.analysis.entities_json or []
            if isinstance(raw_entities, dict):
                raw_entities = []
            ai_metadata = {
                str(item.get("label")): str(item.get("text"))
                for item in raw_entities
                if isinstance(item, dict) and item.get("label") in {"ai_interpretation", "municipality_action"}
            }
            public_entities = [
                EntityResult(**item)
                for item in raw_entities
                if isinstance(item, dict)
                and item.get("label") not in {"ai_interpretation", "municipality_action"}
                and item.get("text")
                and item.get("label")
            ]
            analysis_response = ComplaintAnalysisResponse(
                language=complaint.analysis.language,
                keywords=complaint.analysis.keywords_json or [],
                entities=public_entities,
                similar_count=0,
                possible_duplicate=False,
                confidence_score=complaint.analysis.confidence_score,
                interpreted_text=ai_metadata.get("ai_interpretation") or complaint.analysis.cleaned_text,
                suggested_action=ai_metadata.get("municipality_action"),
            )

        links = None
        if include_links:
            links = ComplaintLinks(
                self=f"{settings.api_v1_prefix}/complaints/{complaint.id}",
                similar=f"{settings.api_v1_prefix}/complaints/{complaint.id}/similar",
            )

        ward_number = complaint.ward.ward_number if complaint.ward else None
        if ward_number is None and complaint.address_text:
            ward_match = re.search(r"\bward\s*[-#]?\s*(\d{1,3})\b", complaint.address_text, re.IGNORECASE)
            if ward_match:
                ward_number = int(ward_match.group(1))
        raw_phone = complaint.submitted_by_phone
        masked_phone = None
        if raw_phone:
            clean_digits = "".join(filter(str.isdigit, raw_phone))
            if len(clean_digits) >= 10:
                masked_phone = f"+91 {clean_digits[:2]}*** **{clean_digits[-3:]}"
            else:
                masked_phone = f"{raw_phone[:2]}***{raw_phone[-2:]}" if len(raw_phone) > 4 else "***"

        citizen_name = complaint.submitted_by_name or "Verified Citizen"
        return ComplaintResponse(
            id=complaint.id,
            public_id=complaint.public_id,
            title=complaint.title,
            description=complaint.description if include_private else None,
            status=str(complaint.status),
            category=complaint.category,
            department=complaint.department.name if complaint.department else "Municipal Administration",
            priority=complaint.priority,
            severity_score=complaint.severity_score,
            risk_score=complaint.risk_score,
            ward_number=ward_number,
            lat=complaint.lat,
            lng=complaint.lng,
            address_text=complaint.address_text,
            submitted_by_name=citizen_name if include_private else None,
            submitted_by_phone=masked_phone if include_private else None,
            privacy_status="Protected (Anti-Retaliation)",
            created_at=complaint.created_at,
            updated_at=complaint.updated_at,
            analysis=analysis_response,
            links=links,
        )

    def _to_list_item(self, complaint: Complaint):
        from app.schemas.complaint import ComplaintListItem
        ward_number = complaint.ward.ward_number if complaint.ward else None
        if ward_number is None and complaint.address_text:
            ward_match = re.search(r"\bward\s*[-#]?\s*(\d{1,3})\b", complaint.address_text, re.IGNORECASE)
            if ward_match:
                ward_number = int(ward_match.group(1))
        analysis_entities = complaint.analysis.entities_json if complaint.analysis else []
        if isinstance(analysis_entities, dict):
            analysis_entities = []
        ai_metadata = {
            str(item.get("label")): str(item.get("text"))
            for item in analysis_entities
            if isinstance(item, dict) and item.get("label") in {"ai_interpretation", "municipality_action"}
        }
        return ComplaintListItem(
            id=complaint.id,
            public_id=complaint.public_id,
            title=complaint.title,
            description=complaint.description,
            status=ComplaintStatus(complaint.status),
            category=complaint.category,
            department=complaint.department.name if complaint.department else None,
            priority=complaint.priority,
            severity_score=complaint.severity_score,
            risk_score=complaint.risk_score,
            ward_number=ward_number,
            lat=complaint.lat,
            lng=complaint.lng,
            address_text=complaint.address_text,
            created_at=complaint.created_at,
            updated_at=complaint.updated_at,
            language=complaint.analysis.language if complaint.analysis else None,
            interpreted_text=ai_metadata.get("ai_interpretation") or (complaint.analysis.cleaned_text if complaint.analysis else None),
            suggested_action=ai_metadata.get("municipality_action"),
        )

    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        from math import radians, cos, sin, asin, sqrt
        R = 6371000
        lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlng / 2) ** 2
        c = 2 * asin(sqrt(a))
        return R * c
