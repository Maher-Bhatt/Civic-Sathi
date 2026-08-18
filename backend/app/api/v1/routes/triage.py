"""AI Triage and Human Governance API endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import get_db
from app.models.complaint import Complaint, ComplaintAnalysis
from app.models.issue import IssueComplaint, IssueCluster
from app.core.security import get_current_officer

router = APIRouter()

@router.get("/pending")
def get_pending_triage(
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer)
):
    """
    Get complaints flagged as RELATED by AI that need human review to 
    determine if they are DUPLICATE or UNIQUE.
    """
    # Fetch ComplaintAnalysis where ai_status == "RELATED"
    query = select(ComplaintAnalysis).where(ComplaintAnalysis.ai_status == "RELATED")
    results = db.execute(query).scalars().all()
    
    triage_items = []
    for analysis in results:
        complaint = analysis.complaint
        candidate_issue = None
        if analysis.candidate_issue_id:
            candidate_issue = db.get(IssueCluster, analysis.candidate_issue_id)
            
        triage_items.append({
            "analysis_id": analysis.id,
            "complaint": {
                "id": complaint.id,
                "public_id": complaint.public_id,
                "title": complaint.title,
                "description": complaint.description,
                "city_id": complaint.city_id,
                "created_at": complaint.created_at,
            } if complaint else None,
            "candidate_issue": {
                "id": candidate_issue.id,
                "title": candidate_issue.title,
                "summary": candidate_issue.summary,
                "complaint_count": candidate_issue.complaint_count,
            } if candidate_issue else None,
            "duplicate_score": analysis.duplicate_score,
            "ai_status": analysis.ai_status
        })
        
    return {"pending_triage": triage_items}


@router.post("/{complaint_id}/approve")
def approve_duplicate(
    complaint_id: UUID,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer)
):
    """
    Human approves the AI's RELATED flag and confirms it is a DUPLICATE.
    Merges complaint into the candidate issue.
    """
    analysis = db.query(ComplaintAnalysis).filter(ComplaintAnalysis.complaint_id == complaint_id).first()
    if not analysis or analysis.ai_status != "RELATED":
        raise HTTPException(status_code=400, detail="Complaint is not pending triage review")
        
    # Update AI status
    analysis.ai_status = "DUPLICATE"
    
    # Update relationship in IssueComplaint
    link = db.query(IssueComplaint).filter(
        IssueComplaint.complaint_id == complaint_id,
        IssueComplaint.issue_id == analysis.candidate_issue_id
    ).first()
    
    if link:
        link.relationship_type = "DUPLICATE"
        
        # Increment issue complaint count
        issue = db.get(IssueCluster, analysis.candidate_issue_id)
        if issue:
            issue.complaint_count += 1
            
    db.commit()
    return {"status": "success", "message": "Merged as DUPLICATE"}


@router.post("/{complaint_id}/reject")
def reject_duplicate(
    complaint_id: UUID,
    db: Session = Depends(get_db),
    current_officer: dict = Depends(get_current_officer)
):
    """
    Human rejects the AI's RELATED flag and confirms it is UNIQUE.
    Splits into a new Civic Issue.
    """
    analysis = db.query(ComplaintAnalysis).filter(ComplaintAnalysis.complaint_id == complaint_id).first()
    if not analysis or analysis.ai_status != "RELATED":
        raise HTTPException(status_code=400, detail="Complaint is not pending triage review")
        
    # Update AI status
    analysis.ai_status = "UNIQUE"
    
    # Remove old relationship
    link = db.query(IssueComplaint).filter(
        IssueComplaint.complaint_id == complaint_id,
        IssueComplaint.issue_id == analysis.candidate_issue_id
    ).first()
    
    if link:
        db.delete(link)
        
    complaint = analysis.complaint
    
    # Create new issue
    from datetime import datetime, timezone
    new_issue = IssueCluster(
        title=complaint.title,
        summary=complaint.description,
        category=complaint.category,
        department_id=complaint.department_id,
        ward_id=complaint.ward_id,
        city_id=complaint.city_id,
        status="open",
        risk_level="medium",
        risk_score=complaint.risk_score if hasattr(complaint, 'risk_score') else 50,
        complaint_count=1,
        centroid_lat=complaint.lat,
        centroid_lng=complaint.lng,
        first_seen_at=datetime.now(timezone.utc),
        last_seen_at=datetime.now(timezone.utc)
    )
    db.add(new_issue)
    db.flush()
    
    analysis.candidate_issue_id = new_issue.id
    
    new_link = IssueComplaint(
        issue_id=new_issue.id,
        complaint_id=complaint.id,
        similarity_score=1.0,
        relationship_type="UNIQUE",
        confidence_score=1.0,
        added_at=datetime.now(timezone.utc)
    )
    db.add(new_link)
    
    db.commit()
    return {"status": "success", "message": "Split as UNIQUE new issue"}
