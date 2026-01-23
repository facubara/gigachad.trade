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
    <div className="space-y-6">
      <h2 className="text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]">
        Set Target
      </h2>

      {/* Mode toggle */}
      <div className="flex gap-px bg-[var(--border)]">
        <button
          onClick={() => onTargetModeChange("marketCap")}
          disabled={disabled}
          className={`flex-1 py-3 px-6 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors ${
            targetMode === "marketCap"
              ? "bg-[var(--white)] text-[var(--black)]"
              : "bg-[var(--steel)] text-[var(--muted)] hover:text-[var(--white)]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Market Cap
        </button>
        <button
          onClick={() => onTargetModeChange("tokenPrice")}
          disabled={disabled}
          className={`flex-1 py-3 px-6 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors ${
            targetMode === "tokenPrice"
              ? "bg-[var(--white)] text-[var(--black)]"
              : "bg-[var(--steel)] text-[var(--muted)] hover:text-[var(--white)]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Token Price
        </button>
      </div>

      {/* Value input */}
      <div className="relative border border-[var(--border)]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dim)] text-sm">
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
          className="w-full pl-8 pr-4 py-4 bg-[var(--bg)] text-[var(--white)] placeholder:text-[var(--dim)] focus:outline-none font-mono text-[12px] tracking-[0.02em] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Presets (only for market cap mode) */}
      {targetMode === "marketCap" && (
        <div className="flex flex-wrap gap-px bg-[var(--border)]">
          {MARKET_CAP_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              disabled={disabled}
              className={`px-5 py-3 text-[11px] tracking-[0.1em] font-medium transition-colors ${
                targetValue === preset.value
                  ? "bg-[var(--white)] text-[var(--black)]"
                  : "bg-[var(--steel)] text-[var(--muted)] hover:text-[var(--white)]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
