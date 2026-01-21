"use client";

import { useState, useEffect, useCallback } from "react";

interface TokenPriceResponse {
  priceUsd: number;
  timestamp: number;
  stale?: boolean;
}

interface UseTokenPriceResult {
  price: number | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const POLL_INTERVAL_MS = 30_000; // Match server cache TTL

export function useTokenPrice(): UseTokenPriceResult {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      const response = await fetch("/api/token/price");

      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }

      const data: TokenPriceResponse = await response.json();
      setPrice(data.priceUsd);
      setIsStale(data.stale ?? false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();

    const interval = setInterval(fetchPrice, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return { price, isLoading, isStale, error, refetch: fetchPrice };
}
