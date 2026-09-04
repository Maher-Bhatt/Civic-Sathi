"""Unified tracking records retain, rather than replace, source references."""

from datetime import datetime

from sqlalchemy.orm import Session

from app.models import ExternalSystem, Identity, UnifiedApplication
from app.schemas import CanonicalApplicationInput


def create_unified_application(
    db: Session,
    *,
    identity: Identity,
    source_system: ExternalSystem,
    canonical: CanonicalApplicationInput,
) -> UnifiedApplication:
    sequence = db.query(UnifiedApplication).count() + 1
    reference = f"SAT-{datetime.now().year}-{sequence:06d}"
    application = UnifiedApplication(
        unified_id=reference,
        identity_id=identity.id,
        service_type=canonical.service_type,
        status=canonical.status,
        summary=canonical.summary,
        source_records=[
            {
                "system_key": source_system.key,
                "source_reference": canonical.source_reference,
                "metadata": canonical.metadata,
            }
        ],
    )
    db.add(application)
    return application


def add_source_reference(
    application: UnifiedApplication,
    source_system: ExternalSystem,
    source_reference: str,
) -> UnifiedApplication:
    records = list(application.source_records or [])
    if not any(record.get("system_key") == source_system.key and record.get("source_reference") == source_reference for record in records):
        records.append({"system_key": source_system.key, "source_reference": source_reference})
        application.source_records = records
    return application
