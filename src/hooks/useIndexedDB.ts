"use client";

/**
 * React hook for IndexedDB operations with SSR safety and caching.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  isIndexedDBAvailable,
  openDatabase,
  getWalletMetadata,
  saveWalletMetadata,
  getWalletTransactions,
  saveTransactions,
  deleteWalletCache,
  clearAllCache,
} from "@/lib/indexeddb";
import { WalletMetadata, CachedTransaction } from "@/types/cache";

interface UseIndexedDBResult {
  isAvailable: boolean;
  isReady: boolean;
  // Wallet metadata operations
  getMetadata: (address: string) => Promise<WalletMetadata | null>;
  saveMetadata: (metadata: WalletMetadata) => Promise<boolean>;
  // Transaction operations
  getTransactions: (walletAddress: string) => Promise<CachedTransaction[]>;
  saveTransactionsBatch: (transactions: CachedTransaction[]) => Promise<boolean>;
  // Cache management
  deleteCache: (walletAddress: string) => Promise<boolean>;
  clearAll: () => Promise<boolean>;
}

export function useIndexedDB(): UseIndexedDBResult {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const initRef = useRef(false);

  // Initialize IndexedDB on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      if (!isIndexedDBAvailable()) {
        setIsAvailable(false);
        setIsReady(true);
        return;
      }

      const db = await openDatabase();
      setIsAvailable(db !== null);
      setIsReady(true);
    };

    init();
  }, []);

  const getMetadata = useCallback(async (address: string) => {
    if (!isAvailable) return null;
    return getWalletMetadata(address);
  }, [isAvailable]);

  const saveMetadata = useCallback(async (metadata: WalletMetadata) => {
    if (!isAvailable) return false;
    return saveWalletMetadata(metadata);
  }, [isAvailable]);

  const getTransactions = useCallback(async (walletAddress: string) => {
    if (!isAvailable) return [];
    return getWalletTransactions(walletAddress);
  }, [isAvailable]);

  const saveTransactionsBatch = useCallback(async (transactions: CachedTransaction[]) => {
    if (!isAvailable) return false;
    return saveTransactions(transactions);
  }, [isAvailable]);

  const deleteCache = useCallback(async (walletAddress: string) => {
    if (!isAvailable) return false;
    return deleteWalletCache(walletAddress);
  }, [isAvailable]);

  const clearAll = useCallback(async () => {
    if (!isAvailable) return false;
    return clearAllCache();
  }, [isAvailable]);

  return {
    isAvailable,
    isReady,
    getMetadata,
    saveMetadata,
    getTransactions,
    saveTransactionsBatch,
    deleteCache,
    clearAll,
  };
}
