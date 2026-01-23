import { CalculatorDashboard } from "@/components/calculator";

export const metadata = {
  title: "Portfolio Calculator | GIGACHAD",
  description:
    "Calculate your GIGACHAD portfolio value and see projections at different price targets.",
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-6 flex items-center justify-center">
          <h1 className="text-[11px] font-medium tracking-[0.2em] uppercase">
            Portfolio Calculator
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-12">
        <CalculatorDashboard />
        <p className="text-[10px] tracking-[0.1em] text-[var(--dim)] text-center mt-12">
          Entry price calculated from on-chain transaction history. Results are estimates only.
        </p>
      </div>
    </main>
  );
}
