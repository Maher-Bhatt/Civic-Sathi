from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func as sqlfunc, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.procurement import City
from app.models.user import Department, Ward, Zone

router = APIRouter()


def resolve_city_id(db: Session, city_value: str | None) -> str | None:
    if not city_value:
        return None
    try:
        city = db.get(City, UUID(city_value))
    except (ValueError, TypeError, AttributeError):
        city = (
            db.query(City)
            .filter(sqlfunc.lower(City.name) == city_value.strip().lower())
            .first()
        )
    return str(city.id) if city else None


class ZoneCreate(BaseModel):
    name: str
    city_id: str


class WardCreate(BaseModel):
    ward_number: int
    name: str
    city_id: str
    zone_id: Optional[str] = None


class DepartmentCreate(BaseModel):
    name: str
    slug: str
    contact_email: Optional[str] = None


# ZONE CRUD
@router.get("/zones")
def get_zones(city_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = select(Zone)
    if city_id:
        resolved = resolve_city_id(db, city_id)
        if resolved:
            query = query.where(Zone.city_id == resolved)
    return db.scalars(query).all()


@router.post("/zones", status_code=status.HTTP_201_CREATED)
def create_zone(payload: ZoneCreate, db: Session = Depends(get_db)):
    resolved_city = resolve_city_id(db, payload.city_id) or payload.city_id
    zone = Zone(name=payload.name, city_id=resolved_city)
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone


# WARD CRUD
@router.get("/wards")
def get_wards(city_id: Optional[str] = None, zone_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = select(Ward)
    if city_id:
        resolved = resolve_city_id(db, city_id)
        if resolved:
            query = query.where(Ward.city_id == resolved)
    if zone_id:
        query = query.where(Ward.zone_id == zone_id)
    return db.scalars(query).all()


@router.post("/wards", status_code=status.HTTP_201_CREATED)
def create_ward(payload: WardCreate, db: Session = Depends(get_db)):
    resolved_city = resolve_city_id(db, payload.city_id) or payload.city_id
    ward = Ward(
        ward_number=payload.ward_number,
        name=payload.name,
        city_id=resolved_city,
        zone_id=payload.zone_id,
    )
    db.add(ward)
    db.commit()
    db.refresh(ward)
    return ward


# DEPARTMENT CRUD
@router.get("/departments")
def get_departments(db: Session = Depends(get_db)):
    return db.scalars(select(Department).order_by(Department.name)).all()


@router.post("/departments", status_code=status.HTTP_201_CREATED)
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db)):
    dept = Department(name=payload.name, slug=payload.slug, contact_email=payload.contact_email)
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept
