"""Append-only audit writes for every cross-system decision."""

import hashlib
import json

from sqlalchemy.orm import Session

from app.models import AuditEntry


def write_audit(
    db: Session,
    *,
    actor: str,
    action: str,
    resource_type: str,
    resource_id: str,
    correlation_id: str,
    payload: dict,
) -> AuditEntry:
    digest = hashlib.sha256(
        json.dumps(payload, sort_keys=True, default=str, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    entry = AuditEntry(
        actor=actor,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        correlation_id=correlation_id,
        payload_digest=digest,
    )
    db.add(entry)
    return entry
