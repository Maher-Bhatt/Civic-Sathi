from uuid import UUID
from datetime import datetime, timezone
import logging
import re
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.issue import IssueComplaint
from app.models.job import AnalysisJob
from app.models.audit import AuditLog
from app.models.user import Ward, Department, User
from app.repositories.complaint_repository import ComplaintRepository
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintAnalysisResponse,
    ComplaintLinks,
    RelatedComplaint,
)
from app.schemas.common import ComplaintStatus, EntityResult
from app.ml.similarity import find_similar_complaints
from app.ml.preprocessing import preprocess_text
from app.ml.embeddings import embed_text, get_embedding_model_name
from app.services.canonical_grouping import assign_canonical_group, group_members, normalize_category
from app.core.config import settings
from app.core.errors import NotFoundException


logger = logging.getLogger(__name__)


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
            timeline_json=[{"label": "Report Received", "at": datetime.now(timezone.utc).isoformat()}],
        )

        # Keep the complaint, analysis, group link, reputation ledger, and job
        # record in one transaction. The old implementation committed here,
        # queued matching, and returned before any group existed.
        self.db.add(complaint)
        self.db.flush()
        self.db.refresh(complaint)

        comparison_text = f"{complaint.title}. {complaint.description}"
        try:
            prepared = preprocess_text(comparison_text)
            embedding = embed_text(prepared["cleaned_text"])
            embedding_model = get_embedding_model_name()
        except Exception as exc:
            logger.warning("complaint_matching_embedding_unavailable complaint_id=%s error=%s", complaint.id, type(exc).__name__)
            prepared = {"language": complaint_data.language or "unknown", "cleaned_text": comparison_text, "keywords": [], "entities": []}
            embedding = None
            embedding_model = None

        metadata = []
        if complaint_data.ai_interpreted_text:
            metadata.append({"text": complaint_data.ai_interpreted_text, "label": "ai_interpretation"})
        if complaint_data.ai_suggested_action:
            metadata.append({"text": complaint_data.ai_suggested_action, "label": "municipality_action"})
        analysis = ComplaintAnalysis(
            complaint_id=complaint.id,
            language=complaint_data.language or prepared["language"],
            cleaned_text=prepared["cleaned_text"],
            entities_json=[entity.model_dump() for entity in prepared["entities"]] + metadata,
            keywords_json=prepared["keywords"],
            embedding_model=embedding_model,
            embedding_vector=embedding,
            confidence_score=1.0 if complaint_data.ai_interpreted_text else 0.7,
            ai_status="MATCHING",
        )
        self.db.add(analysis)
        self.db.flush()

        group_id, matches, operation = assign_canonical_group(self.db, complaint, embedding)
        analysis.candidate_issue_id = group_id
        analysis.duplicate_score = max((score for _, score, _ in matches), default=1.0)
        analysis.ai_status = "DUPLICATE" if matches else "UNIQUE"

        # Start the civic identity loop from the persisted complaint itself. The
        # ledger key is stable, so profile reconciliation cannot double-award it.
        if submitted_by_id:
            from app.services.reputation_service import award_xp
            submitter = self.db.get(User, submitted_by_id)
            if submitter:
                award_xp(
                    self.db,
                    submitter,
                    amount=5,
                    action="report_submitted",
                    reason="Genuine civic report entered the platform",
                    source_type="complaint",
                    source_id=str(complaint.id),
                    idempotency_key=f"report:{complaint.id}",
                    metadata={"public_id": complaint.public_id},
                )

        now = datetime.now(timezone.utc)
        self.db.add(AnalysisJob(
            job_type="COMPLAINT_ANALYSIS",
            complaint_id=complaint.id,
            status="COMPLETED",
            attempt_count=1,
            available_at=now,
            started_at=now,
            completed_at=now,
        ))
        self.db.commit()
        self.db.refresh(complaint)
        logger.info("complaint_created_with_group complaint_id=%s group_id=%s operation=%s related_count=%d", complaint.id, group_id, operation, len(matches))
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
        officer_roles = {"officer", "supervisor", "admin", "municipality", "collector"}
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

    def update_status(
        self,
        complaint_id: UUID | str,
        status: ComplaintStatus,
        actor=None,
        notes: str | None = None,
    ) -> ComplaintResponse:
        """Persist a complaint state transition and its governance timeline event."""
        complaint = None
        try:
            complaint = self.repo.get_by_id(UUID(str(complaint_id)))
        except (ValueError, TypeError, AttributeError):
            complaint = self.repo.get_by_public_id(str(complaint_id))
        if not complaint:
            raise NotFoundException("Complaint not found")

        current_status = str(complaint.status)
        next_status = status.value
        if current_status == "rejected" and next_status != "rejected":
            raise HTTPException(status_code=409, detail="Rejected complaints cannot return to the active workflow")
        if current_status in {"resolved", "closed"} and next_status == "rejected":
            raise HTTPException(status_code=409, detail="Resolved complaints cannot be rejected")
        if current_status == next_status and not notes:
            return self._to_response(complaint)

        now = datetime.now(timezone.utc)
        actor_name = str(getattr(actor, "name", None) or getattr(actor, "email", None) or "Municipal operator")
        actor_role = str(getattr(actor, "role", None) or "municipality")
        event_label = "Complaint Rejected" if next_status == "rejected" else {
            "received": "Report Received",
            "in_review": "Complaint Accepted · Under Review",
            "assigned": "Complaint Assigned",
            "in_progress": "Work In Progress",
            "resolved": "Complaint Resolved",
        }.get(next_status, f"Status changed to {next_status.replace('_', ' ').title()}")
        timeline = list(complaint.timeline_json or [])
        timeline.append({
            "label": event_label,
            "at": now.isoformat(),
            "actor": f"{actor_name} · {actor_role}",
            **({"reason": notes.strip()} if notes and notes.strip() else {}),
        })
        complaint.status = next_status
        complaint.timeline_json = timeline
        if next_status == "rejected":
            complaint.rejection_reason = notes.strip() if notes and notes.strip() else "Marked invalid by municipal review"
            complaint.rejected_by_name = actor_name
            complaint.rejected_at = now

        self.db.add(AuditLog(
            actor_id=str(getattr(actor, "id", None) or "system"),
            actor_name=actor_name,
            actor_role=actor_role,
            action="complaint.rejected" if next_status == "rejected" else "complaint.status_changed",
            entity_type="complaint",
            entity_id=str(complaint.id),
            entity_label=complaint.public_id,
            previous_value=current_status,
            new_value=next_status,
            reason=notes.strip() if notes and notes.strip() else None,
            at=now,
        ))
        self.db.commit()
        self.db.refresh(complaint)
        return self._to_response(complaint)

    def assign_complaint(
        self,
        complaint_id: UUID | str,
        assignee_id: UUID | str,
        actor=None,
        notes: str | None = None,
    ) -> ComplaintResponse:
        """Assign a complaint to a city-bound officer and append an auditable timeline event."""
        try:
            complaint = self.repo.get_by_id(UUID(str(complaint_id)))
        except (ValueError, TypeError, AttributeError):
            complaint = self.repo.get_by_public_id(str(complaint_id))
        if not complaint:
            raise NotFoundException("Complaint not found")
        if str(complaint.status) in {"rejected", "resolved", "closed"}:
            raise HTTPException(status_code=409, detail="Only active complaints can be assigned")

        try:
            assignee = self.db.get(User, UUID(str(assignee_id)))
        except (ValueError, TypeError, AttributeError):
            assignee = None
        if not assignee or assignee.role not in {"officer", "supervisor", "municipality"}:
            raise HTTPException(status_code=404, detail="Assigned municipal officer not found")
        actor_city = str(getattr(actor, "city", "") or "").strip().lower()
        assignee_city = str(assignee.city or "").strip().lower()
        if actor_city and assignee_city and actor_city != assignee_city:
            raise HTTPException(status_code=403, detail="Officer belongs to a different city")

        now = datetime.now(timezone.utc)
        actor_name = str(getattr(actor, "name", None) or getattr(actor, "email", None) or "Municipal operator")
        timeline = list(complaint.timeline_json or [])
        timeline.append({
            "label": "Complaint Assigned",
            "at": now.isoformat(),
            "actor": f"{actor_name} · {getattr(actor, 'role', 'municipality')}",
            "reason": notes.strip() if notes and notes.strip() else f"Assigned to {assignee.name}",
        })
        previous_status = str(complaint.status)
        complaint.status = "assigned"
        complaint.assigned_officer_id = assignee.id
        complaint.assigned_officer_name = assignee.name
        complaint.assigned_at = now
        complaint.assignment_notes = notes.strip() if notes and notes.strip() else None
        complaint.timeline_json = timeline
        self.db.add(AuditLog(
            actor_id=str(getattr(actor, "id", None) or "system"),
            actor_name=actor_name,
            actor_role=str(getattr(actor, "role", None) or "municipality"),
            action="complaint.assigned",
            entity_type="complaint",
            entity_id=str(complaint.id),
            entity_label=complaint.public_id,
            previous_value=previous_status,
            new_value=f"assigned:{assignee.id}",
            reason=notes.strip() if notes and notes.strip() else f"Assigned to {assignee.name}",
            at=now,
        ))
        self.db.commit()
        self.db.refresh(complaint)
        return self._to_response(complaint)

    def _group_payload(self, complaint: Complaint, limit: int | None = None) -> tuple[UUID | None, list[RelatedComplaint]]:
        """Read group membership from IssueComplaint, never from a volatile index."""
        group_row = self.db.query(IssueComplaint.issue_id).join(
            Complaint, Complaint.id == IssueComplaint.complaint_id
        ).filter(IssueComplaint.complaint_id == complaint.id).order_by(IssueComplaint.issue_id.asc()).first()
        group_id = group_row[0] if group_row else None
        if not group_id:
            return None, []
        member_rows = group_members(self.db, group_id, exclude_id=complaint.id)
        if limit is not None:
            member_rows = member_rows[:limit]
        members = [
            RelatedComplaint(
                id=member.id,
                public_id=member.public_id,
                title=member.title,
                category=member.category,
                similarity_score=link.similarity_score,
                created_at=member.created_at,
            )
            for member, link in member_rows
        ]
        return group_id, members

    def get_similar_complaints(self, complaint_id: UUID, limit: int = 5):
        """Return the canonical group members, symmetrically for every complaint."""
        complaint = self.repo.get_by_id(complaint_id)
        if not complaint:
            raise NotFoundException("Complaint not found")
        group_id, members = self._group_payload(complaint, limit=limit)
        return {
            "complaint_id": complaint_id,
            "embedding_model": complaint.analysis.embedding_model if complaint.analysis and complaint.analysis.embedding_model else settings.sentence_model_name,
            "problem_group_id": group_id,
            "related_count": len(self._group_payload(complaint)[1]),
            "matching_state": "complete" if group_id else "pending",
            "items": [
                {
                    "id": member.id,
                    "public_id": member.public_id,
                    "title": member.title,
                    "similarity_score": round(member.similarity_score or 0.0, 3),
                    "distance_meters": None,
                    "created_at": member.created_at,
                }
                for member in members
            ],
        }

    def _to_response(
        self,
        complaint: Complaint,
        include_links: bool = False,
        include_private: bool = True,
    ) -> ComplaintResponse:
        """Convert complaint model to a privacy-aware response schema."""
        from app.models.procurement import City
        city = self.db.get(City, complaint.city_id)
        group_id, related_members = self._group_payload(complaint)
        related_count = len(related_members)
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
                similar_count=related_count,
                possible_duplicate=related_count > 0,
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
            assigned_officer_id=complaint.assigned_officer_id,
            assigned_officer_name=complaint.assigned_officer_name,
            assigned_at=complaint.assigned_at,
            assignment_notes=complaint.assignment_notes,
            rejection_reason=complaint.rejection_reason,
            rejected_by_name=complaint.rejected_by_name,
            rejected_at=complaint.rejected_at,
            category=complaint.category,
            department=complaint.department.name if complaint.department else "Municipal Administration",
            city_id=complaint.city_id,
            city_name=city.name if city else "Unknown city",
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
            timeline=[
                {
                    "label": event.get("label", "Status updated"),
                    "at": event.get("at", complaint.updated_at),
                    "actor": event.get("actor"),
                    "reason": event.get("reason"),
                }
                for event in (complaint.timeline_json or [])
                if isinstance(event, dict)
            ],
            analysis=analysis_response,
            problem_group_id=group_id,
            related_count=related_count,
            related_complaints=related_members,
            matching_state="complete" if group_id else "pending",
            links=links,
        )

    def _to_list_item(self, complaint: Complaint):
        from app.models.procurement import City
        from app.schemas.complaint import ComplaintListItem
        city = self.db.get(City, complaint.city_id)
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
            assigned_officer_id=complaint.assigned_officer_id,
            assigned_officer_name=complaint.assigned_officer_name,
            assigned_at=complaint.assigned_at,
            assignment_notes=complaint.assignment_notes,
            rejection_reason=complaint.rejection_reason,
            rejected_by_name=complaint.rejected_by_name,
            rejected_at=complaint.rejected_at,
            category=complaint.category,
            department=complaint.department.name if complaint.department else None,
            city_id=complaint.city_id,
            city_name=city.name if city else "Unknown city",
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
