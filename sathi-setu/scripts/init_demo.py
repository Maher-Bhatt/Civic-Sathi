"""Explicit local-only schema creation and synthetic demo seed.

Never invoke this script from application startup or against a production DB.
Use Alembic migrations for deployed environments.
"""

from sqlalchemy import select

from app.core.database import SessionLocal, engine
from app.models import Base, ConnectorConfig, ExternalSystem


SYSTEMS = [
    {
        "key": "civic-sathi",
        "name": "Civic Sathi",
        "classification": "REFERENCE",
        "status": "SANDBOX",
        "description": "Connected reference civic-operations system for this prototype.",
        "mapping": {
            "source_reference": "complaint_id",
            "citizen.name": "submitted_by.name",
            "citizen.phone": "submitted_by.phone",
            "summary": "description",
        },
    },
    {
        "key": "mock-grievance-service",
        "name": "Maharashtra State Grievance Service",
        "classification": "MOCK",
        "status": "MOCK",
        "description": "Independent synthetic demonstration system. It is not an official government service.",
        "mapping": {
            "source_reference": "grievance_ref",
            "citizen.name": "citizen_name",
            "citizen.phone": "mobile_no",
            "summary": "complaint_text",
        },
    },
]


def main() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        for data in SYSTEMS:
            system = db.scalar(select(ExternalSystem).where(ExternalSystem.key == data["key"]))
            if system:
                continue
            system = ExternalSystem(
                key=data["key"],
                name=data["name"],
                classification=data["classification"],
                status=data["status"],
                description=data["description"],
            )
            db.add(system)
            db.flush()
            db.add(
                ConnectorConfig(
                    system_id=system.id,
                    name=f"{system.key}-connector",
                    version=1,
                    field_mapping=data["mapping"],
                    enabled=True,
                )
            )
        db.commit()


if __name__ == "__main__":
    main()
