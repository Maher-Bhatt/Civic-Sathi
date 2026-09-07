"""Main API v1 router"""

from fastapi import APIRouter

from app.api.v1.routes import health, complaints, issues, analytics, auth, procurement, triage, cities, admin, municipality, ai, reputation, external, mdm, cases, mock_departments, integrations

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(admin.router, prefix="/admin", tags=["admin"])
router.include_router(municipality.router, prefix="/municipality", tags=["municipality"])

router.include_router(cities.router, prefix="/cities", tags=["cities"])
router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
router.include_router(issues.router, prefix="/issues", tags=["issues"])
router.include_router(procurement.router, prefix="/procurement", tags=["procurement"])
router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
router.include_router(triage.router, prefix="/ai/triage", tags=["triage"])
router.include_router(ai.router, prefix="/ai", tags=["ai"])
router.include_router(cases.router, prefix="/cases", tags=["cases"])
router.include_router(mock_departments.router, prefix="/mock", tags=["mock"])
router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
router.include_router(reputation.router, prefix="/reputation", tags=["reputation"])
router.include_router(external.router, prefix="/external", tags=["external"])
router.include_router(mdm.router, prefix="/mdm", tags=["mdm"])
