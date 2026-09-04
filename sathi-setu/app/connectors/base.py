"""Connector contract for independently shaped source systems."""

from abc import ABC, abstractmethod
from typing import Any

from app.schemas import CanonicalApplicationInput


class BaseConnector(ABC):
    system_key: str

    @abstractmethod
    def fetch(self, source_reference: str) -> dict[str, Any]:
        """Fetch a source record. Network implementations belong in deployments."""

    @abstractmethod
    def push(self, application: CanonicalApplicationInput) -> dict[str, Any]:
        """Push a mapped record to the connected system."""

    @abstractmethod
    def map_to_canonical(self, payload: dict[str, Any]) -> CanonicalApplicationInput:
        """Map a source payload into Sathi Setu's canonical application form."""
