import { GigaClicker } from "@/components/GigaClicker";
import Link from "next/link";

export default function ClickerPage() {
  return (
    <main className="min-h-screen flex flex-col px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">GIGA CLICKER</h1>
        <div className="w-12" /> {/* Spacer for alignment */}
      </header>

      {/* Clicker */}
      <div className="flex-1 flex items-center justify-center">
        <GigaClicker />
      </div>
    </main>
  );
}
