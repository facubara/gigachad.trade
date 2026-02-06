// Achievement definitions for wallet transaction behavior

export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type AchievementCriteriaType = "buyCount" | "sellCount" | "uniqueBuyDays" | "diamondHands";

export interface AchievementCriteria {
  type: AchievementCriteriaType;
  min?: number;
  max?: number;
  requiresBuyCount?: number; // For diamond hands: need minimum buys
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: AchievementCriteria;
  rarity: AchievementRarity;
  icon: string; // Emoji or icon identifier
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_STEPS: {
    id: "first_steps",
    name: "First Steps",
    description: "Made your first GIGA purchase",
    criteria: { type: "buyCount", min: 1 },
    rarity: "common",
    icon: "👣",
  },
  COMMITTED_BUYER: {
    id: "committed_buyer",
    name: "Committed Buyer",
    description: "Accumulated through 50+ buy transactions",
    criteria: { type: "buyCount", min: 50 },
    rarity: "uncommon",
    icon: "💪",
  },
  CENTURION: {
    id: "centurion",
    name: "Centurion",
    description: "Reached 100 buy transactions",
    criteria: { type: "buyCount", min: 100 },
    rarity: "rare",
    icon: "🏛️",
  },
  ACCUMULATION_MASTER: {
    id: "accumulation_master",
    name: "Accumulation Master",
    description: "Amassed 500+ buy transactions",
    criteria: { type: "buyCount", min: 500 },
    rarity: "epic",
    icon: "👑",
  },
  TRANSACTION_LEGEND: {
    id: "transaction_legend",
    name: "Transaction Legend",
    description: "Legendary 1000+ buy transactions",
    criteria: { type: "buyCount", min: 1000 },
    rarity: "legendary",
    icon: "⚡",
  },
  DIAMOND_HANDS: {
    id: "diamond_hands",
    name: "Diamond Hands",
    description: "Never sold with 5+ buys",
    criteria: { type: "diamondHands", requiresBuyCount: 5 },
    rarity: "rare",
    icon: "💎",
  },
  DCA_BEGINNER: {
    id: "dca_beginner",
    name: "DCA Beginner",
    description: "Bought on 7+ different days",
    criteria: { type: "uniqueBuyDays", min: 7 },
    rarity: "common",
    icon: "📅",
  },
  DCA_KING: {
    id: "dca_king",
    name: "DCA King",
    description: "Bought on 100+ different days",
    criteria: { type: "uniqueBuyDays", min: 100 },
    rarity: "epic",
    icon: "🗓️",
  },
};

// Ordered by display priority (legendary first)
export const ACHIEVEMENT_ORDER: string[] = [
  "TRANSACTION_LEGEND",
  "ACCUMULATION_MASTER",
  "DCA_KING",
  "CENTURION",
  "DIAMOND_HANDS",
  "COMMITTED_BUYER",
  "DCA_BEGINNER",
  "FIRST_STEPS",
];

// Rarity colors for styling - monochromatic terminal aesthetic
export const RARITY_COLORS: Record<AchievementRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: "bg-[var(--bg)]",
    border: "border-[var(--border)]",
    text: "text-[var(--dim)]",
    glow: "",
  },
  uncommon: {
    bg: "bg-[var(--bg)]",
    border: "border-[var(--dim)]",
    text: "text-[var(--muted)]",
    glow: "",
  },
  rare: {
    bg: "bg-[var(--bg)]",
    border: "border-[var(--muted)]",
    text: "text-[var(--white)]",
    glow: "",
  },
  epic: {
    bg: "bg-[var(--bg)]",
    border: "border-[var(--purple)]",
    text: "text-[var(--purple)]",
    glow: "",
  },
  legendary: {
    bg: "bg-[var(--bg)]",
    border: "border-[var(--white)]",
    text: "text-[var(--white)]",
    glow: "shadow-[0_0_8px_rgba(255,255,255,0.15)]",
  },
};
