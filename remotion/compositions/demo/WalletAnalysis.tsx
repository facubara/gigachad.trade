import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { TypewriterText } from "../../components/TypewriterText";
import { AnimatedNumber } from "../../components/AnimatedNumber";

/**
 * Demo 5: WalletAnalysis
 * ASCII spinner → fetching pages → holdings reveal
 * Duration: 10 seconds (300 frames at 30fps)
 */

const spinnerChars = ["|", "/", "-", "\\"];

export function WalletAnalysis() {
  const frame = useCurrentFrame();

  // Phases
  const loadingEnd = 120;
  const fetchingEnd = 200;

  // Spinner animation
  const spinnerIndex = Math.floor(frame / 4) % spinnerChars.length;

  // Page counter during fetching
  const pageCount = interpolate(
    frame,
    [loadingEnd, fetchingEnd],
    [1, 47],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        padding: 80,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 50 }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.dim,
            marginBottom: 8,
          }}
        >
          Wallet Analysis
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          Analyzing Holdings
        </p>
      </div>

      {/* Wallet address */}
      <div
        style={{
          backgroundColor: colors.steel,
          border: `1px solid ${colors.border}`,
          padding: "16px 24px",
          marginBottom: 40,
        }}
      >
        <TypewriterText
          text="7xKXmNbP4vQZr8sWdY2fH3jL9cT6nR1qA5wKbEp4b9Pq"
          startFrame={0}
          charsPerFrame={1}
          style={{
            fontSize: 16,
            color: colors.white,
            fontFamily: fonts.mono,
          }}
        />
      </div>

      {/* Loading phase */}
      <Sequence from={40} durationInFrames={loadingEnd - 40}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: colors.muted,
            fontSize: 14,
          }}
        >
          <span style={{ width: 20, textAlign: "center" }}>
            {spinnerChars[spinnerIndex]}
          </span>
          <span>Connecting to Solana...</span>
        </div>
      </Sequence>

      {/* Fetching pages phase */}
      <Sequence from={loadingEnd} durationInFrames={fetchingEnd - loadingEnd}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: colors.muted,
            fontSize: 14,
          }}
        >
          <span style={{ width: 20, textAlign: "center" }}>
            {spinnerChars[spinnerIndex]}
          </span>
          <span>
            Fetching transactions... page {Math.floor(pageCount)}/47
          </span>
        </div>
      </Sequence>

      {/* Results reveal */}
      <Sequence from={fetchingEnd}>
        <div
          style={{
            opacity: interpolate(frame, [fetchingEnd, fetchingEnd + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* Success message */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 40,
              color: colors.positive,
              fontSize: 14,
            }}
          >
            <span>✓</span>
            <span>Analysis complete</span>
          </div>

          {/* Holdings grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
              backgroundColor: colors.border,
            }}
          >
            <div style={{ backgroundColor: colors.bg, padding: 32 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: colors.dim,
                  marginBottom: 8,
                }}
              >
                Balance
              </p>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>
                <AnimatedNumber
                  from={0}
                  to={156_000_000}
                  startFrame={fetchingEnd + 15}
                  durationFrames={45}
                  format="compact"
                />
              </p>
              <p style={{ fontSize: 12, color: colors.dim, marginTop: 4 }}>GIGA tokens</p>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: 32 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: colors.dim,
                  marginBottom: 8,
                }}
              >
                Current Value
              </p>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>
                <AnimatedNumber
                  from={0}
                  to={4680}
                  startFrame={fetchingEnd + 15}
                  durationFrames={45}
                  format="currency"
                />
              </p>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: 32 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: colors.dim,
                  marginBottom: 8,
                }}
              >
                Entry Price
              </p>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>
                $0.000018
              </p>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: 32 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: colors.dim,
                  marginBottom: 8,
                }}
              >
                Unrealized Gain
              </p>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.positive }}>
                +<AnimatedNumber
                  from={0}
                  to={67}
                  startFrame={fetchingEnd + 30}
                  durationFrames={45}
                  format="raw"
                  suffix="%"
                />
              </p>
            </div>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}
