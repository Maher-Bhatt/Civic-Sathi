"""Data-quality queue for conflicts that require a human decision."""

from sqlalchemy.orm import Session

from app.models import DataQualityIssue


def raise_identity_conflict(
    db: Session,
    *,
    identity_id: str,
    existing_name: str,
    incoming_name: str,
    source_system_key: str,
) -> DataQualityIssue:
    issue = DataQualityIssue(
        issue_type="POSSIBLE_IDENTITY_CONFLICT",
        severity="HIGH",
        identity_id=identity_id,
        details={
            "existing_name": existing_name,
            "incoming_name": incoming_name,
            "source_system_key": source_system_key,
            "reason": "A shared strong identifier has materially different names.",
        },
    )
    db.add(issue)
    return issue


def resolve_issue(db: Session, issue: DataQualityIssue, action: str, notes: str) -> DataQualityIssue:
    issue.status = action
    issue.resolution = notes
    return issue
