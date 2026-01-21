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

      // Reset after 3 seconds
      setTimeout(() => {
        setTipStatus("idle");
        setLastSignature(null);
      }, 3000);
    } catch (err) {
      setTipError(err instanceof Error ? err.message : "Transaction failed");
      setTipStatus("error");

      // Reset after 3 seconds
      setTimeout(() => {
        setTipStatus("idle");
        setTipError(null);
      }, 3000);
    }
  }, [isConnected, connect]);

  // Phantom not installed
  if (!isAvailable) {
    return (
      <div className="w-full max-w-md mx-auto p-6 border border-[var(--border)] rounded-lg text-center">
        <p className="text-sm text-[var(--muted)] mb-4">
          Install Phantom to support the movement
        </p>
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-[var(--border)] text-white font-semibold rounded-lg hover:bg-[var(--muted)] transition-colors"
        >
          Get Phantom
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-sm uppercase tracking-widest text-[var(--muted)] text-center mb-6">
        Support the Movement
      </p>

      {/* Wallet status */}
      {isConnected && publicKey && (
        <p className="text-xs text-[var(--muted)] text-center mb-4 font-mono">
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
        </p>
      )}

      {/* Tip buttons */}
      <div className="flex gap-4 justify-center">
        {TIP_AMOUNTS.map((amount) => (
          <motion.button
            key={amount}
            onClick={() => handleTip(amount)}
            disabled={tipStatus === "pending"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 px-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold text-lg rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-xs text-[var(--muted)] text-center mt-4">
          Click to connect Phantom
        </p>
      )}

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {tipStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-center"
          >
            <p className="text-green-400 text-sm font-semibold">
              Thank you, GIGACHAD
            </p>
            {lastSignature && (
              <a
                href={`https://solscan.io/tx/${lastSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-500 hover:underline mt-1 inline-block"
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
            className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-center"
          >
            <p className="text-red-400 text-sm">
              {tipError || walletError || "Transaction failed"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
