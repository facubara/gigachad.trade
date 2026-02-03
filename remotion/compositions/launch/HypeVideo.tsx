import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";

/**
 * Launch 5: HypeVideo
 * Fast cuts, bold text, "x33 TO $1 BILLION", energetic
 * Duration: 15 seconds (450 frames at 30fps)
 * Format: 16:9
 */

export function HypeVideo() {
  const frame = useCurrentFrame();

  // Screen shake for energy
  const shakeX = Math.sin(frame * 0.5) * (frame > 300 ? 3 : 0);
  const shakeY = Math.cos(frame * 0.7) * (frame > 300 ? 2 : 0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Flash 1: GIGACHAD (0-60) */}
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <GlowText
            intensity={40}
            style={{
              fontSize: 140,
              fontWeight: 700,
              letterSpacing: "0.1em",
              transform: `scale(${interpolate(frame, [0, 15], [0.5, 1], {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.back(3)),
              })})`,
            }}
          >
            GIGACHAD
          </GlowText>
        </AbsoluteFill>
      </Sequence>

      {/* Flash 2: $30M NOW (60-120) */}
      <Sequence from={60} durationInFrames={60}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 100,
                fontWeight: 700,
                color: colors.white,
                transform: `scale(${interpolate(frame, [60, 75], [0.5, 1], {
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(3)),
                })})`,
              }}
            >
              $30M
            </p>
            <p style={{ fontSize: 24, color: colors.dim, letterSpacing: "0.2em" }}>RIGHT NOW</p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Flash 3: $1B TARGET (120-180) */}
      <Sequence from={120} durationInFrames={60}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GlowText
              color={colors.positive}
              glowColor={colors.positive}
              intensity={30}
              style={{
                fontSize: 120,
                fontWeight: 700,
                display: "block",
                transform: `scale(${interpolate(frame, [120, 135], [0.5, 1], {
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(3)),
                })})`,
              }}
            >
              $1B
            </GlowText>
            <p style={{ fontSize: 24, color: colors.muted, letterSpacing: "0.2em" }}>TARGET</p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Flash 4: x33 (180-270) */}
      <Sequence from={180} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <GlowText
            intensity={50}
            pulseSpeed={30}
            style={{
              fontSize: 250,
              fontWeight: 700,
              lineHeight: 0.9,
              transform: `scale(${interpolate(frame, [180, 200], [0.3, 1], {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.back(2)),
              })})`,
            }}
          >
            x33
          </GlowText>
        </AbsoluteFill>
      </Sequence>

      {/* Flash 5: Quick cuts (270-360) */}
      <Sequence from={270} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Rapid fire text */}
          {["TRACK", "CALCULATE", "DOMINATE"].map((word, i) => {
            const wordStart = 270 + i * 25;
            const wordEnd = wordStart + 25;
            const isVisible = frame >= wordStart && frame < wordEnd;

            if (!isVisible) return null;

            return (
              <GlowText
                key={word}
                intensity={25}
                style={{
                  fontSize: 100,
                  fontWeight: 700,
                  transform: `scale(${interpolate(
                    frame - wordStart,
                    [0, 8],
                    [0.5, 1],
                    { extrapolateRight: "clamp", easing: Easing.out(Easing.back(3)) }
                  )})`,
                }}
              >
                {word}
              </GlowText>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Final: CTA (360-450) */}
      <Sequence from={360} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GlowText
              intensity={35}
              style={{
                fontSize: 60,
                fontWeight: 700,
                display: "block",
                marginBottom: 40,
                opacity: interpolate(frame, [360, 390], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              JOIN NOW
            </GlowText>

            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "24px 80px",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.05em",
                transform: `scale(${interpolate(
                  frame,
                  [400, 430],
                  [0.8, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }
                )})`,
                opacity: interpolate(frame, [400, 420], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              GIGACHAD.TRADE
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
