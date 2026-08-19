import base64
import re
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.security import get_current_user
from app.services.ai_service import ai_service

router = APIRouter()


class ComplaintTextAnalysisRequest(BaseModel):
    title: str = Field(default="Civic report", max_length=120)
    description: str = Field(..., min_length=1, max_length=2500)
    category_hint: str | None = None


class ImageAnalysisRequest(BaseModel):
    data_url: str = Field(..., min_length=32, max_length=12_000_000)
    description: str | None = Field(default=None, max_length=2500)


def _validate_image_data_url(data_url: str) -> None:
    if not re.match(r"^data:image/(?:jpeg|jpg|png|webp|heic);base64,[A-Za-z0-9+/=\s]+$", data_url, re.IGNORECASE):
        raise HTTPException(status_code=422, detail="Provide a supported image as a base64 data URL")
    try:
        encoded = data_url.split(",", 1)[1]
        if len(base64.b64decode(encoded, validate=False)) > 8 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Image must be 8 MB or smaller")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=422, detail="The image could not be decoded") from exc


@router.post("/analyze-complaint")
async def analyze_complaint_text(
    request: ComplaintTextAnalysisRequest,
    current_user=Depends(get_current_user),
):
    """Classify complaint text on the backend so the browser never owns the AI decision."""
    result = await ai_service.analyze_complaint(
        request.title,
        request.description,
        request.category_hint,
    )
    return {"source": "model" if ai_service.is_configured else "backend-heuristic", **result}


@router.post("/analyze-image")
async def analyze_complaint_image(
    request: ImageAnalysisRequest,
    current_user=Depends(get_current_user),
):
    """Analyze actual image bytes with a vision-capable provider when configured."""
    _validate_image_data_url(request.data_url)
    result = await ai_service.analyze_image(request.data_url, request.description)
    return {"source": "vision-model" if ai_service.vision_configured else "manual-review-fallback", **result}
