import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../../styles/colors";

/**
 * Demo 9: TransactionHistory
 * Table with BUY/SELL rows, sorting animation, pagination
 * Duration: 10 seconds (300 frames at 30fps)
 */

const transactions = [
  { type: "BUY", amount: 5_000_000, price: 0.000015, date: "Jan 15", hash: "4xK2..." },
  { type: "BUY", amount: 12_000_000, price: 0.000018, date: "Jan 20", hash: "7bM9..." },
  { type: "SELL", amount: 2_000_000, price: 0.000025, date: "Jan 28", hash: "9cP4..." },
  { type: "BUY", amount: 8_500_000, price: 0.000022, date: "Feb 03", hash: "2dQ7..." },
  { type: "BUY", amount: 3_200_000, price: 0.000030, date: "Feb 10", hash: "5eR1..." },
  { type: "SELL", amount: 1_500_000, price: 0.000035, date: "Feb 15", hash: "8fS3..." },
];

export function TransactionHistory() {
  const frame = useCurrentFrame();

  // Sort animation happens at frame 150
  const sortFrame = 150;
  const isSorting = frame >= sortFrame && frame < sortFrame + 30;
  const isSorted = frame >= sortFrame + 30;

  // Sort by date (most recent first) after sort animation
  const displayTransactions = isSorted
    ? [...transactions].reverse()
    : transactions;

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
          marginBottom: 40,
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
            Wallet Analysis
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.white,
            }}
          >
            Transaction History
          </p>
        </div>

        {/* Sort button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            backgroundColor: isSorting ? colors.purple : colors.steel,
            border: `1px solid ${isSorting ? colors.purple : colors.border}`,
            fontSize: 12,
            color: colors.white,
            transform: isSorting ? "scale(0.95)" : "scale(1)",
          }}
        >
          <span style={{ transform: isSorted ? "rotate(180deg)" : "rotate(0deg)" }}>↑</span>
          <span>Sort by Date</span>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: colors.border,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "100px 180px 150px 120px 100px",
            padding: "16px 24px",
            backgroundColor: colors.bgSecondary,
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Type
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Amount
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Price
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Date
          </p>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: colors.dim, textTransform: "uppercase" }}>
            Hash
          </p>
        </div>

        {/* Data rows */}
        {displayTransactions.map((tx, index) => {
          const rowDelay = 20 + index * 12;

          // Row entrance animation
          const slideIn = interpolate(
            frame,
            [rowDelay, rowDelay + 20],
            [50, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );
          const fadeIn = interpolate(
            frame,
            [rowDelay, rowDelay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Sorting shuffle effect
          const shuffleOffset = isSorting
            ? Math.sin((frame - sortFrame + index * 5) * 0.5) * 10
            : 0;

          return (
            <div
              key={`${tx.hash}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 180px 150px 120px 100px",
                padding: "20px 24px",
                backgroundColor: colors.bg,
                transform: `translateX(${slideIn + shuffleOffset}px)`,
                opacity: fadeIn,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: tx.type === "BUY" ? colors.positive : colors.negative,
                }}
              >
                {tx.type}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.white,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {tx.amount.toLocaleString()}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.muted,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ${tx.price.toFixed(6)}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.muted,
                }}
              >
                {tx.date}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: colors.dim,
                }}
              >
                {tx.hash}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          opacity: interpolate(frame, [100, 130], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[1, 2, 3, "...", 8].map((page, i) => (
          <div
            key={i}
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: page === 1 ? colors.white : colors.steel,
              color: page === 1 ? colors.black : colors.muted,
              fontSize: 14,
              fontWeight: page === 1 ? 700 : 400,
            }}
          >
            {page}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "center",
          gap: 60,
          opacity: interpolate(frame, [200, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 10, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Total Bought
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: colors.positive, marginTop: 4 }}>
            28.7M
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 10, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Total Sold
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: colors.negative, marginTop: 4 }}>
            3.5M
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 10, color: colors.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Net Position
          </p>
          <p style={{ fontSize: 20, fontWeight: 700, color: colors.white, marginTop: 4 }}>
            25.2M
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}
