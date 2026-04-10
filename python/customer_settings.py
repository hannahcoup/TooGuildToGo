from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
import hashlib

from sqlalchemy import text

router = APIRouter()

class EditUserRequest(BaseModel):
    name: str | None = None
    email:str | None=None
    password: str| None = None


@router.patch("/customers/{user_id}")
def edit_customer(user_id: int, data: EditUserRequest, db: Session = Depends(get_db)):

    password_hash = None
    if data.password:
        password_hash = hashlib.sha256(data.password.encode()).hexdigest()
    db.execute(
        text("""
            UPDATE users SET
                name = COALESCE(:name, name),
                email = COALESCE(:email, email),
                password_hash = COALESCE(:password_hash, password_hash)
            WHERE id = :user_id
        """),
        {
            "name": data.name,
            "email": data.email,
            "password_hash": password_hash,
            "user_id": user_id
        }
    )
    db.commit()
    return {"message": "Setting updated successfully"}
