"""User, Ward, and Department models"""

from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB

from app.models.base import Base, UUIDMixin, TimestampMixin


class User(Base, UUIDMixin, TimestampMixin):
    """User model for citizens and officers"""
    
    __tablename__ = "users"
    
    role: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(20), index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    ward: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100), index=True)
    department: Mapped[str | None] = mapped_column(String(100))
    designation: Mapped[str | None] = mapped_column(String(100))


class Ward(Base, UUIDMixin, TimestampMixin):
    """Ward model for geographic and administrative boundaries"""
    
    __tablename__ = "wards"
    
    ward_number: Mapped[int] = mapped_column(Integer, unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    centroid_lat: Mapped[float | None] = mapped_column()
    centroid_lng: Mapped[float | None] = mapped_column()
    boundary_geojson: Mapped[dict | None] = mapped_column(JSONB)


class Department(Base, UUIDMixin, TimestampMixin):
    """Department model for complaint routing"""
    
    __tablename__ = "departments"
    
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    contact_email: Mapped[str | None] = mapped_column(String(255))
