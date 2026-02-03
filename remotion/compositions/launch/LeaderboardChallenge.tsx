import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";
import { CountUp } from "../../components/CountUp";

/**
 * Launch 9: LeaderboardChallenge
 * "CAN YOU MAKE TOP 10?" competitive challenge
 * Duration: 20 seconds (600 frames at 30fps)
 * Format: 16:9
 */

const topPlayers = [
  { rank: 1, name: "ChadKing", pushups: 1_250_000 },
  { rank: 2, name: "GigaMaxer", pushups: 980_500 },
  { rank: 3, name: "PumpMaster", pushups: 875_200 },
  { rank: 4, name: "SolanaChad", pushups: 654_100 },
  { rank: 5, name: "DiamondHands", pushups: 521_800 },
  { rank: 6, name: "MoonBoy", pushups: 412_300 },
  { rank: 7, name: "CryptoGiga", pushups: 389_900 },
  { rank: 8, name: "PumpIt", pushups: 354_600 },
  { rank: 9, name: "HodlChad", pushups: 298_200 },
  { rank: 10, name: "???", pushups: null, isYou: true },
];

export function LeaderboardChallenge() {
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
                fontSize: 24,
                color: colors.dim,
                letterSpacing: "0.2em",
                marginBottom: 30,
                opacity: interpolate(frame, [0, 30], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              THE CHALLENGE
            </p>
            <GlowText
              intensity={35}
              style={{
                fontSize: 80,
                fontWeight: 700,
                display: "block",
                transform: `scale(${interpolate(frame, [30, 70], [0.5, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(2)),
                })})`,
              }}
            >
              CAN YOU MAKE
              <br />
              TOP 10?
            </GlowText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Leaderboard reveal (120-450) */}
      <Sequence from={120} durationInFrames={330}>
        <AbsoluteFill style={{ padding: 60 }}>
          <div
            style={{
              display: "flex",
              gap: 60,
            }}
          >
            {/* Left column: ranks 1-5 */}
            <div style={{ flex: 1 }}>
              {topPlayers.slice(0, 5).map((player, i) => (
                <LeaderboardRow
                  key={player.rank}
                  player={player}
                  frame={frame}
                  delay={150 + i * 25}
                />
              ))}
            </div>

            {/* Right column: ranks 6-10 */}
            <div style={{ flex: 1 }}>
              {topPlayers.slice(5).map((player, i) => (
                <LeaderboardRow
                  key={player.rank}
                  player={player}
                  frame={frame}
                  delay={150 + (i + 5) * 25}
                />
              ))}
            </div>
          </div>

          {/* Entry requirement */}
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              opacity: interpolate(frame, [380, 410], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <p style={{ fontSize: 14, color: colors.dim }}>
              Current 10th place requirement:
            </p>
            <p style={{ fontSize: 32, fontWeight: 700, color: colors.purple, marginTop: 8 }}>
              <CountUp from={0} to={298200} startFrame={410} durationFrames={40} /> push-ups
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA (450-600) */}
      <Sequence from={450} durationInFrames={150}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 20,
                color: colors.dim,
                letterSpacing: "0.2em",
                marginBottom: 30,
                opacity: interpolate(frame, [450, 480], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              PROVE YOUR STRENGTH
            </p>

            <GlowText
              intensity={40}
              style={{
                fontSize: 70,
                fontWeight: 700,
                display: "block",
                marginBottom: 50,
                opacity: interpolate(frame, [480, 510], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              CLAIM YOUR SPOT
            </GlowText>

            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "24px 80px",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.05em",
                opacity: interpolate(frame, [530, 550], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(
                  frame,
                  [530, 570],
                  [0.8, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }
                )})`,
              }}
            >
              GIGACHAD.TRADE/GAME
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

function LeaderboardRow({
  player,
  frame,
  delay,
}: {
  player: (typeof topPlayers)[0];
  frame: number;
  delay: number;
}) {
  const isYou = player.isYou;
  const medal =
    player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : player.rank === 3 ? "🥉" : null;

  // Pulse effect for the "You" slot
  const youPulse =
    isYou && frame > delay + 60
      ? interpolate(frame % 40, [0, 20, 40], [1, 1.03, 1])
      : 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 24px",
        marginBottom: 8,
        backgroundColor: isYou ? colors.bgSecondary : colors.bg,
        border: `1px solid ${isYou ? colors.purple : colors.border}`,
        opacity: interpolate(frame, [delay, delay + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `translateX(${interpolate(
          frame,
          [delay, delay + 20],
          [-50, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        )}px) scale(${youPulse})`,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: medal ? colors.white : colors.dim,
          width: 50,
        }}
      >
        {medal || `#${player.rank}`}
      </span>
      <span
        style={{
          fontSize: 18,
          fontWeight: isYou ? 700 : 400,
          color: isYou ? colors.purple : colors.white,
          flex: 1,
        }}
      >
        {player.name}
      </span>
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: isYou ? colors.purple : colors.muted,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {player.pushups ? player.pushups.toLocaleString() : "???"}
      </span>
    </div>
  );
}
