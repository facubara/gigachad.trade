import { interpolate, useCurrentFrame, Easing, random } from "remotion";
import { colors } from "../styles/colors";

interface Particle {
  id: number;
  x: number;
  y: number;
  amount: number;
  startFrame: number;
}

interface ParticleEffectProps {
  particles: Particle[];
  durationFrames?: number;
}

export function ParticleEffect({ particles, durationFrames = 18 }: ParticleEffectProps) {
  const frame = useCurrentFrame();

  return (
    <>
      {particles.map((particle) => {
        const particleProgress = frame - particle.startFrame;
        if (particleProgress < 0 || particleProgress > durationFrames) return null;

        const opacity = interpolate(
          particleProgress,
          [0, durationFrames * 0.3, durationFrames],
          [0, 1, 0],
          { extrapolateRight: "clamp" }
        );

        const scale = interpolate(
          particleProgress,
          [0, durationFrames],
          [0.5, 1.5],
          {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        const yOffset = interpolate(
          particleProgress,
          [0, durationFrames],
          [0, -80],
          {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        // Slight horizontal drift
        const drift = random(`drift-${particle.id}`) * 40 - 20;
        const xOffset = interpolate(
          particleProgress,
          [0, durationFrames],
          [0, drift],
          { extrapolateRight: "clamp" }
        );

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: particle.x + xOffset,
              top: particle.y + yOffset,
              opacity,
              transform: `scale(${scale})`,
              fontSize: 24,
              fontWeight: 700,
              color: colors.white,
              textShadow: "0 0 10px rgba(0,0,0,0.8)",
              pointerEvents: "none",
            }}
          >
            +{particle.amount}
          </div>
        );
      })}
    </>
  );
}

// Helper to generate particles at intervals
export function generateParticles(
  count: number,
  intervalFrames: number,
  centerX: number,
  centerY: number,
  spreadX: number = 100,
  spreadY: number = 50,
  amountBase: number = 1
): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: centerX + (random(`x-${i}`) * spreadX - spreadX / 2),
    y: centerY + (random(`y-${i}`) * spreadY - spreadY / 2),
    amount: amountBase,
    startFrame: i * intervalFrames,
  }));
}
