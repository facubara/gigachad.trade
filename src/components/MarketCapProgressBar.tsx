"use client";

import { MILESTONES, TARGET_MARKET_CAP } from "@/lib/constants";

interface MarketCapProgressBarProps {
  marketCap: number | null;
}

export function MarketCapProgressBar({ marketCap }: MarketCapProgressBarProps) {
  const progress = marketCap
    ? Math.min((marketCap / TARGET_MARKET_CAP) * 100, 100)
    : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Progress to Target
        </p>
        <p className="text-[32px] font-bold">
          {progress.toFixed(1)}%
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 bg-[var(--border)] mb-12 rounded-full">
        <div
          className="absolute top-0 left-0 h-1 bg-[var(--white)] transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
        {/* Progress indicator */}
        <div
          className="absolute top-1/2 w-3 h-3 bg-[var(--white)] transition-all duration-500"
          style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-5">
        {MILESTONES.map((milestone) => {
          const isReached = marketCap !== null && marketCap >= milestone.value;

          return (
            <div
              key={milestone.value}
              className="text-center"
            >
              <p
                className={`text-base font-medium mb-2 ${
                  isReached ? "text-[var(--white)]" : "text-[var(--dim)]"
                }`}
              >
                {formatMilestoneValue(milestone.value)}
              </p>
              <p
                className={`text-[8px] tracking-[0.15em] uppercase ${
                  isReached ? "text-[var(--muted)]" : "text-[var(--dim)]"
                }`}
              >
                {milestone.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatMilestoneValue(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${value / 1_000_000_000}B`;
  }
  if (value >= 1_000_000) {
    return `$${value / 1_000_000}M`;
  }
  return `$${value / 1_000}K`;
}
