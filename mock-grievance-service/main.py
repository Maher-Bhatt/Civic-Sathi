"""Maharashtra State Grievance Service — MOCK / DEMONSTRATION SYSTEM.

This is an independent FastAPI service that intentionally uses different
field names from Civic Sathi to demonstrate cross-system schema mapping
through Sathi Setu.

NOT an official Government of Maharashtra deployment.
NOT connected to any production government database.
Created for Smart India Hackathon SIH26129 demonstration only.

Runs on port 8002 by default, separate from:
  - Civic Sathi backend (port 8000)
  - Sathi Setu (port 8001)
"""

import os
from datetime import datetime, timezone
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


# ── Database setup (independent SQLite by default) ─────────────────────────

DATABASE_URL = os.getenv("MGS_DATABASE_URL", "sqlite:///./mock_grievance.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


class Grievance(Base):
    """Grievance model — deliberately uses different field names than Civic Sathi.

    Civic Sathi uses: complaint_id, description, submitted_by.name, phone
    This system uses: grievance_ref, complaint_text, citizen_name, mobile_no

    This demonstrates the schema heterogeneity that Sathi Setu must resolve.
    """
    __tablename__ = "grievances"

    grievance_ref: Mapped[str] = mapped_column(primary_key=True)
    legacy_citizen_ref: Mapped[str] = mapped_column()
    citizen_name: Mapped[str] = mapped_column()
    mobile_no: Mapped[str | None] = mapped_column(nullable=True)
    contact_email: Mapped[str | None] = mapped_column(nullable=True)
    complaint_text: Mapped[str] = mapped_column()
    case_state: Mapped[str] = mapped_column(default="RECEIVED")
    district: Mapped[str | None] = mapped_column(nullable=True)
    priority: Mapped[str] = mapped_column(default="NORMAL")
    filed_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Pydantic schemas ────────────────────────────────────────────────────────

class GrievanceCreate(BaseModel):
    """Submit a new grievance.  Uses MGS field names — NOT Civic Sathi field names."""
    legacy_citizen_ref: str = Field(min_length=2, max_length=80, description="Citizen reference in the legacy system")
    citizen_name: str = Field(min_length=2, max_length=160)
    mobile_no: str | None = Field(default=None, max_length=20)
    contact_email: str | None = Field(default=None, max_length=254)
    complaint_text: str = Field(min_length=10, max_length=2000)
    district: str | None = Field(default=None, max_length=80)
    priority: str = Field(default="NORMAL", pattern="^(LOW|NORMAL|HIGH|URGENT)$")


class StatusUpdate(BaseModel):
    case_state: str = Field(min_length=2, max_length=60)
    notes: str | None = Field(default=None, max_length=500)


class GrievanceOut(BaseModel):
    grievance_ref: str
    legacy_citizen_ref: str
    citizen_name: str
    mobile_no: str | None
    contact_email: str | None
    complaint_text: str
    case_state: str
    district: str | None
    priority: str
    filed_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Application ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Maharashtra State Grievance Service",
    version="1.0.0-DEMO",
    description=(
        "MOCK / DEMONSTRATION SYSTEM for Smart India Hackathon SIH26129. "
        "NOT an official Government of Maharashtra service. "
        "Created to demonstrate schema interoperability through Sathi Setu."
    ),
    openapi_tags=[
        {
            "name": "grievances",
            "description": "MOCK grievance operations — demonstration only",
        }
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8001"],
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-Type"],
)

# Sequence counter (in-memory for demo; production would use DB sequence)
_sequence: list[int] = [0]


def _next_ref() -> str:
    _sequence[0] += 1
    year = datetime.now().year
    return f"MGS-{year}-{_sequence[0]:06d}"


@app.on_event("startup")
def create_tables():
    """Create tables on startup for the demo SQLite database.

    NOTE: Unlike Civic Sathi and Sathi Setu, this demo service uses
    create_all for the local SQLite demo only.  A production deployment
    would use Alembic migrations.
    """
    Base.metadata.create_all(engine)
    # Sync in-memory sequence with existing records
    with SessionLocal() as db:
        count = db.query(Grievance).count()
        _sequence[0] = count


# ── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "mock-grievance-service",
        "mode": "MOCK_DEMONSTRATION",
        "disclaimer": "NOT an official Government of Maharashtra service",
    }


@app.post("/grievances", status_code=201, response_model=GrievanceOut, tags=["grievances"])
def submit_grievance(
    body: GrievanceCreate,
    db: Annotated[Session, None] = None,
) -> GrievanceOut:
    """Submit a grievance to the mock system.

    This endpoint deliberately uses different field names than Civic Sathi
    (citizen_name, mobile_no, complaint_text) to demonstrate schema
    heterogeneity that Sathi Setu resolves through its connector mapping.
    """
    from fastapi import Depends
    db = next(get_db())
    ref = _next_ref()
    grievance = Grievance(
        grievance_ref=ref,
        legacy_citizen_ref=body.legacy_citizen_ref,
        citizen_name=body.citizen_name,
        mobile_no=body.mobile_no,
        contact_email=body.contact_email,
        complaint_text=body.complaint_text,
        district=body.district,
        priority=body.priority,
    )
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return GrievanceOut.model_validate(grievance)


@app.get("/grievances", response_model=list[GrievanceOut], tags=["grievances"])
def list_grievances(
    district: str | None = Query(default=None),
    case_state: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[GrievanceOut]:
    db = next(get_db())
    stmt = select(Grievance)
    if district:
        stmt = stmt.where(Grievance.district.ilike(f"%{district}%"))
    if case_state:
        stmt = stmt.where(Grievance.case_state == case_state)
    rows = db.scalars(stmt.limit(limit)).all()
    return [GrievanceOut.model_validate(row) for row in rows]


@app.get("/grievances/{ref}", response_model=GrievanceOut, tags=["grievances"])
def get_grievance(ref: str) -> GrievanceOut:
    db = next(get_db())
    grievance = db.scalar(select(Grievance).where(Grievance.grievance_ref == ref))
    if not grievance:
        raise HTTPException(status_code=404, detail=f"Grievance '{ref}' not found.")
    return GrievanceOut.model_validate(grievance)


@app.patch("/grievances/{ref}/status", response_model=GrievanceOut, tags=["grievances"])
def update_status(ref: str, body: StatusUpdate) -> GrievanceOut:
    """Update the case_state — uses 'case_state' not 'status' as in Civic Sathi."""
    db = next(get_db())
    grievance = db.scalar(select(Grievance).where(Grievance.grievance_ref == ref))
    if not grievance:
        raise HTTPException(status_code=404, detail=f"Grievance '{ref}' not found.")
    grievance.case_state = body.case_state
    db.commit()
    db.refresh(grievance)
    return GrievanceOut.model_validate(grievance)
