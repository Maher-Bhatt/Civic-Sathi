"""Test fixtures for the Sathi Setu service.

Uses SQLite for unit and API tests. All Sathi Setu tables use standard
SQL types (String, JSON, Boolean, Float, DateTime) — no PostgreSQL-specific
types — so SQLite is an acceptable lightweight harness.

Do NOT use a shared development or production database for tests.
"""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

# Point at an in-memory SQLite database before any app module is imported.
os.environ["SATHI_SETU_DATABASE_URL"] = "sqlite:///./test_sathi_setu.db"
os.environ["SATHI_SETU_API_KEY"] = "test-key-for-pytest-only-16chars"
os.environ["SATHI_SETU_ENVIRONMENT"] = "test"

from app.core.database import get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Base  # noqa: E402

TEST_DB_URL = "sqlite:///./test_sathi_setu.db"

engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    future=True,
)
TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)


@pytest.fixture(scope="function", autouse=False)
def db_session():
    """Create all tables, yield a session, then drop everything."""
    Base.metadata.create_all(engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def client(db_session):
    """TestClient wired to the in-memory SQLite session."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


AUTH_HEADER = {"Authorization": "Bearer test-key-for-pytest-only-16chars"}
