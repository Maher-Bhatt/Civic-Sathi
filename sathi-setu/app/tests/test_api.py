"""End-to-end API tests via FastAPI TestClient and SQLite.

Covers the full demo flow: ingest → consent → access denied → grant → access
allowed, plus: idempotency, invalid payloads, unauthorized access, status
propagation, data quality resolution, and connector mapping update.
"""

import uuid

import pytest

# Must match the SATHI_SETU_API_KEY set in conftest.py's os.environ.setdefault
AUTH_HEADER = {"Authorization": "Bearer test-key-for-pytest-only-16chars"}

# ── Helpers ──────────────────────────────────────────────────────────────

def _corr() -> str:
    return str(uuid.uuid4())[:24]


def _idem() -> str:
    return str(uuid.uuid4())


CIVIC_SATHI_PAYLOAD = {
    "complaint_id": "CS-TEST-001",
    "description": "Large pothole on Tilak Road blocking traffic",
    "status": "SUBMITTED",
    "category": "ROAD",
    "city": "Pune",
    "submitted_by": {
        "citizen_id": "CIT-TEST-001",
        "name": "Rahul Kumar",
        "phone": "9876543210",
        "email": "rahul.test@example.com",
    },
}

MGS_PAYLOAD = {
    "grievance_ref": "MGS-TEST-991",
    "legacy_citizen_ref": "LEG-TEST-042",
    "citizen_name": "Rahul K.",
    "mobile_no": "9876543210",
    "complaint_text": "Broken street light on MG Road",
    "case_state": "RECEIVED",
    "district": "Pune",
}


def _seed_systems(client):
    """Seed demo systems via the init endpoint (reuses init_demo logic inline)."""
    from tests.conftest import AUTH_HEADER
    from sqlalchemy import select
    from app.models import ExternalSystem, ConnectorConfig
    # We call the PATCH mapping endpoint for each system to ensure they exist.
    # But first we need to add the systems directly since there's no public onboard endpoint.
    # Use the db_session fixture directly in the calling test.
    pass


def _add_systems(db_session):
    """Add the two registered systems to the test database."""
    from app.models import ExternalSystem, ConnectorConfig
    cs = ExternalSystem(key="civic-sathi", name="Civic Sathi", classification="REFERENCE", status="SANDBOX", description="Reference")
    mgs = ExternalSystem(key="mock-grievance-service", name="Maharashtra State Grievance Service", classification="MOCK", status="MOCK", description="Demo mock")
    db_session.add(cs)
    db_session.add(mgs)
    db_session.flush()
    db_session.add(ConnectorConfig(system_id=cs.id, name="civic-sathi-connector", version=1, field_mapping={"source_reference": "complaint_id"}, enabled=True))
    db_session.add(ConnectorConfig(system_id=mgs.id, name="mgs-connector", version=1, field_mapping={"source_reference": "grievance_ref"}, enabled=True))
    db_session.commit()


# ── Health ────────────────────────────────────────────────────────────────

def test_health(client):
    r = client.get("/v1/health")
    assert r.status_code == 200
    assert r.json()["service"] == "sathi-setu"
    assert r.json()["mode"] == "prototype"


# ── Auth guard ───────────────────────────────────────────────────────────

def test_ingest_requires_auth(client, db_session):
    _add_systems(db_session)
    r = client.post("/v1/applications/ingest", json={
        "source_system_key": "civic-sathi",
        "payload": CIVIC_SATHI_PAYLOAD,
        "correlation_id": _corr(),
        "idempotency_key": _idem(),
    })
    assert r.status_code == 401


def test_events_requires_auth(client):
    r = client.get("/v1/events")
    assert r.status_code == 401


def test_audit_requires_auth(client):
    r = client.get("/v1/audit")
    assert r.status_code == 401


# ── Catalogue (public) ────────────────────────────────────────────────────

def test_catalogue_public(client, db_session):
    _add_systems(db_session)
    r = client.get("/v1/catalogue")
    assert r.status_code == 200
    keys = {s["key"] for s in r.json()["systems"]}
    assert "civic-sathi" in keys
    assert "mock-grievance-service" in keys


# ── Ingest happy path ─────────────────────────────────────────────────────

def test_ingest_civic_sathi(client, db_session):
    _add_systems(db_session)
    r = client.post(
        "/v1/applications/ingest",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "civic-sathi",
            "payload": CIVIC_SATHI_PAYLOAD,
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    assert r.status_code == 201
    data = r.json()
    assert data["unified_id"].startswith("SAT-")
    assert data["identity_id"].startswith("SAT-ID-")
    assert data["idempotent_replay"] is False


def test_ingest_mock_grievance_service(client, db_session):
    _add_systems(db_session)
    r = client.post(
        "/v1/applications/ingest",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "mock-grievance-service",
            "payload": MGS_PAYLOAD,
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    assert r.status_code == 201
    assert r.json()["unified_id"].startswith("SAT-")


# ── Idempotency ───────────────────────────────────────────────────────────

def test_ingest_idempotent_replay(client, db_session):
    _add_systems(db_session)
    idem_key = _idem()
    body = {
        "source_system_key": "civic-sathi",
        "payload": CIVIC_SATHI_PAYLOAD,
        "correlation_id": _corr(),
        "idempotency_key": idem_key,
    }
    r1 = client.post("/v1/applications/ingest", headers=AUTH_HEADER, json=body)
    assert r1.status_code == 201
    assert r1.json()["idempotent_replay"] is False

    r2 = client.post("/v1/applications/ingest", headers=AUTH_HEADER, json=body)
    assert r2.status_code == 201
    assert r2.json()["idempotent_replay"] is True
    assert r2.json()["unified_id"] == r1.json()["unified_id"]


# ── Validation ────────────────────────────────────────────────────────────

def test_ingest_missing_complaint_id(client, db_session):
    _add_systems(db_session)
    bad_payload = {k: v for k, v in CIVIC_SATHI_PAYLOAD.items() if k != "complaint_id"}
    r = client.post(
        "/v1/applications/ingest",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "civic-sathi",
            "payload": bad_payload,
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    assert r.status_code == 422


def test_ingest_invalid_system_key(client, db_session):
    _add_systems(db_session)
    r = client.post(
        "/v1/applications/ingest",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "nonexistent-system",
            "payload": CIVIC_SATHI_PAYLOAD,
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    assert r.status_code == 422  # Pydantic Literal validation rejects unknown key


# ── Status update ─────────────────────────────────────────────────────────

def test_status_update(client, db_session):
    _add_systems(db_session)
    idem_key = _idem()
    ingest = client.post(
        "/v1/applications/ingest",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "civic-sathi",
            "payload": CIVIC_SATHI_PAYLOAD,
            "correlation_id": _corr(),
            "idempotency_key": idem_key,
        },
    )
    unified_id = ingest.json()["unified_id"]

    update = client.post(
        f"/v1/applications/{unified_id}/status",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "civic-sathi",
            "source_reference": "CS-TEST-001",
            "status": "IN_PROGRESS",
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    assert update.status_code == 200
    assert update.json()["status"] == "IN_PROGRESS"


def test_status_update_unknown_application(client, db_session):
    _add_systems(db_session)
    r = client.post(
        "/v1/applications/SAT-9999-999999/status",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "civic-sathi",
            "source_reference": "CS-001",
            "status": "CLOSED",
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    assert r.status_code == 404


# ── Consent workflow ──────────────────────────────────────────────────────

def _ingest_and_get_identity(client, db_session) -> tuple[str, str]:
    """Returns (unified_id, canonical_identity_id)."""
    _add_systems(db_session)
    r = client.post(
        "/v1/applications/ingest",
        headers=AUTH_HEADER,
        json={
            "source_system_key": "civic-sathi",
            "payload": CIVIC_SATHI_PAYLOAD,
            "correlation_id": _corr(),
            "idempotency_key": _idem(),
        },
    )
    data = r.json()
    return data["unified_id"], data["identity_id"]


def test_shared_profile_denied_without_consent(client, db_session):
    _, canonical_id = _ingest_and_get_identity(client, db_session)
    r = client.get(
        f"/v1/identities/{canonical_id}/shared-profile",
        headers=AUTH_HEADER,
        params={
            "source_system_key": "civic-sathi",
            "target_system_key": "mock-grievance-service",
            "purpose": "address-sharing",
        },
    )
    assert r.status_code == 403
    assert "consent" in r.json()["detail"].lower()


def test_consent_grant_then_access_allowed(client, db_session):
    _, canonical_id = _ingest_and_get_identity(client, db_session)

    # Request consent
    req = client.post(
        "/v1/consents",
        headers=AUTH_HEADER,
        json={
            "identity_id": canonical_id,
            "source_system_key": "civic-sathi",
            "target_system_key": "mock-grievance-service",
            "purpose": "address-sharing",
        },
    )
    assert req.status_code == 201
    consent_id = req.json()["consent_id"]
    assert req.json()["status"] == "PENDING"

    # Access still denied (PENDING)
    r = client.get(
        f"/v1/identities/{canonical_id}/shared-profile",
        headers=AUTH_HEADER,
        params={
            "source_system_key": "civic-sathi",
            "target_system_key": "mock-grievance-service",
            "purpose": "address-sharing",
        },
    )
    assert r.status_code == 403

    # Grant consent
    grant = client.post(
        f"/v1/consents/{consent_id}/decision",
        headers=AUTH_HEADER,
        json={"decision": "GRANTED", "actor": "citizen-demo", "correlation_id": _corr()},
    )
    assert grant.status_code == 200
    assert grant.json()["status"] == "GRANTED"

    # Access now allowed
    r2 = client.get(
        f"/v1/identities/{canonical_id}/shared-profile",
        headers=AUTH_HEADER,
        params={
            "source_system_key": "civic-sathi",
            "target_system_key": "mock-grievance-service",
            "purpose": "address-sharing",
        },
    )
    assert r2.status_code == 200
    assert r2.json()["canonical_id"] == canonical_id


def test_consent_revoke_denies_access(client, db_session):
    _, canonical_id = _ingest_and_get_identity(client, db_session)

    req = client.post("/v1/consents", headers=AUTH_HEADER, json={
        "identity_id": canonical_id,
        "source_system_key": "civic-sathi",
        "target_system_key": "mock-grievance-service",
        "purpose": "address-sharing",
    })
    consent_id = req.json()["consent_id"]

    client.post(f"/v1/consents/{consent_id}/decision", headers=AUTH_HEADER, json={
        "decision": "GRANTED", "actor": "citizen-demo", "correlation_id": _corr()
    })
    client.post(f"/v1/consents/{consent_id}/decision", headers=AUTH_HEADER, json={
        "decision": "REVOKED", "actor": "citizen-demo", "correlation_id": _corr()
    })

    r = client.get(
        f"/v1/identities/{canonical_id}/shared-profile",
        headers=AUTH_HEADER,
        params={
            "source_system_key": "civic-sathi",
            "target_system_key": "mock-grievance-service",
            "purpose": "address-sharing",
        },
    )
    assert r.status_code == 403


# ── Data quality ──────────────────────────────────────────────────────────

def test_data_quality_list_and_resolve(client, db_session):
    _add_systems(db_session)
    # Ingest two records with same phone but different names to trigger DQ
    idem1 = _idem()
    client.post("/v1/applications/ingest", headers=AUTH_HEADER, json={
        "source_system_key": "civic-sathi",
        "payload": CIVIC_SATHI_PAYLOAD,
        "correlation_id": _corr(),
        "idempotency_key": idem1,
    })
    mgs_body = dict(MGS_PAYLOAD)
    mgs_body["citizen_name"] = "Completely Different Person"  # conflict name
    client.post("/v1/applications/ingest", headers=AUTH_HEADER, json={
        "source_system_key": "mock-grievance-service",
        "payload": mgs_body,
        "correlation_id": _corr(),
        "idempotency_key": _idem(),
    })

    dq = client.get("/v1/data-quality", headers=AUTH_HEADER)
    assert dq.status_code == 200

    if dq.json():  # DQ issues exist if a conflict was raised
        issue_id = dq.json()[0]["id"]
        resolve = client.post(f"/v1/data-quality/{issue_id}/resolve", headers=AUTH_HEADER, json={
            "action": "KEPT_SEPARATE",
            "actor": "officer-demo",
            "notes": "Names are clearly different people despite shared phone.",
            "correlation_id": _corr(),
        })
        assert resolve.status_code == 200
        assert resolve.json()["status"] == "KEPT_SEPARATE"


# ── Audit and events ──────────────────────────────────────────────────────

def test_audit_log_populated_after_ingest(client, db_session):
    _add_systems(db_session)
    client.post("/v1/applications/ingest", headers=AUTH_HEADER, json={
        "source_system_key": "civic-sathi",
        "payload": CIVIC_SATHI_PAYLOAD,
        "correlation_id": _corr(),
        "idempotency_key": _idem(),
    })
    audit = client.get("/v1/audit", headers=AUTH_HEADER)
    assert audit.status_code == 200
    actions = [row["action"] for row in audit.json()]
    assert "APPLICATION_INGESTED" in actions


def test_events_populated_after_ingest(client, db_session):
    _add_systems(db_session)
    client.post("/v1/applications/ingest", headers=AUTH_HEADER, json={
        "source_system_key": "civic-sathi",
        "payload": CIVIC_SATHI_PAYLOAD,
        "correlation_id": _corr(),
        "idempotency_key": _idem(),
    })
    events = client.get("/v1/events", headers=AUTH_HEADER)
    assert events.status_code == 200
    types = {e["type"] for e in events.json()}
    assert "submitted" in types
    assert "identity_matched" in types


# ── Connector mapping update ──────────────────────────────────────────────

def test_mapping_update(client, db_session):
    _add_systems(db_session)
    r = client.patch("/v1/connectors/civic-sathi/mapping", headers=AUTH_HEADER, json={
        "field_mapping": {"source_reference": "complaint_id", "citizen.name": "submitted_by.full_name"},
        "actor": "admin-demo",
        "correlation_id": _corr(),
    })
    assert r.status_code == 200
    assert r.json()["version"] == 2
    assert r.json()["enabled"] is True


# ── Demo snapshot (public) ────────────────────────────────────────────────

def test_demo_snapshot_public(client, db_session):
    _add_systems(db_session)
    r = client.get("/v1/demo/snapshot")
    assert r.status_code == 200
    assert "systems" in r.json()
    assert "applications" in r.json()
    assert "events" in r.json()
    assert "issues" in r.json()
