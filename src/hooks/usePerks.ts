"use client";

import { useCallback, useState } from "react";
import {
  PERKS,
  Perk,
  calculatePerkCost,
  getPushupsPerClick,
  calculatePushupsPerSecond,
} from "@/lib/perks";

interface UsePerksResult {
  perks: Perk[];
  perkLevels: Record<string, number>;
  setPerkLevels: (levels: Record<string, number>) => void;
  purchasePerk: (perkId: string) => Promise<boolean>;
  getPerkCost: (perkId: string) => number;
  getPerkLevel: (perkId: string) => number;
  pushupsPerClick: number;
  pushupsPerSecond: number;
  isPurchasing: string | null;
}

interface UsePerksProps {
  localPushups: number;
  onPurchaseSuccess: (newTotal: number, newPerks: Record<string, number>) => void;
}

export function usePerks({ localPushups, onPurchaseSuccess }: UsePerksProps): UsePerksResult {
  const [perkLevels, setPerkLevels] = useState<Record<string, number>>({});
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  const getPerkLevel = useCallback(
    (perkId: string) => perkLevels[perkId] || 0,
    [perkLevels]
  );

  const getPerkCost = useCallback(
    (perkId: string) => {
      const perk = PERKS.find((p) => p.id === perkId);
      if (!perk) return Infinity;
      return calculatePerkCost(perk, getPerkLevel(perkId));
    },
    [getPerkLevel]
  );

  const purchasePerk = useCallback(
    async (perkId: string): Promise<boolean> => {
      const cost = getPerkCost(perkId);
      if (localPushups < cost || isPurchasing) {
        return false;
      }

      setIsPurchasing(perkId);

      try {
        const response = await fetch("/api/player/perks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ perkId }),
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        setPerkLevels(data.perks);
        onPurchaseSuccess(data.totalPushups, data.perks);
        return true;
      } catch {
        return false;
      } finally {
        setIsPurchasing(null);
      }
    },
    [getPerkCost, localPushups, isPurchasing, onPurchaseSuccess]
  );

  const pushupsPerClick = getPushupsPerClick(perkLevels);
  const pushupsPerSecond = calculatePushupsPerSecond(perkLevels);

  return {
    perks: PERKS,
    perkLevels,
    setPerkLevels,
    purchasePerk,
    getPerkCost,
    getPerkLevel,
    pushupsPerClick,
    pushupsPerSecond,
    isPurchasing,
  };
}
