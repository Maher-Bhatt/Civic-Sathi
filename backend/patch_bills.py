import sys
import uuid
import random
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.procurement import Bill, BillStatus, WorkOrder, Contractor

def run():
    db = SessionLocal()
    work_orders = db.execute(select(WorkOrder)).scalars().all()
    
    if not work_orders:
        print('No work orders found, skipping bills')
        return

    # Check if bills exist
    bills = db.execute(select(Bill)).scalars().all()
    if bills:
        print('Bills already exist, skipping')
        return

    statuses = [BillStatus.SUBMITTED, BillStatus.APPROVED, BillStatus.REJECTED]
    
    for wo in work_orders[:5]:
        b = Bill(
            id=uuid.uuid4(),
            work_order_id=wo.id,
            contractor_id=wo.contractor_id,
            amount=random.uniform(50000, 500000),
            description=f"Payment for phase 1 of {wo.id}",
            status=random.choice(statuses)
        )
        db.add(b)
        
    db.commit()
    print('Patched mock bills.')
    db.close()

if __name__ == '__main__':
    run()
