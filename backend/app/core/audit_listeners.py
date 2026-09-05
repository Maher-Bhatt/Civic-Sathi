"""SQLAlchemy event listeners for automatic, per-model audit logging.

Design principles
─────────────────
* BUG-002  DISABLE_AUTO_AUDIT env-var guard – checked at *call time*, not import time.
* BUG-003  Idempotency – setup_auditing() is safe to call multiple times (hot-reload).
* BUG-004  System_Identity fallback – never silently drops a write when no HTTP actor.
* BUG-005  Correct history API – uses `get_history` from sqlalchemy.orm.attributes
           so it reliably reads the pre-flush committed values even after the flush
           completes (mapper-level after_update events receive the expired state
           but attribute history is still accessible until the session is closed).

Tracked fields per model:
  Complaint   → status, assigned_officer_id, priority
  WorkOrder   → status, risk_level, verified_progress_pct
  Tender      → status, estimated_budget
  SLARule     → response_hours, resolution_hours, escalation_hours, is_active
"""

from __future__ import annotations

import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import event, insert
from sqlalchemy.orm import attributes

from app.core.audit_context import get_audit_actor
from app.models.audit import AuditLog
from app.models.complaint import Complaint
from app.models.procurement import Tender, WorkOrder
from app.models.sla import SLARule

logger = logging.getLogger("civicsathi.audit")

# ── System identity used whenever no HTTP actor is in context ────────────────
_SYSTEM_ACTOR: dict[str, str] = {
    "actor_id": "system",
    "actor_name": "System",
    "actor_role": "system",
}

# ── Per-model field tracking config ─────────────────────────────────────────
# Each entry: (field_name, action_string)
_COMPLAINT_FIELDS: list[tuple[str, str]] = [
    ("status", "COMPLAINT_STATUS_CHANGED"),
    ("assigned_officer_id", "COMPLAINT_ASSIGNED"),
    ("priority", "COMPLAINT_PRIORITY_CHANGED"),
]

_WORK_ORDER_FIELDS: list[tuple[str, str]] = [
    ("status", "WORK_ORDER_STATUS_CHANGED"),
    ("risk_level", "WORK_ORDER_RISK_CHANGED"),
    ("verified_progress_pct", "WORK_ORDER_PROGRESS_VERIFIED"),
]

_TENDER_FIELDS: list[tuple[str, str]] = [
    ("status", "TENDER_STATUS_CHANGED"),
    ("estimated_budget", "TENDER_BUDGET_CHANGED"),
]

_SLA_FIELDS: list[tuple[str, str]] = [
    ("response_hours", "SLA_RESPONSE_HOURS_CHANGED"),
    ("resolution_hours", "SLA_RESOLUTION_HOURS_CHANGED"),
    ("escalation_hours", "SLA_ESCALATION_HOURS_CHANGED"),
    ("is_active", "SLA_RULE_TOGGLED"),
]

_FIELD_MAP: dict[type, list[tuple[str, str]]] = {
    Complaint: _COMPLAINT_FIELDS,
    WorkOrder: _WORK_ORDER_FIELDS,
    Tender: _TENDER_FIELDS,
    SLARule: _SLA_FIELDS,
}


def _is_disabled() -> bool:
    """Runtime check — evaluated on every callback, not at import time (BUG-002)."""
    return os.environ.get("DISABLE_AUTO_AUDIT", "").strip().lower() == "true"


def _serialize(val: Any) -> str | None:
    """Convert a raw SQLAlchemy attribute value to a JSON-safe string or None."""
    if val is None:
        return None
    if isinstance(val, datetime):
        return val.isoformat()
    if isinstance(val, uuid.UUID):
        return str(val)
    # Enum values
    if hasattr(val, "value"):
        return str(val.value)
    return str(val)


def _entity_label(target: Any, model_cls: type) -> str | None:
    """Derive a human-readable label for the entity, truncated to 255 chars."""
    try:
        if model_cls is Complaint:
            label = getattr(target, "public_id", None) or str(getattr(target, "id", ""))
        elif model_cls is WorkOrder:
            label = str(getattr(target, "id", ""))
        elif model_cls is Tender:
            raw = getattr(target, "title", None) or str(getattr(target, "id", ""))
            label = raw
        elif model_cls is SLARule:
            cat = getattr(target, "category", "") or ""
            sev = getattr(target, "severity", "") or ""
            label = f"{cat} / {sev}".strip(" /")
        else:
            label = str(getattr(target, "id", ""))
        if not label:
            return None
        return label[:255] if len(label) > 255 else label
    except Exception:
        return None


def _write_audit_rows(
    connection: Any,
    target: Any,
    model_cls: type,
    action: str,
    tracked_fields: list[tuple[str, str]],
    *,
    insert_mode: bool = False,
) -> None:
    """Write one AuditLog row per changed tracked field (or one INSERT summary row)."""
    if _is_disabled():
        return

    # BUG-004: Use System_Identity when no HTTP actor, never silently skip
    actor = get_audit_actor() or _SYSTEM_ACTOR

    entity_id = str(getattr(target, "id", "unknown"))
    label = _entity_label(target, model_cls)
    now = datetime.now(timezone.utc)

    rows_to_write: list[dict[str, Any]] = []

    if insert_mode:
        # On INSERT, log a single "created" entry with new values of tracked fields
        summary: dict[str, str | None] = {}
        for field, _ in tracked_fields:
            raw = getattr(target, field, None)
            summary[field] = _serialize(raw)
        rows_to_write.append({
            "action": f"{model_cls.__tablename__.upper()}_CREATED",
            "previous_value": None,
            "new_value": json.dumps(summary),
        })
    else:
        # UPDATE: emit one row per changed tracked field (BUG-005 fix)
        for field, action_str in tracked_fields:
            try:
                history = attributes.get_history(target, field)
            except Exception:
                continue
            if not history.has_changes():
                continue
            old_val = history.deleted[0] if history.deleted else None
            new_val = history.added[0] if history.added else None
            # Skip if truly unchanged (e.g. set to same value)
            if _serialize(old_val) == _serialize(new_val):
                continue
            rows_to_write.append({
                "action": action_str,
                "previous_value": _serialize(old_val),
                "new_value": _serialize(new_val),
            })

    if not rows_to_write:
        return

    for row in rows_to_write:
        try:
            connection.execute(
                insert(AuditLog).values(
                    id=uuid.uuid4(),
                    actor_id=actor["actor_id"],
                    actor_name=actor["actor_name"],
                    actor_role=actor["actor_role"],
                    action=row["action"],
                    entity_type=model_cls.__tablename__,
                    entity_id=entity_id,
                    entity_label=label,
                    previous_value=row["previous_value"],
                    new_value=row["new_value"],
                    reason="Automated system audit",
                    at=now,
                )
            )
        except Exception as exc:
            # BUG-009 (Req 9.1): swallow, log at WARNING, never re-raise
            try:
                logger.warning(
                    "audit_write_failed model=%s entity=%s action=%s error=%s",
                    model_cls.__tablename__,
                    entity_id,
                    row["action"],
                    exc,
                )
            except Exception:
                pass  # Secondary exception suppressed (Req 9.1 second clause)


# ── Listener callbacks ───────────────────────────────────────────────────────

def _make_after_insert(model_cls: type):
    def _after_insert(mapper, connection, target):
        if _is_disabled():
            return
        fields = _FIELD_MAP.get(model_cls, [])
        _write_audit_rows(connection, target, model_cls, "INSERT", fields, insert_mode=True)
    return _after_insert


def _make_after_update(model_cls: type):
    def _after_update(mapper, connection, target):
        if _is_disabled():
            return
        fields = _FIELD_MAP.get(model_cls, [])
        _write_audit_rows(connection, target, model_cls, "UPDATE", fields, insert_mode=False)
    return _after_update


def _make_after_delete(model_cls: type):
    def _after_delete(mapper, connection, target):
        if _is_disabled():
            return
        actor = get_audit_actor() or _SYSTEM_ACTOR
        entity_id = str(getattr(target, "id", "unknown"))
        label = _entity_label(target, model_cls)
        now = datetime.now(timezone.utc)
        try:
            connection.execute(
                insert(AuditLog).values(
                    id=uuid.uuid4(),
                    actor_id=actor["actor_id"],
                    actor_name=actor["actor_name"],
                    actor_role=actor["actor_role"],
                    action=f"{model_cls.__tablename__.upper()}_DELETED",
                    entity_type=model_cls.__tablename__,
                    entity_id=entity_id,
                    entity_label=label,
                    previous_value=None,
                    new_value=None,
                    reason="Automated system audit",
                    at=now,
                )
            )
        except Exception as exc:
            try:
                logger.warning(
                    "audit_delete_write_failed model=%s entity=%s error=%s",
                    model_cls.__tablename__,
                    entity_id,
                    exc,
                )
            except Exception:
                pass
    return _after_delete


# ── Registration ─────────────────────────────────────────────────────────────

# Store per-model listener function references so idempotency check works
_registered_listeners: dict[type, dict[str, Any]] = {}


def setup_auditing() -> None:
    """Register mapper-level event listeners. Safe to call multiple times (BUG-003)."""
    if _is_disabled():
        logger.info("audit_listeners_disabled DISABLE_AUTO_AUDIT=true")
        return

    for model_cls in _FIELD_MAP:
        if model_cls in _registered_listeners:
            # Already registered — skip to prevent duplicate listeners on hot-reload
            continue

        after_insert_fn = _make_after_insert(model_cls)
        after_update_fn = _make_after_update(model_cls)
        after_delete_fn = _make_after_delete(model_cls)

        event.listen(model_cls, "after_insert", after_insert_fn)
        event.listen(model_cls, "after_update", after_update_fn)
        event.listen(model_cls, "after_delete", after_delete_fn)

        _registered_listeners[model_cls] = {
            "after_insert": after_insert_fn,
            "after_update": after_update_fn,
            "after_delete": after_delete_fn,
        }

    logger.info("audit_listeners_registered models=%s", [m.__tablename__ for m in _FIELD_MAP])
