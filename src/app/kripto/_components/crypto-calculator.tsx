"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { calculateCryptoTrading } from "@/lib/asset-math";

interface CryptoCalculatorProps {
  dict: Dictionary;
}

export function CryptoCalculator({ dict }: CryptoCalculatorProps) {
  const k = dict.kripto;

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // State Variables
  const [cryptoPriceBuy, setCryptoPriceBuy] = useState<number>(1000000000);
  const [cryptoPriceSell, setCryptoPriceSell] = useState<number>(1080000000);
  const [cryptoAmount, setCryptoAmount] = useState<number>(0.05);
  const [cryptoFeeBuy, setCryptoFeeBuy] = useState<number>(0.1);
  const [cryptoFeeSell, setCryptoFeeSell] = useState<number>(0.1);
  const [cryptoTaxType, setCryptoTaxType] = useState<"bappebti" | "non-bappebti">("bappebti");

  // Pure Math Calculation
  const result = calculateCryptoTrading({
    amountCoins: cryptoAmount,
    priceBuy: cryptoPriceBuy,
    priceSell: cryptoPriceSell,
    feeBuyPct: cryptoFeeBuy,
    feeSellPct: cryptoFeeSell,
    taxType: cryptoTaxType,
  });

  const isProfit = result.netProfit >= 0;

  // Quick Preset Handlers
  const setCoinPreset = (buy: number, sell: number, amount: number) => {
    setCryptoPriceBuy(buy);
    setCryptoPriceSell(sell);
    setCryptoAmount(amount);
  };

  // Share Summary Text
  const generateShareSummary = () => {
    return (
      `⚡ *Ringkasan Transaksi Aset Kripto - Amir App*\n` +
      `• Koin: ${cryptoAmount} Unit | Skema: ${cryptoTaxType === "bappebti" ? "Bappebti CPFAK (0.2% Pajak)" : "Luar Negeri (0.4% Pajak)"}\n` +
      `• Harga Beli: ${formatIDR(cryptoPriceBuy)}/koin\n` +
      `• Harga Jual: ${formatIDR(cryptoPriceSell)}/koin\n` +
      `• Total Modal Beli (Bersih Fee & Pajak): ${formatIDR(result.totalCostBuy)}\n` +
      `• Hasil Bersih Masuk Dompet: ${formatIDR(result.netReceived)}\n` +
      `• Laba/Rugi Bersih: ${isProfit ? "+" : ""}${formatIDR(result.netProfit)} (${result.roi.toFixed(2)}% ROI)\n` +
      `• Harga Impas Kripto (BEP): ${formatIDR(result.bepPrice)}/koin\n\n` +
      `Dihitung di: ${typeof window !== "undefined" ? window.location.href : "Amir App"}`
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 mb-2">
            <span>⚡ Aset Kripto & Pajak PMK 68/2022</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {k.title}
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-3xl">
            {k.description}
          </p>
        </div>
        <div className="self-start sm:self-center">
          <ShareSummaryButton
            title={k.title}
            summaryText={generateShareSummary()}
          />
        </div>
      </div>

      {/* Coin Benchmark Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          Preset Cepat:
        </span>
        <button
          type="button"
          onClick={() => setCoinPreset(1000000000, 1080000000, 0.05)}
          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-black/[0.03] dark:bg-white/[0.04] border border-card-border hover:border-violet-500/40 text-foreground cursor-pointer transition-all whitespace-nowrap"
        >
          🪙 Bitcoin (BTC)
        </button>
        <button
          type="button"
          onClick={() => setCoinPreset(45000000, 48000000, 1.5)}
          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-black/[0.03] dark:bg-white/[0.04] border border-card-border hover:border-violet-500/40 text-foreground cursor-pointer transition-all whitespace-nowrap"
        >
          💎 Ethereum (ETH)
        </button>
        <button
          type="button"
          onClick={() => setCoinPreset(2500000, 2750000, 10)}
          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-black/[0.03] dark:bg-white/[0.04] border border-card-border hover:border-violet-500/40 text-foreground cursor-pointer transition-all whitespace-nowrap"
        >
          ⚡ Solana (SOL)
        </button>
        <button
          type="button"
          onClick={() => setCoinPreset(16000, 16300, 1000)}
          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold bg-black/[0.03] dark:bg-white/[0.04] border border-card-border hover:border-violet-500/40 text-foreground cursor-pointer transition-all whitespace-nowrap"
        >
          💵 Tether (USDT)
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg shadow-sm">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Buy Price */}
              <CurrencyInput
                id="crypto-buy-price"
                label={k.priceBuy}
                value={cryptoPriceBuy}
                onChange={setCryptoPriceBuy}
                min={1}
                max={5000000000}
                step={1000}
              />

              {/* Sell Price */}
              <CurrencyInput
                id="crypto-sell-price"
                label={k.priceSell}
                value={cryptoPriceSell}
                onChange={setCryptoPriceSell}
                min={1}
                max={5000000000}
                step={1000}
              />

              {/* Coin Amount (Decimal) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="crypto-amount-input"
                    className="text-xs font-semibold text-foreground"
                  >
                    {k.amount}
                  </label>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    {cryptoAmount} Koin
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-1">
                  {[0.01, 0.05, 0.1, 1.0].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCryptoAmount(amt)}
                      className={`min-h-[44px] px-2 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                        cryptoAmount === amt
                          ? "bg-violet-500/10 border-violet-500/40 text-violet-600 dark:text-violet-400 shadow-xs"
                          : "border-card-border text-zinc-500 hover:text-foreground"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  id="crypto-amount-input"
                  type="number"
                  step="0.001"
                  min="0.00001"
                  max="100000"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(Number.parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.02] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-violet-500 focus:outline-none"
                />
              </div>

              {/* Tax Scheme PMK 68 Switcher */}
              <div className="flex flex-col gap-2 pt-2 border-t border-card-border/50">
                <label className="text-xs font-semibold text-foreground">{k.taxScheme}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCryptoTaxType("bappebti")}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                      cryptoTaxType === "bappebti"
                        ? "bg-violet-500/10 border-violet-500/40 text-violet-600 dark:text-violet-400"
                        : "border-card-border text-zinc-500 hover:text-foreground"
                    }`}
                  >
                    ✓ {k.taxBappebti}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCryptoTaxType("non-bappebti")}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                      cryptoTaxType === "non-bappebti"
                        ? "bg-violet-500/10 border-violet-500/40 text-violet-600 dark:text-violet-400"
                        : "border-card-border text-zinc-500 hover:text-foreground"
                    }`}
                  >
                    {k.taxNonBappebti}
                  </button>
                </div>
              </div>

              {/* Exchange Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-card-border/50">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label
                      htmlFor="crypto-fee-buy"
                      className="font-medium text-zinc-600 dark:text-zinc-400"
                    >
                      {k.feeBuy}
                    </label>
                    <span className="font-bold text-foreground">{cryptoFeeBuy}%</span>
                  </div>
                  <input
                    id="crypto-fee-buy"
                    type="range"
                    min="0.0"
                    max="0.5"
                    step="0.05"
                    value={cryptoFeeBuy}
                    onChange={(e) => setCryptoFeeBuy(Number.parseFloat(e.target.value))}
                    className="h-2 w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] accent-violet-500 cursor-pointer min-h-[44px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label
                      htmlFor="crypto-fee-sell"
                      className="font-medium text-zinc-600 dark:text-zinc-400"
                    >
                      {k.feeSell}
                    </label>
                    <span className="font-bold text-foreground">{cryptoFeeSell}%</span>
                  </div>
                  <input
                    id="crypto-fee-sell"
                    type="range"
                    min="0.0"
                    max="0.5"
                    step="0.05"
                    value={cryptoFeeSell}
                    onChange={(e) => setCryptoFeeSell(Number.parseFloat(e.target.value))}
                    className="h-2 w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] accent-violet-500 cursor-pointer min-h-[44px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border border-card-border bg-gradient-to-br from-violet-500/5 via-card-bg to-cyan-500/5 shadow-md">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Profit / Loss Banner */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {k.netProfit}
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
                  <span className="text-muted-foreground">{k.totalSpendBuy}:</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(result.totalCostBuy)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{k.netReceived}:</span>
                  <span className="font-semibold text-foreground">
                    {formatIDR(result.netReceived)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-violet-600 dark:text-violet-400 font-bold">
                  <span>{k.bep}:</span>
                  <span className="text-sm font-black">
                    {formatIDR(result.bepPrice)} / koin
                  </span>
                </div>
              </div>

              {/* Fee & Tax Breakdown */}
              <div className="rounded-xl bg-violet-500/5 p-3.5 border border-violet-500/20 text-xs flex flex-col gap-2">
                <div className="font-bold text-violet-950 dark:text-violet-200">
                  Rincian Biaya & Pajak PMK 68/2022:
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Exchange Fee (Beli + Jual):</span>
                  <span className="text-foreground font-medium">
                    {formatIDR(result.feeBuyAmount + result.feeSellAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Pajak Kripto Beli ({(result.taxRate * 100).toFixed(1)}%):
                  </span>
                  <span className="text-foreground font-medium">
                    {formatIDR(result.buyTaxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Pajak Kripto Jual ({(result.taxRate * 100).toFixed(1)}%):
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
              <span>{k.dos1}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-950 dark:text-rose-200 flex items-start gap-2">
              <span className="font-bold">✗</span>
              <span>{k.donts1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
