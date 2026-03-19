from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
from models import Bag, CartItem

router=APIRouter()

class AddBagRequest(BaseModel):
    student_email: str
    bag_id: int 

@router.post("/add_to_bag")
def add_to_bag(data: AddBagRequest, db: Session = Depends(get_db) ):

    #find the correct bag
    bag = db.query(Bag).filter(Bag.id == data.bag_id).first()

    if not bag:
        return {"Error": "Bag not found"}
    
    if bag.quantity <= 0:
        return {"Error": "This bag is sold out"}
    
    #Check if student already has the bag in their cart
    item = db.query(CartItem).filter(
        CartItem.student_email == data.student_email,
        CartItem.bag_id == data.bag_id
    ).first()

    if item:
        item.quantity += 1
    else:
        new_item = CartItem(
            student_email = data.student_email,
            bag_id = data.bag_id,
            quantity = 1
        )
        db.add(new_item)

    db.commit()
    
    return {"message": "Bag added Successfuly!",
             "bag_description": bag.description
             }


