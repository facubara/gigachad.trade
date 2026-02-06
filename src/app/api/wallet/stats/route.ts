import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashWalletAddressSync } from "@/lib/privacy";

interface WalletStatsPayload {
  address: string;
  totalBuyCount: number;
  totalSellCount: number;
  weightedAvgEntryPrice: number;
  uniqueBuyDays: number;
  currentHoldings: number;
}

// Rate limiting: simple in-memory tracker
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

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

// Validation bounds
const MAX_ENTRY_PRICE = 1000; // $1000 max (sanity check)
const MAX_HOLDINGS = 10_000_000_000_000; // 10 trillion max
const MAX_COUNT = 1_000_000; // 1 million transactions max

/**
 * POST /api/wallet/stats
 * Store anonymous wallet stats for entry price analytics
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body: WalletStatsPayload = await request.json();

    // Validate required fields
    if (!body.address || typeof body.address !== "string") {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    // Validate Solana address format (base58, 32-44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(body.address)) {
      return NextResponse.json(
        { error: "Invalid Solana address format" },
        { status: 400 }
      );
    }

    // Validate numeric fields exist and are finite
    if (
      typeof body.totalBuyCount !== "number" ||
      typeof body.totalSellCount !== "number" ||
      typeof body.weightedAvgEntryPrice !== "number" ||
      typeof body.uniqueBuyDays !== "number" ||
      typeof body.currentHoldings !== "number" ||
      !Number.isFinite(body.totalBuyCount) ||
      !Number.isFinite(body.totalSellCount) ||
      !Number.isFinite(body.weightedAvgEntryPrice) ||
      !Number.isFinite(body.uniqueBuyDays) ||
      !Number.isFinite(body.currentHoldings)
    ) {
      return NextResponse.json(
        { error: "Invalid stats data" },
        { status: 400 }
      );
    }

    // Validate bounds (prevent abuse/garbage data)
    if (
      body.totalBuyCount < 0 || body.totalBuyCount > MAX_COUNT ||
      body.totalSellCount < 0 || body.totalSellCount > MAX_COUNT ||
      body.uniqueBuyDays < 0 || body.uniqueBuyDays > 10000 ||
      body.currentHoldings < 0 || body.currentHoldings > MAX_HOLDINGS ||
      body.weightedAvgEntryPrice > MAX_ENTRY_PRICE
    ) {
      return NextResponse.json(
        { error: "Stats values out of acceptable range" },
        { status: 400 }
      );
    }

    // Skip if no entry price (wallet has no buys)
    if (body.weightedAvgEntryPrice <= 0) {
      return NextResponse.json(
        { error: "No valid entry price to store" },
        { status: 400 }
      );
    }

    // Hash the wallet address for privacy
    const walletHash = hashWalletAddressSync(body.address);

    // Upsert wallet stats
    await prisma.walletStats.upsert({
      where: { walletHash },
      create: {
        walletHash,
        totalBuyCount: body.totalBuyCount,
        totalSellCount: body.totalSellCount,
        weightedAvgEntryPrice: body.weightedAvgEntryPrice,
        uniqueBuyDays: body.uniqueBuyDays,
        currentHoldings: body.currentHoldings,
      },
      update: {
        totalBuyCount: body.totalBuyCount,
        totalSellCount: body.totalSellCount,
        weightedAvgEntryPrice: body.weightedAvgEntryPrice,
        uniqueBuyDays: body.uniqueBuyDays,
        currentHoldings: body.currentHoldings,
        updatedAt: new Date(),
      },
    });

    // Recalculate global stats
    await recalculateGlobalStats();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error storing wallet stats:", error);
    return NextResponse.json(
      { error: "Failed to store wallet stats" },
      { status: 500 }
    );
  }
}

/**
 * Recalculate global percentile stats from all wallet data
 */
async function recalculateGlobalStats() {
  try {
    // Get all entry prices sorted
    const wallets = await prisma.walletStats.findMany({
      where: {
        weightedAvgEntryPrice: { gt: 0 },
      },
      select: {
        weightedAvgEntryPrice: true,
      },
      orderBy: {
        weightedAvgEntryPrice: "asc",
      },
    });

    const count = wallets.length;
    if (count === 0) return;

    const prices = wallets.map((w) => w.weightedAvgEntryPrice);

    // Calculate percentiles
    const p25Index = Math.floor(count * 0.25);
    const p50Index = Math.floor(count * 0.5);
    const p75Index = Math.floor(count * 0.75);

    const entryPriceP25 = prices[p25Index] ?? null;
    const entryPriceP50 = prices[p50Index] ?? null;
    const entryPriceP75 = prices[p75Index] ?? null;

    // Calculate average
    const sum = prices.reduce((acc, p) => acc + p, 0);
    const avgEntryPrice = sum / count;

    // Upsert global stats
    await prisma.globalStats.upsert({
      where: { id: "current" },
      create: {
        id: "current",
        totalWalletsAnalyzed: count,
        entryPriceP25,
        entryPriceP50,
        entryPriceP75,
        avgEntryPrice,
      },
      update: {
        totalWalletsAnalyzed: count,
        entryPriceP25,
        entryPriceP50,
        entryPriceP75,
        avgEntryPrice,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("[API] Error recalculating global stats:", error);
  }
}
