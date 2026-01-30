"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/hooks/usePlayer";
import { usePerks } from "@/hooks/usePerks";
import { PerkCard } from "@/components/PerkCard";
import { getPushupsPerClick, calculatePushupsPerSecond } from "@/lib/perks";

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
  amount: number;
}

// How recently user must have clicked for animation to continue
const CLICK_TIMEOUT_MS = 300;

export function GigaClicker() {
  const { player, isLoading, localPushups, addPushups, perks, setLocalPushups, setPerks } = usePlayer();
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useRef(false);
  const lastClickTime = useRef(0);

  const {
    perks: perkDefinitions,
    perkLevels,
    setPerkLevels,
    purchasePerk,
    getPerkCost,
    getPerkLevel,
    pushupsPerClick,
    pushupsPerSecond,
    isPurchasing,
  } = usePerks({
    localPushups,
    onPurchaseSuccess: (newTotal, newPerks) => {
      setLocalPushups(newTotal);
      setPerks(newPerks);
    },
  });

  // Sync perk levels from player data
  const perksRef = useRef(perks);
  if (perks !== perksRef.current) {
    perksRef.current = perks;
    setPerkLevels(perks);
  }

  // Play the pushup animation
  const playPushup = useCallback(() => {
    if (videoRef.current) {
      isPlaying.current = true;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Calculate actual pushups per second from perks
  const currentPushupsPerSecond = calculatePushupsPerSecond(perks);

  // Handle video ended - continue if user clicked recently OR if auto perks are active
  const handleEnded = useCallback(() => {
    const timeSinceLastClick = Date.now() - lastClickTime.current;
    if (timeSinceLastClick < CLICK_TIMEOUT_MS || currentPushupsPerSecond > 0) {
      // Continue playing - either user is clicking or auto perks are active
      playPushup();
    } else {
      // User stopped clicking and no auto perks, stop animation
      isPlaying.current = false;
    }
  }, [playPushup, currentPushupsPerSecond]);

  // Start auto-animation when pushupsPerSecond > 0
  useEffect(() => {
    if (currentPushupsPerSecond > 0 && !isPlaying.current && videoRef.current) {
      playPushup();
    }
  }, [currentPushupsPerSecond, playPushup]);

  // Calculate current pushups per click from perks
  const currentPushupsPerClick = getPushupsPerClick(perks);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLVideoElement>) => {
      addPushups(currentPushupsPerClick);
      lastClickTime.current = Date.now();

      // Start playing if not already
      if (!isPlaying.current) {
        playPushup();
      }

      // Add click particle
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();

      setParticles((prev) => [...prev, { id, x, y, amount: currentPushupsPerClick }]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 600);
    },
    [addPushups, playPushup, currentPushupsPerClick, perks]
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
            src="/videos/onepushup.mp4"
            muted
            playsInline
            onClick={handleClick}
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
                +{particle.amount}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mt-8 flex gap-8 text-center">
        <div>
          <p className="text-[20px] font-bold">{currentPushupsPerClick}</p>
          <p className="text-[9px] text-[var(--dim)] uppercase tracking-[0.1em]">per click</p>
        </div>
        {pushupsPerSecond > 0 && (
          <div>
            <p className="text-[20px] font-bold text-green-400">{pushupsPerSecond}</p>
            <p className="text-[9px] text-[var(--dim)] uppercase tracking-[0.1em]">per second</p>
          </div>
        )}
      </div>

      {/* Perks section */}
      <div className="mt-16 w-full max-w-2xl px-6">
        {/* Multiplier perks */}
        <p className="text-[10px] text-[var(--dim)] uppercase tracking-[0.2em] text-center mb-4">
          Multipliers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] mb-8">
          {perkDefinitions.filter(p => p.effectType === 'multiplier').map((perk) => (
            <PerkCard
              key={perk.id}
              perk={perk}
              level={getPerkLevel(perk.id)}
              cost={getPerkCost(perk.id)}
              canAfford={localPushups >= getPerkCost(perk.id)}
              isPurchasing={isPurchasing === perk.id}
              onPurchase={() => purchasePerk(perk.id)}
            />
          ))}
        </div>

        {/* Auto perks */}
        <p className="text-[10px] text-[var(--dim)] uppercase tracking-[0.2em] text-center mb-4">
          Auto-Pushups
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
          {perkDefinitions.filter(p => p.effectType === 'auto').map((perk) => (
            <PerkCard
              key={perk.id}
              perk={perk}
              level={getPerkLevel(perk.id)}
              cost={getPerkCost(perk.id)}
              canAfford={localPushups >= getPerkCost(perk.id)}
              isPurchasing={isPurchasing === perk.id}
              onPurchase={() => purchasePerk(perk.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
