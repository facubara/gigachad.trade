import { interpolate, useCurrentFrame, Easing } from "remotion";

interface FadeInTextProps {
  children: React.ReactNode;
  delay?: number;
  translateY?: number;
  style?: React.CSSProperties;
}

export function FadeInText({
  children,
  delay = 0,
  translateY = 8,
  style,
}: FadeInTextProps) {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(frame, [delay, delay + 15], [translateY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        textTransform: "uppercase" as const,
        color: "#FFFFFF",
        letterSpacing: "0.12em",
        textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0px 40px rgba(0,0,0,0.7)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
