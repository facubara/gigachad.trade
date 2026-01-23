"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhantom } from "@/hooks/usePhantom";
import { sendTip } from "@/lib/solana";
import { TIP_AMOUNTS } from "@/lib/constants";

type TipStatus = "idle" | "pending" | "success" | "error";

export function TippingModule() {
  const { isAvailable, isConnected, connect, publicKey, error: walletError } = usePhantom();
  const [tipStatus, setTipStatus] = useState<TipStatus>("idle");
  const [tipError, setTipError] = useState<string | null>(null);
  const [lastSignature, setLastSignature] = useState<string | null>(null);

  const handleTip = useCallback(async (amount: number) => {
    if (!isConnected) {
      await connect();
      return;
    }

    setTipStatus("pending");
    setTipError(null);

    try {
      const signature = await sendTip(amount);
      setLastSignature(signature);
      setTipStatus("success");

      setTimeout(() => {
        setTipStatus("idle");
        setLastSignature(null);
      }, 3000);
    } catch (err) {
      setTipError(err instanceof Error ? err.message : "Transaction failed");
      setTipStatus("error");

      setTimeout(() => {
        setTipStatus("idle");
        setTipError(null);
      }, 3000);
    }
  }, [isConnected, connect]);

  // Phantom not installed
  if (!isAvailable) {
    return (
      <div className="text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)] mb-8">
          Support the Movement
        </p>
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[11px] font-medium tracking-[0.15em] uppercase bg-[var(--purple)] text-[var(--black)] px-8 py-4 hover:opacity-90 transition-opacity"
        >
          Get Phantom
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)] mb-10">
        Support the Movement
      </p>

      {/* Wallet status */}
      {isConnected && publicKey && (
        <p className="text-[10px] text-[var(--muted)] mb-6">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </p>
      )}

      {/* Tip buttons */}
      <div className="flex gap-4 justify-center mb-6">
        {TIP_AMOUNTS.map((amount) => (
          <motion.button
            key={amount}
            onClick={() => handleTip(amount)}
            disabled={tipStatus === "pending"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-[12px] font-medium tracking-[0.1em] bg-[var(--white)] text-[var(--black)] px-12 py-4 hover:bg-[var(--muted)] hover:text-[var(--white)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tipStatus === "pending" ? (
              <span className="inline-block animate-pulse">...</span>
            ) : (
              `${amount} SOL`
            )}
          </motion.button>
        ))}
      </div>

      {/* Connect prompt */}
      {!isConnected && (
        <p className="text-[10px] text-[var(--dim)]">
          Click to connect Phantom wallet
        </p>
      )}

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {tipStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 border border-[var(--positive)] text-center"
          >
            <p className="text-[var(--positive)] text-sm font-medium">
              Thank you, GIGACHAD
            </p>
            {lastSignature && (
              <a
                href={`https://solscan.io/tx/${lastSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[var(--positive)] hover:underline mt-2 inline-block"
              >
                View transaction
              </a>
            )}
          </motion.div>
        )}

        {tipStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 border border-[var(--negative)] text-center"
          >
            <p className="text-[var(--negative)] text-sm">
              {tipError || walletError || "Transaction failed"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
