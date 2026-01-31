import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const playerId = cookieStore.get("player_id")?.value;

    if (!playerId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { displayName } = body;

    // Validate display name
    if (!displayName || typeof displayName !== "string") {
      return NextResponse.json({ error: "Display name required" }, { status: 400 });
    }

    const trimmedName = displayName.trim();

    if (trimmedName.length < 1 || trimmedName.length > 20) {
      return NextResponse.json(
        { error: "Name must be 1-20 characters" },
        { status: 400 }
      );
    }

    // Only allow alphanumeric, spaces, underscores, and hyphens
    if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmedName)) {
      return NextResponse.json(
        { error: "Name can only contain letters, numbers, spaces, underscores, and hyphens" },
        { status: 400 }
      );
    }

    // Update player name
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { displayName: trimmedName },
    });

    return NextResponse.json({
      displayName: updatedPlayer.displayName,
    });
  } catch (error) {
    console.error("Update name error:", error);
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
}
