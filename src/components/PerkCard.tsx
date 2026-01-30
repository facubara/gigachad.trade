"use client";

import { motion } from "framer-motion";
import { Perk } from "@/lib/perks";

interface PerkCardProps {
  perk: Perk;
  level: number;
  cost: number;
  canAfford: boolean;
  isPurchasing: boolean;
  onPurchase: () => void;
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

export function PerkCard({
  perk,
  level,
  cost,
  canAfford,
  isPurchasing,
  onPurchase,
}: PerkCardProps) {
  const isLocked = !canAfford && level === 0;
  const effectLabel = perk.effectType === 'multiplier'
    ? `+${perk.effectValue}/click`
    : `+${perk.effectValue}/sec`;

  return (
    <motion.button
      onClick={onPurchase}
      disabled={!canAfford || isPurchasing}
      whileHover={canAfford ? { scale: 1.02 } : undefined}
      whileTap={canAfford ? { scale: 0.98 } : undefined}
      className={`
        p-4 text-left transition-all duration-200 relative
        ${canAfford
          ? 'bg-[var(--steel)] hover:bg-[var(--charcoal)] cursor-pointer'
          : 'bg-[var(--steel)] opacity-50 cursor-not-allowed'
        }
        ${isPurchasing ? 'animate-pulse' : ''}
      `}
    >
      {/* Level badge */}
      {level > 0 && (
        <div className="absolute top-2 right-2 bg-[var(--white)] text-[var(--black)] text-[9px] font-bold px-1.5 py-0.5 tracking-[0.05em]">
          LV.{level}
        </div>
      )}

      {/* Perk name */}
      <p className="font-medium text-[11px] tracking-[0.05em] pr-10">
        {perk.name}
      </p>

      {/* Description */}
      <p className="text-[9px] text-[var(--dim)] mt-1 tracking-[0.05em]">
        {perk.description}
      </p>

      {/* Effect */}
      <p className={`text-[10px] mt-2 tracking-[0.05em] ${
        perk.effectType === 'multiplier' ? 'text-[var(--muted)]' : 'text-green-400'
      }`}>
        {effectLabel}
        {level > 0 && (
          <span className="text-[var(--dim)]">
            {' '}(total: {perk.effectType === 'multiplier'
              ? `+${perk.effectValue * level}`
              : `+${perk.effectValue * level}/s`})
          </span>
        )}
      </p>

      {/* Cost */}
      <div className="mt-3 pt-2 border-t border-[var(--border)]">
        <p className={`text-[10px] tracking-[0.1em] uppercase ${
          canAfford ? 'text-[var(--white)]' : 'text-[var(--dim)]'
        }`}>
          {isPurchasing ? 'Purchasing...' : `${formatNumber(cost)} pushups`}
        </p>
      </div>
    </motion.button>
  );
}
