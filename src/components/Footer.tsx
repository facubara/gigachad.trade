"use client";

import { TOKEN_MINT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="py-10 border-t border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="text-[9px] text-[var(--dim)] tracking-[0.05em]">
          CA: {TOKEN_MINT}
        </div>
        <div className="flex gap-8">
          <a
            href="https://x.com/gigachad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--white)] transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://t.me/GigaChadSol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--white)] transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://dexscreener.com/solana/4xxm4cdb6mescxm52xvyqknbzvdewwspdzrbctqvguar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--white)] transition-colors"
          >
            DexScreener
          </a>
        </div>
      </div>
    </footer>
  );
}
