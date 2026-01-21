"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DONATION_WALLET_ADDRESS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/clicker", label: "Push Up Game" },
  { href: "/calculator", label: "Portfolio Calculator" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = DONATION_WALLET_ADDRESS;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortAddress = `${DONATION_WALLET_ADDRESS.slice(0, 4)}...${DONATION_WALLET_ADDRESS.slice(-4)}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo placeholder */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">G</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">GIGACHAD</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--accent)] text-black"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">
                  {item.label === "Home" && "Home"}
                  {item.label === "Push Up Game" && "Game"}
                  {item.label === "Portfolio Calculator" && "Calc"}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Donation address */}
        <button
          onClick={handleCopyAddress}
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          title={`Donate: ${DONATION_WALLET_ADDRESS}`}
        >
          <span className="hidden md:inline">Donate:</span>
          <span>{shortAddress}</span>
          {copied ? (
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
