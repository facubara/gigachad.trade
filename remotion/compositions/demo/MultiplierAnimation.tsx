import { AbsoluteFill, interpolate, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { Logo } from "../../components/Logo";

/**
 * Demo 1: MultiplierAnimation
 * Hero multiplier animating from x1 to x33 with spring physics
 * Duration: 10 seconds (300 frames at 30fps)
 */
export function MultiplierAnimation() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for the multiplier
  const springValue = spring({
    frame: frame - 30, // Start after logo animation
    fps,
    config: {
      stiffness: 50,
      damping: 20,
    },
  });

  const multiplier = interpolate(springValue, [0, 1], [1, 33]);

  // Format multiplier display
  const displayValue = multiplier >= 100 ? multiplier.toFixed(0) : multiplier.toFixed(1);

  // Pulse effect when reaching final value
  const pulseScale =
    frame > 200
      ? interpolate(frame % 30, [0, 15, 30], [1, 1.02, 1])
      : 1;

  // Glow intensity increases as multiplier grows
  const glowIntensity = interpolate(multiplier, [1, 33], [5, 30], {
    extrapolateRight: "clamp",
  });

  // Background subtle animation
  const bgOpacity = interpolate(frame, [0, 150, 300], [0.8, 1, 0.8]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          opacity: bgOpacity,
        }}
      />

      {/* Logo at top */}
      <div style={{ position: "absolute", top: 60 }}>
        <Logo size="medium" animate startFrame={0} />
      </div>

      {/* Main multiplier display */}
      <div
        style={{
          textAlign: "center",
          transform: `scale(${pulseScale})`,
        }}
      >
        <p
          style={{
            fontSize: 200,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: colors.white,
            textShadow: `
              0 0 ${glowIntensity}px ${colors.white},
              0 0 ${glowIntensity * 2}px rgba(255,255,255,0.5)
            `,
          }}
        >
          x{displayValue}
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 40,
            opacity: interpolate(frame, [60, 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Multiplier to $1 Billion
        </p>
      </div>

      {/* Bottom tagline */}
      <p
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 12,
          letterSpacing: "0.15em",
          color: colors.dim,
          textTransform: "uppercase",
          opacity: interpolate(frame, [150, 180], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        gigachad.trade
      </p>
    </AbsoluteFill>
  );
}
