"""Durable event recorder with replay protection.

The prototype exposes a pollable event feed. Production deployments can add a
PostgreSQL NOTIFY or Redis publisher after durable persistence succeeds.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import IdempotencyRecord, SetuEvent


def find_idempotent_result(db: Session, key: str, operation: str) -> str | None:
    record = db.scalar(
        select(IdempotencyRecord).where(
            IdempotencyRecord.key == key,
            IdempotencyRecord.operation == operation,
        )
    )
    return record.response_reference if record else None


def record_event(
    db: Session,
    *,
    event_type: str,
    source_system_id: str,
    target_system_id: str | None,
    unified_application_id: str | None,
    correlation_id: str,
    payload: dict,
) -> SetuEvent:
    event = SetuEvent(
        event_type=event_type,
        source_system_id=source_system_id,
        target_system_id=target_system_id,
        unified_application_id=unified_application_id,
        correlation_id=correlation_id,
        payload=payload,
    )
    db.add(event)
    return event


def store_idempotent_result(db: Session, *, key: str, operation: str, response_reference: str) -> None:
    db.add(IdempotencyRecord(key=key, operation=operation, response_reference=response_reference))
