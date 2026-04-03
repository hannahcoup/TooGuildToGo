from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
from models import Bag, CartItem, User

router = APIRouter()

class AddToCartRequest(BaseModel):
    user_id: int
    bag_id: int

@router.post("/customer/add-to-cart")
def add_to_cart(data: AddToCartRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        return {"error": "user not found"}

    bag = db.query(Bag).filter(Bag.id == data.bag_id).first()
    if not bag:
        return {"error": "bag not found"}

    if bag.quantity <= 0 or bag.status != "available":
        return {"error": "this bag is not available"}

    item = db.query(CartItem).filter(
        CartItem.user_id == data.user_id,
        CartItem.bag_id == data.bag_id
    ).first()

    if item:
        item.quantity += 1
    else:
        item = CartItem(user_id=data.user_id, bag_id=data.bag_id, quantity=1)
        db.add(item)

    db.commit()

    return {"message": "bag added to cart successfully", "bag_id": bag.id, "product_name": bag.product_name}

@router.get("/customer/cart/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(CartItem, Bag).join(Bag, Bag.id == CartItem.bag_id).filter(
        CartItem.user_id == user_id
    ).all()

    response = []
    for item, bag in items:
        response.append({
            "cart_item_id": item.id,
            "bag_id": bag.id,
            "product_name": bag.product_name,
            "discounted_price": float(bag.discounted_price),
            "quantity": item.quantity
        })

    return response
