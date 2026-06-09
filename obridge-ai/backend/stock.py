import yfinance as yf
import requests

def get_stock_data_fallback(symbol: str):
    # Public Yahoo Chart API endpoint, which does not require cookies/crumbs and is rarely rate-limited
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol.upper()}.NS?range=1d&interval=1d"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        raise ValueError(f"Yahoo Finance Chart API returned status {res.status_code}")
        
    data = res.json()
    result = data.get("chart", {}).get("result", [])
    if not result:
        raise ValueError(f"No chart data found for symbol '{symbol}'")
        
    meta = result[0].get("meta", {})
    price = meta.get("regularMarketPrice", 0.0)
    prev_close = meta.get("chartPreviousClose", 0.0)
    day_change = ((price - prev_close) / prev_close * 100) if prev_close else 0.0

    return {
        "company": meta.get("longName", symbol.upper()),
        "current_price": price,
        "market_cap": 0.0,
        "pe_ratio": 0.0,
        "eps": 0.0,
        "revenue": 0.0,
        "profit_margin": 0.0,
        "52_week_high": meta.get("fiftyTwoWeekHigh", 0.0),
        "52_week_low": meta.get("fiftyTwoWeekLow", 0.0),

        "day_change": day_change,
        "day_high": meta.get("regularMarketDayHigh", 0.0),
        "day_low": meta.get("regularMarketDayLow", 0.0),
        "volume": meta.get("regularMarketVolume", 0),

        "book_value": 0.0,
        "price_to_book": 0.0,
        "return_on_equity": 0.0,

        "institution_percent": 0.0,
        "insider_percent": 0.0,

        "recommendation": "hold",
        "target_mean_price": 0.0,
        "target_high_price": 0.0,
        "target_low_price": 0.0,
        "number_of_analysts": 0,
    }

def get_stock_data(symbol: str):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    try:
        # Try full yfinance API first to get rich fundamental metrics (PE, EPS, etc.)
        stock = yf.Ticker(symbol.upper() + ".NS", session=session)
        info = stock.info
        
        if not info or not isinstance(info, dict):
            raise ValueError("Empty or invalid stock info dictionary")
            
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
    except Exception as e:
        print(f"yfinance failed: {e}. Attempting fallback chart endpoint...")
        try:
            return get_stock_data_fallback(symbol)
        except Exception as fallback_e:
            raise ValueError(f"Failed to fetch stock data (yfinance failed: {e}; fallback failed: {fallback_e})")