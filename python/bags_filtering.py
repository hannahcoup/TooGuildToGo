# Filtering logic
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db_connection import get_db
from models import Bag, DietaryTag, BagDietaryTag, Vendor

router = APIRouter()

@router.get("/bags")
def get_bags(tag: str = None, vendor_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Bag, Vendor).join(Vendor, Vendor.id == Bag.vendor_id)

    if tag:
        dietary_tag = db.query(DietaryTag).filter(DietaryTag.name == tag).first()
        if not dietary_tag:
            return []
        query = query.join(BagDietaryTag, BagDietaryTag.bag_id == Bag.id).filter(
            BagDietaryTag.dietary_tag_id == dietary_tag.id
        )

    if vendor_id:
        query = query.filter(Bag.vendor_id == vendor_id)

    query = query.filter(Bag.status == "available", Bag.quantity > 0)

    results = query.all()
    response = []
    for bag, vendor in results:
        response.append({
            "bag_id": bag.id,
            "product_name": bag.product_name,
            "description": bag.description,
            "category": bag.category,
            "original_price": float(bag.original_price),
            "discounted_price": float(bag.discounted_price),
            "quantity": bag.quantity,
            "pickup_window_start": str(bag.pickup_window_start),
            "pickup_window_end": str(bag.pickup_window_end),
            "expires_at": str(bag.expires_at),
            "status": bag.status,
            "vendor_id": vendor.id,
            "vendor_name": vendor.name,
            "vendor_location": vendor.location
        })
    return response
