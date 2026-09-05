import json
from sqlalchemy import event, insert, inspect
import uuid
from datetime import datetime, timezone

from app.core.audit_context import get_audit_actor
from app.models.audit import AuditLog
from app.models.complaint import Complaint
from app.models.procurement import WorkOrder, Tender
from app.models.sla import SLARule

AUDITABLE_MODELS = [Complaint, WorkOrder, Tender, SLARule]

def _serialize_val(val):
    if isinstance(val, datetime):
        return val.isoformat()
    if isinstance(val, uuid.UUID):
        return str(val)
    return str(val) if val is not None else None

def _log_event(conn, mapper, target, action: str):
    actor = get_audit_actor()
    if not actor:
        return

    entity_type = mapper.class_.__tablename__
    entity_id = str(target.id) if hasattr(target, "id") else "unknown"
    
    previous_value = None
    new_value = None
    
    state = inspect(target)
    
    if action == "UPDATE":
        changes = {}
        old_state = {}
        for attr in state.attrs:
            history = attr.history
            if history.has_changes():
                old_val = history.deleted[0] if history.deleted else None
                new_val = history.added[0] if history.added else None
                changes[attr.key] = _serialize_val(new_val)
                old_state[attr.key] = _serialize_val(old_val)
        
        if not changes:
            return
            
        previous_value = json.dumps(old_state)
        new_value = json.dumps(changes)
    elif action == "INSERT":
        new_state = {attr.key: _serialize_val(getattr(target, attr.key)) for attr in state.attrs}
        new_value = json.dumps(new_state)

    conn.execute(
        insert(AuditLog).values(
            id=uuid.uuid4(),
            actor_id=actor.get("actor_id", "unknown"),
            actor_name=actor.get("actor_name", "Unknown"),
            actor_role=actor.get("actor_role", "system"),
            action=f"{entity_type.upper()}_{action}",
            entity_type=entity_type,
            entity_id=entity_id,
            entity_label=str(target)[:100],
            previous_value=previous_value,
            new_value=new_value,
            reason="Automated System Audit",
            at=datetime.now(timezone.utc)
        )
    )

def _after_insert(mapper, connection, target):
    _log_event(connection, mapper, target, "INSERT")

def _after_update(mapper, connection, target):
    _log_event(connection, mapper, target, "UPDATE")

def _after_delete(mapper, connection, target):
    _log_event(connection, mapper, target, "DELETE")

def setup_auditing():
    for model in AUDITABLE_MODELS:
        event.listen(model, "after_insert", _after_insert)
        event.listen(model, "after_update", _after_update)
        event.listen(model, "after_delete", _after_delete)

