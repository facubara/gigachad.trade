import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../styles/colors";

interface GlowTextProps {
  children: React.ReactNode;
  color?: string;
  glowColor?: string;
  intensity?: number;
  pulseSpeed?: number;
  style?: React.CSSProperties;
}

export function GlowText({
  children,
  color = colors.white,
  glowColor,
  intensity = 20,
  pulseSpeed = 60, // frames per pulse cycle
  style,
}: GlowTextProps) {
  const frame = useCurrentFrame();

  const pulseProgress = (frame % pulseSpeed) / pulseSpeed;
  const glowIntensity = interpolate(
    pulseProgress,
    [0, 0.5, 1],
    [intensity * 0.6, intensity, intensity * 0.6]
  );

  const effectiveGlowColor = glowColor || color;

  return (
    <span
      style={{
        color,
        textShadow: `
          0 0 ${glowIntensity}px ${effectiveGlowColor},
          0 0 ${glowIntensity * 2}px ${effectiveGlowColor},
          0 0 ${glowIntensity * 3}px ${effectiveGlowColor}
        `,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
