import { interpolate, useCurrentFrame, Easing } from "remotion";
import { formatMultiplier, formatCompactNumber, formatCurrency } from "../utils/formatters";

interface AnimatedNumberProps {
  from: number;
  to: number;
  startFrame?: number;
  durationFrames: number;
  format?: "multiplier" | "compact" | "currency" | "raw";
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}

export function AnimatedNumber({
  from,
  to,
  startFrame = 0,
  durationFrames,
  format = "raw",
  prefix = "",
  suffix = "",
  style,
}: AnimatedNumberProps) {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const formatValue = (num: number): string => {
    switch (format) {
      case "multiplier":
        return formatMultiplier(num);
      case "compact":
        return formatCompactNumber(num);
      case "currency":
        return formatCurrency(num);
      default:
        return num >= 100 ? Math.round(num).toLocaleString() : num.toFixed(1);
    }
  };

  return (
    <span style={style}>
      {prefix}
      {formatValue(value)}
      {suffix}
    </span>
  );
}
