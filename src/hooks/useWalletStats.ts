"use client";

import { useState, useCallback, useEffect } from "react";

export interface GlobalStats {
  totalWalletsAnalyzed: number;
  entryPriceP25: number | null;
  entryPriceP50: number | null;
  entryPriceP75: number | null;
  avgEntryPrice: number | null;
  lastUpdated: string;
  userPercentile?: number;
}

interface WalletStatsInput {
  address: string;
  totalBuyCount: number;
  totalSellCount: number;
  weightedAvgEntryPrice: number;
  uniqueBuyDays: number;
  currentHoldings: number;
}

const CONSENT_KEY = "giga-stats-consent";

interface UseWalletStatsResult {
  hasConsent: boolean;
  setConsent: (consent: boolean) => void;
  submitStats: (stats: WalletStatsInput) => Promise<boolean>;
  globalStats: GlobalStats | null;
  fetchGlobalStats: (address?: string, entryPrice?: number) => Promise<void>;
  isSubmitting: boolean;
  isFetchingGlobal: boolean;
}

export function useWalletStats(): UseWalletStatsResult {
  const [hasConsent, setHasConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingGlobal, setIsFetchingGlobal] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  // Load consent from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "true") {
      setHasConsent(true);
    }
  }, []);

  const setConsent = useCallback((consent: boolean) => {
    setHasConsent(consent);
    localStorage.setItem(CONSENT_KEY, consent ? "true" : "false");
  }, []);

  const submitStats = useCallback(
    async (stats: WalletStatsInput): Promise<boolean> => {
      if (!hasConsent) return false;
      if (stats.weightedAvgEntryPrice <= 0) return false;

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/wallet/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stats),
        });

        return response.ok;
      } catch (error) {
        console.error("[Stats] Error submitting stats:", error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [hasConsent]
  );

  const fetchGlobalStats = useCallback(
    async (address?: string, entryPrice?: number) => {
      setIsFetchingGlobal(true);
      try {
        let url = "/api/stats/global";
        const params = new URLSearchParams();

        if (address) params.set("address", address);
        if (entryPrice && entryPrice > 0) params.set("entryPrice", entryPrice.toString());

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setGlobalStats(data);
        }
      } catch (error) {
        console.error("[Stats] Error fetching global stats:", error);
      } finally {
        setIsFetchingGlobal(false);
      }
    },
    []
  );

  return {
    hasConsent,
    setConsent,
    submitStats,
    globalStats,
    fetchGlobalStats,
    isSubmitting,
    isFetchingGlobal,
  };
}
