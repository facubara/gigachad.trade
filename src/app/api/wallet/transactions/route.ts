import { NextRequest, NextResponse } from "next/server";
import { analyzeWallet } from "@/lib/helius";
import { memoryCache } from "@/lib/cache";

// Cache wallet analysis for 5 minutes (transaction history doesn't change often)
const CACHE_TTL_MS = 5 * 60 * 1000;

// Rate limiting: track requests per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute (analysis is expensive)

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Solana transaction signature format: base58, 87-88 chars
const SIGNATURE_REGEX = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const address = request.nextUrl.searchParams.get("address");
  const cachedNewestSignature = request.nextUrl.searchParams.get("cachedNewestSignature");

  if (!address) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  // Basic Solana address validation (base58, 32-44 chars)
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return NextResponse.json(
      { error: "Invalid Solana address" },
      { status: 400 }
    );
  }

  // Validate cachedNewestSignature if provided (prevent injection)
  if (cachedNewestSignature && !SIGNATURE_REGEX.test(cachedNewestSignature)) {
    return NextResponse.json(
      { error: "Invalid signature format" },
      { status: 400 }
    );
  }

  // For incremental fetches, don't use server-side cache
  // Let the client manage caching via IndexedDB
  const isIncremental = !!cachedNewestSignature;
  const cacheKey = `wallet_analysis_${address}`;

  // Check server cache only for non-incremental fetches
  if (!isIncremental) {
    const cached = memoryCache.get<ReturnType<typeof analyzeWallet>>(cacheKey);
    if (cached) {
      return NextResponse.json(await cached);
    }
  }

  try {
    const analysis = await analyzeWallet(address, {
      untilSignature: cachedNewestSignature ?? undefined,
    });

    // Only cache full fetches on the server
    if (!isIncremental) {
      memoryCache.set(cacheKey, analysis, CACHE_TTL_MS);
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing wallet:", error);

    // Try stale cache on error (only for non-incremental)
    if (!isIncremental) {
      const stale = memoryCache.getStale<ReturnType<typeof analyzeWallet>>(cacheKey);
      if (stale) {
        return NextResponse.json({ ...(await stale), stale: true });
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze wallet transactions" },
      { status: 502 }
    );
  }
}
