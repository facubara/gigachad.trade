import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const jetBrainsMono = fetch(
  "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf"
).then((res) => res.arrayBuffer());

const jetBrainsMonoBold = fetch(
  "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6tjPQ.ttf"
).then((res) => res.arrayBuffer());

function formatMarketCapDisplay(mcapStr: string | null): string {
  if (!mcapStr) return "$1B";
  const mcap = parseFloat(mcapStr);
  if (isNaN(mcap)) return "$1B";
  if (mcap >= 1_000_000_000_000) {
    return `$${(mcap / 1_000_000_000_000).toFixed(mcap % 1_000_000_000_000 === 0 ? 0 : 1)}T`;
  }
  if (mcap >= 1_000_000_000) {
    return `$${(mcap / 1_000_000_000).toFixed(mcap % 1_000_000_000 === 0 ? 0 : 1)}B`;
  }
  if (mcap >= 1_000_000) {
    return `$${(mcap / 1_000_000).toFixed(mcap % 1_000_000 === 0 ? 0 : 0)}M`;
  }
  return `$${mcap.toLocaleString()}`;
}

const fontOptions = async () => ({
  fonts: [
    {
      name: "JetBrains Mono",
      data: await jetBrainsMono,
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: "JetBrains Mono",
      data: await jetBrainsMonoBold,
      style: "normal" as const,
      weight: 700 as const,
    },
  ],
});

export async function GET(request: NextRequest) {
  const fonts = await fontOptions();
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "general";
  const multiplier = searchParams.get("multiplier");
  const targetValue = searchParams.get("targetValue");
  const targetMarketCap = searchParams.get("targetMarketCap");
  const holdings = searchParams.get("holdings");
  const address = searchParams.get("address");
  const currentMultiplier = searchParams.get("currentMultiplier");
  const progress = searchParams.get("progress");
  const mcapDisplay = formatMarketCapDisplay(targetMarketCap);

  // General stats share (from home page)
  if (type === "general") {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#666",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              Multiplier to {mcapDisplay}
            </div>

            <div
              style={{
                fontSize: "140px",
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: "-0.02em",
                marginTop: "24px",
                display: "flex",
              }}
            >
              x{multiplier || "33"}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "28px",
                color: "#888",
                marginTop: "24px",
              }}
            >
              {progress ? `${progress}% to ${mcapDisplay} Market Cap` : ""}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
              color: "#666",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold", display: "flex" }}>$GIGA</span>
            <span style={{ marginLeft: "24px", marginRight: "24px", display: "flex" }}>•</span>
            <span style={{ color: "#fff", display: "flex" }}>gigachad.trade</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        ...fonts,
      }
    );
  }

  // Holdings share (from calculator holdings section)
  if (type === "holdings") {
    const currentValue = searchParams.get("currentValue");
    const avgEntry = searchParams.get("avgEntry");
    const buyCount = searchParams.get("buyCount");
    const priceChange = searchParams.get("priceChange");
    const priceChangeNum = priceChange ? parseFloat(priceChange) : null;
    const isPositive = priceChangeNum !== null && priceChangeNum >= 0;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "#666",
                letterSpacing: "0.1em",
                fontFamily: "'JetBrains Mono', monospace",
                display: "flex",
              }}
            >
              {address || ""}
            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#666",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginTop: "16px",
                display: "flex",
              }}
            >
              My GIGA Holdings
            </div>

            <div
              style={{
                fontSize: "100px",
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: "-0.02em",
                marginTop: "20px",
                display: "flex",
              }}
            >
              {holdings || "0"} GIGA
            </div>

            {currentValue && (
              <div
                style={{
                  fontSize: "36px",
                  color: "#888",
                  marginTop: "12px",
                  display: "flex",
                }}
              >
                ${currentValue}
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                marginTop: "24px",
              }}
            >
              {priceChangeNum !== null && (
                <div
                  style={{
                    fontSize: "28px",
                    color: isPositive ? "#22c55e" : "#ef4444",
                    fontWeight: "bold",
                    display: "flex",
                  }}
                >
                  {isPositive ? "+" : ""}{priceChange}% from entry
                </div>
              )}
              {buyCount && (
                <div
                  style={{
                    fontSize: "24px",
                    color: "#666",
                    display: "flex",
                  }}
                >
                  {buyCount} buy txns
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
              color: "#666",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold", display: "flex" }}>$GIGA</span>
            <span style={{ marginLeft: "24px", marginRight: "24px", display: "flex" }}>•</span>
            <span style={{ color: "#fff", display: "flex" }}>gigachad.trade</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        ...fonts,
      }
    );
  }

  // Portfolio share (from calculator)
  if (type === "portfolio") {
    const entryMultiplier = searchParams.get("entryMultiplier");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "#666",
                letterSpacing: "0.1em",
                fontFamily: "'JetBrains Mono', monospace",
                display: "flex",
              }}
            >
              {address || ""}
            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#666",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginTop: "16px",
                display: "flex",
              }}
            >
              {targetValue ? `Projected Value at ${mcapDisplay}` : "My GIGA Holdings"}
            </div>

            <div
              style={{
                fontSize: targetValue ? "120px" : "100px",
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: "-0.02em",
                marginTop: "20px",
                display: "flex",
              }}
            >
              {targetValue ? `$${targetValue}` : `${holdings || "0"} GIGA`}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  color: "#22c55e",
                  fontWeight: "bold",
                  display: "flex",
                }}
              >
                {entryMultiplier ? `x${entryMultiplier}` : ""}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#666",
                  marginLeft: "16px",
                  display: "flex",
                }}
              >
                {entryMultiplier ? "from entry" : ""}
              </div>
            </div>

            <div
              style={{
                fontSize: "24px",
                color: "#888",
                marginTop: "12px",
                display: "flex",
              }}
            >
              {currentMultiplier ? `${currentMultiplier}x until ${mcapDisplay} target` : ""}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
              color: "#666",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold", display: "flex" }}>$GIGA</span>
            <span style={{ marginLeft: "24px", marginRight: "24px", display: "flex" }}>•</span>
            <span style={{ color: "#fff", display: "flex" }}>gigachad.trade</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        ...fonts,
      }
    );
  }

  // Default fallback
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            color: "#fff",
            display: "flex",
          }}
        >
          GIGACHAD
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#fff",
            marginTop: "16px",
            display: "flex",
          }}
        >
          $GIGA • gigachad.trade
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
