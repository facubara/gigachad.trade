"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PriceDisplayProps {
  price: number | null;
  isLoading: boolean;
  marketCap?: number | null;
  progress?: number;
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

export function PriceDisplay({ price, isLoading, marketCap, progress }: PriceDisplayProps) {
  const metaItems = [
    {
      label: "Current Price",
      value: price !== null ? `$${formatPrice(price)}` : "—",
    },
    {
      label: "Market Cap",
      value: marketCap !== null ? formatMarketCap(marketCap) : "—",
    },
    {
      label: "Progress",
      value: progress !== undefined ? `${progress.toFixed(1)}%` : "—",
    },
  ];

  return (
    <div className="space-y-7">
      {metaItems.map((item, index) => (
        <div key={item.label} className="meta-row">
          <p className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] mb-2">
            {item.label}
          </p>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-6 w-28 bg-[var(--border)] animate-pulse"
              />
            ) : (
              <motion.p
                key={item.value}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="text-2xl font-medium"
              >
                {item.value}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
