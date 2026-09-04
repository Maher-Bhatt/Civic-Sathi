"""HTTP API for the Sathi Setu prototype."""

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.connectors import get_connector
from app.core.database import get_db
from app.core.security import require_connector_key
from app.models import (
    AuditEntry,
    ConnectorConfig,
    Consent,
    DataQualityIssue,
    ExternalSystem,
    Identity,
    SetuEvent,
    UnifiedApplication,
)
from app.schemas import (
    ConsentDecision,
    ConsentRequest,
    DataQualityResolution,
    IngestRequest,
    MappingUpdate,
    StatusUpdate,
)
from app.services.audit_service import write_audit
from app.services.consent_service import decide_consent, require_consent
from app.services.event_bus import find_idempotent_result, record_event, store_idempotent_result
from app.services.identity_resolution_service import resolve_identity
from app.services.reconciliation_service import resolve_issue
from app.services.tracking_service import add_source_reference, create_unified_application


router = APIRouter(prefix="/v1")
Db = Annotated[Session, Depends(get_db)]
Client = Annotated[str, Depends(require_connector_key)]


def system_or_404(db: Session, key: str) -> ExternalSystem:
    item = db.scalar(select(ExternalSystem).where(ExternalSystem.key == key))
    if not item:
        raise HTTPException(status_code=404, detail=f"Connected system '{key}' was not found.")
    return item


def application_or_404(db: Session, unified_id: str) -> UnifiedApplication:
    item = db.scalar(select(UnifiedApplication).where(UnifiedApplication.unified_id == unified_id))
    if not item:
        raise HTTPException(status_code=404, detail=f"Unified application '{unified_id}' was not found.")
    return item


@router.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "sathi-setu", "mode": "prototype"}


@router.get("/demo/config", include_in_schema=False)
def demo_config() -> dict:
    """Returns the demo API key for the local prototype console.

    This endpoint is intentionally DISABLED in production.  It exists only to
    allow the self-contained demo console to authenticate without requiring the
    operator to hardcode the key in the HTML.
    """
    if settings.environment == "production":
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Not found")
    return {"api_key": settings.api_key, "environment": settings.environment}


@router.get("/catalogue")
def catalogue(db: Db) -> dict:
    systems = db.scalars(select(ExternalSystem).order_by(ExternalSystem.name)).all()
    configs = db.scalars(select(ConnectorConfig).where(ConnectorConfig.enabled.is_(True))).all()
    config_by_system = {config.system_id: config for config in configs}
    return {
        "systems": [
            {
                "key": item.key,
                "name": item.name,
                "classification": item.classification,
                "status": item.status,
                "description": item.description,
                "mapping_version": config_by_system.get(item.id).version if item.id in config_by_system else None,
            }
            for item in systems
        ]
    }


@router.get("/demo/snapshot")
def demo_snapshot(db: Db) -> dict:
    """Safe, unauthenticated read model for the local prototype console."""
    systems = db.scalars(select(ExternalSystem).order_by(ExternalSystem.name)).all()
    applications = db.scalars(select(UnifiedApplication).order_by(desc(UnifiedApplication.created_at)).limit(8)).all()
    issues = db.scalars(
        select(DataQualityIssue).where(DataQualityIssue.status == "OPEN").order_by(desc(DataQualityIssue.created_at)).limit(8)
    ).all()
    events = db.scalars(select(SetuEvent).order_by(desc(SetuEvent.created_at)).limit(10)).all()
    return {
        "systems": [
            {"name": row.name, "key": row.key, "classification": row.classification, "status": row.status}
            for row in systems
        ],
        "applications": [
            {"unified_id": row.unified_id, "status": row.status, "service_type": row.service_type, "summary": row.summary, "source_records": row.source_records}
            for row in applications
        ],
        "issues": [
            {"id": row.id, "issue_type": row.issue_type, "severity": row.severity, "status": row.status, "details": row.details}
            for row in issues
        ],
        "events": [
            {"event_type": row.event_type, "correlation_id": row.correlation_id, "occurred_at": row.occurred_at.isoformat()}
            for row in events
        ],
    }


@router.post("/applications/ingest", status_code=status.HTTP_201_CREATED)
def ingest_application(request: IngestRequest, db: Db, client: Client) -> dict:
    operation = f"ingest:{request.source_system_key}"
    existing = find_idempotent_result(db, request.idempotency_key, operation)
    if existing:
        return {"unified_id": existing, "idempotent_replay": True}

    source_system = system_or_404(db, request.source_system_key)
    try:
        canonical = get_connector(request.source_system_key).map_to_canonical(request.payload)
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(status_code=422, detail=f"Connector mapping rejected the payload: {exc}") from exc

    identity, link, match_reason = resolve_identity(db, source_system=source_system, citizen=canonical.citizen)
    application = create_unified_application(
        db, identity=identity, source_system=source_system, canonical=canonical
    )
    db.flush()
    record_event(
        db,
        event_type="identity_matched",
        source_system_id=source_system.id,
        target_system_id=None,
        unified_application_id=application.id,
        correlation_id=request.correlation_id,
        payload={"canonical_id": identity.canonical_id, "reason": match_reason, "confidence": link.confidence},
    )
    record_event(
        db,
        event_type="submitted",
        source_system_id=source_system.id,
        target_system_id=None,
        unified_application_id=application.id,
        correlation_id=request.correlation_id,
        payload={"source_reference": canonical.source_reference, "status": canonical.status},
    )
    write_audit(
        db,
        actor=client,
        action="APPLICATION_INGESTED",
        resource_type="unified_application",
        resource_id=application.unified_id,
        correlation_id=request.correlation_id,
        payload={"source_system": source_system.key, "source_reference": canonical.source_reference},
    )
    store_idempotent_result(
        db, key=request.idempotency_key, operation=operation, response_reference=application.unified_id
    )
    db.commit()
    return {
        "unified_id": application.unified_id,
        "identity_id": identity.canonical_id,
        "match_reason": match_reason,
        "idempotent_replay": False,
    }


@router.post("/applications/{unified_id}/status")
def update_status(unified_id: str, request: StatusUpdate, db: Db, client: Client) -> dict:
    operation = f"status:{unified_id}:{request.source_system_key}"
    existing = find_idempotent_result(db, request.idempotency_key, operation)
    if existing:
        return {"unified_id": existing, "idempotent_replay": True}

    source_system = system_or_404(db, request.source_system_key)
    application = application_or_404(db, unified_id)
    application.status = request.status
    add_source_reference(application, source_system, request.source_reference)
    record_event(
        db,
        event_type="status_changed",
        source_system_id=source_system.id,
        target_system_id=None,
        unified_application_id=application.id,
        correlation_id=request.correlation_id,
        payload={"status": request.status, "source_reference": request.source_reference},
    )
    write_audit(
        db,
        actor=client,
        action="STATUS_PROPAGATED",
        resource_type="unified_application",
        resource_id=application.unified_id,
        correlation_id=request.correlation_id,
        payload={"source_system": source_system.key, "status": request.status},
    )
    store_idempotent_result(db, key=request.idempotency_key, operation=operation, response_reference=application.unified_id)
    db.commit()
    return {"unified_id": application.unified_id, "status": application.status, "idempotent_replay": False}


@router.post("/consents", status_code=status.HTTP_201_CREATED)
def request_consent(request: ConsentRequest, db: Db, client: Client) -> dict:
    identity = db.scalar(select(Identity).where(Identity.canonical_id == request.identity_id))
    if not identity:
        raise HTTPException(status_code=404, detail="Canonical identity was not found.")
    source = system_or_404(db, request.source_system_key)
    target = system_or_404(db, request.target_system_key)
    consent = Consent(
        identity_id=identity.id,
        source_system_id=source.id,
        target_system_id=target.id,
        purpose=request.purpose,
        expires_at=request.expires_at,
    )
    db.add(consent)
    db.flush()
    write_audit(
        db,
        actor=client,
        action="CONSENT_REQUESTED",
        resource_type="consent",
        resource_id=consent.id,
        correlation_id="consent-request",
        payload={"identity": identity.canonical_id, "source": source.key, "target": target.key, "purpose": request.purpose},
    )
    db.commit()
    return {"consent_id": consent.id, "status": consent.status}


@router.post("/consents/{consent_id}/decision")
def decide_consent_request(consent_id: str, request: ConsentDecision, db: Db, client: Client) -> dict:
    consent = db.get(Consent, consent_id)
    if not consent:
        raise HTTPException(status_code=404, detail="Consent request was not found.")
    decide_consent(consent, request.decision)
    record_event(
        db,
        event_type="consent_granted" if request.decision == "GRANTED" else "consent_revoked",
        source_system_id=consent.source_system_id,
        target_system_id=consent.target_system_id,
        unified_application_id=None,
        correlation_id=request.correlation_id,
        payload={"consent_id": consent.id, "decision": request.decision},
    )
    write_audit(
        db,
        actor=request.actor,
        action=f"CONSENT_{request.decision}",
        resource_type="consent",
        resource_id=consent.id,
        correlation_id=request.correlation_id,
        payload={"decision": request.decision},
    )
    db.commit()
    return {"consent_id": consent.id, "status": consent.status}


@router.get("/identities/{canonical_id}/shared-profile")
def shared_profile(
    canonical_id: str,
    source_system_key: str = Query(min_length=2),
    target_system_key: str = Query(min_length=2),
    purpose: str = Query(min_length=4),
    db: Db = None,
    client: Client = None,
) -> dict:
    identity = db.scalar(select(Identity).where(Identity.canonical_id == canonical_id))
    if not identity:
        raise HTTPException(status_code=404, detail="Canonical identity was not found.")
    source = system_or_404(db, source_system_key)
    target = system_or_404(db, target_system_key)
    consent = require_consent(
        db=db,
        identity_id=identity.id,
        source_system_id=source.id,
        target_system_id=target.id,
        purpose=purpose,
    )
    write_audit(
        db,
        actor=client,
        action="CONSENTED_PROFILE_ACCESSED",
        resource_type="identity",
        resource_id=identity.canonical_id,
        correlation_id="profile-access",
        payload={"consent_id": consent.id, "target": target.key},
    )
    db.commit()
    return {"canonical_id": identity.canonical_id, "name": identity.display_name, "consent_id": consent.id}


@router.get("/events")
def list_events(db: Db, client: Client) -> list[dict]:
    return [
        {"id": event.id, "type": event.event_type, "correlation_id": event.correlation_id, "at": event.occurred_at}
        for event in db.scalars(select(SetuEvent).order_by(desc(SetuEvent.created_at)).limit(100)).all()
    ]


@router.get("/data-quality")
def list_data_quality(db: Db, client: Client) -> list[dict]:
    return [
        {"id": issue.id, "type": issue.issue_type, "severity": issue.severity, "status": issue.status, "details": issue.details}
        for issue in db.scalars(select(DataQualityIssue).order_by(desc(DataQualityIssue.created_at))).all()
    ]


@router.post("/data-quality/{issue_id}/resolve")
def resolve_data_quality(issue_id: str, request: DataQualityResolution, db: Db, client: Client) -> dict:
    issue = db.get(DataQualityIssue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Data quality issue was not found.")
    resolve_issue(db, issue, request.action, request.notes)
    write_audit(
        db,
        actor=request.actor,
        action="DATA_QUALITY_RESOLVED",
        resource_type="data_quality_issue",
        resource_id=issue.id,
        correlation_id=request.correlation_id,
        payload={"action": request.action, "notes": request.notes},
    )
    db.commit()
    return {"issue_id": issue.id, "status": issue.status}


@router.patch("/connectors/{system_key}/mapping")
def update_mapping(system_key: str, request: MappingUpdate, db: Db, client: Client) -> dict:
    system = system_or_404(db, system_key)
    current = db.scalar(
        select(ConnectorConfig).where(ConnectorConfig.system_id == system.id).order_by(desc(ConnectorConfig.version))
    )
    next_version = (current.version if current else 0) + 1
    if current:
        current.enabled = False
    config = ConnectorConfig(
        system_id=system.id,
        name=f"{system.key}-connector",
        version=next_version,
        field_mapping=request.field_mapping,
        enabled=True,
    )
    db.add(config)
    write_audit(
        db,
        actor=request.actor,
        action="CONNECTOR_MAPPING_UPDATED",
        resource_type="connector_config",
        resource_id=system.key,
        correlation_id=request.correlation_id,
        payload={"version": next_version, "mapping": request.field_mapping},
    )
    db.commit()
    return {"system_key": system.key, "version": next_version, "enabled": True}


@router.get("/audit")
def audit_log(db: Db, client: Client) -> list[dict]:
    return [
        {"action": row.action, "resource": f"{row.resource_type}:{row.resource_id}", "correlation_id": row.correlation_id, "at": row.created_at}
        for row in db.scalars(select(AuditEntry).order_by(desc(AuditEntry.created_at)).limit(100)).all()
    ]
