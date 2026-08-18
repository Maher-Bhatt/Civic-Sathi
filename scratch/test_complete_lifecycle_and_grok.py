"""Comprehensive automated verification of Grok AI, Complaint Lifecycle, Privacy Masking, and PWA Manifests."""

import os
import sys
import asyncio
import json
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from app.core.database import SessionLocal
from app.models.complaint import Complaint
from app.models.procurement import City
from app.models.user import User, Ward
from app.services.ai_service import grok_ai_service
from app.services.complaint_service import ComplaintService
from app.schemas.complaint import ComplaintCreate, ComplaintResponse
from app.schemas.common import ComplaintStatus


async def run_tests():
    print("=" * 70)
    print("RUNNING COMPREHENSIVE JANMIND LIFECYCLE & GROK VERIFICATION")
    print("=" * 70)

    # 1. Test Grok AI Service
    print("\n1. Testing Grok AI Service...")
    analysis = await grok_ai_service.analyze_complaint(
        title="Severe deep pothole causing vehicle damage",
        description="Deep crater on main 100ft road Indiranagar right after the junction.",
        category_hint="road_damage"
    )
    print(f"   [Grok AI Output] Category: {analysis.get('category')}, Severity: {analysis.get('severity_score')}/10, Priority: {analysis.get('priority')}")
    assert analysis.get("category") == "road_damage", f"Expected road_damage, got {analysis.get('category')}"
    assert analysis.get("severity_score") >= 6, "Expected high severity for pothole"
    print("   [PASS] Grok AI analysis validated.")

    # 2. Test Copilot Chat
    print("\n2. Testing Grok AI Copilot...")
    copilot_reply = await grok_ai_service.copilot_chat(
        message="What is the recommended SLA for emergency road repairs in Ward 14?",
        context="Ward 14 Vadodara has 12 active road complaints."
    )
    print(f"   [Grok Copilot] {copilot_reply[:120]}...")
    assert len(copilot_reply) > 20, "Expected meaningful copilot response"
    print("   [PASS] Grok AI Copilot validated.")

    # 3. Test Complaint Creation with Citizen Privacy Protection
    print("\n3. Testing Complaint Lifecycle & Anti-Retaliation Privacy Masking...")
    db = SessionLocal()
    try:
        service = ComplaintService(db)
        bengaluru_ward = db.query(Ward).first()

        new_complaint = service.create_complaint(ComplaintCreate(
            title="Critical Water Pipe Rupture — Privacy Verification Test",
            description="Water is gushing out on 12th Main Road Indiranagar.",
            category="water_supply",
            priority="high",
            severity_score=8,
            ward_number=bengaluru_ward.ward_number if bengaluru_ward else 1,
            lat=12.9784,
            lng=77.6408,
            address_text="12th Main Rd, Indiranagar, Bengaluru",
            submitted_by_name="Ramesh Patel",
            submitted_by_phone="+919876543210"
        ))

        print(f"   [Created] ID: {new_complaint.public_id}, Status: {new_complaint.status}")
        assert new_complaint.public_id.startswith("JN-2026-"), "Expected sequential public ID JN-2026-XXXXX"

        # Check Privacy Masking in response
        print(f"   [Privacy Check] Phone Masked: {new_complaint.submitted_by_phone}")
        print(f"   [Privacy Check] Submitter: {new_complaint.submitted_by_name}")
        print(f"   [Privacy Check] Protection Status: {new_complaint.privacy_status}")
        assert "***" in (new_complaint.submitted_by_phone or ""), "Phone must be masked for anti-retaliation privacy"
        assert new_complaint.submitted_by_phone != "+919876543210", "Raw phone must NOT be exposed"
        print("   [PASS] Citizen privacy protection validated.")

        # 4. Test Step Transitions (Lifecycle)
        print("\n4. Testing Full Complaint Lifecycle Status Progression...")
        # A. Municipality verification
        verified = service.update_status(new_complaint.id, ComplaintStatus.IN_REVIEW)
        print(f"   -> Step 1 (Municipality Verification): Status = {verified.status}")
        assert str(verified.status) == "in_review"

        # B. Contractor Assignment
        assigned = service.update_status(new_complaint.id, ComplaintStatus.ASSIGNED)
        print(f"   -> Step 2 (Contractor Assignment): Status = {assigned.status}")
        assert str(assigned.status) == "assigned"

        # C. Contractor In Progress
        progress = service.update_status(new_complaint.id, ComplaintStatus.IN_PROGRESS)
        print(f"   -> Step 3 (Contractor In Progress): Status = {progress.status}")
        assert str(progress.status) == "in_progress"

        # D. Resolution
        resolved = service.update_status(new_complaint.id, ComplaintStatus.RESOLVED)
        print(f"   -> Step 4 (Resolution & Completed): Status = {resolved.status}")
        assert str(resolved.status) == "resolved"
        print("   [PASS] 100% Full Lifecycle status progression validated.")

    finally:
        db.close()

    # 5. Test PWA Manifests and Service Workers across all 4 apps
    print("\n5. Testing PWA Compliance Across All 4 Portals...")
    root_dir = Path(__file__).resolve().parent.parent
    apps = ["public", "municipality", "contractor", "admin"]
    for app in apps:
        manifest_path = root_dir / "apps" / app / "public" / "manifest.webmanifest"
        sw_path = root_dir / "apps" / app / "public" / "sw.js"
        assert manifest_path.exists(), f"Missing manifest for apps/{app}"
        assert sw_path.exists(), f"Missing sw.js for apps/{app}"

        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
            assert manifest.get("display") == "standalone", f"Display mode must be standalone in {app}"
            assert "name" in manifest, f"Missing name in {app} manifest"
            print(f"   [PWA OK] apps/{app}: {manifest.get('name')} (Standalone PWA Ready)")

    print("\n" + "=" * 70)
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY WITH ZERO ERRORS!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(run_tests())
