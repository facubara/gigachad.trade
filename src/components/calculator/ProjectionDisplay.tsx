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
      <div className="py-16 text-center">
        <p className="text-[60px] md:text-[80px] font-bold text-[var(--dim)] opacity-30 tracking-[-0.03em]">
          x???
        </p>
        <p className="text-[var(--dim)] text-[11px] tracking-[0.1em] mt-4">
          Analyze a wallet to see projections
        </p>
      </div>
    );
  }

  if (!hasTarget || !projection) {
    return (
      <div className="py-16 text-center">
        <p className="text-[60px] md:text-[80px] font-bold text-[var(--dim)] opacity-30 tracking-[-0.03em]">
          x???
        </p>
        <p className="text-[var(--dim)] text-[11px] tracking-[0.1em] mt-4">Set a target to see your potential</p>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-10">
      {/* Main multiplier display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <p className="text-[80px] md:text-[100px] lg:text-[120px] font-bold tracking-[-0.03em] leading-[0.9]">
          x<AnimatedNumber value={projection.multiplierFromEntry} />
        </p>
        <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] mt-4 uppercase">
          From Your Entry
        </p>
      </motion.div>

      {/* Value projections */}
      <div className="grid gap-px md:grid-cols-2 bg-[var(--border)]">
        <div className="p-6 bg-[var(--bg)]">
          <p className="text-[9px] tracking-[0.15em] text-[var(--dim)] uppercase mb-2">
            Value at Target
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[var(--positive)]">
            {formatCurrency(projection.valueAtTarget)}
          </p>
        </div>

        <div className="p-6 bg-[var(--bg)]">
          <p className="text-[9px] tracking-[0.15em] text-[var(--dim)] uppercase mb-2">
            Profit from Entry
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[var(--positive)]">
            +{formatCurrency(projection.profitFromEntry)}
          </p>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="flex flex-wrap justify-center gap-8 text-[11px]">
        <div>
          <span className="text-[var(--dim)] tracking-[0.1em]">Target MC: </span>
          <span className="text-[var(--white)] font-mono">
            {formatCurrency(projection.targetMarketCap)}
          </span>
        </div>
        <div>
          <span className="text-[var(--dim)] tracking-[0.1em]">Target Price: </span>
          <span className="text-[var(--white)] font-mono">
            {formatSmallPrice(projection.targetPrice)}
          </span>
        </div>
        <div>
          <span className="text-[var(--dim)] tracking-[0.1em]">From Current: </span>
          <span className="text-[var(--white)] font-mono">
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
