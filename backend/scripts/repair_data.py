"""Run explicit production data repairs outside the FastAPI process lifecycle."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Sequence


# Running ``python scripts/repair_data.py`` places ``scripts`` on sys.path.
# Add the backend root so the application package remains importable.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.core.database import SessionLocal
from app.core.logging import get_logger, setup_logging
from app.services.data_integrity import (
    ensure_historical_city_separation,
    ensure_working_contractor_access,
)


logger = get_logger(__name__)


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    """Parse the explicitly requested repair operations."""
    parser = argparse.ArgumentParser(
        description="Run idempotent Civic Sathi data repairs against the configured database.",
    )
    parser.add_argument(
        "--city-separation",
        action="store_true",
        help="Correct historical complaint city assignments from known location signals.",
    )
    parser.add_argument(
        "--contractor-access",
        action="store_true",
        help="Repair the documented contractor account and city registrations.",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Run every repair defined by this command.",
    )
    args = parser.parse_args(argv)
    if not (args.city_separation or args.contractor_access or args.all):
        parser.error("select at least one repair flag or use --all")
    return args


def main(argv: Sequence[str] | None = None) -> int:
    """Execute selected repairs and return a process-compatible status code."""
    args = parse_args(argv)
    setup_logging()

    try:
        with SessionLocal() as db:
            if args.city_separation or args.all:
                updated = ensure_historical_city_separation(db)
                logger.info("City separation repair completed: %s complaint rows updated", updated)
            if args.contractor_access or args.all:
                updated = ensure_working_contractor_access(db)
                logger.info("Contractor access repair completed: %s records updated", updated)
    except Exception:
        logger.exception("Data repair failed; no further repairs were attempted")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
