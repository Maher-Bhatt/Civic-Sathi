from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import func, select, and_
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user, officer_has_permission, require_officer_permission
from app.models.procurement import (
    Tender, Bid, WorkOrder, City,
    TenderStatus, BidStatus, WorkOrderStatus,
    Contractor, ContractorCityRegistration, RegistrationStatus,
    FieldEvidence, Inspection, InspectionResult,
    ContractorReview, ReviewAuthorType,
)
from app.models.user import User
from app.models.issue import IssueCluster
from app.models.complaint import Complaint
from app.schemas.procurement import (
    TenderCreate, TenderResponse,
    BidCreate, BidResponse,
    WorkOrderResponse,
    FieldEvidenceCreate, FieldEvidenceResponse,
    InspectionCreate, InspectionResponse,
    ContractorReviewCreate, ContractorReviewResponse,
    ContractorProfileResponse,
)

router = APIRouter()


def _scorecard_for_contractor(db: Session, contractor: Contractor) -> dict:
    """Return only evidence-backed ratings; empty tables stay explicitly unavailable."""
    # A rating without a work order cannot be audited against delivered civic work.
    # Legacy showcase rows are retained for audit history but excluded from public scorecards.
    reviews = db.query(ContractorReview).filter(
        ContractorReview.contractor_id == contractor.id,
        ContractorReview.work_order_id.isnot(None),
    ).all()
    by_type: dict[ReviewAuthorType, list[float]] = {ReviewAuthorType.PUBLIC: [], ReviewAuthorType.AI: [], ReviewAuthorType.OFFICER: []}
    for review in reviews:
        if review.rating is not None:
            by_type.setdefault(review.author_type, []).append(float(review.rating))
    average = lambda values: round(sum(values) / len(values), 2) if values else None
    ai_reviews = by_type.get(ReviewAuthorType.AI, [])
    return {
        "public_rating": average(by_type.get(ReviewAuthorType.PUBLIC, [])),
        "ai_rating": average(ai_reviews),
        "officer_rating": average(by_type.get(ReviewAuthorType.OFFICER, [])),
        "overall_rating": average([score for score in (
            average(by_type.get(ReviewAuthorType.PUBLIC, [])),
            average(ai_reviews),
            average(by_type.get(ReviewAuthorType.OFFICER, [])),
        ) if score is not None]),
        "total_reviews_count": len(reviews),
        "ai_insights": contractor.ai_insights if ai_reviews and contractor.ai_insights else [],
    }


def enforce_city_scope(db: Session, user: User, city_id: UUID) -> UUID:
    """Keep ordinary municipality accounts inside their persisted city."""
    if user.role in {"admin", "supervisor", "municipality", "contractor"}:
        return city_id
    if not user.city:
        raise HTTPException(status_code=403, detail="This account has no assigned city")
    city = db.query(City).filter(func.lower(City.name) == user.city.strip().lower()).first()
    if not city or city.id != city_id:
        raise HTTPException(status_code=403, detail="This account cannot access another city")
    return city_id


# ── Pydantic body schemas used inline ─────────────────────────────────────────

class WorkOrderStatusUpdate(BaseModel):
    """Body schema for PATCH /work-orders/{id}/status"""
    status: WorkOrderStatus


# ── Helper: build enriched WorkOrderResponse ─────────────────────────────────

def _enrich_work_order(db: Session, wo: WorkOrder) -> dict:
    """Return a dict that satisfies WorkOrderResponse including joined fields."""
    tender: Optional[Tender] = db.get(Tender, wo.tender_id)
    contractor: Optional[Contractor] = db.get(Contractor, wo.contractor_id)

    data = {
        "id": wo.id,
        "tender_id": wo.tender_id,
        "bid_id": wo.bid_id,
        "contractor_id": wo.contractor_id,
        "award_value": wo.award_value,
        "status": wo.status,
        "target_completion_date": wo.target_completion_date,
        "created_at": wo.created_at,
        "planned_progress_pct": wo.planned_progress_pct,
        "reported_progress_pct": wo.reported_progress_pct,
        "verified_progress_pct": wo.verified_progress_pct,
        "risk_level": wo.risk_level,
    }

    if tender:
        data.update({
            "title": tender.title,
            "description": tender.description,
            "estimated_budget": tender.estimated_budget,
            "city_id": tender.city_id,
            "department_id": tender.department_id,
            "published_at": tender.published_at,
            "closed_at": tender.closed_at,
            "tender_status": tender.status,
        })

    if contractor:
        data.update({
            "contractor_name": contractor.company_name,
            "contractor_email": contractor.email,
        })

    return data


# ── Tenders ───────────────────────────────────────────────────────────────────

@router.post("/tenders", response_model=TenderResponse)
def create_tender(
    tender_in: TenderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer_permission("tenders.manage")),
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
        status=TenderStatus.DRAFT,
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
    current_user: User = Depends(get_current_user),
):
    city_id = enforce_city_scope(db, current_user, city_id)
    """
    List tenders.
    Contractors only see PUBLISHED/CLOSED tenders in cities where they are APPROVED.
    Officers see all tenders for their city.
    """
    if current_user.role == "contractor":
        stmt = select(ContractorCityRegistration).join(Contractor).where(
            and_(
                Contractor.auth_user_id == str(current_user.id),
                ContractorCityRegistration.city_id == city_id,
                ContractorCityRegistration.status == RegistrationStatus.APPROVED,
            )
        )
        reg = db.execute(stmt).scalar_one_or_none()
        if not reg:
            raise HTTPException(status_code=403, detail="Not an approved contractor in this city")

        query = select(Tender).where(
            and_(
                Tender.city_id == city_id,
                Tender.status.in_([TenderStatus.PUBLISHED, TenderStatus.CLOSED, TenderStatus.AWARDED]),
            )
        )
    else:
        query = select(Tender).where(Tender.city_id == city_id)

    if status:
        query = query.where(Tender.status == status)

    results = db.execute(query).scalars().all()
    return results


@router.get("/tenders/{tender_id}", response_model=TenderResponse)
def get_tender(
    tender_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get tender details"""
    tender = db.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    return tender


@router.post("/tenders/{tender_id}/bids", response_model=BidResponse)
def submit_bid(
    tender_id: UUID,
    bid_in: BidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a sealed bid for a tender"""
    if current_user.role != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can submit bids")

    tender = db.get(Tender, tender_id)
    if not tender or tender.status != TenderStatus.PUBLISHED:
        raise HTTPException(status_code=400, detail="Tender is not open for bidding")

    contractor = db.execute(
        select(Contractor).where(Contractor.auth_user_id == str(current_user.id))
    ).scalar_one_or_none()
    if not contractor:
        raise HTTPException(status_code=400, detail="Contractor profile not found")

    reg = db.execute(
        select(ContractorCityRegistration).where(
            and_(
                ContractorCityRegistration.contractor_id == contractor.id,
                ContractorCityRegistration.city_id == tender.city_id,
                ContractorCityRegistration.status == RegistrationStatus.APPROVED,
            )
        )
    ).scalar_one_or_none()
    if not reg:
        raise HTTPException(status_code=403, detail="Not eligible to bid in this city")

    existing_bid = db.execute(
        select(Bid).where(
            and_(Bid.tender_id == tender_id, Bid.contractor_id == contractor.id)
        )
    ).scalar_one_or_none()
    if existing_bid:
        raise HTTPException(status_code=400, detail="You have already submitted a bid for this tender")

    bid = Bid(
        tender_id=tender_id,
        contractor_id=contractor.id,
        quoted_amount=bid_in.quoted_amount,
        technical_proposal=bid_in.technical_proposal,
        status=BidStatus.SUBMITTED,
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)
    return bid


@router.get("/tenders/{tender_id}/bids", response_model=List[BidResponse])
def list_bids(
    tender_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer_permission("tenders.manage")),
):
    """(Officer Only) View submitted bids."""
    tender = db.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    if tender.status == TenderStatus.PUBLISHED:
        raise HTTPException(status_code=403, detail="Bids are sealed until tender is closed")

    bids = db.execute(select(Bid).where(Bid.tender_id == tender_id)).scalars().all()
    return bids


@router.post("/tenders/{tender_id}/bids/{bid_id}/award", response_model=WorkOrderResponse)
def award_bid(
    tender_id: UUID,
    bid_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer_permission("tenders.manage")),
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

    # Mark tender and winning bid
    tender.status = TenderStatus.AWARDED
    bid.status = BidStatus.WON

    # Reject all other bids on this tender
    losing_bids = db.execute(
        select(Bid).where(
            and_(Bid.tender_id == tender_id, Bid.id != bid_id)
        )
    ).scalars().all()
    for losing_bid in losing_bids:
        losing_bid.status = BidStatus.REJECTED

    # Auto-generate Work Order
    work_order = WorkOrder(
        tender_id=tender_id,
        bid_id=bid_id,
        contractor_id=bid.contractor_id,
        award_value=bid.quoted_amount,
        status=WorkOrderStatus.ISSUED,
    )
    db.add(work_order)
    db.commit()
    db.refresh(work_order)
    return WorkOrderResponse(**_enrich_work_order(db, work_order))


# ── Work Orders ───────────────────────────────────────────────────────────────

@router.get("/work-orders", response_model=List[WorkOrderResponse])
def list_work_orders(
    city_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List work orders based on role, enriched with Tender + Contractor data."""
    city_id = enforce_city_scope(db, current_user, city_id)
    if current_user.role == "contractor":
        contractor = db.execute(
            select(Contractor).where(Contractor.auth_user_id == str(current_user.id))
        ).scalar_one_or_none()
        if not contractor:
            return []
        query = select(WorkOrder).join(Tender).where(
            and_(
                WorkOrder.contractor_id == contractor.id,
                Tender.city_id == city_id,
            )
        )
    else:
        query = select(WorkOrder).join(Tender).where(Tender.city_id == city_id)

    results = db.execute(query).scalars().all()
    return [WorkOrderResponse(**_enrich_work_order(db, wo)) for wo in results]


@router.get("/work-orders/{work_order_id}", response_model=WorkOrderResponse)
def get_work_order(
    work_order_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single work order by ID, enriched with Tender + Contractor data."""
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")

    # Ownership and city checks: contractors see only their records; municipal users stay in their city.
    if current_user.role == "contractor":
        contractor = db.execute(
            select(Contractor).where(Contractor.auth_user_id == str(current_user.id))
        ).scalar_one_or_none()
        if not contractor or work_order.contractor_id != contractor.id:
            raise HTTPException(status_code=403, detail="Access denied")
    else:
        tender = db.get(Tender, work_order.tender_id)
        if tender:
            enforce_city_scope(db, current_user, tender.city_id)

    return WorkOrderResponse(**_enrich_work_order(db, work_order))


@router.patch("/work-orders/{work_order_id}/status", response_model=WorkOrderResponse)
def update_work_order_status(
    work_order_id: UUID,
    body: WorkOrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update work order status with role-based access control."""
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")

    # Role-based permission check
    contractor_transitions = {
        WorkOrderStatus.ISSUED: WorkOrderStatus.ACCEPTED,
        WorkOrderStatus.ACCEPTED: WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.IN_PROGRESS: WorkOrderStatus.INSPECTION_PENDING,
        WorkOrderStatus.REWORK: WorkOrderStatus.INSPECTION_PENDING,
    }
    officer_transitions = {
        WorkOrderStatus.INSPECTION_PENDING: [WorkOrderStatus.COMPLETED, WorkOrderStatus.INSPECTION_FAILED],
        WorkOrderStatus.INSPECTION_FAILED: [WorkOrderStatus.REWORK],
        WorkOrderStatus.COMPLETED: [WorkOrderStatus.CLOSED],
    }

    if current_user.role == "contractor":
        # Verify ownership
        contractor = db.execute(
            select(Contractor).where(Contractor.auth_user_id == str(current_user.id))
        ).scalar_one_or_none()
        if not contractor or work_order.contractor_id != contractor.id:
            raise HTTPException(status_code=403, detail="Access denied")
        allowed = contractor_transitions.get(work_order.status)
        if allowed != body.status:
            raise HTTPException(
                status_code=400,
                detail=f"Contractors cannot transition from {work_order.status} to {body.status}",
            )
    elif current_user.role in ("officer", "supervisor", "admin", "municipality"):
        if not officer_has_permission(current_user, "work_orders.manage"):
            raise HTTPException(status_code=403, detail="Your designation cannot transition work orders")
        allowed_list = officer_transitions.get(work_order.status, [])
        if body.status not in allowed_list:
            raise HTTPException(
                status_code=400,
                detail=f"Officers cannot transition from {work_order.status} to {body.status}",
            )
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    work_order.status = body.status
    db.commit()
    db.refresh(work_order)
    return WorkOrderResponse(**_enrich_work_order(db, work_order))


@router.post("/work-orders/{work_order_id}/evidence", response_model=FieldEvidenceResponse)
def submit_evidence(
    work_order_id: UUID,
    evidence_in: FieldEvidenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """(Contractor) Upload field evidence for completed work."""
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")

    if current_user.role != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can submit field evidence")

    # Verify contractor ownership
    if current_user.role == "contractor":
        contractor = db.execute(
            select(Contractor).where(Contractor.auth_user_id == str(current_user.id))
        ).scalar_one_or_none()
        if not contractor or work_order.contractor_id != contractor.id:
            raise HTTPException(status_code=403, detail="Access denied")

    evidence = FieldEvidence(
        work_order_id=work_order_id,
        photo_url=evidence_in.photo_url,
        description=evidence_in.description,
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
    current_user: User = Depends(require_officer_permission("work_orders.inspect")),
):
    """(Officer Only) Inspect field evidence. If PASS, auto-resolves the linked Civic Issue and Complaints."""
    work_order = db.get(WorkOrder, work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work Order not found")

    evidence = db.execute(
        select(FieldEvidence)
        .where(FieldEvidence.work_order_id == work_order_id)
        .order_by(FieldEvidence.created_at.desc())
    ).scalars().first()
    if not evidence:
        raise HTTPException(status_code=400, detail="No field evidence found to inspect")

    # Normalise result: accept both PASS/FAIL and PASSED/FAILED from frontend
    raw_result = inspection_in.result.upper()
    result_map = {"PASSED": "PASS", "FAILED": "FAIL", "PASS": "PASS", "FAIL": "FAIL", "REWORK": "REWORK"}
    normalised = result_map.get(raw_result)
    if not normalised:
        raise HTTPException(status_code=422, detail=f"Invalid inspection result: {inspection_in.result}. Use PASS, FAIL, or REWORK.")

    inspection = Inspection(
        field_evidence_id=evidence.id,
        inspector_user_id=current_user.id,
        result=InspectionResult(normalised),
        feedback=inspection_in.feedback,
    )
    db.add(inspection)

    if normalised == "PASS":
        work_order.status = WorkOrderStatus.COMPLETED

        # Super Workflow: Resolve linked Civic Issue and all underlying Complaints
        tender = db.get(Tender, work_order.tender_id)
        if tender and tender.civic_issue_id:
            issue = db.get(IssueCluster, tender.civic_issue_id)
            if issue:
                issue.status = "resolved"
                from app.models.issue import IssueComplaint
                tied_complaints = db.execute(
                    select(Complaint).join(IssueComplaint).where(IssueComplaint.issue_id == issue.id)
                ).scalars().all()
                for c in tied_complaints:
                    c.status = "resolved"

    elif normalised == "FAIL":
        # FAIL is terminal — close the work order permanently
        work_order.status = WorkOrderStatus.CLOSED

    else:
        # REWORK — send back for contractor remediation
        work_order.status = WorkOrderStatus.REWORK

    db.commit()
    db.refresh(inspection)
    return inspection


# ── Contractors & 3-Way Ratings ───────────────────────────────────────────────

@router.get("/contractors", response_model=List[ContractorProfileResponse])
def list_contractors(
    db: Session = Depends(get_db),
):
    """List all contractors with their 3-way ratings (Public, AI, Officer)."""
    contractors = db.query(Contractor).all()
    results = []
    for c in contractors:
        scorecard = _scorecard_for_contractor(db, c)
        results.append(
            ContractorProfileResponse(
                id=c.id,
                company_name=c.company_name,
                contact_person=c.contact_person or "Operations Lead",
                email=c.email,
                phone=c.phone or "",
                **scorecard,
            )
        )
    return results


@router.get("/contractors/{contractor_id}", response_model=ContractorProfileResponse)
def get_contractor_profile(
    contractor_id: UUID,
    db: Session = Depends(get_db),
):
    """Get single contractor profile with 3-dimensional ratings."""
    c = db.get(Contractor, contractor_id)
    if not c:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return ContractorProfileResponse(
        id=c.id,
        company_name=c.company_name,
        contact_person=c.contact_person or "Operations Lead",
        email=c.email,
        phone=c.phone or "",
        **_scorecard_for_contractor(db, c),
    )


@router.post("/contractors/{contractor_id}/ratings", response_model=ContractorReviewResponse)
def submit_contractor_rating(
    contractor_id: UUID,
    review_in: ContractorReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a rating from a citizen or a municipal officer."""
    c = db.get(Contractor, contractor_id)
    if not c:
        raise HTTPException(status_code=404, detail="Contractor not found")
    if not review_in.work_order_id:
        raise HTTPException(status_code=422, detail="A rating must reference a completed or inspected work order")
    work_order = db.get(WorkOrder, review_in.work_order_id)
    if not work_order or work_order.contractor_id != contractor_id:
        raise HTTPException(status_code=422, detail="The referenced work order does not belong to this contractor")
    
    author_type = ReviewAuthorType.OFFICER if current_user.role in ["officer", "supervisor", "municipality", "admin"] else ReviewAuthorType.PUBLIC
    
    review = ContractorReview(
        contractor_id=contractor_id,
        work_order_id=review_in.work_order_id,
        author_type=author_type,
        author_name=current_user.name or "Verified Citizen",
        author_id=str(current_user.id),
        rating=review_in.rating,
        comment=review_in.comment,
        category=review_in.category or "General Performance",
        evidence_urls=review_in.evidence_urls
    )
    db.add(review)
    
    # Recalculate average rating for that category
    all_reviews = db.query(ContractorReview).filter(
        ContractorReview.contractor_id == contractor_id,
        ContractorReview.author_type == author_type
    ).all()
    avg_score = sum(r.rating for r in all_reviews) / max(1, len(all_reviews))
    
    if author_type == ReviewAuthorType.OFFICER:
        c.officer_rating = round(avg_score, 1)
    else:
        c.public_rating = round(avg_score, 1)
    
    c.total_reviews_count = (c.total_reviews_count or 0) + 1
    db.commit()
    db.refresh(review)
    return review


@router.get("/contractors/{contractor_id}/ratings", response_model=List[ContractorReviewResponse])
def list_contractor_ratings(
    contractor_id: UUID,
    db: Session = Depends(get_db),
):
    """Get all public and officer reviews for a contractor."""
    reviews = db.query(ContractorReview).filter(
        ContractorReview.contractor_id == contractor_id,
        ContractorReview.work_order_id.isnot(None),
    ).order_by(ContractorReview.created_at.desc()).all()
    return reviews

