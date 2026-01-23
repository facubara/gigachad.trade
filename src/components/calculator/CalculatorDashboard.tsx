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

type SortColumn = "solAmount" | "gigaAmount" | "date";
type SortDirection = "asc" | "desc";

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
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  // Reset page and sort when analysis changes
  useEffect(() => {
    setCurrentPage(1);
    setSortColumn("date");
    setSortDirection("desc");
  }, [analysis?.address]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    if (!analysis) return [];
    const txs = [...analysis.transactions];

    txs.sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case "solAmount":
          comparison = a.quoteAmount - b.quoteAmount;
          break;
        case "gigaAmount":
          comparison = a.gigachadAmount - b.gigachadAmount;
          break;
        case "date":
          comparison = a.timestamp - b.timestamp;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return txs;
  }, [analysis, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

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
    <div className="space-y-px bg-[var(--border)]">
      {/* Wallet Input Section */}
      <section className="p-8 md:p-10 bg-[var(--steel)]">
        <WalletInput
          onAnalyze={analyze}
          isLoading={isLoading}
          currentAddress={analysis?.address ?? null}
          loadingState={loadingState}
          isCacheAvailable={isCacheAvailable}
        />
        {error && (
          <div className="mt-6 p-4 border border-[var(--negative)] text-[var(--negative)] text-[11px] tracking-[0.05em]">
            {error}
          </div>
        )}
      </section>

      {/* Holdings Display Section */}
      <section className="p-8 md:p-10 bg-[var(--steel)]">
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
      <section className="p-8 md:p-10 bg-[var(--steel)]">
        <TargetInput
          targetMode={targetMode}
          onTargetModeChange={setTargetMode}
          targetValue={targetValue}
          onTargetValueChange={setTargetValue}
          disabled={!hasWalletData}
        />
      </section>

      {/* Projection Display Section */}
      <section className="p-8 md:p-10 bg-[var(--steel)]">
        <ProjectionDisplay
          projection={projection}
          hasWalletData={hasWalletData}
          hasTarget={hasTarget}
        />
      </section>

      {/* Transaction History (if available) */}
      {analysis && analysis.transactions.length > 0 && (
        <section className="p-8 md:p-10 bg-[var(--steel)]">
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)] mb-6">
            Transaction History
          </h2>

          {/* Summary stats */}
          <div className="grid gap-6 md:grid-cols-3 text-sm mb-8">
            <div>
              <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)]">Total Bought</span>
              <p className="font-mono text-lg mt-1">
                {formatNumber(analysis.totalBought)} GIGA
              </p>
            </div>
            <div>
              <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)]">Total Sold</span>
              <p className="font-mono text-lg mt-1">
                {formatNumber(analysis.totalSold)} GIGA
              </p>
            </div>
            <div>
              <span className="text-[9px] tracking-[0.15em] uppercase text-[var(--dim)]">Total Transactions</span>
              <p className="font-mono text-lg mt-1">{analysis.transactions.length}</p>
            </div>
          </div>

          {/* Transaction table */}
          <div className="overflow-x-auto border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  <th className="text-left py-3 px-4 text-[var(--dim)] font-medium uppercase tracking-[0.1em] text-[9px]">
                    Action
                  </th>
                  <SortableHeader
                    label="SOL Amount"
                    column="solAmount"
                    currentColumn={sortColumn}
                    direction={sortDirection}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortableHeader
                    label="GIGA Amount"
                    column="gigaAmount"
                    currentColumn={sortColumn}
                    direction={sortDirection}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortableHeader
                    label="Date"
                    column="date"
                    currentColumn={sortColumn}
                    direction={sortDirection}
                    onSort={handleSort}
                    align="right"
                  />
                </tr>
              </thead>
              <tbody>
                {sortedTransactions
                  .slice(
                    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
                    currentPage * TRANSACTIONS_PER_PAGE
                  )
                  .map((tx) => (
                    <tr
                      key={tx.signature}
                      className="border-b border-[var(--border)] hover:bg-[var(--border)]/30"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-medium text-[11px] tracking-[0.05em] ${
                            tx.type === "buy" ? "text-[var(--positive)]" : "text-[var(--negative)]"
                          }`}
                        >
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[12px]">
                        {tx.quoteAmount > 0 ? tx.quoteAmount.toFixed(4) : "—"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[12px]">
                        {formatNumber(tx.gigachadAmount)}
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--muted)] text-[11px]">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {analysis.transactions.length > TRANSACTIONS_PER_PAGE && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--border)]">
              <span className="text-[10px] tracking-[0.1em] text-[var(--muted)]">
                Showing {(currentPage - 1) * TRANSACTIONS_PER_PAGE + 1}–
                {Math.min(currentPage * TRANSACTIONS_PER_PAGE, analysis.transactions.length)} of{" "}
                {analysis.transactions.length}
              </span>
              <div className="flex gap-px bg-[var(--border)]">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-[10px] tracking-[0.1em] uppercase bg-[var(--steel)] hover:bg-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-[10px] tracking-[0.1em] bg-[var(--steel)]">
                  {currentPage} / {Math.ceil(analysis.transactions.length / TRANSACTIONS_PER_PAGE)}
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
                  className="px-4 py-2 text-[10px] tracking-[0.1em] uppercase bg-[var(--steel)] hover:bg-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

function SortableHeader({
  label,
  column,
  currentColumn,
  direction,
  onSort,
  align = "left",
}: {
  label: string;
  column: SortColumn;
  currentColumn: SortColumn;
  direction: SortDirection;
  onSort: (column: SortColumn) => void;
  align?: "left" | "right";
}) {
  const isActive = currentColumn === column;

  return (
    <th
      className={`py-3 px-4 text-[var(--dim)] font-medium uppercase tracking-[0.1em] text-[9px] cursor-pointer hover:text-[var(--white)] transition-colors select-none ${
        align === "right" ? "text-right" : "text-left"
      }`}
      onClick={() => onSort(column)}
    >
      <span className="inline-flex items-center gap-1">
        {align === "right" && (
          <SortIndicator isActive={isActive} direction={direction} />
        )}
        {label}
        {align === "left" && (
          <SortIndicator isActive={isActive} direction={direction} />
        )}
      </span>
    </th>
  );
}

function SortIndicator({
  isActive,
  direction,
}: {
  isActive: boolean;
  direction: SortDirection;
}) {
  return (
    <span className="inline-flex flex-col">
      <svg
        className={`w-2 h-2 transition-colors ${
          isActive && direction === "asc"
            ? "text-[var(--white)]"
            : "text-[var(--dim)]"
        }`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0L5 0Z" />
      </svg>
      <svg
        className={`w-2 h-2 -mt-0.5 transition-colors ${
          isActive && direction === "desc"
            ? "text-[var(--white)]"
            : "text-[var(--dim)]"
        }`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0H10L5 6Z" />
      </svg>
    </span>
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
