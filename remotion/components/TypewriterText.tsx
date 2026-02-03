import { interpolate, useCurrentFrame } from "remotion";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  showCursor?: boolean;
  cursorChar?: string;
  style?: React.CSSProperties;
}

export function TypewriterText({
  text,
  startFrame = 0,
  charsPerFrame = 0.5,
  showCursor = true,
  cursorChar = "_",
  style,
}: TypewriterTextProps) {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return showCursor ? <span style={style}>{cursorChar}</span> : null;
  }

  const charsToShow = Math.min(
    Math.floor(relativeFrame * charsPerFrame),
    text.length
  );

  const visibleText = text.slice(0, charsToShow);
  const isComplete = charsToShow >= text.length;

  // Cursor blinks after typing is complete
  const cursorOpacity = isComplete
    ? interpolate(frame % 30, [0, 15, 15.01, 30], [1, 1, 0, 0])
    : 1;

  return (
    <span style={style}>
      {visibleText}
      {showCursor && (
        <span style={{ opacity: cursorOpacity }}>{cursorChar}</span>
      )}
    </span>
  );
}
