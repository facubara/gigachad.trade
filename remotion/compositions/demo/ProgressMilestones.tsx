import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { formatMarketCap } from "../../utils/formatters";

/**
 * Demo 7: ProgressMilestones
 * Progress bar filling, milestones lighting up as passed
 * Duration: 10 seconds (300 frames at 30fps)
 */

const milestones = [
  { value: 10_000_000, label: "Warming Up" },
  { value: 50_000_000, label: "Alpha Phase" },
  { value: 100_000_000, label: "Chad Mode" },
  { value: 500_000_000, label: "Final Form" },
  { value: 1_000_000_000, label: "Ascended" },
];

const TARGET = 1_000_000_000;

export function ProgressMilestones() {
  const frame = useCurrentFrame();

  // Animate market cap from $5M to $120M over the video
  const marketCap = interpolate(
    frame,
    [30, 270],
    [5_000_000, 120_000_000],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const progress = (marketCap / TARGET) * 100;

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 40,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 8,
            }}
          >
            Road to $1 Billion
          </p>
          <p
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: colors.white,
            }}
          >
            {formatMarketCap(marketCap)}
          </p>
        </div>
        <p
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          {progress.toFixed(1)}%
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "relative",
          height: 8,
          backgroundColor: colors.border,
          marginBottom: 60,
          borderRadius: 4,
        }}
      >
        {/* Milestone markers */}
        {milestones.map((milestone) => {
          const position = (milestone.value / TARGET) * 100;
          const isReached = marketCap >= milestone.value;

          return (
            <div
              key={milestone.value}
              style={{
                position: "absolute",
                left: `${position}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 16,
                height: 16,
                backgroundColor: isReached ? colors.white : colors.border,
                borderRadius: "50%",
                border: `2px solid ${isReached ? colors.white : colors.dim}`,
                zIndex: 2,
                transition: "all 0.3s",
              }}
            />
          );
        })}

        {/* Fill */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 8,
            backgroundColor: colors.white,
            width: `${progress}%`,
            borderRadius: 4,
            zIndex: 1,
          }}
        />

        {/* Current position indicator */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: `${progress}%`,
            transform: "translateX(-50%)",
            fontSize: 20,
            zIndex: 3,
          }}
        >
          ▼
        </div>
      </div>

      {/* Milestones list */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {milestones.map((milestone, index) => {
          const isReached = marketCap >= milestone.value;
          const isCurrent =
            marketCap >= milestone.value &&
            (index === milestones.length - 1 ||
              marketCap < milestones[index + 1].value);

          // Glow effect when milestone is reached
          const milestoneReachFrame = interpolate(
            milestone.value,
            [5_000_000, 120_000_000],
            [30, 270],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const glowIntensity =
            frame >= milestoneReachFrame && frame < milestoneReachFrame + 30
              ? interpolate(
                  frame - milestoneReachFrame,
                  [0, 15, 30],
                  [0, 20, 0],
                  { extrapolateRight: "clamp" }
                )
              : 0;

          return (
            <div
              key={milestone.value}
              style={{
                textAlign: "center",
                opacity: isReached ? 1 : 0.4,
                transform: isCurrent ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s",
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: isReached ? colors.white : colors.dim,
                  marginBottom: 8,
                  textShadow:
                    glowIntensity > 0
                      ? `0 0 ${glowIntensity}px ${colors.white}`
                      : "none",
                }}
              >
                {formatMarketCap(milestone.value)}
              </p>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isReached ? colors.muted : colors.dim,
                }}
              >
                {milestone.label}
              </p>
              {isCurrent && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "4px 12px",
                    backgroundColor: colors.positive,
                    color: colors.black,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Current
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 60,
          textAlign: "center",
          fontSize: 14,
          color: colors.dim,
          opacity: interpolate(frame, [200, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Track progress live at{" "}
        <span style={{ color: colors.white }}>gigachad.trade</span>
      </p>
    </AbsoluteFill>
  );
}
