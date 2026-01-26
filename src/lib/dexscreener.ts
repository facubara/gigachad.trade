/**
 * DexScreener API client for fetching token price data.
 */

import { DEXSCREENER_API_URL, TOKEN_MINT } from "./constants";

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h24: number;
  };
  volume: {
    h24: number;
    h6?: number;
    h1?: number;
  };
  volumeChange?: {
    h24?: number;
  };
  liquidity: {
    usd: number;
  };
  fdv: number;
  marketCap: number;
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
}

export interface TokenPriceData {
  priceUsd: number;
  priceChange24h: number;
  marketCap: number | null;
  fdv: number | null;
  volume24h: number | null;
  volumeChange24h: number | null;
  timestamp: number;
}

/**
 * Fetches token price from DexScreener API.
 * Returns the price from the pair with highest liquidity.
 */
export async function fetchTokenPrice(): Promise<TokenPriceData> {
  const url = `${DEXSCREENER_API_URL}/${TOKEN_MINT}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    // No caching at fetch level - we handle caching ourselves
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }

  const data: DexScreenerResponse = await response.json();

  if (!data.pairs || data.pairs.length === 0) {
    throw new Error("No trading pairs found for token");
  }

  // Get the pair with highest liquidity for most accurate price
  const bestPair = data.pairs.reduce((best, current) => {
    const bestLiquidity = best.liquidity?.usd ?? 0;
    const currentLiquidity = current.liquidity?.usd ?? 0;
    return currentLiquidity > bestLiquidity ? current : best;
  });

  const priceUsd = parseFloat(bestPair.priceUsd);

  if (isNaN(priceUsd)) {
    throw new Error("Invalid price data from DexScreener");
  }

  return {
    priceUsd,
    priceChange24h: bestPair.priceChange?.h24 ?? 0,
    marketCap: bestPair.marketCap ?? null,
    fdv: bestPair.fdv ?? null,
    volume24h: bestPair.volume?.h24 ?? null,
    volumeChange24h: bestPair.volumeChange?.h24 ?? null,
    timestamp: Date.now(),
  };
}
