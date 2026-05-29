"use client";

import { useState } from "react";
import type { Dictionary } from "../../dictionaries";
import { Card, CardContent } from "../../_components/ui/card";

interface ForexCalculatorProps {
  dict: Dictionary;
}

type CurrencyType = "USD" | "IDR";

interface PairConfig {
  name: string;
  pipValStdUSD: number; // Pip value per standard lot (100,000 units) in USD
  baseToUsdRate: number; // Base currency to USD rate (for margin calculation)
}

export function ForexCalculator({ dict }: ForexCalculatorProps) {
  // 1. Interactive States
  const [accCurrency, setAccCurrency] = useState<CurrencyType>("USD");
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLoss, setStopLoss] = useState<number>(20);
  const [takeProfit, setTakeProfit] = useState<number>(40);
  const [leverage, setLeverage] = useState<number>(100);
  const [selectedPair, setSelectedPair] = useState<string>("EUR/USD");

  // Simulated exchange rates and pip values
  const pairsConfig: Record<string, PairConfig> = {
    "EUR/USD": { name: "EUR/USD", pipValStdUSD: 10.0, baseToUsdRate: 1.08 },
    "GBP/USD": { name: "GBP/USD", pipValStdUSD: 10.0, baseToUsdRate: 1.27 },
    "AUD/USD": { name: "AUD/USD", pipValStdUSD: 10.0, baseToUsdRate: 0.66 },
    "NZD/USD": { name: "NZD/USD", pipValStdUSD: 10.0, baseToUsdRate: 0.61 },
    "USD/JPY": { name: "USD/JPY", pipValStdUSD: 6.45, baseToUsdRate: 1.0 },
    "USD/CHF": { name: "USD/CHF", pipValStdUSD: 10.99, baseToUsdRate: 1.0 },
    "USD/CAD": { name: "USD/CAD", pipValStdUSD: 7.35, baseToUsdRate: 1.0 },
    "GBP/JPY": { name: "GBP/JPY", pipValStdUSD: 6.45, baseToUsdRate: 1.27 },
    "EUR/JPY": { name: "EUR/JPY", pipValStdUSD: 6.45, baseToUsdRate: 1.08 },
  };

  const USD_TO_IDR = 16000;

  // Format Helper
  const formatCurrency = (val: number, type: CurrencyType) => {
    if (type === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(val);
    }
  };

  // Convert to USD equivalents if account is in IDR
  const balanceUSD = accCurrency === "IDR" ? balance / USD_TO_IDR : balance;

  // 2. Calculations
  const riskAmount = balance * (riskPercent / 100);
  const riskAmountUSD = balanceUSD * (riskPercent / 100);

  const pairConfig = pairsConfig[selectedPair] || pairsConfig["EUR/USD"];
  const pipValUSD = pairConfig.pipValStdUSD;

  // Position size in standard lots
  // Position Size (Lots) = Risk USD / (Stop Loss in Pips * Pip Value per Standard Lot)
  let standardLots = 0;
  if (stopLoss > 0 && pipValUSD > 0) {
    standardLots = riskAmountUSD / (stopLoss * pipValUSD);
  }
  // Ensure we round to micro lot precision (2 decimal places)
  standardLots = Math.max(0, Math.round(standardLots * 100) / 100);

  const miniLots = Math.round(standardLots * 10 * 100) / 100;
  const microLots = Math.round(standardLots * 100 * 100) / 100;
  const units = standardLots * 100000;

  // Margin Required
  // Required Margin (USD) = (Lots * 100,000 * baseToUsdRate) / Leverage
  const requiredMarginUSD = leverage > 0 ? (standardLots * 100000 * pairConfig.baseToUsdRate) / leverage : 0;
  const requiredMargin = accCurrency === "IDR" ? requiredMarginUSD * USD_TO_IDR : requiredMarginUSD;

  // Margin Level %
  const marginLevel = requiredMarginUSD > 0 ? (balanceUSD / requiredMarginUSD) * 100 : 0;

  // Risk Reward Ratio
  const rrRatio = stopLoss > 0 ? takeProfit / stopLoss : 0;

  // Potential Profit
  const potentialProfitUSD = standardLots * takeProfit * pipValUSD;
  const potentialProfit = accCurrency === "IDR" ? potentialProfitUSD * USD_TO_IDR : potentialProfitUSD;

  // 3. Safety Auditing
  const isRiskSafe = riskPercent <= 2.0;
  const isRrSafe = rrRatio >= 2.0;
  const isMarginSafe = balanceUSD > 0 ? (requiredMarginUSD / balanceUSD) * 100 <= 5.0 : true;

  // Determine overall audit rating
  let safetyRating: "safe" | "moderate" | "high-risk" = "safe";
  if (riskPercent > 5.0 || rrRatio < 1.0 || marginLevel < 200) {
    safetyRating = "high-risk";
  } else if (riskPercent > 2.0 || rrRatio < 2.0 || marginLevel < 500) {
    safetyRating = "moderate";
  }

  // Handle currency toggling adjustments
  const handleCurrencyChange = (newCurrency: CurrencyType) => {
    if (newCurrency === accCurrency) return;
    setAccCurrency(newCurrency);
    if (newCurrency === "IDR") {
      setBalance(balance * USD_TO_IDR);
    } else {
      setBalance(Math.round((balance / USD_TO_IDR) * 100) / 100);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.forex.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.forex.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg overflow-hidden shadow-sm">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Account Currency & Balance */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">
                    {dict.forex.accCurrency}
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-black/[0.02] dark:bg-white/[0.04] p-1 rounded-xl border border-card-border">
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("USD")}
                      className={`rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        accCurrency === "USD"
                          ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("IDR")}
                      className={`rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        accCurrency === "IDR"
                          ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      IDR (Rp)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="balance-input" className="text-sm font-semibold text-foreground">
                      {dict.forex.balance}
                    </label>
                    <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                      {formatCurrency(balance, accCurrency)}
                    </span>
                  </div>
                  <input
                    id="balance-input"
                    type="number"
                    min="1"
                    value={balance}
                    onChange={(e) => setBalance(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Currency Pair Selector */}
              <div className="flex flex-col gap-2">
                <label htmlFor="pair-select" className="text-sm font-semibold text-foreground">
                  {dict.forex.pair}
                </label>
                <select
                  id="pair-select"
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                >
                  {Object.keys(pairsConfig).map((pair) => (
                    <option key={pair} value={pair} className="bg-background">
                      {pair}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk Percentage Input */}
              <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="risk-percent-input" className="text-sm font-semibold text-foreground">
                    {dict.forex.riskPercent}
                  </label>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    riskPercent <= 1.5
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : riskPercent <= 2.0
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}>
                    {riskPercent.toFixed(1)}% — {
                      riskPercent <= 1.5
                        ? dict.forex.riskLevelLow
                        : riskPercent <= 2.0
                        ? dict.forex.riskLevelMod
                        : dict.forex.riskLevelHigh
                    }
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="risk-percent-input"
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Math.max(0.1, Number(e.target.value)))}
                    className="w-full sm:w-20 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Stop Loss & Take Profit in Pips */}
              <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sl-input" className="text-xs font-semibold text-zinc-500">
                      {dict.forex.stopLoss}
                    </label>
                    <span className="text-xs font-bold text-foreground">{stopLoss} Pips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="sl-input"
                      type="range"
                      min="5"
                      max="200"
                      step="1"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2 py-1 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="tp-input" className="text-xs font-semibold text-zinc-500">
                      {dict.forex.takeProfit}
                    </label>
                    <span className="text-xs font-bold text-foreground">{takeProfit} Pips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="tp-input"
                      type="range"
                      min="5"
                      max="500"
                      step="1"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2 py-1 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Account Leverage Selector */}
              <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                <label htmlFor="leverage-select" className="text-sm font-semibold text-foreground">
                  {dict.forex.leverage}
                </label>
                <select
                  id="leverage-select"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                >
                  <option value={1} className="bg-background">1:1 (No Leverage)</option>
                  <option value={10} className="bg-background">1:10</option>
                  <option value={30} className="bg-background">1:30</option>
                  <option value={50} className="bg-background">1:50</option>
                  <option value={100} className="bg-background">1:100</option>
                  <option value={200} className="bg-background">1:200</option>
                  <option value={500} className="bg-background">1:500</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Do's & Don'ts Panel */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{dict.common.dos}</span>
              </div>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-4 flex flex-col gap-2">
                <li>{dict.forex.dos1}</li>
                <li>{dict.forex.dos2}</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] dark:bg-rose-500/[0.05] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{dict.common.donts}</span>
              </div>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-4 flex flex-col gap-2">
                <li>{dict.forex.donts1}</li>
                <li>{dict.forex.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
              <h3 className="text-base font-bold text-foreground">
                {dict.forex.summary}
              </h3>
            </div>

            <CardContent className="flex flex-col gap-5 pt-6">
              {/* Risk Amount Display */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{dict.forex.riskAmount}</span>
                  <span className="font-extrabold text-foreground text-sm">
                    {formatCurrency(riskAmount, accCurrency)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-dashed border-card-border/40 pt-2.5">
                  <span className="text-zinc-500">{dict.forex.pipValue}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(accCurrency === "IDR" ? pipValUSD * USD_TO_IDR : pipValUSD, accCurrency)}
                  </span>
                </div>
              </div>

              {/* Recommended Lot Size */}
              <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {dict.forex.positionSize}
                </h4>

                <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {dict.forex.stdLots}
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {dict.forex.units}
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    {standardLots.toFixed(2)} Lot
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col p-2.5 rounded-lg border border-card-border bg-black/[0.01] dark:bg-white/[0.01] text-xs">
                    <span className="text-zinc-500 mb-0.5">{dict.forex.miniLots}</span>
                    <span className="font-bold text-foreground">{miniLots.toFixed(1)} Lot</span>
                  </div>
                  <div className="flex flex-col p-2.5 rounded-lg border border-card-border bg-black/[0.01] dark:bg-white/[0.01] text-xs">
                    <span className="text-zinc-500 mb-0.5">{dict.forex.microLots}</span>
                    <span className="font-bold text-foreground">{microLots.toFixed(0)} Lot</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs px-1 text-zinc-500">
                  <span>{dict.forex.units}:</span>
                  <span className="font-semibold text-foreground">{units.toLocaleString("id-ID")} Units</span>
                </div>
              </div>

              {/* Margin & Leverage Calculations */}
              <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {dict.forex.marginSection}
                </h4>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{dict.forex.requiredMargin}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(requiredMargin, accCurrency)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{dict.forex.marginLevel}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    marginLevel === 0
                      ? "text-zinc-400 bg-zinc-500/5 border border-zinc-500/10"
                      : marginLevel >= 1000
                      ? "text-emerald-500 bg-emerald-500/5 border border-emerald-500/10"
                      : marginLevel >= 500
                      ? "text-amber-500 bg-amber-500/5 border border-amber-500/10"
                      : "text-rose-500 bg-rose-500/5 border border-rose-500/10"
                  }`}>
                    {marginLevel === 0 ? "N/A" : `${marginLevel.toLocaleString("id-ID", { maximumFractionDigits: 0 })}%`}
                  </span>
                </div>
              </div>

              {/* Risk-Reward & Net Profit */}
              <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{dict.forex.rrRatio}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
                    isRrSafe
                      ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
                      : "text-rose-500 bg-rose-500/5 border-rose-500/10"
                  }`}>
                    1:{rrRatio.toFixed(1)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {dict.forex.potentialReward}
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      Target Profit ({takeProfit} pips)
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(potentialProfit, accCurrency)}
                  </span>
                </div>
              </div>

              {/* Safety Audit Card */}
              <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {dict.forex.safetyStatus}
                </h4>

                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  safetyRating === "safe"
                    ? "bg-emerald-500/[0.03] border-emerald-500/25"
                    : safetyRating === "moderate"
                    ? "bg-amber-500/[0.03] border-amber-500/25"
                    : "bg-rose-500/[0.03] border-rose-500/25"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      safetyRating === "safe"
                        ? "bg-emerald-500 animate-pulse"
                        : safetyRating === "moderate"
                        ? "bg-amber-500"
                        : "bg-rose-500 animate-ping"
                    }`} />
                    <span className={`text-xs font-extrabold uppercase ${
                      safetyRating === "safe"
                        ? "text-emerald-500"
                        : safetyRating === "moderate"
                        ? "text-amber-500"
                        : "text-rose-500"
                    }`}>
                      {safetyRating === "safe"
                        ? "Risk Audit: Low Risk (SAFE)"
                        : safetyRating === "moderate"
                        ? "Risk Audit: Moderate Risk"
                        : "Risk Audit: HIGH RISK"}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                    {safetyRating === "safe" && dict.forex.verdictPerfect}
                    {safetyRating === "moderate" && (
                      !isRiskSafe
                        ? dict.forex.verdictWarning
                        : !isRrSafe
                        ? dict.forex.verdictPoorRR
                        : dict.forex.verdictOverLeverage
                    )}
                    {safetyRating === "high-risk" && (
                      riskPercent > 5.0
                        ? dict.forex.verdictWarning
                        : rrRatio < 1.0
                        ? dict.forex.verdictPoorRR
                        : dict.forex.verdictOverLeverage
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
