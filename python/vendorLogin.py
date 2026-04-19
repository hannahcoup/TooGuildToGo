from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from db_connection import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
from models import Vendor


salt =  "5ab" # for password hashing

router = APIRouter()
"""
router.add_middleware( # CORS middleware is used in situations when a frontend running in a browser has JavaScript code that communicates with a backend with different 'orign'
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)
"""

class loginRequest(BaseModel):  #  this does automatic data conversions and validaton checks 
    email: str
    password: str

@router.post("/vendor/login")
def login(data: loginRequest, db: Session = Depends(get_db)):
    print("LOGIN ENDPOINT HIT")

    vendor = db.execute(
        text("SELECT id, name, password_hash FROM vendors WHERE email = :email"),
        {"email": data.email}
    ).fetchone()

    if vendor is None:
        return {"error": "incorrect email or password"}

    dataPassword = data.password + salt
    dataPasswordHash = hashlib.sha256(dataPassword.encode()).hexdigest()
    print("Entered password:", data.password)
    print("Hashed input:", dataPasswordHash)
    print("Stored hash:", vendor[2])

    # need to hash the password entered by the user to see if this hash matches the one stored in the database
    if vendor != None and dataPasswordHash == vendor[2]:
        return {"message": "login successful", "name": vendor[1], "id": vendor[0]}
        
    return {"error": "incorrect email or password"} 


'''
Hashing passwords, using SHA-256 one-way hashing algorithm (fast and secure)

password1 = "jacketPotato12!"
spudPass = password1 + salt
spudPassHashed = hashlib.sha256(spudPass.encode())
print(spudPassHashed.h)

password2 = "yummyTacos34!"

tacontentPass = password2 + salt
tacontentPassHashed = hashlib.sha256(tacontentPass.encode())

password3 = "coffeeAndTea123!"
unionBrewPass = password3 + salt
unionBrewPassHashed = hashlib.sha256(unionBrewPass.encode())

'''
