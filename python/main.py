from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import bags_filtering
import vendor_addbag
import customer_reservations
import customerLogin
import vendorLogin
import vendor_reservations
import vendor_settings
import customer_settings
import favourites
import customerAnalytics
import vendorAnalyticsBackend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://hannahcoup.github.io",
        "https://tooguildtogo-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bags_filtering.router)
app.include_router(vendor_addbag.router)
app.include_router(customer_reservations.router)
app.include_router(customerLogin.router)
app.include_router(vendorLogin.router)
app.include_router(vendor_reservations.router)
app.include_router(vendor_settings.router)
app.include_router(customer_settings.router)
app.include_router(favourites.router)
app.include_router(customerAnalytics.router)
app.include_router(vendorAnalyticsBackend.router)

@app.get("/")
def root():
    return {"message": "Too Guild To Go backend is running"}
    return {"message": "Too Guild To Go backend is running"}
