import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { AnimatedNumber } from "../../components/AnimatedNumber";

/**
 * Demo 10: DataGridStats
 * 4-cell grid with values counting up, % changes appearing
 * Duration: 8 seconds (240 frames at 30fps)
 */

const stats = [
  {
    label: "Market Cap",
    value: 30_500_000,
    format: "currency" as const,
    change: 12.5,
    prefix: "$",
  },
  {
    label: "24h Volume",
    value: 2_800_000,
    format: "currency" as const,
    change: -5.2,
    prefix: "$",
  },
  {
    label: "Price",
    value: 0.00318,
    format: "raw" as const,
    change: 8.7,
    prefix: "$",
    decimals: 5,
  },
  {
    label: "Holders",
    value: 12_450,
    format: "raw" as const,
    change: 3.1,
  },
];

export function DataGridStats() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        padding: 80,
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 50,
          textAlign: "center",
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.dim,
            marginBottom: 8,
          }}
        >
          Live Stats
        </p>
        <p
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          GIGACHAD Overview
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          backgroundColor: colors.border,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {stats.map((stat, index) => {
          const cellDelay = 30 + index * 20;

          // Cell entrance
          const cellOpacity = interpolate(
            frame,
            [cellDelay, cellDelay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const cellScale = interpolate(
            frame,
            [cellDelay, cellDelay + 25],
            [0.9, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(1.2)),
            }
          );

          // Change badge appears later
          const changeDelay = cellDelay + 50;
          const changeOpacity = interpolate(
            frame,
            [changeDelay, changeDelay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const changeSlide = interpolate(
            frame,
            [changeDelay, changeDelay + 20],
            [20, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          const isPositive = stat.change >= 0;

          return (
            <div
              key={stat.label}
              style={{
                backgroundColor: colors.bg,
                padding: 48,
                opacity: cellOpacity,
                transform: `scale(${cellScale})`,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: colors.dim,
                  marginBottom: 16,
                }}
              >
                {stat.label}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: colors.white,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {stat.format === "currency" ? (
                    <AnimatedNumber
                      from={0}
                      to={stat.value}
                      startFrame={cellDelay}
                      durationFrames={60}
                      format="currency"
                    />
                  ) : stat.decimals ? (
                    <>
                      {stat.prefix}
                      <AnimatedNumber
                        from={0}
                        to={stat.value}
                        startFrame={cellDelay}
                        durationFrames={60}
                        format="raw"
                      />
                    </>
                  ) : (
                    <AnimatedNumber
                      from={0}
                      to={stat.value}
                      startFrame={cellDelay}
                      durationFrames={60}
                      format="raw"
                    />
                  )}
                </p>

                {/* Change badge */}
                <div
                  style={{
                    opacity: changeOpacity,
                    transform: `translateY(${changeSlide}px)`,
                    padding: "6px 12px",
                    backgroundColor: isPositive
                      ? "rgba(74, 222, 128, 0.15)"
                      : "rgba(248, 113, 113, 0.15)",
                    color: isPositive ? colors.positive : colors.negative,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {stat.change}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 50,
          textAlign: "center",
          fontSize: 12,
          color: colors.dim,
          letterSpacing: "0.1em",
          opacity: interpolate(frame, [180, 210], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Updated every 30 seconds •{" "}
        <span style={{ color: colors.white }}>gigachad.trade</span>
      </p>
    </AbsoluteFill>
  );
}
