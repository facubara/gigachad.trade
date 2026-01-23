"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DONATION_WALLET_ADDRESS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/clicker", label: "Game" },
  { href: "/calculator", label: "Calculator" },
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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-sm tracking-[0.15em]">GIGACHAD</span>
          </Link>
          <a
            href="https://x.com/billionducks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-[var(--dim)] hover:text-[var(--muted)] transition-colors hidden sm:block"
          >
            by @billionducks
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[10px] tracking-[0.1em] uppercase transition-colors ${
                  isActive
                    ? "text-[var(--white)]"
                    : "text-[var(--muted)] hover:text-[var(--white)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[10px] tracking-[0.05em] uppercase transition-colors ${
                  isActive
                    ? "text-[var(--white)]"
                    : "text-[var(--muted)] hover:text-[var(--white)]"
                }`}
              >
                {item.label === "Home" && "Home"}
                {item.label === "Game" && "Game"}
                {item.label === "Calculator" && "Calc"}
              </Link>
            );
          })}
        </nav>

        {/* Wallet button */}
        <button
          onClick={handleCopyAddress}
          className="text-[9px] tracking-[0.05em] text-[var(--dim)] px-3 py-2 border border-[var(--border)] hover:border-[var(--dim)] hover:text-[var(--muted)] transition-all"
          title={`Donate: ${DONATION_WALLET_ADDRESS}`}
        >
          {copied ? (
            <span className="text-[var(--positive)]">Copied!</span>
          ) : (
            <span>{shortAddress}</span>
          )}
        </button>
      </div>
    </header>
  );
}
