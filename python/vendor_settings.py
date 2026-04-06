from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db

from sqlalchemy import text

router = APIRouter()

class EditVendorRequest(BaseModel):
    name: str | None = None
    email:str | None=None
    password: str| None = None


@router.patch("/vendors/{vendor_id}")
def edit_bag(vendor_id: int, data: EditVendorRequest, db: Session = Depends(get_db)):
    db.execute(
        text("""
            UPDATE vendors SET
                name = COALESCE(:name, name),
                email = COALESCE(:email, email)
                
            WHERE id = :vendor_id
        """),
        {
            "name": data.name,
            "email": data.email,
            "vendor_id": vendor_id
        }
    )
    db.commit()
    return {"message": "Setting updated successfully"}
