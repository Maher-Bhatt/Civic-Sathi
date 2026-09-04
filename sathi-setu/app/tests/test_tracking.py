"""Tests for the unified tracking service."""

from app.models import ExternalSystem, Identity, UnifiedApplication
from app.schemas import CanonicalApplicationInput, CitizenInput
from app.services.tracking_service import add_source_reference, create_unified_application


def _make_system(db, key="civic-sathi") -> ExternalSystem:
    s = ExternalSystem(key=key, name=key, classification="REFERENCE", status="SANDBOX", description="T")
    db.add(s)
    db.flush()
    return s


def _make_identity(db) -> Identity:
    i = Identity(canonical_id="SAT-ID-000001", display_name="Rahul Kumar", match_status="VERIFIED_DEMO")
    db.add(i)
    db.flush()
    return i


def _canonical(src_ref="CS-001") -> CanonicalApplicationInput:
    return CanonicalApplicationInput(
        source_reference=src_ref,
        citizen=CitizenInput(source_identity_id="CIT-1", name="Rahul Kumar"),
        service_type="CIVIC_GRIEVANCE",
        summary="Road pothole near Shivaji Nagar",
        status="SUBMITTED",
        metadata={"city": "Pune"},
    )


class TestCreateUnifiedApplication:
    def test_unified_id_format(self, db_session):
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical())
        parts = app.unified_id.split("-")
        assert parts[0] == "SAT"
        assert parts[1].isdigit() and len(parts[1]) == 4  # year
        assert parts[2].isdigit() and len(parts[2]) == 6  # sequence

    def test_source_records_populated(self, db_session):
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical("CS-001"))
        assert len(app.source_records) == 1
        assert app.source_records[0]["system_key"] == "civic-sathi"
        assert app.source_records[0]["source_reference"] == "CS-001"

    def test_identity_linked(self, db_session):
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical())
        assert app.identity_id == identity.id

    def test_sequential_ids_increment(self, db_session):
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app1 = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical("CS-001"))
        db_session.flush()
        app2 = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical("CS-002"))
        seq1 = int(app1.unified_id.split("-")[2])
        seq2 = int(app2.unified_id.split("-")[2])
        assert seq2 == seq1 + 1

    def test_original_source_ids_preserved(self, db_session):
        """Source IDs must be retained — not replaced — when a unified ID is created."""
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical("CS-123"))
        assert any(r["source_reference"] == "CS-123" for r in app.source_records)
        # Unified ID is a new, additional ID — not a replacement
        assert app.unified_id != "CS-123"


class TestAddSourceReference:
    def test_adds_new_reference(self, db_session):
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical("CS-001"))
        db_session.flush()
        system_b = _make_system(db_session, "mock-grievance-service")
        add_source_reference(app, system_b, "MGS-991")
        assert len(app.source_records) == 2
        keys = {r["system_key"] for r in app.source_records}
        assert "mock-grievance-service" in keys

    def test_does_not_add_duplicate(self, db_session):
        system = _make_system(db_session)
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system, canonical=_canonical("CS-001"))
        db_session.flush()
        add_source_reference(app, system, "CS-001")
        assert len(app.source_records) == 1

    def test_cross_system_linking(self, db_session):
        """The unified ID links to both Civic Sathi and the mock system."""
        system_a = _make_system(db_session, "civic-sathi")
        identity = _make_identity(db_session)
        app = create_unified_application(db_session, identity=identity, source_system=system_a, canonical=_canonical("CS-123"))
        db_session.flush()
        system_b = _make_system(db_session, "mock-grievance-service")
        add_source_reference(app, system_b, "MGS-991")
        source_keys = {r["system_key"] for r in app.source_records}
        assert source_keys == {"civic-sathi", "mock-grievance-service"}
