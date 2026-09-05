"""FastAPI main application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.errors import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.api.v1.router import router as api_v1_router
from app.core.audit_listeners import setup_auditing

# Setup logging
setup_logging()

# Setup automated SQLAlchemy audit logging
setup_auditing()

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if settings.docs_enabled else None,
    redoc_url="/redoc" if settings.docs_enabled else None,
)

# CORS middleware. A wildcard origin cannot be combined with credentials in
# browsers; Render environments that use CORS_ORIGINS=* must still receive an
# explicit allowlist for the authenticated Vercel portals.
# BUG-036: Always include localhost for local development regardless of env config.
_LOCALHOST_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083",
]
_VERCEL_ORIGINS = [
    "https://janmind-public.vercel.app",
    "https://janmind-municipality.vercel.app",
    "https://janmind-contractor.vercel.app",
    "https://janmind-admin.vercel.app",
    "https://civicsathi-admin.vercel.app",
    "https://civicsathi-municipality.vercel.app",
    "https://civicsathi-contractor.vercel.app",
    "https://civicsathi-public.vercel.app",
]
configured_origins = [o for o in settings.cors_origins if o != "*"]
if not configured_origins:
    configured_origins = _VERCEL_ORIGINS + _LOCALHOST_ORIGINS
else:
    # Merge localhost origins so dev always works even if env only lists Vercel URLs
    for _lo in _LOCALHOST_ORIGINS:
        if _lo not in configured_origins:
            configured_origins.append(_lo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=configured_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Request
import jwt
from app.core.audit_context import set_audit_actor, current_audit_actor

@app.middleware("http")
async def audit_actor_middleware(request: Request, call_next):
    """BUG-001: Always reset the ContextVar after the request to prevent actor leakage."""
    token_reset = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        raw_token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(raw_token, settings.jwt_secret, algorithms=["HS256"])
            actor_id = str(payload.get("sub") or "unknown")
            actor_name = str(payload.get("name") or "Unknown User")
            actor_role = str(payload.get("role") or "unknown")
            # set_audit_actor returns the Token — store it so we can reset after the request
            token_reset = set_audit_actor(actor_id, actor_name, actor_role)
        except Exception:
            pass
    try:
        response = await call_next(request)
    finally:
        # BUG-001: Reset the ContextVar regardless of success/failure so the actor
        # from this request never bleeds into a subsequent reused async task.
        if token_reset is not None:
            current_audit_actor.reset(token_reset)
    return response

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include API routers
app.include_router(api_v1_router, prefix=settings.api_v1_prefix)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "docs": f"{settings.api_v1_prefix}/docs" if settings.docs_enabled else None,
    }


@app.get("/health")
def health_alias():
    """Compatibility health endpoint for deployment monitors and demo checklists."""
    from app.core.database import check_db_connection
    if not check_db_connection():
        return {"status": "degraded", "database": "unavailable"}
    return {"status": "healthy", "database": "connected"}
