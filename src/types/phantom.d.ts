/**
 * Phantom wallet provider types.
 * Phantom injects a `solana` object into the window.
 */

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: {
    toString(): string;
    toBytes(): Uint8Array;
  };
  isConnected: boolean;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(
    transaction: unknown,
    opts?: { skipPreflight?: boolean }
  ): Promise<{ signature: string }>;
  signTransaction?(transaction: unknown): Promise<unknown>;
  signAllTransactions?(transactions: unknown[]): Promise<unknown[]>;
  signMessage?(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  on(event: string, callback: (args: unknown) => void): void;
  off(event: string, callback: (args: unknown) => void): void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: {
      solana?: PhantomProvider;
    };
  }
}

export type { PhantomProvider };
