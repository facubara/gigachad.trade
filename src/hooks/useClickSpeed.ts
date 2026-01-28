"use client";

import { useState, useRef, useCallback } from "react";

interface UseClickSpeedOptions {
  maxRate?: number;
  baseRate: number;
}

interface UseClickSpeedResult {
  playbackRate: number;
  recordClick: () => void;
  onCycleComplete: () => void;
}

const CLICK_WINDOW_MS = 500;

export function useClickSpeed({
  maxRate = 4,
  baseRate,
}: UseClickSpeedOptions): UseClickSpeedResult {
  const [playbackRate, setPlaybackRate] = useState(baseRate);
  const clickTimestamps = useRef<number[]>([]);
  const pendingCycles = useRef(0);

  // Calculate speed based on recent click frequency
  const calculateSpeed = useCallback(() => {
    const now = Date.now();
    // Count clicks in the last 500ms
    const recentClicks = clickTimestamps.current.filter(
      (t) => now - t < CLICK_WINDOW_MS
    );

    // Base speed is 1x, increases with click rate
    // 1 click = 1x, 2 clicks in 500ms = 1.5x, etc.
    const clickSpeed = Math.max(1, recentClicks.length * 0.75);
    return Math.min(baseRate + clickSpeed, maxRate);
  }, [baseRate, maxRate]);

  // Record a click - adds a pending cycle
  const recordClick = useCallback(() => {
    const now = Date.now();

    // Add timestamp
    clickTimestamps.current.push(now);
    // Keep only recent clicks
    clickTimestamps.current = clickTimestamps.current.filter(
      (t) => now - t < CLICK_WINDOW_MS * 2
    );

    // Add a pending cycle
    pendingCycles.current += 1;

    // Calculate and set speed
    const speed = calculateSpeed();
    setPlaybackRate(speed);
  }, [calculateSpeed]);

  // Called when video completes a cycle
  const onCycleComplete = useCallback(() => {
    if (pendingCycles.current > 0) {
      pendingCycles.current -= 1;
    }

    if (pendingCycles.current <= 0) {
      // No more pending cycles - stop
      setPlaybackRate(baseRate);
    } else {
      // More cycles pending - recalculate speed
      const speed = calculateSpeed();
      setPlaybackRate(speed);
    }
  }, [baseRate, calculateSpeed]);

  return {
    playbackRate,
    recordClick,
    onCycleComplete,
  };
}
