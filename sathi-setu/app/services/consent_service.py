"""Server-enforced Sathi Sahamati consent decisions."""

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Consent


def active_consent(
    db: Session,
    *,
    identity_id: str,
    source_system_id: str,
    target_system_id: str,
    purpose: str,
) -> Consent | None:
    now = datetime.now(timezone.utc)
    consents = db.scalars(
        select(Consent).where(
            Consent.identity_id == identity_id,
            Consent.source_system_id == source_system_id,
            Consent.target_system_id == target_system_id,
            Consent.purpose == purpose,
            Consent.status == "GRANTED",
        )
    ).all()

    def _not_expired(item: Consent) -> bool:
        if item.expires_at is None:
            return True
        exp = item.expires_at
        # SQLite stores naive datetimes; compare without tzinfo in that case.
        if exp.tzinfo is None:
            return exp > now.replace(tzinfo=None)
        return exp > now

    return next((item for item in consents if _not_expired(item)), None)


def require_consent(**kwargs) -> Consent:
    consent = active_consent(**kwargs)
    if not consent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sathi Sahamati consent is required for this cross-system access.",
        )
    return consent


def decide_consent(consent: Consent, decision: str) -> Consent:
    now = datetime.now(timezone.utc)
    consent.status = decision
    if decision == "GRANTED":
        consent.granted_at = now
        consent.revoked_at = None
    elif decision == "REVOKED":
        consent.revoked_at = now
    return consent
