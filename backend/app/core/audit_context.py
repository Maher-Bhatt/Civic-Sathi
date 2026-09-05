from contextvars import ContextVar
from typing import Optional, Dict, Any

# ContextVar to hold the current user acting on the system
current_audit_actor: ContextVar[Optional[Dict[str, Any]]] = ContextVar(
    "current_audit_actor", default=None
)

def set_audit_actor(actor_id: str, actor_name: str, actor_role: str):
    """Set the actor making the request for global DB auditing."""
    return current_audit_actor.set({
        "actor_id": actor_id,
        "actor_name": actor_name,
        "actor_role": actor_role
    })

def get_audit_actor() -> Optional[Dict[str, Any]]:
    """Get the current actor for audit logging."""
    return current_audit_actor.get()

