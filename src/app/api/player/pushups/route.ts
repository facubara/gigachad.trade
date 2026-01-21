import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// In-memory player store (shared stub - will be replaced with DB)
const players = new Map<string, {
  id: string;
  displayName: string;
  totalPushups: number;
  pushupsPerSecond: number;
  createdAt: number;
}>();

interface PushupRequest {
  delta: number;
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const playerId = cookieStore.get("player_id")?.value;

  if (!playerId) {
    return NextResponse.json(
      { error: "Player not found. Initialize first." },
      { status: 404 }
    );
  }

  let body: PushupRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { delta } = body;

  // Validate delta
  if (typeof delta !== "number" || delta < 0 || !Number.isInteger(delta)) {
    return NextResponse.json(
      { error: "Invalid delta. Must be a non-negative integer." },
      { status: 400 }
    );
  }

  // Cap delta to prevent obvious abuse (max 100 per request)
  const cappedDelta = Math.min(delta, 100);

  // Get or create player (in case of memory loss between requests in dev)
  let player = players.get(playerId);
  if (!player) {
    player = {
      id: playerId,
      displayName: `GIGA#${Math.floor(1000 + Math.random() * 9000)}`,
      totalPushups: 0,
      pushupsPerSecond: 0,
      createdAt: Date.now(),
    };
    players.set(playerId, player);
  }

  // Update pushups
  player.totalPushups += cappedDelta;

  return NextResponse.json({
    totalPushups: player.totalPushups,
    pushupsPerSecond: player.pushupsPerSecond,
  });
}
