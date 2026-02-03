import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";
import { CountUp } from "../../components/CountUp";

/**
 * Launch 3: JoinTheClicker
 * Energetic vertical video promoting the clicker game
 * Duration: 20 seconds (600 frames at 30fps)
 * Format: 9:16 (vertical)
 */

export function JoinTheClicker() {
  const frame = useCurrentFrame();

  // Click simulation
  const clickInterval = 12;
  const clickCount = Math.floor(frame / clickInterval);
  const timeSinceClick = frame % clickInterval;
  const clickScale = interpolate(timeSinceClick, [0, 3, 12], [0.9, 1.1, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Opening hook (0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <GlowText
            intensity={25}
            style={{
              fontSize: 72,
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            CAN YOU
            <br />
            CLICK
            <br />
            FASTER?
          </GlowText>
        </AbsoluteFill>
      </Sequence>

      {/* Clicker demo (90-400) */}
      <Sequence from={90} durationInFrames={310}>
        <AbsoluteFill
          style={{
            padding: 40,
            alignItems: "center",
          }}
        >
          {/* Counter */}
          <div
            style={{
              marginTop: 80,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 100,
                fontWeight: 700,
                color: colors.white,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <CountUp
                from={0}
                to={Math.min(clickCount, 26)}
                startFrame={0}
                durationFrames={1}
              />
            </p>
            <p
              style={{
                fontSize: 14,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: colors.muted,
              }}
            >
              Push-ups
            </p>
          </div>

          {/* Click target */}
          <div
            style={{
              marginTop: 60,
              width: 300,
              height: 300,
              backgroundColor: colors.steel,
              border: `2px solid ${colors.border}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${clickScale})`,
            }}
          >
            <span style={{ fontSize: 120 }}>💪</span>
          </div>

          {/* Floating +1s */}
          {Array.from({ length: 5 }, (_, i) => {
            const particleFrame = 90 + i * 40;
            if (frame < particleFrame || frame > particleFrame + 30) return null;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 500 - (frame - particleFrame) * 3,
                  opacity: interpolate(frame - particleFrame, [0, 15, 30], [0, 1, 0]),
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.white,
                }}
              >
                +1
              </div>
            );
          })}

          {/* Stats */}
          <div
            style={{
              marginTop: 60,
              display: "flex",
              gap: 40,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: colors.white }}>1</p>
              <p style={{ fontSize: 10, color: colors.dim, letterSpacing: "0.1em" }}>PER CLICK</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: colors.positive }}>0</p>
              <p style={{ fontSize: 10, color: colors.dim, letterSpacing: "0.1em" }}>PER SEC</p>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Perks tease (400-500) */}
      <Sequence from={400} durationInFrames={100}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 20,
                color: colors.dim,
                marginBottom: 30,
                opacity: interpolate(frame, [400, 430], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              UPGRADE YOUR PERKS
            </p>

            <div style={{ display: "flex", gap: 20 }}>
              {["🥤", "🧤", "🏋️", "👨‍🏫"].map((emoji, i) => (
                <div
                  key={emoji}
                  style={{
                    fontSize: 50,
                    opacity: interpolate(frame, [430 + i * 15, 450 + i * 15], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `translateY(${interpolate(
                      frame,
                      [430 + i * 15, 450 + i * 15],
                      [30, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}px)`,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA (500-600) */}
      <Sequence from={500} durationInFrames={100}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GlowText
              intensity={30}
              style={{
                fontSize: 48,
                fontWeight: 700,
                display: "block",
                marginBottom: 30,
              }}
            >
              START
              <br />
              CLICKING
            </GlowText>

            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "20px 50px",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.1em",
                opacity: interpolate(frame, [540, 560], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(
                  frame,
                  [540, 570],
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
