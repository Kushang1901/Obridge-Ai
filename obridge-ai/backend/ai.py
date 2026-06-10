def analyze_stock(stock_data):

    price = float(stock_data.get("current_price", 0))
    high = float(stock_data.get("day_high", 0))
    low = float(stock_data.get("day_low", 0))

    if price > (low + high) / 2:
        signal = "BUY"
        reason = "Stock is showing bullish momentum."
    else:
        signal = "HOLD"
        reason = "Stock is currently weak or sideways."

    return {
        "signal": signal,
        "reason": reason,
        "current_price": price,
    }