/**
 * Solana transaction utilities for tipping.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { DONATION_WALLET_ADDRESS } from "./constants";

// RPC endpoint - set NEXT_PUBLIC_SOLANA_RPC_URL in .env.local
// Get a free RPC from https://dev.helius.xyz (100k requests/month free)
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

/**
 * Sends a tip using the Phantom wallet.
 * Uses Phantom's built-in connection for better reliability.
 */
export async function sendTip(amountSol: number): Promise<string> {
  const provider = window.phantom?.solana || window.solana;

  if (!provider?.isPhantom) {
    throw new Error("Phantom wallet not found");
  }

  if (!provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const fromPubkey = new PublicKey(provider.publicKey.toString());
  const toPubkey = new PublicKey(DONATION_WALLET_ADDRESS);

  // Get latest blockhash with commitment
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

  // Create transaction
  const transaction = new Transaction({
    blockhash,
    lastValidBlockHeight,
    feePayer: fromPubkey,
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: Math.floor(amountSol * LAMPORTS_PER_SOL),
    })
  );

  // Sign and send via Phantom with skipPreflight to avoid simulation errors
  const { signature } = await provider.signAndSendTransaction(transaction, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });

  return signature;
}
