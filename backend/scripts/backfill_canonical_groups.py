"""Backfill durable canonical groups for complaints created before synchronous matching.

Run from backend/ after deployment with the production environment loaded:
    python scripts/backfill_canonical_groups.py

The operation is idempotent: existing complaint-to-group links are reused and
new links are added only when needed. It commits each complaint independently so
a single malformed legacy record does not discard earlier repairs.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.complaint import Complaint, ComplaintAnalysis
from app.services.canonical_grouping import assign_canonical_group
from app.ml.embeddings import embed_text

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def main() -> None:
    repaired = 0
    failed = 0
    with SessionLocal() as db:
        complaints = list(db.execute(select(Complaint).order_by(Complaint.created_at.asc(), Complaint.id.asc())).scalars())
        for complaint in complaints:
            try:
                analysis = complaint.analysis
                embedding = analysis.embedding_vector if analysis else None
                if not embedding:
                    embedding = embed_text(f"{complaint.title}. {complaint.description}")
                    if analysis is None:
                        analysis = ComplaintAnalysis(complaint_id=complaint.id)
                        db.add(analysis)
                    analysis.embedding_vector = embedding
                group_id, matches, operation = assign_canonical_group(db, complaint, embedding)
                if analysis is not None:
                    analysis.candidate_issue_id = group_id
                    analysis.duplicate_score = max((score for _, score, _ in matches), default=1.0)
                    analysis.ai_status = "DUPLICATE" if matches else "UNIQUE"
                db.commit()
                repaired += 1
                logger.info(
                    "canonical_backfill complaint_id=%s group_id=%s operation=%s related=%d",
                    complaint.id,
                    group_id,
                    operation,
                    len(matches),
                )
            except Exception as exc:
                db.rollback()
                failed += 1
                logger.error("canonical_backfill_failed complaint_id=%s error=%s", complaint.id, type(exc).__name__)

    logger.info("canonical_backfill_complete repaired=%d failed=%d at=%s", repaired, failed, datetime.now(timezone.utc).isoformat())
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
