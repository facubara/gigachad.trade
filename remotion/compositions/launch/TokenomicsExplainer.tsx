import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { AnimatedNumber } from "../../components/AnimatedNumber";
import { GlowText } from "../../components/GlowText";

/**
 * Launch 10: TokenomicsExplainer
 * Supply, price, market cap formula, multiplier math
 * Duration: 30 seconds (900 frames at 30fps)
 * Format: 16:9
 */

export function TokenomicsExplainer() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Intro (0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 16,
                color: colors.dim,
                letterSpacing: "0.3em",
                marginBottom: 20,
                opacity: interpolate(frame, [0, 30], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              UNDERSTAND THE MATH
            </p>
            <GlowText
              intensity={25}
              style={{
                fontSize: 72,
                fontWeight: 700,
                display: "block",
                transform: `scale(${interpolate(frame, [20, 60], [0.5, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(2)),
                })})`,
              }}
            >
              TOKENOMICS
            </GlowText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Supply (90-240) */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill style={{ padding: 80 }}>
          <p
            style={{
              fontSize: 14,
              color: colors.purple,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 20,
              opacity: interpolate(frame, [90, 120], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Total Supply
          </p>

          <p
            style={{
              fontSize: 100,
              fontWeight: 700,
              color: colors.white,
              opacity: interpolate(frame, [120, 150], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            9.6B
          </p>
          <p style={{ fontSize: 20, color: colors.dim, marginTop: 10 }}>
            GIGACHAD tokens
          </p>

          <p
            style={{
              fontSize: 16,
              color: colors.muted,
              marginTop: 40,
              maxWidth: 600,
              lineHeight: 1.6,
              opacity: interpolate(frame, [170, 200], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Fixed supply. No inflation. No minting. What you see is what exists.
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* Market Cap Formula (240-450) */}
      <Sequence from={240} durationInFrames={210}>
        <AbsoluteFill style={{ padding: 80 }}>
          <p
            style={{
              fontSize: 14,
              color: colors.purple,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 40,
              opacity: interpolate(frame, [240, 270], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            The Formula
          </p>

          {/* Formula display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginBottom: 60,
              opacity: interpolate(frame, [280, 310], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>Market Cap</p>
            </div>
            <p style={{ fontSize: 48, color: colors.dim }}>=</p>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>Price</p>
            </div>
            <p style={{ fontSize: 48, color: colors.dim }}>×</p>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>Supply</p>
            </div>
          </div>

          {/* Example calculation */}
          <div
            style={{
              backgroundColor: colors.steel,
              border: `1px solid ${colors.border}`,
              padding: 40,
              opacity: interpolate(frame, [340, 370], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <p style={{ fontSize: 12, color: colors.dim, marginBottom: 20, letterSpacing: "0.1em" }}>
              CURRENT EXAMPLE
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <p style={{ fontSize: 28, color: colors.white }}>$30M</p>
              <p style={{ fontSize: 28, color: colors.dim }}>=</p>
              <p style={{ fontSize: 28, color: colors.muted }}>$0.003125</p>
              <p style={{ fontSize: 28, color: colors.dim }}>×</p>
              <p style={{ fontSize: 28, color: colors.muted }}>9.6B</p>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Multiplier Math (450-720) */}
      <Sequence from={450} durationInFrames={270}>
        <AbsoluteFill style={{ padding: 80 }}>
          <p
            style={{
              fontSize: 14,
              color: colors.purple,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 40,
              opacity: interpolate(frame, [450, 480], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            The Multiplier
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              marginBottom: 60,
            }}
          >
            <div
              style={{
                opacity: interpolate(frame, [490, 520], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <p style={{ fontSize: 16, color: colors.dim, marginBottom: 8 }}>Current MC</p>
              <p style={{ fontSize: 48, fontWeight: 700, color: colors.white }}>$30M</p>
            </div>

            <p
              style={{
                fontSize: 48,
                color: colors.dim,
                opacity: interpolate(frame, [530, 550], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              →
            </p>

            <div
              style={{
                opacity: interpolate(frame, [550, 580], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <p style={{ fontSize: 16, color: colors.dim, marginBottom: 8 }}>Target MC</p>
              <p style={{ fontSize: 48, fontWeight: 700, color: colors.positive }}>$1B</p>
            </div>
          </div>

          {/* Calculation */}
          <div
            style={{
              backgroundColor: colors.steel,
              border: `1px solid ${colors.border}`,
              padding: 40,
              marginBottom: 40,
              opacity: interpolate(frame, [600, 630], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <p style={{ fontSize: 28, color: colors.white }}>Multiplier</p>
              <p style={{ fontSize: 28, color: colors.dim }}>=</p>
              <p style={{ fontSize: 28, color: colors.muted }}>$1B</p>
              <p style={{ fontSize: 28, color: colors.dim }}>÷</p>
              <p style={{ fontSize: 28, color: colors.muted }}>$30M</p>
              <p style={{ fontSize: 28, color: colors.dim }}>=</p>
              <GlowText
                intensity={20}
                style={{ fontSize: 48, fontWeight: 700 }}
              >
                x<AnimatedNumber from={1} to={33} startFrame={650} durationFrames={45} format="multiplier" />
              </GlowText>
            </div>
          </div>

          <p
            style={{
              fontSize: 18,
              color: colors.muted,
              lineHeight: 1.6,
              opacity: interpolate(frame, [680, 710], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            If you hold 10M tokens now, at $1B market cap they'd be worth{" "}
            <span style={{ color: colors.positive, fontWeight: 700 }}>x33</span> more.
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* CTA (720-900) */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GlowText
              intensity={30}
              style={{
                fontSize: 64,
                fontWeight: 700,
                display: "block",
                marginBottom: 20,
                opacity: interpolate(frame, [720, 760], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              CALCULATE YOUR
              <br />
              POTENTIAL
            </GlowText>

            <p
              style={{
                fontSize: 20,
                color: colors.muted,
                marginBottom: 40,
                opacity: interpolate(frame, [780, 810], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              See what your bag could be worth
            </p>

            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "24px 80px",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.05em",
                opacity: interpolate(frame, [830, 850], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(
                  frame,
                  [830, 870],
                  [0.8, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }
                )})`,
              }}
            >
              GIGACHAD.TRADE
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
