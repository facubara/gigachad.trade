"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PriceDisplayProps {
  price: number | null;
  isLoading: boolean;
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

export function PriceDisplay({ price, isLoading }: PriceDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-widest text-[var(--muted)] mb-2">
        Current Price
      </p>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-12 flex items-center justify-center"
          >
            <div className="w-32 h-8 bg-[var(--border)] rounded animate-pulse" />
          </motion.div>
        ) : (
          <motion.p
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            <span className="text-[var(--accent)]">$</span>
            {price !== null ? formatPrice(price) : "—"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
