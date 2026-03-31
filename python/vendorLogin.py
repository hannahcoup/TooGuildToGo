from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import hashlib

salt =  "5ab" # for password hashing

app = FastAPI()

app.add_middleware( # CORS middleware is used in situations when a frontend running in a browser has JavaScript code that communicates with a backend with different 'orign'
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def getDatabase(): # connecting to database
    dataBase = mysql.connector.connect (
        host = "localhost",
        user = "user",
        password = "password",
        database = "vendors",
    )
    return dataBase

class loginRequest(BaseModel):  #  this does automatic data conversions and validaton checks 
    email: str
    password: str

@app.post("/login")
def login(data: loginRequest):

    database = getDatabase()
    cursorObject = database.cursor()

    cursorObject.execute("SELECT id, name, password_hash FROM vendors WHERE email = %s", (data.email,)) # %s is a placeholder to prevent SQL injection, comma is needed after (data.email,) so it is treated as a tuple
    #changed to select vendor id aswell
    vendor = cursorObject.fetchone() # returns None if no data is found

    dataPassword = data.password + salt
    dataPasswordHash = hashlib.sha256(dataPassword.encode()) 

    # need to hash the password entered by the user to see if this hash matches the one stored in the database
    if vendor != None and dataPasswordHash == vendor["password_hash"]:
        return {"message": "login successful", "name": vendor["name"], "id": vendor[0]}
        
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