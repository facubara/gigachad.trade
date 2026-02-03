import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { TypewriterText } from "../../components/TypewriterText";
import { AnimatedNumber } from "../../components/AnimatedNumber";

/**
 * Launch 2: HowToUseCalculator
 * Step-by-step tutorial for the calculator
 * Duration: 45 seconds (1350 frames at 30fps)
 * Format: 16:9
 */

export function HowToUseCalculator() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Intro (0-120) */}
      <Sequence from={0} durationInFrames={120}>
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
                letterSpacing: "0.3em",
                color: colors.dim,
                textTransform: "uppercase",
                marginBottom: 20,
                opacity: interpolate(frame, [0, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Tutorial
            </p>
            <p
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: colors.white,
                opacity: interpolate(frame, [30, 60], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              How to Use the Calculator
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Step 1: Enter Wallet (120-420) */}
      <Sequence from={120} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 80 }}>
          <StepHeader step={1} title="Enter Your Wallet Address" frame={frame} startFrame={120} />

          <div
            style={{
              marginTop: 60,
              opacity: interpolate(frame, [180, 210], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {/* Mock input field */}
            <div
              style={{
                backgroundColor: colors.steel,
                border: `1px solid ${colors.border}`,
                padding: "20px 28px",
                width: 700,
                marginBottom: 30,
              }}
            >
              <TypewriterText
                text="7xKXmNbP4vQZr8sWdY2fH3jL9cT6nR1qA5wKbEp4b9Pq"
                startFrame={240}
                charsPerFrame={0.8}
                style={{ fontSize: 18, color: colors.white }}
              />
            </div>

            {/* Analyze button */}
            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "16px 40px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.1em",
                display: "inline-block",
                transform: `scale(${interpolate(
                  frame,
                  [350, 360, 370],
                  [1, 0.95, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )})`,
              }}
            >
              ANALYZE WALLET
            </div>

            {/* Tip */}
            <p
              style={{
                marginTop: 40,
                fontSize: 13,
                color: colors.dim,
                opacity: interpolate(frame, [300, 330], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              💡 Paste any Solana wallet that holds GIGACHAD tokens
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Step 2: Review Holdings (420-720) */}
      <Sequence from={420} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 80 }}>
          <StepHeader step={2} title="Review Your Holdings" frame={frame} startFrame={420} />

          <div
            style={{
              marginTop: 60,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              backgroundColor: colors.border,
              opacity: interpolate(frame, [480, 510], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <DataCell label="Balance" delay={510}>
              <AnimatedNumber
                from={0}
                to={156_000_000}
                startFrame={510}
                durationFrames={60}
                format="compact"
                suffix=" GIGA"
              />
            </DataCell>
            <DataCell label="Current Value" delay={540}>
              <AnimatedNumber
                from={0}
                to={4680}
                startFrame={540}
                durationFrames={60}
                format="currency"
              />
            </DataCell>
            <DataCell label="Entry Price" delay={570}>
              $0.000018
            </DataCell>
          </div>

          <p
            style={{
              marginTop: 40,
              fontSize: 13,
              color: colors.dim,
              opacity: interpolate(frame, [630, 660], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            💡 We analyze your transaction history to find your average entry price
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* Step 3: Set Target (720-1020) */}
      <Sequence from={720} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 80 }}>
          <StepHeader step={3} title="Set Your Target Market Cap" frame={frame} startFrame={720} />

          <div
            style={{
              marginTop: 60,
              opacity: interpolate(frame, [780, 810], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <p style={{ fontSize: 14, color: colors.dim, marginBottom: 20 }}>Choose a target:</p>

            <div style={{ display: "flex", gap: 16 }}>
              {["$100M", "$500M", "$1B"].map((target, i) => {
                const isSelected = target === "$1B";
                const selectFrame = 880;
                const isHighlighted = isSelected && frame >= selectFrame;

                return (
                  <div
                    key={target}
                    style={{
                      padding: "16px 40px",
                      backgroundColor: isHighlighted ? colors.white : colors.steel,
                      border: `1px solid ${isHighlighted ? colors.white : colors.border}`,
                      color: isHighlighted ? colors.black : colors.white,
                      fontSize: 20,
                      fontWeight: 700,
                      transform: isHighlighted ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {target}
                  </div>
                );
              })}
            </div>

            <p
              style={{
                marginTop: 40,
                fontSize: 13,
                color: colors.dim,
                opacity: interpolate(frame, [920, 950], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              💡 Or enter a custom market cap target
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Step 4: See Results (1020-1350) */}
      <Sequence from={1020} durationInFrames={330}>
        <AbsoluteFill style={{ padding: 80 }}>
          <StepHeader step={4} title="See Your Potential Gains" frame={frame} startFrame={1020} />

          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              opacity: interpolate(frame, [1080, 1110], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(
                frame,
                [1080, 1120],
                [0.8, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(2)),
                }
              )})`,
            }}
          >
            <p
              style={{
                fontSize: 140,
                fontWeight: 700,
                color: colors.white,
                lineHeight: 0.9,
              }}
            >
              x<AnimatedNumber
                from={1}
                to={33}
                startFrame={1110}
                durationFrames={60}
                format="multiplier"
              />
            </p>
            <p
              style={{
                fontSize: 14,
                letterSpacing: "0.2em",
                color: colors.muted,
                textTransform: "uppercase",
                marginTop: 20,
              }}
            >
              From Your Entry
            </p>

            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                gap: 60,
              }}
            >
              <div>
                <p style={{ fontSize: 40, fontWeight: 700, color: colors.positive }}>
                  <AnimatedNumber
                    from={4680}
                    to={154440}
                    startFrame={1150}
                    durationFrames={60}
                    format="currency"
                  />
                </p>
                <p style={{ fontSize: 10, color: colors.dim, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Value at Target
                </p>
              </div>
              <div>
                <p style={{ fontSize: 40, fontWeight: 700, color: colors.positive }}>
                  +<AnimatedNumber
                    from={0}
                    to={149760}
                    startFrame={1180}
                    durationFrames={60}
                    format="currency"
                  />
                </p>
                <p style={{ fontSize: 10, color: colors.dim, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Profit
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: interpolate(frame, [1250, 1280], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <p style={{ fontSize: 20, color: colors.white }}>
              Try it now at <span style={{ fontWeight: 700 }}>gigachad.trade/calculator</span>
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

function StepHeader({
  step,
  title,
  frame,
  startFrame,
}: {
  step: number;
  title: string;
  frame: number;
  startFrame: number;
}) {
  return (
    <div
      style={{
        opacity: interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <p
        style={{
          fontSize: 14,
          letterSpacing: "0.2em",
          color: colors.purple,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Step {step}
      </p>
      <p
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: colors.white,
        }}
      >
        {title}
      </p>
    </div>
  );
}

function DataCell({
  label,
  children,
  delay,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div style={{ backgroundColor: colors.bg, padding: 40 }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.dim,
          marginBottom: 12,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 32, fontWeight: 700, color: colors.white }}>{children}</p>
    </div>
  );
}
