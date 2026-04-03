from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
from models import Bag, VendorFoodItem, BagItem

router = APIRouter()

class AddBagRequest(BaseModel):
    vendor_id: int
    product_name: str
    description: str | None = None
    category: str
    original_price: float
    discounted_price: float
    quantity: int
    pickup_window_start: str
    pickup_window_end: str
    expires_at: str
    status: str = "available"
    food_ids: list[int]

@router.post("/vendor/add-bag")
def add_bag(data: AddBagRequest, db: Session = Depends(get_db)):
    for food_id in data.food_ids:
        allowed = db.query(VendorFoodItem).filter(
            VendorFoodItem.vendor_id == data.vendor_id,
            VendorFoodItem.food_id == food_id
        ).first()
        if not allowed:
            return {"error": f"food_id {food_id} is not allowed for this vendor"}

    new_bag = Bag(
        vendor_id=data.vendor_id,
        product_name=data.product_name,
        description=data.description,
        category=data.category,
        original_price=data.original_price,
        discounted_price=data.discounted_price,
        quantity=data.quantity,
        pickup_window_start=data.pickup_window_start,
        pickup_window_end=data.pickup_window_end,
        expires_at=data.expires_at,
        status=data.status
    )
    db.add(new_bag)
    db.commit()
    db.refresh(new_bag)

    for food_id in data.food_ids:
        db.add(BagItem(bag_id=new_bag.id, food_id=food_id))
    db.commit()

    return {"message": "bag created successfully", "bag_id": new_bag.id, "product_name": new_bag.product_name}
