"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/hooks/usePlayer";
import { useClickSpeed } from "@/hooks/useClickSpeed";

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

// Click feedback particle
interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

export function GigaClicker() {
  const { player, isLoading, localPushups, addPushups } = usePlayer();
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(1);

  // Calculate base rate from pushupsPerSecond
  // If video is 1 second and we want 1 pushup/sec, playbackRate = 1
  const pushupsPerSecond = player?.pushupsPerSecond ?? 0;
  const baseRate = videoDuration > 0 ? videoDuration * pushupsPerSecond : 0;

  const { playbackRate, recordClick, onCycleComplete } = useClickSpeed({
    baseRate,
    maxRate: 4,
  });

  // Minimum playback rate for browsers
  const MIN_PLAYBACK_RATE = 0.5;

  // Update video playback rate
  useEffect(() => {
    if (videoRef.current) {
      if (playbackRate < MIN_PLAYBACK_RATE) {
        // Will pause at end of cycle via onEnded
      } else {
        const clampedRate = Math.min(Math.max(playbackRate, MIN_PLAYBACK_RATE), 4);
        videoRef.current.playbackRate = clampedRate;
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {
            // Autoplay may be blocked, user interaction will start it
          });
        }
      }
    }
  }, [playbackRate]);

  // Get video duration on load
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  // Handle video loop - called when video reaches the end and loops
  const handleEnded = useCallback(() => {
    onCycleComplete();

    // Check if we should pause (playbackRate went to 0)
    if (playbackRate < MIN_PLAYBACK_RATE && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [onCycleComplete, playbackRate]);

  // Since loop prevents 'ended' event, we use 'timeupdate' to detect loop
  const lastTimeRef = useRef(0);
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      // Detect when video loops (time jumps back significantly)
      if (lastTimeRef.current > 0 && currentTime < lastTimeRef.current - 0.5) {
        onCycleComplete();

        // Check if we should pause after this cycle
        if (playbackRate < MIN_PLAYBACK_RATE) {
          videoRef.current.currentTime = 0;
          videoRef.current.pause();
        }
      }
      lastTimeRef.current = currentTime;
    }
  }, [onCycleComplete, playbackRate]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLVideoElement>) => {
      addPushups(1);
      recordClick();

      // Start video if paused (first click)
      if (videoRef.current?.paused) {
        videoRef.current.playbackRate = 1;
        videoRef.current.play().catch(() => {});
      }

      // Add click particle
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();

      setParticles((prev) => [...prev, { id, x, y }]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 600);
    },
    [addPushups, recordClick]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-32 h-32 border border-[var(--border)] animate-pulse" />
        <p className="mt-8 text-[var(--dim)] text-[11px] tracking-[0.1em]">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Player info */}
      <div className="text-center mb-8">
        <p className="text-[10px] text-[var(--dim)] uppercase tracking-[0.2em]">
          {player?.displayName ?? "Unknown"}
        </p>
      </div>

      {/* Push-up counter */}
      <div className="text-center mb-16">
        <motion.p
          key={localPushups}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-[60px] md:text-[80px] font-bold tabular-nums tracking-[-0.02em]"
        >
          {formatNumber(localPushups)}
        </motion.p>
        <p className="text-[10px] text-[var(--muted)] mt-3 uppercase tracking-[0.3em]">
          Push-ups
        </p>
      </div>

      {/* Clickable video */}
      <div className="relative">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="relative overflow-hidden cursor-pointer"
        >
          <video
            ref={videoRef}
            src="/videos/pushup.mp4"
            loop
            muted
            playsInline
            onClick={handleClick}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-[320px] md:w-[500px] h-auto object-contain select-none"
            style={{ pointerEvents: "auto" }}
          />

          {/* Click particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                initial={{ opacity: 1, scale: 0.5, x: particle.x - 24, y: particle.y - 24 }}
                animate={{ opacity: 0, scale: 1.5, y: particle.y - 80 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute text-xl font-bold pointer-events-none text-[var(--white)]"
                style={{ textShadow: "0 0 10px rgba(0,0,0,0.8)" }}
              >
                +1
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Perks section placeholder */}
      <div className="mt-20 w-full max-w-lg px-6">
        <p className="text-[10px] text-[var(--dim)] uppercase tracking-[0.2em] text-center mb-6">
          Perks
        </p>
        <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
          {["Protein Powder", "Creatine", "Gym Membership", "Personal Trainer"].map(
            (perk) => (
              <div
                key={perk}
                className="p-5 bg-[var(--steel)] opacity-50 cursor-not-allowed"
              >
                <p className="font-medium text-[11px] tracking-[0.05em]">{perk}</p>
                <p className="text-[9px] text-[var(--dim)] mt-1 tracking-[0.1em] uppercase">Coming soon</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
