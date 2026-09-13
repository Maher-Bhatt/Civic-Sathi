"""State Command Center Service — Govt. of Maharashtra (SIH26129).

Aggregates state-wide telemetry across 27 Municipal Corporations, 143 Sovereign Departments,
and Sathi Setu Interoperability Brokers.
"""

from typing import Any, Dict, List
from datetime import datetime, timezone


PLATFORM_CITIES = [
    {
        "id": "mcgm",
        "name": "Brihanmumbai Municipal Corporation (BMC)",
        "city": "Mumbai",
        "division": "Maharashtra",
        "lat": 18.9402,
        "lng": 72.8347,
        "active_cases": 4210,
        "resolved_rate": 93.8,
        "connected_depts": 8,
        "critical_cascades": 28,
        "taxpayer_savings_cr": 1.45,
        "status": "HEALTHY",
    },
    {
        "id": "vmc",
        "name": "Vadodara Municipal Corporation (VMC)",
        "city": "Vadodara",
        "division": "Gujarat",
        "lat": 22.3072,
        "lng": 73.1812,
        "active_cases": 2890,
        "resolved_rate": 95.1,
        "connected_depts": 7,
        "critical_cascades": 16,
        "taxpayer_savings_cr": 0.98,
        "status": "HEALTHY",
    },
    {
        "id": "bbmp",
        "name": "Bruhat Bengaluru Mahanagara Palike (BBMP)",
        "city": "Bengaluru",
        "division": "Karnataka",
        "lat": 12.9716,
        "lng": 77.5946,
        "active_cases": 3540,
        "resolved_rate": 89.2,
        "connected_depts": 9,
        "critical_cascades": 35,
        "taxpayer_savings_cr": 1.12,
        "status": "ATTENTION_REQUIRED",
    },
    {
        "id": "mcd",
        "name": "Municipal Corporation of Delhi (MCD)",
        "city": "Delhi",
        "division": "NCT Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "active_cases": 5120,
        "resolved_rate": 91.5,
        "connected_depts": 12,
        "critical_cascades": 42,
        "taxpayer_savings_cr": 2.15,
        "status": "HEALTHY",
    },
]

DIGITAL_TWIN_CRITICAL_INCIDENTS = [
    {
        "id": "MH-MCGM-2026-080596",
        "city": "Mumbai",
        "ward": "Ward H-West (Bandra West)",
        "title": "High-Pressure Water Conduit Rupture & Road Subsidence",
        "location": "SV Road, Near Bandra Station West",
        "lat": 19.0596,
        "lng": 72.8295,
        "severity": "CRITICAL",
        "priority": "P1",
        "status": "SEQUENCED_ORCHESTRATION",
        "departments": ["Water Supply Board", "PWD Roads Division"],
        "cost_multiplier": 12.3,
        "affected_citizens": 42500,
        "impact_radius_km": 1.85,
    },
    {
        "id": "MH-PMC-2026-114920",
        "city": "Pune",
        "ward": "Kothrud Ward 12",
        "title": "Stormwater Culvert Collapse Threatening Power Substation",
        "location": "Paud Road, Kothrud",
        "lat": 18.5074,
        "lng": 73.8077,
        "severity": "HIGH",
        "priority": "P1",
        "status": "AWAITING_DRAINAGE_DESILT",
        "departments": ["Stormwater Drainage", "MSEDCL Power Distribution", "PMC Roads"],
        "cost_multiplier": 8.5,
        "affected_citizens": 28000,
        "impact_radius_km": 1.4,
    },
    {
        "id": "MH-NMC-2026-092184",
        "city": "Nagpur",
        "ward": "Dharampeth Zone",
        "title": "Main Feeder Pipeline Burst Beneath Arterial Junction",
        "location": "Amravati Road Junction",
        "lat": 21.1524,
        "lng": 79.0558,
        "severity": "HIGH",
        "priority": "P2",
        "status": "WATER_CREW_DEPLOYED",
        "departments": ["Water Board", "NMC PWD"],
        "cost_multiplier": 6.2,
        "affected_citizens": 19200,
        "impact_radius_km": 0.95,
    },
    {
        "id": "MH-TMC-2026-041928",
        "city": "Thane",
        "ward": "Naupada-Kopri Ward",
        "title": "Subgrade Soil Erosion Under Flyover Pier",
        "location": "Gokhale Road, Thane West",
        "lat": 19.1902,
        "lng": 72.9734,
        "severity": "CRITICAL",
        "priority": "P1",
        "status": "EMERGENCY_SHORING",
        "departments": ["MMRDA Infrastructure", "PWD Bridges", "Thane Water"],
        "cost_multiplier": 14.1,
        "affected_citizens": 65000,
        "impact_radius_km": 2.2,
    },
]


def get_state_command_center_telemetry() -> Dict[str, Any]:
    """
    Returns state-wide aggregated command center intelligence for the Government of Maharashtra.
    """
    total_active = sum(c["active_cases"] for c in PLATFORM_CITIES)
    avg_resolution = round(
        sum(c["resolved_rate"] for c in PLATFORM_CITIES) / len(PLATFORM_CITIES), 1
    )
    total_savings_cr = round(sum(c["taxpayer_savings_cr"] for c in PLATFORM_CITIES), 2)
    total_critical = sum(c["critical_cascades"] for c in PLATFORM_CITIES)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "state_name": "National",
        "protocol": "SIH26129 Macro Interoperability Standard",
        "architecture": "MeitY API Setu / Estonia X-Road Sovereign Gateway",
        "summary": {
            "total_municipal_corporations": 4,
            "monitored_municipalities": len(PLATFORM_CITIES),
            "total_sovereign_departments": 36,
            "total_active_cases": total_active,
            "average_resolution_rate": avg_resolution,
            "critical_systemic_cascades": total_critical,
            "average_inter_agency_latency_ms": 34.2,
            "estimated_taxpayer_savings_cr": total_savings_cr,
            "sla_compliance_rate": 92.6,
        },
        "corporations": PLATFORM_CITIES,
        "critical_incidents": DIGITAL_TWIN_CRITICAL_INCIDENTS,
        "digital_twin_layers": [
            {
                "id": "critical_cascades",
                "name": "Critical Inter-Agency Cascades",
                "count": total_critical,
                "color": "#F43F5E",
            },
            {
                "id": "active_work_orders",
                "name": "Sovereign Work Orders in Transit",
                "count": total_active,
                "color": "#0A369D",
            },
            {
                "id": "risk_perimeters",
                "name": "Predicted Collapse Risk Perimeters",
                "count": len(DIGITAL_TWIN_CRITICAL_INCIDENTS),
                "color": "#FF6F00",
            },
        ],
    }
