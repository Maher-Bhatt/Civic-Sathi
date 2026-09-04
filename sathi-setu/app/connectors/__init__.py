"""Registered prototype connectors."""

from app.connectors.base import BaseConnector
from app.connectors.civic_sathi import CivicSathiConnector
from app.connectors.mock_legacy import MockLegacyPortalConnector

CONNECTORS: dict[str, BaseConnector] = {
    CivicSathiConnector.system_key: CivicSathiConnector(),
    MockLegacyPortalConnector.system_key: MockLegacyPortalConnector(),
}


def get_connector(system_key: str) -> BaseConnector:
    try:
        return CONNECTORS[system_key]
    except KeyError as exc:
        raise ValueError(f"No connector is registered for {system_key}") from exc
