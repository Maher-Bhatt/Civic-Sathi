"""Remove the exact stray Test contractor identity for the SIH demo.

This migration is intentionally narrow and refuses to remove a company that has
operational history. It preserves complaints, bids, work orders, and reviews.
"""

from datetime import datetime, timezone
from uuid import uuid4

from alembic import op
import sqlalchemy as sa


revision = "20260820_cleanup_sih_demo_company"
down_revision = "20260820_cleanup_demo_ctr"
branch_labels = None
depends_on = None

_TARGET_COMPANY = "Test"
_TARGET_EMAIL = "aarya@test.in"


def upgrade() -> None:
    conn = op.get_bind()
    row = conn.execute(
        sa.text(
            """
            SELECT id, company_name, email, auth_user_id
            FROM contractors
            WHERE company_name = :company_name
              AND lower(email) = :company_email
            """
        ),
        {"company_name": _TARGET_COMPANY, "company_email": _TARGET_EMAIL},
    ).mappings().first()

    if not row:
        return

    counts = {}
    for table in ("bids", "work_orders", "contractor_reviews"):
        counts[table] = conn.execute(
            sa.text(f"SELECT COUNT(*) FROM {table} WHERE contractor_id = :contractor_id"),
            {"contractor_id": row["id"]},
        ).scalar_one()
    if any(counts.values()):
        raise RuntimeError(
            f"Refusing to remove {_TARGET_COMPANY}: operational history exists {counts}"
        )

    registration_count = conn.execute(
        sa.text(
            "SELECT COUNT(*) FROM contractor_city_registrations "
            "WHERE contractor_id = :contractor_id"
        ),
        {"contractor_id": row["id"]},
    ).scalar_one()

    linked_user = None
    if row["auth_user_id"]:
        linked_user = conn.execute(
            sa.text(
                "SELECT id, email, role FROM users "
                "WHERE id::text = :auth_user_id"
            ),
            {"auth_user_id": str(row["auth_user_id"])},
        ).mappings().first()

    conn.execute(
        sa.text(
            """
            INSERT INTO platform_audit_logs
                (id, actor_id, actor_name, actor_role, action, entity_type,
                 entity_id, entity_label, previous_value, reason, at)
            VALUES
                (:id, :actor_id, :actor_name, :actor_role, :action, :entity_type,
                 :entity_id, :entity_label, :previous_value, :reason, :at)
            """
        ),
        {
            "id": str(uuid4()),
            "actor_id": "system:guarded-sih-cleanup",
            "actor_name": "Civic Sathi SIH Preparation",
            "actor_role": "system",
            "action": "DELETE_SIH_DEMO_CONTRACTOR",
            "entity_type": "Contractor",
            "entity_id": str(row["id"]),
            "entity_label": _TARGET_COMPANY,
            "previous_value": (
                f"email={row['email']}; registrations={registration_count}; "
                f"bids=0; work_orders=0; reviews=0; "
                f"linked_user={linked_user['email'] if linked_user else 'none'}"
            ),
            "reason": "Approved removal of the exact stray SIH demo contractor identity; operational history was empty",
            "at": datetime.now(timezone.utc),
        },
    )

    conn.execute(
        sa.text(
            "DELETE FROM contractor_city_registrations "
            "WHERE contractor_id = :contractor_id"
        ),
        {"contractor_id": row["id"]},
    )
    conn.execute(
        sa.text("DELETE FROM contractors WHERE id = :contractor_id"),
        {"contractor_id": row["id"]},
    )

    if linked_user:
        conn.execute(
            sa.text(
                "UPDATE complaints SET submitted_by_id = NULL "
                "WHERE submitted_by_id = :user_id"
            ),
            {"user_id": linked_user["id"]},
        )
        conn.execute(
            sa.text(
                "UPDATE complaints SET assigned_officer_id = NULL "
                "WHERE assigned_officer_id = :user_id"
            ),
            {"user_id": linked_user["id"]},
        )
        conn.execute(
            sa.text("DELETE FROM users WHERE id = :user_id"),
            {"user_id": linked_user["id"]},
        )


def downgrade() -> None:
    raise RuntimeError(
        "20260820_cleanup_sih_demo_company is intentionally irreversible"
    )
