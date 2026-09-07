"""Pydantic schemas for Phase 2 Interoperability & Event Orchestration"""

from datetime import datetime
from typing import Any
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class IntegrationEventIn(BaseModel):
    event_id: str | None = Field(default=None, description="Idempotency or external event UUID")
    event_type: str = Field(
        ...,
        description="Event classification e.g. WORK_ORDER_COMPLETED, UTILITY_BACKFILLED, STATUS_UPDATE",
    )
    source_system: str = Field(
        ...,
        description="Originating sovereign system key e.g. 'water_board', 'pwd_roads', 'swd_drainage'",
    )
    target_system: str | None = Field(
        default=None,
        description="Destination system key e.g. 'sathi_setu', 'pwd_roads'",
    )
    case_number: str | None = Field(default=None, description="Master case number e.g. MH-MCGM-2026-080596")
    case_id: UUID | None = Field(default=None, description="Master case UUID")
    external_ticket_id: str | None = Field(default=None, description="Department external ticket e.g. WS-32025")
    department_code: str = Field(..., description="Department code e.g. 'water', 'roads', 'drainage'")
    status: str = Field(..., description="Updated ticket status e.g. 'COMPLETED', 'READY_FOR_REPAIR'")
    notes: str | None = Field(default=None, description="Engineering notes or inspection remarks")
    actor: str | None = Field(default=None, description="Officer or automated system actor")
    telemetry: dict[str, Any] | None = Field(
        default=None,
        description="Physical telemetry metrics e.g. {'pressure_psi': 65, 'pipe_dia_mm': 150}",
    )


class IntegrationEventOut(BaseModel):
    event_id: str
    status: str = "PROCESSED"
    processed_at: datetime
    unblocked_departments: list[str] = []
    case_status: str | None = None
    timeline_event_id: str | None = None
    message: str = "Integration event ingested and dependency rules evaluated."


class SystemHealthOut(BaseModel):
    system_key: str
    name: str
    protocol: str
    endpoint_url: str
    status: str  # ONLINE, STANDBY, HEALTHY, DEGRADED
    latency_ms: float
    uptime_percent: float
    total_events_synced: int
    last_sync_at: str | None = None
    supported_schemas: list[str] = []
    schema_mapping_preview: dict[str, str] = {}


class LiveTransitMessage(BaseModel):
    id: str
    timestamp: str
    source: str
    target: str
    event_type: str
    summary: str
    case_number: str | None = None
    status: str = "success"
    payload: dict[str, Any] | None = None
