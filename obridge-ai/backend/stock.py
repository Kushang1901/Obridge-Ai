import yfinance as yf
import requests

def get_stock_data(symbol: str):
    # Use custom requests session with User-Agent to prevent cloud hosting IPs from being blocked by Yahoo Finance
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    try:
        stock = yf.Ticker(symbol.upper() + ".NS", session=session)
        info = stock.info
    except Exception as e:
        raise ValueError(f"Error connecting to Yahoo Finance API: {e}")

    if not info or not isinstance(info, dict):
        raise ValueError(f"Could not retrieve stock info for '{symbol}'. Ticker might be invalid or rate-limited.")

    # Helper function to safely get keys with fallback defaults
    def safe_get(key: str, default=0.0):
        val = info.get(key)
        return val if val is not None else default

    return {
        "company": safe_get("longName", symbol.upper()),
        "current_price": safe_get("currentPrice", safe_get("regularMarketPrice", 0.0)),
        "market_cap": safe_get("marketCap", 0),
        "pe_ratio": safe_get("trailingPE", 0.0),
        "eps": safe_get("trailingEps", 0.0),
        "revenue": safe_get("totalRevenue", 0),
        "profit_margin": safe_get("profitMargins", 0.0),
        "52_week_high": safe_get("fiftyTwoWeekHigh", 0.0),
        "52_week_low": safe_get("fiftyTwoWeekLow", 0.0),

        "day_change": safe_get("regularMarketChangePercent", 0.0),
        "day_high": safe_get("dayHigh", 0.0),
        "day_low": safe_get("dayLow", 0.0),
        "volume": safe_get("volume", 0),

        "book_value": safe_get("bookValue", 0.0),
        "price_to_book": safe_get("priceToBook", 0.0),
        "return_on_equity": safe_get("returnOnEquity", 0.0),

        "institution_percent": safe_get("heldPercentInstitutions", 0.0),
        "insider_percent": safe_get("heldPercentInsiders", 0.0),

        "recommendation": safe_get("recommendationKey", "hold"),
        "target_mean_price": safe_get("targetMeanPrice", 0.0),
        "target_high_price": safe_get("targetHighPrice", 0.0),
        "target_low_price": safe_get("targetLowPrice", 0.0),
        "number_of_analysts": safe_get("numberOfAnalystOpinions", 0),
    }