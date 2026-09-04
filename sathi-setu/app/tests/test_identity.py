"""Tests for identity resolution service.

Covers: new identity creation, phone-fingerprint match, name similarity
threshold, conflict → data quality issue, existing link reuse, canonical ID
format.
"""

from app.models import DataQualityIssue, Identity, IdentityLink, ExternalSystem
from app.services.identity_resolution_service import (
    fingerprint_phone,
    normalize_email,
    normalize_name,
    resolve_identity,
)
from app.schemas import CitizenInput


# ── Utility function tests ────────────────────────────────────────────────

def test_normalize_name_casefold():
    assert normalize_name("Rahul KUMAR") == "rahul kumar"


def test_normalize_name_strips_punctuation():
    assert normalize_name("Rahul K.") == "rahul k"


def test_fingerprint_phone_consistent():
    # Same underlying 10-digit number with different formatting
    fp1 = fingerprint_phone("9876543210")
    fp2 = fingerprint_phone("98765 43210")  # spaces stripped
    fp3 = fingerprint_phone("98765-43210")  # dashes stripped
    assert fp1 == fp2 == fp3, "Same digits with formatting variations must produce the same fingerprint"


def test_fingerprint_phone_country_code_differs():
    """Fingerprints with +91 prefix differ because they have more digits.
    This is known behaviour — operators should strip country codes before
    fingerprinting, or use only trailing N digits for matching.
    """
    fp_10 = fingerprint_phone("9876543210")
    fp_12 = fingerprint_phone("+919876543210")
    # They differ — document this as expected behaviour, not a bug.
    assert fp_10 != fp_12

def test_fingerprint_phone_none_on_short():
    assert fingerprint_phone("123") is None


def test_fingerprint_phone_none_on_empty():
    assert fingerprint_phone(None) is None


def test_normalize_email_casefold():
    assert normalize_email("RAHUL@Example.COM") == "rahul@example.com"


def test_normalize_email_strips_whitespace():
    assert normalize_email("  test@example.com  ") == "test@example.com"


def test_normalize_email_none():
    assert normalize_email(None) is None


# ── resolve_identity integration tests ───────────────────────────────────

def _make_system(db, key="civic-sathi") -> ExternalSystem:
    system = ExternalSystem(
        key=key,
        name="Test System",
        classification="REFERENCE",
        status="SANDBOX",
        description="Test",
    )
    db.add(system)
    db.flush()
    return system


def _citizen(name="Rahul Kumar", phone="9876543210", email=None, src_id="CIT-1") -> CitizenInput:
    return CitizenInput(source_identity_id=src_id, name=name, phone=phone, email=email)


def test_new_identity_created(db_session):
    system = _make_system(db_session)
    identity, link, reason = resolve_identity(db_session, source_system=system, citizen=_citizen())
    assert identity.canonical_id.startswith("SAT-ID-")
    assert identity.display_name == "Rahul Kumar"
    assert link.source_identity_id == "CIT-1"
    assert link.confidence > 0


def test_canonical_id_format(db_session):
    system = _make_system(db_session)
    identity, _, _ = resolve_identity(db_session, source_system=system, citizen=_citizen())
    parts = identity.canonical_id.split("-")
    assert parts[0] == "SAT" and parts[1] == "ID"
    assert len(parts[2]) == 6 and parts[2].isdigit()


def test_phone_match_returns_existing_identity(db_session):
    system = _make_system(db_session)
    citizen_a = _citizen(name="Rahul Kumar", phone="9876543210", src_id="CIT-1")
    identity_a, _, _ = resolve_identity(db_session, source_system=system, citizen=citizen_a)
    db_session.commit()

    system_b = _make_system(db_session, key="mock-grievance-service")
    citizen_b = _citizen(name="Rahul K.", phone="9876543210", src_id="LEG-42")
    identity_b, _, reason_b = resolve_identity(db_session, source_system=system_b, citizen=citizen_b)

    assert identity_a.canonical_id == identity_b.canonical_id, (
        "Same phone should resolve to the same canonical identity"
    )
    assert "matched" in reason_b.lower()


def test_different_phone_creates_separate_identity(db_session):
    system = _make_system(db_session)
    id_a, _, _ = resolve_identity(db_session, source_system=system, citizen=_citizen(phone="9876543210", src_id="CIT-1"))
    db_session.commit()
    id_b, _, _ = resolve_identity(db_session, source_system=system, citizen=_citizen(name="Priya Sharma", phone="8765432109", src_id="CIT-2"))
    assert id_a.canonical_id != id_b.canonical_id


def test_existing_link_reused(db_session):
    system = _make_system(db_session)
    citizen = _citizen(src_id="CIT-REUSE")
    _, link1, _ = resolve_identity(db_session, source_system=system, citizen=citizen)
    db_session.commit()
    _, link2, reason = resolve_identity(db_session, source_system=system, citizen=citizen)
    assert link1.id == link2.id
    assert "reused" in reason.lower()


def test_conflicting_name_raises_data_quality_issue(db_session):
    system = _make_system(db_session)
    citizen_a = _citizen(name="Rahul Kumar", phone="9876543210", src_id="CIT-A")
    resolve_identity(db_session, source_system=system, citizen=citizen_a)
    db_session.commit()

    system_b = _make_system(db_session, key="mock-grievance-service")
    # Same phone, very different name — below 0.67 similarity threshold
    citizen_b = _citizen(name="Anjali Desai", phone="9876543210", src_id="LEG-99")
    resolve_identity(db_session, source_system=system_b, citizen=citizen_b)

    issues = db_session.query(DataQualityIssue).all()
    assert any(i.issue_type == "POSSIBLE_IDENTITY_CONFLICT" for i in issues)


def test_email_match_links_identity(db_session):
    system = _make_system(db_session)
    citizen_a = _citizen(name="Amol Patil", phone=None, email="amol@example.com", src_id="CIT-E1")
    id_a, _, _ = resolve_identity(db_session, source_system=system, citizen=citizen_a)
    db_session.commit()

    system_b = _make_system(db_session, key="mock-grievance-service")
    citizen_b = _citizen(name="Amol Patil", phone=None, email="amol@example.com", src_id="LEG-E2")
    id_b, _, _ = resolve_identity(db_session, source_system=system_b, citizen=citizen_b)
    assert id_a.canonical_id == id_b.canonical_id


def test_no_phone_no_email_creates_new_identity(db_session):
    system = _make_system(db_session)
    citizen = CitizenInput(source_identity_id="ANON-1", name="Unknown Citizen")
    identity, _, reason = resolve_identity(db_session, source_system=system, citizen=citizen)
    assert identity.canonical_id.startswith("SAT-ID-")
    assert "created" in reason.lower()
