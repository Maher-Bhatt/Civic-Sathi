"""Independent mock system connector.  This is never a government integration."""

from typing import Any

from app.connectors.base import BaseConnector
from app.schemas import CanonicalApplicationInput, CitizenInput


class MockLegacyPortalConnector(BaseConnector):
    system_key = "mock-grievance-service"

    def fetch(self, source_reference: str) -> dict[str, Any]:
        raise NotImplementedError("The mock system exposes no remote fetch endpoint in this prototype")

    def push(self, application: CanonicalApplicationInput) -> dict[str, Any]:
        return {"grievance_ref": f"MGS-LINK-{application.source_reference}"}

    def map_to_canonical(self, payload: dict[str, Any]) -> CanonicalApplicationInput:
        return CanonicalApplicationInput(
            source_reference=str(payload["grievance_ref"]),
            citizen=CitizenInput(
                source_identity_id=str(payload["legacy_citizen_ref"]),
                name=str(payload["citizen_name"]),
                phone=payload.get("mobile_no"),
                email=payload.get("contact_email"),
            ),
            service_type="CIVIC_GRIEVANCE",
            summary=str(payload["complaint_text"]),
            status=str(payload.get("case_state", "RECEIVED")),
            metadata={"district": payload.get("district"), "legacy_priority": payload.get("priority")},
        )
