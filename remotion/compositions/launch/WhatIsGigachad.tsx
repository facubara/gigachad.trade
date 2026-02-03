import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { Logo } from "../../components/Logo";
import { AnimatedNumber } from "../../components/AnimatedNumber";
import { GlowText } from "../../components/GlowText";

/**
 * Launch 1: WhatIsGigachad
 * Intro explainer: logo, definition, multiplier, features montage
 * Duration: 30 seconds (900 frames at 30fps)
 * Format: 16:9
 */

const features = [
  { icon: "📊", title: "Live Multiplier", desc: "Track gains to $1B" },
  { icon: "🧮", title: "Calculator", desc: "Project your potential" },
  { icon: "🎮", title: "Clicker Game", desc: "Earn & compete" },
  { icon: "📈", title: "Wallet Analysis", desc: "See your history" },
];

export function WhatIsGigachad() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Phase 1: Logo reveal (0-150) */}
      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo size="large" animate startFrame={30} />
          <p
            style={{
              position: "absolute",
              bottom: 200,
              fontSize: 16,
              letterSpacing: "0.3em",
              color: colors.dim,
              textTransform: "uppercase",
              opacity: interpolate(frame, [90, 120], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            The Ultimate Solana Meme Dashboard
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* Phase 2: Multiplier showcase (150-400) */}
      <Sequence from={150} durationInFrames={250}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 80,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                letterSpacing: "0.2em",
                color: colors.dim,
                textTransform: "uppercase",
                marginBottom: 30,
                opacity: interpolate(frame, [150, 180], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              How far are we from $1 Billion?
            </p>

            <GlowText
              intensity={30}
              style={{
                fontSize: 180,
                fontWeight: 700,
                lineHeight: 0.9,
                display: "block",
              }}
            >
              x<AnimatedNumber
                from={1}
                to={33}
                startFrame={180}
                durationFrames={90}
                format="multiplier"
              />
            </GlowText>

            <p
              style={{
                fontSize: 18,
                color: colors.muted,
                marginTop: 40,
                opacity: interpolate(frame, [280, 310], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Real-time multiplier based on current market cap
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Phase 3: Features grid (400-750) */}
      <Sequence from={400} durationInFrames={350}>
        <AbsoluteFill
          style={{
            padding: 100,
          }}
        >
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.white,
              textAlign: "center",
              marginBottom: 60,
              opacity: interpolate(frame, [400, 430], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Everything You Need
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
              backgroundColor: colors.border,
            }}
          >
            {features.map((feature, i) => {
              const featureDelay = 430 + i * 40;
              const opacity = interpolate(
                frame,
                [featureDelay, featureDelay + 30],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const scale = interpolate(
                frame,
                [featureDelay, featureDelay + 30],
                [0.8, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(1.5)),
                }
              );

              return (
                <div
                  key={feature.title}
                  style={{
                    backgroundColor: colors.bg,
                    padding: 60,
                    textAlign: "center",
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  <span style={{ fontSize: 60, display: "block", marginBottom: 20 }}>
                    {feature.icon}
                  </span>
                  <p style={{ fontSize: 24, fontWeight: 700, color: colors.white, marginBottom: 8 }}>
                    {feature.title}
                  </p>
                  <p style={{ fontSize: 14, color: colors.dim }}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Phase 4: CTA (750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GlowText
              intensity={25}
              style={{
                fontSize: 72,
                fontWeight: 700,
                display: "block",
                marginBottom: 30,
              }}
            >
              JOIN THE CHADS
            </GlowText>

            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "20px 60px",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.1em",
                display: "inline-block",
                opacity: interpolate(frame, [800, 830], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(
                  frame,
                  [800, 840],
                  [0.8, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.back(2)),
                  }
                )})`,
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
