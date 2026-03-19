# Entry point
from fastapi import FastAPI
import bags_filtering
import add_bag_request

# App initialisation
app = FastAPI()

app.include_router(bags_filtering.router)
app.include_router(add_bag_request.router) 
