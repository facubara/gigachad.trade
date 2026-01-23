"use client";

import { LoadingState } from "@/types/cache";

interface HoldingsDisplayProps {
  balance: number | null;
  entryPrice: number | null;
  currentPrice: number | null;
  currentValue: number | null;
  buyCount: number | null;
  isLoading?: boolean;
  loadingState?: LoadingState;
}

function LoadingSpinner() {
  return (
    <div className="w-4 h-4 border border-[var(--white)] border-t-transparent animate-spin" />
  );
}

function LoadingIndicator({ loadingState }: { loadingState: LoadingState }) {
  const { status, message, progress } = loadingState;

  return (
    <div className="space-y-6">
      <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
        Your Holdings
      </h2>

      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <LoadingSpinner />

        <div className="text-center space-y-3">
          <p className="text-[var(--white)] text-sm tracking-[0.05em]">{message}</p>

          {progress && status === "fetching" && (
            <div className="text-[11px] tracking-[0.1em] text-[var(--muted)]">
              {progress.isIncremental ? (
                <span>Checking for new transactions...</span>
              ) : progress.currentPage > 0 ? (
                <span>
                  Page {progress.currentPage} ({progress.transactionsLoaded}{" "}
                  transactions loaded)
                </span>
              ) : (
                <span>Connecting to Solana...</span>
              )}
            </div>
          )}

          {status === "processing" && (
            <div className="w-48 h-px bg-[var(--border)] overflow-hidden">
              <div className="h-full bg-[var(--white)] animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HoldingsDisplay({
  balance,
  entryPrice,
  currentPrice,
  currentValue,
  buyCount,
  isLoading = false,
  loadingState,
}: HoldingsDisplayProps) {
  // Show detailed loading state if available
  if (isLoading && loadingState && loadingState.status !== "idle") {
    return <LoadingIndicator loadingState={loadingState} />;
  }

  // Fallback to simple loading animation
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Your Holdings
        </h2>
        <div className="h-12 bg-[var(--border)] animate-pulse" />
        <div className="h-6 bg-[var(--border)] animate-pulse w-2/3" />
      </div>
    );
  }

  if (balance === null) {
    return (
      <div className="space-y-6">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Your Holdings
        </h2>
        <div className="py-12 text-center text-[var(--dim)] text-[11px] tracking-[0.1em]">
          Enter a wallet address to see holdings
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
        Your Holdings
      </h2>

      {/* Main balance display */}
      <div className="flex items-baseline gap-4 flex-wrap">
        <span className="text-4xl md:text-5xl font-bold tracking-[-0.02em]">
          {formatNumber(balance)}
        </span>
        <span className="text-xl text-[var(--muted)] font-medium tracking-[0.1em]">GIGA</span>
        {currentValue !== null && (
          <span className="text-xl text-[var(--muted)]">
            {formatCurrency(currentValue)}
          </span>
        )}
      </div>

      {/* Price info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] block mb-1">Avg. Entry</span>
          <span className="font-mono text-sm">
            {entryPrice !== null && entryPrice > 0
              ? formatSmallPrice(entryPrice)
              : <span className="text-[var(--dim)]">—</span>}
          </span>
        </div>
        {buyCount !== null && (
          <div>
            <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] block mb-1">Buy Txns</span>
            <span className="font-mono text-sm">{buyCount}</span>
          </div>
        )}
        {currentPrice !== null && (
          <div>
            <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] block mb-1">Current</span>
            <span className="font-mono text-sm">{formatSmallPrice(currentPrice)}</span>
          </div>
        )}
        {entryPrice !== null && entryPrice > 0 && currentPrice !== null && (
          <div>
            <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] block mb-1">Change</span>
            <PriceChange entryPrice={entryPrice} currentPrice={currentPrice} />
          </div>
        )}
      </div>
    </div>
  );
}

function PriceChange({
  entryPrice,
  currentPrice,
}: {
  entryPrice: number;
  currentPrice: number;
}) {
  const change = ((currentPrice - entryPrice) / entryPrice) * 100;
  const isPositive = change >= 0;

  return (
    <span
      className={`font-mono text-sm ${isPositive ? "text-[var(--positive)]" : "text-[var(--negative)]"}`}
    >
      {isPositive ? "+" : ""}
      {change.toFixed(1)}%
    </span>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatCurrency(num: number): string {
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
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
