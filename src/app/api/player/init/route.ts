import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// In-memory player store (will be replaced with DB in production)
// Key: playerId, Value: player data
const players = new Map<string, {
  id: string;
  displayName: string;
  totalPushups: number;
  pushupsPerSecond: number;
  createdAt: number;
}>();

function generatePlayerId(): string {
  return crypto.randomUUID();
}

function generateDisplayName(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `GIGA#${num}`;
}

export async function POST() {
  const cookieStore = await cookies();
  let playerId = cookieStore.get("player_id")?.value;

  // Check if player already exists
  if (playerId && players.has(playerId)) {
    const player = players.get(playerId)!;
    return NextResponse.json({
      playerId: player.id,
      displayName: player.displayName,
      totalPushups: player.totalPushups,
      pushupsPerSecond: player.pushupsPerSecond,
    });
  }

  // Create new player
  playerId = generatePlayerId();
  const displayName = generateDisplayName();

  const player = {
    id: playerId,
    displayName,
    totalPushups: 0,
    pushupsPerSecond: 0,
    createdAt: Date.now(),
  };

  players.set(playerId, player);

  const response = NextResponse.json({
    playerId: player.id,
    displayName: player.displayName,
    totalPushups: player.totalPushups,
    pushupsPerSecond: player.pushupsPerSecond,
  });

  // Set cookie for 30 days
  response.cookies.set("player_id", playerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

// Export players map for use in pushups route
export { players };
