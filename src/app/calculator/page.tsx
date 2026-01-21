import Link from "next/link";
import { CalculatorDashboard } from "@/components/calculator";

export const metadata = {
  title: "Portfolio Calculator | GIGACHAD",
  description:
    "Calculate your GIGACHAD portfolio value and see projections at different price targets.",
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </Link>

          <h1 className="text-lg font-bold uppercase tracking-wider">
            Portfolio Calculator
          </h1>

          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CalculatorDashboard />
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-[var(--muted)]">
          <p>
            Entry price is calculated from your on-chain transaction history.
            Results are estimates only.
          </p>
        </div>
      </footer>
    </main>
  );
}
