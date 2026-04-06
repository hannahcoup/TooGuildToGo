from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
from sqlalchemy import text

router = APIRouter()

#get route for returning all reservations for a particular vendor_id
@router.get("/reservations")
def get_reservations(vendor_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT 
                r.id as reservation_id,
                u.name as student_name,
                u.email as student_email,
                b.id as bag_id,
                b.product_name,
                b.category,
                b.description,
                b.discounted_price,
                b.pickup_window_start,
                b.pickup_window_end,
                r.status,
                r.payment_status
            FROM reservations r
            JOIN users u ON u.id = r.user_id
            JOIN bags b ON b.id = r.bag_id
            WHERE b.vendor_id = :vendor_id
            ORDER BY b.pickup_window_start
        """),
        {"vendor_id": vendor_id}
    ).fetchall()

    return [
        {
            "reservation_id": row[0],
            "student_name": row[1],
            "student_email": row[2],
            "bag_id": row[3],
            "product_name": row[4],
            "category": row[5],
            "description": row[6],
            "discounted_price": float(row[7]),
            "pickup_window_start": str(row[8]),
            "pickup_window_end": str(row[9]),
            "status": row[10],
            "payment_status": row[11]
        }
        for row in result
    ]


class UpdateReservationStatus(BaseModel):
    status: str

class UpdatePaymentStatus(BaseModel):
    payment_status: str

#updates reservation status to mark as collected
@router.patch("/reservations/{reservation_id}")
def update_reservation_status(reservation_id: int, data: UpdateReservationStatus, db: Session = Depends(get_db)):
    result = db.execute(
        text("UPDATE reservations SET status = :status WHERE id = :id"),
        {"status": data.status, "id": reservation_id}
    )
    db.commit()
    if result.rowcount == 0:
        return {"error": "Reservation not found"}
    return {"message": "Reservation updated successfully"}

#updates payment_status to paid
@router.patch("/reservations/{reservation_id}/payment")
def update_payment_status(reservation_id: int, data: UpdatePaymentStatus, db: Session = Depends(get_db)):
    result = db.execute(
        text("UPDATE reservations SET payment_status = :payment_status WHERE id = :id"),
        {"payment_status": data.payment_status, "id": reservation_id}
    )
    db.commit()
    if result.rowcount == 0:
        return {"error": "Reservation not found"}
    return {"message": "Payment status updated successfully"}