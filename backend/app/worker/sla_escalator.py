import logging
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.complaint import Complaint
from app.models.sla import SLARule

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_sla_breaches():
    db: Session = SessionLocal()
    try:
        # Get all active complaints
        active_complaints = db.query(Complaint).filter(Complaint.status.notin_(["resolved", "rejected", "closed"])).all()
        
        # Get SLA rules
        sla_rules = db.query(SLARule).filter(SLARule.is_active == True).all()
        sla_map = {(rule.category, rule.severity): rule for rule in sla_rules}
        
        now = datetime.now(timezone.utc)
        
        for complaint in active_complaints:
            if not complaint.created_at:
                continue
            
            # Default SLA if not found (Fallback to 72 hours)
            resolution_hours = 72
            rule = sla_map.get((complaint.category, complaint.priority))
            if rule:
                resolution_hours = rule.resolution_hours
                
            elapsed = (now - complaint.created_at.replace(tzinfo=timezone.utc)).total_seconds() / 3600
            
            if elapsed >= resolution_hours * 0.8 and complaint.priority != "critical":
                # Breach 80% SLA
                complaint.priority = "critical"
                
                # Append to timeline
                timeline = complaint.timeline_json or []
                # Re-assigning to avoid mutability issues with SQLAlchemy JSONB
                timeline = list(timeline)
                timeline.append({
                    "timestamp": now.isoformat(),
                    "event": "SLA Warning",
                    "details": f"Elapsed time {elapsed:.1f}h is >= 80% of SLA ({resolution_hours}h)"
                })
                complaint.timeline_json = timeline
                
                logger.info(f"Escalated complaint {complaint.id} due to SLA breach risk.")
                
        db.commit()
    except Exception as e:
        logger.error(f"Error in SLA escalator: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    check_sla_breaches()
