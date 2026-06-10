from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from stock import get_stock_data, resolve_symbol, get_tradingview_symbol
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

    try:
        resolved = resolve_symbol(req.symbol)
        stock_data = get_stock_data(resolved)
        tv_symbol = get_tradingview_symbol(resolved)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    analysis = analyze_stock(stock_data)

    return {
        "symbol": req.symbol,
        "resolved_symbol": resolved,
        "tradingview_symbol": tv_symbol,
        "stock_data": stock_data,
        "analysis": analysis,
    }