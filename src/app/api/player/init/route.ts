import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { generateDisplayName } from "@/lib/playerStore";

export async function POST() {
  const cookieStore = await cookies();
  let playerId = cookieStore.get("player_id")?.value;

  // Check if player already exists in database
  if (playerId) {
    const existingPlayer = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (existingPlayer) {
      return NextResponse.json({
        playerId: existingPlayer.id,
        displayName: existingPlayer.displayName,
        totalPushups: existingPlayer.totalPushups,
        pushupsPerSecond: existingPlayer.pushupsPerSecond,
        perks: existingPlayer.perks,
      });
    }
  }

  // Create new player in database
  const newPlayer = await prisma.player.create({
    data: {
      displayName: generateDisplayName(),
      totalPushups: 0,
      pushupsPerSecond: 0,
      perks: {},
    },
  });

  const response = NextResponse.json({
    playerId: newPlayer.id,
    displayName: newPlayer.displayName,
    totalPushups: newPlayer.totalPushups,
    pushupsPerSecond: newPlayer.pushupsPerSecond,
    perks: newPlayer.perks,
  });

  // Set cookie for 30 days
  response.cookies.set("player_id", newPlayer.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
