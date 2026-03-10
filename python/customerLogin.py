from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# apparently need these to connect to frontend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace * with your actual frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# fake data
students = {"student1@liverpool.ac.uk" : { "password" : "student123", "name" : "Lara"},
            "student2@liverpool.ac.uk" : {"password" : "student456", "name" : "Hannah"}
              }

@app.post("/login/student")
def customertLogin(data: dict):
    customer = students.get(data["email"])
    if customer == False or customer["password"] != data["password"]:
        return {"error" : "invalid email or password"}
    return {"message" : "login successful", "name" : customer["name"]}
