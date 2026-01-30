import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLeaderboard, forceRefreshLeaderboard } from "@/lib/leaderboard";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const cookieStore = await cookies();
  const currentPlayerId = cookieStore.get("player_id")?.value || null;

  try {
    const leaderboard = await getLeaderboard(currentPlayerId, limit);

    return NextResponse.json({
      entries: leaderboard.entries,
      currentPlayerRank: leaderboard.currentPlayerRank,
      totalPlayers: leaderboard.totalPlayers,
      lastRefreshed: leaderboard.lastRefreshed.toISOString(),
      nextRefresh: leaderboard.nextRefresh.toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

// POST endpoint to force refresh (could be protected with admin auth)
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "refresh") {
    try {
      await forceRefreshLeaderboard();
      return NextResponse.json({ success: true, message: "Leaderboard refreshed" });
    } catch (error) {
      console.error("Failed to refresh leaderboard:", error);
      return NextResponse.json(
        { error: "Failed to refresh leaderboard" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
