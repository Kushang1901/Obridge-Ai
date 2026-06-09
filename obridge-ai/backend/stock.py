import yfinance as yf

def get_stock_data(symbol: str):
    stock = yf.Ticker(symbol + ".NS")

    info = stock.info

    return {
        "company": info.get("longName"),
        "current_price": info.get("currentPrice"),
        "market_cap": info.get("marketCap"),
        "pe_ratio": info.get("trailingPE"),
        "eps": info.get("trailingEps"),
        "revenue": info.get("totalRevenue"),
        "profit_margin": info.get("profitMargins"),
        "52_week_high": info.get("fiftyTwoWeekHigh"),
        "52_week_low": info.get("fiftyTwoWeekLow"),

        "day_change": info.get("regularMarketChangePercent"),
        "day_high": info.get("dayHigh"),
        "day_low": info.get("dayLow"),
        "volume": info.get("volume"),

        "book_value": info.get("bookValue"),
        "price_to_book": info.get("priceToBook"),
        "return_on_equity": info.get("returnOnEquity"),

        "institution_percent": info.get("heldPercentInstitutions"),
        "insider_percent": info.get("heldPercentInsiders"),

        "recommendation": info.get("recommendationKey"),
        "target_mean_price": info.get("targetMeanPrice"),
        "target_high_price": info.get("targetHighPrice"),
        "target_low_price": info.get("targetLowPrice"),
        "number_of_analysts": info.get("numberOfAnalystOpinions"),
    }