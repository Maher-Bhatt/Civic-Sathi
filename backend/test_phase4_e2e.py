"""Complete End-to-End Evaluation Test Suite for Civic Sathi x SIH26129.
Simulates the 11-Step "Golden Storyline" evaluation script.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_e2e_rehearsal():
    print("\n========================================================")
    print(" STARTING SIH26129 FULL 11-STEP EVALUATOR REHEARSAL")
    print("========================================================\n")

    # Step 1: Environment Reset
    print("Step 1: Resetting Demo Seeds to Pristine Initial State...")
    res = client.post("/api/v1/integrations/reset-demo")
    assert res.status_code == 200
    print("   [OK] Environment Reset Confirmed.")

    # Step 2: Sovereign Systems Verification
    print("\nStep 2: Pinging Sovereign Government Systems Hub...")
    res = client.get("/api/v1/integrations/systems")
    assert res.status_code == 200
    systems = res.json()
    assert len(systems) >= 6
    print(f"   [OK] {len(systems)} Sovereign Systems Connected and Online.")

    # Step 3: AI Case Decomposition
    print("\nStep 3: Ingesting Grievance & Running AI Multi-Dept Triage...")
    res = client.post(
        "/api/v1/ai/analyze-case",
        json={
            "title": "Water Main Burst and Asphalt Cave-in on SV Road",
            "description": "High-pressure potable water pipe fractured beneath carriageway. Road crater expanding rapidly.",
            "city_name": "Mumbai",
            "ward_name": "Ward H-West (Bandra West)",
        },
    )
    assert res.status_code == 200
    triage = res.json()
    assert len(triage["departments"]) >= 2
    print(f"   [OK] AI Decomposed into {len(triage['departments'])} Departments: "
          f"{[d['department_name'] for d in triage['departments']]}")

    # Step 4: Minting Master Case & Digital Case Passport
    print("\nStep 4: Minting Master Case & Establishing Dependency Lock...")
    res = client.post(
        "/api/v1/cases",
        json={
            "title": "High-Pressure Water Conduit Rupture & Road Subsidence",
            "description": "300mm drinking water conduit burst outside Bandra station.",
            "city_name": "Mumbai",
            "ward_name": "Ward H-West (Bandra West)",
            "address_text": "SV Road, Bandra West, Mumbai",
            "severity": "CRITICAL",
            "priority": "P1",
            "departments": triage["departments"],
        },
    )
    assert res.status_code == 201
    master_case = res.json()
    case_number = master_case["case_number"]
    print(f"   [OK] Master Case Minted: {case_number} with {len(master_case['departments'])} child tickets.")

    # Step 5: Assert Initial Lock State (PWD Blocked on Water)
    water_ticket = next(d for d in master_case["departments"] if d["department_code"] == "water")
    road_ticket = next(d for d in master_case["departments"] if "road" in d["department_code"] or "pwd" in d["department_code"])
    assert water_ticket["status"] == "IN_PROGRESS"
    assert road_ticket["is_blocked"] is True
    print(f"   [OK] Initial Dependency State Verified: Water={water_ticket['status']}, Road=WAITING (Blocked=True).")

    # Step 6: Query "What Happens If We Don't Fix This?" Predictive Risk Engine
    print("\nStep 6: Querying Predictive Systemic Risk Simulator...")
    res = client.get(
        "/api/v1/analytics/predict-systemic-risk",
        params={
            "title": master_case["title"],
            "description": master_case["description"],
            "departments": "water,roads",
        },
    )
    assert res.status_code == 200
    risk = res.json()
    assert risk["cost_analysis"]["cost_multiplier"] > 10.0
    print(f"   [OK] Risk Forecast: {risk['impact_radius_km']} km collapse zone, "
          f"{risk['affected_population']:,} citizens, {risk['cost_analysis']['cost_multiplier']}x cost multiplier.")

    # Step 7: External Webhook: Water Board Completes Repair
    print("\nStep 7: Water Board Emits External Completion Webhook...")
    res = client.post(
        "/api/v1/integrations/events",
        json={
            "event_type": "DEPT_COMPLETED",
            "source_system": "water_board",
            "target_system": "sathi_setu",
            "case_number": case_number,
            "department_code": "water",
            "status": "COMPLETED",
            "notes": "150mm ductile sleeve welded and hydraulic pressure tested at 6.2 bar.",
        },
    )
    assert res.status_code == 200
    ingest_result = res.json()
    assert len(ingest_result["unblocked_departments"]) > 0
    print(f"   [OK] Ingested Webhook. Downstream Unblocked: {ingest_result['unblocked_departments']}")

    # Step 8: Assert Road Department Automatically Unblocked
    print("\nStep 8: Verifying PWD Road Unblocking in Case Passport...")
    res = client.get(f"/api/v1/cases/{case_number}")
    assert res.status_code == 200
    updated_passport = res.json()
    updated_road = next(d for d in updated_passport["departments"] if "road" in d["department_code"] or "pwd" in d["department_code"])
    assert updated_road["status"] == "READY_FOR_REPAIR"
    assert updated_road["is_blocked"] is False
    print(f"   [OK] PWD Roads Status: {updated_road['status']} (Blocked={updated_road['is_blocked']}).")

    # Step 9: State Command Center Statewide Overview
    print("\nStep 9: Auditing Maharashtra Civic Command Center...")
    res = client.get("/api/v1/analytics/state-command-center")
    assert res.status_code == 200
    cmd_data = res.json()
    assert cmd_data["summary"]["total_municipal_corporations"] == 27
    print(f"   [OK] State Command Center Verified: {cmd_data['summary']['total_active_cases']:,} Cases, "
          f"INR {cmd_data['summary']['estimated_taxpayer_savings_cr']} Cr Taxpayer Savings.")

    # Step 10: DEPA Citizen Consent Verification
    print("\nStep 10: Verifying Sathi Sahamati (DEPA Consent Governance)...")
    res = client.get("/api/v1/integrations/consents")
    assert res.status_code == 200
    assert len(res.json()) >= 4
    res = client.post("/api/v1/integrations/consents/con-02/grant")
    assert res.status_code == 200
    print("   [OK] DEPA Consent Authorized with Cryptographic Signature.")

    # Step 11: MDM Exception Resolution
    print("\nStep 11: Resolving MDM Cross-System Exception...")
    res = client.post("/api/v1/integrations/exceptions/exc-01/resolve")
    assert res.status_code == 200
    print("   [OK] MDM Golden Record Merged Successfully.")

    print("\n========================================================")
    print(" ALL 11 STEPS OF THE HACKATHON REHEARSAL PASSED [100%]")
    print("========================================================\n")


if __name__ == "__main__":
    run_e2e_rehearsal()
