"""Runtime configuration for the separately deployed Sathi Setu service."""

from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="SATHI_SETU_",
        case_sensitive=False,
        extra="ignore",
    )

    environment: Literal["local", "test", "production"] = "local"
    database_url: str = Field(..., description="Dedicated Sathi Setu database URL")
    api_key: str = Field(..., min_length=16, description="Connector client bearer token")
    cors_origins: str = "http://localhost:5173"
    app_name: str = "Sathi Setu"

    @model_validator(mode="after")
    def reject_sqlite_in_production(self) -> "Settings":
        if self.environment == "production" and self.database_url.startswith("sqlite"):
            raise ValueError("Production Sathi Setu requires its own PostgreSQL database or schema")
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
