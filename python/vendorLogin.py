from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mySQL.connector

app = FastAPI()

app.add_middleware( # CORS middleware is used in situations when a frontend running in a browser has JavaScript code that communicates with a backend with different 'orign'
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# test vendors

vendors = [
    {"email" : "spudgame@liverpool.ac.uk", "password": "helloworld", "name": "Spud Game"},
    {"email" : "unionbrew@liverpool.ac.uk", "password": "student2026", "name": "Union Brew"},
]

def getDatabase():
    dataBase = mySQL.connector.connect (
        host = "localhost",
        user = "user",
        password = "password"
    )


class loginRequest(BaseModel):  #  this does automatic data conversions and validaton checks 
    email: str
    password: str

@app.post("/login")
def login(data: loginRequest):

    database = getDatabase()
    cursorObject = database.cursor()

    cursorObject.execute("SELECT name, password_hash")# %s is a placeholder to prevent SQL injection, comma is needed after (data.email,) so it is treated as a tuple

    vendors = cursorObject.fetchall()

    for vendor in vendors:
        if vendor["email"] == data.email and vendor["password"] == data.password:
            return {"message": "login successful", "name": vendor["name"]} 
        
    return {"error": "incorrect email or password"} 


# hashing passwords 

import hashlib

password1 = "jacketPotatoes"
salt =  "5ab"
spudPass = password1 + salt
spudPassHashed = password1.sha256(spudPass.encode())
print(spudPassHashed)
