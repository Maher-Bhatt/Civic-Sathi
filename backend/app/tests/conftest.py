"""Pytest configuration and fixtures"""

import os
from collections.abc import Iterator
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

# Unit tests use the deterministic embedding fallback rather than downloading a
# model during collection or execution. Production can still load a configured
# model when it is available.
os.environ.setdefault("HF_HUB_OFFLINE", "1")

from app.main import app
from app.core.database import get_db
from app.models.base import Base
from app.models.procurement import City
from app.models.user import Department, User
from app.core.security import get_current_user


@pytest.fixture(scope="session")
def test_database_url() -> Iterator[str]:
    """Provide an isolated PostgreSQL database for production-schema tests."""
    configured_url = os.getenv("TEST_DATABASE_URL")
    if configured_url:
        yield configured_url
        return

    try:
        from testcontainers.postgres import PostgresContainer
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "Install backend requirements or set TEST_DATABASE_URL to run PostgreSQL-backed tests."
        ) from exc

    with PostgresContainer("postgres:16-alpine") as postgres:
        yield postgres.get_connection_url()


@pytest.fixture(scope="session")
def engine(test_database_url: str) -> Iterator[Engine]:
    """Create one PostgreSQL engine for the test session."""
    test_engine = create_engine(test_database_url, future=True, pool_pre_ping=True)
    try:
        yield test_engine
    finally:
        test_engine.dispose()


@pytest.fixture
def db_session(engine: Engine) -> Iterator[Session]:
    """Create a clean PostgreSQL schema and essential reference rows per test."""
    Base.metadata.create_all(bind=engine)
    test_session = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)()
    try:
        test_session.add_all([
            City(name="Vadodara", state_code="GJ"),
            City(name="Bengaluru", state_code="KA"),
            Department(name="Municipal Administration", slug="general"),
            Department(name="Sanitation", slug="sanitation"),
        ])
        test_session.commit()
        yield test_session
    finally:
        test_session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def current_user(db_session: Session) -> User:
    """Create the authenticated citizen used by protected complaint tests."""
    user = User(
        id=uuid4(),
        role="citizen",
        name="Test Citizen",
        email="citizen@example.test",
        phone="+919000000000",
        password_hash="test-password-hash",
        ward="Unassigned",
    )
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture
def client(db_session: Session, current_user: User) -> Iterator[TestClient]:
    """Create an authenticated client backed by the isolated test database."""
    def override_get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = lambda: current_user
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def unauthenticated_client(db_session: Session) -> Iterator[TestClient]:
    """Create a client with only database access overridden for auth tests."""
    def override_get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
