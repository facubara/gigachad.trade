"use client";

import { GlobalStats } from "@/hooks/useWalletStats";

interface EntryPriceAnalyticsProps {
  userEntryPrice: number | null;
  globalStats: GlobalStats | null;
  isLoading?: boolean;
  onRequestConsent?: () => void;
  hasConsent: boolean;
}

export function EntryPriceAnalytics({
  userEntryPrice,
  globalStats,
  isLoading = false,
  onRequestConsent,
  hasConsent,
}: EntryPriceAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Entry Price Analytics
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-32 bg-[var(--border)]" />
          <div className="h-4 w-48 bg-[var(--border)]" />
        </div>
      </div>
    );
  }

  // No entry price available
  if (!userEntryPrice || userEntryPrice <= 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Entry Price Analytics
        </h2>
        <p className="text-[var(--dim)] text-[11px] tracking-[0.05em]">
          No entry price data available for comparison.
        </p>
      </div>
    );
  }

  // No global stats or no wallets analyzed
  if (!globalStats || globalStats.totalWalletsAnalyzed === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Entry Price Analytics
        </h2>
        <div className="p-4 border border-[var(--border)] space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)]">
              Your Avg Entry
            </span>
            <span className="font-mono text-sm">
              {formatSmallPrice(userEntryPrice)}
            </span>
          </div>
          <p className="text-[var(--dim)] text-[10px] tracking-[0.05em]">
            Not enough data for comparison yet.
            {!hasConsent && onRequestConsent && (
              <button
                onClick={onRequestConsent}
                className="ml-1 text-[var(--white)] underline hover:no-underline"
              >
                Contribute your stats?
              </button>
            )}
          </p>
        </div>
      </div>
    );
  }

  const percentile = globalStats.userPercentile ?? null;
  const medianEntry = globalStats.entryPriceP50;

  const percentileColor =
    percentile !== null
      ? percentile >= 70
        ? "text-[var(--positive)]"
        : percentile >= 40
          ? "text-[var(--white)]"
          : "text-[var(--negative)]"
      : "text-[var(--muted)]";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Entry Price Analytics
        </h2>
        <span className="text-[8px] tracking-[0.1em] text-[var(--dim)]">
          {globalStats.totalWalletsAnalyzed} wallets analyzed
        </span>
      </div>

      <div className="p-4 border border-[var(--border)] space-y-4">
        {/* Price comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] block mb-1">
              Your Avg Entry
            </span>
            <span className="font-mono text-sm">
              {formatSmallPrice(userEntryPrice)}
            </span>
          </div>
          {medianEntry && (
            <div>
              <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] block mb-1">
                Median Entry
              </span>
              <span className="font-mono text-sm text-[var(--muted)]">
                {formatSmallPrice(medianEntry)}
              </span>
            </div>
          )}
        </div>

        {/* Percentile display */}
        {percentile !== null && (
          <div className="pt-3 border-t border-[var(--border)]">
            <div className="flex items-baseline gap-2">
              <span className={`font-mono text-2xl font-bold ${percentileColor}`}>
                {percentile}%
              </span>
              <span className="text-[10px] tracking-[0.05em] text-[var(--muted)]">
                better entry than other holders
              </span>
            </div>

            {/* Visual bar */}
            <div className="mt-3 h-1 bg-[var(--border)] overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  percentile >= 70
                    ? "bg-[var(--positive)]"
                    : percentile >= 40
                      ? "bg-[var(--white)]"
                      : "bg-[var(--negative)]"
                }`}
                style={{ width: `${percentile}%` }}
              />
            </div>
          </div>
        )}

        {/* Consent prompt if not opted in */}
        {!hasConsent && onRequestConsent && (
          <div className="pt-3 border-t border-[var(--border)]">
            <button
              onClick={onRequestConsent}
              className="text-[10px] tracking-[0.05em] text-[var(--muted)] hover:text-[var(--white)] transition-colors"
            >
              Help improve analytics by contributing your anonymous stats →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatSmallPrice(price: number): string {
  if (price < 0.000001) {
    return `$${price.toExponential(2)}`;
  }
  if (price < 0.01) {
    return `$${price.toFixed(8)}`;
  }
  if (price < 1) {
    return `$${price.toFixed(6)}`;
  }
  return `$${price.toFixed(4)}`;
}
