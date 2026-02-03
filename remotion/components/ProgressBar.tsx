import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors } from "../styles/colors";
import { formatMarketCap } from "../utils/formatters";

interface Milestone {
  value: number;
  label: string;
}

interface ProgressBarProps {
  progress: number; // 0-100
  startFrame?: number;
  durationFrames: number;
  milestones?: Milestone[];
  currentMarketCap?: number;
  showMilestones?: boolean;
}

export function ProgressBar({
  progress,
  startFrame = 0,
  durationFrames,
  milestones = [],
  currentMarketCap,
  showMilestones = true,
}: ProgressBarProps) {
  const frame = useCurrentFrame();

  const animatedProgress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.dim,
          }}
        >
          Progress to Target
        </p>
        <p style={{ fontSize: 32, fontWeight: 700, color: colors.white }}>
          {animatedProgress.toFixed(1)}%
        </p>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          position: "relative",
          height: 4,
          backgroundColor: colors.border,
          marginBottom: 48,
          borderRadius: 2,
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 4,
            backgroundColor: colors.white,
            width: `${animatedProgress}%`,
            borderRadius: 2,
          }}
        />
        {/* Indicator */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${animatedProgress}%`,
            width: 12,
            height: 12,
            backgroundColor: colors.white,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Milestones */}
      {showMilestones && milestones.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {milestones.map((milestone) => {
            const isReached =
              currentMarketCap !== undefined && currentMarketCap >= milestone.value;

            return (
              <div key={milestone.value} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 8,
                    color: isReached ? colors.white : colors.dim,
                  }}
                >
                  {formatMarketCap(milestone.value)}
                </p>
                <p
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: isReached ? colors.muted : colors.dim,
                  }}
                >
                  {milestone.label}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
