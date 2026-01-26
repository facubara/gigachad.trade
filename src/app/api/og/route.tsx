import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "general";
  const multiplier = searchParams.get("multiplier");
  const targetValue = searchParams.get("targetValue");
  const holdings = searchParams.get("holdings");
  const address = searchParams.get("address");
  const currentMultiplier = searchParams.get("currentMultiplier");
  const progress = searchParams.get("progress");

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
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Background gradient accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #a855f7, #6366f1)",
              display: "flex",
            }}
          />

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
              Multiplier to $1B
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
              {progress ? `${progress}% to $1B Market Cap` : ""}
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
            <span style={{ color: "#a855f7", fontWeight: "bold", display: "flex" }}>$GIGA</span>
            <span style={{ marginLeft: "24px", marginRight: "24px", display: "flex" }}>•</span>
            <span style={{ display: "flex" }}>gigachad.trade</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
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
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Background gradient accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #a855f7, #6366f1)",
              display: "flex",
            }}
          />

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
                fontFamily: "monospace",
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
              {targetValue ? "Projected Value at $1B" : "My GIGA Holdings"}
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
              {currentMultiplier ? `${currentMultiplier}x until $1B target` : ""}
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
            <span style={{ color: "#a855f7", fontWeight: "bold", display: "flex" }}>$GIGA</span>
            <span style={{ marginLeft: "24px", marginRight: "24px", display: "flex" }}>•</span>
            <span style={{ display: "flex" }}>gigachad.trade</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
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
          fontFamily: "system-ui, sans-serif",
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
            color: "#a855f7",
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
