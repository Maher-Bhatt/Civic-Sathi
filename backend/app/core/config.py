"""Application configuration using pydantic-settings"""

from typing import Literal
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Environment
    environment: Literal["local", "preview", "production"] = "local"
    
    # API
    api_v1_prefix: str = "/api/v1"
    app_name: str = "Civic Sathi Backend"
    app_version: str = "1.0.0"
    
    # Database
    database_url: str = Field(..., description="PostgreSQL connection string")
    
    # CORS
    cors_origins: str = Field(
        default=(
            "http://localhost:5173,http://localhost:8000,http://localhost:3000,http://localhost:8080,http://localhost:8081,"
            "https://janmind-public.vercel.app,https://janmind-municipality.vercel.app,"
            "https://janmind-contractor.vercel.app,https://janmind-admin.vercel.app"
        ),
        description="Comma-separated list of allowed origins"
    )
    
    # Security
    officer_api_key: str = Field(..., description="API key for officer endpoints")
    jwt_secret: str = Field(default="civicsathi_super_secret_dev_key_2026", description="Secret key for JWT generation")
    super_admin_emails: str = Field(
        default="admin@janmind.in,maherbhatt01@gmail.com",
        description="Comma-separated email allowlist for private super-admin operations",
    )

    # AI / LLM Configuration (Groq, Grok / xAI, etc.)
    groq_api_key: str | None = Field(default=None, description="Groq API key")
    xai_api_key: str | None = Field(default=None, description="xAI API key for Grok models")
    grok_api_key: str | None = Field(default=None, description="Alternative alias for AI API key")
    llm_api_key: str | None = Field(default=None, description="Generic LLM API key")
    llm_model: str = Field(default="allam-2-7b", description="Lightweight low-resource 7B model to prevent rate limits")
    llm_base_url: str = Field(default="https://api.groq.com/openai/v1", description="OpenAI-compatible LLM endpoint base URL")
    
    # ML Configuration
    sentence_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    similarity_threshold: float = 0.72
    min_cluster_size: int = 5
    systemic_window_days: int = 30
    
    # Features
    enable_seed_endpoint: bool = False
    
    # Logging
    log_level: str = "INFO"
    
    @field_validator("cors_origins")
    @classmethod
    def parse_cors_origins(cls, v: str) -> list[str]:
        """Parse comma-separated origins into list"""
        return [origin.strip() for origin in v.split(",") if origin.strip()]
    
    @property
    def super_admin_email_set(self) -> set[str]:
        return {email.strip().lower() for email in self.super_admin_emails.split(",") if email.strip()}

    @property
    def is_production(self) -> bool:

        """Check if running in production"""
        return self.environment == "production"
    
    @property
    def is_local(self) -> bool:
        """Check if running locally"""
        return self.environment == "local"
    
    @property
    def docs_enabled(self) -> bool:
        """Enable docs in non-production environments"""
        return not self.is_production


settings = Settings()
