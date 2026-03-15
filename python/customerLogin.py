from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
# needs middleware, and needs a vAuth file for the customer login.html 
# test students

students = [
    {"email" : "student1@liverpool.ac.uk", "password": "helloworld", "name": "Lara"},
    {"email" : "student2@liverpool.ac.uk", "password": "student2026", "name": "Hannah"},
]

class loginRequest(BaseModel):  #  this does automatic data conversions and validaton checks 
    email: str
    password: str

@app.post("/login")
def login(data: loginRequest):
    for student in students:
        if student["email"] == data.email and student["password"] == data.password:
            return "login successful"
        
    return "incorrect email or password"

# code for customer sign up
import re

class signupRequest(BaseModel):
    email: str
    password: str
    confirmPassword: str

@app.post("/signup")
def signup(data: signupRequest):

    pattern = r'[A-Za-z0-9]+@liverpool\.ac\.uk'  # geeks for geeks email pattern matching in python
    if re.match(pattern,data.email):
        if data.password == data.confirmPassword:
            if len(data.password) >= 8:
                return {"message": "signup successful"} # need to redirect to login
            else:
                return {"error": "password must be at least 8 characters"}
        else:
            return {"error": "passwords must match"}
    else:
        return {"error": "email must be a @liverpool.ac.uk addresss"}

       