"use client";

import { useState } from "react";
import { Achievement, RARITY_COLORS } from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}

export function AchievementBadge({
  achievement,
  size = "md",
  showDescription = false,
}: AchievementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = RARITY_COLORS[achievement.rarity];

  const sizeClasses = {
    sm: "px-2 py-1.5 text-[9px]",
    md: "px-3 py-2 text-[10px]",
    lg: "px-4 py-2.5 text-[11px]",
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          ${colors.bg} ${colors.border} ${colors.glow}
          border
          ${sizeClasses[size]}
          flex items-center
          transition-all duration-200
          hover:border-[var(--muted)]
          cursor-default
        `}
      >
        <div className="flex flex-col">
          <span className={`${colors.text} font-medium tracking-[0.1em] uppercase font-mono`}>
            {achievement.name}
          </span>
          {showDescription && (
            <span className="text-[var(--dim)] text-[8px] tracking-[0.05em] mt-0.5 font-mono">
              {achievement.description}
            </span>
          )}
        </div>
      </div>

      {/* Custom Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
                     bg-[var(--bg)] border border-[var(--border)]
                     px-3 py-2 min-w-[180px]
                     pointer-events-none"
        >
          <div className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] mb-1 font-mono">
            {achievement.rarity}
          </div>
          <div className="text-[11px] tracking-[0.02em] text-[var(--white)] font-mono">
            {achievement.description}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                          border-l-[6px] border-l-transparent
                          border-r-[6px] border-r-transparent
                          border-t-[6px] border-t-[var(--border)]" />
        </div>
      )}
    </div>
  );
}

interface AchievementBadgeCompactProps {
  achievement: Achievement;
}

export function AchievementBadgeCompact({ achievement }: AchievementBadgeCompactProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = RARITY_COLORS[achievement.rarity];

  // Get first letter of each word for compact display
  const initials = achievement.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          ${colors.bg} ${colors.border} ${colors.glow}
          border
          w-10 h-10
          flex items-center justify-center
          transition-all duration-200
          hover:border-[var(--muted)]
          cursor-default
        `}
      >
        <span className={`${colors.text} text-[10px] font-mono font-medium`}>{initials}</span>
      </div>

      {/* Custom Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
                     bg-[var(--bg)] border border-[var(--border)]
                     px-3 py-2 min-w-[160px]
                     pointer-events-none"
        >
          <div className="text-[10px] tracking-[0.1em] uppercase text-[var(--white)] mb-1 font-mono">
            {achievement.name}
          </div>
          <div className="text-[9px] tracking-[0.05em] text-[var(--dim)] font-mono">
            {achievement.description}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                          border-l-[6px] border-l-transparent
                          border-r-[6px] border-r-transparent
                          border-t-[6px] border-t-[var(--border)]" />
        </div>
      )}
    </div>
  );
}
