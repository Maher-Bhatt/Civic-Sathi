from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.api.dependencies.database import get_db
from app.models.user import Zone, Ward, Department

router = APIRouter()

# ZONE CRUD
@router.get("/zones")
async def get_zones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Zone))
    return result.scalars().all()

@router.post("/zones")
async def create_zone(name: str, city_id: str, db: AsyncSession = Depends(get_db)):
    zone = Zone(name=name, city_id=city_id)
    db.add(zone)
    await db.commit()
    await db.refresh(zone)
    return zone

# WARD CRUD
@router.get("/wards")
async def get_wards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ward))
    return result.scalars().all()

@router.post("/wards")
async def create_ward(ward_number: int, name: str, city_id: str, zone_id: str = None, db: AsyncSession = Depends(get_db)):
    ward = Ward(ward_number=ward_number, name=name, city_id=city_id, zone_id=zone_id)
    db.add(ward)
    await db.commit()
    await db.refresh(ward)
    return ward

# DEPARTMENT CRUD
@router.get("/departments")
async def get_departments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Department))
    return result.scalars().all()

@router.post("/departments")
async def create_department(name: str, slug: str, db: AsyncSession = Depends(get_db)):
    dept = Department(name=name, slug=slug)
    db.add(dept)
    await db.commit()
    await db.refresh(dept)
    return dept
