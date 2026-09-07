"""
Mock Government Department APIs (SIH26129 Interoperability Demonstration)

Simulates sovereign, legacy government departments with heterogeneous schemas:
- Water Supply & Sewerage Board (/api/v1/mock/water)
- Public Works Department - Roads (/api/v1/mock/roads)
- Stormwater Drainage Directorate (/api/v1/mock/drainage)
- Urban Development Department Docket (/api/v1/mock/municipality)
"""

from datetime import datetime, timezone
import random
from typing import Any
from fastapi import APIRouter, HTTPException, status as http_status
from pydantic import BaseModel, Field

router = APIRouter()

# In-memory stores for mock demonstration tickets
_WATER_STORE: dict[str, dict[str, Any]] = {}
_ROADS_STORE: dict[str, dict[str, Any]] = {}
_DRAINAGE_STORE: dict[str, dict[str, Any]] = {}
_MUNICIPALITY_STORE: dict[str, dict[str, Any]] = {}


# ============================================================================
# 1. WATER SUPPLY & SEWERAGE BOARD (MOCK LEGACY SYSTEM)
# ============================================================================

class WaterTicketCreate(BaseModel):
    consumer_k_number: str | None = Field(default="MH-WTR-8831", description="Legacy consumer billing reference")
    pipe_diameter_mm: int = Field(default=150, description="Pipe bore diameter in millimetres")
    leakage_grade: str = Field(default="GRADE_1_CRITICAL", description="GRADE_1_CRITICAL | GRADE_2_MODERATE | GRADE_3_MINOR")
    valve_section_id: str = Field(default="SEC-V12-WEST", description="Isolating valve section ID")
    pressure_loss_psi: float = Field(default=24.5, description="Recorded line pressure drop")
    location_landmark: str = Field(default="SV Road near Bandra Station", description="Incident location")
    reported_by_source: str = Field(default="Sathi Setu Gateway", description="Dispatch source")


@router.post("/water/tickets", status_code=http_status.HTTP_201_CREATED)
def create_water_ticket(ticket: WaterTicketCreate):
    """Legacy Water Board API — creates a water pipeline repair docket with legacy schema."""
    ticket_no = f"WS-{random.randint(10000, 99999)}"
    record = {
        "system_id": "MJP_WATER_BOARD_MH",
        "ticket_no": ticket_no,
        "consumer_k_number": ticket.consumer_k_number,
        "pipe_diameter_mm": ticket.pipe_diameter_mm,
        "leakage_grade": ticket.leakage_grade,
        "valve_section_id": ticket.valve_section_id,
        "pressure_loss_psi": ticket.pressure_loss_psi,
        "location_landmark": ticket.location_landmark,
        "work_status": "DISPATCHED_EXCAVATION",
        "assigned_crew": "Quick Response Plumbing Unit 4",
        "registered_at": datetime.now(timezone.utc).isoformat(),
        "estimated_closure_hours": 18,
        "iso_conformance": "ISO_9001_MUNICIPAL_WATER",
    }
    _WATER_STORE[ticket_no] = record
    return record


@router.get("/water/tickets/{ticket_no}")
def get_water_ticket(ticket_no: str):
    """Query legacy water repair status."""
    if ticket_no not in _WATER_STORE:
        # Generate on the fly for demo resiliency if not yet stored
        return {
            "system_id": "MJP_WATER_BOARD_MH",
            "ticket_no": ticket_no,
            "pipe_diameter_mm": 150,
            "leakage_grade": "GRADE_1_CRITICAL",
            "work_status": "DISPATCHED_EXCAVATION",
            "assigned_crew": "Quick Response Plumbing Unit 4",
            "registered_at": datetime.now(timezone.utc).isoformat(),
            "estimated_closure_hours": 18,
        }
    return _WATER_STORE[ticket_no]


# ============================================================================
# 2. PUBLIC WORKS DEPARTMENT - ROADS (MOCK LEGACY SYSTEM)
# ============================================================================

class RoadWorkOrderCreate(BaseModel):
    pwd_division: str = Field(default="DIV-MUMBAI-SUBURBAN-02", description="PWD territorial division")
    road_classification: str = Field(default="MAJOR_DISTRICT_ROAD", description="EXPRESSWAY | STATE_HIGHWAY | MAJOR_DISTRICT_ROAD | ARTERIAL")
    chainage_km: float = Field(default=14.2, description="Road chainage milestone in kilometres")
    pothole_area_sqm: float = Field(default=8.5, description="Damaged surface area in square metres")
    contractor_licence_no: str = Field(default="PWD-MH-CL1-2024-991", description="Registered roadworks contractor licence")
    asphalt_mix_grade: str = Field(default="VG30_BITUMEN_CONCRETE", description="Specified asphalt grade")
    dependency_prerequisite: str | None = Field(default="WS-92821", description="Upstream utility clearance prerequisite")


@router.post("/roads/work-orders", status_code=http_status.HTTP_201_CREATED)
def create_road_work_order(order: RoadWorkOrderCreate):
    """Legacy PWD Roads API — registers an engineering work package with PWD schema."""
    work_order_num = f"RD-{random.randint(10000, 99999)}"
    record = {
        "system_id": "PWD_MAHARASHTRA_ROADS",
        "work_order_num": work_order_num,
        "pwd_division": order.pwd_division,
        "road_classification": order.road_classification,
        "chainage_km": order.chainage_km,
        "pothole_area_sqm": order.pothole_area_sqm,
        "asphalt_mix_grade": order.asphalt_mix_grade,
        "contractor_licence_no": order.contractor_licence_no,
        "dependency_prerequisite": order.dependency_prerequisite,
        "job_stage": "HELD_PENDING_UTILITY_BACKFILL" if order.dependency_prerequisite else "CONTRACTOR_MOBILIZED",
        "estimated_closure_hours": 30,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _ROADS_STORE[work_order_num] = record
    return record


@router.get("/roads/work-orders/{work_order_num}")
def get_road_work_order(work_order_num: str):
    """Query legacy PWD work order status."""
    if work_order_num not in _ROADS_STORE:
        return {
            "system_id": "PWD_MAHARASHTRA_ROADS",
            "work_order_num": work_order_num,
            "pwd_division": "DIV-MUMBAI-SUBURBAN-02",
            "pothole_area_sqm": 8.5,
            "job_stage": "HELD_PENDING_UTILITY_BACKFILL",
            "estimated_closure_hours": 30,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    return _ROADS_STORE[work_order_num]


# ============================================================================
# 3. STORMWATER DRAINAGE DIRECTORATE (MOCK LEGACY SYSTEM)
# ============================================================================

class DrainageJobCreate(BaseModel):
    drain_catchment_zone: str = Field(default="CATCHMENT-MUM-NORTH-04", description="Stormwater drainage basin code")
    culvert_id: str = Field(default="CLV-881-SV", description="Culvert identifier")
    silt_depth_cm: float = Field(default=45.0, description="Accumulated silt depth in centimetres")
    super_sucker_required: bool = Field(default=True, description="Whether vacuum de-silting is needed")


@router.post("/drainage/jobs", status_code=http_status.HTTP_201_CREATED)
def create_drainage_job(job: DrainageJobCreate):
    """Legacy Stormwater Drainage API — registers a de-silting and culvert clearance job."""
    job_id = f"DR-{random.randint(10000, 99999)}"
    record = {
        "system_id": "SWD_DIRECTORATE_MH",
        "job_id": job_id,
        "drain_catchment_zone": job.drain_catchment_zone,
        "culvert_id": job.culvert_id,
        "silt_depth_cm": job.silt_depth_cm,
        "super_sucker_assigned": job.super_sucker_required,
        "clearance_status": "DE_SILTING_CREW_EN_ROUTE",
        "estimated_closure_hours": 12,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _DRAINAGE_STORE[job_id] = record
    return record


@router.get("/drainage/jobs/{job_id}")
def get_drainage_job(job_id: str):
    """Query legacy drainage job status."""
    if job_id not in _DRAINAGE_STORE:
        return {
            "system_id": "SWD_DIRECTORATE_MH",
            "job_id": job_id,
            "clearance_status": "DE_SILTING_CREW_EN_ROUTE",
            "estimated_closure_hours": 12,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    return _DRAINAGE_STORE[job_id]


# ============================================================================
# 4. URBAN DEVELOPMENT UNIFIED DOCKET (MOCK LEGACY SYSTEM)
# ============================================================================

@router.get("/overview")
def get_mock_systems_overview():
    """Returns status and latency of connected mock departmental systems."""
    return {
        "connected_systems": [
            {
                "key": "water_board",
                "name": "Maharashtra Water Supply & Sewerage Board",
                "department": "Water Supply",
                "status": "ONLINE",
                "api_endpoint": "/api/v1/mock/water",
                "latency_ms": 42,
                "active_tickets_count": len(_WATER_STORE) + 14,
            },
            {
                "key": "pwd_roads",
                "name": "Public Works Department (PWD Roads)",
                "department": "Roads & Infrastructure",
                "status": "ONLINE",
                "api_endpoint": "/api/v1/mock/roads",
                "latency_ms": 38,
                "active_tickets_count": len(_ROADS_STORE) + 29,
            },
            {
                "key": "swd_drainage",
                "name": "Stormwater Drainage Directorate",
                "department": "Drainage & Flood Control",
                "status": "ONLINE",
                "api_endpoint": "/api/v1/mock/drainage",
                "latency_ms": 55,
                "active_tickets_count": len(_DRAINAGE_STORE) + 8,
            },
            {
                "key": "power_grid",
                "name": "Maharashtra State Electricity Distribution (MSEDCL)",
                "department": "Electricity",
                "status": "ONLINE",
                "api_endpoint": "/api/v1/mock/electricity",
                "latency_ms": 61,
                "active_tickets_count": 17,
            },
        ]
    }
