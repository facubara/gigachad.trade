import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";
import { formatMarketCap } from "../../utils/formatters";

/**
 * Launch 6: RoadToOneBillion
 * Progress through milestones: $10M → $50M → $100M → $500M → $1B
 * Duration: 30 seconds (900 frames at 30fps)
 * Format: 16:9
 */

const milestones = [
  { value: 10_000_000, label: "Warming Up", emoji: "🔥" },
  { value: 50_000_000, label: "Alpha Phase", emoji: "🐺" },
  { value: 100_000_000, label: "Chad Mode", emoji: "💪" },
  { value: 500_000_000, label: "Final Form", emoji: "⚡" },
  { value: 1_000_000_000, label: "Ascended", emoji: "👑" },
];

export function RoadToOneBillion() {
  const frame = useCurrentFrame();

  // Animate through milestones
  const currentMilestoneIndex = interpolate(
    frame,
    [90, 750],
    [0, 4.99],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const marketCap = interpolate(
    frame,
    [90, 750],
    [10_000_000, 1_000_000_000],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const progress = (marketCap / 1_000_000_000) * 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <p style={{ fontSize: 12, color: colors.dim, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          The Journey
        </p>
        <p style={{ fontSize: 36, fontWeight: 700, color: colors.white }}>
          Road to $1 Billion
        </p>
      </div>

      {/* Current market cap display */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          textAlign: "right",
          opacity: interpolate(frame, [60, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <p style={{ fontSize: 12, color: colors.dim, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Market Cap
        </p>
        <p style={{ fontSize: 48, fontWeight: 700, color: colors.white }}>
          {formatMarketCap(marketCap)}
        </p>
      </div>

      {/* Central milestone display */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        {milestones.map((milestone, i) => {
          const isActive = Math.floor(currentMilestoneIndex) === i;
          const opacity = isActive ? 1 : 0;
          const scale = isActive
            ? interpolate(
                currentMilestoneIndex - i,
                [0, 0.1, 0.9, 1],
                [0.8, 1, 1, 0.8],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 0.8;

          return (
            <div
              key={milestone.value}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
              }}
            >
              <span style={{ fontSize: 100, display: "block", marginBottom: 20 }}>
                {milestone.emoji}
              </span>
              <GlowText
                intensity={i === 4 ? 40 : 20}
                style={{
                  fontSize: 80,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 16,
                }}
              >
                {formatMarketCap(milestone.value)}
              </GlowText>
              <p
                style={{
                  fontSize: 20,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: colors.muted,
                }}
              >
                {milestone.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 80,
          right: 80,
        }}
      >
        {/* Track */}
        <div
          style={{
            position: "relative",
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
          }}
        >
          {/* Milestone markers */}
          {milestones.map((milestone, i) => {
            const position = (milestone.value / 1_000_000_000) * 100;
            const isReached = marketCap >= milestone.value;

            return (
              <div
                key={milestone.value}
                style={{
                  position: "absolute",
                  left: `${position}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isReached ? 20 : 12,
                  height: isReached ? 20 : 12,
                  backgroundColor: isReached ? colors.white : colors.border,
                  borderRadius: "50%",
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
        </div>

        {/* Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          {milestones.map((milestone) => {
            const isReached = marketCap >= milestone.value;
            return (
              <p
                key={milestone.value}
                style={{
                  fontSize: 12,
                  color: isReached ? colors.white : colors.dim,
                  fontWeight: isReached ? 700 : 400,
                }}
              >
                {formatMarketCap(milestone.value)}
              </p>
            );
          })}
        </div>
      </div>

      {/* Final celebration (800-900) */}
      {frame > 800 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: interpolate(frame, [800, 830], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <GlowText
            intensity={50}
            pulseSpeed={20}
            style={{
              fontSize: 100,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            WE'RE ALL
            <br />
            GONNA MAKE IT
          </GlowText>
        </div>
      )}
    </AbsoluteFill>
  );
}
