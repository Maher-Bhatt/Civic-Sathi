"""Deterministic, explainable demo identity resolution."""

import hashlib
import re
from difflib import SequenceMatcher

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ExternalSystem, Identity, IdentityLink
from app.schemas import CitizenInput
from app.services.reconciliation_service import raise_identity_conflict


def normalize_name(value: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", value.casefold()).strip()


def fingerprint_phone(value: str | None) -> str | None:
    digits = "".join(re.findall(r"\d", value or ""))
    return hashlib.sha256(digits.encode("utf-8")).hexdigest() if len(digits) >= 8 else None


def normalize_email(value: str | None) -> str | None:
    return value.casefold().strip() if value else None


def _next_canonical_id(db: Session) -> str:
    count = db.scalar(select(Identity).count()) if False else db.query(Identity).count()
    return f"SAT-ID-{count + 1:06d}"


def resolve_identity(
    db: Session,
    *,
    source_system: ExternalSystem,
    citizen: CitizenInput,
) -> tuple[Identity, IdentityLink, str]:
    phone = fingerprint_phone(citizen.phone)
    email = normalize_email(citizen.email)
    candidates = []
    if phone:
        candidates.extend(db.scalars(select(Identity).where(Identity.contact_fingerprint == phone)).all())
    if email:
        candidates.extend(db.scalars(select(Identity).where(Identity.email_normalized == email)).all())

    unique_candidates = {candidate.id: candidate for candidate in candidates}.values()
    incoming_name = normalize_name(citizen.name)
    matched: Identity | None = None
    reason = "Created a new canonical demo identity."
    confidence = 1.0
    for candidate in unique_candidates:
        name_similarity = SequenceMatcher(None, normalize_name(candidate.display_name), incoming_name).ratio()
        if name_similarity >= 0.67:
            matched = candidate
            confidence = round(0.75 + name_similarity * 0.25, 2)
            reason = "Matched a shared verified contact signal and similar normalised name."
            break
        raise_identity_conflict(
            db,
            identity_id=candidate.id,
            existing_name=candidate.display_name,
            incoming_name=citizen.name,
            source_system_key=source_system.key,
        )

    identity = matched
    if identity is None:
        identity = Identity(
            canonical_id=_next_canonical_id(db),
            display_name=citizen.name,
            contact_fingerprint=phone,
            email_normalized=email,
            match_status="VERIFIED_DEMO",
        )
        db.add(identity)
        db.flush()

    existing_link = db.scalar(
        select(IdentityLink).where(
            IdentityLink.system_id == source_system.id,
            IdentityLink.source_identity_id == citizen.source_identity_id,
        )
    )
    if existing_link:
        return identity, existing_link, "Existing source identity link reused."

    link = IdentityLink(
        identity_id=identity.id,
        system_id=source_system.id,
        source_identity_id=citizen.source_identity_id,
        confidence=confidence,
        reason=reason,
    )
    db.add(link)
    return identity, link, reason
