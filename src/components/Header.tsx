"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { usePhantom } from "@/hooks/usePhantom";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/clicker", label: "Game" },
  { href: "/calculator", label: "Calculator" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { isAvailable, isConnected, publicKey, connect, disconnect } = usePhantom();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDonateClick = () => {
    const supportSection = document.getElementById("support-section");
    if (supportSection) {
      supportSection.scrollIntoView({ behavior: "smooth" });
    } else if (pathname !== "/") {
      window.location.href = "/#support-section";
    }
  };

  const handleConnectClick = async () => {
    if (isConnected) {
      setDropdownOpen(!dropdownOpen);
    } else {
      await connect();
    }
  };

  const shortAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

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

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Donate button */}
          <button
            onClick={handleDonateClick}
            className="text-[9px] tracking-[0.1em] uppercase text-[var(--dim)] px-3 py-2 border border-[var(--border)] hover:border-[var(--dim)] hover:text-[var(--muted)] transition-all"
          >
            Donate
          </button>

          {/* Connect/Wallet button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleConnectClick}
              className={`text-[9px] tracking-[0.1em] uppercase px-3 py-2 border transition-all ${
                isConnected
                  ? "border-[var(--positive)] text-[var(--positive)] hover:bg-[var(--positive)] hover:text-[var(--black)]"
                  : "border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)] hover:text-[var(--black)]"
              }`}
            >
              {isConnected && shortAddress ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[var(--positive)] rounded-full" />
                  {shortAddress}
                </span>
              ) : isAvailable ? (
                "Connect"
              ) : (
                "Get Wallet"
              )}
            </button>

            {/* Dropdown menu */}
            {isConnected && dropdownOpen && (
              <div className="absolute right-0 mt-1 py-1 bg-[var(--steel)] border border-[var(--border)] min-w-[120px] z-50">
                <button
                  onClick={() => {
                    disconnect();
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-[9px] tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--border)] transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
