import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";
import { CountUp } from "../../components/CountUp";

/**
 * Launch 7: CommunityCall
 * "JOIN THE CHADS" - leaderboard, clicking together, sharing
 * Duration: 20 seconds (600 frames at 30fps)
 * Format: 16:9
 */

const leaderboardSnippet = [
  { rank: 1, name: "ChadKing", pushups: "1.2M", medal: "🥇" },
  { rank: 2, name: "GigaMaxer", pushups: "980K", medal: "🥈" },
  { rank: 3, name: "PumpMaster", pushups: "875K", medal: "🥉" },
];

export function CommunityCall() {
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
              STRONGER TOGETHER
            </p>
            <GlowText
              intensity={30}
              style={{
                fontSize: 100,
                fontWeight: 700,
                display: "block",
                transform: `scale(${interpolate(frame, [30, 60], [0.5, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(2)),
                })})`,
              }}
            >
              JOIN THE CHADS
            </GlowText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Community stats (120-300) */}
      <Sequence from={120} durationInFrames={180}>
        <AbsoluteFill style={{ padding: 80 }}>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.white,
              textAlign: "center",
              marginBottom: 60,
              opacity: interpolate(frame, [120, 150], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            The Community is Growing
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 80,
            }}
          >
            {[
              { label: "Total Clicks", value: 15_680_000, color: colors.white },
              { label: "Active Players", value: 2847, color: colors.positive },
              { label: "Shared Posts", value: 12450, color: colors.purple },
            ].map((stat, i) => {
              const delay = 150 + i * 30;
              return (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    opacity: interpolate(frame, [delay, delay + 30], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `translateY(${interpolate(
                      frame,
                      [delay, delay + 30],
                      [30, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}px)`,
                  }}
                >
                  <p style={{ fontSize: 60, fontWeight: 700, color: stat.color }}>
                    <CountUp
                      from={0}
                      to={stat.value}
                      startFrame={delay}
                      durationFrames={60}
                      suffix={stat.value > 100000 ? "" : ""}
                    />
                    {stat.value >= 1_000_000 && "M"}
                    {stat.value >= 1_000 && stat.value < 1_000_000 && ""}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: colors.dim,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginTop: 8,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Leaderboard snippet (300-450) */}
      <Sequence from={300} durationInFrames={150}>
        <AbsoluteFill
          style={{
            padding: 80,
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.white,
              textAlign: "center",
              marginBottom: 40,
              opacity: interpolate(frame, [300, 330], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Compete for the Top Spots
          </p>

          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              backgroundColor: colors.border,
            }}
          >
            {leaderboardSnippet.map((player, i) => {
              const delay = 330 + i * 25;
              return (
                <div
                  key={player.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px 32px",
                    backgroundColor: colors.bg,
                    marginBottom: 1,
                    opacity: interpolate(frame, [delay, delay + 20], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `translateX(${interpolate(
                      frame,
                      [delay, delay + 20],
                      [-50, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}px)`,
                  }}
                >
                  <span style={{ fontSize: 32, width: 60 }}>{player.medal}</span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: colors.white, flex: 1 }}>
                    {player.name}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: colors.muted }}>
                    {player.pushups}
                  </span>
                </div>
              );
            })}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: 30,
              fontSize: 14,
              color: colors.dim,
              opacity: interpolate(frame, [420, 440], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Can you make the top 10?
          </p>
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
                fontSize: 24,
                color: colors.muted,
                letterSpacing: "0.2em",
                marginBottom: 30,
                opacity: interpolate(frame, [450, 480], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              CLICK • COMPETE • CONQUER
            </p>

            <GlowText
              intensity={35}
              style={{
                fontSize: 72,
                fontWeight: 700,
                display: "block",
                marginBottom: 50,
                opacity: interpolate(frame, [480, 510], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              BE A CHAD
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
