import { AbsoluteFill, interpolate, useCurrentFrame, Sequence, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { GlowText } from "../../components/GlowText";

/**
 * Launch 8: PerkShowcase
 * All 8 perks showcased vertically with effects
 * Duration: 25 seconds (750 frames at 30fps)
 * Format: 9:16 (vertical)
 */

const multiplierPerks = [
  { id: "protein", name: "Protein Shake", emoji: "🥤", effect: "+1 per click" },
  { id: "gloves", name: "Gym Gloves", emoji: "🧤", effect: "+2 per click" },
  { id: "belt", name: "Weight Belt", emoji: "🏋️", effect: "+5 per click" },
  { id: "creatine", name: "Creatine", emoji: "💊", effect: "+10 per click" },
];

const autoPerks = [
  { id: "coach", name: "Personal Coach", emoji: "👨‍🏫", effect: "+1 per second" },
  { id: "gym", name: "Home Gym", emoji: "🏠", effect: "+2 per second" },
  { id: "robot", name: "Robot Trainer", emoji: "🤖", effect: "+5 per second" },
  { id: "clone", name: "Chad Clone", emoji: "👥", effect: "+10 per second" },
];

export function PerkShowcase() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
      }}
    >
      {/* Intro (0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 18,
                color: colors.dim,
                letterSpacing: "0.2em",
                marginBottom: 20,
                opacity: interpolate(frame, [0, 30], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              CLICKER GAME
            </p>
            <GlowText
              intensity={25}
              style={{
                fontSize: 56,
                fontWeight: 700,
                display: "block",
                transform: `scale(${interpolate(frame, [30, 60], [0.5, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(2)),
                })})`,
              }}
            >
              UPGRADE
              <br />
              YOUR
              <br />
              PERKS
            </GlowText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Multiplier perks (90-390) */}
      <Sequence from={90} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 40 }}>
          <p
            style={{
              fontSize: 14,
              color: colors.purple,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 30,
              opacity: interpolate(frame, [90, 120], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Multipliers
          </p>

          {multiplierPerks.map((perk, i) => {
            const perkDelay = 120 + i * 60;
            const isVisible = frame >= perkDelay;

            return (
              <div
                key={perk.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "24px 0",
                  borderBottom: `1px solid ${colors.border}`,
                  opacity: interpolate(frame, [perkDelay, perkDelay + 30], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `translateX(${interpolate(
                    frame,
                    [perkDelay, perkDelay + 30],
                    [-100, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
                  )}px)`,
                }}
              >
                <span style={{ fontSize: 50 }}>{perk.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: colors.white }}>
                    {perk.name}
                  </p>
                  <p style={{ fontSize: 14, color: colors.positive, marginTop: 4 }}>
                    {perk.effect}
                  </p>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Auto perks (390-690) */}
      <Sequence from={390} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 40 }}>
          <p
            style={{
              fontSize: 14,
              color: colors.positive,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 30,
              opacity: interpolate(frame, [390, 420], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Auto-Pushups
          </p>

          {autoPerks.map((perk, i) => {
            const perkDelay = 420 + i * 60;

            return (
              <div
                key={perk.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "24px 0",
                  borderBottom: `1px solid ${colors.border}`,
                  opacity: interpolate(frame, [perkDelay, perkDelay + 30], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `translateX(${interpolate(
                    frame,
                    [perkDelay, perkDelay + 30],
                    [100, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
                  )}px)`,
                }}
              >
                <span style={{ fontSize: 50 }}>{perk.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: colors.white }}>
                    {perk.name}
                  </p>
                  <p style={{ fontSize: 14, color: colors.positive, marginTop: 4 }}>
                    {perk.effect}
                  </p>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* CTA (690-750) */}
      <Sequence from={690} durationInFrames={60}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
            background: `radial-gradient(circle at center, ${colors.bgSecondary} 0%, ${colors.bg} 70%)`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GlowText
              intensity={25}
              style={{
                fontSize: 40,
                fontWeight: 700,
                display: "block",
                marginBottom: 30,
              }}
            >
              UPGRADE
              <br />
              NOW
            </GlowText>

            <div
              style={{
                backgroundColor: colors.white,
                color: colors.black,
                padding: "16px 40px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.1em",
                opacity: interpolate(frame, [710, 730], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              GIGACHAD.TRADE/GAME
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
