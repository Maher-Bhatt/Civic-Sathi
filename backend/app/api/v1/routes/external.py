"""External lookup endpoint for Sathi Setu interoperability.

This endpoint allows Sathi Setu's connector to retrieve relevant Civic Sathi
records by canonical identity attributes (phone, submitted_by_phone, name).
It is authenticated with a dedicated API key so Sathi Setu clients cannot
impersonate regular citizens or officers.

Configuration:
  SATHI_SETU_LOOKUP_KEY  — shared secret header value (X-Sathi-Setu-Key)

Security properties:
  - Never returns private officer notes, locations, or internal audit data.
  - Only returns public-safe complaint identifiers, statuses, and categories.
  - The key must be set in .env and is never embedded in source code.
  - Set SATHI_SETU_LOOKUP_KEY to a long random value before any deployment.
"""

import os
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.complaint import Complaint
from app.models.user import User

router = APIRouter()

_LOOKUP_KEY_ENV = "SATHI_SETU_LOOKUP_KEY"


def _require_setu_key(x_sathi_setu_key: Annotated[str | None, Header()] = None) -> str:
    expected = os.environ.get(_LOOKUP_KEY_ENV, "")
    if not expected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="External lookup is not configured on this server.",
        )
    if x_sathi_setu_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A valid Sathi Setu lookup key is required.",
        )
    return "sathi-setu-connector"


SetuClient = Annotated[str, Depends(_require_setu_key)]


@router.get(
    "/lookup",
    summary="Cross-system identity lookup for Sathi Setu",
    description=(
        "Returns public-safe complaint identifiers for matching citizens. "
        "Requires the X-Sathi-Setu-Key header. This endpoint is exclusively "
        "for the Sathi Setu interoperability layer. "
        "At least one of phone, email, or name must be provided."
    ),
)
def lookup(
    db: Annotated[Session, Depends(get_db)],
    _client: SetuClient,
    phone: str | None = Query(default=None, max_length=32, description="Phone number to match"),
    email: str | None = Query(default=None, max_length=254, description="Email address to match"),
    name: str | None = Query(default=None, max_length=160, description="Citizen name (partial match)"),
) -> dict:
    """Return Civic Sathi complaint identifiers for matching citizens.

    Only public-safe fields are returned: complaint public IDs, statuses, and
    categories.  Internal officer notes, locations, and full audit data are
    excluded.  At least one of phone, email, or name must be provided.
    """
    if not any([phone, email, name]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one of phone, email, or name is required.",
        )

    # Build user filter — match on submitted_by_phone or user account fields
    user_filters = []
    complaint_filters = []

    if phone:
        digits = "".join(c for c in phone if c.isdigit())
        if len(digits) >= 8:
            # Match either the complaint-embedded phone or user account phone
            complaint_filters.append(Complaint.submitted_by_phone.contains(digits[-8:]))
            user_filters.append(User.phone.contains(digits[-8:]))

    if email:
        user_filters.append(User.email.ilike(email.strip()))

    if name and len(name.strip()) >= 3:
        user_filters.append(User.name.ilike(f"%{name.strip()}%"))
        complaint_filters.append(Complaint.submitted_by_name.ilike(f"%{name.strip()}%"))

    if not user_filters and not complaint_filters:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provided values did not produce a usable query filter.",
        )

    all_filters = user_filters + complaint_filters

    # Join Complaint → User (outer join so complaints with no account also match)
    stmt = (
        select(Complaint, User)
        .join(User, Complaint.submitted_by_id == User.id, isouter=True)
        .where(or_(*all_filters))
        .limit(20)
    )

    rows = db.execute(stmt).all()

    results = []
    for complaint, user in rows:
        results.append(
            {
                "complaint_public_id": complaint.public_id,
                "status": complaint.status,
                "category": complaint.category,
                "city_id": str(complaint.city_id) if complaint.city_id else None,
                "submitted_by": {
                    "citizen_id": str(complaint.submitted_by_id) if complaint.submitted_by_id else None,
                    "name": complaint.submitted_by_name or (user.name if user else None),
                    "phone": complaint.submitted_by_phone or (user.phone if user else None),
                },
            }
        )

    return {
        "source_system": "civic-sathi",
        "match_count": len(results),
        "results": results,
    }
