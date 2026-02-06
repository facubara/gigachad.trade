import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashWalletAddressSync } from "@/lib/privacy";

interface GlobalStatsResponse {
  totalWalletsAnalyzed: number;
  entryPriceP25: number | null;
  entryPriceP50: number | null;
  entryPriceP75: number | null;
  avgEntryPrice: number | null;
  lastUpdated: string;
  userPercentile?: number;
}

/**
 * GET /api/stats/global
 * Get global entry price statistics and optionally user's percentile
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const entryPriceParam = searchParams.get("entryPrice");

    // Fetch global stats
    const globalStats = await prisma.globalStats.findUnique({
      where: { id: "current" },
    });

    if (!globalStats) {
      return NextResponse.json({
        totalWalletsAnalyzed: 0,
        entryPriceP25: null,
        entryPriceP50: null,
        entryPriceP75: null,
        avgEntryPrice: null,
        lastUpdated: new Date().toISOString(),
      });
    }

    const response: GlobalStatsResponse = {
      totalWalletsAnalyzed: globalStats.totalWalletsAnalyzed,
      entryPriceP25: globalStats.entryPriceP25,
      entryPriceP50: globalStats.entryPriceP50,
      entryPriceP75: globalStats.entryPriceP75,
      avgEntryPrice: globalStats.avgEntryPrice,
      lastUpdated: globalStats.lastUpdated.toISOString(),
    };

    // Calculate user's percentile if entry price provided
    if (entryPriceParam) {
      const entryPrice = parseFloat(entryPriceParam);
      if (!isNaN(entryPrice) && entryPrice > 0) {
        // Count how many wallets have a higher entry price (worse entry)
        const walletsWithHigherEntry = await prisma.walletStats.count({
          where: {
            weightedAvgEntryPrice: { gt: entryPrice },
          },
        });

        // Check if user's wallet is already in the database
        let isUserInDb = false;
        if (address) {
          const walletHash = hashWalletAddressSync(address);
          const userWallet = await prisma.walletStats.findUnique({
            where: { walletHash },
          });
          isUserInDb = !!userWallet;
        }

        // Calculate percentile
        // If user is in DB, total includes them; if not, we add 1 to denominator
        const total = isUserInDb
          ? globalStats.totalWalletsAnalyzed
          : globalStats.totalWalletsAnalyzed + 1;

        // Percentile = % of wallets with higher entry price (i.e., worse entry)
        response.userPercentile = Math.round((walletsWithHigherEntry / total) * 100);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Error fetching global stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch global stats" },
      { status: 500 }
    );
  }
}
