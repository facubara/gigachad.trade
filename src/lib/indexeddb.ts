/**
 * IndexedDB wrapper for caching wallet transactions locally.
 * Provides graceful degradation if IndexedDB is unavailable.
 */

import { WalletMetadata, CachedTransaction } from "@/types/cache";

const DB_NAME = "gigachad-wallet-cache";
const DB_VERSION = 1;
const WALLETS_STORE = "wallets";
const TRANSACTIONS_STORE = "transactions";
const MAX_CACHED_WALLETS = 10;

let dbInstance: IDBDatabase | null = null;
let dbInitPromise: Promise<IDBDatabase | null> | null = null;

/**
 * Check if IndexedDB is available (not in SSR, private browsing, etc.)
 */
export function isIndexedDBAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof indexedDB === "undefined") return false;
  return true;
}

/**
 * Open/initialize the IndexedDB database
 */
export async function openDatabase(): Promise<IDBDatabase | null> {
  if (!isIndexedDBAvailable()) {
    console.warn("[IndexedDB] Not available in this environment");
    return null;
  }

  // Return existing instance if available
  if (dbInstance) return dbInstance;

  // Return existing promise if initialization is in progress
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.warn("[IndexedDB] Failed to open database:", request.error);
        resolve(null);
      };

      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create wallets store with address as keyPath
        if (!db.objectStoreNames.contains(WALLETS_STORE)) {
          db.createObjectStore(WALLETS_STORE, { keyPath: "address" });
        }

        // Create transactions store with id as keyPath and walletAddress index
        if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
          const txStore = db.createObjectStore(TRANSACTIONS_STORE, {
            keyPath: "id",
          });
          txStore.createIndex("walletAddress", "walletAddress", {
            unique: false,
          });
        }
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception opening database:", error);
      resolve(null);
    }
  });

  return dbInitPromise;
}

/**
 * Get wallet metadata from cache
 */
export async function getWalletMetadata(
  address: string
): Promise<WalletMetadata | null> {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(WALLETS_STORE, "readonly");
      const store = tx.objectStore(WALLETS_STORE);
      const request = store.get(address);

      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => {
        console.warn("[IndexedDB] Error getting wallet metadata:", request.error);
        resolve(null);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception getting wallet metadata:", error);
      resolve(null);
    }
  });
}

/**
 * Save wallet metadata to cache
 */
export async function saveWalletMetadata(
  metadata: WalletMetadata
): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  // Enforce LRU eviction before saving
  await evictOldestWallets(db);

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(WALLETS_STORE, "readwrite");
      const store = tx.objectStore(WALLETS_STORE);
      const request = store.put(metadata);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.warn("[IndexedDB] Error saving wallet metadata:", request.error);
        resolve(false);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception saving wallet metadata:", error);
      resolve(false);
    }
  });
}

/**
 * Get all cached transactions for a wallet
 */
export async function getWalletTransactions(
  walletAddress: string
): Promise<CachedTransaction[]> {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(TRANSACTIONS_STORE, "readonly");
      const store = tx.objectStore(TRANSACTIONS_STORE);
      const index = store.index("walletAddress");
      const request = index.getAll(walletAddress);

      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => {
        console.warn("[IndexedDB] Error getting transactions:", request.error);
        resolve([]);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception getting transactions:", error);
      resolve([]);
    }
  });
}

/**
 * Save transactions to cache (batch insert)
 */
export async function saveTransactions(
  transactions: CachedTransaction[]
): Promise<boolean> {
  const db = await openDatabase();
  if (!db || transactions.length === 0) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(TRANSACTIONS_STORE, "readwrite");
      const store = tx.objectStore(TRANSACTIONS_STORE);

      let completed = 0;
      let hasError = false;

      for (const transaction of transactions) {
        const request = store.put(transaction);
        request.onsuccess = () => {
          completed++;
          if (completed === transactions.length && !hasError) {
            resolve(true);
          }
        };
        request.onerror = () => {
          if (!hasError) {
            hasError = true;
            console.warn("[IndexedDB] Error saving transaction:", request.error);
            resolve(false);
          }
        };
      }

      // Handle empty transactions array edge case
      if (transactions.length === 0) {
        resolve(true);
      }
    } catch (error) {
      console.warn("[IndexedDB] Exception saving transactions:", error);
      resolve(false);
    }
  });
}

/**
 * Delete all transactions for a wallet
 */
export async function deleteWalletTransactions(
  walletAddress: string
): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(TRANSACTIONS_STORE, "readwrite");
      const store = tx.objectStore(TRANSACTIONS_STORE);
      const index = store.index("walletAddress");
      const request = index.openCursor(walletAddress);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        console.warn("[IndexedDB] Error deleting transactions:", tx.error);
        resolve(false);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception deleting transactions:", error);
      resolve(false);
    }
  });
}

/**
 * Delete a wallet and all its transactions from cache
 */
export async function deleteWalletCache(walletAddress: string): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  // Delete transactions first
  await deleteWalletTransactions(walletAddress);

  // Then delete wallet metadata
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(WALLETS_STORE, "readwrite");
      const store = tx.objectStore(WALLETS_STORE);
      const request = store.delete(walletAddress);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.warn("[IndexedDB] Error deleting wallet:", request.error);
        resolve(false);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception deleting wallet:", error);
      resolve(false);
    }
  });
}

/**
 * Get all wallet metadata entries for LRU eviction
 */
async function getAllWalletMetadata(
  db: IDBDatabase
): Promise<WalletMetadata[]> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(WALLETS_STORE, "readonly");
      const store = tx.objectStore(WALLETS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => {
        console.warn("[IndexedDB] Error getting all wallets:", request.error);
        resolve([]);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception getting all wallets:", error);
      resolve([]);
    }
  });
}

/**
 * Evict oldest wallets if we exceed MAX_CACHED_WALLETS
 */
async function evictOldestWallets(db: IDBDatabase): Promise<void> {
  const wallets = await getAllWalletMetadata(db);

  if (wallets.length < MAX_CACHED_WALLETS) return;

  // Sort by lastFetchedAt ascending (oldest first)
  wallets.sort((a, b) => a.lastFetchedAt - b.lastFetchedAt);

  // Remove oldest wallets until we're under the limit (leaving room for 1 new one)
  const walletsToRemove = wallets.slice(0, wallets.length - MAX_CACHED_WALLETS + 1);

  for (const wallet of walletsToRemove) {
    console.log(`[IndexedDB] Evicting old wallet cache: ${wallet.address.slice(0, 8)}...`);
    await deleteWalletCache(wallet.address);
  }
}

/**
 * Clear all cached data
 */
export async function clearAllCache(): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction([WALLETS_STORE, TRANSACTIONS_STORE], "readwrite");

      tx.objectStore(WALLETS_STORE).clear();
      tx.objectStore(TRANSACTIONS_STORE).clear();

      tx.oncomplete = () => {
        console.log("[IndexedDB] All cache cleared");
        resolve(true);
      };
      tx.onerror = () => {
        console.warn("[IndexedDB] Error clearing cache:", tx.error);
        resolve(false);
      };
    } catch (error) {
      console.warn("[IndexedDB] Exception clearing cache:", error);
      resolve(false);
    }
  });
}
