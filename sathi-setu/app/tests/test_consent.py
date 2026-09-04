"""Tests for Sathi Sahamati consent enforcement.

CRITICAL: Consent must be enforced server-side.  These tests verify that:
- Missing/pending/revoked consent produces the correct HTTP 403 response.
- Granted consent allows access.
- Expired consent is treated as denied.
- The decide_consent function correctly updates fields.
"""

from datetime import datetime, timedelta, timezone

import pytest

from app.models import Consent, ExternalSystem, Identity
from app.services.consent_service import active_consent, decide_consent, require_consent


def _add_system(db, key):
    s = ExternalSystem(key=key, name=key, classification="MOCK", status="SANDBOX", description="Test")
    db.add(s)
    db.flush()
    return s


def _add_identity(db, canonical_id="SAT-ID-000001") -> Identity:
    i = Identity(canonical_id=canonical_id, display_name="Test Citizen", match_status="VERIFIED_DEMO")
    db.add(i)
    db.flush()
    return i


def _add_consent(db, identity_id, source_id, target_id, status="PENDING", expires_delta=None) -> Consent:
    now = datetime.now(timezone.utc)
    expires_at = (now + expires_delta) if expires_delta else None
    c = Consent(
        identity_id=identity_id,
        source_system_id=source_id,
        target_system_id=target_id,
        purpose="address-sharing",
        status=status,
        expires_at=expires_at,
        granted_at=now if status == "GRANTED" else None,
    )
    db.add(c)
    db.flush()
    return c


class TestActiveConsent:
    def test_returns_none_when_no_consent(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result is None

    def test_returns_none_when_pending(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        _add_consent(db_session, identity.id, src.id, tgt.id, status="PENDING")
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result is None

    def test_returns_none_when_revoked(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        _add_consent(db_session, identity.id, src.id, tgt.id, status="REVOKED")
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result is None

    def test_returns_consent_when_granted(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        consent = _add_consent(db_session, identity.id, src.id, tgt.id, status="GRANTED")
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result is not None
        assert result.id == consent.id

    def test_returns_none_when_expired(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        _add_consent(
            db_session, identity.id, src.id, tgt.id, status="GRANTED",
            expires_delta=timedelta(hours=-1),  # expired 1 hour ago
        )
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result is None

    def test_returns_consent_when_not_expired(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        _add_consent(
            db_session, identity.id, src.id, tgt.id, status="GRANTED",
            expires_delta=timedelta(days=30),
        )
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result is not None

    def test_purpose_scoped(self, db_session):
        """A consent for one purpose does not satisfy a different purpose."""
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        _add_consent(db_session, identity.id, src.id, tgt.id, status="GRANTED")
        result = active_consent(
            db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="different-purpose",
        )
        assert result is None


class TestRequireConsent:
    def test_raises_403_when_no_consent(self, db_session):
        from fastapi import HTTPException
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        with pytest.raises(HTTPException) as exc_info:
            require_consent(
                db=db_session,
                identity_id=identity.id,
                source_system_id=src.id,
                target_system_id=tgt.id,
                purpose="address-sharing",
            )
        assert exc_info.value.status_code == 403

    def test_returns_consent_when_granted(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        consent = _add_consent(db_session, identity.id, src.id, tgt.id, status="GRANTED")
        result = require_consent(
            db=db_session,
            identity_id=identity.id,
            source_system_id=src.id,
            target_system_id=tgt.id,
            purpose="address-sharing",
        )
        assert result.id == consent.id


class TestDecideConsent:
    def test_grant_sets_status_and_timestamp(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        consent = _add_consent(db_session, identity.id, src.id, tgt.id, status="PENDING")
        decide_consent(consent, "GRANTED")
        assert consent.status == "GRANTED"
        assert consent.granted_at is not None
        assert consent.revoked_at is None

    def test_revoke_sets_status_and_timestamp(self, db_session):
        src = _add_system(db_session, "sys-a")
        tgt = _add_system(db_session, "sys-b")
        identity = _add_identity(db_session)
        consent = _add_consent(db_session, identity.id, src.id, tgt.id, status="GRANTED")
        decide_consent(consent, "REVOKED")
        assert consent.status == "REVOKED"
        assert consent.revoked_at is not None
