// Shared in-memory player store (will be replaced with DB in production)
// This file is separate from API routes to ensure consistent module loading

export interface Player {
  id: string;
  displayName: string;
  totalPushups: number;
  pushupsPerSecond: number;
  perks: Record<string, number>;
  createdAt: number;
}

// Use globalThis to persist across hot reloads in development
const globalForPlayers = globalThis as unknown as {
  players: Map<string, Player> | undefined;
};

export const players = globalForPlayers.players ?? new Map<string, Player>();

if (process.env.NODE_ENV !== "production") {
  globalForPlayers.players = players;
}

export function generatePlayerId(): string {
  return crypto.randomUUID();
}

export function generateDisplayName(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `GIGA#${num}`;
}

export function createPlayer(playerId: string): Player {
  return {
    id: playerId,
    displayName: generateDisplayName(),
    totalPushups: 0,
    pushupsPerSecond: 0,
    perks: {},
    createdAt: Date.now(),
  };
}
