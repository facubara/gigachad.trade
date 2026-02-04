"use client";

import { useState } from "react";

interface ShareButtonProps {
  type: "general" | "portfolio" | "holdings";
  // General stats
  multiplier?: number;
  progress?: number;
  // Portfolio stats
  address?: string;
  holdings?: string;
  targetValue?: string;
  targetMarketCap?: number;
  entryMultiplier?: number;
  currentMultiplier?: number;
  // Holdings stats
  currentValue?: string;
  avgEntry?: string;
  buyCount?: number;
  priceChange?: number;
  className?: string;
}

export function ShareButton({
  type,
  multiplier,
  progress,
  address,
  holdings,
  targetValue,
  targetMarketCap,
  entryMultiplier,
  currentMultiplier,
  currentValue,
  avgEntry,
  buyCount,
  priceChange,
  className = "",
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const formatMarketCap = (mcap: number | undefined): string => {
    if (!mcap) return "$1B";
    if (mcap >= 1_000_000_000_000) {
      return `$${(mcap / 1_000_000_000_000).toFixed(mcap % 1_000_000_000_000 === 0 ? 0 : 1)}T`;
    }
    if (mcap >= 1_000_000_000) {
      return `$${(mcap / 1_000_000_000).toFixed(mcap % 1_000_000_000 === 0 ? 0 : 1)}B`;
    }
    if (mcap >= 1_000_000) {
      return `$${(mcap / 1_000_000).toFixed(mcap % 1_000_000 === 0 ? 0 : 0)}M`;
    }
    return `$${mcap.toLocaleString()}`;
  };

  const generateTweetText = () => {
    const mcapDisplay = formatMarketCap(targetMarketCap);

    if (type === "general") {
      return `$GIGA is ${multiplier?.toFixed(1)}x away from ${mcapDisplay} market cap 🚀\n\nProgress: ${progress?.toFixed(1)}%\n\nCalculate your potential gains:`;
    }

    if (type === "portfolio" && targetValue) {
      return `My $GIGA bag will be worth $${targetValue} at ${mcapDisplay} market cap 💰\n\n${entryMultiplier ? `That's ${entryMultiplier.toFixed(1)}x from my entry 📈` : ""}\n\nCheck your potential:`;
    }

    if (type === "portfolio" && holdings) {
      return `I'm holding ${holdings} $GIGA 💎\n\nCalculate your gains:`;
    }

    if (type === "holdings" && holdings) {
      const changeText = priceChange !== undefined
        ? `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(1)}% from entry`
        : "";
      const valueText = currentValue ? ` ($${currentValue})` : "";
      return `I'm holding ${holdings} $GIGA${valueText} 💎\n\n${changeText ? `${changeText} 📈\n` : ""}${buyCount ? `${buyCount} buy transactions` : ""}\n\nCheck yours:`;
    }

    return `Check out $GIGA - The path to ${mcapDisplay} 🚀`;
  };

  const generateShareUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://gigachad.trade";
    const params = new URLSearchParams();

    params.set("type", type);

    if (type === "general") {
      if (multiplier) params.set("multiplier", multiplier.toFixed(1));
      if (progress) params.set("progress", progress.toFixed(1));
    } else if (type === "portfolio") {
      if (address) params.set("address", truncateAddress(address));
      if (holdings) params.set("holdings", holdings);
      if (targetValue) params.set("targetValue", targetValue);
      if (targetMarketCap) params.set("targetMarketCap", targetMarketCap.toString());
      if (entryMultiplier) params.set("multiplier", entryMultiplier.toFixed(1));
      if (currentMultiplier) params.set("currentMultiplier", currentMultiplier.toFixed(1));
    } else if (type === "holdings") {
      if (address) params.set("address", truncateAddress(address));
      if (holdings) params.set("holdings", holdings);
      if (currentValue) params.set("currentValue", currentValue);
      if (avgEntry) params.set("avgEntry", avgEntry);
      if (buyCount) params.set("buyCount", buyCount.toString());
      if (priceChange !== undefined) params.set("priceChange", priceChange.toFixed(1));
    }

    return `${baseUrl}/share?${params.toString()}`;
  };

  const handleShare = async () => {
    setIsSharing(true);

    const tweetText = generateTweetText();
    const shareUrl = generateShareUrl();

    // Use separate url param so Twitter unfurls the link and shows the OG image card
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");

    setIsSharing(false);
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.15em] uppercase border border-[var(--border)] text-[var(--muted)] hover:border-[var(--white)] hover:text-[var(--white)] transition-colors disabled:opacity-50 ${className}`}
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>{isSharing ? "Sharing..." : "Share"}</span>
    </button>
  );
}
