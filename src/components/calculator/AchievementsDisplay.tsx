"use client";

import { EarnedAchievement } from "@/lib/achievementEngine";
import { AchievementBadge } from "./AchievementBadge";

interface AchievementsDisplayProps {
  achievements: EarnedAchievement[];
  isLoading?: boolean;
}

export function AchievementsDisplay({
  achievements,
  isLoading = false,
}: AchievementsDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Achievements
        </h2>
        <div className="flex gap-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-[var(--border)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Achievements
        </h2>
        <p className="text-[var(--dim)] text-[11px] tracking-[0.05em]">
          No achievements earned yet. Start buying GIGA to unlock badges!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
          Achievements
        </h2>
        <span className="text-[9px] tracking-[0.1em] text-[var(--muted)]">
          {achievements.length} earned
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {achievements.map(({ achievement }) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}
