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
    <div className="space-y-6">
      <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
        Wallet Address
      </h2>

      {/* Manual address input */}
      <form onSubmit={handleSubmit} className="flex gap-px bg-[var(--border)]">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="Enter Solana wallet address..."
          className="flex-1 px-4 py-4 bg-[var(--bg)] text-[var(--white)] placeholder:text-[var(--dim)] focus:outline-none font-mono text-[12px] tracking-[0.02em]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputAddress.trim()}
          className="px-8 py-4 bg-[var(--white)] text-[var(--black)] font-medium text-[11px] tracking-[0.15em] uppercase hover:bg-[var(--muted)] hover:text-[var(--white)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {getButtonText()}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-6">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[9px] tracking-[0.2em] text-[var(--dim)] uppercase">or</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Phantom wallet connection */}
      <div className="flex flex-col items-center gap-4">
        {isAvailable ? (
          isConnected && publicKey ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
                <span className="w-1.5 h-1.5 bg-[var(--positive)]" />
                <span className="font-mono tracking-[0.05em]">
                  {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                </span>
              </div>
              <div className="flex gap-px bg-[var(--border)]">
                <button
                  onClick={handlePhantomAnalyze}
                  disabled={isLoading}
                  className="px-8 py-4 bg-[var(--white)] text-[var(--black)] font-medium text-[11px] tracking-[0.15em] uppercase hover:bg-[var(--muted)] hover:text-[var(--white)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {getPhantomButtonText()}
                </button>
                <button
                  onClick={disconnect}
                  className="px-6 py-4 bg-[var(--steel)] border border-[var(--border)] text-[var(--muted)] text-[11px] tracking-[0.1em] uppercase hover:border-[var(--white)] hover:text-[var(--white)] transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handlePhantomConnect}
              disabled={isLoading}
              className="px-8 py-4 bg-[var(--purple)] text-[var(--black)] font-medium text-[11px] tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Connect Phantom Wallet
            </button>
          )
        ) : (
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-[var(--purple)] text-[var(--purple)] text-[11px] tracking-[0.15em] uppercase hover:bg-[var(--purple)] hover:text-[var(--black)] transition-colors"
          >
            Install Phantom Wallet
          </a>
        )}

        {error && <p className="text-[var(--negative)] text-[11px] tracking-[0.05em]">{error}</p>}
      </div>

      {/* Current analysis indicator */}
      {currentAddress && (
        <div className="text-center text-[10px] tracking-[0.1em] text-[var(--muted)]">
          Currently viewing:{" "}
          <span className="font-mono">
            {currentAddress.slice(0, 8)}...{currentAddress.slice(-8)}
          </span>
        </div>
      )}

      {/* Cache status indicator */}
      {isCacheAvailable && (
        <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.1em] text-[var(--dim)]">
          <span className="w-1 h-1 bg-[var(--positive)]" />
          <span>Local cache enabled</span>
        </div>
      )}
    </div>
  );
}
