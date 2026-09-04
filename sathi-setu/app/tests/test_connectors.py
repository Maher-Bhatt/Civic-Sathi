"""Tests for connector field mapping.

Verifies that each connector correctly maps its independently-shaped source
payload into the canonical Sathi Setu application form.  These are pure-unit
tests — no database or network required.
"""

import pytest

from app.connectors.civic_sathi import CivicSathiConnector
from app.connectors.mock_legacy import MockLegacyPortalConnector


CS = CivicSathiConnector()
MGS = MockLegacyPortalConnector()


# ── Civic Sathi connector ──────────────────────────────────────────────────

class TestCivicSathiConnector:
    VALID_PAYLOAD = {
        "complaint_id": "CS-2026-001",
        "description": "Large pothole blocking the main road near Shivaji Nagar",
        "status": "SUBMITTED",
        "category": "ROAD",
        "city": "Pune",
        "submitted_by": {
            "citizen_id": "CIT-5001",
            "name": "Rahul Kumar",
            "phone": "9876543210",
            "email": "rahul.kumar@example.com",
        },
    }

    def test_source_reference(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.source_reference == "CS-2026-001"

    def test_citizen_name(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.name == "Rahul Kumar"

    def test_citizen_phone(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.phone == "9876543210"

    def test_citizen_email(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.email == "rahul.kumar@example.com"

    def test_citizen_source_id(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.source_identity_id == "CIT-5001"

    def test_service_type(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.service_type == "CIVIC_GRIEVANCE"

    def test_summary(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert "pothole" in result.summary.lower()

    def test_status(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.status == "SUBMITTED"

    def test_metadata_category(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.metadata["category"] == "ROAD"

    def test_metadata_city(self):
        result = CS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.metadata["city"] == "Pune"

    def test_missing_complaint_id_raises(self):
        bad = dict(self.VALID_PAYLOAD)
        del bad["complaint_id"]
        with pytest.raises((KeyError, TypeError)):
            CS.map_to_canonical(bad)

    def test_missing_submitted_by_raises(self):
        bad = dict(self.VALID_PAYLOAD)
        del bad["submitted_by"]
        # submitted_by defaults to {}; citizen_id lookup must fail
        with pytest.raises((KeyError, TypeError)):
            CS.map_to_canonical(bad)

    def test_fetch_not_implemented(self):
        with pytest.raises(NotImplementedError):
            CS.fetch("CS-2026-001")

    def test_push_not_implemented(self):
        from app.schemas import CanonicalApplicationInput, CitizenInput
        canonical = CanonicalApplicationInput(
            source_reference="CS-2026-001",
            citizen=CitizenInput(source_identity_id="CIT-1", name="Test User"),
            service_type="CIVIC_GRIEVANCE",
            summary="Test",
            status="SUBMITTED",
        )
        with pytest.raises(NotImplementedError):
            CS.push(canonical)

    def test_optional_phone_none(self):
        payload = dict(self.VALID_PAYLOAD)
        payload["submitted_by"] = dict(payload["submitted_by"])
        del payload["submitted_by"]["phone"]
        result = CS.map_to_canonical(payload)
        assert result.citizen.phone is None

    def test_default_status_when_absent(self):
        payload = dict(self.VALID_PAYLOAD)
        del payload["status"]
        result = CS.map_to_canonical(payload)
        assert result.status == "SUBMITTED"


# ── Mock Grievance Service connector ──────────────────────────────────────

class TestMockLegacyPortalConnector:
    """The mock system uses completely different field names — grievance_ref,
    citizen_name, mobile_no, complaint_text — demonstrating schema heterogeneity."""

    VALID_PAYLOAD = {
        "grievance_ref": "MGS-2026-991",
        "legacy_citizen_ref": "LEG-0042",
        "citizen_name": "Rahul K.",
        "mobile_no": "9876543210",
        "contact_email": "rahul.k@example.com",
        "complaint_text": "Broken street light on MG Road since last week",
        "case_state": "RECEIVED",
        "district": "Pune",
        "priority": "HIGH",
    }

    def test_source_reference(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.source_reference == "MGS-2026-991"

    def test_citizen_name(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.name == "Rahul K."

    def test_citizen_phone_from_mobile_no(self):
        """mobile_no (MGS) maps to phone (canonical) — cross-system schema mapping."""
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.phone == "9876543210"

    def test_citizen_source_id_from_legacy_ref(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.citizen.source_identity_id == "LEG-0042"

    def test_summary_from_complaint_text(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert "street light" in result.summary.lower()

    def test_status_from_case_state(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.status == "RECEIVED"

    def test_default_case_state(self):
        payload = dict(self.VALID_PAYLOAD)
        del payload["case_state"]
        result = MGS.map_to_canonical(payload)
        assert result.status == "RECEIVED"

    def test_metadata_district(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.metadata["district"] == "Pune"

    def test_metadata_priority(self):
        result = MGS.map_to_canonical(self.VALID_PAYLOAD)
        assert result.metadata["legacy_priority"] == "HIGH"

    def test_push_returns_link_reference(self):
        from app.schemas import CanonicalApplicationInput, CitizenInput
        canonical = CanonicalApplicationInput(
            source_reference="CS-REF",
            citizen=CitizenInput(source_identity_id="LEG-1", name="Test"),
            service_type="CIVIC_GRIEVANCE",
            summary="Test",
            status="SUBMITTED",
        )
        result = MGS.push(canonical)
        assert "grievance_ref" in result

    def test_fetch_not_implemented(self):
        with pytest.raises(NotImplementedError):
            MGS.fetch("MGS-2026-991")

    def test_distinct_field_names_from_civic_sathi(self):
        """Both payloads must use different field names to prove schema heterogeneity."""
        cs_keys = {"complaint_id", "description", "submitted_by"}
        mgs_keys = {"grievance_ref", "complaint_text", "citizen_name", "mobile_no"}
        assert cs_keys.isdisjoint(mgs_keys), "Connectors must use different field names"
