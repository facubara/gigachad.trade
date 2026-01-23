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
          className="relative w-48 h-48 md:w-56 md:h-56 bg-[var(--white)] text-[var(--black)] font-bold text-2xl md:text-3xl uppercase tracking-[0.2em] hover:bg-[var(--muted)] hover:text-[var(--white)] transition-colors select-none overflow-hidden"
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
                className="absolute text-xl font-bold pointer-events-none"
              >
                +1
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.button>
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
