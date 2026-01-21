"use client";

import { useState } from "react";
import { usePhantom } from "@/hooks/usePhantom";
import { LoadingState } from "@/types/cache";

interface WalletInputProps {
  onAnalyze: (address: string) => void;
  isLoading: boolean;
  currentAddress: string | null;
  loadingState?: LoadingState;
  isCacheAvailable?: boolean;
}

export function WalletInput({
  onAnalyze,
  isLoading,
  currentAddress,
  loadingState,
  isCacheAvailable = false,
}: WalletInputProps) {
  const [inputAddress, setInputAddress] = useState("");
  const { isAvailable, isConnected, publicKey, connect, disconnect, error } =
    usePhantom();

  // Get button text based on loading state
  const getButtonText = () => {
    if (!isLoading) return "Analyze";
    if (!loadingState) return "...";

    switch (loadingState.status) {
      case "checking-cache":
        return "Checking...";
      case "fetching":
        return loadingState.progress?.isIncremental ? "Updating..." : "Loading...";
      case "processing":
        return "Processing...";
      default:
        return "...";
    }
  };

  // Get phantom button text based on loading state
  const getPhantomButtonText = () => {
    if (!isLoading) return "Analyze My Wallet";
    if (!loadingState) return "Analyzing...";

    switch (loadingState.status) {
      case "checking-cache":
        return "Checking cache...";
      case "fetching":
        return loadingState.progress?.isIncremental
          ? "Fetching new txs..."
          : "Loading history...";
      case "processing":
        return "Processing...";
      default:
        return "Analyzing...";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress.trim()) {
      onAnalyze(inputAddress.trim());
    }
  };

  const handlePhantomConnect = async () => {
    if (isConnected && publicKey) {
      onAnalyze(publicKey);
    } else {
      await connect();
    }
  };

  // Auto-analyze when Phantom connects
  const handlePhantomAnalyze = () => {
    if (publicKey) {
      onAnalyze(publicKey);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
        Wallet Address
      </h2>

      {/* Manual address input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="Enter Solana wallet address..."
          className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors font-mono text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputAddress.trim()}
          className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wider text-sm min-w-[100px]"
        >
          {getButtonText()}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--muted)] uppercase">or</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Phantom wallet connection */}
      <div className="flex flex-col items-center gap-2">
        {isAvailable ? (
          isConnected && publicKey ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-mono">
                  {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePhantomAnalyze}
                  disabled={isLoading}
                  className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wider text-sm min-w-[160px]"
                >
                  {getPhantomButtonText()}
                </button>
                <button
                  onClick={disconnect}
                  className="px-4 py-3 border border-[var(--border)] text-[var(--muted)] rounded-lg hover:border-[var(--text)] hover:text-[var(--text)] transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handlePhantomConnect}
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Connect Phantom Wallet
            </button>
          )
        ) : (
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-purple-600 text-purple-400 rounded-lg hover:bg-purple-600/10 transition-colors"
          >
            Install Phantom Wallet
          </a>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Current analysis indicator */}
      {currentAddress && (
        <div className="text-center text-xs text-[var(--muted)]">
          Currently viewing:{" "}
          <span className="font-mono">
            {currentAddress.slice(0, 8)}...{currentAddress.slice(-8)}
          </span>
        </div>
      )}

      {/* Cache status indicator */}
      {isCacheAvailable && (
        <div className="flex items-center justify-center gap-1 text-xs text-[var(--muted)]">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span>Local cache enabled</span>
        </div>
      )}
    </div>
  );
}
