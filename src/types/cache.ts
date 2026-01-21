/**
 * TypeScript interfaces for IndexedDB caching of wallet transactions
 */

// Loading state for UI progress feedback
export interface LoadingState {
  status: 'idle' | 'checking-cache' | 'fetching' | 'processing' | 'complete' | 'error';
  progress?: {
    currentPage: number;
    transactionsLoaded: number;
    isIncremental: boolean;
  };
  message: string;
}

// Wallet metadata stored in IndexedDB
export interface WalletMetadata {
  address: string;              // Primary key
  lastFetchedAt: number;        // Timestamp when last fetched
  newestTxSignature: string;    // For incremental fetching
  newestTxTimestamp: number;    // Timestamp of newest cached transaction
  totalCachedTxCount: number;   // Total number of cached transactions
}

// Cached transaction stored in IndexedDB
export interface CachedTransaction {
  id: string;                   // `${walletAddress}:${signature}` - Primary key
  walletAddress: string;        // Index for querying by wallet
  signature: string;
  timestamp: number;
  type: "buy" | "sell" | "unknown";
  gigachadAmount: number;
  quoteAmount: number;
  quoteMint: string;
  pricePerToken: number;
}

// Progress callback for fetching operations
export interface FetchProgressCallback {
  (progress: {
    currentPage: number;
    transactionsLoaded: number;
    isIncremental: boolean;
  }): void;
}
