from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db_connection import get_db
import hashlib
from models import User

from sqlalchemy import text

router = APIRouter()
salt =  "5ab"

class EditUserRequest(BaseModel):
    name: str | None = None
    email:str | None=None
    password: str| None = None


@router.patch("/customers/{user_id}")
def edit_customer(user_id: int, data: EditUserRequest, db: Session = Depends(get_db)):

    password_hash = None
    if data.password:
        password_hash = hashlib.sha256((data.password + salt).encode()).hexdigest()

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







class DeleteAccountRequest(BaseModel):
    user_id: int
    password: str


@router.post("/customers/delete-account")
def delete_account(data: DeleteAccountRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()

    if not user:
        return {"error": "user not found"}

    if not data.password or not data.password.strip():
        return {"error": "password is required"}

    password_hash = hashlib.sha256((data.password + salt).encode()).hexdigest()

    if user.password_hash != password_hash:
        return {"error": "incorrect password"}

    db.delete(user)
    db.commit()

    return {"message": "account deleted successfully"}