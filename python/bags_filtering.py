# Filtering logic
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db_connection import get_db
from models import Bag, DietaryTag, BagDietaryTag, Vendor

router = APIRouter()

@router.get("/bags")
def get_bags(tag: str = None, db: Session = Depends(get_db)):

    # Step 1: get correct bags
    if not tag:
        bags = db.query(Bag).all()
    else:
        dietary_tag = db.query(DietaryTag).filter(DietaryTag.name == tag).first()

        if not dietary_tag:
            return []

        links = db.query(BagDietaryTag).filter(
            BagDietaryTag.dietary_tag_id == dietary_tag.id
        ).all()

        bag_ids = [link.bag_id for link in links]

        bags = db.query(Bag).filter(Bag.id.in_(bag_ids)).all()

    # Grouping bags by vendor
    vendor_map = {}

    for bag in bags:
        vendor = db.query(Vendor).filter(Vendor.id == bag.vendor_id).first()

        if vendor.id not in vendor_map:
            vendor_map[vendor.id] = {
                "vendor_name": vendor.name,
                "vendor_location": vendor.location,
                "bag_count": 0
            }

        vendor_map[vendor.id]["bag_count"] += 1

    return list(vendor_map.values())