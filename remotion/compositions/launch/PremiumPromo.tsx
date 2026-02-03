import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";

/**
 * PremiumPromo - Brutalist Product Video
 *
 * NOT a token advertisement.
 * A disciplined, high-status product promo for GIGACHAD.TRADE
 *
 * Duration: 30 seconds (900 frames at 30fps)
 * Format: 16:9
 */

// Brutalist color palette
const COLORS = {
  black: "#000000",
  nearBlack: "#0A0A0A",
  darkGrey: "#111111",
  steel: "#1A1A1A",
  midGrey: "#2A2A2A",
  lightSteel: "#888888",
  white: "#FFFFFF",
  offWhite: "#E5E5E5",
  // Very limited accent - only for active UI
  accent: "#3B82F6", // Electric blue, used sparingly
} as const;

// Industrial typography
const FONT = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

export function PremiumPromo() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      {/* Subtle digital grain texture overlay */}
      <NoiseOverlay opacity={0.03} />

      {/* CUT 1: Opening Ritual (0-90 frames / 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <OpeningRitual frame={frame} />
      </Sequence>

      {/* CUT 2: Dashboard Reveal (90-210 frames / 3-7s) */}
      <Sequence from={90} durationInFrames={120}>
        <DashboardReveal frame={frame - 90} />
      </Sequence>

      {/* CUT 3: The Path (210-360 frames / 7-12s) */}
      <Sequence from={210} durationInFrames={150}>
        <ThePath frame={frame - 210} />
      </Sequence>

      {/* CUT 4: Discipline & Consistency (360-510 frames / 12-17s) */}
      <Sequence from={360} durationInFrames={150}>
        <DisciplineConsistency frame={frame - 360} />
      </Sequence>

      {/* CUT 5: Community (510-660 frames / 17-22s) */}
      <Sequence from={510} durationInFrames={150}>
        <Community frame={frame - 510} />
      </Sequence>

      {/* CUT 6: Tool Identity (660-780 frames / 22-26s) */}
      <Sequence from={660} durationInFrames={120}>
        <ToolIdentity frame={frame - 660} />
      </Sequence>

      {/* CUT 7: Final Lockup (780-900 frames / 26-30s) */}
      <Sequence from={780} durationInFrames={120}>
        <FinalLockup frame={frame - 780} />
      </Sequence>
    </AbsoluteFill>
  );
}

// ============ CUT 1: OPENING RITUAL ============
function OpeningRitual({ frame }: { frame: number }) {
  // Thin horizontal line fades in
  const lineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [30, 60], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Grid appears subtly
  const gridOpacity = interpolate(frame, [40, 70], [0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text fades in
  const textOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
      }}
    >
      {/* Minimal grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(${COLORS.steel} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.steel} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Thin horizontal line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: lineWidth,
          height: 1,
          backgroundColor: COLORS.lightSteel,
          opacity: lineOpacity,
        }}
      />

      {/* Opening text */}
      <p
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% + 40px))",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.3em",
          color: COLORS.lightSteel,
          textTransform: "uppercase",
          opacity: textOpacity,
        }}
      >
        EVERY CHAD STARTS SOMEWHERE
      </p>
    </AbsoluteFill>
  );
}

// ============ CUT 2: DASHBOARD REVEAL ============
function DashboardReveal({ frame }: { frame: number }) {
  // Hard cut entrance
  const containerOpacity = frame < 3 ? interpolate(frame, [0, 3], [0, 1]) : 1;

  // Progress bar animation - deliberate, weighted
  const progressWidth = interpolate(frame, [20, 80], [0, 33], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Market cap number
  const marketCap = interpolate(frame, [20, 80], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Text lines appear sequentially
  const line1Opacity = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Opacity = interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.nearBlack,
        padding: 100,
        opacity: containerOpacity,
      }}
    >
      {/* Dashboard frame */}
      <div
        style={{
          border: `1px solid ${COLORS.steel}`,
          padding: 60,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Progress section */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: COLORS.lightSteel, textTransform: "uppercase" }}>
              PROGRESS TO TARGET
            </span>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: COLORS.offWhite }}>
              {progressWidth.toFixed(1)}%
            </span>
          </div>

          {/* Progress bar track */}
          <div
            style={{
              height: 4,
              backgroundColor: COLORS.steel,
              position: "relative",
            }}
          >
            {/* Progress bar fill */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: 4,
                width: `${progressWidth}%`,
                backgroundColor: COLORS.offWhite,
              }}
            />
          </div>
        </div>

        {/* Market cap display */}
        <div style={{ marginBottom: 80 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", color: COLORS.lightSteel, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
            MARKET CAP
          </span>
          <span style={{ fontSize: 64, fontWeight: 700, color: COLORS.white, letterSpacing: "-0.02em" }}>
            ${marketCap.toFixed(1)}M
          </span>
        </div>

        {/* Overlay text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.15em", color: COLORS.offWhite, textTransform: "uppercase", opacity: line1Opacity }}>
            TRACK THE JOURNEY
          </p>
          <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.15em", color: COLORS.lightSteel, textTransform: "uppercase", opacity: line2Opacity }}>
            NO NOISE
          </p>
          <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.15em", color: COLORS.lightSteel, textTransform: "uppercase", opacity: line3Opacity }}>
            JUST PROGRESS
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 3: THE PATH ============
function ThePath({ frame }: { frame: number }) {
  const states = [
    { label: "WARMING UP", value: "$10M" },
    { label: "CHAD MODE", value: "$100M" },
    { label: "FINAL FORM", value: "$500M" },
    { label: "ASCENDED", value: "$1B" },
  ];

  // Each state locks in sequentially
  const getStateStatus = (index: number) => {
    const lockFrame = 20 + index * 30;
    const isLocked = frame >= lockFrame;
    const isActive = frame >= lockFrame && frame < lockFrame + 30;

    const opacity = interpolate(frame, [lockFrame - 10, lockFrame], [0.3, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return { isLocked, isActive, opacity };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.nearBlack,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div style={{ width: "100%", maxWidth: 800 }}>
        {states.map((state, i) => {
          const { isLocked, isActive, opacity } = getStateStatus(i);

          return (
            <div
              key={state.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 32px",
                marginBottom: 8,
                backgroundColor: isActive ? COLORS.darkGrey : "transparent",
                border: `1px solid ${isLocked ? COLORS.midGrey : COLORS.steel}`,
                opacity,
                transition: "all 0.3s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Status indicator */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: isActive ? COLORS.accent : isLocked ? COLORS.offWhite : COLORS.steel,
                    boxShadow: isActive ? `0 0 12px ${COLORS.accent}` : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: isLocked ? COLORS.offWhite : COLORS.lightSteel,
                    textTransform: "uppercase",
                  }}
                >
                  {state.label}
                </span>
              </div>

              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: isLocked ? COLORS.white : COLORS.lightSteel,
                }}
              >
                {state.value}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 4: DISCIPLINE & CONSISTENCY ============
function DisciplineConsistency({ frame }: { frame: number }) {
  // Three UI detail close-ups with overlaid text
  const segments = [
    { text: "SHOW UP", startFrame: 0 },
    { text: "CHECK IN", startFrame: 50 },
    { text: "MOVE FORWARD", startFrame: 100 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.nearBlack }}>
      {segments.map((segment, i) => {
        const isVisible = frame >= segment.startFrame && frame < segment.startFrame + 50;
        if (!isVisible) return null;

        const localFrame = frame - segment.startFrame;
        const opacity = interpolate(localFrame, [0, 8, 42, 50], [0, 1, 1, 0], {
          extrapolateRight: "clamp",
        });

        return (
          <AbsoluteFill key={segment.text} style={{ opacity }}>
            <UIDetailPanel index={i} frame={localFrame} />

            {/* Overlay text */}
            <div
              style={{
                position: "absolute",
                bottom: 120,
                left: 100,
                right: 100,
              }}
            >
              <p
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: COLORS.white,
                  textTransform: "uppercase",
                }}
              >
                {segment.text}
              </p>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}

function UIDetailPanel({ index, frame }: { index: number; frame: number }) {
  // Different UI details for each segment
  if (index === 0) {
    // Progress bar filling
    const progress = interpolate(frame, [5, 40], [45, 78], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 150 }}>
        <div style={{ width: "100%", maxWidth: 900 }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, letterSpacing: "0.2em", color: COLORS.lightSteel }}>DAILY PROGRESS</span>
            <span style={{ fontSize: 12, color: COLORS.offWhite }}>{progress.toFixed(0)}%</span>
          </div>
          <div style={{ height: 6, backgroundColor: COLORS.steel }}>
            <div style={{ height: 6, width: `${progress}%`, backgroundColor: COLORS.offWhite }} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (index === 1) {
    // Metrics stabilizing
    const value = interpolate(frame, [5, 35], [29847562, 30125847], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 12, letterSpacing: "0.2em", color: COLORS.lightSteel, display: "block", marginBottom: 16 }}>
            MARKET CAP
          </span>
          <span style={{ fontSize: 72, fontWeight: 700, color: COLORS.white, fontVariantNumeric: "tabular-nums" }}>
            ${Math.round(value).toLocaleString()}
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  // Numeric motion
  const multiplier = interpolate(frame, [5, 40], [28.4, 33.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 12, letterSpacing: "0.2em", color: COLORS.lightSteel, display: "block", marginBottom: 16 }}>
          MULTIPLIER TO $1B
        </span>
        <span style={{ fontSize: 96, fontWeight: 700, color: COLORS.white }}>
          x{multiplier.toFixed(1)}
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 5: COMMUNITY ============
function Community({ frame }: { frame: number }) {
  // Abstract silhouettes - minimal presence
  const silhouetteOpacity = interpolate(frame, [10, 40], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text1Opacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Opacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Abstract silhouettes - simple vertical bars representing presence */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          display: "flex",
          gap: 40,
          opacity: silhouetteOpacity,
        }}
      >
        {[60, 80, 70, 90, 65, 85, 75].map((height, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: height,
              backgroundColor: COLORS.midGrey,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: COLORS.offWhite,
            textTransform: "uppercase",
            marginBottom: 16,
            opacity: text1Opacity,
          }}
        >
          NOT A CROWD
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: COLORS.white,
            textTransform: "uppercase",
            opacity: text2Opacity,
          }}
        >
          A MOVEMENT
        </p>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 6: TOOL IDENTITY ============
function ToolIdentity({ frame }: { frame: number }) {
  const dashboardOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const text1Opacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Opacity = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.nearBlack,
        padding: 100,
      }}
    >
      {/* Simplified dashboard view */}
      <div
        style={{
          border: `1px solid ${COLORS.steel}`,
          padding: 60,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: dashboardOpacity,
        }}
      >
        {/* Stable metrics */}
        <div style={{ display: "flex", gap: 120, marginBottom: 80 }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: COLORS.lightSteel, display: "block", marginBottom: 8 }}>PROGRESS</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: COLORS.white }}>33.2%</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: COLORS.lightSteel, display: "block", marginBottom: 8 }}>MULTIPLIER</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: COLORS.white }}>x33</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: COLORS.lightSteel, display: "block", marginBottom: 8 }}>STATUS</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: COLORS.white }}>CHAD MODE</span>
          </div>
        </div>

        {/* Identity text */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: COLORS.offWhite,
              textTransform: "uppercase",
              marginBottom: 16,
              opacity: text1Opacity,
            }}
          >
            THIS IS NOT A MEME
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: COLORS.white,
              textTransform: "uppercase",
              opacity: text2Opacity,
            }}
          >
            IT'S A SCOREBOARD
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 7: FINAL LOCKUP ============
function FinalLockup({ frame }: { frame: number }) {
  // Hard cut to black
  const logoOpacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Wordmark */}
      <p
        style={{
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: COLORS.white,
          textTransform: "uppercase",
          opacity: logoOpacity,
        }}
      >
        GIGACHAD.TRADE
      </p>

      {/* CTA */}
      <p
        style={{
          position: "absolute",
          bottom: 180,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.3em",
          color: COLORS.lightSteel,
          textTransform: "uppercase",
          opacity: ctaOpacity,
        }}
      >
        ENTER THE PATH
      </p>
    </AbsoluteFill>
  );
}

// ============ NOISE OVERLAY ============
function NoiseOverlay({ opacity }: { opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }}
    />
  );
}
