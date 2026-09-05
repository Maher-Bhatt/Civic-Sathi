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

# Setup logging
setup_logging()

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
configured_origins = [origin for origin in settings.cors_origins if origin != "*"]
if not configured_origins:
    configured_origins = [
        "https://janmind-public.vercel.app",
        "https://janmind-municipality.vercel.app",
        "https://janmind-contractor.vercel.app",
        "https://janmind-admin.vercel.app",
        "https://civicsathi-admin.vercel.app",
        "https://civicsathi-municipality.vercel.app",
        "https://civicsathi-contractor.vercel.app",
        "https://civicsathi-public.vercel.app",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=configured_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
