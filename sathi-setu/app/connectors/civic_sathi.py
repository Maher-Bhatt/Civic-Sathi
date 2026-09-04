"""Connector for the Civic Sathi reference-system payload contract."""

from typing import Any

from app.connectors.base import BaseConnector
from app.schemas import CanonicalApplicationInput, CitizenInput


class CivicSathiConnector(BaseConnector):
    system_key = "civic-sathi"

    def fetch(self, source_reference: str) -> dict[str, Any]:
        raise NotImplementedError("Civic Sathi network access is not configured in this prototype")

    def push(self, application: CanonicalApplicationInput) -> dict[str, Any]:
        raise NotImplementedError("Civic Sathi network access is not configured in this prototype")

    def map_to_canonical(self, payload: dict[str, Any]) -> CanonicalApplicationInput:
        citizen = payload.get("submitted_by") or {}
        return CanonicalApplicationInput(
            source_reference=str(payload["complaint_id"]),
            citizen=CitizenInput(
                source_identity_id=str(citizen["citizen_id"]),
                name=str(citizen["name"]),
                phone=citizen.get("phone"),
                email=citizen.get("email"),
            ),
            service_type="CIVIC_GRIEVANCE",
            summary=str(payload["description"]),
            status=str(payload.get("status", "SUBMITTED")),
            metadata={"category": payload.get("category"), "city": payload.get("city")},
        )
