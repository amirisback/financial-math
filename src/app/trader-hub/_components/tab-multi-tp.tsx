"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import {
  calculateScaleOutTP,
  calculateAtrVolatilityStop,
  type TpTierConfig,
} from "@/lib/trader-math";

interface TabMultiTpProps {
  dict: Dictionary;
  assetMode: "saham" | "forex_crypto";
}

export function TabMultiTp({ dict, assetMode }: TabMultiTpProps) {
  const isSaham = assetMode === "saham";
  const currencyPrefix = isSaham ? "Rp" : "$";
  const unitMultiplier = isSaham ? 100 : 1;

  // Form State
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [entryPrice, setEntryPrice] = useState<number>(isSaham ? 5000 : 100);
  const [stopLossPrice, setStopLossPrice] = useState<number>(isSaham ? 4750 : 95);
  const [totalLots, setTotalLots] = useState<number>(isSaham ? 20 : 10);

  // ATR Assistant State
  const [showAtrHelper, setShowAtrHelper] = useState<boolean>(false);
  const [atrValue, setAtrValue] = useState<number>(isSaham ? 120 : 2.5);
  const [atrMultiplier, setAtrMultiplier] = useState<number>(1.5);

  // TP Tiers Configuration
  const [tier1Pct, setTier1Pct] = useState<number>(50);
  const tier1Rr = 1.5;

  const [tier2Pct, setTier2Pct] = useState<number>(30);
  const tier2Rr = 2.5;

  const [tier3Pct, setTier3Pct] = useState<number>(20);
  const tier3Rr = 4.0;

  const tpConfigs: TpTierConfig[] = [
    { percentOfPosition: tier1Pct, riskRewardRatio: tier1Rr },
    { percentOfPosition: tier2Pct, riskRewardRatio: tier2Rr },
    { percentOfPosition: tier3Pct, riskRewardRatio: tier3Rr },
  ];

  // Perform Scale-Out Calculations
  const result = calculateScaleOutTP(
    entryPrice,
    stopLossPrice,
    totalLots,
    direction,
    tpConfigs,
    unitMultiplier
  );

  // ATR Calculation
  const atrResult = calculateAtrVolatilityStop(
    entryPrice,
    atrValue,
    atrMultiplier,
    direction
  );

  const handleApplyAtr = () => {
    if (atrResult.recommendedStopLoss > 0) {
      setStopLossPrice(atrResult.recommendedStopLoss);
    }
  };

  const formatCurrency = (val: number) => {
    if (isSaham) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Prepare summary items for sharing
  const summaryItems = [
    {
      label: "Arah Posisi",
      value: `${direction === "LONG" ? "Beli (Long)" : "Jual (Short)"}`,
    },
    { label: "Harga Entry", value: `${currencyPrefix} ${entryPrice.toLocaleString()}` },
    { label: "Stop Loss", value: `${currencyPrefix} ${stopLossPrice.toLocaleString()}` },
    { label: "Ukuran Posisi", value: `${totalLots} ${isSaham ? "Lot (100 lembar)" : "Unit"}` },
    { label: "Total Risiko", value: formatCurrency(result.totalRiskAmount), highlight: true },
    { label: "Blended R:R", value: `1 : ${result.blendedRiskReward}` },
    { label: "Target TP 1", value: `${currencyPrefix} ${result.tiers[0]?.targetPrice.toLocaleString()} (${result.tiers[0]?.lots} lot)` },
    { label: "Target TP 2", value: `${currencyPrefix} ${result.tiers[1]?.targetPrice.toLocaleString()} (${result.tiers[1]?.lots} lot)` },
    { label: "Target TP 3", value: `${currencyPrefix} ${result.tiers[2]?.targetPrice.toLocaleString()} (${result.tiers[2]?.lots} lot)` },
    { label: "Ekspektasi Profit", value: formatCurrency(result.totalExpectedProfit), highlight: true },
  ];

  return (
    <div className="space-y-6">
      {/* Parameter Input Card */}
      <Card className="border-card-border shadow-xs bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                {dict.traderHub.tabMultiTp}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {dict.traderHub.tpTiersTitle}
              </p>
            </div>

            {/* Direction Selector (Min-h 44px) */}
            <div className="inline-flex rounded-xl p-1 bg-black/[0.04] dark:bg-white/[0.05] border border-card-border">
              <button
                type="button"
                onClick={() => setDirection("LONG")}
                className={`min-h-[44px] px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  direction === "LONG"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ▲ {dict.traderHub.directionLong}
              </button>
              <button
                type="button"
                onClick={() => setDirection("SHORT")}
                className={`min-h-[44px] px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  direction === "SHORT"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ▼ {dict.traderHub.directionShort}
              </button>
            </div>
          </div>

          {/* Primary Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurrencyInput
              id="entryPrice"
              label={dict.traderHub.entryPriceLabel}
              value={entryPrice}
              onChange={setEntryPrice}
              min={1}
              max={isSaham ? 200000 : 100000}
              step={isSaham ? 25 : 1}
              prefix={currencyPrefix}
              showSlider={false}
              tooltip="Harga pembukaan posisi trading Anda."
            />

            <CurrencyInput
              id="stopLossPrice"
              label={dict.traderHub.stopLossPriceLabel}
              value={stopLossPrice}
              onChange={setStopLossPrice}
              min={1}
              max={isSaham ? 200000 : 100000}
              step={isSaham ? 25 : 1}
              prefix={currencyPrefix}
              showSlider={false}
              tooltip="Level harga proteksi jika pergerakan pasar berlawanan arah."
            />

            <CurrencyInput
              id="totalLots"
              label={dict.traderHub.totalLotsLabel}
              value={totalLots}
              onChange={setTotalLots}
              min={1}
              max={10000}
              step={1}
              isCurrency={false}
              unit={isSaham ? "Lot" : "Unit"}
              showSlider={false}
              tooltip="Jumlah total posisi yang dibuka."
            />
          </div>

          {/* ATR Volatility Assistant Drawer */}
          <div className="border border-card-border rounded-2xl bg-black/[0.01] dark:bg-white/[0.01] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    {dict.traderHub.atrSectionTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Hitung jarak Stop Loss dinamis berdasarkan volatilitas harian riil (14-period).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAtrHelper(!showAtrHelper)}
                className="min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border border-card-border hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all text-primary"
              >
                {showAtrHelper ? "Tutup ▲" : "Buka ATR Asisten ▼"}
              </button>
            </div>

            {showAtrHelper && (
              <div className="mt-4 pt-4 border-t border-card-border grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <CurrencyInput
                  id="atrValue"
                  label={dict.traderHub.atrValueLabel}
                  value={atrValue}
                  onChange={setAtrValue}
                  min={0.1}
                  max={isSaham ? 5000 : 500}
                  step={isSaham ? 5 : 0.1}
                  prefix={currencyPrefix}
                  showSlider={false}
                />

                <div>
                  <label className="text-sm font-bold text-foreground block mb-2">
                    {dict.traderHub.atrMultiplierLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1.5, 2.0, 3.0].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setAtrMultiplier(m)}
                        className={`min-h-[44px] rounded-xl text-xs font-bold border transition-all ${
                          atrMultiplier === m
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-card-border bg-white dark:bg-zinc-900 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {m}x ATR
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-xs text-muted-foreground">
                    Rekomendasi SL:{" "}
                    <strong className="text-foreground">
                      {currencyPrefix} {atrResult.recommendedStopLoss.toLocaleString()}
                    </strong>{" "}
                    (Buffer {atrResult.volatilityBufferPercent}%)
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyAtr}
                    className="min-h-[44px] px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:opacity-90 active:scale-98 transition-all"
                  >
                    ✓ {dict.traderHub.atrApplyButton}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TP Tiers Configuration Sliders */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Konfigurasi Alokasi Scale-Out
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier 1 */}
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Target TP 1
                  </span>
                  <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                    R:R 1 : {tier1Rr}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Alokasi: <strong className="text-foreground">{tier1Pct}%</strong> Posisi
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={tier1Pct}
                  onChange={(e) => setTier1Pct(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Tier 2 */}
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Target TP 2
                  </span>
                  <span className="text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
                    R:R 1 : {tier2Rr}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Alokasi: <strong className="text-foreground">{tier2Pct}%</strong> Posisi
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={tier2Pct}
                  onChange={(e) => setTier2Pct(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Tier 3 */}
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Target TP 3 (Runner)
                  </span>
                  <span className="text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md">
                    R:R 1 : {tier3Rr}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Alokasi: <strong className="text-foreground">{tier3Pct}%</strong> Sisa Posisi
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={tier3Pct}
                  onChange={(e) => setTier3Pct(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {result.tiers.map((tier, idx) => {
          const colors = [
            "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
            "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
            "border-violet-500/30 bg-violet-500/5 text-violet-600 dark:text-violet-400",
          ];
          const badgeClass = colors[idx] || colors[0];

          return (
            <Card key={tier.tierIndex} className="border-card-border shadow-xs">
              <CardContent className="p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${badgeClass}`}>
                    Target TP {tier.tierIndex} ({tier.percentage}%)
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    R:R 1 : {tier.riskReward}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {currencyPrefix} {tier.targetPrice.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground flex justify-between pt-1 border-t border-card-border">
                  <span>Realisasi: <strong>{tier.lots} {isSaham ? "Lot" : "Unit"}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    +{formatCurrency(tier.targetProfit)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Matrix & BEP Advice */}
      <Card className="border-card-border bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.02] dark:from-white/[0.02] dark:to-white/[0.02] shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {dict.traderHub.summaryTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                Kalkulasi agregat risiko dan probabilitas keuntungan gabungan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">Blended R:R:</span>
              <span className="text-base font-extrabold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                1 : {result.blendedRiskReward}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <div className="text-xs text-muted-foreground">{dict.traderHub.totalRisk}</div>
              <div className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {formatCurrency(result.totalRiskAmount)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Jarak SL: {result.riskPerUnit.toLocaleString()} poin per unit
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-xs text-muted-foreground">{dict.traderHub.totalProfit}</div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(result.totalExpectedProfit)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Total akumulasi bila semua level TP tereksekusi
              </div>
            </div>
          </div>

          {/* BEP Reminder Banner */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                {dict.traderHub.bepNotice}
              </div>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                {result.bepAdvice}
              </p>
            </div>
          </div>

          {/* Share Button */}
          <ShareSummaryButton
            title="Trading Plan Multi-TP"
            items={summaryItems}
            featureUrl="https://amir-app.local/trader-hub"
          />
        </CardContent>
      </Card>
    </div>
  );
}
