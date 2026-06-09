"use client";

import { useEffect } from "react";

export default function TradingViewWidget({
  symbol,
}: {
  symbol: string;
}) {
  useEffect(() => {
    const container = document.getElementById("tradingview_chart");

    if (!container) return;

    container.innerHTML = "";

    const cleanSymbol = symbol
      .replace("NSE:", "")
      .trim()
      .toUpperCase();

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: cleanSymbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      withdateranges: true,
      hide_side_toolbar: false,
      details: true,
      hotlist: false,
      calendar: false,
      studies: ["MACD@tv-basicstudies"],
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(script);
  }, [symbol]);

  return (
    <div
      style={{
        marginTop: "25px",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >

      </h2>

      <div
        id="tradingview_chart"
        style={{
          width: "100%",
          height: "650px",
        }}
      />
    </div>
  );
}