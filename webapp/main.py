from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static") 
templates = Jinja2Templates(directory="templates")

model = joblib.load("../model.joblib")
mlb = joblib.load("../mlb.joblib")

class MovieInput(BaseModel):
    budget: float
    runtime: float
    release_month: int
    release_year: int
    is_english: int
    genres: list[str]

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "genres": mlb.classes_.tolist()
    })

@app.post("/predict")
async def predict(data: MovieInput):
    log_budget = np.log1p(data.budget)
    month_sin = np.sin(2 * np.pi * data.release_month / 12)
    month_cos = np.cos(2 * np.pi * data.release_month / 12)
    genres_encoded = mlb.transform([data.genres])[0]
    
    features = np.array([
    log_budget, data.runtime, data.release_year,
    month_sin, month_cos, data.is_english,
    *genres_encoded
    ]).reshape(1, -1)
    
    log_revenue = model.predict(features)[0]
    revenue = np.expm1(log_revenue)
    
    return {"revenue": round(revenue, 2)}


    