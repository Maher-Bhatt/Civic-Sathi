"""Separately deployable Sathi Setu FastAPI application."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.core.config import settings


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"

app = FastAPI(
    title="Sathi Setu",
    version="0.1.0",
    description="Prototype interoperability platform for SIH26129. No government integration is implied.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(router)
app.mount("/assets", StaticFiles(directory=WEB), name="assets")


@app.get("/", include_in_schema=False)
def console() -> FileResponse:
    return FileResponse(WEB / "index.html")
