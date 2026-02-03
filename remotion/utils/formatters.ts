/**
 * Number formatting utilities for Remotion videos
 * Ported from various components in the app
 */

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(1);
}

export function formatMultiplier(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  if (num >= 100) {
    return num.toFixed(0);
  }
  return num.toFixed(1);
}

export function formatCurrency(num: number): string {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${value / 1_000_000_000}B`;
  }
  if (value >= 1_000_000) {
    return `$${value / 1_000_000}M`;
  }
  return `$${value / 1_000}K`;
}

export function formatSmallPrice(price: number): string {
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

export function formatPercent(value: number): string {
  if (value >= 1000) {
    return `+${formatCompactNumber(value)}%`;
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
