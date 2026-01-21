"use client";

import { MILESTONES, TARGET_MARKET_CAP } from "@/lib/constants";

interface MarketCapProgressBarProps {
  marketCap: number | null;
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function MarketCapProgressBar({ marketCap }: MarketCapProgressBarProps) {
  const progress = marketCap
    ? Math.min((marketCap / TARGET_MARKET_CAP) * 100, 100)
    : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-3">
        <p className="text-sm uppercase tracking-widest text-[var(--muted)]">
          Market Cap
        </p>
        <p className="text-2xl md:text-3xl font-bold">
          {marketCap !== null ? formatMarketCap(marketCap) : "—"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--accent)] to-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Milestones */}
      <div className="relative mt-2 h-8">
        {MILESTONES.map((milestone) => {
          const position = (milestone.value / TARGET_MARKET_CAP) * 100;
          const isReached = marketCap !== null && marketCap >= milestone.value;

          return (
            <div
              key={milestone.value}
              className="absolute transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${position}%` }}
            >
              <div
                className={`w-1 h-2 ${
                  isReached ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }`}
              />
              <span
                className={`text-xs mt-1 whitespace-nowrap ${
                  isReached ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                {milestone.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Target label */}
      <div className="flex justify-end mt-4">
        <p className="text-sm text-[var(--muted)]">
          Target: <span className="text-white font-semibold">$1B</span>
        </p>
      </div>
    </div>
  );
}
