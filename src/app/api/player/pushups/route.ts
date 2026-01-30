import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { generateDisplayName } from "@/lib/playerStore";

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

  // Get or create player in database
  let player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    // Create player if doesn't exist (edge case - cookie exists but player was deleted)
    player = await prisma.player.create({
      data: {
        id: playerId,
        displayName: generateDisplayName(),
        totalPushups: cappedDelta,
        pushupsPerSecond: 0,
        perks: {},
      },
    });
  } else {
    // Update pushups in database
    player = await prisma.player.update({
      where: { id: playerId },
      data: {
        totalPushups: {
          increment: cappedDelta,
        },
      },
    });
  }

  return NextResponse.json({
    totalPushups: player.totalPushups,
    pushupsPerSecond: player.pushupsPerSecond,
  });
}
