from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from db_connection import get_db
from models import Bag, DietaryTag, BagDietaryTag, Vendor, BagItem, Food

router = APIRouter()

@router.get("/bags")
def get_bags(tag: str = None, dietary_tag: str = None, vendor_id: int = None, search: str = None, db: Session = Depends(get_db)):
    query = db.query(Bag, Vendor).join(Vendor, Vendor.id == Bag.vendor_id)

    if tag:
        dietary_tag = db.query(DietaryTag).filter(DietaryTag.name == tag).first()
        if not dietary_tag:
            return []
        query = query.join(BagDietaryTag, BagDietaryTag.bag_id == Bag.id).filter(
            BagDietaryTag.dietary_tag_id == dietary_tag.id
        )

    if dietary_tag:
        tag_obj = db.query(DietaryTag).filter(DietaryTag.name == dietary_tag).first()
        if not tag_obj:
            return []

        query = query.join(BagDietaryTag, BagDietaryTag.bag_id == Bag.id).filter(
            BagDietaryTag.dietary_tag_id == tag_obj.id
        )

    if vendor_id:
        query = query.filter(Bag.vendor_id == vendor_id)


    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Bag.product_name.ilike(search_term),
                Bag.description.ilike(search_term),
                Bag.category.ilike(search_term),
                Vendor.name.ilike(search_term)
            )
        )


    query = query.filter(Bag.status == "available", Bag.quantity > 0).distinct()
    

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


@router.get("/bags/{bag_id}")
def get_single_bag(bag_id: int, db: Session = Depends(get_db)):
    result = db.query(Bag, Vendor)\
        .join(Vendor, Vendor.id == Bag.vendor_id)\
        .filter(Bag.id == bag_id)\
        .first()

    if not result:
        return {"detail": "Not Found"}

    bag, vendor = result

    return {
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
    }
