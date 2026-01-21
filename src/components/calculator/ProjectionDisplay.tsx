"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ProjectionResult } from "@/hooks/useCalculator";

interface ProjectionDisplayProps {
  projection: ProjectionResult | null;
  hasWalletData: boolean;
  hasTarget: boolean;
}

export function ProjectionDisplay({
  projection,
  hasWalletData,
  hasTarget,
}: ProjectionDisplayProps) {
  if (!hasWalletData) {
    return (
      <div className="py-12 text-center">
        <p className="text-6xl md:text-7xl font-black text-[var(--muted)] opacity-30">
          x???
        </p>
        <p className="text-[var(--muted)] mt-4">
          Analyze a wallet to see projections
        </p>
      </div>
    );
  }

  if (!hasTarget || !projection) {
    return (
      <div className="py-12 text-center">
        <p className="text-6xl md:text-7xl font-black text-[var(--muted)] opacity-30">
          x???
        </p>
        <p className="text-[var(--muted)] mt-4">Set a target to see your potential</p>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      {/* Main multiplier display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <p className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter">
          <span className="text-[var(--accent)]">x</span>
          <AnimatedNumber value={projection.multiplierFromEntry} />
        </p>
        <p className="text-lg md:text-xl text-[var(--muted)] mt-2 uppercase tracking-widest">
          From Your Entry
        </p>
      </motion.div>

      {/* Value projections */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-1">
            Value at Target
          </p>
          <p className="text-2xl md:text-3xl font-bold text-green-400">
            {formatCurrency(projection.valueAtTarget)}
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-1">
            Profit from Entry
          </p>
          <p className="text-2xl md:text-3xl font-bold text-green-400">
            +{formatCurrency(projection.profitFromEntry)}
          </p>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
        <div>
          <span>Target MC: </span>
          <span className="text-[var(--text)] font-mono">
            {formatCurrency(projection.targetMarketCap)}
          </span>
        </div>
        <div>
          <span>Target Price: </span>
          <span className="text-[var(--text)] font-mono">
            {formatSmallPrice(projection.targetPrice)}
          </span>
        </div>
        <div>
          <span>From Current: </span>
          <span className="text-[var(--text)] font-mono">
            x{projection.multiplierFromCurrent.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(1, {
    stiffness: 50,
    damping: 20,
  });

  const display = useTransform(spring, (current) => {
    if (current >= 1_000_000) {
      return `${(current / 1_000_000).toFixed(1)}M`;
    }
    if (current >= 1000) {
      return `${(current / 1000).toFixed(1)}K`;
    }
    if (current >= 100) {
      return current.toFixed(0);
    }
    return current.toFixed(1);
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

function formatCurrency(num: number): string {
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
