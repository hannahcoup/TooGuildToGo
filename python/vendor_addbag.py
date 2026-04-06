from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
from models import Bag, VendorFoodItem, BagItem, BagDietaryTag
from sqlalchemy import text

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
    dietary_tag_ids: list[int] = []

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
    #adds dietary tag 
    for tag_id in data.dietary_tag_ids:
        db.add(BagDietaryTag(bag_id=new_bag.id, dietary_tag_id=tag_id))

    db.commit()

    return {"message": "bag created successfully", "bag_id": new_bag.id, "product_name": new_bag.product_name}


#code for fetching food items per vendor for adding food items to a bag
@router.get("/vendor/food_items")
def get_vendor_food_items(vendor_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT f.food_id, f.name, f.category
            FROM food f
            JOIN vendor_food_items vfi ON vfi.food_id = f.food_id
            WHERE vfi.vendor_id = :vendor_id
            AND f.active = TRUE
            ORDER BY f.category, f.name
        """),
        {"vendor_id": vendor_id}
    ).fetchall()

    return [{"food_id": row[0], "name": row[1], "category": row[2]} for row in result]


#code for vendor updating bag


class EditBagRequest(BaseModel):
    product_name: str | None = None
    description: str | None = None
    category: str | None = None
    discounted_price: float | None = None
    pickup_window_start: str | None = None
    pickup_window_end: str | None = None
    quantity: int | None = None


@router.patch("/vendor/bags/{bag_id}")
def edit_bag(bag_id: int, data: EditBagRequest, db: Session = Depends(get_db)):
    db.execute(
        text("""
            UPDATE bags SET
                product_name = COALESCE(:product_name, product_name),
                description = COALESCE(:description, description),
                category = COALESCE(:category, category),
                discounted_price = COALESCE(:discounted_price, discounted_price),
                pickup_window_start = COALESCE(:pickup_window_start, pickup_window_start),
                pickup_window_end = COALESCE(:pickup_window_end, pickup_window_end),
                quantity = COALESCE(:quantity, quantity)
            WHERE id = :bag_id
        """),
        {
            "product_name": data.product_name,
            "description": data.description,
            "category": data.category,
            "discounted_price": data.discounted_price,
            "pickup_window_start": data.pickup_window_start,
            "pickup_window_end": data.pickup_window_end,
            "quantity": data.quantity,
            "bag_id": bag_id
        }
    )
    db.commit()
    return {"message": "Bag updated successfully"}