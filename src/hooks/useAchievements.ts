"use client";

import { useMemo } from "react";
import {
  calculateAchievements,
  extractMetrics,
  EarnedAchievement,
  WalletMetrics,
} from "@/lib/achievementEngine";

interface Transaction {
  type: "buy" | "sell" | "unknown";
  timestamp: number;
}

interface UseAchievementsResult {
  achievements: EarnedAchievement[];
  metrics: WalletMetrics;
  achievementCount: number;
}

/**
 * Hook to calculate achievements from wallet transaction data
 */
export function useAchievements(
  transactions: Transaction[] | null | undefined
): UseAchievementsResult {
  const result = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        achievements: [],
        metrics: { buyCount: 0, sellCount: 0, uniqueBuyDays: 0 },
        achievementCount: 0,
      };
    }

    const metrics = extractMetrics(transactions);
    const achievements = calculateAchievements(transactions);

    return {
      achievements,
      metrics,
      achievementCount: achievements.length,
    };
  }, [transactions]);

  return result;
}
