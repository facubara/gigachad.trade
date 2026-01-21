"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface PlayerData {
  playerId: string;
  displayName: string;
  totalPushups: number;
  pushupsPerSecond: number;
}

interface UsePlayerResult {
  player: PlayerData | null;
  isLoading: boolean;
  error: string | null;
  addPushups: (count: number) => void;
  localPushups: number;
}

// Batch pushup updates to reduce API calls
const SYNC_INTERVAL_MS = 2000;

export function usePlayer(): UsePlayerResult {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPushups, setLocalPushups] = useState(0);

  // Pending pushups to sync with server
  const pendingPushups = useRef(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize player
  useEffect(() => {
    async function initPlayer() {
      try {
        const response = await fetch("/api/player/init", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to initialize player");
        }

        const data: PlayerData = await response.json();
        setPlayer(data);
        setLocalPushups(data.totalPushups);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    initPlayer();
  }, []);

  // Sync pending pushups with server
  const syncPushups = useCallback(async () => {
    if (pendingPushups.current === 0) return;

    const delta = pendingPushups.current;
    pendingPushups.current = 0;

    try {
      const response = await fetch("/api/player/pushups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delta }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlayer((prev) =>
          prev
            ? {
                ...prev,
                totalPushups: data.totalPushups,
                pushupsPerSecond: data.pushupsPerSecond,
              }
            : null
        );
      }
    } catch {
      // On error, add back to pending
      pendingPushups.current += delta;
    }
  }, []);

  // Cleanup sync timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      // Final sync on unmount
      syncPushups();
    };
  }, [syncPushups]);

  // Add pushups with optimistic update
  const addPushups = useCallback((count: number) => {
    // Optimistic local update
    setLocalPushups((prev) => prev + count);
    pendingPushups.current += count;

    // Schedule sync if not already scheduled
    if (!syncTimeoutRef.current) {
      syncTimeoutRef.current = setTimeout(() => {
        syncTimeoutRef.current = null;
        syncPushups();
      }, SYNC_INTERVAL_MS);
    }
  }, [syncPushups]);

  return {
    player,
    isLoading,
    error,
    addPushups,
    localPushups,
  };
}
