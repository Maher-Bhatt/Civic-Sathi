"""Case service for Master Case lifecycle and multi-department orchestration"""

import random
import string
from datetime import datetime, timezone, timedelta
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session, selectinload, joinedload

from app.models.case import CivicCase, CaseDepartment
from app.models import Department, City, Ward, User
from app.schemas.case import CaseCreate, AnalyzeCaseResponse

import asyncio
from app.services.ai_service import ai_service
from app.services.event_broadcaster import event_broadcaster
from app.schemas.integration import LiveTransitMessage


def _safe_broadcast(msg: LiveTransitMessage):
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(event_broadcaster.broadcast(msg))
    except RuntimeError:
        pass


def generate_case_number(city_slug: str | None = None) -> str:
    """Generate official Maharashtra case passport number e.g. MH-MCGM-2026-000842"""
    city_code = "MCGM"
    if city_slug:
        clean = city_slug.strip().upper()
        if "MUMBAI" in clean:
            city_code = "MCGM"
        elif "PUNE" in clean:
            city_code = "PMC"
        elif "NAGPUR" in clean:
            city_code = "NMC"
        elif "VADODARA" in clean:
            city_code = "VMC"
        elif "THANE" in clean:
            city_code = "TMC"
        elif "NASHIK" in clean:
            city_code = "NMC"
        else:
            city_code = clean[:4]

    random_seq = "".join(random.choices(string.digits, k=6))
    return f"MH-{city_code}-2026-{random_seq}"


def generate_external_ticket_id(dept_code: str) -> str:
    """Generate legacy department ticket ID (e.g. WS-92821, RD-44019)"""
    prefix_map = {
        "water": "WS",
        "roads": "RD",
        "drainage": "DR",
        "electricity": "EB",
        "sanitation": "SW",
    }
    prefix = prefix_map.get(dept_code.lower(), "CV")
    digits = "".join(random.choices(string.digits, k=5))
    return f"{prefix}-{digits}"


class CaseService:
    def __init__(self, db: Session):
        self.db = db

    async def create_master_case(
        self,
        case_data: CaseCreate,
        citizen_id: UUID | None = None,
        citizen_name: str | None = None,
    ) -> CivicCase:
        """
        Create master CivicCase and fan out to child CaseDepartment tickets
        with cross-department dependencies.
        """
        # 1. Resolve city
        city_id = None
        city_slug = "MH"
        if case_data.city:
            city_rec = self.db.execute(
                select(City).where(
                    or_(
                        City.id == case_data.city if self._is_valid_uuid(case_data.city) else False,
                        func.lower(City.name) == case_data.city.strip().lower(),
                    )
                )
            ).scalar_one_or_none()
            if city_rec:
                city_id = city_rec.id
                city_slug = city_rec.name

        # 2. Resolve ward
        ward_id = None
        if case_data.ward and self._is_valid_uuid(case_data.ward):
            ward_id = UUID(case_data.ward)

        # 3. AI Analysis if not pre-provided
        analysis = case_data.pre_analyzed_routing
        if not analysis:
            raw_analysis = await ai_service.analyze_multi_dept_case(
                title=case_data.title,
                description=case_data.description,
                lat=case_data.latitude,
                lng=case_data.longitude,
                image_url=case_data.photo_url,
                city=case_data.city,
            )
            analysis = AnalyzeCaseResponse(**raw_analysis)

        now = datetime.now(timezone.utc)
        case_number = generate_case_number(city_slug)

        # 4. Create Master Case
        initial_timeline = [
            {
                "id": f"event-{uuid4().hex[:8]}",
                "title": "Grievance Intake & Verification",
                "description": f"Master Case registered by citizen {citizen_name or 'Resident'}.",
                "timestamp": now.isoformat(),
                "status": "completed",
                "actor": citizen_name or "Citizen",
                "department": "Public Intake",
            },
            {
                "id": f"event-{uuid4().hex[:8]}",
                "title": "AI Macro Interoperability Triage",
                "description": f"Root Cause Diagnosed: {analysis.root_cause}. Routed to {len(analysis.departments)} sovereign departments.",
                "timestamp": (now + timedelta(seconds=2)).isoformat(),
                "status": "completed",
                "actor": "Civic Sathi AI Engine",
                "department": "Orchestration Hub",
            },
        ]

        master_case = CivicCase(
            case_number=case_number,
            citizen_id=citizen_id,
            title=case_data.title or analysis.title,
            description=case_data.description,
            latitude=case_data.latitude,
            longitude=case_data.longitude,
            address_text=case_data.address_text or (f"Ward Area, {city_slug}" if city_slug else None),
            city_id=city_id,
            ward_id=ward_id,
            severity=analysis.severity,
            priority=analysis.priority,
            root_cause=analysis.root_cause,
            preventive_warning=analysis.preventive_warning,
            action_plan_summary=analysis.summary,
            status="IN_PROGRESS",
            estimated_total_sla_hours=analysis.estimated_total_sla_hours,
            photo_url=case_data.photo_url,
            timeline_json=initial_timeline,
            metadata_json={"source": analysis.source, "analyzed_at": now.isoformat()},
        )
        self.db.add(master_case)
        self.db.flush()

        # 5. Pre-query available database departments
        db_depts = self.db.execute(select(Department)).scalars().all()
        dept_lookup = {d.slug.lower(): d for d in db_depts}
        dept_lookup.update({d.name.lower(): d for d in db_depts})

        # 6. Create Child Departments
        # 6. Create Child Departments
        child_pairs: list[tuple[Any, CaseDepartment]] = []
        dept_by_code: dict[str, CaseDepartment] = {}
        dept_by_seq: dict[int, CaseDepartment] = {}

        # Pass 1: Create all department records
        for dept_item in sorted(analysis.departments, key=lambda x: x.sequence_order):
            matched_dept = (
                dept_lookup.get(dept_item.department_code.lower())
                or dept_lookup.get(dept_item.department_name.lower())
            )
            dept_fk_id = matched_dept.id if matched_dept else None

            ticket_id = generate_external_ticket_id(dept_item.department_code)
            sla_hrs = dept_item.sla_hours or 24
            sla_deadline = now + timedelta(hours=sla_hrs)

            child = CaseDepartment(
                case_id=master_case.id,
                department_id=dept_fk_id,
                department_name=dept_item.department_name,
                department_code=dept_item.department_code,
                external_system_key=dept_item.external_system_key or f"{dept_item.department_code}_dept",
                external_ticket_id=ticket_id,
                sequence_order=dept_item.sequence_order,
                dependency_note=dept_item.dependency_note,
                status=dept_item.status or ("IN_PROGRESS" if dept_item.sequence_order == 1 else "WAITING"),
                action_required=dept_item.action_required,
                sla_hours=sla_hrs,
                sla_deadline=sla_deadline,
                assigned_officer_name=f"{dept_item.department_name} Rapid Response Unit",
                assigned_at=now if dept_item.sequence_order == 1 else None,
            )
            self.db.add(child)
            self.db.flush()
            child_pairs.append((dept_item, child))
            dept_by_code[dept_item.department_code.lower()] = child
            dept_by_seq[dept_item.sequence_order] = child

        # Pass 2: Wire up dependency foreign keys directly to corresponding child
        for dept_item, current_child in child_pairs:
            parent_ticket = None
            if dept_item.depends_on and str(dept_item.depends_on).lower() not in {"none", "null", "false", ""}:
                raw_dep = str(dept_item.depends_on).lower()
                for code_key, cand_ticket in dept_by_code.items():
                    if code_key != dept_item.department_code.lower() and (code_key in raw_dep or raw_dep in code_key):
                        parent_ticket = cand_ticket
                        break

            if not parent_ticket and dept_item.sequence_order > 1:
                # Default chaining: depend on immediate preceding sequence order
                parent_ticket = dept_by_seq.get(dept_item.sequence_order - 1)

            if parent_ticket and parent_ticket.id != current_child.id:
                current_child.dependency_case_dept_id = parent_ticket.id
                if parent_ticket.status != "COMPLETED":
                    current_child.status = "WAITING"
                if not current_child.dependency_note:
                    current_child.dependency_note = f"Blocked: Waiting for {parent_ticket.department_name} completion."
                self.db.add(current_child)
                self.db.flush()

        self.db.commit()
        self.db.expire_all()

        _safe_broadcast(
            LiveTransitMessage(
                id=f"evt-{uuid4().hex[:8]}",
                timestamp=now.isoformat(),
                source="mcgm_portal",
                target="sathi_setu",
                event_type="CITIZEN_GRIEVANCE_DISPATCH",
                summary=f"Master Case {case_number} registered: {master_case.title}",
                case_number=case_number,
                status="success",
                payload={"severity": master_case.severity, "priority": master_case.priority, "depts_count": len(child_pairs)},
            )
        )

        return self.get_case(str(master_case.id))


    def get_case(self, case_id_or_number: str) -> CivicCase | None:
        """Fetch CivicCase by UUID or case_number with eager-loaded departments and dependencies"""
        query = (
            select(CivicCase)
            .options(
                selectinload(CivicCase.departments).joinedload(CaseDepartment.dependency),
                joinedload(CivicCase.city),
                joinedload(CivicCase.ward),
            )
            .where(
                or_(
                    CivicCase.id == UUID(case_id_or_number) if self._is_valid_uuid(case_id_or_number) else False,
                    CivicCase.case_number == case_id_or_number,
                )
            )
        )
        return self.db.execute(query).scalar_one_or_none()

    def simulate_dept_complete(
        self,
        case_id: UUID,
        dept_id: UUID,
        notes: str | None = None,
    ) -> CivicCase:
        """
        Simulate completion of an upstream department's ticket.
        Automatically checks and unblocks downstream dependent child tickets!
        """
        case = self.db.get(CivicCase, case_id)
        if not case:
            raise ValueError(f"CivicCase {case_id} not found")

        target_dept = self.db.get(CaseDepartment, dept_id)
        if not target_dept or target_dept.case_id != case.id:
            raise ValueError(f"CaseDepartment {dept_id} not found for case {case.id}")

        now = datetime.now(timezone.utc)
        target_dept.status = "COMPLETED"
        target_dept.completed_at = now
        target_dept.completion_notes = notes or f"Work completed by {target_dept.department_name} field team."
        self.db.add(target_dept)
        self.db.flush()

        # Find dependent tickets that were waiting on this department
        dependents = self.db.execute(
            select(CaseDepartment).where(
                CaseDepartment.case_id == case.id,
                CaseDepartment.dependency_case_dept_id == target_dept.id,
            )
        ).scalars().all()

        unblocked_names = []
        for dep in dependents:
            dep.status = "READY_FOR_REPAIR"
            dep.assigned_at = now
            dep.sla_deadline = now + timedelta(hours=dep.sla_hours)
            self.db.add(dep)
            unblocked_names.append(dep.department_name)

        # Update case timeline
        timeline = list(case.timeline_json or [])
        timeline.append({
            "id": f"event-{uuid4().hex[:8]}",
            "title": f"{target_dept.department_name} Ticket Resolved ({target_dept.external_ticket_id})",
            "description": notes or f"Repair completed. Verified on sovereign API {target_dept.external_system_key}.",
            "timestamp": now.isoformat(),
            "status": "completed",
            "actor": target_dept.assigned_officer_name or target_dept.department_name,
            "department": target_dept.department_name,
        })

        if unblocked_names:
            timeline.append({
                "id": f"event-{uuid4().hex[:8]}",
                "title": "Dependency Unblocked & Handoff Triggered",
                "description": f"Prerequisite {target_dept.department_name} resolved. Downstream tickets unblocked: {', '.join(unblocked_names)}.",
                "timestamp": (now + timedelta(seconds=1)).isoformat(),
                "status": "in-progress",
                "actor": "Sathi Setu Interoperability Broker",
                "department": "Interoperability Bus",
            })

        # Check if all departments in case are completed
        all_depts = self.db.execute(
            select(CaseDepartment).where(CaseDepartment.case_id == case.id)
        ).scalars().all()

        if all(d.status == "COMPLETED" for d in all_depts):
            case.status = "RESOLVED"
            timeline.append({
                "id": f"event-{uuid4().hex[:8]}",
                "title": "Master Case Fully Resolved",
                "description": "All multi-department child work orders completed and quality audited.",
                "timestamp": (now + timedelta(seconds=2)).isoformat(),
                "status": "completed",
                "actor": "Municipal Oversight Officer",
                "department": "Administration",
            })

        case.timeline_json = timeline
        self.db.add(case)
        self.db.commit()
        self.db.expire_all()

        _safe_broadcast(
            LiveTransitMessage(
                id=f"evt-{uuid4().hex[:8]}",
                timestamp=now.isoformat(),
                source=target_dept.external_system_key or "water_board",
                target="sathi_setu",
                event_type="WORK_ORDER_COMPLETED",
                summary=f"{target_dept.department_name} resolved ticket {target_dept.external_ticket_id}.",
                case_number=case.case_number,
                status="success",
                payload={"department_code": target_dept.department_code, "notes": notes},
            )
        )
        if unblocked_names:
            _safe_broadcast(
                LiveTransitMessage(
                    id=f"evt-{uuid4().hex[:8]}",
                    timestamp=(now + timedelta(seconds=1)).isoformat(),
                    source="sathi_setu",
                    target="pwd_roads",
                    event_type="DEPENDENCY_UNBLOCK_TRIGGER",
                    summary=f"Prerequisite {target_dept.department_name} complete. Downstream unblocked: {', '.join(unblocked_names)}.",
                    case_number=case.case_number,
                    status="success",
                    payload={"unblocked_departments": unblocked_names},
                )
            )

        return self.get_case(str(case.id))


    def list_cases(
        self,
        citizen_id: UUID | None = None,
        city_id: UUID | None = None,
        status: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[CivicCase]:
        """List cases with optional citizen/city/status filtering"""
        query = select(CivicCase).order_by(CivicCase.created_at.desc())
        if citizen_id:
            query = query.where(CivicCase.citizen_id == citizen_id)
        if city_id:
            query = query.where(CivicCase.city_id == city_id)
        if status:
            query = query.where(CivicCase.status == status)

        query = query.limit(limit).offset(offset)
        return list(self.db.execute(query).scalars().all())

    @staticmethod
    def _is_valid_uuid(val: Any) -> bool:
        if not val:
            return False
        try:
            UUID(str(val))
            return True
        except (ValueError, TypeError, AttributeError):
            return False
