"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { calculateEmasInvestment } from "@/lib/asset-math";

interface GoldCalculatorProps {
  dict: Dictionary;
}

export function GoldCalculator({ dict }: GoldCalculatorProps) {
  const e = dict.emas;

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // State Variables
  const [emasWeight, setEmasWeight] = useState<number>(10);
  const [emasPriceBuy, setEmasPriceBuy] = useState<number>(1300000);
  const [emasPriceSell, setEmasPriceSell] = useState<number>(1200000);
  const [emasNpwp, setEmasNpwp] = useState<"npwp" | "no-npwp">("npwp");

  // Pure Math Calculation
  const result = calculateEmasInvestment({
    weightGrams: emasWeight,
    priceBuyPerGram: emasPriceBuy,
    priceSellPerGram: emasPriceSell,
    npwpStatus: emasNpwp,
  });

  const isProfit = result.netProfit >= 0;

  // Share Summary Text
  const generateShareSummary = () => {
    return (
      `🪙 *Ringkasan Investasi Emas Batangan - Amir App*\n` +
      `• Berat: ${emasWeight} Gram | Status: ${emasNpwp === "npwp" ? "NPWP Aktif (Diskon Pajak)" : "Non-NPWP"}\n` +
      `• Harga Beli: ${formatIDR(emasPriceBuy)}/gram\n` +
      `• Harga Buyback: ${formatIDR(emasPriceSell)}/gram\n` +
      `• Selisih Spread: ${formatIDR(result.spreadNominal)}/gram (${result.spreadPercent.toFixed(1)}%)\n` +
      `• Total Modal Beli (Bersih PPh 22): ${formatIDR(result.totalCostBuy)}\n` +
      `• Dana Diterima dari Buyback: ${formatIDR(result.netReceived)}\n` +
      `• Laba/Rugi Bersih: ${isProfit ? "+" : ""}${formatIDR(result.netProfit)} (${result.roi.toFixed(2)}% ROI)\n` +
      `• Harga Buyback Impas (BEP): ${formatIDR(result.bepSellPricePerGram)}/gram\n\n` +
      `Dihitung di: ${typeof window !== "undefined" ? window.location.href : "Amir App"}`
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <span>🪙 Logam Mulia & Emas Fisik Antam/UBS</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {e.title}
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-3xl">
            {e.description}
          </p>
        </div>
        <div className="self-start sm:self-center">
          <ShareSummaryButton
            title={e.title}
            summaryText={generateShareSummary()}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg shadow-sm">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Gram Weight Presets */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="emas-weight-input"
                  className="text-xs font-semibold text-foreground flex justify-between"
                >
                  <span>{e.weight}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {emasWeight} Gram
                  </span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 5, 10, 25, 50, 100].map((gram) => (
                    <button
                      key={gram}
                      type="button"
                      onClick={() => setEmasWeight(gram)}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                        emasWeight === gram
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs"
                          : "border-card-border text-zinc-500 hover:text-foreground"
                      }`}
                    >
                      {gram}g
                    </button>
                  ))}
                </div>
                <div className="mt-1">
                  <input
                    id="emas-weight-input"
                    type="range"
                    min="0.5"
                    max="500"
                    step="0.5"
                    value={emasWeight}
                    onChange={(e) => setEmasWeight(Number.parseFloat(e.target.value))}
                    className="h-2 w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] accent-amber-500 cursor-pointer min-h-[44px]"
                  />
                </div>
              </div>

              {/* Price Buy per Gram */}
              <CurrencyInput
                id="emas-buy-price"
                label={e.priceBuy}
                value={emasPriceBuy}
                onChange={setEmasPriceBuy}
                min={500000}
                max={5000000}
                step={5000}
                presets={[
                  { label: "1.200.000", value: 1200000 },
                  { label: "1.300.000", value: 1300000 },
                  { label: "1.400.000", value: 1400000 },
                  { label: "1.500.000", value: 1500000 },
                ]}
              />

              {/* Price Sell / Buyback per Gram */}
              <CurrencyInput
                id="emas-sell-price"
                label={e.priceSell}
                value={emasPriceSell}
                onChange={setEmasPriceSell}
                min={500000}
                max={5000000}
                step={5000}
                presets={[
                  { label: "1.100.000", value: 1100000 },
                  { label: "1.200.000", value: 1200000 },
                  { label: "1.300.000", value: 1300000 },
                  { label: "1.400.000", value: 1400000 },
                ]}
              />

              {/* NPWP Status Switcher */}
              <div className="flex flex-col gap-2 pt-2 border-t border-card-border/50">
                <label className="text-xs font-semibold text-foreground">{e.taxScheme}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmasNpwp("npwp")}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                      emasNpwp === "npwp"
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                        : "border-card-border text-zinc-500 hover:text-foreground"
                    }`}
                  >
                    ✓ {e.npwpActive}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmasNpwp("no-npwp")}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                      emasNpwp === "no-npwp"
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                        : "border-card-border text-zinc-500 hover:text-foreground"
                    }`}
                  >
                    {e.noNpwp}
                  </button>
                </div>
                <span className="text-2xs text-muted-foreground mt-1">
                  Berdasarkan PMK 34/2017: Tarif PPh 22 beli untuk NPWP 0.45% (Non-NPWP 0.90%). PPh 22
                  buyback 1.5% (Non-NPWP 3.0%) khusus transaksi di atas Rp 10 Juta.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border border-card-border bg-gradient-to-br from-amber-500/5 via-card-bg to-yellow-500/5 shadow-md">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Profit / Loss Banner */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {e.netProfit}
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-2xl sm:text-3xl font-black ${
                      isProfit
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isProfit ? "+" : ""}
                    {formatIDR(result.netProfit)}
                  </span>
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                      isProfit
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {result.roi.toFixed(2)}% ROI
                  </span>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="flex flex-col gap-3 pt-4 border-t border-card-border/50 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{e.totalSpendBuy}:</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(result.totalCostBuy)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{e.netReceived}:</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(result.netReceived)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-bold">
                  <span>{e.bepBuyback}:</span>
                  <span className="text-sm font-black">
                    {formatIDR(result.bepSellPricePerGram)} / gram
                  </span>
                </div>
              </div>

              {/* Spread Analysis Card */}
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] p-3.5 border border-card-border/50 text-xs flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">{e.spread}:</span>
                  <span className="font-black text-foreground">
                    {formatIDR(result.spreadNominal)} / gram ({result.spreadPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="text-2xs text-muted-foreground">
                  Spread adalah selisih antara harga beli dan buyback. Emas membutuhkan kenaikan harga
                  pasar minimal sebesar persentase spread ini untuk mencapai titik impas.
                </div>
              </div>

              {/* Tax Details */}
              <div className="rounded-xl bg-amber-500/5 p-3.5 border border-amber-500/20 text-xs flex flex-col gap-2">
                <div className="font-bold text-amber-950 dark:text-amber-200">
                  Rincian Pajak PPh Pasal 22 Antam:
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>PPh 22 Pembelian ({(result.buyTaxRate * 100).toFixed(2)}%):</span>
                  <span className="text-foreground font-medium">
                    {formatIDR(result.buyTaxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    PPh 22 Buyback{" "}
                    {result.sellTaxRate > 0
                      ? `(${(result.sellTaxRate * 100).toFixed(1)}%)`
                      : "(Bebas - ≤ Rp 10 Jt)"}
                    :
                  </span>
                  <span className="text-foreground font-medium">
                    {formatIDR(result.sellTaxAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Dos and Don'ts */}
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>{e.dos1}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-950 dark:text-rose-200 flex items-start gap-2">
              <span className="font-bold">✗</span>
              <span>{e.donts1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
