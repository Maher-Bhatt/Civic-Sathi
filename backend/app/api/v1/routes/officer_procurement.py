from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.procurement import (
    WorkOrder, FieldEvidence, Bill, BillStatus, Milestone, MilestoneStatus
)
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

def require_officer(current_user: User = Depends(get_current_user)):
    if current_user.role not in ['officer', 'department_head', 'collector', 'admin']:
        raise HTTPException(status_code=403, detail='Access denied, officer only')
    return current_user

# -- Evidence Approval Workflow --
class EvidenceStatusUpdate(BaseModel):
    status: str # ACCEPTED, REJECTED
    rejectionReason: Optional[str] = None

@router.patch('/work-orders/{id}/evidence/{evidence_id}/status')
def update_evidence_status(id: UUID, evidence_id: UUID, payload: EvidenceStatusUpdate, db: Session = Depends(get_db), officer: User = Depends(require_officer)):
    evidence = db.get(FieldEvidence, evidence_id)
    if not evidence or evidence.work_order_id != id:
        raise HTTPException(status_code=404, detail='Evidence not found')
    
    # Optional logic: verify GPS tolerance here
    evidence.stage = payload.status # piggyback on stage or use a new field
    if payload.rejectionReason:
        evidence.description = (evidence.description or '') + '\n\nRejection: ' + payload.rejectionReason
    db.commit()
    return {'status': 'success'}

# -- Milestone Progress Tracking --
class MilestoneInspectRequest(BaseModel):
    status: str # VERIFIED, REWORK_REQUIRED
    notes: Optional[str] = None

@router.get('/work-orders/{id}/milestones')
def get_work_order_milestones(id: UUID, db: Session = Depends(get_db), officer: User = Depends(require_officer)):
    milestones = db.execute(select(Milestone).where(Milestone.work_order_id == id).order_by(Milestone.sequence)).scalars().all()
    return milestones

@router.post('/work-orders/{id}/milestones/{mid}/inspect')
def inspect_milestone(id: UUID, mid: UUID, payload: MilestoneInspectRequest, db: Session = Depends(get_db), officer: User = Depends(require_officer)):
    milestone = db.get(Milestone, mid)
    if not milestone or milestone.work_order_id != id:
        raise HTTPException(status_code=404, detail='Milestone not found')
    
    milestone.status = payload.status
    milestone.officer_verification_notes = payload.notes
    db.commit()
    return milestone

# -- Bill Approval Workflow --
@router.get('/bills/pending-approval')
def get_pending_bills(db: Session = Depends(get_db), officer: User = Depends(require_officer)):
    # Department heads only probably, but allow officer for demo
    bills = db.execute(select(Bill).where(Bill.status == BillStatus.SUBMITTED)).scalars().all()
    return bills

@router.post('/bills/{id}/department-head-approve')
def approve_bill(id: UUID, db: Session = Depends(get_db), officer: User = Depends(require_officer)):
    bill = db.get(Bill, id)
    if not bill:
        raise HTTPException(status_code=404, detail='Bill not found')
    bill.status = BillStatus.APPROVED
    db.commit()
    return bill

