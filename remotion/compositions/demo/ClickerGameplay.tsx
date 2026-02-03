import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Img, staticFile } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { ParticleEffect, generateParticles } from "../../components/ParticleEffect";
import { CountUp } from "../../components/CountUp";

/**
 * Demo 2: ClickerGameplay
 * Pushup clicks with floating +N particles, counter incrementing
 * Duration: 15 seconds (450 frames at 30fps)
 */
export function ClickerGameplay() {
  const frame = useCurrentFrame();

  // Generate click particles throughout the video
  const particles = generateParticles(
    30, // 30 clicks over 15 seconds
    15, // every 15 frames (0.5 seconds)
    960, // center X
    600, // center Y (where the character is)
    200, // spread X
    100, // spread Y
    1 // amount per click
  );

  // Counter goes from 0 to roughly 30 based on clicks
  const clickCount = Math.floor(frame / 15);
  const totalPushups = Math.min(clickCount, 30);

  // Simulate "scale bounce" on click
  const lastClickFrame = Math.floor(frame / 15) * 15;
  const timeSinceClick = frame - lastClickFrame;
  const clickScale = interpolate(
    timeSinceClick,
    [0, 3, 15],
    [0.95, 1.02, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.dim,
          }}
        >
          Click to Earn
        </p>
      </div>

      {/* Push-up counter */}
      <div
        style={{
          position: "absolute",
          top: 160,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: colors.white,
            tabularNums: true,
          }}
        >
          <CountUp
            from={0}
            to={totalPushups}
            startFrame={0}
            durationFrames={frame}
            decimals={0}
          />
        </p>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 16,
          }}
        >
          Push-ups
        </p>
      </div>

      {/* Clicker area representation */}
      <div
        style={{
          position: "relative",
          width: 500,
          height: 400,
          marginTop: 100,
          transform: `scale(${clickScale})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Placeholder for character */}
        <div
          style={{
            width: 400,
            height: 300,
            backgroundColor: colors.border,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: `1px solid ${colors.border}`,
          }}
        >
          <p
            style={{
              fontSize: 80,
              opacity: 0.3,
            }}
          >
            💪
          </p>
        </div>

        {/* Click particles */}
        <ParticleEffect particles={particles} durationFrames={20} />
      </div>

      {/* Stats row */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          display: "flex",
          gap: 80,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: colors.white }}>1</p>
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.dim,
            }}
          >
            per click
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: colors.positive }}>
            <CountUp
              from={0}
              to={2}
              startFrame={200}
              durationFrames={30}
              decimals={0}
            />
          </p>
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.dim,
            }}
          >
            per second
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}
