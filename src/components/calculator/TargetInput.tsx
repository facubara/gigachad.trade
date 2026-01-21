"use client";

import { useState, useEffect } from "react";
import { TargetMode, MARKET_CAP_PRESETS } from "@/hooks/useCalculator";

interface TargetInputProps {
  targetMode: TargetMode;
  onTargetModeChange: (mode: TargetMode) => void;
  targetValue: number | null;
  onTargetValueChange: (value: number | null) => void;
  disabled?: boolean;
}

export function TargetInput({
  targetMode,
  onTargetModeChange,
  targetValue,
  onTargetValueChange,
  disabled = false,
}: TargetInputProps) {
  const [inputValue, setInputValue] = useState("");

  // Sync input with targetValue
  useEffect(() => {
    if (targetValue !== null) {
      setInputValue(formatInputValue(targetValue));
    }
  }, [targetValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setInputValue(raw);

    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed > 0) {
      onTargetValueChange(parsed);
    } else {
      onTargetValueChange(null);
    }
  };

  const handlePresetClick = (value: number) => {
    onTargetModeChange("marketCap");
    onTargetValueChange(value);
    setInputValue(formatInputValue(value));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
        Set Target
      </h2>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onTargetModeChange("marketCap")}
          disabled={disabled}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            targetMode === "marketCap"
              ? "bg-[var(--accent)] text-black"
              : "bg-[var(--bg-secondary)] text-[var(--muted)] hover:text-[var(--text)]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Market Cap
        </button>
        <button
          onClick={() => onTargetModeChange("tokenPrice")}
          disabled={disabled}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            targetMode === "tokenPrice"
              ? "bg-[var(--accent)] text-black"
              : "bg-[var(--bg-secondary)] text-[var(--muted)] hover:text-[var(--text)]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Token Price
        </button>
      </div>

      {/* Value input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
          $
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={
            targetMode === "marketCap" ? "Enter market cap..." : "Enter price..."
          }
          disabled={disabled}
          className="w-full pl-8 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Presets (only for market cap mode) */}
      {targetMode === "marketCap" && (
        <div className="flex flex-wrap gap-2">
          {MARKET_CAP_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                targetValue === preset.value
                  ? "bg-[var(--accent)] text-black"
                  : "bg-[var(--bg-secondary)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)]"
              } border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatInputValue(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toString();
  }
  if (value >= 1_000_000) {
    return value.toString();
  }
  return value.toString();
}
