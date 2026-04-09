from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db_connection import get_db
from models import Favourite, Bag, Vendor, User

router = APIRouter()


class FavouriteRequest(BaseModel):
    user_id: int
    bag_id: int


@router.post("/customer/favourites")
def add_favourite(data: FavouriteRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        return {"error": "user not found"}

    bag = db.query(Bag).filter(Bag.id == data.bag_id).first()
    if not bag:
        return {"error": "bag not found"}

    existing = db.query(Favourite).filter(
        Favourite.user_id == data.user_id,
        Favourite.bag_id == data.bag_id
    ).first()

    if existing:
        return {"message": "already favourited"}

    favourite = Favourite(
        user_id=data.user_id,
        bag_id=data.bag_id
    )

    db.add(favourite)
    db.commit()

    return {"message": "bag added to favourites"}


@router.delete("/customer/favourites")
def remove_favourite(data: FavouriteRequest, db: Session = Depends(get_db)):
    favourite = db.query(Favourite).filter(
        Favourite.user_id == data.user_id,
        Favourite.bag_id == data.bag_id
    ).first()

    if not favourite:
        return {"error": "favourite not found"}

    db.delete(favourite)
    db.commit()

    return {"message": "bag removed from favourites"}


@router.get("/customer/favourites/{user_id}")
def get_favourites(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "user not found"}

    rows = db.query(Bag, Vendor).join(
        Favourite, Favourite.bag_id == Bag.id
    ).join(
        Vendor, Vendor.id == Bag.vendor_id
    ).filter(
        Favourite.user_id == user_id
    ).all()

    response = []
    for bag, vendor in rows:
        response.append({
            "bag_id": bag.id,
            "product_name": bag.product_name,
            "description": bag.description,
            "category": bag.category,
            "discounted_price": float(bag.discounted_price),
            "pickup_window_start": str(bag.pickup_window_start),
            "pickup_window_end": str(bag.pickup_window_end),
            "vendor_name": vendor.name
        })

    return response