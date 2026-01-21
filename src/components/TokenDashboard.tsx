"use client";

import { useTokenPrice } from "@/hooks/useTokenPrice";
import { TOTAL_SUPPLY, TARGET_MARKET_CAP } from "@/lib/constants";
import { PriceDisplay } from "./PriceDisplay";
import { MarketCapProgressBar } from "./MarketCapProgressBar";
import { MultiplierDisplay } from "./MultiplierDisplay";

export function TokenDashboard() {
  const { price, isLoading, isStale } = useTokenPrice();

  // Compute derived values
  const marketCap = price !== null ? price * TOTAL_SUPPLY : null;
  const multiplier =
    marketCap !== null && marketCap > 0
      ? TARGET_MARKET_CAP / marketCap
      : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Stale data indicator */}
      {isStale && (
        <div className="text-center">
          <span className="text-xs text-[var(--muted)] bg-[var(--border)] px-3 py-1 rounded-full">
            Using cached data
          </span>
        </div>
      )}

      {/* Multiplier - hero element */}
      <MultiplierDisplay multiplier={multiplier} />

      {/* Price display */}
      <PriceDisplay price={price} isLoading={isLoading} />

      {/* Market cap progress bar */}
      <div className="px-4">
        <MarketCapProgressBar marketCap={marketCap} />
      </div>
    </div>
  );
}
