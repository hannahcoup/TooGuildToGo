from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db_connection import get_db
from models import Bag, Reservation, User

router = APIRouter()


class ReserveBagRequest(BaseModel):
    user_id: int
    bag_id: int


class CancelReservationRequest(BaseModel):
    user_id: int
    reservation_id: int


@router.post("/customer/reserve-bag")
def reserve_bag(data: ReserveBagRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        return {"error": "user not found"}

    bag = db.query(Bag).filter(Bag.id == data.bag_id).first()
    if not bag:
        return {"error": "bag not found"}

    if bag.status != "available" or bag.quantity <= 0:
        return {"error": "this bag is not available"}

    active_reservation = db.query(Reservation).filter(
        Reservation.user_id == data.user_id,
        Reservation.bag_id == data.bag_id,
        Reservation.status == "reserved"
    ).first()
    if active_reservation:
        return {"error": "you already have an active reservation for this bag"}

    new_reservation = Reservation(
        user_id=data.user_id,
        bag_id=data.bag_id,
        status="reserved",
        payment_status="paid"
        
    )
    db.add(new_reservation)

    bag.quantity -= 1
    if bag.quantity == 0:
        bag.status = "reserved"

    db.commit()
    db.refresh(new_reservation)

    return {
        "message": "bag reserved successfully",
        "reservation_id": new_reservation.id,
        "bag_id": bag.id,
        "product_name": bag.product_name,
        "payment_status": new_reservation.payment_status,
    }


@router.get("/customer/reservations/{user_id}")
def get_customer_reservations(user_id: int, status: str | None = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "user not found"}

    query = db.query(Reservation, Bag).join(Bag, Bag.id == Reservation.bag_id).filter(
        Reservation.user_id == user_id
    )

    if status:
        query = query.filter(Reservation.status == status)

    rows = query.order_by(Reservation.created_at.desc(), Reservation.id.desc()).all()

    response = []
    for reservation, bag in rows:
        response.append({
            "reservation_id": reservation.id,
            "bag_id": bag.id,
            "product_name": bag.product_name,
            "vendor_id": bag.vendor_id,
            "reservation_status": reservation.status,
            "payment_status": reservation.payment_status,
            "pickup_window_start": str(bag.pickup_window_start),
            "pickup_window_end": str(bag.pickup_window_end),
            "created_at": str(reservation.created_at) if reservation.created_at else None,
            "category": str(bag.category)
        })

    return response


@router.post("/customer/cancel-reservation")
def cancel_reservation(data: CancelReservationRequest, db: Session = Depends(get_db)):
    row = db.query(Reservation, Bag).join(Bag, Bag.id == Reservation.bag_id).filter(
        Reservation.id == data.reservation_id,
        Reservation.user_id == data.user_id
    ).first()
    if not row:
        return {"error": "reservation not found for this user"}

    reservation, bag = row

    if reservation.status != "reserved":
        return {"error": "only active reservations can be cancelled"}

    reservation.status = "cancelled"
    if reservation.payment_status == "paid":
        reservation.payment_status = "refunded"

    bag.quantity += 1
    bag.status = "available"

    db.commit()

    return {
        "message": "reservation cancelled successfully",
        "reservation_id": reservation.id,
        "reservation_status": reservation.status,
        "payment_status": reservation.payment_status,
    }
