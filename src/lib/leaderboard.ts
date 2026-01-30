import { prisma } from "./db";
import { randomUUID } from "crypto";

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  displayName: string;
  totalPushups: number;
  pushupsPerSecond: number;
  isCurrentPlayer: boolean;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  currentPlayerRank: number | null;
  totalPlayers: number;
  lastRefreshed: Date;
  nextRefresh: Date;
}

/**
 * Check if the leaderboard needs to be refreshed (older than 24h)
 */
async function shouldRefresh(): Promise<boolean> {
  const meta = await prisma.leaderboardMeta.findUnique({
    where: { id: "current" },
  });

  if (!meta) return true;

  const now = new Date();
  const timeSinceRefresh = now.getTime() - meta.lastRefreshed.getTime();
  return timeSinceRefresh >= REFRESH_INTERVAL_MS;
}

/**
 * Refresh the leaderboard snapshot from current player data
 */
export async function refreshLeaderboard(): Promise<string> {
  const snapshotId = randomUUID();
  const now = new Date();

  // Get all players sorted by totalPushups
  const players = await prisma.player.findMany({
    orderBy: { totalPushups: "desc" },
  });

  // Create new leaderboard entries
  const entries = players.map((player, index) => ({
    rank: index + 1,
    playerId: player.id,
    displayName: player.displayName,
    totalPushups: player.totalPushups,
    pushupsPerSecond: player.pushupsPerSecond,
    snapshotId,
  }));

  // Use transaction to update atomically
  await prisma.$transaction([
    // Delete old entries
    prisma.leaderboardEntry.deleteMany({}),
    // Insert new entries
    prisma.leaderboardEntry.createMany({ data: entries }),
    // Update metadata
    prisma.leaderboardMeta.upsert({
      where: { id: "current" },
      update: {
        snapshotId,
        lastRefreshed: now,
        totalPlayers: players.length,
      },
      create: {
        id: "current",
        snapshotId,
        lastRefreshed: now,
        totalPlayers: players.length,
      },
    }),
  ]);

  return snapshotId;
}

/**
 * Get the current leaderboard (refreshes if older than 24h)
 */
export async function getLeaderboard(
  currentPlayerId: string | null,
  limit: number = 50
): Promise<LeaderboardData> {
  // Check if refresh is needed
  if (await shouldRefresh()) {
    await refreshLeaderboard();
  }

  // Get metadata
  const meta = await prisma.leaderboardMeta.findUnique({
    where: { id: "current" },
  });

  if (!meta) {
    // No data yet
    return {
      entries: [],
      currentPlayerRank: null,
      totalPlayers: 0,
      lastRefreshed: new Date(),
      nextRefresh: new Date(Date.now() + REFRESH_INTERVAL_MS),
    };
  }

  // Get leaderboard entries
  const dbEntries = await prisma.leaderboardEntry.findMany({
    where: { snapshotId: meta.snapshotId },
    orderBy: { rank: "asc" },
    take: limit,
  });

  // Find current player's rank
  let currentPlayerRank: number | null = null;
  if (currentPlayerId) {
    const playerEntry = await prisma.leaderboardEntry.findFirst({
      where: {
        snapshotId: meta.snapshotId,
        playerId: currentPlayerId,
      },
    });
    if (playerEntry) {
      currentPlayerRank = playerEntry.rank;
    }
  }

  // Map to response format
  const entries: LeaderboardEntry[] = dbEntries.map((entry) => ({
    rank: entry.rank,
    playerId: entry.playerId,
    displayName: entry.displayName,
    totalPushups: entry.totalPushups,
    pushupsPerSecond: entry.pushupsPerSecond,
    isCurrentPlayer: entry.playerId === currentPlayerId,
  }));

  return {
    entries,
    currentPlayerRank,
    totalPlayers: meta.totalPlayers,
    lastRefreshed: meta.lastRefreshed,
    nextRefresh: new Date(meta.lastRefreshed.getTime() + REFRESH_INTERVAL_MS),
  };
}

/**
 * Force refresh the leaderboard (for admin use)
 */
export async function forceRefreshLeaderboard(): Promise<void> {
  await refreshLeaderboard();
}
