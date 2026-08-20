"""Remove orphaned legacy demo contractor company profiles.



This is an intentionally narrow, irreversible production cleanup. It deletes

only the two exact legacy name/email pairs approved for removal, and refuses to

proceed if a company has an active login, bid, work order, or rating history.

"""



from datetime import datetime, timezone

from uuid import uuid4



from alembic import op

import sqlalchemy as sa





revision = "20260820_cleanup_demo_ctr"

down_revision = ("20260820_complaint_assignment", "9284456fe81d")

branch_labels = None

depends_on = None





_TARGETS = (
  
    ("Vadodara Infra (Demo)", "contractor@vadodara-infra.in"),
  
    ("BBMP Infra (Demo)", "contractor@bbmp-infra.in"),
  
)





def upgrade() -> None:
  
    conn = op.get_bind()
  


    for company_name, company_email in _TARGETS:
      
        row = conn.execute(
          
            sa.text(
              
                """
                
                SELECT id, company_name, email, auth_user_id
                
                FROM contractors
                
                WHERE company_name = :company_name
                
                  AND lower(email) = :company_email
                  
                """
              
            ),
          
            {"company_name": company_name, "company_email": company_email},
          
        ).mappings().first()
      
        if not row:
          
            continue
          


        linked_user = None
      
        if row["auth_user_id"]:
          
            linked_user = conn.execute(
              
                sa.text(
                  
                    "SELECT id, email FROM users WHERE id::text = :auth_user_id"
                  
                ),
              
                {"auth_user_id": str(row["auth_user_id"])},
              
            ).mappings().first()
          
        if linked_user:
          
            raise RuntimeError(
              
                f"Refusing to delete {company_name}: active login linkage "
              
                f"{linked_user['email']} still exists"
              
            )
          


        counts = {}
      
        for table in ("bids", "work_orders", "contractor_reviews"):
          
            counts[table] = conn.execute(
              
                sa.text(f"SELECT COUNT(*) FROM {table} WHERE contractor_id = :contractor_id"),
              
                {"contractor_id": row["id"]},
              
            ).scalar_one()
          
        if any(counts.values()):
          
            raise RuntimeError(
              
                f"Refusing to delete {company_name}: preserved operational references "
              
                f"{counts}"
              
            )
          


        registration_count = conn.execute(
          
            sa.text(
              
                """
                
                SELECT COUNT(*)
                
                FROM contractor_city_registrations
                
                WHERE contractor_id = :contractor_id
                
                """
              
            ),
          
            {"contractor_id": row["id"]},
          
        ).scalar_one()
      


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
              
                "actor_id": "system:guarded-cleanup",
              
                "actor_name": "Civic Sathi Migration",
              
                "actor_role": "system",
              
                "action": "DELETE_LEGACY_DEMO_CONTRACTOR",
              
                "entity_type": "Contractor",
              
                "entity_id": str(row["id"]),
              
                "entity_label": company_name,
              
                "previous_value": f"registrations={registration_count}; bids=0; work_orders=0; ratings=0",
              
                "reason": "Approved guarded cleanup of an orphaned legacy demo company",
              
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
      




def downgrade() -> None:
    raise RuntimeError(
        "20260820_cleanup_legacy_demo_contractors is intentionally irreversible"
    )
