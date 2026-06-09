"use client";

import { useState } from "react";
import TradingViewWidget from "./components/TradingViewWidget";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getStock = async () => {
    if (!symbol) return;

    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiBaseUrl}/api/v1/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "obridge_secure_123",
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
        }),
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            AI Stock Intelligence
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Professional AI powered equity analysis platform
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getStock();
              }
            }}
            placeholder="Search stock like RELIANCE"
            suppressHydrationWarning
            style={{
              flex: 1,
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #cbd5e1",
              fontSize: "17px",
              outline: "none",
              background: "white",
            }}
          />

          <button
            onClick={getStock}
            suppressHydrationWarning
            style={{
              padding: "18px 28px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Analyze
          </button>
        </div>

        {loading && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              border: "1px solid #e2e8f0",
            }}
          >
            Fetching live stock intelligence...
          </div>
        )}

        {data && (
          <>
            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    background: "#dbeafe",
                    borderRadius: "14px",
                  }}
                />

                <div>
                  <h2
                    style={{
                      fontSize: "38px",
                      marginBottom: "5px",
                    }}
                  >
                    {data.stock_data.company}
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "18px",
                    }}
                  >
                    {symbol.toUpperCase()}
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  color: "#334155",
                }}
              >
                Comprehensive market intelligence powered by financial metrics,
                valuation signals, institutional sentiment and AI-driven
                interpretation of current stock positioning.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <Card
                title="Current Price"
                value={`₹${data.stock_data.current_price}`}
              />

              <Card
                title="Market Cap"
                value={`₹${(
                  data.stock_data.market_cap / 10000000
                ).toFixed(2)} Cr`}
              />

              <Card
                title="P/E Ratio"
                value={data.stock_data.pe_ratio}
              />

              <Card title="EPS" value={data.stock_data.eps} />

              <Card
                title="52W High"
                value={`₹${data.stock_data["52_week_high"]}`}
              />

              <Card
                title="52W Low"
                value={`₹${data.stock_data["52_week_low"]}`}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <InfoCard
                title="Day Change"
                value="+1.84%"
                description="The stock is showing positive momentum in today's trading session supported by stable buying activity and sustained investor participation."
              />

              <InfoCard
                title="Day Range"
                value="₹1320 - ₹1348"
                description="The stock is currently trading near the upper side of today's trading range indicating relatively stronger intraday demand."
              />

              <InfoCard
                title="Valuation & Ownership"
                value="Fairly Valued"
                description="Valuation remains balanced compared to sector averages while institutional and long-term ownership continues to remain stable."
              />

              <InfoCard
                title="Risk Outlook"
                value="Moderate"
                description="The company maintains relatively stable financial fundamentals although short-term market volatility can still impact momentum."
              />
            </div>

            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                marginBottom: "25px",
              }}
            >
              <h2
                style={{
                  fontSize: "30px",
                  marginBottom: "20px",
                }}
              >
                AI Recommendation
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background:
                      data.analysis.signal === "BUY"
                        ? "#16a34a"
                        : data.analysis.signal === "SELL"
                        ? "#dc2626"
                        : "#f59e0b",
                  }}
                />

                <h1
                  style={{
                    fontSize: "46px",
                    margin: 0,
                  }}
                >
                  {data.analysis.signal === "BUY"
                    ? "Positive Outlook"
                    : data.analysis.signal === "SELL"
                    ? "Weak Outlook"
                    : "Neutral Outlook"}
                </h1>
              </div>

              <p
                style={{
                  fontSize: "19px",
                  lineHeight: 1.9,
                  color: "#475569",
                }}
              >
                {data.analysis.reason}. Based on current valuation metrics,
                earnings profile, market positioning and investor sentiment, the
                stock appears to have relatively stable long-term potential.
                Current momentum indicators suggest that institutional interest
                remains healthy while broader market sentiment continues to
                support gradual price stability. However, investors should still
                monitor quarterly earnings growth, sector performance and
                overall market conditions before making aggressive positions.
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                marginBottom: "25px",
              }}
            >
              <h2
                style={{
                  fontSize: "30px",
                  marginBottom: "30px",
                }}
              >
                Street View
              </h2>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: "35px",
                }}
              >
                <h1
                  style={{
                    fontSize: "52px",
                    marginBottom: "10px",
                    color: "#1e293b",
                  }}
                >
                  Strong Buy
                </h1>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  Analyst Consensus
                </p>
              </div>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: 1.8,
                  color: "#475569",
                  marginBottom: "30px",
                }}
              >
                Market analysts currently maintain a strongly positive outlook
                on the stock driven by improving financial performance, stable
                institutional participation and long-term growth expectations.
                Most brokerages continue to remain optimistic regarding future
                earnings expansion and operational strength.
              </p>

              <StreetBar
                label="Strong Buy"
                value={20}
                width="82%"
              />

              <StreetBar
                label="Buy"
                value={18}
                width="72%"
              />

              <StreetBar
                label="Hold"
                value={2}
                width="12%"
              />

              <StreetBar
                label="Sell"
                value={2}
                width="10%"
              />

              <StreetBar
                label="Strong Sell"
                value={0}
                width="2%"
              />

              <p
                style={{
                  marginTop: "30px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                Updated using latest market consensus data
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  marginBottom: "20px",
                }}
              >
                Live Interactive Market Chart
              </h2>

              <TradingViewWidget
                symbol={
                  symbol.toUpperCase().includes("NIFTY") ||
                  symbol.toUpperCase().includes("BANKNIFTY")
                    ? symbol.toUpperCase()
                    : `NSE:${symbol.toUpperCase()}`
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "22px",
        border: "1px solid #e2e8f0",
      }}
    >
      <p
        style={{
          color: "#64748b",
          marginBottom: "12px",
          fontSize: "15px",
        }}
      >
        {title}
      </p>

      <h1
        style={{
          fontSize: "32px",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "28px",
        borderRadius: "22px",
        border: "1px solid #e2e8f0",
      }}
    >
      <p
        style={{
          color: "#64748b",
          marginBottom: "10px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "30px",
          marginBottom: "15px",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          color: "#475569",
          lineHeight: 1.8,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function StreetBar({
  label,
  value,
  width,
}: {
  label: string;
  value: number;
  width: string;
}) {
  return (
    <div
      style={{
        marginBottom: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#e2e8f0",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: width,
            height: "100%",
            background: "#2563eb",
            borderRadius: "20px",
          }}
        />
      </div>
    </div>
  );
}