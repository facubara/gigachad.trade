// Achievement calculation engine

import { ACHIEVEMENTS, Achievement, ACHIEVEMENT_ORDER } from "./achievements";

export interface WalletMetrics {
  buyCount: number;
  sellCount: number;
  uniqueBuyDays: number;
}

export interface EarnedAchievement {
  achievement: Achievement;
  earnedAt?: number; // Could be timestamp when earned
}

/**
 * Calculate unique buy days from transaction timestamps
 */
export function calculateUniqueBuyDays(
  transactions: Array<{ type: "buy" | "sell" | "unknown"; timestamp: number }>
): number {
  const buyDays = new Set<string>();

  for (const tx of transactions) {
    if (tx.type === "buy") {
      // Convert timestamp to date string (YYYY-MM-DD)
      const date = new Date(tx.timestamp).toISOString().split("T")[0];
      buyDays.add(date);
    }
  }

  return buyDays.size;
}

/**
 * Extract wallet metrics from transaction analysis
 */
export function extractMetrics(
  transactions: Array<{ type: "buy" | "sell" | "unknown"; timestamp: number }>
): WalletMetrics {
  let buyCount = 0;
  let sellCount = 0;

  for (const tx of transactions) {
    if (tx.type === "buy") buyCount++;
    else if (tx.type === "sell") sellCount++;
  }

  const uniqueBuyDays = calculateUniqueBuyDays(transactions);

  return {
    buyCount,
    sellCount,
    uniqueBuyDays,
  };
}

/**
 * Check if a specific achievement is earned based on metrics
 */
export function checkAchievement(
  achievement: Achievement,
  metrics: WalletMetrics
): boolean {
  const { criteria } = achievement;

  switch (criteria.type) {
    case "buyCount":
      return criteria.min !== undefined && metrics.buyCount >= criteria.min;

    case "sellCount":
      return criteria.min !== undefined && metrics.sellCount >= criteria.min;

    case "uniqueBuyDays":
      return criteria.min !== undefined && metrics.uniqueBuyDays >= criteria.min;

    case "diamondHands":
      // Must have 0 sells AND at least the required number of buys
      const requiredBuys = criteria.requiresBuyCount ?? 5;
      return metrics.sellCount === 0 && metrics.buyCount >= requiredBuys;

    default:
      return false;
  }
}

/**
 * Calculate all earned achievements for a wallet
 */
export function calculateAchievements(
  transactions: Array<{ type: "buy" | "sell" | "unknown"; timestamp: number }>
): EarnedAchievement[] {
  const metrics = extractMetrics(transactions);
  const earned: EarnedAchievement[] = [];

  // Check each achievement in display order
  for (const key of ACHIEVEMENT_ORDER) {
    const achievement = ACHIEVEMENTS[key];
    if (achievement && checkAchievement(achievement, metrics)) {
      earned.push({ achievement });
    }
  }

  return earned;
}

/**
 * Get achievement progress for display
 */
export function getAchievementProgress(
  achievement: Achievement,
  metrics: WalletMetrics
): { current: number; target: number; percentage: number } | null {
  const { criteria } = achievement;

  switch (criteria.type) {
    case "buyCount":
      if (criteria.min === undefined) return null;
      return {
        current: metrics.buyCount,
        target: criteria.min,
        percentage: Math.min(100, (metrics.buyCount / criteria.min) * 100),
      };

    case "uniqueBuyDays":
      if (criteria.min === undefined) return null;
      return {
        current: metrics.uniqueBuyDays,
        target: criteria.min,
        percentage: Math.min(100, (metrics.uniqueBuyDays / criteria.min) * 100),
      };

    case "diamondHands":
      const requiredBuys = criteria.requiresBuyCount ?? 5;
      if (metrics.sellCount > 0) {
        return { current: 0, target: 1, percentage: 0 }; // Failed - sold
      }
      return {
        current: metrics.buyCount,
        target: requiredBuys,
        percentage: Math.min(100, (metrics.buyCount / requiredBuys) * 100),
      };

    default:
      return null;
  }
}
