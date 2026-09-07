"""
End-to-End Test for Phase 1 Master Case & Interoperability Flow
Verifies:
1. Multi-Department AI Analysis (Water + Roads detection & sequencing)
2. Master Case creation with child department fanout
3. Digital Case Passport inspection & dependency blocking check
4. Upstream completion simulation & automated downstream unblocking
5. Mock government legacy department endpoints
"""

import sys
import asyncio
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import SessionLocal
from app.models.case import CivicCase, CaseDepartment


def run_tests():
    print("\n--- Starting SIH26129 Phase 1 Automated Verification ---\n")
    client = TestClient(app)

    # 1. Test Mock Department Endpoints
    print("1. Testing Mock Government Department APIs...")
    res = client.get("/api/v1/mock/overview")
    assert res.status_code == 200, f"Mock overview failed: {res.text}"
    overview = res.json()
    assert len(overview["connected_systems"]) >= 3, "Expected at least 3 connected mock systems"
    print(f"   [OK] Mock systems overview active: {[s['name'] for s in overview['connected_systems']]}")

    water_res = client.post(
        "/api/v1/mock/water/tickets",
        json={
            "consumer_k_number": "MH-WTR-99201",
            "pipe_diameter_mm": 200,
            "leakage_grade": "GRADE_1_CRITICAL",
            "valve_section_id": "VALVE-SEC-BNDR-4",
            "pressure_loss_psi": 32.0,
            "location_landmark": "SV Road, Bandra West, Mumbai",
        },
    )
    assert water_res.status_code == 201, f"Water ticket creation failed: {water_res.text}"
    water_ticket = water_res.json()
    assert water_ticket["ticket_no"].startswith("WS-")
    print(f"   [OK] Water Board API created ticket: {water_ticket['ticket_no']}")

    road_res = client.post(
        "/api/v1/mock/roads/work-orders",
        json={
            "pwd_division": "DIV-MUMBAI-SUBURBAN-02",
            "road_classification": "MAJOR_DISTRICT_ROAD",
            "chainage_km": 14.2,
            "pothole_area_sqm": 12.0,
            "contractor_licence_no": "PWD-MH-CL1-2024-991",
            "dependency_prerequisite": water_ticket["ticket_no"],
        },
    )
    assert road_res.status_code == 201, f"Road work order creation failed: {road_res.text}"
    road_order = road_res.json()
    assert road_order["work_order_num"].startswith("RD-")
    print(f"   [OK] PWD Roads API created work order: {road_order['work_order_num']} (Stage: {road_order['job_stage']})")

    # 2. Test Multi-Department AI Analysis
    print("\n2. Testing Multi-Department AI Case Composer (/api/v1/ai/analyze-case)...")
    ai_payload = {
        "title": "Severe Water Main Rupture with Road Crater",
        "description": "High pressure water pipe has ruptured under SV Road near Bandra. A massive 3-meter pothole crater has opened, water is gushing into the street, and vehicles are swerving dangerously.",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "city": "Mumbai",
    }
    ai_res = client.post("/api/v1/ai/analyze-case", json=ai_payload)
    assert ai_res.status_code == 200, f"AI analysis failed: {ai_res.text}"
    analysis = ai_res.json()

    print(f"   [OK] AI Severity: {analysis['severity']}, Priority: {analysis['priority']}")
    print(f"   [OK] AI Root Cause: {analysis['root_cause']}")
    print(f"   [OK] Preventive Warning: {analysis['preventive_warning']}")

    depts = analysis["departments"]
    assert len(depts) >= 2, f"Expected multi-department fanout, got {len(depts)}"
    dept_codes = [d["department_code"] for d in depts]
    assert "water" in dept_codes, "Water department must be identified"
    assert "roads" in dept_codes, "Roads department must be identified"

    water_dept_plan = next(d for d in depts if d["department_code"] == "water")
    road_dept_plan = next(d for d in depts if d["department_code"] == "roads")

    assert water_dept_plan["sequence_order"] < road_dept_plan["sequence_order"], "Water repair must precede Road repair"
    print(f"   [OK] Sequence verified: Water (Seq {water_dept_plan['sequence_order']}) -> Roads (Seq {road_dept_plan['sequence_order']})")

    # 3. Test Master Case Creation
    print("\n3. Testing Master Case Creation (/api/v1/cases)...")
    create_payload = {
        "title": ai_payload["title"],
        "description": ai_payload["description"],
        "latitude": ai_payload["latitude"],
        "longitude": ai_payload["longitude"],
        "city": "Mumbai",
        "address_text": "SV Road, Bandra West, Mumbai",
        "pre_analyzed_routing": analysis,
    }
    create_res = client.post("/api/v1/cases", json=create_payload)
    assert create_res.status_code == 201, f"Case creation failed: {create_res.text}"
    case_out = create_res.json()

    case_id = case_out["id"]
    case_number = case_out["case_number"]
    print(f"   [OK] Master Case created: {case_number} (ID: {case_id})")
    assert case_number.startswith("MH-")
    assert len(case_out["departments"]) >= 2

    # Check child departments and dependency block
    created_water = next(d for d in case_out["departments"] if d["department_code"] == "water")
    created_road = next(d for d in case_out["departments"] if d["department_code"] == "roads")

    print(f"   [OK] Child Ticket 1: {created_water['department_name']} ({created_water['external_ticket_id']}) Status={created_water['status']}, Blocked={created_water['is_blocked']}")
    print(f"   [DEBUG] Water ID: {created_water['id']}, Road ID: {created_road['id']}, Road dep_id: {created_road.get('dependency_case_dept_id')}")
    assert created_water["is_blocked"] is False, "Water repair should NOT be blocked"

    assert created_road["is_blocked"] is True, "Road repair MUST be blocked until Water completes"
    assert created_road["status"] == "WAITING", "Road status should be WAITING"

    # 4. Test Digital Case Passport Query
    print("\n4. Testing Digital Case Passport Fetch (/api/v1/cases/{case_number})...")
    passport_res = client.get(f"/api/v1/cases/{case_number}")
    assert passport_res.status_code == 200, f"Fetch passport failed: {passport_res.text}"
    passport = passport_res.json()
    assert passport["case_number"] == case_number
    assert len(passport["timeline"]) >= 2
    print(f"   [OK] Case Passport loaded successfully with {len(passport['timeline'])} timeline milestones")

    # 5. Test Live Upstream Completion Simulation & Automated Downstream Unblocking
    print("\n5. Testing Live Upstream Completion & Automated Unblocking...")
    complete_res = client.post(
        f"/api/v1/cases/{case_id}/departments/{created_water['id']}/simulate-complete",
        params={"notes": "Emergency weld completed. Water line pressure tested at 65 psi. Utility trench backfilled."},
    )
    assert complete_res.status_code == 200, f"Completion simulation failed: {complete_res.text}"
    updated_case = complete_res.json()

    updated_water = next(d for d in updated_case["departments"] if d["department_code"] == "water")
    updated_road = next(d for d in updated_case["departments"] if d["department_code"] == "roads")

    print(f"   [OK] Post-Update Water Status: {updated_water['status']} (Completed: {updated_water['completed_at']})")
    print(f"   [OK] Post-Update Road Status: {updated_road['status']}, Blocked={updated_road['is_blocked']}")

    assert updated_water["status"] == "COMPLETED"
    assert updated_road["status"] == "READY_FOR_REPAIR", "Road department ticket must transition to READY_FOR_REPAIR!"
    assert updated_road["is_blocked"] is False, "Road department ticket must be unblocked!"

    latest_event = updated_case["timeline"][-1]
    print(f"   [OK] Timeline Event Added: '{latest_event['title']}' - {latest_event['description']}")

    print("\n========================================================")
    print(" ALL SIH26129 PHASE 1 BACKEND VERIFICATIONS PASSED! [100%]")
    print("========================================================\n")


if __name__ == "__main__":
    run_tests()
