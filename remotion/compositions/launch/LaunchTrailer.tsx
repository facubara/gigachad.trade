import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  Easing,
} from "remotion";

/**
 * LaunchTrailer - Minimalist launch trailer for gigachad.trade
 *
 * Duration: 25 seconds (750 frames at 30fps)
 * Format: 16:9 (1920x1080)
 * Style: Black background, white/grey type only. No images. No slop.
 */

const FONT = "'JetBrains Mono', monospace";
const FONT_SANS = "'Inter', sans-serif";

const C = {
  black: "#000000",
  dark: "#0A0A0A",
  border: "#1A1A1A",
  dim: "#555555",
  muted: "#888888",
  grey: "#AAAAAA",
  light: "#CCCCCC",
  white: "#FFFFFF",
} as const;

const FPS = 30;

// Scene timings (in seconds, converted to frames)
const SCENES = {
  blank:      { from: 0,            dur: 1.5 * FPS },     // 0–45: black
  question:   { from: 1.5 * FPS,    dur: 3 * FPS },       // 45–135
  answer:     { from: 4.5 * FPS,    dur: 2.5 * FPS },     // 135–210
  features:   { from: 7 * FPS,      dur: 6 * FPS },       // 210–390
  milestones: { from: 13 * FPS,     dur: 4.5 * FPS },     // 390–525
  numbers:    { from: 17.5 * FPS,   dur: 3 * FPS },       // 525–615
  lockup:     { from: 20.5 * FPS,   dur: 4.5 * FPS },     // 615–750
} as const;

export function LaunchTrailer() {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <NoiseOverlay />

      <Sequence from={SCENES.blank.from} durationInFrames={SCENES.blank.dur} premountFor={FPS}>
        <SceneBlank />
      </Sequence>

      <Sequence from={SCENES.question.from} durationInFrames={SCENES.question.dur} premountFor={FPS}>
        <SceneQuestion />
      </Sequence>

      <Sequence from={SCENES.answer.from} durationInFrames={SCENES.answer.dur} premountFor={FPS}>
        <SceneAnswer />
      </Sequence>

      <Sequence from={SCENES.features.from} durationInFrames={SCENES.features.dur} premountFor={FPS}>
        <SceneFeatures />
      </Sequence>

      <Sequence from={SCENES.milestones.from} durationInFrames={SCENES.milestones.dur} premountFor={FPS}>
        <SceneMilestones />
      </Sequence>

      <Sequence from={SCENES.numbers.from} durationInFrames={SCENES.numbers.dur} premountFor={FPS}>
        <SceneNumbers />
      </Sequence>

      <Sequence from={SCENES.lockup.from} durationInFrames={SCENES.lockup.dur} premountFor={FPS}>
        <SceneLockup />
      </Sequence>
    </AbsoluteFill>
  );
}

// ============ SCENE 1: BLANK WITH CURSOR ============
function SceneBlank() {
  const frame = useCurrentFrame();

  // Blinking cursor
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  const cursorOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 2,
          height: 28,
          backgroundColor: C.muted,
          opacity: cursorVisible ? cursorOpacity : 0,
        }}
      />
    </AbsoluteFill>
  );
}

// ============ SCENE 2: THE QUESTION ============
function SceneQuestion() {
  const frame = useCurrentFrame();

  const lineOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [8, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [8, 25], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Thin line above */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60px)",
          width: 60,
          height: 1,
          backgroundColor: C.border,
          opacity: lineOpacity,
        }}
      />

      <p
        style={{
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.25em",
          color: C.muted,
          textTransform: "uppercase",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          margin: 0,
        }}
      >
        WHERE ARE WE GOING
      </p>
    </AbsoluteFill>
  );
}

// ============ SCENE 3: THE ANSWER ============
function SceneAnswer() {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textScale = interpolate(frame, [0, 15], [0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out
  const fadeOut = interpolate(frame, [55, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <p
        style={{
          fontSize: 80,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: C.white,
          fontFamily: FONT_SANS,
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          margin: 0,
        }}
      >
        $1B
      </p>
    </AbsoluteFill>
  );
}

// ============ SCENE 4: FEATURES ============
function SceneFeatures() {
  const frame = useCurrentFrame();

  const features = [
    { label: "DASHBOARD", desc: "REAL-TIME MARKET DATA" },
    { label: "CALCULATOR", desc: "KNOW YOUR UPSIDE" },
    { label: "CLICKER", desc: "EARN YOUR RANK" },
    { label: "LEADERBOARD", desc: "PROVE IT" },
  ];

  // Grid line
  const gridLineWidth = interpolate(frame, [0, 20], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.dark,
        padding: "0 160px",
        justifyContent: "center",
      }}
    >
      {/* Horizontal divider at top */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 160,
          right: 160,
          height: 1,
          backgroundColor: C.border,
          transform: `scaleX(${gridLineWidth / 100})`,
          transformOrigin: "left",
        }}
      />

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 160,
          opacity: interpolate(frame, [5, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: C.dim,
            textTransform: "uppercase",
          }}
        >
          THE TOOLKIT
        </span>
      </div>

      {/* Feature list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 40 }}>
        {features.map((feature, i) => {
          const enterDelay = 15 + i * 18;

          const itemOpacity = interpolate(frame, [enterDelay, enterDelay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const itemX = interpolate(frame, [enterDelay, enterDelay + 12], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={feature.label}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                padding: "28px 0",
                borderBottom: `1px solid ${C.border}`,
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: C.white,
                  fontFamily: FONT_SANS,
                }}
              >
                {feature.label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  color: C.muted,
                }}
              >
                {feature.desc}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ============ SCENE 5: MILESTONES ============
function SceneMilestones() {
  const frame = useCurrentFrame();

  const milestones = [
    { value: "$10M", label: "WARMING UP", pct: 10 },
    { value: "$100M", label: "CHAD MODE", pct: 40 },
    { value: "$500M", label: "FINAL FORM", pct: 70 },
    { value: "$1B", label: "ASCENDED", pct: 100 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        padding: "0 200px",
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 60,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: C.dim,
            textTransform: "uppercase",
          }}
        >
          THE PATH
        </span>
      </div>

      {/* Progress track */}
      <div style={{ position: "relative", height: 2, backgroundColor: C.border, marginBottom: 50 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 2,
            backgroundColor: C.muted,
            width: `${interpolate(frame, [15, 100], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            })}%`,
          }}
        />

        {/* Milestone markers */}
        {milestones.map((m, i) => {
          const markerDelay = 15 + (i / milestones.length) * 85;
          const markerOpacity = interpolate(frame, [markerDelay, markerDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={m.label}
              style={{
                position: "absolute",
                left: `${m.pct}%`,
                top: -4,
                transform: "translateX(-50%)",
                opacity: markerOpacity,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: i === milestones.length - 1 ? C.white : C.muted,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Milestone labels */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {milestones.map((m, i) => {
          const labelDelay = 25 + i * 20;
          const labelOpacity = interpolate(frame, [labelDelay, labelDelay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={m.label}
              style={{
                textAlign: i === milestones.length - 1 ? "right" : i === 0 ? "left" : "center",
                opacity: labelOpacity,
                flex: 1,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: i === milestones.length - 1 ? C.white : C.light,
                  display: "block",
                  marginBottom: 8,
                  fontFamily: FONT_SANS,
                }}
              >
                {m.value}
              </span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: C.dim,
                }}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ============ SCENE 6: NUMBERS ============
function SceneNumbers() {
  const frame = useCurrentFrame();

  const multiplier = interpolate(frame, [10, 60], [1, 33], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const numOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: C.dim,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 24,
            opacity: labelOpacity,
          }}
        >
          CURRENT MULTIPLIER TO TARGET
        </span>

        <span
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: C.white,
            fontFamily: FONT_SANS,
            opacity: numOpacity,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {multiplier < 10 ? multiplier.toFixed(1) : Math.round(multiplier)}x
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ============ SCENE 7: FINAL LOCKUP ============
function SceneLockup() {
  const frame = useCurrentFrame();

  // Horizontal line expands
  const lineWidth = interpolate(frame, [10, 35], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const lineOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo text
  const logoOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoY = interpolate(frame, [25, 45], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtext
  const subOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL
  const urlOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Center line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -80px)",
          width: lineWidth,
          height: 1,
          backgroundColor: C.border,
          opacity: lineOpacity,
        }}
      />

      {/* Wordmark */}
      <p
        style={{
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: C.white,
          textTransform: "uppercase",
          fontFamily: FONT_SANS,
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          margin: 0,
        }}
      >
        GIGACHAD
      </p>

      {/* Tagline */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.35em",
          color: C.dim,
          textTransform: "uppercase",
          opacity: subOpacity,
          margin: 0,
          marginTop: 20,
        }}
      >
        THE PATH TO $1B MARKET CAP
      </p>

      {/* URL */}
      <p
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 14,
          letterSpacing: "0.2em",
          color: C.muted,
          opacity: urlOpacity,
          margin: 0,
        }}
      >
        GIGACHAD.TRADE
      </p>
    </AbsoluteFill>
  );
}

// ============ NOISE OVERLAY ============
function NoiseOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: "none" as const,
        mixBlendMode: "overlay" as const,
        zIndex: 100,
      }}
    />
  );
}
