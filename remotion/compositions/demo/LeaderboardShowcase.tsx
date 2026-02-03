import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";

/**
 * Demo 4: LeaderboardShowcase
 * Rows sliding in, medals for top 3, rank highlighting
 * Duration: 8 seconds (240 frames at 30fps)
 */

const leaderboardData = [
  { rank: 1, name: "ChadKing", pushups: 1_250_000, medal: "🥇" },
  { rank: 2, name: "GigaMaxer", pushups: 980_500, medal: "🥈" },
  { rank: 3, name: "PumpMaster", pushups: 875_200, medal: "🥉" },
  { rank: 4, name: "SolanaChad", pushups: 654_100 },
  { rank: 5, name: "DiamondHands", pushups: 521_800 },
  { rank: 6, name: "MoonBoy", pushups: 412_300 },
  { rank: 7, name: "CryptoGiga", pushups: 389_900 },
  { rank: 8, name: "You", pushups: 245_600, isHighlighted: true },
];

export function LeaderboardShowcase() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        padding: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 50,
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
          Clicker Game
        </p>
        <p
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          Leaderboard
        </p>
      </div>

      {/* Leaderboard table */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: colors.border,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 200px",
            padding: "16px 24px",
            backgroundColor: colors.bgSecondary,
            opacity: interpolate(frame, [10, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Rank
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Player
          </p>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: colors.dim,
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Push-ups
          </p>
        </div>

        {/* Data rows */}
        {leaderboardData.map((row, index) => {
          const rowDelay = 30 + index * 15;
          const slideIn = interpolate(
            frame,
            [rowDelay, rowDelay + 20],
            [-100, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );
          const fadeIn = interpolate(
            frame,
            [rowDelay, rowDelay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Highlight animation for "You" row
          const highlightPulse =
            row.isHighlighted && frame > 180
              ? interpolate(frame % 60, [0, 30, 60], [1, 1.02, 1])
              : 1;

          return (
            <div
              key={row.rank}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 200px",
                padding: "20px 24px",
                backgroundColor: row.isHighlighted ? colors.bgSecondary : colors.bg,
                borderLeft: row.isHighlighted ? `3px solid ${colors.purple}` : "3px solid transparent",
                transform: `translateX(${slideIn}px) scale(${highlightPulse})`,
                opacity: fadeIn,
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: row.medal ? colors.white : colors.muted,
                }}
              >
                {row.medal || `#${row.rank}`}
              </p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: row.isHighlighted ? 700 : 400,
                  color: row.isHighlighted ? colors.purple : colors.white,
                }}
              >
                {row.name}
              </p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.white,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.pushups.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <p
        style={{
          marginTop: 40,
          textAlign: "center",
          fontSize: 14,
          color: colors.dim,
          letterSpacing: "0.1em",
          opacity: interpolate(frame, [200, 230], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Climb the ranks at{" "}
        <span style={{ color: colors.white }}>gigachad.trade/game</span>
      </p>
    </AbsoluteFill>
  );
}
