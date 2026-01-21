"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/hooks/usePlayer";

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
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      addPushups(1);

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
    [addPushups]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-32 h-32 bg-[var(--border)] rounded-full animate-pulse" />
        <p className="mt-8 text-[var(--muted)]">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Player info */}
      <div className="text-center mb-8">
        <p className="text-sm text-[var(--muted)] uppercase tracking-widest">
          {player?.displayName ?? "Unknown"}
        </p>
      </div>

      {/* Push-up counter */}
      <div className="text-center mb-12">
        <motion.p
          key={localPushups}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-5xl md:text-7xl font-black tabular-nums"
        >
          {formatNumber(localPushups)}
        </motion.p>
        <p className="text-lg text-[var(--muted)] mt-2 uppercase tracking-widest">
          Push-ups
        </p>
      </div>

      {/* Click button */}
      <div className="relative">
        <motion.button
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          animate={{
            scale: isPressed ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[var(--accent)] to-yellow-600 text-black font-black text-3xl md:text-4xl uppercase tracking-wider shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40 transition-shadow select-none overflow-hidden"
        >
          <span className="relative z-10">PUSH</span>

          {/* Click particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                initial={{ opacity: 1, scale: 0.5, x: particle.x - 24, y: particle.y - 24 }}
                animate={{ opacity: 0, scale: 1.5, y: particle.y - 80 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute text-2xl font-bold pointer-events-none text-black"
              >
                +1
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Perks section placeholder */}
      <div className="mt-16 w-full max-w-md">
        <p className="text-sm text-[var(--muted)] uppercase tracking-widest text-center mb-4">
          Perks
        </p>
        <div className="grid grid-cols-2 gap-4">
          {["Protein Powder", "Creatine", "Gym Membership", "Personal Trainer"].map(
            (perk) => (
              <div
                key={perk}
                className="p-4 border border-[var(--border)] rounded-lg opacity-50 cursor-not-allowed"
              >
                <p className="font-semibold text-sm">{perk}</p>
                <p className="text-xs text-[var(--muted)] mt-1">Coming soon</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
