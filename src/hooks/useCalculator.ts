"use client";

import { useState, useMemo, useCallback } from "react";
import { TOTAL_SUPPLY } from "@/lib/constants";

export type TargetMode = "marketCap" | "tokenPrice";

interface UseCalculatorResult {
  // Target inputs
  targetMode: TargetMode;
  setTargetMode: (mode: TargetMode) => void;
  targetValue: number | null;
  setTargetValue: (value: number | null) => void;

  // Computed projections
  computeProjection: (params: {
    balance: number;
    entryPrice: number;
    currentPrice: number;
  }) => ProjectionResult | null;
}

export interface ProjectionResult {
  // Current state
  currentValue: number;

  // Target state
  targetPrice: number;
  targetMarketCap: number;
  valueAtTarget: number;

  // Multipliers
  multiplierFromEntry: number;
  multiplierFromCurrent: number;

  // Profit
  profitFromEntry: number;
  profitFromCurrent: number;
}

export function useCalculator(): UseCalculatorResult {
  const [targetMode, setTargetMode] = useState<TargetMode>("marketCap");
  const [targetValue, setTargetValue] = useState<number | null>(null);

  const computeProjection = useCallback(
    (params: {
      balance: number;
      entryPrice: number;
      currentPrice: number;
    }): ProjectionResult | null => {
      const { balance, entryPrice, currentPrice } = params;

      if (!targetValue || targetValue <= 0 || balance <= 0) {
        return null;
      }

      // Calculate target price based on mode
      let targetPrice: number;
      let targetMarketCap: number;

      if (targetMode === "marketCap") {
        targetMarketCap = targetValue;
        targetPrice = targetMarketCap / TOTAL_SUPPLY;
      } else {
        targetPrice = targetValue;
        targetMarketCap = targetPrice * TOTAL_SUPPLY;
      }

      // Current value
      const currentValue = balance * currentPrice;

      // Value at target
      const valueAtTarget = balance * targetPrice;

      // Entry value (what they paid)
      const entryValue = balance * entryPrice;

      // Multipliers
      const multiplierFromEntry = entryPrice > 0 ? targetPrice / entryPrice : 0;
      const multiplierFromCurrent = currentPrice > 0 ? targetPrice / currentPrice : 0;

      // Profits
      const profitFromEntry = valueAtTarget - entryValue;
      const profitFromCurrent = valueAtTarget - currentValue;

      return {
        currentValue,
        targetPrice,
        targetMarketCap,
        valueAtTarget,
        multiplierFromEntry,
        multiplierFromCurrent,
        profitFromEntry,
        profitFromCurrent,
      };
    },
    [targetMode, targetValue]
  );

  return {
    targetMode,
    setTargetMode,
    targetValue,
    setTargetValue,
    computeProjection,
  };
}

// Market cap presets for quick selection
export const MARKET_CAP_PRESETS = [
  { value: 100_000_000, label: "$100M" },
  { value: 500_000_000, label: "$500M" },
  { value: 1_000_000_000, label: "$1B" },
  { value: 5_000_000_000, label: "$5B" },
] as const;
