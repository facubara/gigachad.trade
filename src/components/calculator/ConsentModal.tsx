"use client";

import { useEffect, useRef } from "react";

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentModal({ isOpen, onAccept, onDecline }: ConsentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onDecline();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onDecline]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onDecline();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md mx-4 bg-[var(--steel)] border border-[var(--border)] p-6 space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <div className="space-y-2">
          <h2
            id="consent-title"
            className="text-lg font-medium tracking-[0.02em]"
          >
            Help Improve Analytics
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Would you like to contribute your anonymous wallet statistics to help others compare their entry prices?
          </p>
        </div>

        <div className="space-y-3 p-4 bg-[var(--bg)] border border-[var(--border)] text-[11px]">
          <p className="text-[var(--white)] font-medium tracking-[0.05em] uppercase text-[10px]">
            What we store:
          </p>
          <ul className="space-y-2 text-[var(--muted)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--positive)]">✓</span>
              <span>Hashed wallet address (cannot be reversed)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--positive)]">✓</span>
              <span>Average entry price</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--positive)]">✓</span>
              <span>Buy/sell transaction counts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--positive)]">✓</span>
              <span>Number of unique buy days</span>
            </li>
          </ul>
          <p className="text-[var(--dim)] pt-2 border-t border-[var(--border)]">
            Your actual wallet address is never stored. Only a one-way hash is used to prevent duplicate entries.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-3 text-[11px] tracking-[0.1em] uppercase border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
          >
            No Thanks
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-3 text-[11px] tracking-[0.1em] uppercase bg-[var(--white)] text-[var(--bg)] hover:bg-[var(--muted)] transition-colors font-medium"
          >
            Contribute
          </button>
        </div>
      </div>
    </div>
  );
}
