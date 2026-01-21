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

// Use mainnet-beta for production
const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

/**
 * Creates a SOL transfer transaction.
 */
export async function createTipTransaction(
  fromPubkey: PublicKey,
  amountSol: number
): Promise<Transaction> {
  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const toPubkey = new PublicKey(DONATION_WALLET_ADDRESS);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: Math.floor(amountSol * LAMPORTS_PER_SOL),
    })
  );

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;

  return transaction;
}

/**
 * Sends a tip using the Phantom wallet.
 */
export async function sendTip(amountSol: number): Promise<string> {
  const provider = window.phantom?.solana || window.solana;

  if (!provider?.isPhantom) {
    throw new Error("Phantom wallet not found");
  }

  if (!provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const fromPubkey = new PublicKey(provider.publicKey.toString());
  const transaction = await createTipTransaction(fromPubkey, amountSol);

  // Sign and send via Phantom
  const { signature } = await provider.signAndSendTransaction(transaction);

  return signature;
}
