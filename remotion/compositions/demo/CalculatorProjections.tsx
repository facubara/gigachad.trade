import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { TypewriterText } from "../../components/TypewriterText";
import { AnimatedNumber } from "../../components/AnimatedNumber";
import { formatCurrency } from "../../utils/formatters";

/**
 * Demo 3: CalculatorProjections
 * Wallet input → holdings → target → projection reveal
 * Duration: 12 seconds (360 frames at 30fps)
 */
export function CalculatorProjections() {
  const frame = useCurrentFrame();

  // Animation phases
  const phase1End = 90; // Wallet input
  const phase2End = 180; // Holdings display
  const phase3End = 270; // Target selection
  // Phase 4: Projection reveal

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        padding: 80,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 60 }}>
        <p
          style={{
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.dim,
            marginBottom: 8,
          }}
        >
          Gains Calculator
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          Calculate Your Potential
        </p>
      </div>

      {/* Step 1: Wallet Input */}
      <Sequence from={0} durationInFrames={phase2End}>
        <div
          style={{
            marginBottom: 40,
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 12,
            }}
          >
            Step 1: Enter Wallet
          </p>
          <div
            style={{
              backgroundColor: colors.steel,
              border: `1px solid ${colors.border}`,
              padding: "16px 20px",
              width: 600,
            }}
          >
            <TypewriterText
              text="7xKX...b9Pq"
              startFrame={30}
              charsPerFrame={0.5}
              style={{
                fontSize: 18,
                color: colors.white,
                fontFamily: fonts.mono,
              }}
            />
          </div>
        </div>
      </Sequence>

      {/* Step 2: Holdings Display */}
      <Sequence from={phase1End} durationInFrames={phase3End - phase1End + 90}>
        <div
          style={{
            marginBottom: 40,
            opacity: interpolate(frame, [phase1End, phase1End + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 12,
            }}
          >
            Step 2: Your Holdings
          </p>
          <div
            style={{
              display: "flex",
              gap: 40,
            }}
          >
            <div>
              <p style={{ fontSize: 12, color: colors.dim, marginBottom: 4 }}>Balance</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: colors.white }}>
                <AnimatedNumber
                  from={0}
                  to={50_000_000}
                  startFrame={phase1End + 30}
                  durationFrames={45}
                  format="compact"
                />
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: colors.dim, marginBottom: 4 }}>Current Value</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: colors.white }}>
                <AnimatedNumber
                  from={0}
                  to={1500}
                  startFrame={phase1End + 30}
                  durationFrames={45}
                  format="currency"
                />
              </p>
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 3: Target Selection */}
      <Sequence from={phase2End} durationInFrames={360 - phase2End}>
        <div
          style={{
            marginBottom: 40,
            opacity: interpolate(frame, [phase2End, phase2End + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 12,
            }}
          >
            Step 3: Set Target
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {["$100M", "$500M", "$1B"].map((target, i) => {
              const isSelected = target === "$1B";
              const selectFrame = phase2End + 60;
              const isHighlighted =
                isSelected && frame >= selectFrame;

              return (
                <div
                  key={target}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isHighlighted ? colors.white : colors.steel,
                    border: `1px solid ${isHighlighted ? colors.white : colors.border}`,
                    color: isHighlighted ? colors.black : colors.white,
                    fontSize: 16,
                    fontWeight: 600,
                    transform: isHighlighted ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.2s",
                  }}
                >
                  {target}
                </div>
              );
            })}
          </div>
        </div>
      </Sequence>

      {/* Projection Result */}
      <Sequence from={phase3End}>
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            opacity: interpolate(frame, [phase3End, phase3End + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(
              frame,
              [phase3End, phase3End + 30],
              [0.8, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) }
            )})`,
          }}
        >
          <p
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: colors.white,
              lineHeight: 0.9,
            }}
          >
            x<AnimatedNumber
              from={1}
              to={33}
              startFrame={phase3End}
              durationFrames={60}
              format="multiplier"
            />
          </p>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: colors.muted,
              marginTop: 20,
            }}
          >
            From Your Entry
          </p>
          <p
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: colors.positive,
              marginTop: 30,
            }}
          >
            <AnimatedNumber
              from={1500}
              to={49500}
              startFrame={phase3End + 30}
              durationFrames={45}
              format="currency"
            />
          </p>
          <p
            style={{
              fontSize: 10,
              color: colors.dim,
              marginTop: 8,
            }}
          >
            Value at $1B Market Cap
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}
