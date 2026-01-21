import { NextResponse } from "next/server";
import { memoryCache } from "@/lib/cache";
import { PRICE_CACHE_TTL_MS } from "@/lib/constants";
import { fetchTokenPrice, TokenPriceData } from "@/lib/dexscreener";

const CACHE_KEY = "token_price";

export async function GET() {
  // Check cache first
  const cached = memoryCache.get<TokenPriceData>(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const priceData = await fetchTokenPrice();

    // Cache the successful response
    memoryCache.set(CACHE_KEY, priceData, PRICE_CACHE_TTL_MS);

    return NextResponse.json(priceData);
  } catch (error) {
    // On failure, try to return stale data
    const stale = memoryCache.getStale<TokenPriceData>(CACHE_KEY);

    if (stale) {
      // Return stale data with a flag indicating it's not fresh
      return NextResponse.json(
        { ...stale, stale: true },
        { status: 200 }
      );
    }

    // No cached data available - return error
    console.error("DexScreener fetch failed:", error);
    return NextResponse.json(
      { error: "Price data unavailable" },
      { status: 502 }
    );
  }
}
