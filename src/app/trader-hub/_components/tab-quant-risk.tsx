"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import {
  calculateKellyCriterion,
  calculateTradeExpectancy,
  calculateRiskOfRuin,
} from "@/lib/trader-math";

interface TabQuantRiskProps {
  dict: Dictionary;
  assetMode: "saham" | "forex_crypto";
}

export function TabQuantRisk({ dict, assetMode }: TabQuantRiskProps) {
  const isSaham = assetMode === "saham";
  const currencyPrefix = isSaham ? "Rp" : "$";

  // Form States
  const [winRate, setWinRate] = useState<number>(55);
  const [avgWin, setAvgWin] = useState<number>(isSaham ? 1500000 : 300);
  const [avgLoss, setAvgLoss] = useState<number>(isSaham ? 750000 : 150);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(1.5);

  // Calculations
  const kellyResult = calculateKellyCriterion(winRate, avgWin, avgLoss);
  const expectancyResult = calculateTradeExpectancy(winRate, avgWin, avgLoss);
  const ruinResult = calculateRiskOfRuin(riskPerTrade, winRate, kellyResult.payoffRatio);

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

  const summaryItems = [
    { label: "Win Rate", value: `${winRate}%` },
    { label: "Payoff Ratio (R:R)", value: `1 : ${kellyResult.payoffRatio}` },
    { label: "Expectancy per Trade", value: `${formatCurrency(expectancyResult.expectancyPerTrade)}`, highlight: true },
    { label: "Proyeksi 100 Trade", value: `${formatCurrency(expectancyResult.projectedProfit100Trades)}` },
    { label: "Rekomendasi Half-Kelly", value: `${kellyResult.halfKellyPct}% modal per trade` },
    { label: "Probabilitas Ruin", value: `${ruinResult.ruinProbabilityPct}%`, highlight: true },
    { label: "Toleransi Kalah Beruntun (20% DD)", value: `${ruinResult.consecutiveLossesTo20Pct}x transaksi` },
  ];

  return (
    <div className="space-y-6">
      {/* Historical Stats Input */}
      <Card className="border-card-border shadow-xs bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <div className="border-b border-card-border pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {dict.traderHub.quantTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {dict.traderHub.quantSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurrencyInput
              id="winRate"
              label={dict.traderHub.winRateLabel}
              value={winRate}
              onChange={setWinRate}
              min={1}
              max={99}
              step={1}
              isCurrency={false}
              unit="%"
              showSlider={true}
              tooltip="Persentase kemenangan historis dari minimal 30 transaksi terakhir."
            />

            <CurrencyInput
              id="avgWin"
              label={dict.traderHub.avgWinLabel}
              value={avgWin}
              onChange={setAvgWin}
              min={1}
              max={isSaham ? 100000000 : 50000}
              step={isSaham ? 50000 : 10}
              prefix={currencyPrefix}
              showSlider={false}
              tooltip="Rata-rata nominal keuntungan saat posisi menang."
            />

            <CurrencyInput
              id="avgLoss"
              label={dict.traderHub.avgLossLabel}
              value={avgLoss}
              onChange={setAvgLoss}
              min={1}
              max={isSaham ? 100000000 : 50000}
              step={isSaham ? 50000 : 10}
              prefix={currencyPrefix}
              showSlider={false}
              tooltip="Rata-rata nominal kerugian saat posisi kalah."
            />
          </div>
        </CardContent>
      </Card>

      {/* Expectancy & Statistical Edge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-card-border shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <span className="text-sm font-bold text-foreground">
                {dict.traderHub.expectancyTitle}
              </span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                  expectancyResult.status === "positive"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : expectancyResult.status === "neutral"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                }`}
              >
                {expectancyResult.status === "positive"
                  ? "🟢 Positive Edge"
                  : expectancyResult.status === "neutral"
                  ? "🟡 Break-Even"
                  : "🔴 Negative Edge"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="text-xs text-muted-foreground">{dict.traderHub.expectancyPerTrade}</div>
                <div className="text-xl sm:text-2xl font-black text-foreground mt-1">
                  {formatCurrency(expectancyResult.expectancyPerTrade)}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  ({expectancyResult.expectancyRatio}R per trade)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="text-xs text-muted-foreground">{dict.traderHub.projectedProfit100}</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(expectancyResult.projectedProfit100Trades)}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Ekspektasi seri 100 posisi
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
              {expectancyResult.verdict}
            </p>
          </CardContent>
        </Card>

        {/* Kelly Criterion Allocation Card */}
        <Card className="border-card-border shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <span className="text-sm font-bold text-foreground">
                {dict.traderHub.kellyTitle}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                Payoff: 1 : {kellyResult.payoffRatio}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] text-center">
                <div className="text-[11px] text-muted-foreground">{dict.traderHub.fullKelly}</div>
                <div className="text-base sm:text-lg font-black text-foreground mt-1">
                  {kellyResult.fullKellyPct}%
                </div>
              </div>

              <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 text-center">
                <div className="text-[11px] text-primary font-bold">{dict.traderHub.halfKelly}</div>
                <div className="text-base sm:text-lg font-black text-primary mt-1">
                  {kellyResult.halfKellyPct}%
                </div>
              </div>

              <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] text-center">
                <div className="text-[11px] text-muted-foreground">{dict.traderHub.quarterKelly}</div>
                <div className="text-base sm:text-lg font-black text-foreground mt-1">
                  {kellyResult.quarterKellyPct}%
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5">
              <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                <span>🛡️ {dict.traderHub.recommendedRisk}:</span>
                <span className="text-sm font-black">{kellyResult.recommendedRiskPct}% Modal</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {kellyResult.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk of Ruin & Capital Preservation */}
      <Card className="border-card-border shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {dict.traderHub.ruinTitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stress-test ketahanan modal terhadap rentetan kerugian (*losing streaks*).
              </p>
            </div>

            {/* Risk per trade slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground">Simulasi Risiko per Trade:</span>
              <span className="text-sm font-extrabold px-3 py-1 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] border border-card-border">
                {riskPerTrade}%
              </span>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.5}
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                aria-label="Simulasi Risiko per Trade"
                className="w-24 sm:w-32 accent-primary cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs text-muted-foreground">{dict.traderHub.ruinProb}</div>
              <div className={`text-2xl font-black mt-1 ${
                ruinResult.status === "minimal"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : ruinResult.status === "moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}>
                {ruinResult.ruinProbabilityPct}%
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Status: <strong className="capitalize">{ruinResult.status}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs text-muted-foreground">{dict.traderHub.consecutiveLoss20}</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {ruinResult.consecutiveLossesTo20Pct}x
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Kalah beruntun untuk modal susut 20%
              </div>
            </div>

            <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
              <div className="text-xs text-muted-foreground">{dict.traderHub.consecutiveLoss50}</div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {ruinResult.consecutiveLossesTo50Pct}x
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Kalah beruntun untuk modal terpotong 50%
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.02] text-xs text-muted-foreground leading-relaxed">
            💡 <strong>Saran CRO (Bramantyo):</strong> {ruinResult.advice}
          </div>

          <ShareSummaryButton
            title="Analisis Kuantitatif & Risk Guard"
            items={summaryItems}
            featureUrl="https://amir-app.local/trader-hub"
          />
        </CardContent>
      </Card>
    </div>
  );
}
