"use client";

import { useTokenPrice } from "@/hooks/useTokenPrice";
import { TOTAL_SUPPLY, TARGET_MARKET_CAP } from "@/lib/constants";
import { MarketCapProgressBar } from "./MarketCapProgressBar";
import { MultiplierDisplay } from "./MultiplierDisplay";

export function TokenDashboard() {
  const { price, priceChange24h, marketCap: apiMarketCap, volume24h, isLoading, isStale } = useTokenPrice();

  // Compute derived values - use API market cap if available, otherwise calculate
  const marketCap = apiMarketCap ?? (price !== null ? price * TOTAL_SUPPLY : null);
  const multiplier =
    marketCap !== null && marketCap > 0
      ? TARGET_MARKET_CAP / marketCap
      : null;
  const progress = marketCap !== null ? (marketCap / TARGET_MARKET_CAP) * 100 : 0;

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
          {/* Stale data indicator */}
          {isStale && (
            <div className="mb-5">
              <span className="text-[9px] tracking-[0.1em] uppercase px-3 py-1.5 bg-[var(--border)] text-[var(--muted)]">
                Using cached data
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
            {/* Multiplier - main hero element */}
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--dim)] mb-5">
                Multiplier to Target
              </p>
              <MultiplierDisplay multiplier={multiplier} isLoading={isLoading} />
              <p className="text-[11px] text-[var(--muted)] mt-5 tracking-[0.1em]">
                To $1B Market Cap
              </p>
            </div>

            {/* Giga Definition */}
            <div className="border-l border-[var(--border)] pl-10 hidden md:block">
              <GigaDefinition />
            </div>

            {/* Mobile Giga Definition */}
            <div className="border-t border-[var(--border)] pt-10 md:hidden">
              <GigaDefinition />
            </div>
          </div>
        </div>
      </section>

      {/* Data Grid Section */}
      <section className="py-20 border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)] mb-10">
            Current State
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
            <DataCell
              value={marketCap !== null ? formatMarketCap(marketCap) : "—"}
              label="Market Cap"
              change={priceChange24h}
              isLoading={isLoading}
            />
            <DataCell
              value={price !== null ? `$${formatPrice(price)}` : "—"}
              label="Price"
              change={priceChange24h}
              isLoading={isLoading}
            />
            <DataCell
              value="9.6B"
              label="Supply"
              isLoading={false}
            />
            <DataCell
              value={volume24h !== null ? formatMarketCap(volume24h) : "—"}
              label="Volume 24h"
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-20 border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
          <MarketCapProgressBar marketCap={marketCap} />
        </div>
      </section>
    </>
  );
}

function GigaDefinition() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-base text-[var(--white)] mb-1">
          giga-
        </p>
        <p className="text-sm text-[var(--muted)] italic">
          /ɡɪɡ.ə-/
        </p>
      </div>
      <div>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          denoting a factor of 10<sup className="text-[var(--white)]">9</sup> (1.000.000.000).
        </p>
      </div>
      <div>
        <p className="text-sm text-[var(--dim)]">
          from Greek <span className="italic text-[var(--muted)]">gigas</span> &apos;giant&apos;.
        </p>
      </div>
    </div>
  );
}

function DataCell({
  value,
  label,
  change,
  isLoading,
}: {
  value: string;
  label: string;
  change?: number | null;
  isLoading: boolean;
}) {
  const changeColor = change !== null && change !== undefined
    ? change >= 0 ? "text-[var(--positive)]" : "text-[var(--negative)]"
    : "";
  const changePrefix = change !== null && change !== undefined && change >= 0 ? "+" : "";

  return (
    <div className="bg-[var(--steel)] p-8 md:p-10">
      {isLoading ? (
        <div className="h-7 w-24 bg-[var(--border)] animate-pulse mb-3" />
      ) : (
        <div className="flex items-baseline gap-3 mb-3">
          <p className="text-2xl md:text-[28px] font-bold">{value}</p>
          {change !== null && change !== undefined && (
            <span className={`text-xs font-medium ${changeColor}`}>
              {changePrefix}{change.toFixed(2)}%
            </span>
          )}
        </div>
      )}
      <p className="text-[9px] tracking-[0.15em] uppercase text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
}

function formatPrice(price: number): string {
  if (price < 0.00001) {
    return price.toExponential(2);
  }
  if (price < 0.01) {
    return price.toFixed(6);
  }
  if (price < 1) {
    return price.toFixed(4);
  }
  return price.toFixed(2);
}
