from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db_connection import get_db
from models import Bag, Reservation, User, Vendor

router = APIRouter()


class VendorReservationRequest(BaseModel):
    vendor_id: int
    reservation_id: int


@router.get("/vendor/reservations/{vendor_id}")
def get_vendor_reservations(vendor_id: int, status: str | None = None, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        return {"error": "vendor not found"}

    query = db.query(Reservation, Bag, User).join(
        Bag, Bag.id == Reservation.bag_id
    ).join(
        User, User.id == Reservation.user_id
    ).filter(
        Bag.vendor_id == vendor_id
    )

    if status:
        query = query.filter(Reservation.status == status)

    rows = query.order_by(Reservation.created_at.desc(), Reservation.id.desc()).all()

    response = []
    for reservation, bag, user in rows:
        response.append({
            "reservation_id": reservation.id,
            "bag_id": bag.id,
            "product_name": bag.product_name,
            "user_id": user.id,
            "user_name": user.name,
            "user_email": user.email,
            "reservation_status": reservation.status,
            "payment_status": reservation.payment_status,
            "pickup_window_start": str(bag.pickup_window_start),
            "pickup_window_end": str(bag.pickup_window_end),
            "created_at": str(reservation.created_at) if reservation.created_at else None,
        })

    return response


@router.post("/vendor/mark-payment-collected")
def mark_payment_collected(data: VendorReservationRequest, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).join(Bag, Bag.id == Reservation.bag_id).filter(
        Reservation.id == data.reservation_id,
        Bag.vendor_id == data.vendor_id
    ).first()
    if not reservation:
        return {"error": "reservation not found for this vendor"}

    if reservation.status != "reserved":
        return {"error": "payment can only be marked for active reservations"}

    reservation.payment_status = "paid"
    db.commit()

    return {
        "message": "payment marked as collected",
        "reservation_id": reservation.id,
        "payment_status": reservation.payment_status,
    }


@router.post("/vendor/mark-collected")
def mark_collected(data: VendorReservationRequest, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).join(Bag, Bag.id == Reservation.bag_id).filter(
        Reservation.id == data.reservation_id,
        Bag.vendor_id == data.vendor_id
    ).first()
    if not reservation:
        return {"error": "reservation not found for this vendor"}

    if reservation.status != "reserved":
        return {"error": "only active reservations can be marked as collected"}

    if reservation.payment_status != "paid":
        return {"error": "mark payment collected first"}

    reservation.status = "collected"
    db.commit()

    return {
        "message": "reservation marked as collected",
        "reservation_id": reservation.id,
        "reservation_status": reservation.status,
        "payment_status": reservation.payment_status,
    }

    return response
