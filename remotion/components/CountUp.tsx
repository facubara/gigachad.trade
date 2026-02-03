import { interpolate, useCurrentFrame, Easing } from "remotion";

interface CountUpProps {
  from: number;
  to: number;
  startFrame?: number;
  durationFrames: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
  easing?: (t: number) => number;
}

export function CountUp({
  from,
  to,
  startFrame = 0,
  durationFrames,
  decimals = 0,
  prefix = "",
  suffix = "",
  style,
  easing = Easing.out(Easing.cubic),
}: CountUpProps) {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    }
  );

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
