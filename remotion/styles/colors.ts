/**
 * Design tokens from globals.css for Remotion videos
 * Terminal Clean design - monochromatic, minimal, data-focused
 */

export const colors = {
  // Core colors
  black: "#000000",
  white: "#FFFFFF",
  steel: "#0A0A0A",
  border: "#1A1A1A",
  muted: "#AAAAAA",
  dim: "#888888",

  // Semantic colors
  bg: "#0A0A0A",
  bgSecondary: "#111111",
  bgCard: "#0A0A0A",
  text: "#FFFFFF",
  accent: "#FFFFFF",
  accentHover: "#CCCCCC",

  // Status colors
  positive: "#4ADE80",
  negative: "#F87171",
  purple: "#A78BFA",
} as const;

export const fonts = {
  mono: "'JetBrains Mono', monospace",
  body: "'Inter', sans-serif",
} as const;

// For inline styles in Remotion
export const baseStyles = {
  background: colors.bg,
  color: colors.text,
  fontFamily: fonts.mono,
} as const;
