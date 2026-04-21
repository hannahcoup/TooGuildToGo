from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
from models import Bag, VendorFoodItem, BagItem, BagDietaryTag, Food, FoodAllergen, Allergen, DietaryTag
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
    food_ids: list[int] | None = None 
    dietary_tag_ids: list[int] | None = None


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
    if data.food_ids is not None:
        db.execute(text("DELETE FROM bag_items WHERE bag_id = :bag_id"), {"bag_id": bag_id})
        for food_id in data.food_ids:
            db.execute(
                text("INSERT INTO bag_items (bag_id, food_id) VALUES (:bag_id, :food_id)"),
                {"bag_id": bag_id, "food_id": food_id}
            )
    if data.dietary_tag_ids is not None:
        db.execute(
            text("DELETE FROM bag_dietary_tags WHERE bag_id = :bag_id"),
            {"bag_id": bag_id}
        )
        for tag_id in data.dietary_tag_ids:
            db.execute(
                text("INSERT INTO bag_dietary_tags (bag_id, dietary_tag_id) VALUES (:bag_id, :tag_id)"),
                {"bag_id": bag_id, "tag_id": tag_id}
            )
    db.commit()
    return {"message": "Bag updated successfully"}

#code for deleting bags - used in vendor dashboard
@router.delete("/vendor/bags/{bag_id}")
def delete_bag(bag_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("DELETE FROM bags WHERE id = :bag_id"),
        {"bag_id": bag_id}
    )
    db.commit()
    
    if result.rowcount == 0:
        return {"error": "Bag not found"}
    
    return {"message": "Bag deleted successfully"}



@router.get("/vendor/bags")
def get_vendor_bags(vendor_id: int, db: Session = Depends(get_db)):
    bags = db.query(Bag).filter(Bag.vendor_id == vendor_id).all()

    response = []

    for bag in bags:

        # FOOD ITEMS
        food_items = (
            db.query(Food)
            .join(BagItem, BagItem.food_id == Food.food_id)
            .filter(BagItem.bag_id == bag.id)
            .all()
        )

        # ALLERGENS
        allergens = (
            db.query(Allergen.name)
            .join(FoodAllergen, FoodAllergen.allergen_id == Allergen.allergen_id)
            .join(BagItem, BagItem.food_id == FoodAllergen.food_id)
            .filter(BagItem.bag_id == bag.id, FoodAllergen.contains == True)
            .distinct()
            .all()
        )
        allergen_list = [a[0] for a in allergens]

        # DIETARY TAGS
        dietary_tags = (
            db.query(DietaryTag.name)
            .join(BagDietaryTag, BagDietaryTag.dietary_tag_id == DietaryTag.id)
            .filter(BagDietaryTag.bag_id == bag.id)
            .all()
        )
        dietary_list = [d[0] for d in dietary_tags]

        response.append({
            "bag_id": bag.id,
            "product_name": bag.product_name,
            "description": bag.description,
            "category": bag.category,
            "discounted_price": float(bag.discounted_price),
            "pickup_window_start": str(bag.pickup_window_start),
            "pickup_window_end": str(bag.pickup_window_end),
            "quantity": bag.quantity,
            "status": bag.status,
            "food_items": [f.name for f in food_items],
            "allergens": allergen_list,
            "dietary_tags": dietary_list
        })

    return response




#returns allergens for dashboard and reservations
@router.get("/bags/{bag_id}/allergens")
def get_bag_allergens(bag_id: int, db: Session = Depends(get_db)):

    rows = (
        db.query(
            Allergen.name.label("allergen_name"),
            FoodAllergen.contains,
            FoodAllergen.may_contain
        )
        .select_from(BagItem)
        .join(FoodAllergen, FoodAllergen.food_id == BagItem.food_id)
        .join(Allergen, Allergen.allergen_id == FoodAllergen.allergen_id)
        .filter(BagItem.bag_id == bag_id)
        .all()
    )

    # Group by allergen name
    grouped = {}
    for row in rows:
        name = row.allergen_name
        if name not in grouped:
            grouped[name] = {"contains": False, "may_contain": False}

        # Priority: contains > may_contain
        if row.contains:
            grouped[name]["contains"] = True
        elif row.may_contain:
            grouped[name]["may_contain"] = True

    # Convert to list
    return [
        {
            "allergen_name": name,
            "contains": info["contains"],
            "may_contain": info["may_contain"]
        }
        for name, info in grouped.items()
    ]



@router.get("/bags/{bag_id}/food_items")
def get_bag_food_items(bag_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT f.food_id, f.name, f.category
            FROM food f
            JOIN bag_items bi ON bi.food_id = f.food_id
            WHERE bi.bag_id = :bag_id
            ORDER BY f.category, f.name
        """),
        {"bag_id": bag_id}
    ).fetchall()
    return [{"food_id": row[0], "name": row[1], "category": row[2]} for row in result]


@router.get("/bags/{bag_id}/dietary_tags")
def get_bag_dietary_tags(bag_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT dt.name
            FROM dietary_tags dt
            JOIN bag_dietary_tags bdt ON bdt.dietary_tag_id = dt.id
            WHERE bdt.bag_id = :bag_id
            ORDER BY dt.name
        """),
        {"bag_id": bag_id}
    ).fetchall()
    return [{"name": row[0]} for row in result]