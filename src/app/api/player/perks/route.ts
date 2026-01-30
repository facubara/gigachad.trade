import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { PERKS_BY_ID, calculatePerkCost, calculatePushupsPerSecond } from "@/lib/perks";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const playerId = cookieStore.get("player_id")?.value;

  if (!playerId) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { perkId } = body;

    if (!perkId || typeof perkId !== "string") {
      return NextResponse.json({ error: "Invalid perk ID" }, { status: 400 });
    }

    const perk = PERKS_BY_ID[perkId];
    if (!perk) {
      return NextResponse.json({ error: "Perk not found" }, { status: 404 });
    }

    const perks = player.perks as Record<string, number>;
    const currentLevel = perks[perkId] || 0;
    const cost = calculatePerkCost(perk, currentLevel);

    if (player.totalPushups < cost) {
      return NextResponse.json(
        { error: "Not enough pushups", required: cost, available: player.totalPushups },
        { status: 400 }
      );
    }

    // Update perks
    const newPerks = { ...perks, [perkId]: currentLevel + 1 };
    const newPushupsPerSecond = calculatePushupsPerSecond(newPerks);

    // Update player in database
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        totalPushups: {
          decrement: cost,
        },
        perks: newPerks,
        pushupsPerSecond: newPushupsPerSecond,
      },
    });

    return NextResponse.json({
      playerId: updatedPlayer.id,
      displayName: updatedPlayer.displayName,
      totalPushups: updatedPlayer.totalPushups,
      pushupsPerSecond: updatedPlayer.pushupsPerSecond,
      perks: updatedPlayer.perks,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
