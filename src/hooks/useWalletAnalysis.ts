"use client";

import { useState, useCallback, useRef } from "react";
import { useIndexedDB } from "./useIndexedDB";
import {
  LoadingState,
  WalletMetadata,
  CachedTransaction,
} from "@/types/cache";

export interface WalletAnalysis {
  address: string;
  totalBought: number;
  totalSold: number;
  netHoldings: number;
  weightedAverageEntryPrice: number;
  transactions: Array<{
    signature: string;
    timestamp: number;
    type: "buy" | "sell" | "unknown";
    gigachadAmount: number;
    quoteAmount: number;
    quoteMint: string;
    pricePerToken: number;
  }>;
  analyzedAt: number;
  stale?: boolean;
}

// Extended analysis from API includes caching metadata
interface ExtendedWalletAnalysis extends WalletAnalysis {
  newestTxSignature?: string;
  newestTxTimestamp?: number;
  fetchedCount: number;
  wasIncremental: boolean;
}

interface HoldingsResponse {
  address: string;
  balance: number;
  timestamp: number;
}

interface UseWalletAnalysisResult {
  analysis: WalletAnalysis | null;
  balance: number | null;
  isLoading: boolean;
  loadingState: LoadingState;
  error: string | null;
  analyze: (address: string) => Promise<void>;
  clear: () => void;
  isCacheAvailable: boolean;
}

const IDLE_STATE: LoadingState = {
  status: "idle",
  message: "",
};

export function useWalletAnalysis(): UseWalletAnalysisResult {
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>(IDLE_STATE);
  const [error, setError] = useState<string | null>(null);

  const {
    isAvailable: isCacheAvailable,
    isReady: isCacheReady,
    getMetadata,
    saveMetadata,
    getTransactions,
    saveTransactionsBatch,
  } = useIndexedDB();

  // Track current analysis to prevent race conditions
  const currentAnalysisRef = useRef<string | null>(null);

  const analyze = useCallback(
    async (address: string) => {
      currentAnalysisRef.current = address;
      setIsLoading(true);
      setError(null);
      setLoadingState({
        status: "checking-cache",
        message: "Checking local cache...",
      });

      try {
        // Check local cache if available
        let cachedMetadata: WalletMetadata | null = null;
        let cachedTransactions: CachedTransaction[] = [];

        if (isCacheAvailable && isCacheReady) {
          cachedMetadata = await getMetadata(address);
          if (cachedMetadata) {
            cachedTransactions = await getTransactions(address);
            console.log(
              `[Cache] Found ${cachedTransactions.length} cached transactions for wallet`
            );
          }
        }

        const hasCachedData =
          cachedMetadata && cachedTransactions.length > 0;
        const cachedNewestSignature = cachedMetadata?.newestTxSignature;

        // Update loading state for fetch
        setLoadingState({
          status: "fetching",
          message: hasCachedData
            ? "Fetching new transactions..."
            : "Loading transaction history...",
          progress: {
            currentPage: 0,
            transactionsLoaded: 0,
            isIncremental: !!hasCachedData,
          },
        });

        // Build API URL with incremental parameter if we have cached data
        let analysisUrl = `/api/wallet/transactions?address=${encodeURIComponent(address)}`;
        if (cachedNewestSignature) {
          analysisUrl += `&cachedNewestSignature=${encodeURIComponent(cachedNewestSignature)}`;
        }

        // Fetch both holdings and transaction analysis in parallel
        const [holdingsRes, analysisRes] = await Promise.all([
          fetch(`/api/wallet/holdings?address=${encodeURIComponent(address)}`),
          fetch(analysisUrl),
        ]);

        // Check if this is still the current analysis
        if (currentAnalysisRef.current !== address) {
          return; // Abort if user started a different analysis
        }

        if (!holdingsRes.ok) {
          const holdingsError = await holdingsRes.json();
          throw new Error(holdingsError.error || "Failed to fetch holdings");
        }

        if (!analysisRes.ok) {
          const analysisError = await analysisRes.json();
          throw new Error(
            analysisError.error || "Failed to analyze transactions"
          );
        }

        const holdingsData: HoldingsResponse = await holdingsRes.json();
        const analysisData: ExtendedWalletAnalysis = await analysisRes.json();

        // Update loading state for processing
        setLoadingState({
          status: "processing",
          message: `Analyzing ${
            analysisData.transactions.length +
            (hasCachedData ? cachedTransactions.length : 0)
          } transactions...`,
        });

        // Merge new transactions with cached ones if incremental
        let finalTransactions = analysisData.transactions;
        let finalAnalysis: WalletAnalysis;

        if (hasCachedData && analysisData.wasIncremental) {
          // Convert cached transactions to the expected format
          const cachedTxFormat = cachedTransactions.map((tx) => ({
            signature: tx.signature,
            timestamp: tx.timestamp,
            type: tx.type,
            gigachadAmount: tx.gigachadAmount,
            quoteAmount: tx.quoteAmount,
            quoteMint: tx.quoteMint,
            pricePerToken: tx.pricePerToken,
          }));

          // Merge: new transactions (newest) + cached transactions
          finalTransactions = [...analysisData.transactions, ...cachedTxFormat];

          // Recalculate totals from merged transactions
          let totalBought = 0;
          let totalSold = 0;
          let weightedSum = 0;

          for (const tx of finalTransactions) {
            if (tx.type === "buy") {
              totalBought += tx.gigachadAmount;
              weightedSum += tx.gigachadAmount * tx.pricePerToken;
            } else if (tx.type === "sell") {
              totalSold += tx.gigachadAmount;
            }
          }

          finalAnalysis = {
            address,
            totalBought,
            totalSold,
            netHoldings: totalBought - totalSold,
            weightedAverageEntryPrice:
              totalBought > 0 ? weightedSum / totalBought : 0,
            transactions: finalTransactions,
            analyzedAt: Date.now(),
          };

          console.log(
            `[Cache] Merged ${analysisData.transactions.length} new + ${cachedTransactions.length} cached transactions`
          );
        } else {
          // Full fetch - use API response directly
          finalAnalysis = {
            address: analysisData.address,
            totalBought: analysisData.totalBought,
            totalSold: analysisData.totalSold,
            netHoldings: analysisData.netHoldings,
            weightedAverageEntryPrice: analysisData.weightedAverageEntryPrice,
            transactions: analysisData.transactions,
            analyzedAt: analysisData.analyzedAt,
            stale: analysisData.stale,
          };
        }

        // Save to IndexedDB cache
        if (isCacheAvailable && isCacheReady && finalTransactions.length > 0) {
          const newestTx = finalTransactions[0];

          // Save wallet metadata
          const metadata: WalletMetadata = {
            address,
            lastFetchedAt: Date.now(),
            newestTxSignature: newestTx.signature,
            newestTxTimestamp: newestTx.timestamp,
            totalCachedTxCount: finalTransactions.length,
          };
          await saveMetadata(metadata);

          // Save transactions (convert to cached format)
          const txsToCache: CachedTransaction[] = finalTransactions.map(
            (tx) => ({
              id: `${address}:${tx.signature}`,
              walletAddress: address,
              signature: tx.signature,
              timestamp: tx.timestamp,
              type: tx.type,
              gigachadAmount: tx.gigachadAmount,
              quoteAmount: tx.quoteAmount,
              quoteMint: tx.quoteMint,
              pricePerToken: tx.pricePerToken,
            })
          );
          await saveTransactionsBatch(txsToCache);

          console.log(
            `[Cache] Saved ${txsToCache.length} transactions to IndexedDB`
          );
        }

        setBalance(holdingsData.balance);
        setAnalysis(finalAnalysis);
        setLoadingState({
          status: "complete",
          message: "Analysis complete",
        });
      } catch (err) {
        // Check if this is still the current analysis
        if (currentAnalysisRef.current !== address) {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setAnalysis(null);
        setBalance(null);
        setLoadingState({
          status: "error",
          message: errorMessage,
        });
      } finally {
        if (currentAnalysisRef.current === address) {
          setIsLoading(false);
        }
      }
    },
    [
      isCacheAvailable,
      isCacheReady,
      getMetadata,
      getTransactions,
      saveMetadata,
      saveTransactionsBatch,
    ]
  );

  const clear = useCallback(() => {
    currentAnalysisRef.current = null;
    setAnalysis(null);
    setBalance(null);
    setError(null);
    setLoadingState(IDLE_STATE);
  }, []);

  return {
    analysis,
    balance,
    isLoading,
    loadingState,
    error,
    analyze,
    clear,
    isCacheAvailable,
  };
}
