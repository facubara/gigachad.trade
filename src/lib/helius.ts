/**
 * Helius API client for fetching and parsing Solana transaction history.
 * Used to calculate average entry price for GIGACHAD holders.
 */

import { TOKEN_MINT } from "./constants";
import { FetchProgressCallback } from "@/types/cache";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Options for fetching transaction history
export interface FetchOptions {
  untilSignature?: string;  // Stop fetching when this signature is found
  onProgress?: FetchProgressCallback;  // Progress callback
}

// Known stablecoin/quote token mints for price calculation
const QUOTE_TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
} as const;

export interface TokenTransfer {
  mint: string;
  amount: number;
  fromUserAccount: string;
  toUserAccount: string;
}

export interface ParsedTransaction {
  signature: string;
  timestamp: number;
  type: "buy" | "sell" | "unknown";
  gigachadAmount: number;
  quoteAmount: number;
  quoteMint: string;
  pricePerToken: number; // In quote token terms (SOL or USD)
}

export interface WalletAnalysis {
  address: string;
  totalBought: number;
  totalSold: number;
  netHoldings: number;
  weightedAverageEntryPrice: number; // In USD
  transactions: ParsedTransaction[];
  analyzedAt: number;
}

interface TokenBalanceChange {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: {
    tokenAmount: string;
    decimals: number;
  };
}

interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
}

interface HeliusTransaction {
  signature: string;
  timestamp: number;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  tokenTransfers?: {
    mint: string;
    tokenAmount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
  nativeTransfers?: {
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
  accountData?: AccountData[];
}

/**
 * Result from fetchTransactionHistory including metadata for caching
 */
export interface FetchResult {
  transactions: HeliusTransaction[];
  stoppedEarly: boolean;  // True if we stopped due to finding untilSignature
  totalFetched: number;
}

/**
 * Fetch parsed transaction history for a wallet from Helius
 * Paginates through all transactions to get complete history
 * Supports incremental fetching via untilSignature parameter
 */
async function fetchTransactionHistory(
  walletAddress: string,
  options: FetchOptions = {}
): Promise<FetchResult> {
  if (!HELIUS_API_KEY) {
    throw new Error("HELIUS_API_KEY not configured");
  }

  const { untilSignature, onProgress } = options;
  const isIncremental = !!untilSignature;

  const allTransactions: HeliusTransaction[] = [];
  let lastSignature: string | undefined;
  const MAX_PAGES = 50; // Safety limit - allows up to 5000 transactions
  let page = 0;
  let stoppedEarly = false;

  while (page < MAX_PAGES) {
    const url = new URL(`https://api.helius.xyz/v0/addresses/${walletAddress}/transactions`);
    url.searchParams.set("api-key", HELIUS_API_KEY);
    url.searchParams.set("limit", "100");
    if (lastSignature) {
      url.searchParams.set("before", lastSignature);
    }

    const txResponse = await fetch(url.toString());

    if (!txResponse.ok) {
      throw new Error(`Helius API error: ${txResponse.status}`);
    }

    const transactions: HeliusTransaction[] = await txResponse.json();

    if (transactions.length === 0) {
      break; // No more transactions
    }

    // Check for untilSignature in this batch (incremental fetch)
    if (untilSignature) {
      const stopIndex = transactions.findIndex(tx => tx.signature === untilSignature);
      if (stopIndex !== -1) {
        // Only add transactions before the cached one
        allTransactions.push(...transactions.slice(0, stopIndex));
        stoppedEarly = true;
        break;
      }
    }

    allTransactions.push(...transactions);
    lastSignature = transactions[transactions.length - 1].signature;
    page++;

    // Report progress
    if (onProgress) {
      onProgress({
        currentPage: page,
        transactionsLoaded: allTransactions.length,
        isIncremental,
      });
    }

    // If we got less than 100, we've reached the end
    if (transactions.length < 100) {
      break;
    }
  }

  return {
    transactions: allTransactions,
    stoppedEarly,
    totalFetched: allTransactions.length,
  };
}

/**
 * Fetch current SOL price in USD for historical price calculations
 */
async function fetchSolPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const data = await response.json();
    return data.solana?.usd ?? 150; // Fallback to reasonable estimate
  } catch {
    return 150; // Fallback
  }
}

/**
 * Parse a Helius transaction to extract GIGACHAD buy/sell data
 * Uses accountData.tokenBalanceChanges for accurate detection
 */
function parseTransaction(
  tx: HeliusTransaction,
  walletAddress: string,
  solPriceUsd: number
): ParsedTransaction | null {
  const accountData = tx.accountData ?? [];

  // Find GIGACHAD balance change for this wallet using accountData
  let gigachadChange: TokenBalanceChange | null = null;
  for (const acc of accountData) {
    if (acc.tokenBalanceChanges) {
      const change = acc.tokenBalanceChanges.find(
        (c) => c.mint === TOKEN_MINT && c.userAccount === walletAddress
      );
      if (change) {
        gigachadChange = change;
        break;
      }
    }
  }

  if (!gigachadChange) return null;

  const rawAmount = parseInt(gigachadChange.rawTokenAmount.tokenAmount);
  const decimals = gigachadChange.rawTokenAmount.decimals;
  const gigachadAmount = Math.abs(rawAmount) / Math.pow(10, decimals);

  // Positive = receiving (buy), Negative = sending (sell)
  const isReceiving = rawAmount > 0;

  // Find SOL/USDC/USDT balance change for price calculation
  let quoteAmount = 0;
  let quoteMint: string = QUOTE_TOKENS.SOL;

  for (const acc of accountData) {
    // Check for SOL (native) balance change
    if (acc.nativeBalanceChange !== 0) {
      // Find if this is the wallet's account
      const hasWalletTokenChange = acc.tokenBalanceChanges?.some(
        (c) => c.userAccount === walletAddress
      );
      if (hasWalletTokenChange || acc.account === walletAddress) {
        // Skip small amounts (likely fees)
        if (Math.abs(acc.nativeBalanceChange) > 100000) {
          quoteAmount = Math.abs(acc.nativeBalanceChange) / 1e9;
          quoteMint = QUOTE_TOKENS.SOL;
        }
      }
    }

    // Check for stablecoin balance changes
    if (acc.tokenBalanceChanges) {
      for (const change of acc.tokenBalanceChanges) {
        if (
          change.userAccount === walletAddress &&
          (change.mint === QUOTE_TOKENS.USDC || change.mint === QUOTE_TOKENS.USDT)
        ) {
          const stableRawAmount = parseInt(change.rawTokenAmount.tokenAmount);
          const stableDecimals = change.rawTokenAmount.decimals;
          quoteAmount = Math.abs(stableRawAmount) / Math.pow(10, stableDecimals);
          quoteMint = change.mint;
        }
      }
    }
  }

  // Calculate price per token
  let pricePerToken = 0;
  if (gigachadAmount > 0 && quoteAmount > 0) {
    if (quoteMint === QUOTE_TOKENS.SOL) {
      pricePerToken = (quoteAmount * solPriceUsd) / gigachadAmount;
    } else {
      pricePerToken = quoteAmount / gigachadAmount;
    }
  }

  return {
    signature: tx.signature,
    timestamp: tx.timestamp * 1000,
    type: isReceiving ? "buy" : "sell",
    gigachadAmount,
    quoteAmount,
    quoteMint,
    pricePerToken,
  };
}

/**
 * Extended analysis result with caching metadata
 */
export interface ExtendedWalletAnalysis extends WalletAnalysis {
  newestTxSignature?: string;
  newestTxTimestamp?: number;
  fetchedCount: number;
  wasIncremental: boolean;
}

/**
 * Analyze a wallet's GIGACHAD transaction history
 * Supports incremental fetching for caching
 */
export async function analyzeWallet(
  walletAddress: string,
  options: FetchOptions = {}
): Promise<ExtendedWalletAnalysis> {
  const [fetchResult, solPrice] = await Promise.all([
    fetchTransactionHistory(walletAddress, options),
    fetchSolPrice(),
  ]);

  const { transactions, stoppedEarly, totalFetched } = fetchResult;

  console.log(`[Helius] Fetched ${transactions.length} total transactions for wallet`);
  console.log(`[Helius] Incremental: ${!!options.untilSignature}, Stopped early: ${stoppedEarly}`);
  console.log(`[Helius] Current SOL price: $${solPrice}`);

  const parsedTxs: ParsedTransaction[] = [];
  let totalBought = 0;
  let totalSold = 0;
  let weightedSum = 0;

  for (const tx of transactions) {
    const parsed = parseTransaction(tx, walletAddress, solPrice);
    if (parsed) {
      parsedTxs.push(parsed);

      if (parsed.type === "buy") {
        totalBought += parsed.gigachadAmount;
        weightedSum += parsed.gigachadAmount * parsed.pricePerToken;
      } else {
        totalSold += parsed.gigachadAmount;
      }
    }
  }

  // Sort by timestamp descending (newest first)
  parsedTxs.sort((a, b) => b.timestamp - a.timestamp);

  const weightedAverageEntryPrice =
    totalBought > 0 ? weightedSum / totalBought : 0;

  // Console logging for debugging
  console.log(`[Analysis] Found ${parsedTxs.length} GIGACHAD transactions`);
  console.log(`[Analysis] Buy transactions: ${parsedTxs.filter(t => t.type === 'buy').length}`);
  console.log(`[Analysis] Sell transactions: ${parsedTxs.filter(t => t.type === 'sell').length}`);
  console.log(`[Analysis] Total GIGA bought: ${totalBought.toLocaleString()}`);
  console.log(`[Analysis] Total GIGA sold: ${totalSold.toLocaleString()}`);
  console.log(`[Analysis] Weighted avg entry price: $${weightedAverageEntryPrice.toFixed(10)}`);
  console.log(`[Analysis] Raw transactions:`, parsedTxs);

  // Get newest transaction for caching metadata
  const newestTx = parsedTxs.length > 0 ? parsedTxs[0] : null;

  return {
    address: walletAddress,
    totalBought,
    totalSold,
    netHoldings: totalBought - totalSold,
    weightedAverageEntryPrice,
    transactions: parsedTxs,
    analyzedAt: Date.now(),
    newestTxSignature: newestTx?.signature,
    newestTxTimestamp: newestTx?.timestamp,
    fetchedCount: totalFetched,
    wasIncremental: stoppedEarly,
  };
}

/**
 * Fetch token balance for a wallet using standard Solana RPC
 */
export async function fetchTokenBalance(
  walletAddress: string
): Promise<number> {
  if (!HELIUS_API_KEY) {
    throw new Error("HELIUS_API_KEY not configured");
  }

  const response = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "get-token-accounts",
      method: "getTokenAccountsByOwner",
      params: [
        walletAddress,
        { mint: TOKEN_MINT },
        { encoding: "jsonParsed" },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC error: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const accounts = data.result?.value ?? [];
  if (accounts.length === 0) {
    return 0;
  }

  // Sum up all token accounts (usually just one)
  let totalBalance = 0;
  for (const account of accounts) {
    const amount =
      account.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
    totalBalance += amount;
  }

  return totalBalance;
}
