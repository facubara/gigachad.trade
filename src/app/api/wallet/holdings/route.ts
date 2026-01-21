import { NextRequest, NextResponse } from "next/server";
import { fetchTokenBalance } from "@/lib/helius";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  // Basic Solana address validation (base58, 32-44 chars)
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return NextResponse.json(
      { error: "Invalid Solana address" },
      { status: 400 }
    );
  }

  try {
    const balance = await fetchTokenBalance(address);

    return NextResponse.json({
      address,
      balance,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error fetching holdings:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet holdings" },
      { status: 502 }
    );
  }
}
