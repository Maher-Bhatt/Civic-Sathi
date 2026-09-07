"""
Automated End-to-End Verification Test for Phase 2:
Interoperability, Event Orchestration & Live Stream (SIH26129)
"""

import os
import sys

# Ensure backend root is on Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_tests():
    print("\n--- Starting SIH26129 Phase 2 Automated Verification ---\n")

    # 1. Verify Connected Sovereign Systems Catalogue
    print("1. Testing Connected Systems Catalogue (/api/v1/integrations/systems)...")
    res = client.get("/api/v1/integrations/systems")
    assert res.status_code == 200, f"Failed to fetch systems: {res.text}"
    systems = res.json()
    assert len(systems) == 6, f"Expected 6 sovereign systems, got {len(systems)}"
    system_keys = {s["system_key"] for s in systems}
    expected_keys = {"water_board", "pwd_roads", "swd_drainage", "power_grid", "mcgm_portal", "sathi_setu"}
    assert expected_keys.issubset(system_keys), f"Missing keys: {expected_keys - system_keys}"
    print(f"   [OK] 6 Sovereign Systems verified: {list(system_keys)}")

    # 2. Verify Active Handshake Ping
    print("\n2. Testing Active Handshake Ping (/api/v1/integrations/systems/water_board/ping)...")
    ping_res = client.post("/api/v1/integrations/systems/water_board/ping")
    assert ping_res.status_code == 200, f"Ping failed: {ping_res.text}"
    ping_data = ping_res.json()
    assert ping_data["status"] == "ONLINE"
    assert ping_data["latency_ms"] > 0
    print(f"   [OK] Handshake verified: {ping_data['name']} (Latency: {ping_data['latency_ms']}ms, Protocol: {ping_data['protocol']})")

    # 3. Create a Master Case with Dependent Departments
    print("\n3. Creating Dual-Department Master Case for Ingest Trigger Test...")
    create_payload = {
        "title": "Water Main Burst & Asphalt Cave-in for Event Trigger Test",
        "description": "High-pressure municipal water main fissure has destabilized road foundation on SV Road. Water repair must precede road repaving.",
        "city": "Mumbai",
        "address_text": "SV Road, Bandra West, Mumbai",
    }
    create_res = client.post("/api/v1/cases", json=create_payload)
    assert create_res.status_code == 201, f"Failed to create case: {create_res.text}"
    case = create_res.json()
    case_number = case["case_number"]
    case_id = case["id"]

    water_dept = next(d for d in case["departments"] if d["department_code"] == "water")
    road_dept = next(d for d in case["departments"] if d["department_code"] == "roads")
    assert road_dept["is_blocked"] is True, "Road repair should initially be blocked by water"
    print(f"   [OK] Master Case created: {case_number} (Water: {water_dept['status']}, Roads: {road_dept['status']}, Blocked: {road_dept['is_blocked']})")

    # 4. Test External Webhook Ingestion with Dependency Auto-Trigger
    print("\n4. Testing External Webhook Ingestion (/api/v1/integrations/events)...")
    webhook_payload = {
        "event_type": "UTILITY_BACKFILLED",
        "source_system": "water_board",
        "target_system": "sathi_setu",
        "case_number": case_number,
        "case_id": case_id,
        "external_ticket_id": water_dept["external_ticket_id"],
        "department_code": "water",
        "status": "COMPLETED",
        "notes": "Emergency sleeve weld complete. 65 psi pressure test passed. Utility trench aggregate backfilled.",
        "telemetry": {"pressure_psi": 65, "pipe_dia_mm": 150, "backfill_verified": True},
    }
    event_res = client.post("/api/v1/integrations/events", json=webhook_payload)
    assert event_res.status_code == 200, f"Event ingestion failed: {event_res.text}"
    event_out = event_res.json()
    assert event_out["status"] == "PROCESSED"
    assert len(event_out["unblocked_departments"]) > 0, "Expected downstream road dept to be unblocked"
    print(f"   [OK] Webhook Ingested: Event {event_out['event_id']}")
    print(f"   [OK] Downstream Departments Automatically Unblocked: {event_out['unblocked_departments']}")

    # Check that database case passport now reflects unblocked road
    passport_res = client.get(f"/api/v1/cases/{case_number}")
    assert passport_res.status_code == 200
    updated_passport = passport_res.json()
    updated_water = next(d for d in updated_passport["departments"] if d["department_code"] == "water")
    updated_road = next(d for d in updated_passport["departments"] if d["department_code"] == "roads")

    assert updated_water["status"] == "COMPLETED"
    assert updated_road["status"] == "READY_FOR_REPAIR"
    assert updated_road["is_blocked"] is False
    print(f"   [OK] Passport State Verified: Water={updated_water['status']}, Roads={updated_road['status']} (Blocked: {updated_road['is_blocked']})")

    # 5. Verify Recent Events Ring Buffer
    print("\n5. Testing Recent Events Feed (/api/v1/integrations/events/recent)...")
    recent_res = client.get("/api/v1/integrations/events/recent?limit=10")
    assert recent_res.status_code == 200
    recent_events = recent_res.json()
    assert len(recent_events) >= 1
    print(f"   [OK] Recent events retrieved ({len(recent_events)} in buffer)")

    # 6. Test 6-Stage Handoff Simulation Scenario
    print("\n6. Testing Multi-Agency Handoff Simulation (/api/v1/integrations/simulate-handoff)...")
    handoff_res = client.post(f"/api/v1/integrations/simulate-handoff?case_number={case_number}&speed_factor=3.0")
    assert handoff_res.status_code == 200
    handoff_data = handoff_res.json()
    assert handoff_data["status"] == "COMPLETED"
    assert handoff_data["stages_executed"] == 6
    print(f"   [OK] 6-Step Cross-Agency Handoff successfully executed!")

    print("\n========================================================")
    print(" ALL SIH26129 PHASE 2 BACKEND VERIFICATIONS PASSED! [100%]")
    print("========================================================\n")


if __name__ == "__main__":
    run_tests()
