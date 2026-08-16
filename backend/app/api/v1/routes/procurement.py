from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_officer, get_current_user
from app.models.procurement import Tender, Bid, WorkOrder, TenderStatus, BidStatus, Contractor, ContractorCityRegistration, RegistrationStatus, WorkOrderStatus, FieldEvidence, Inspection, InspectionResult
from app.models.user import User
from app.models.issue import IssueCluster
from app.models.complaint import Complaint
from app.schemas.procurement import TenderCreate, TenderResponse, BidCreate, BidResponse, WorkOrderResponse, FieldEvidenceCreate, FieldEvidenceResponse, InspectionCreate, InspectionResponse

router = APIRouter()

@router.post("/tenders", response_model=TenderResponse)
def create_tender(
    tender_in: TenderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_officer)
):
    """(Officer Only) Create a new procurement tender."""
    tender = Tender(
        city_id=tender_in.city_id,
        department_id=tender_in.department_id,
        civic_issue_id=tender_in.civic_issue_id,
        title=tender_in.title,
        description=tender_in.description,
        scope_of_work=tender_in.scope_of_work,
        estimated_budget=tender_in.estimated_budget,
        status=TenderStatus.DRAFT
    )
    db.add(tender)
    db.commit()
    db.refresh(tender)
    return tender

@router.get("/tenders", response_model=List[TenderResponse])
def list_tenders(
    city_id: UUID,
    status: Optional[TenderStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List tenders. 
    Contractors only see PUBLISHED/CLOSED tenders in cities where they are APPROVED.
    Officers see all tenders for their city.
    """
    # Simplified RBAC: Check if user is a contractor
    if current_user.role == "contractor":
        # Check registration
        stmt = select(ContractorCityRegistration).join(Contractor).where(
            and_(
                Contractor.auth_user_id == str(current_user.id),
                ContractorCityRegistration.city_id == city_id,
                ContractorCityRegistration.status == RegistrationStatus.APPROVED
            )
        )
        reg = db.execute(stmt).scalar_one_or_none()
        if not reg:
            raise HTTPException(status_code=403, detail="Not an approved contractor in this city")
        
        # Contractors can only see published or closed tenders
        query = select(Tender).where(
            and_(
                Tender.city_id == city_id,
                Tender.status.in_([TenderStatus.PUBLISHED, TenderStatus.CLOSED, TenderStatus.AWARDED])
            )
        )
    else:
        # Officer/Admin visibility
        query = select(Tender).where(Tender.city_id == city_id)
        
    if status:
        query = query.where(Tender.status == status)
        
    results = db.execute(query).scalars().all()
    return results

@router.get("/tenders/{tender_id}", response_model=TenderResponse)
def get_tender(
    tender_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get tender details"""
    tender = db.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    # Apply same visibility rules as list_tenders here in production
    
    return tender

@router.post("/tenders/{tender_id}/bids", response_model=BidResponse)
def submit_bid(
    tender_id: UUID,
    bid_in: BidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a sealed bid for a tender"""
    if current_user.role != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can submit bids")
        
    tender = db.get(Tender, tender_id)
    if not tender or tender.status != TenderStatus.PUBLISHED:
        raise HTTPException(status_code=400, detail="Tender is not open for bidding")
        
    # Get contractor profile
    contractor = db.execute(select(Contractor).where(Contractor.auth_user_id == str(current_user.id))).scalar_one_or_none()
    if not contractor:
        raise HTTPException(status_code=400, detail="Contractor profile not found")
        
    # Check registration
    reg = db.execute(select(ContractorCityRegistration).where(
        and_(
            ContractorCityRegistration.contractor_id == contractor.id,
            ContractorCityRegistration.city_id == tender.city_id,
            ContractorCityRegistration.status == RegistrationStatus.APPROVED
        )
    )).scalar_one_or_none()
    
    if not reg:
        raise HTTPException(status_code=403, detail="Not eligible to bid in this city")
        
    # Check if already bid
    existing_bid = db.execute(select(Bid).where(
        and_(Bid.tender_id == tender_id, Bid.contractor_id == contractor.id)
    )).scalar_one_or_none()
    
    if existing_bid:
        raise HTTPException(status_code=400, detail="You have already submitted a bid for this tender")
        
    bid = Bid(
        tender_id=tender_id,
        contractor_id=contractor.id,
        quoted_amount=bid_in.quoted_amount,
        technical_proposal=bid_in.technical_proposal,
        status=BidStatus.SUBMITTED
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)
    return bid

@router.get("/tenders/{tender_id}/bids", response_model=List[BidResponse])
def list_bids(
    tender_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_officer)
):
    """(Officer Only) View submitted bids. In a real system, blocked until tender closes."""
    tender = db.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    # Enforce sealed bidding rule
    if tender.status == TenderStatus.PUBLISHED:
        raise HTTPException(status_code=403, detail="Bids are sealed until tender is closed")
        
    bids = db.execute(select(Bid).where(Bid.tender_id == tender_id)).scalars().all()
    return bids

@router.post("/tenders/{tender_id}/bids/{bid_id}/award", response_model=WorkOrderResponse)
def award_bid(
    tender_id: UUID,
    bid_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_officer)
):
    """(Officer Only) Award a bid and auto-generate a Work Order."""
    tender = db.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    if tender.status == TenderStatus.AWARDED:
        raise HTTPException(status_code=400, detail="Tender is already awarded")
        
    bid = db.get(Bid, bid_id)
    if not bid or bid.tender_id != tender_id:
        raise HTTPException(status_code=404, detail="Bid not found")
        
    # Mark tender and bid
    tender.status = TenderStatus.AWARDED
    bid.status = BidStatus.WON
    
    # Auto-generate Work Order
    work_order = WorkOrder(
        tender_id=tender_id,
        bid_id=bid_id,
        contractor_id=bid.contractor_id,
        award_value=bid.quoted_amount,
        status=WorkOrderStatus.ISSUED
    )
    db.add(work_order)
    db.commit()
    db.refresh(work_order)
    return work_order

@router.get("/work-orders", response_model=List[WorkOrderResponse])
def list_work_orders(
    city_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List work orders based on role."""
    if current_user.role == "contractor":
        contractor = db.execute(select(Contractor).where(Contractor.auth_user_id == str(current_user.id))).scalar_one_or_none()
        if not contractor:
            return []
        # Enforce city isolation via tender join
        query = select(WorkOrder).join(Tender).where(
            and_(
                WorkOrder.contractor_id == contractor.id,
                Tender.city_id == city_id
            )
        )
    else:
        # Officer can only view work orders for tenders in their city
        query = select(WorkOrder).join(Tender).where(Tender.city_id == city_id)
            
    results = db.execute(query).scalars().all()
    return results
@router.patch("/work-orders/{work_order_id}/status", response_model=WorkOrderResponse)
def update_work_order_status(
    work_order_id: UUID,
    status: WorkOrderStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")
    
    # Allow contractor to update status (e.g. ACCEPTED, IN_PROGRESS)
    work_order.status = status
    db.commit()
    db.refresh(work_order)
    return work_order
@router.post("/work-orders/{work_order_id}/evidence", response_model=FieldEvidenceResponse)
def submit_evidence(
    work_order_id: UUID,
    evidence_in: FieldEvidenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """(Contractor) Upload field evidence for completed work."""
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")
        
    evidence = FieldEvidence(
        work_order_id=work_order_id,
        photo_url=evidence_in.photo_url,
        description=evidence_in.description
    )
    work_order.status = WorkOrderStatus.INSPECTION_PENDING
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence

@router.post("/work-orders/{work_order_id}/inspections", response_model=InspectionResponse)
def submit_inspection(
    work_order_id: UUID,
    inspection_in: InspectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_officer)
):
    """(Officer Only) Inspect field evidence. If PASS, auto-resolve issue and complaints."""
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")
        
    evidence = db.execute(select(FieldEvidence).where(FieldEvidence.work_order_id == work_order_id).order_by(FieldEvidence.created_at.desc())).scalars().first()
    if not evidence:
        raise HTTPException(status_code=400, detail="No field evidence found to inspect")
        
    inspection = Inspection(
        field_evidence_id=evidence.id,
        inspector_user_id=current_user.id,
        result=InspectionResult(inspection_in.result),
        feedback=inspection_in.feedback
    )
    db.add(inspection)
    
    if inspection.result == InspectionResult.PASS:
        work_order.status = WorkOrderStatus.COMPLETED
        
        # Super Workflow Automation: Resolve Issue and Complaints!
        tender = db.get(Tender, work_order.tender_id)
        if tender and tender.civic_issue_id:
            issue = db.get(IssueCluster, tender.civic_issue_id)
            if issue:
                issue.status = "resolved"
                
                # Resolve all tied complaints
                from app.models.issue import IssueComplaint
                tied_complaints = db.execute(
                    select(Complaint).join(IssueComplaint).where(IssueComplaint.issue_id == issue.id)
                ).scalars().all()
                for c in tied_complaints:
                    c.status = "resolved"
                    
    elif inspection.result == InspectionResult.FAIL:
        work_order.status = WorkOrderStatus.CLOSED
    else:
        work_order.status = WorkOrderStatus.IN_PROGRESS # Rework needed
        
    db.commit()
    db.refresh(inspection)
    return inspection
