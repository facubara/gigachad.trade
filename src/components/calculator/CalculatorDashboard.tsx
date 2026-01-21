"use client";

import { useMemo, useEffect, useState } from "react";
import { useWalletAnalysis } from "@/hooks/useWalletAnalysis";
import { useCalculator } from "@/hooks/useCalculator";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { WalletInput } from "./WalletInput";
import { TargetInput } from "./TargetInput";
import { HoldingsDisplay } from "./HoldingsDisplay";
import { ProjectionDisplay } from "./ProjectionDisplay";

const TRANSACTIONS_PER_PAGE = 20;

export function CalculatorDashboard() {
  const { analysis, balance, isLoading, loadingState, error, analyze, clear, isCacheAvailable } =
    useWalletAnalysis();
  const { price: currentPrice, isLoading: isPriceLoading } = useTokenPrice();
  const {
    targetMode,
    setTargetMode,
    targetValue,
    setTargetValue,
    computeProjection,
  } = useCalculator();

  const [currentPage, setCurrentPage] = useState(1);

  // Console log analysis data when it changes
  useEffect(() => {
    if (analysis) {
      console.log("[Frontend] Wallet Analysis Received:");
      console.log("[Frontend] Address:", analysis.address);
      console.log("[Frontend] Total transactions:", analysis.transactions.length);
      console.log("[Frontend] Buy count:", analysis.transactions.filter(t => t.type === "buy").length);
      console.log("[Frontend] Sell count:", analysis.transactions.filter(t => t.type === "sell").length);
      console.log("[Frontend] Total bought:", analysis.totalBought);
      console.log("[Frontend] Total sold:", analysis.totalSold);
      console.log("[Frontend] Avg entry price:", analysis.weightedAverageEntryPrice);
      console.log("[Frontend] All processed transactions:", analysis.transactions);
    }
  }, [analysis]);

  // Reset page when analysis changes
  useEffect(() => {
    setCurrentPage(1);
  }, [analysis?.address]);

  // Compute current value and projections
  const currentValue = useMemo(() => {
    if (balance === null || currentPrice === null) return null;
    return balance * currentPrice;
  }, [balance, currentPrice]);

  const projection = useMemo(() => {
    if (balance === null || currentPrice === null) return null;
    const entryPrice = analysis?.weightedAverageEntryPrice ?? currentPrice;
    return computeProjection({
      balance,
      entryPrice,
      currentPrice,
    });
  }, [balance, currentPrice, analysis, computeProjection]);

  const hasWalletData = balance !== null;
  const hasTarget = targetValue !== null && targetValue > 0;

  return (
    <div className="space-y-8">
      {/* Wallet Input Section */}
      <section className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <WalletInput
          onAnalyze={analyze}
          isLoading={isLoading}
          currentAddress={analysis?.address ?? null}
          loadingState={loadingState}
          isCacheAvailable={isCacheAvailable}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </section>

      {/* Holdings Display Section */}
      <section className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <HoldingsDisplay
          balance={balance}
          entryPrice={analysis?.weightedAverageEntryPrice ?? null}
          currentPrice={currentPrice}
          currentValue={currentValue}
          buyCount={analysis?.transactions.filter((tx) => tx.type === "buy").length ?? null}
          isLoading={isLoading || isPriceLoading}
          loadingState={loadingState}
        />
      </section>

      {/* Target Input Section */}
      <section className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <TargetInput
          targetMode={targetMode}
          onTargetModeChange={setTargetMode}
          targetValue={targetValue}
          onTargetValueChange={setTargetValue}
          disabled={!hasWalletData}
        />
      </section>

      {/* Projection Display Section */}
      <section className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <ProjectionDisplay
          projection={projection}
          hasWalletData={hasWalletData}
          hasTarget={hasTarget}
        />
      </section>

      {/* Transaction History (if available) */}
      {analysis && analysis.transactions.length > 0 && (
        <section className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4">
            Transaction History
          </h2>

          {/* Summary stats */}
          <div className="grid gap-4 md:grid-cols-3 text-sm mb-6">
            <div>
              <span className="text-[var(--muted)]">Total Bought: </span>
              <span className="font-mono">
                {formatNumber(analysis.totalBought)} GIGA
              </span>
            </div>
            <div>
              <span className="text-[var(--muted)]">Total Sold: </span>
              <span className="font-mono">
                {formatNumber(analysis.totalSold)} GIGA
              </span>
            </div>
            <div>
              <span className="text-[var(--muted)]">Total Transactions: </span>
              <span className="font-mono">{analysis.transactions.length}</span>
            </div>
          </div>

          {/* Transaction table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-2 text-[var(--muted)] font-medium uppercase tracking-wider text-xs">
                    Action
                  </th>
                  <th className="text-right py-3 px-2 text-[var(--muted)] font-medium uppercase tracking-wider text-xs">
                    SOL Amount
                  </th>
                  <th className="text-right py-3 px-2 text-[var(--muted)] font-medium uppercase tracking-wider text-xs">
                    GIGA Amount
                  </th>
                  <th className="text-right py-3 px-2 text-[var(--muted)] font-medium uppercase tracking-wider text-xs">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.transactions
                  .slice(
                    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
                    currentPage * TRANSACTIONS_PER_PAGE
                  )
                  .map((tx) => (
                    <tr
                      key={tx.signature}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-secondary)]/50"
                    >
                      <td className="py-3 px-2">
                        <span
                          className={`font-mono font-medium ${
                            tx.type === "buy" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        {tx.quoteAmount > 0 ? tx.quoteAmount.toFixed(4) : "-"}
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        {formatNumber(tx.gigachadAmount)}
                      </td>
                      <td className="py-3 px-2 text-right text-[var(--muted)]">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {analysis.transactions.length > TRANSACTIONS_PER_PAGE && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">
                Showing {(currentPage - 1) * TRANSACTIONS_PER_PAGE + 1}-
                {Math.min(currentPage * TRANSACTIONS_PER_PAGE, analysis.transactions.length)} of{" "}
                {analysis.transactions.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of{" "}
                  {Math.ceil(analysis.transactions.length / TRANSACTIONS_PER_PAGE)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        Math.ceil(analysis.transactions.length / TRANSACTIONS_PER_PAGE),
                        p + 1
                      )
                    )
                  }
                  disabled={
                    currentPage >=
                    Math.ceil(analysis.transactions.length / TRANSACTIONS_PER_PAGE)
                  }
                  className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
