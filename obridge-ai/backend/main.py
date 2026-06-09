from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from stock import get_stock_data
from ai import analyze_stock

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "obridge_secure_123"


class StockRequest(BaseModel):
    symbol: str


@app.get("/")
def home():
    return {"message": "Obridge AI Backend Running"}


@app.post("/api/v1/predict")
def predict(req: StockRequest, x_api_key: str = Header(None)):

    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    stock_data = get_stock_data(req.symbol)

    analysis = analyze_stock(stock_data)

    return {
        "symbol": req.symbol,
        "stock_data": stock_data,
        "analysis": analysis,
    }