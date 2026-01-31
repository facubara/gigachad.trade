"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  totalPushups: number;
  pushupsPerSecond: number;
  isCurrentPlayer: boolean;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  currentPlayerRank: number | null;
  totalPlayers: number;
  lastRefreshed: string;
  nextRefresh: string;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m ago`;
  }
  return `${diffMinutes}m ago`;
}

function formatTimeUntil(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  if (diffMs <= 0) return "Soon";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `in ${diffHours}h ${diffMinutes}m`;
  }
  return `in ${diffMinutes}m`;
}

function getRankStyle(rank: number): string {
  switch (rank) {
    case 1:
      return "text-yellow-400"; // Gold
    case 2:
      return "text-gray-300"; // Silver
    case 3:
      return "text-amber-600"; // Bronze
    default:
      return "text-[var(--muted)]";
  }
}

function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
}

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard?limit=50");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const leaderboardData: LeaderboardResponse = await response.json();
        setData(leaderboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();

    // Refresh leaderboard every 30 minutes
    const interval = setInterval(fetchLeaderboard, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[600px] mx-auto">
        <div className="animate-pulse space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--steel)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[600px] mx-auto text-center">
        <p className="text-[var(--negative)] text-[11px] tracking-[0.05em]">
          {error}
        </p>
      </div>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="w-full max-w-[600px] mx-auto text-center">
        <p className="text-[var(--dim)] text-[11px] tracking-[0.05em]">
          No players yet. Be the first to start grinding!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Stats Header */}
      <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-[var(--border)]">
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-[var(--dim)] tracking-[0.1em] uppercase">
            {data.totalPlayers} Players
          </p>
          {data.currentPlayerRank && (
            <p className="text-[10px] text-[var(--muted)] tracking-[0.1em] uppercase">
              Your Rank: <span className="text-[var(--white)]">#{data.currentPlayerRank}</span>
            </p>
          )}
        </div>
        {/* Refresh Info */}
        <div className="flex justify-between items-center text-[9px] text-[var(--dim)] tracking-[0.05em]">
          <span>Updated: {formatTimeAgo(data.lastRefreshed)}</span>
          <span>Next refresh: {formatTimeUntil(data.nextRefresh)}</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[50px_1fr_100px_80px] gap-2 px-4 py-2 text-[9px] text-[var(--dim)] tracking-[0.1em] uppercase border-b border-[var(--border)]">
        <span>Rank</span>
        <span>Player</span>
        <span className="text-right">Pushups</span>
        <span className="text-right">Per Sec</span>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-1 mt-1">
        {data.entries.map((entry) => (
          <LeaderboardRow key={`${entry.rank}-${entry.displayName}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isTopThree = entry.rank <= 3;

  return (
    <div
      className={`
        grid grid-cols-[50px_1fr_100px_80px] gap-2 px-4 py-3
        transition-colors duration-200
        ${entry.isCurrentPlayer
          ? "bg-[var(--purple)] bg-opacity-20 border border-[var(--purple)]"
          : "bg-[var(--steel)] hover:bg-[var(--charcoal)]"
        }
      `}
    >
      {/* Rank */}
      <span className={`text-[11px] font-bold tracking-[0.05em] ${getRankStyle(entry.rank)}`}>
        {getRankEmoji(entry.rank)} {entry.rank}
      </span>

      {/* Player Name */}
      <span className={`text-[11px] tracking-[0.05em] ${
        entry.isCurrentPlayer ? "text-[var(--white)] font-medium" : "text-[var(--muted)]"
      }`}>
        {entry.displayName}
        {entry.isCurrentPlayer && (
          <span className="ml-2 text-[9px] text-[var(--purple)]">(You)</span>
        )}
      </span>

      {/* Total Pushups */}
      <span className={`text-[11px] text-right tracking-[0.05em] ${
        isTopThree ? "text-[var(--white)] font-medium" : "text-[var(--muted)]"
      }`}>
        {formatNumber(entry.totalPushups)}
      </span>

      {/* Pushups Per Second */}
      <span className="text-[10px] text-right text-green-400 tracking-[0.05em]">
        +{formatNumber(entry.pushupsPerSecond)}/s
      </span>
    </div>
  );
}
