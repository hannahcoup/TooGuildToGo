import re
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db_connection import get_db
from models import User
import hashlib
from datetime import datetime


salt =  "5ab" # for password hashing

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirmPassword: str

@router.post("/customer/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    dataPassword = data.password + salt
    dataPasswordHash = hashlib.sha256(dataPassword.encode()).hexdigest()
    if not user or user.password_hash != dataPasswordHash:
        return {"error": "incorrect email or password"}
    return {"message": "login successful", "user_id": user.id, "name": user.name, "user_email":user.email}

@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    pattern = r'^[A-Za-z0-9._%+-]+@liverpool\.ac\.uk$'
    if not re.match(pattern, data.email):
        return {"error": "email must be a @liverpool.ac.uk address"}
    if data.password != data.confirmPassword:
        return {"error": "passwords must match"}
    if len(data.password) < 8:
        return {"error": "password must be at least 8 characters"}
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        return {"error": "email already registered"}

    dataPassword = data.password + salt
    dataPasswordHash = hashlib.sha256(dataPassword.encode()).hexdigest()
    
    new_user = User(name=data.name, email=data.email, password_hash=dataPasswordHash, created_at=datetime.utcnow())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "signup successful", "user_id": new_user.id, "name": new_user.name}

