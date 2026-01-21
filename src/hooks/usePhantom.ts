"use client";

import { useState, useEffect, useCallback } from "react";
import type { PhantomProvider } from "@/types/phantom";

interface UsePhantomResult {
  provider: PhantomProvider | null;
  isAvailable: boolean;
  isConnected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
}

function getProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;

  // Phantom can be accessed via window.phantom.solana or window.solana
  const provider = window.phantom?.solana || window.solana;

  if (provider?.isPhantom) {
    return provider;
  }

  return null;
}

export function usePhantom(): UsePhantomResult {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider
  useEffect(() => {
    const phantom = getProvider();
    setProvider(phantom);

    if (phantom) {
      // Check if already connected
      if (phantom.isConnected && phantom.publicKey) {
        setIsConnected(true);
        setPublicKey(phantom.publicKey.toString());
      }

      // Listen for connection changes
      const handleConnect = () => {
        setIsConnected(true);
        if (phantom.publicKey) {
          setPublicKey(phantom.publicKey.toString());
        }
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setPublicKey(null);
      };

      phantom.on("connect", handleConnect);
      phantom.on("disconnect", handleDisconnect);

      return () => {
        phantom.off("connect", handleConnect);
        phantom.off("disconnect", handleDisconnect);
      };
    }
  }, []);

  const connect = useCallback(async () => {
    const phantom = getProvider();
    if (!phantom) {
      setError("Phantom wallet not found. Please install it.");
      return;
    }

    try {
      setError(null);
      const response = await phantom.connect();
      setIsConnected(true);
      setPublicKey(response.publicKey.toString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect wallet");
      }
    }
  }, []);

  const disconnect = useCallback(async () => {
    const phantom = getProvider();
    if (!phantom) return;

    try {
      await phantom.disconnect();
      setIsConnected(false);
      setPublicKey(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, []);

  return {
    provider,
    isAvailable: provider !== null,
    isConnected,
    publicKey,
    connect,
    disconnect,
    error,
  };
}
