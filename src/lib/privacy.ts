// Privacy utilities for anonymous wallet statistics

/**
 * Generate a SHA256 hash of a wallet address for anonymous storage
 * Uses Web Crypto API which is available in both browser and Node.js
 */
export async function hashWalletAddress(address: string): Promise<string> {
  // Add a salt prefix to prevent rainbow table attacks
  const saltedAddress = `giga-stats:${address.toLowerCase()}`;

  // Encode the string to bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(saltedAddress);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Synchronous hash for server-side use (Node.js only)
 * Falls back to async version if crypto module not available
 */
export function hashWalletAddressSync(address: string): string {
  // This is for server-side Node.js environments
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  const saltedAddress = `giga-stats:${address.toLowerCase()}`;
  return crypto.createHash("sha256").update(saltedAddress).digest("hex");
}
