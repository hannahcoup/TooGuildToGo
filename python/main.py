# Entry point
from fastapi import FastAPI
import bags_filtering

# App initialisation
app = FastAPI()

app.include_router(bags_filtering.router)