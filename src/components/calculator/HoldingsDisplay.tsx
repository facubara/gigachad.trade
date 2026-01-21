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
    <svg
      className="animate-spin h-5 w-5 text-[var(--accent)]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function LoadingIndicator({ loadingState }: { loadingState: LoadingState }) {
  const { status, message, progress } = loadingState;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
        Your Holdings
      </h2>

      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <LoadingSpinner />

        <div className="text-center space-y-2">
          <p className="text-[var(--text)] font-medium">{message}</p>

          {progress && status === "fetching" && (
            <div className="text-sm text-[var(--muted)]">
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
            <div className="w-48 h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)] animate-pulse rounded-full" />
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
      <div className="space-y-4 animate-pulse">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
          Your Holdings
        </h2>
        <div className="h-12 bg-[var(--bg-secondary)] rounded-lg" />
        <div className="h-6 bg-[var(--bg-secondary)] rounded-lg w-2/3" />
      </div>
    );
  }

  if (balance === null) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
          Your Holdings
        </h2>
        <div className="py-8 text-center text-[var(--muted)]">
          Enter a wallet address to see holdings
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
        Your Holdings
      </h2>

      {/* Main balance display */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl md:text-4xl font-black">
          {formatNumber(balance)}
        </span>
        <span className="text-xl text-[var(--accent)] font-bold">GIGACHAD</span>
        {currentValue !== null && (
          <span className="text-xl text-[var(--muted)]">
            {" "}
            {formatCurrency(currentValue)}
          </span>
        )}
      </div>

      {/* Price info */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="text-[var(--muted)]">Avg. Buy Price: </span>
          <span className="font-mono">
            {entryPrice !== null && entryPrice > 0
              ? formatSmallPrice(entryPrice)
              : <span className="text-[var(--muted)]">Unknown</span>}
          </span>
        </div>
        {buyCount !== null && (
          <div>
            <span className="text-[var(--muted)]">Buy Transactions: </span>
            <span className="font-mono">{buyCount}</span>
          </div>
        )}
        {currentPrice !== null && (
          <div>
            <span className="text-[var(--muted)]">Current: </span>
            <span className="font-mono">{formatSmallPrice(currentPrice)}</span>
          </div>
        )}
        {entryPrice !== null && entryPrice > 0 && currentPrice !== null && (
          <div>
            <span className="text-[var(--muted)]">Change: </span>
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
      className={`font-mono ${isPositive ? "text-green-400" : "text-red-400"}`}
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
