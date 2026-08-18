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

from contextlib import asynccontextmanager

# Setup logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup in PostgreSQL
    try:
        from app.core.database import engine, SessionLocal
        from app.models import Base
        from app.services.data_integrity import (
            ensure_historical_city_separation,
            ensure_working_contractor_access,
        )
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            repaired = ensure_historical_city_separation(db)
            contractor_repaired = ensure_working_contractor_access(db)
        print(
            "Database schema initialized successfully; "
            f"city integrity repaired: {repaired} rows, "
            f"contractor access repaired: {contractor_repaired} changes."
        )
    except Exception as e:
        print(f"Warning: Auto-migration on startup failed: {e}")
    yield

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if settings.docs_enabled else None,
    redoc_url="/redoc" if settings.docs_enabled else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
