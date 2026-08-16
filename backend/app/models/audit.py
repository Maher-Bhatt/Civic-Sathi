"""Audit model for ML/AI pipeline traceability"""

from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin


class ModelRun(Base, UUIDMixin, TimestampMixin):
    """Track ML/AI model execution for audit and debugging"""
    
    __tablename__ = "model_runs"
    
    run_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    
    input_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    output_summary_json: Mapped[dict | None] = mapped_column(JSONB)
    
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    error_message: Mapped[str | None] = mapped_column(Text)
