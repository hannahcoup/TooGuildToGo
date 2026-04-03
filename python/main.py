from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import bags_filtering
import vendor_addbag
import customer_cart
import customerLogin
import vendorLogin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bags_filtering.router)
app.include_router(vendor_addbag.router)
app.include_router(customer_cart.router)
app.include_router(customerLogin.router)
app.include_router(vendorLogin.router)

@app.get("/")
def root():
    return {"message": "Too Guild To Go backend is running"}
