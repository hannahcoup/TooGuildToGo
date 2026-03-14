from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
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

class loginRequest(BaseModel):  #  this does automatic data conversions and validaton checks 
    email: str
    password: str

@app.post("/login")
def login(data: loginRequest):
    for vendor in vendors:
        if vendor["email"] == data.email and vendor["password"] == data.password:
            return "login successful"
        
    return "incorrect email or password"

