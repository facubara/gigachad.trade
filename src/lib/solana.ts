/**
 * Solana transaction utilities for tipping.
 *
 * Security notes:
 * - Uses versioned transactions (V0) for Phantom compatibility
 * - Validates inputs before building transaction
 * - Simulates transaction before signing to catch errors early
 * - Uses signAndSendTransaction for Phantom trust (Phantom handles RPC)
 */

import {
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import { DONATION_WALLET_ADDRESS } from "./constants";

// RPC endpoint for client-side transactions
// Set NEXT_PUBLIC_SOLANA_RPC_URL in .env.local (e.g., Helius free tier)
const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

// Minimum tip amount in SOL
const MIN_TIP_SOL = 0.001;
// Maximum tip amount in SOL (safety limit)
const MAX_TIP_SOL = 100;

/**
 * Custom error types for better UX
 */
export class TipError extends Error {
  constructor(
    message: string,
    public readonly code: TipErrorCode
  ) {
    super(message);
    this.name = "TipError";
  }
}

export type TipErrorCode =
  | "WALLET_NOT_FOUND"
  | "WALLET_NOT_CONNECTED"
  | "INVALID_AMOUNT"
  | "INSUFFICIENT_BALANCE"
  | "USER_REJECTED"
  | "SIMULATION_FAILED"
  | "TRANSACTION_FAILED"
  | "CONFIRMATION_TIMEOUT";

/**
 * Sends a tip using the Phantom wallet.
 *
 * Security measures:
 * - Input validation (amount bounds)
 * - Transaction simulation before signing
 * - Uses Phantom's signAndSendTransaction for maximum trust
 * - Proper error categorization
 */
export async function sendTip(amountSol: number): Promise<string> {
  // 1. Validate wallet availability
  const provider = window.phantom?.solana || window.solana;

  if (!provider?.isPhantom) {
    throw new TipError("Phantom wallet not found. Please install Phantom.", "WALLET_NOT_FOUND");
  }

  if (!provider.publicKey) {
    throw new TipError("Please connect your wallet first.", "WALLET_NOT_CONNECTED");
  }

  // 2. Validate amount
  if (!Number.isFinite(amountSol) || amountSol < MIN_TIP_SOL) {
    throw new TipError(`Minimum tip amount is ${MIN_TIP_SOL} SOL.`, "INVALID_AMOUNT");
  }

  if (amountSol > MAX_TIP_SOL) {
    throw new TipError(`Maximum tip amount is ${MAX_TIP_SOL} SOL.`, "INVALID_AMOUNT");
  }

  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const fromPubkey = new PublicKey(provider.publicKey.toString());
  const toPubkey = new PublicKey(DONATION_WALLET_ADDRESS);
  const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

  // 3. Check balance before building transaction
  try {
    const balance = await connection.getBalance(fromPubkey);
    // Need lamports + ~5000 for fees
    const requiredLamports = lamports + 5000;
    if (balance < requiredLamports) {
      const balanceSol = balance / LAMPORTS_PER_SOL;
      throw new TipError(
        `Insufficient balance. You have ${balanceSol.toFixed(4)} SOL but need ~${(requiredLamports / LAMPORTS_PER_SOL).toFixed(4)} SOL (including fees).`,
        "INSUFFICIENT_BALANCE"
      );
    }
  } catch (err) {
    if (err instanceof TipError) throw err;
    // RPC error - continue anyway, let transaction fail naturally
    console.warn("[Tip] Could not check balance:", err);
  }

  // 4. Get blockhash and build transaction
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

  const transferInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports,
  });

  const messageV0 = new TransactionMessage({
    payerKey: fromPubkey,
    recentBlockhash: blockhash,
    instructions: [transferInstruction],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  // 5. Simulate transaction to catch errors before signing
  try {
    const simulation = await connection.simulateTransaction(transaction, {
      sigVerify: false,
    });

    if (simulation.value.err) {
      console.error("[Tip] Simulation failed:", simulation.value.err);
      throw new TipError(
        "Transaction simulation failed. Please try again.",
        "SIMULATION_FAILED"
      );
    }
  } catch (err) {
    if (err instanceof TipError) throw err;
    // Simulation RPC error - continue anyway
    console.warn("[Tip] Simulation check failed:", err);
  }

  // 6. Sign and send via Phantom
  // Using signAndSendTransaction is MORE trusted by Phantom because:
  // - Phantom uses its own RPC internally
  // - The transaction comes from a known source (Phantom's infrastructure)
  // - Users see a cleaner signing experience
  try {
    const { signature } = await provider.signAndSendTransaction(transaction, {
      skipPreflight: false,
    });

    // 7. Wait for confirmation
    try {
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );
    } catch {
      // Transaction was sent but confirmation timed out
      // Return signature anyway - user can check on explorer
      console.warn("[Tip] Confirmation timeout, but transaction was sent:", signature);
    }

    return signature;
  } catch (err) {
    // Parse Phantom-specific errors
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("User rejected") || message.includes("rejected")) {
      throw new TipError("Transaction cancelled.", "USER_REJECTED");
    }

    if (message.includes("insufficient")) {
      throw new TipError("Insufficient balance for transaction.", "INSUFFICIENT_BALANCE");
    }

    throw new TipError(
      message || "Transaction failed. Please try again.",
      "TRANSACTION_FAILED"
    );
  }
}
