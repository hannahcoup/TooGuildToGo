# Entry point
from fastapi import FastAPI
import bags_filtering

# App initialisation
app = FastAPI()

app.include_router(bags_filtering.router)

import add_bag_request
app = FASTAPI() 

app.include_router(add_bag_request.router) 
