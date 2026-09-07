"""End-to-End Verification Test for Civic Sathi x SIH26129 Phase 3:
Compliance, Trust, Predictive Risk & State Command Center.
"""

import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("\n--- Starting SIH26129 Phase 3 Automated Verification ---\n")

    # 1. State Command Center Telemetry
    print("1. Testing State Command Center Telemetry (/api/v1/analytics/state-command-center)...")
    res = client.get("/api/v1/analytics/state-command-center")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert data["state_name"] == "Maharashtra"
    assert data["summary"]["total_municipal_corporations"] == 27
    assert len(data["corporations"]) >= 10
    assert len(data["digital_twin_layers"]) == 3
    print(f"   [OK] State Command Center Verified: {len(data['corporations'])} Corporations, "
          f"{data['summary']['total_active_cases']:,} Active Cases, "
          f"{data['summary']['critical_systemic_cascades']} Critical Cascades.")

    # 2. Predictive Systemic Risk Engine ("What Happens If We Don't Fix This?")
    print("\n2. Testing Predictive Systemic Risk Engine (/api/v1/analytics/predict-systemic-risk)...")
    res = client.get(
        "/api/v1/analytics/predict-systemic-risk",
        params={
            "title": "Water Main Burst & Road Subsidence on SV Road",
            "description": "300mm drinking water conduit ruptured beneath asphalt. Road crater expanding.",
            "departments": "water,roads",
            "lat": 19.0596,
            "lng": 72.8295,
            "ward_name": "Ward H-West (Bandra West)",
            "city_name": "Mumbai",
        },
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    risk = res.json()
    assert risk["risk_level"].startswith("CATASTROPHIC")
    assert risk["cost_analysis"]["cost_multiplier"] > 10.0
    assert risk["affected_population"] > 30000
    print(f"   [OK] Risk Engine Verified: Risk={risk['risk_level']}, "
          f"Impact Area={risk['impact_area_sqkm']} sq km, "
          f"Affected Citizens={risk['affected_population']:,}, "
          f"Cost Multiplier={risk['cost_analysis']['cost_multiplier']}x")

    # 3. DEPA Citizen Consent Governance
    print("\n3. Testing DEPA Citizen Consent Governance (/api/v1/integrations/consents)...")
    res = client.get("/api/v1/integrations/consents")
    assert res.status_code == 200
    consents = res.json()
    assert len(consents) >= 4
    print(f"   [OK] {len(consents)} DEPA Consent Records Retrieved.")

    # Test Granting Consent
    res = client.post("/api/v1/integrations/consents/con-02/grant")
    assert res.status_code == 200
    granted = res.json()["consent"]
    assert granted["status"] == "GRANTED"
    print(f"   [OK] Consent con-02 Granted: Status={granted['status']}, GrantedAt={granted['granted_at']}")

    # Test Revoking Consent
    res = client.post("/api/v1/integrations/consents/con-01/revoke")
    assert res.status_code == 200
    revoked = res.json()["consent"]
    assert revoked["status"] == "REVOKED"
    print(f"   [OK] Consent con-01 Revoked: Status={revoked['status']}")

    # 4. MDM Data Quality & Exception Queue
    print("\n4. Testing MDM Exception Queue (/api/v1/integrations/exceptions)...")
    res = client.get("/api/v1/integrations/exceptions")
    assert res.status_code == 200
    exceptions = res.json()
    assert len(exceptions) >= 4
    open_count = sum(1 for e in exceptions if e["status"] == "OPEN")
    print(f"   [OK] {len(exceptions)} MDM Exceptions Loaded ({open_count} Open).")

    # Test Resolving Exception & Merging Golden Record
    res = client.post("/api/v1/integrations/exceptions/exc-01/resolve")
    assert res.status_code == 200
    resolved = res.json()["exception"]
    assert resolved["status"] == "RESOLVED"
    print(f"   [OK] MDM Exception exc-01 Resolved: Golden Record Merged ({resolved['recommended_action']}).")

    print("\n========================================================")
    print(" ALL SIH26129 PHASE 3 BACKEND VERIFICATIONS PASSED! [100%]")
    print("========================================================\n")


if __name__ == "__main__":
    run_tests()
