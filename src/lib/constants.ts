/**
 * Core constants for the Gigachad token website.
 * Values are hardcoded per PRD requirements.
 */

// Token mint address on Solana
export const TOKEN_MINT = "63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9";

// Total supply of GIGACHAD tokens (fixed, never changes)
export const TOTAL_SUPPLY = 9_600_000_000;

// Target market cap for the "1B goal" narrative
export const TARGET_MARKET_CAP = 1_000_000_000;

// Donation wallet address for SOL tips (Phantom only)
// Replace with actual donation wallet address
export const DONATION_WALLET_ADDRESS = "GIGA_DONATION_WALLET_ADDRESS_HERE";

// DexScreener API configuration
export const DEXSCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens";

// Price cache TTL in milliseconds (30 seconds)
export const PRICE_CACHE_TTL_MS = 30_000;

// Milestone definitions for the progress bar
export const MILESTONES = [
  { value: 10_000_000, label: "Warming Up" },
  { value: 50_000_000, label: "Alpha Phase" },
  { value: 100_000_000, label: "Sigma Territory" },
  { value: 500_000_000, label: "Final Form" },
  { value: 1_000_000_000, label: "Ascended" },
] as const;

// Tipping preset amounts in SOL
export const TIP_AMOUNTS = [0.1, 0.25] as const;
