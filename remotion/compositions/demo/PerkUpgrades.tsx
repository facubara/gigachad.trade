import { AbsoluteFill, interpolate, useCurrentFrame, Easing, Sequence } from "remotion";
import { colors, fonts } from "../../styles/colors";
import { CountUp } from "../../components/CountUp";

/**
 * Demo 6: PerkUpgrades
 * Purchasing perks, level badges incrementing, costs updating
 * Duration: 12 seconds (360 frames at 30fps)
 */

const perks = [
  { id: "protein", name: "Protein Shake", emoji: "🥤", baseCost: 100, multiplier: 2 },
  { id: "gloves", name: "Gym Gloves", emoji: "🧤", baseCost: 500, multiplier: 3 },
  { id: "belt", name: "Weight Belt", emoji: "🏋️", baseCost: 2500, multiplier: 4 },
  { id: "trainer", name: "Personal Trainer", emoji: "👨‍🏫", baseCost: 10000, multiplier: 5 },
];

export function PerkUpgrades() {
  const frame = useCurrentFrame();

  // Purchase events at specific frames
  const purchases = [
    { frame: 60, perkIndex: 0 },
    { frame: 120, perkIndex: 0 },
    { frame: 180, perkIndex: 1 },
    { frame: 240, perkIndex: 0 },
    { frame: 300, perkIndex: 2 },
  ];

  // Calculate current levels based on purchases
  const getLevelAtFrame = (perkIndex: number, currentFrame: number) => {
    return purchases.filter(
      (p) => p.perkIndex === perkIndex && p.frame <= currentFrame
    ).length;
  };

  // Balance animation
  const startBalance = 50000;
  const spentAmounts = purchases
    .filter((p) => p.frame <= frame)
    .map((p, i) => {
      const perk = perks[p.perkIndex];
      const levelBefore = purchases
        .slice(0, purchases.indexOf(p))
        .filter((pp) => pp.perkIndex === p.perkIndex).length;
      return perk.baseCost * Math.pow(perk.multiplier, levelBefore);
    });
  const totalSpent = spentAmounts.reduce((a, b) => a + b, 0);
  const currentBalance = startBalance - totalSpent;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: fonts.mono,
        padding: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 60,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 8,
            }}
          >
            Clicker Game
          </p>
          <p
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: colors.white,
            }}
          >
            Upgrade Perks
          </p>
        </div>

        {/* Balance display */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: colors.dim,
              marginBottom: 4,
            }}
          >
            Your Push-ups
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.white,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Math.max(0, Math.round(currentBalance)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Perks grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          backgroundColor: colors.border,
        }}
      >
        {perks.map((perk, index) => {
          const level = getLevelAtFrame(index, frame);
          const cost = perk.baseCost * Math.pow(perk.multiplier, level);

          // Check if this perk was just purchased
          const recentPurchase = purchases.find(
            (p) => p.perkIndex === index && frame >= p.frame && frame < p.frame + 20
          );
          const purchaseScale = recentPurchase
            ? interpolate(
                frame - recentPurchase.frame,
                [0, 5, 20],
                [1, 1.1, 1],
                { extrapolateRight: "clamp" }
              )
            : 1;
          const purchaseGlow = recentPurchase
            ? interpolate(
                frame - recentPurchase.frame,
                [0, 10, 20],
                [20, 10, 0],
                { extrapolateRight: "clamp" }
              )
            : 0;

          return (
            <div
              key={perk.id}
              style={{
                backgroundColor: colors.bg,
                padding: 32,
                transform: `scale(${purchaseScale})`,
                boxShadow: purchaseGlow > 0
                  ? `0 0 ${purchaseGlow}px ${colors.purple}`
                  : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 40 }}>{perk.emoji}</span>
                {level > 0 && (
                  <div
                    style={{
                      backgroundColor: colors.purple,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Lv.{level}
                  </div>
                )}
              </div>

              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.white,
                  marginBottom: 8,
                }}
              >
                {perk.name}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: colors.dim,
                  }}
                >
                  Cost
                </p>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: currentBalance >= cost ? colors.white : colors.negative,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {cost.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: colors.white }}>
            {1 + getLevelAtFrame(0, frame) + getLevelAtFrame(1, frame) * 2}
          </p>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.dim,
            }}
          >
            per click
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: colors.positive }}>
            {getLevelAtFrame(2, frame) + getLevelAtFrame(3, frame) * 5}
          </p>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: colors.dim,
            }}
          >
            per second
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}
