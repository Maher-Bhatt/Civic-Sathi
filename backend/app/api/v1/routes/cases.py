"""API routes for Master Case management and multi-department orchestration"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.user import User
from app.schemas.case import CaseCreate, CivicCaseOut, CaseDepartmentOut, TimelineEvent
from app.services.case_service import CaseService

router = APIRouter()


def _format_case_out(case) -> CivicCaseOut:
    """Format CivicCase model instance into CivicCaseOut schema with dependency resolution."""
    dept_map = {d.id: d for d in case.departments}

    depts_out: list[CaseDepartmentOut] = []
    for d in sorted(case.departments, key=lambda x: x.sequence_order):
        is_blocked = False
        if d.dependency_case_dept_id and d.dependency_case_dept_id in dept_map:
            parent = dept_map[d.dependency_case_dept_id]
            is_blocked = parent.status != "COMPLETED"

        depts_out.append(
            CaseDepartmentOut(
                id=d.id,
                case_id=d.case_id,
                department_id=d.department_id,
                department_name=d.department_name,
                department_code=d.department_code,
                external_system_key=d.external_system_key,
                external_ticket_id=d.external_ticket_id,
                sequence_order=d.sequence_order,
                dependency_case_dept_id=d.dependency_case_dept_id,
                dependency_note=d.dependency_note,
                status=d.status,
                action_required=d.action_required,
                sla_hours=d.sla_hours,
                sla_deadline=d.sla_deadline,
                assigned_officer_name=d.assigned_officer_name,
                assigned_officer_phone=d.assigned_officer_phone,
                assigned_at=d.assigned_at,
                completed_at=d.completed_at,
                completion_evidence_url=d.completion_evidence_url,
                completion_notes=d.completion_notes,
                is_blocked=is_blocked,
            )
        )

    timeline_items = []
    for item in (case.timeline_json or []):
        timeline_items.append(
            TimelineEvent(
                id=item.get("id", "event-0"),
                title=item.get("title", "Event"),
                description=item.get("description", ""),
                timestamp=item.get("timestamp", ""),
                status=item.get("status", "completed"),
                actor=item.get("actor"),
                department=item.get("department"),
            )
        )

    return CivicCaseOut(
        id=case.id,
        case_number=case.case_number,
        title=case.title,
        description=case.description,
        latitude=case.latitude,
        longitude=case.longitude,
        address_text=case.address_text,
        city_name=case.city.name if case.city else None,
        ward_name=case.ward.name if case.ward else None,
        severity=case.severity,
        priority=case.priority,
        root_cause=case.root_cause,
        preventive_warning=case.preventive_warning,
        action_plan_summary=case.action_plan_summary,
        status=case.status,
        estimated_total_sla_hours=case.estimated_total_sla_hours,
        photo_url=case.photo_url,
        created_at=case.created_at,
        updated_at=case.updated_at,
        departments=depts_out,
        timeline=timeline_items,
    )


@router.post("", response_model=CivicCaseOut, status_code=http_status.HTTP_201_CREATED)
async def create_case(
    case_data: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """
    Create a Master Case and fan out into linked child CaseDepartment tickets
    with automated cross-department dependency tracking.
    """
    service = CaseService(db)
    citizen_id = current_user.id if current_user else None
    citizen_name = current_user.name if current_user else "Citizen"

    created = await service.create_master_case(
        case_data=case_data,
        citizen_id=citizen_id,
        citizen_name=citizen_name,
    )
    return _format_case_out(created)


@router.get("/{case_id_or_number}", response_model=CivicCaseOut)
def get_case(
    case_id_or_number: str,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """
    Get full Digital Case Passport for a Master Case, including child department
    tickets, live SLA deadlines, and dependency blocking state.
    """
    service = CaseService(db)
    case = service.get_case(case_id_or_number)
    if not case:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Case '{case_id_or_number}' not found",
        )
    return _format_case_out(case)


@router.get("", response_model=list[CivicCaseOut])
def list_cases(
    status: str | None = Query(None),
    city_id: UUID | None = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """List Master Cases with optional filtering"""
    service = CaseService(db)
    citizen_id = None
    if current_user and getattr(current_user, "role", None) not in {"officer", "supervisor", "admin", "municipality"}:
        citizen_id = current_user.id

    cases = service.list_cases(
        citizen_id=citizen_id,
        city_id=city_id,
        status=status,
        limit=limit,
        offset=offset,
    )
    return [_format_case_out(c) for c in cases]


@router.post("/{case_id}/departments/{dept_id}/simulate-complete", response_model=CivicCaseOut)
def simulate_department_completion(
    case_id: UUID,
    dept_id: UUID,
    notes: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    """
    SIH26129 Live Demo Showstopper:
    Simulates completion of an upstream department's ticket (e.g. Water repair done).
    Automatically propagates state and unblocks dependent downstream child tickets
    (e.g. Road repair shifts from WAITING to READY_FOR_REPAIR)!
    """
    service = CaseService(db)
    try:
        updated = service.simulate_dept_complete(case_id, dept_id, notes)
        return _format_case_out(updated)
    except ValueError as exc:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=str(exc))
