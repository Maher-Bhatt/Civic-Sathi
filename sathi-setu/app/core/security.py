"""Connector authentication for the prototype boundary."""

from typing import Annotated

from fastapi import Header, HTTPException, status

from app.core.config import settings


def require_connector_key(authorization: Annotated[str | None, Header()] = None) -> str:
    expected = f"Bearer {settings.api_key}"
    if authorization != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A valid Sathi Setu connector bearer token is required.",
        )
    return "connector-client"
