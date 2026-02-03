import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../styles/colors";

interface LogoProps {
  size?: "small" | "medium" | "large";
  animate?: boolean;
  startFrame?: number;
  style?: React.CSSProperties;
}

const sizes = {
  small: { fontSize: 24, spacing: "0.15em" },
  medium: { fontSize: 48, spacing: "0.12em" },
  large: { fontSize: 80, spacing: "0.1em" },
};

export function Logo({ size = "medium", animate = true, startFrame = 0, style }: LogoProps) {
  const frame = useCurrentFrame();
  const config = sizes[size];

  const opacity = animate
    ? interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 1;

  const scale = animate
    ? interpolate(frame, [startFrame, startFrame + 20], [0.8, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.5)),
      })
    : 1;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: config.fontSize,
          fontWeight: 700,
          letterSpacing: config.spacing,
          color: colors.white,
          textTransform: "uppercase",
        }}
      >
        GIGACHAD
      </span>
    </div>
  );
}
