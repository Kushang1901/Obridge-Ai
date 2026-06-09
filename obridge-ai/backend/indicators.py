def compute_indicators(data):
    pe = data.get("pe_ratio")
    industry_pe = data.get("industry_pe", 20)
    roe = data.get("roe")
    debt = data.get("debt_equity")

    pe_status = "Neutral"

    if pe and pe > industry_pe:
        pe_status = "Overvalued vs industry"
    elif pe and pe < industry_pe:
        pe_status = "Undervalued vs industry"

    return {
        "pe_ratio": pe,
        "industry_pe": industry_pe,
        "pe_analysis": pe_status,
        "roe_analysis": "Strong" if roe and roe > 15 else "Weak",
        "debt_analysis": "Safe" if debt and debt < 0.5 else "Risky"
    }