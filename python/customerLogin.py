from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# test students

students = [
    {"email" : "student1@liverpool.ac.uk", "password": "helloworld", "name": "Lara"}
    {"email" : "student2@liverpool.ac.uk", "password": "student2026", "name": "Hannah"}
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

