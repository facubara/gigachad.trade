import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { AnimatedImage } from "../../components/AnimatedImage";
import { FadeInText } from "../../components/FadeInText";

/**
 * ProductTrailer - Silent Product Launch Trailer
 *
 * Duration: 16.5 seconds (495 frames at 30fps)
 * Format: 16:9 (1920x1080)
 * No audio. Static images only. Restrained, confident motion.
 */

const FPS = 30;

const CUTS = {
  hook:        { from: 0,           duration: 2 * FPS },      // 0–60
  gameLoop:    { from: 2 * FPS,     duration: 4.5 * FPS },    // 60–195
  leaderboard: { from: 6.5 * FPS,   duration: 3.5 * FPS },   // 195–300
  calculator:  { from: 10 * FPS,    duration: 4 * FPS },      // 300–420
  close:       { from: 14 * FPS,    duration: 2.5 * FPS },    // 420–495
} as const;

export function ProductTrailer() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <GrainOverlay />

      <Sequence from={CUTS.hook.from} durationInFrames={CUTS.hook.duration}>
        <CutHook />
      </Sequence>

      <Sequence from={CUTS.gameLoop.from} durationInFrames={CUTS.gameLoop.duration}>
        <CutGameLoop />
      </Sequence>

      <Sequence from={CUTS.leaderboard.from} durationInFrames={CUTS.leaderboard.duration}>
        <CutLeaderboard />
      </Sequence>

      <Sequence from={CUTS.calculator.from} durationInFrames={CUTS.calculator.duration}>
        <CutCalculator />
      </Sequence>

      <Sequence from={CUTS.close.from} durationInFrames={CUTS.close.duration}>
        <CutClose />
      </Sequence>
    </AbsoluteFill>
  );
}

// ============ CUT 1: HOOK (0.0s → 2.0s) ============
function CutHook() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AnimatedImage
        src="assets/gigachad_trade_01.png"
        scale={[1, 1.04]}
        objectFit="cover"
        objectPosition="center 15%"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FadeInText
          delay={8}
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "0.14em",
          }}
        >
          TRACK THE CLIMB
        </FadeInText>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 2: GAME LOOP (2.0s → 6.5s) ============
function CutGameLoop() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AnimatedImage
        src="assets/gigachad_trade_02.png"
        scale={[1, 1.04]}
        objectFit="contain"
        objectPosition="center center"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FadeInText
          delay={20}
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "0.14em",
          }}
        >
          EVERY CLICK COUNTS
        </FadeInText>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 5: LEADERBOARD (14.0s → 17.5s) ============
function CutLeaderboard() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AnimatedImage
        src="assets/gigachad_trade_03.png"
        scale={[1, 1.03]}
        translateY={[0, -25]}
        objectFit="contain"
        objectPosition="center 20%"
      />

      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeInText
          delay={10}
          style={{
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "0.14em",
          }}
        >
          COMPETE. CLIMB.
        </FadeInText>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 6: CALCULATOR (17.5s → 21.5s) ============
function CutCalculator() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AnimatedImage
        src="assets/gigachad_trade_05.png"
        scale={[1, 1.04]}
        objectFit="contain"
        objectPosition="center center"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FadeInText
          delay={15}
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "0.14em",
          }}
        >
          KNOW YOUR UPSIDE
        </FadeInText>
      </div>
    </AbsoluteFill>
  );
}

// ============ CUT 7: CLOSE (21.5s → 24.0s) ============
function CutClose() {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoY = interpolate(frame, [10, 30], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subtextOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtextY = interpolate(frame, [35, 55], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <p
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "#FFFFFF",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
            margin: 0,
          }}
        >
          GIGACHAD.TRADE
        </p>

        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: "#888888",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            opacity: subtextOpacity,
            transform: `translateY(${subtextY}px)`,
            margin: 0,
          }}
        >
          USE THE TOOL
        </p>
      </div>
    </AbsoluteFill>
  );
}

// ============ GRAIN OVERLAY ============
function GrainOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        mixBlendMode: "overlay",
        zIndex: 100,
      }}
    />
  );
}
