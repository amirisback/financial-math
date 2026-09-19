"use client";

import React, { useState } from "react";

export interface QuickPreset {
  label: string;
  addAmount?: number;
  setAmount?: number;
  value?: number;
  isAdd?: boolean;
}

export interface CurrencyInputProps {
  id?: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  isCurrency?: boolean;
  prefix?: string;
  quickPresets?: QuickPreset[];
  presets?: QuickPreset[];
  tickMarks?: string[];
  tooltip?: string;
  tooltipText?: string;
  showSlider?: boolean;
  className?: string;
}

// Helper untuk format pemisah ribuan titik (contoh: 10000000 -> "10.000.000")
export function formatThousands(num: number): string {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
}

// Helper untuk parse string bertitik kembali ke number
export function parseThousands(str: string): number {
  const clean = str.replace(/[^\d]/g, "");
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 1000000000,
  step = 100000,
  unit = "",
  isCurrency = true,
  prefix = "Rp",
  quickPresets,
  presets,
  tickMarks,
  tooltip,
  tooltipText,
  showSlider = true,
  className = "",
}: CurrencyInputProps) {
  const activeTooltip = tooltip || tooltipText;
  const activePresets = quickPresets || presets;
  const [prevValue, setPrevValue] = useState<number>(value);
  const [displayStr, setDisplayStr] = useState<string>(() =>
    isCurrency ? formatThousands(value) : String(value)
  );
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Sinkronisasi saat value dari parent berubah (pola React 19 tanpa useEffect cascading render)
  if (value !== prevValue) {
    setPrevValue(value);
    setDisplayStr(isCurrency ? formatThousands(value) : String(value));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (isCurrency) {
      const num = parseThousands(raw);
      setDisplayStr(raw === "" ? "" : formatThousands(num));
      onChange(num);
    } else {
      const parsed = parseFloat(raw);
      setDisplayStr(raw);
      if (!isNaN(parsed)) {
        onChange(parsed);
      } else if (raw === "") {
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    let finalVal = isCurrency ? parseThousands(displayStr) : parseFloat(displayStr) || 0;
    if (min !== undefined && finalVal < min) finalVal = min;
    if (max !== undefined && finalVal > max) finalVal = max;
    onChange(finalVal);
    setDisplayStr(isCurrency ? formatThousands(finalVal) : String(finalVal));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    onChange(num);
    setDisplayStr(isCurrency ? formatThousands(num) : String(num));
  };

  const handlePresetClick = (preset: QuickPreset) => {
    let newVal = value;
    if (preset.setAmount !== undefined) {
      newVal = preset.setAmount;
    } else if (preset.addAmount !== undefined) {
      newVal = Math.min(max, value + preset.addAmount);
    } else if (preset.value !== undefined) {
      if (preset.isAdd) {
        newVal = Math.min(max, value + preset.value);
      } else {
        newVal = preset.value;
      }
    }
    onChange(newVal);
    setDisplayStr(isCurrency ? formatThousands(newVal) : String(newVal));
  };

  const handleStep = (direction: "inc" | "dec") => {
    const currentStep = step || 100000;
    let newVal = direction === "inc" ? value + currentStep : value - currentStep;
    if (min !== undefined && newVal < min) newVal = min;
    if (max !== undefined && newVal > max) newVal = max;
    onChange(newVal);
    setDisplayStr(isCurrency ? formatThousands(newVal) : String(newVal));
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Label & Nilai Terbaca Jelas */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={id}
            className="text-sm sm:text-base font-bold text-foreground tracking-tight"
          >
            {label}
          </label>
          {activeTooltip && (
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                aria-label={`Penjelasan ${label}`}
              >
                ⓘ
              </button>
              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 text-xs text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-card-border rounded-xl shadow-xl z-30 leading-relaxed pointer-events-none">
                  {activeTooltip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badge Angka Hasil Besar & Terbaca */}
        <span className="text-sm sm:text-base font-extrabold text-primary bg-primary/10 px-3.5 py-1 rounded-xl border border-primary/20 shadow-xs">
          {isCurrency ? `${prefix} ${formatThousands(value)}` : `${value} ${unit}`.trim()}
          {unit && isCurrency ? ` / ${unit}` : ""}
        </span>
      </div>

      {/* Kontrol Input & Stepper (Min-h 44px ramah jari 35++) */}
      <div className="flex items-center gap-2">
        {/* Tombol Kurang (-) */}
        <button
          type="button"
          onClick={() => handleStep("dec")}
          disabled={value <= min}
          aria-label={`Kurangi ${label}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-card-border bg-black/[0.03] dark:bg-white/[0.05] text-base font-extrabold text-foreground hover:bg-black/[0.08] dark:hover:bg-white/[0.1] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
        >
          −
        </button>

        {/* Box Input dengan Pemisah Ribuan Titik */}
        <div className="relative flex-1 flex items-center">
          {isCurrency && (
            <span className="absolute left-3.5 text-sm sm:text-base font-bold text-zinc-500 dark:text-zinc-400 select-none pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={displayStr}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full h-11 rounded-xl border-2 border-card-border bg-white dark:bg-zinc-900 ${
              isCurrency ? "pl-11 pr-3" : "px-3"
            } text-sm sm:text-base font-bold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-xs`}
            placeholder="0"
          />
          {unit && !isCurrency && (
            <span className="absolute right-3.5 text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 select-none pointer-events-none">
              {unit}
            </span>
          )}
        </div>

        {/* Tombol Tambah (+) */}
        <button
          type="button"
          onClick={() => handleStep("inc")}
          disabled={value >= max}
          aria-label={`Tambah ${label}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-card-border bg-black/[0.03] dark:bg-white/[0.05] text-base font-extrabold text-foreground hover:bg-black/[0.08] dark:hover:bg-white/[0.1] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
        >
          +
        </button>
      </div>

      {/* Slider Track Tebal (h-3) & Nyaman Dijangkau Jempol */}
      {showSlider && (
        <div className="flex flex-col gap-1.5 pt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            aria-label={`Slider ${label}`}
            className="w-full h-3 rounded-lg bg-zinc-200 dark:bg-zinc-700 accent-primary cursor-pointer transition-all"
          />

          {/* Tick Marks yang Terbaca Jelas (Bukan 10px lagi!) */}
          {tickMarks && tickMarks.length > 0 && (
            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300 px-0.5">
              {tickMarks.map((tm, idx) => (
                <span key={idx}>{tm}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Increment Chips (Sangat disukai usia 35+ agar tidak perlu hitung nol) */}
      {activePresets && activePresets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1.5 rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-xs font-bold text-zinc-700 dark:text-zinc-200 transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
