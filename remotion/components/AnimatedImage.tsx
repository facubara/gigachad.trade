import { interpolate, useCurrentFrame, Easing, Img, staticFile } from "remotion";

interface AnimatedImageProps {
  src: string;
  scale?: [number, number];
  translateX?: [number, number];
  translateY?: [number, number];
  opacity?: [number, number];
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  style?: React.CSSProperties;
}

export function AnimatedImage({
  src,
  scale = [1, 1.04],
  translateX = [0, 0],
  translateY = [0, 0],
  opacity = [0, 1],
  objectPosition = "center center",
  objectFit = "cover",
  style,
}: AnimatedImageProps) {
  const frame = useCurrentFrame();

  const currentScale = interpolate(frame, [0, 90], scale, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const currentTranslateX = interpolate(frame, [0, 90], translateX, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const currentTranslateY = interpolate(frame, [0, 90], translateY, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const currentOpacity = interpolate(frame, [0, 12], opacity, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: currentOpacity,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition,
          transform: `scale(${currentScale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`,
        }}
      />
    </div>
  );
}
