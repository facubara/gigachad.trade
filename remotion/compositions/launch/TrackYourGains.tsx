import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { AnimatedNumber } from "../../components/AnimatedNumber";
import { GlowText } from "../../components/GlowText";

/**
 * Launch 4: TrackYourGains
 * Wallet analysis feature: entry price vs current, % gains
 * Duration: 25 seconds (750 frames at 30fps)
 * Format: 16:9
 */

export function TrackYourGains() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Hook (0-120) */}
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
                fontSize: 28,
                color: colors.dim,
                marginBottom: 20,
                opacity: interpolate(frame, [0, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              When did you buy?
            </p>
            <p
              style={{
                fontSize: 28,
                color: colors.dim,
                marginBottom: 20,
                opacity: interpolate(frame, [30, 60], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              At what price?
            </p>
            <GlowText
              intensity={20}
              style={{
                fontSize: 48,
                fontWeight: 700,
                display: "block",
                opacity: interpolate(frame, [60, 90], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              WE'LL FIND OUT.
            </GlowText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Analysis animation (120-350) */}
      <Sequence from={120} durationInFrames={230}>
        <AbsoluteFill style={{ padding: 80 }}>
          <p
            style={{
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 20,
            }}
          >
            Wallet Analysis
          </p>

          <p style={{ fontSize: 24, fontWeight: 600, color: colors.white, marginBottom: 40 }}>
            Scanning your transactions...
          </p>

          {/* Progress indicator */}
          <div
            style={{
              width: "100%",
              height: 4,
              backgroundColor: colors.border,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: `${interpolate(frame, [120, 300], [0, 100], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}%`,
                height: 4,
                backgroundColor: colors.white,
              }}
            />
          </div>

          {/* Transaction list appearing */}
          {[
            { date: "Jan 15", type: "BUY", amount: "5M", price: "$0.000015" },
            { date: "Jan 20", type: "BUY", amount: "12M", price: "$0.000018" },
            { date: "Feb 03", type: "BUY", amount: "8.5M", price: "$0.000022" },
          ].map((tx, i) => {
            const txDelay = 180 + i * 40;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 40,
                  padding: "16px 0",
                  borderBottom: `1px solid ${colors.border}`,
                  opacity: interpolate(frame, [txDelay, txDelay + 20], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <span style={{ color: colors.dim, width: 80 }}>{tx.date}</span>
                <span style={{ color: colors.positive, width: 60 }}>{tx.type}</span>
                <span style={{ color: colors.white, width: 100 }}>{tx.amount}</span>
                <span style={{ color: colors.muted }}>{tx.price}</span>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Results (350-750) */}
      <Sequence from={350} durationInFrames={400}>
        <AbsoluteFill style={{ padding: 80 }}>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.white,
              marginBottom: 50,
              opacity: interpolate(frame, [350, 380], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Your Holdings Summary
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
              backgroundColor: colors.border,
              marginBottom: 50,
            }}
          >
            <div style={{ backgroundColor: colors.bg, padding: 40 }}>
              <p style={{ fontSize: 11, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                Total Balance
              </p>
              <p style={{ fontSize: 40, fontWeight: 700, color: colors.white }}>
                <AnimatedNumber from={0} to={25_500_000} startFrame={400} durationFrames={60} format="compact" />
              </p>
              <p style={{ fontSize: 12, color: colors.dim, marginTop: 4 }}>GIGA tokens</p>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: 40 }}>
              <p style={{ fontSize: 11, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                Average Entry Price
              </p>
              <p style={{ fontSize: 40, fontWeight: 700, color: colors.white }}>
                $0.000018
              </p>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: 40 }}>
              <p style={{ fontSize: 11, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                Current Price
              </p>
              <p style={{ fontSize: 40, fontWeight: 700, color: colors.white }}>
                $0.000030
              </p>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: 40 }}>
              <p style={{ fontSize: 11, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                Unrealized Gain
              </p>
              <p style={{ fontSize: 40, fontWeight: 700, color: colors.positive }}>
                +<AnimatedNumber from={0} to={67} startFrame={460} durationFrames={45} format="raw" suffix="%" />
              </p>
            </div>
          </div>

          {/* Big gain display */}
          <div
            style={{
              textAlign: "center",
              marginTop: 30,
              opacity: interpolate(frame, [520, 550], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(
                frame,
                [520, 560],
                [0.8, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) }
              )})`,
            }}
          >
            <GlowText
              color={colors.positive}
              glowColor={colors.positive}
              intensity={15}
              style={{
                fontSize: 80,
                fontWeight: 700,
                display: "block",
              }}
            >
              +$306
            </GlowText>
            <p style={{ fontSize: 14, color: colors.dim, marginTop: 10 }}>
              Your profit so far
            </p>
          </div>

          {/* CTA */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: interpolate(frame, [650, 680], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <p style={{ fontSize: 18, color: colors.muted }}>
              Check your gains at{" "}
              <span style={{ color: colors.white, fontWeight: 700 }}>gigachad.trade</span>
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
