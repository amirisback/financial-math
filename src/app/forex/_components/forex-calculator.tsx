"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";

interface ForexCalculatorProps {
  dict: Dictionary;
}

type CurrencyType = "USD" | "IDR";
type ForexSubTab = "sizing" | "drawdown";

interface PairConfig {
  name: string;
  pipValStdUSD: number; // Pip value per standard lot (100,000 units) in USD
  baseToUsdRate: number; // Base currency to USD rate (for margin calculation)
}

export function ForexCalculator({ dict }: ForexCalculatorProps) {
  const [forexSubTab, setForexSubTab] = useState<ForexSubTab>("sizing");

  // 1. Interactive States for Sizing & Real Costs
  const [accCurrency, setAccCurrency] = useState<CurrencyType>("USD");
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLoss, setStopLoss] = useState<number>(20);
  const [takeProfit, setTakeProfit] = useState<number>(40);
  const [leverage, setLeverage] = useState<number>(100);
  const [selectedPair, setSelectedPair] = useState<string>("EUR/USD");

  // Real Cost parameters (Spread & Commission)
  const [spreadPips, setSpreadPips] = useState<number>(1.5);
  const [commissionPerLot, setCommissionPerLot] = useState<number>(7.0);

  // 2. Interactive States for Drawdown & Recovery Matrix
  const [peakBalance, setPeakBalance] = useState<number>(10000);
  const [currentBalance, setCurrentBalance] = useState<number>(8000);

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

  // Sizing Calculations
  const riskAmount = balance * (riskPercent / 100);
  const riskAmountUSD = balanceUSD * (riskPercent / 100);

  const pairConfig = pairsConfig[selectedPair] || pairsConfig["EUR/USD"];
  const pipValUSD = pairConfig.pipValStdUSD;

  let standardLots = 0;
  if (stopLoss > 0 && pipValUSD > 0) {
    standardLots = riskAmountUSD / (stopLoss * pipValUSD);
  }
  standardLots = Math.max(0, Math.round(standardLots * 100) / 100);

  const miniLots = Math.round(standardLots * 10 * 100) / 100;
  const microLots = Math.round(standardLots * 100 * 100) / 100;
  const units = standardLots * 100000;

  // Margin Required
  const requiredMarginUSD = leverage > 0 ? (standardLots * 100000 * pairConfig.baseToUsdRate) / leverage : 0;
  const requiredMargin = accCurrency === "IDR" ? requiredMarginUSD * USD_TO_IDR : requiredMarginUSD;

  // Margin Level %
  const marginLevel = requiredMarginUSD > 0 ? (balanceUSD / requiredMarginUSD) * 100 : 0;

  // Risk Reward Ratio
  const rrRatio = stopLoss > 0 ? takeProfit / stopLoss : 0;

  // Real Costs (Spread + Commission)
  const spreadCostUSD = standardLots * spreadPips * pipValUSD;
  const commissionCostUSD = standardLots * commissionPerLot;
  const totalRealCostsUSD = spreadCostUSD + commissionCostUSD;
  const totalRealCosts = accCurrency === "IDR" ? totalRealCostsUSD * USD_TO_IDR : totalRealCostsUSD;

  const grossProfitUSD = standardLots * takeProfit * pipValUSD;

  const netProfitUSD = grossProfitUSD - totalRealCostsUSD;
  const netProfit = accCurrency === "IDR" ? netProfitUSD * USD_TO_IDR : netProfitUSD;

  const realBepPips = standardLots > 0 && pipValUSD > 0 ? totalRealCostsUSD / (standardLots * pipValUSD) : 0;
  const costToRewardRatio = grossProfitUSD > 0 ? (totalRealCostsUSD / grossProfitUSD) * 100 : 0;
  const isCostHigh = costToRewardRatio > 15;

  // Safety Auditing
  const isRiskSafe = riskPercent <= 2.0;
  const isRrSafe = rrRatio >= 2.0;

  let safetyRating: "safe" | "moderate" | "high-risk" = "safe";
  if (riskPercent > 5.0 || rrRatio < 1.0 || marginLevel < 200) {
    safetyRating = "high-risk";
  } else if (riskPercent > 2.0 || rrRatio < 2.0 || marginLevel < 500) {
    safetyRating = "moderate";
  }

  // Drawdown Calculations
  const drawdownNominal = Math.max(0, peakBalance - currentBalance);
  const drawdownPercent = peakBalance > 0 ? (drawdownNominal / peakBalance) * 100 : 0;
  const lossFraction = Math.min(0.95, drawdownPercent / 100);
  const gainNeededPercent = lossFraction < 1 ? ((1 / (1 - lossFraction)) - 1) * 100 : 0;

  let circuitBreakerStatus: "safe" | "warning" | "danger" = "safe";
  if (drawdownPercent >= 25) {
    circuitBreakerStatus = "danger";
  } else if (drawdownPercent >= 10) {
    circuitBreakerStatus = "warning";
  }

  // Currency Toggling
  const handleCurrencyChange = (newCurrency: CurrencyType) => {
    if (newCurrency === accCurrency) return;
    setAccCurrency(newCurrency);
    if (newCurrency === "IDR") {
      setBalance(balance * USD_TO_IDR);
      setPeakBalance(peakBalance * USD_TO_IDR);
      setCurrentBalance(currentBalance * USD_TO_IDR);
    } else {
      setBalance(Math.round((balance / USD_TO_IDR) * 100) / 100);
      setPeakBalance(Math.round((peakBalance / USD_TO_IDR) * 100) / 100);
      setCurrentBalance(Math.round((currentBalance / USD_TO_IDR) * 100) / 100);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.forex.title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          {dict.forex.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg overflow-hidden shadow-sm">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* SUB-TABS FOREX */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border">
                <button
                  type="button"
                  onClick={() => setForexSubTab("sizing")}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                    forexSubTab === "sizing"
                      ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                  }`}
                >
                  ⚖️ {dict.forex.subTabSizing || "Sizing & Biaya Riil"}
                </button>
                <button
                  type="button"
                  onClick={() => setForexSubTab("drawdown")}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                    forexSubTab === "drawdown"
                      ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                  }`}
                >
                  📉 {dict.forex.subTabDrawdown || "Drawdown & Recovery"}
                </button>
              </div>

              {/* Account Currency Switcher (Common) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.forex.accCurrency}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/[0.02] dark:bg-white/[0.04] p-1 rounded-xl border border-card-border">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("USD")}
                    className={`min-h-[44px] rounded-lg py-2 px-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      accCurrency === "USD"
                        ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange("IDR")}
                    className={`min-h-[44px] rounded-lg py-2 px-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                      accCurrency === "IDR"
                        ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    IDR (Rp)
                  </button>
                </div>
              </div>

              {/* 1. SUB-TAB: SIZING & BIAYA RIIL */}
              {forexSubTab === "sizing" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-150">
                  {/* Saldo Akun dengan CurrencyInput */}
                  <CurrencyInput
                    id="balance-input"
                    label={dict.forex.balance}
                    value={balance}
                    onChange={setBalance}
                    min={100}
                    max={accCurrency === "IDR" ? 50000000000 : 5000000}
                    step={accCurrency === "IDR" ? 1000000 : 100}
                    prefix={accCurrency === "IDR" ? "Rp" : "$"}
                    isCurrency={true}
                    presets={
                      accCurrency === "IDR"
                        ? [
                            { label: "15 Jt", value: 15000000 },
                            { label: "50 Jt", value: 50000000 },
                            { label: "150 Jt", value: 150000000 },
                            { label: "500 Jt", value: 500000000 },
                          ]
                        : [
                            { label: "$1k", value: 1000 },
                            { label: "$5k", value: 5000 },
                            { label: "$10k", value: 10000 },
                            { label: "$50k", value: 50000 },
                          ]
                    }
                    showSlider={false}
                  />

                  {/* Currency Pair Selector */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="pair-select" className="text-sm font-semibold text-foreground">
                      {dict.forex.pair}
                    </label>
                    <select
                      id="pair-select"
                      value={selectedPair}
                      onChange={(e) => setSelectedPair(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer min-h-[44px] font-bold"
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
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : riskPercent <= 2.0
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
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
                        className="flex-1 h-3 rounded-lg bg-zinc-200 dark:bg-zinc-700 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Math.max(0.1, Number(e.target.value)))}
                        className="w-full sm:w-20 px-3 py-2 text-center text-xs sm:text-sm font-bold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary outline-none min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Stop Loss & Take Profit in Pips */}
                  <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                    <CurrencyInput
                      id="sl-input"
                      label={dict.forex.stopLoss}
                      value={stopLoss}
                      onChange={setStopLoss}
                      min={5}
                      max={500}
                      step={1}
                      isCurrency={false}
                      unit="Pips"
                      presets={[
                        { label: "15 Pips", value: 15 },
                        { label: "20 Pips", value: 20 },
                        { label: "30 Pips", value: 30 },
                        { label: "50 Pips", value: 50 },
                      ]}
                      tooltip="Jarak batas kerugian maksimal dari titik entry dalam satuan pip."
                    />

                    <CurrencyInput
                      id="tp-input"
                      label={dict.forex.takeProfit}
                      value={takeProfit}
                      onChange={setTakeProfit}
                      min={5}
                      max={1000}
                      step={1}
                      isCurrency={false}
                      unit="Pips"
                      presets={[
                        { label: "30 Pips", value: 30 },
                        { label: "40 Pips", value: 40 },
                        { label: "60 Pips", value: 60 },
                        { label: "100 Pips", value: 100 },
                      ]}
                      tooltip="Jarak target keuntungan dari titik entry dalam satuan pip."
                    />
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer min-h-[44px] font-bold"
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

                  {/* Biaya Riil: Spread & Komisi Broker */}
                  <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="spread-input" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        {dict.forex.spread || "Spread Broker (Pips)"}
                      </label>
                      <input
                        id="spread-input"
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                        value={spreadPips}
                        onChange={(e) => setSpreadPips(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary font-bold min-h-[44px]"
                      />
                      <span className="text-[11px] text-zinc-500">Selisih harga Ask dan Bid broker Anda.</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="comm-input" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        {dict.forex.commission || "Komisi Broker ($ / Std Lot)"}
                      </label>
                      <input
                        id="comm-input"
                        type="number"
                        step="0.5"
                        min="0"
                        max="50"
                        value={commissionPerLot}
                        onChange={(e) => setCommissionPerLot(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary font-bold min-h-[44px]"
                      />
                      <span className="text-[11px] text-zinc-500">Biaya komisi per 1.0 standard lot round-turn.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SUB-TAB: DRAWDOWN & RECOVERY MATRIX */}
              {forexSubTab === "drawdown" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <span className="font-bold text-primary block mb-0.5">Psikologi & Matematika Drawdown</span>
                    Kerugian modal tidak linear. Semakin dalam penurunan akun Anda (*drawdown*), persentase keuntungan yang dibutuhkan untuk kembali ke modal awal (*recovery*) naik secara eksponensial.
                  </div>

                  <CurrencyInput
                    id="peak-balance"
                    label={dict.forex.peakBalance || "Saldo Puncak Akun (Peak Balance)"}
                    value={peakBalance}
                    onChange={setPeakBalance}
                    min={100}
                    max={accCurrency === "IDR" ? 50000000000 : 5000000}
                    step={accCurrency === "IDR" ? 1000000 : 100}
                    prefix={accCurrency === "IDR" ? "Rp" : "$"}
                    isCurrency={true}
                    presets={
                      accCurrency === "IDR"
                        ? [
                            { label: "50 Jt", value: 50000000 },
                            { label: "100 Jt", value: 100000000 },
                            { label: "250 Jt", value: 250000000 },
                          ]
                        : [
                            { label: "$5k", value: 5000 },
                            { label: "$10k", value: 10000 },
                            { label: "$25k", value: 25000 },
                          ]
                    }
                  />

                  <CurrencyInput
                    id="current-balance"
                    label={dict.forex.currentBalance || "Saldo Saat Ini (Current Balance)"}
                    value={currentBalance}
                    onChange={setCurrentBalance}
                    min={1}
                    max={peakBalance}
                    step={accCurrency === "IDR" ? 1000000 : 100}
                    prefix={accCurrency === "IDR" ? "Rp" : "$"}
                    isCurrency={true}
                  />
                </div>
              )}
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
            {/* 1. RESULTS: SIZING & BIAYA RIIL */}
            {forexSubTab === "sizing" && (
              <>
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

                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-primary/5 border border-primary/20 mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-primary">
                          {dict.forex.stdLots}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {units.toLocaleString("id-ID")} {dict.forex.units}
                        </span>
                      </div>
                      <span className="text-2xl font-black text-primary">
                        {standardLots.toFixed(2)} Lot
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col p-2.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] text-xs">
                        <span className="text-zinc-500 mb-0.5">{dict.forex.miniLots}</span>
                        <span className="font-bold text-foreground">{miniLots.toFixed(1)} Lot</span>
                      </div>
                      <div className="flex flex-col p-2.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] text-xs">
                        <span className="text-zinc-500 mb-0.5">{dict.forex.microLots}</span>
                        <span className="font-bold text-foreground">{microLots.toFixed(0)} Lot</span>
                      </div>
                    </div>
                  </div>

                  {/* Margin Section */}
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
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                        marginLevel === 0
                          ? "text-zinc-400 bg-zinc-500/5 border border-zinc-500/10"
                          : marginLevel >= 1000
                          ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
                          : marginLevel >= 500
                          ? "text-amber-600 bg-amber-500/10 border border-amber-500/20"
                          : "text-rose-600 bg-rose-500/10 border border-rose-500/20"
                      }`}>
                        {marginLevel === 0 ? "N/A" : `${marginLevel.toLocaleString("id-ID", { maximumFractionDigits: 0 })}%`}
                      </span>
                    </div>
                  </div>

                  {/* Real Costs & Net Reward */}
                  <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Biaya Riil & Keuntungan Bersih
                    </h4>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Biaya Spread ({spreadPips} Pips)</span>
                      <span className="font-semibold text-rose-500">-{formatCurrency(accCurrency === "IDR" ? spreadCostUSD * USD_TO_IDR : spreadCostUSD, accCurrency)}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Komisi Broker (${commissionPerLot}/Lot)</span>
                      <span className="font-semibold text-rose-500">-{formatCurrency(accCurrency === "IDR" ? commissionCostUSD * USD_TO_IDR : commissionCostUSD, accCurrency)}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
                      <span className="font-bold text-foreground">{dict.forex.realCosts || "Total Biaya Riil"}</span>
                      <span className="font-extrabold text-rose-600 dark:text-rose-400">{formatCurrency(totalRealCosts, accCurrency)}</span>
                    </div>

                    {isCostHigh && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                        ⚠️ Total biaya trading memakan {costToRewardRatio.toFixed(1)}% dari target reward. Pertimbangkan target TP lebih jauh atau gunakan broker berspread tipis.
                      </div>
                    )}

                    {/* Net Reward Box */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {dict.forex.netReward || "Potensi Reward Bersih"}
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Setelah dipotong spread & komisi
                        </span>
                      </div>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(netProfit, accCurrency)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.forex.realBepPips || "Jarak Impas Riil (BEP)"}</span>
                      <span className="font-extrabold text-foreground">+{realBepPips.toFixed(1)} Pips</span>
                    </div>
                  </div>

                  {/* Safety Audit Card */}
                  <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {dict.forex.safetyStatus}
                    </h4>

                    <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                      safetyRating === "safe"
                        ? "bg-emerald-500/[0.04] border-emerald-500/30"
                        : safetyRating === "moderate"
                        ? "bg-amber-500/[0.04] border-amber-500/30"
                        : "bg-rose-500/[0.04] border-rose-500/30"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold uppercase ${
                          safetyRating === "safe"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : safetyRating === "moderate"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {safetyRating === "safe"
                            ? "🟢 Risk Audit: Low Risk (AMAN)"
                            : safetyRating === "moderate"
                            ? "🟡 Risk Audit: Moderate Risk"
                            : "🔴 Risk Audit: HIGH RISK"}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
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

                  {/* Share Summary Button - Forex Sizing */}
                  <div className="pt-2">
                    <ShareSummaryButton
                      title="Trading Plan Forex"
                      summaryText={
                        `💱 *Trading Plan & Sizing Forex — Amir App*\n` +
                        `• Pair: ${selectedPair} | Saldo: ${formatCurrency(balance, accCurrency)}\n` +
                        `• Risiko: ${riskPercent.toFixed(1)}% (${formatCurrency(riskAmount, accCurrency)})\n` +
                        `• SL / TP: ${stopLoss} Pips / ${takeProfit} Pips (R:R 1:${rrRatio.toFixed(1)})\n` +
                        `• Sizing: ${standardLots.toFixed(2)} Standard Lot (${units.toLocaleString("id-ID")} Units)\n` +
                        `• Total Biaya Riil: ${formatCurrency(totalRealCosts, accCurrency)}\n` +
                        `---------------------------------\n` +
                        `*Estimasi Keuntungan Bersih: +${formatCurrency(netProfit, accCurrency)}*\n` +
                        `*Audit Keamanan: ${safetyRating === "safe" ? "🟢 AMAN" : safetyRating === "moderate" ? "🟡 SEDANG" : "🔴 TINGGI"}*`
                      }
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* 2. RESULTS: DRAWDOWN & RECOVERY */}
            {forexSubTab === "drawdown" && (
              <>
                <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                  <h3 className="text-base font-bold text-foreground">
                    Analisis Drawdown & Pemulihan
                  </h3>
                </div>

                <CardContent className="flex flex-col gap-5 pt-6">
                  {/* Drawdown Status Box */}
                  <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                    circuitBreakerStatus === "safe"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                      : circuitBreakerStatus === "warning"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold uppercase tracking-wider">Drawdown Akun</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/30">
                        -{drawdownPercent.toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-2xl font-black">
                      {formatCurrency(drawdownNominal, accCurrency)}
                    </span>
                    <span className="text-xs leading-relaxed opacity-90">
                      {circuitBreakerStatus === "safe" && (dict.forex.circuitBreakerSafe || "Tingkat drawdown masih dalam batas toleransi normal.")}
                      {circuitBreakerStatus === "warning" && (dict.forex.circuitBreakerWarning || "Waspada: Penurunan modal cukup dalam. Turunkan risiko per trade.")}
                      {circuitBreakerStatus === "danger" && (dict.forex.circuitBreakerDanger || "CIRCUIT BREAKER: Kerugian akun kritis. Hentikan trading sementara.")}
                    </span>
                  </div>

                  {/* Required Gain to Recover Box */}
                  <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Gain Diperlukan untuk Balik Modal</span>
                    <span className="text-3xl font-black text-foreground">
                      +{gainNeededPercent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Dari saldo saat ini {formatCurrency(currentBalance, accCurrency)}, Anda harus menghasilkan keuntungan bersih +{gainNeededPercent.toFixed(1)}% untuk kembali ke saldo awal {formatCurrency(peakBalance, accCurrency)}.
                    </span>
                  </div>

                  {/* Drawdown vs Recovery Benchmark Matrix */}
                  <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Matriks Pemulihan Kerugian (Benchmark)
                    </h4>
                    <div className="flex flex-col text-xs divide-y divide-card-border/40 border border-card-border rounded-xl overflow-hidden">
                      <div className="flex justify-between p-2.5 bg-black/[0.02] dark:bg-white/[0.02] font-bold">
                        <span>Kerugian (Loss)</span>
                        <span>Gain Pemulihan (BEP)</span>
                      </div>
                      <div className={`flex justify-between p-2.5 ${drawdownPercent >= 10 && drawdownPercent < 20 ? "bg-primary/10 font-bold" : ""}`}>
                        <span>Loss -10%</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+11.1%</span>
                      </div>
                      <div className={`flex justify-between p-2.5 ${drawdownPercent >= 20 && drawdownPercent < 30 ? "bg-primary/10 font-bold" : ""}`}>
                        <span>Loss -20%</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+25.0%</span>
                      </div>
                      <div className={`flex justify-between p-2.5 ${drawdownPercent >= 30 && drawdownPercent < 50 ? "bg-primary/10 font-bold" : ""}`}>
                        <span>Loss -30%</span>
                        <span className="font-extrabold text-amber-600 dark:text-amber-400">+42.9%</span>
                      </div>
                      <div className={`flex justify-between p-2.5 ${drawdownPercent >= 50 && drawdownPercent < 70 ? "bg-primary/10 font-bold" : ""}`}>
                        <span>Loss -50%</span>
                        <span className="font-extrabold text-rose-600 dark:text-rose-400">+100.0%</span>
                      </div>
                      <div className={`flex justify-between p-2.5 ${drawdownPercent >= 70 ? "bg-primary/10 font-bold" : ""}`}>
                        <span>Loss -70%</span>
                        <span className="font-extrabold text-rose-600 dark:text-rose-400">+233.3%</span>
                      </div>
                    </div>
                  </div>

                  {/* Share Summary Button - Drawdown */}
                  <div className="pt-2">
                    <ShareSummaryButton
                      title="Laporan Drawdown & Recovery Forex"
                      summaryText={
                        `📉 *Laporan Drawdown & Pemulihan Modal Forex — Amir App*\n` +
                        `• Saldo Puncak: ${formatCurrency(peakBalance, accCurrency)}\n` +
                        `• Saldo Saat Ini: ${formatCurrency(currentBalance, accCurrency)}\n` +
                        `• Total Penurunan (Drawdown): -${drawdownPercent.toFixed(1)}% (${formatCurrency(drawdownNominal, accCurrency)})\n` +
                        `---------------------------------\n` +
                        `*Gain Diperlukan untuk Balik Modal: +${gainNeededPercent.toFixed(1)}%*\n` +
                        `*Status Circuit Breaker: ${circuitBreakerStatus === "safe" ? "🟢 AMAN" : circuitBreakerStatus === "warning" ? "🟡 WASPADA" : "🔴 KRITIS"}*\n` +
                        `_Evaluasi manajemen risiko trading via Amir App._`
                      }
                    />
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
