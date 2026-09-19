"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import {
  calculateSahamTrading,
  calculateGrahamValuation,
  calculateAverageDown,
  calculateDividendPlanner,
} from "@/lib/asset-math";

interface StockCalculatorProps {
  dict: Dictionary;
}

type SahamSubTab = "pnl" | "valuation" | "averageDown" | "dividend";

export function StockCalculator({ dict }: StockCalculatorProps) {
  const [subTab, setSubTab] = useState<SahamSubTab>("pnl");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // State Variables for Trading PnL
  const [sahamPriceBuy, setSahamPriceBuy] = useState<number>(5000);
  const [sahamPriceSell, setSahamPriceSell] = useState<number>(5500);
  const [sahamLots, setSahamLots] = useState<number>(10);
  const [sahamFeeBuy, setSahamFeeBuy] = useState<number>(0.15);
  const [sahamFeeSell, setSahamFeeSell] = useState<number>(0.25);

  // State Variables for Graham Valuation
  const [valCurrentPrice, setValCurrentPrice] = useState<number>(4000);
  const [valEps, setValEps] = useState<number>(380);
  const [valBvps, setValBvps] = useState<number>(2600);

  // State Variables for Average Down
  const [avgInitialLots, setAvgInitialLots] = useState<number>(10);
  const [avgInitialPrice, setAvgInitialPrice] = useState<number>(5000);
  const [avgNewLots, setAvgNewLots] = useState<number>(10);
  const [avgNewPrice, setAvgNewPrice] = useState<number>(4000);

  // State Variables for Dividend Planner
  const [divStockPrice, setDivStockPrice] = useState<number>(5000);
  const [divDps, setDivDps] = useState<number>(250);
  const [divLots, setDivLots] = useState<number>(50);
  const [divTaxOption, setDivTaxOption] = useState<"reguler" | "exempt">("exempt");
  const [divTargetMonthly, setDivTargetMonthly] = useState<number>(5000000);

  // Calculation Results via Pure Math Engine
  const tradingResult = calculateSahamTrading({
    buyPrice: sahamPriceBuy,
    sellPrice: sahamPriceSell,
    lots: sahamLots,
    feeBuyPct: sahamFeeBuy,
    feeSellPct: sahamFeeSell,
  });

  const valuationResult = calculateGrahamValuation({
    currentPrice: valCurrentPrice,
    eps: valEps,
    bvps: valBvps,
  });

  const avgDownResult = calculateAverageDown({
    initialLots: avgInitialLots,
    initialPrice: avgInitialPrice,
    newLots: avgNewLots,
    newPrice: avgNewPrice,
  });

  const dividendResult = calculateDividendPlanner({
    stockPrice: divStockPrice,
    dps: divDps,
    lots: divLots,
    taxOption: divTaxOption,
    targetMonthly: divTargetMonthly,
  });

  const isProfit = tradingResult.netProfit >= 0;

  // Share Summary Text Generator
  const generateShareSummary = () => {
    if (subTab === "pnl") {
      return (
        `📈 *Ringkasan Transaksi Saham IDX - Amir App*\n` +
        `• Beli: ${formatIDR(sahamPriceBuy)}/lbr (${sahamLots} Lot = ${tradingResult.sharesCount.toLocaleString("id-ID")} lbr)\n` +
        `• Jual: ${formatIDR(sahamPriceSell)}/lbr\n` +
        `• Total Modal Beli: ${formatIDR(tradingResult.totalCostBuy)}\n` +
        `• Dana Bersih Diterima: ${formatIDR(tradingResult.netReceived)}\n` +
        `• Laba/Rugi Bersih: ${isProfit ? "+" : ""}${formatIDR(tradingResult.netProfit)} (${tradingResult.roi.toFixed(2)}%)\n` +
        `• Break-Even Price (BEP): ${formatIDR(tradingResult.bepPrice)}/lbr\n\n` +
        `Dihitung otomatis di: ${typeof window !== "undefined" ? window.location.href : "Amir App"}`
      );
    }
    if (subTab === "valuation") {
      return (
        `⚖️ *Valuasi Saham Graham & Margin of Safety - Amir App*\n` +
        `• Harga Pasar: ${formatIDR(valCurrentPrice)}\n` +
        `• EPS: ${formatIDR(valEps)} | BVPS: ${formatIDR(valBvps)}\n` +
        `• Nilai Wajar Graham: ${formatIDR(valuationResult.grahamNumber)}\n` +
        `• Margin of Safety (MoS): ${valuationResult.mosPercent.toFixed(1)}% (${valuationResult.status.toUpperCase()})\n` +
        `• P/E Ratio: ${valuationResult.impliedPE.toFixed(1)}x | P/BV Ratio: ${valuationResult.impliedPBV.toFixed(2)}x\n\n` +
        `Dihitung di: ${typeof window !== "undefined" ? window.location.href : "Amir App"}`
      );
    }
    if (subTab === "averageDown") {
      return (
        `📉 *Simulasi Average Down Saham - Amir App*\n` +
        `• Posisi Awal: ${avgInitialLots} Lot @ ${formatIDR(avgInitialPrice)}\n` +
        `• Rencana Beli: ${avgNewLots} Lot @ ${formatIDR(avgNewPrice)}\n` +
        `• Total Lot Baru: ${avgDownResult.totalLotsAfter} Lot\n` +
        `• Rata-rata Harga Baru: ${formatIDR(avgDownResult.newAveragePrice)} (Turun ${avgDownResult.priceReductionPercent.toFixed(1)}%)\n` +
        `• Kenaikan Menuju Impas: +${avgDownResult.reboundNeededPercent.toFixed(1)}%\n\n` +
        `Dihitung di: ${typeof window !== "undefined" ? window.location.href : "Amir App"}`
      );
    }
    return (
      `💰 *Simulasi Dividen & Passive Income Saham - Amir App*\n` +
      `• Harga Saham: ${formatIDR(divStockPrice)} | DPS: ${formatIDR(divDps)}\n` +
      `• Kepemilikan: ${divLots} Lot (${dividendResult.totalShares.toLocaleString("id-ID")} lbr)\n` +
      `• Estimasi Dividen Bersih/Tahun: ${formatIDR(dividendResult.annualNet)} (Yield: ${dividendResult.dividendYieldNet.toFixed(2)}%)\n` +
      `• Target Pasif: ${formatIDR(divTargetMonthly)}/bulan\n` +
      `• Modal Diperlukan untuk Target: ${formatIDR(dividendResult.requiredCapital)} (${dividendResult.requiredLots.toLocaleString("id-ID")} Lot)\n\n` +
      `Dihitung di: ${typeof window !== "undefined" ? window.location.href : "Amir App"}`
    );
  };

  const s = dict.saham;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
            <span>📈 Bursa Efek Indonesia (IDX)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {s.title}
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-3xl">
            {s.description}
          </p>
        </div>
        <div className="self-start sm:self-center">
          <ShareSummaryButton
            title={s.title}
            summaryText={generateShareSummary()}
          />
        </div>
      </div>

      {/* Sub-Tab Navigation (Ergonomi Usia 35++) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border mb-8 shadow-xs">
        <button
          type="button"
          onClick={() => setSubTab("pnl")}
          className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
            subTab === "pnl"
              ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400 border border-card-border"
              : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
          }`}
        >
          📊 {s.subTabPnl}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("valuation")}
          className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
            subTab === "valuation"
              ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400 border border-card-border"
              : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
          }`}
        >
          ⚖️ {s.subTabValuation}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("averageDown")}
          className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
            subTab === "averageDown"
              ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400 border border-card-border"
              : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
          }`}
        >
          📉 {s.subTabAverageDown}
        </button>
        <button
          type="button"
          onClick={() => setSubTab("dividend")}
          className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
            subTab === "dividend"
              ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400 border border-card-border"
              : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
          }`}
        >
          💰 {s.subTabDividend}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg shadow-sm">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* 1. SUBTAB: PNL & BIAYA TRANSAKSI */}
              {subTab === "pnl" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <CurrencyInput
                    id="saham-buy-price"
                    label={s.priceBuy}
                    value={sahamPriceBuy}
                    onChange={setSahamPriceBuy}
                    min={50}
                    max={200000}
                    step={50}
                    presets={[
                      { label: "1.000", value: 1000 },
                      { label: "2.500", value: 2500 },
                      { label: "5.000", value: 5000 },
                      { label: "10.000", value: 10000 },
                    ]}
                  />

                  <CurrencyInput
                    id="saham-sell-price"
                    label={s.priceSell}
                    value={sahamPriceSell}
                    onChange={setSahamPriceSell}
                    min={50}
                    max={200000}
                    step={50}
                    presets={[
                      { label: "1.200", value: 1200 },
                      { label: "3.000", value: 3000 },
                      { label: "5.500", value: 5500 },
                      { label: "11.000", value: 11000 },
                    ]}
                  />

                  <CurrencyInput
                    id="saham-lots"
                    label={s.lots}
                    value={sahamLots}
                    onChange={setSahamLots}
                    min={1}
                    max={10000}
                    step={1}
                    presets={[
                      { label: "5 Lot", value: 5 },
                      { label: "10 Lot", value: 10 },
                      { label: "50 Lot", value: 50 },
                      { label: "100 Lot", value: 100 },
                    ]}
                  />

                  {/* Broker Fees Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-card-border/50">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label
                          htmlFor="saham-fee-buy"
                          className="font-medium text-zinc-600 dark:text-zinc-400"
                        >
                          {s.feeBuy}
                        </label>
                        <span className="font-bold text-foreground">{sahamFeeBuy}%</span>
                      </div>
                      <input
                        id="saham-fee-buy"
                        type="range"
                        min="0.05"
                        max="0.5"
                        step="0.01"
                        value={sahamFeeBuy}
                        onChange={(e) => setSahamFeeBuy(Number.parseFloat(e.target.value))}
                        className="h-2 w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] accent-blue-500 cursor-pointer min-h-[44px]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label
                          htmlFor="saham-fee-sell"
                          className="font-medium text-zinc-600 dark:text-zinc-400"
                        >
                          {s.feeSell}
                        </label>
                        <span className="font-bold text-foreground">{sahamFeeSell}%</span>
                      </div>
                      <input
                        id="saham-fee-sell"
                        type="range"
                        min="0.05"
                        max="0.5"
                        step="0.01"
                        value={sahamFeeSell}
                        onChange={(e) => setSahamFeeSell(Number.parseFloat(e.target.value))}
                        className="h-2 w-full rounded-lg bg-black/[0.05] dark:bg-white/[0.05] accent-blue-500 cursor-pointer min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SUBTAB: VALUASI GRAHAM & MOS */}
              {subTab === "valuation" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                    💡 <strong>Formula Benjamin Graham:</strong> Nilai wajar dihitung dengan rumus{" "}
                    <code>√(22.5 × EPS × BVPS)</code>. Margin of Safety (MoS) di atas 20% dianggap
                    sebagai batas diskon yang menarik bagi value investor.
                  </div>

                  <CurrencyInput
                    id="val-current-price"
                    label={s.currentPriceLabel}
                    value={valCurrentPrice}
                    onChange={setValCurrentPrice}
                    min={50}
                    max={100000}
                    step={25}
                    presets={[
                      { label: "1.000", value: 1000 },
                      { label: "3.500", value: 3500 },
                      { label: "4.000", value: 4000 },
                      { label: "8.000", value: 8000 },
                    ]}
                  />

                  <CurrencyInput
                    id="val-eps"
                    label={s.epsLabel}
                    value={valEps}
                    onChange={setValEps}
                    min={1}
                    max={10000}
                    step={10}
                    presets={[
                      { label: "150", value: 150 },
                      { label: "380", value: 380 },
                      { label: "600", value: 600 },
                      { label: "1.200", value: 1200 },
                    ]}
                  />

                  <CurrencyInput
                    id="val-bvps"
                    label={s.bvpsLabel}
                    value={valBvps}
                    onChange={setValBvps}
                    min={10}
                    max={50000}
                    step={50}
                    presets={[
                      { label: "1.000", value: 1000 },
                      { label: "2.600", value: 2600 },
                      { label: "4.500", value: 4500 },
                      { label: "10.000", value: 10000 },
                    ]}
                  />
                </div>
              )}

              {/* 3. SUBTAB: AVERAGE DOWN */}
              {subTab === "averageDown" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    📉 <strong>Simulasi Penurunan Harga Rata-rata:</strong> Masukkan posisi modal yang
                    sedang mengalami floating loss dan rencana pembelian baru untuk melihat harga impas
                    terbaru Anda.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="avg-init-lots"
                      label={s.initialLots}
                      value={avgInitialLots}
                      onChange={setAvgInitialLots}
                      min={1}
                      max={10000}
                    />
                    <CurrencyInput
                      id="avg-init-price"
                      label={s.initialPrice}
                      value={avgInitialPrice}
                      onChange={setAvgInitialPrice}
                      min={50}
                      max={100000}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-card-border/50">
                    <CurrencyInput
                      id="avg-new-lots"
                      label={s.newLots}
                      value={avgNewLots}
                      onChange={setAvgNewLots}
                      min={1}
                      max={10000}
                    />
                    <CurrencyInput
                      id="avg-new-price"
                      label={s.newPrice}
                      value={avgNewPrice}
                      onChange={setAvgNewPrice}
                      min={50}
                      max={100000}
                    />
                  </div>
                </div>
              )}

              {/* 4. SUBTAB: DIVIDEN & PASSIVE INCOME */}
              {subTab === "dividend" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    💰 <strong>UU Harmonisasi Peraturan Perpajakan (HPP):</strong> Dividen yang diterima
                    wajib pajak orang pribadi bebas pajak (0%) jika diinvestasikan kembali di wilayah
                    NKRI selama minimal 3 tahun.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="div-stock-price"
                      label={s.priceBuy}
                      value={divStockPrice}
                      onChange={setDivStockPrice}
                      min={50}
                      max={100000}
                    />
                    <CurrencyInput
                      id="div-dps"
                      label={s.dpsLabel}
                      value={divDps}
                      onChange={setDivDps}
                      min={1}
                      max={5000}
                    />
                  </div>

                  <CurrencyInput
                    id="div-lots"
                    label={s.lots}
                    value={divLots}
                    onChange={setDivLots}
                    min={1}
                    max={50000}
                  />

                  {/* Tax Option Switcher */}
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-xs font-semibold text-foreground">
                      {s.divTaxLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDivTaxOption("exempt")}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                          divTaxOption === "exempt"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                            : "border-card-border text-zinc-500 hover:text-foreground"
                        }`}
                      >
                        ✓ {s.divTaxExempt}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDivTaxOption("reguler")}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                          divTaxOption === "reguler"
                            ? "bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400"
                            : "border-card-border text-zinc-500 hover:text-foreground"
                        }`}
                      >
                        {s.divTaxReguler}
                      </button>
                    </div>
                  </div>

                  <CurrencyInput
                    id="div-target-monthly"
                    label={s.targetPassiveIncome}
                    value={divTargetMonthly}
                    onChange={setDivTargetMonthly}
                    min={500000}
                    max={500000000}
                    step={500000}
                    presets={[
                      { label: "Rp 3 Jt", value: 3000000 },
                      { label: "Rp 5 Jt", value: 5000000 },
                      { label: "Rp 10 Jt", value: 10000000 },
                      { label: "Rp 25 Jt", value: 25000000 },
                    ]}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="border border-card-border bg-gradient-to-br from-blue-500/5 via-card-bg to-indigo-500/5 shadow-md">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* RESULT 1: PNL */}
              {subTab === "pnl" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {s.netProfit}
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
                        {formatIDR(tradingResult.netProfit)}
                      </span>
                      <span
                        className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                          isProfit
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {tradingResult.roi.toFixed(2)}% ROI
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-card-border/50 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{s.totalCostBuy}:</span>
                      <span className="font-semibold text-foreground">
                        {formatIDR(tradingResult.totalCostBuy)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{s.netReceived}:</span>
                      <span className="font-semibold text-foreground">
                        {formatIDR(tradingResult.netReceived)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 font-bold">
                      <span>{s.bep}:</span>
                      <span className="text-sm font-black">
                        {formatIDR(tradingResult.bepPrice)} / lbr
                      </span>
                    </div>
                  </div>

                  {/* Fee & Tax Breakdown */}
                  <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] p-3.5 border border-card-border/50 text-xs flex flex-col gap-2">
                    <div className="font-bold text-foreground mb-1">Rincian Biaya & Pajak IDX:</div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Fee Beli Broker + PPN 11%:</span>
                      <span>{formatIDR(tradingResult.feeBuyAmount + tradingResult.ppnBuyAmount)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Fee Jual Broker + PPN 11%:</span>
                      <span>{formatIDR(tradingResult.feeSellAmount + tradingResult.ppnSellAmount)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{s.pphFinal}:</span>
                      <span className="text-foreground font-medium">
                        {formatIDR(tradingResult.pphSellAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RESULT 2: VALUATION */}
              {subTab === "valuation" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {s.grahamNumberLabel}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-foreground">
                      {formatIDR(valuationResult.grahamNumber)}
                    </span>
                  </div>

                  {/* MoS Status Badge */}
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col gap-1 ${
                      valuationResult.status === "undervalued"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                        : valuationResult.status === "fair"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wide">
                      {valuationResult.status === "undervalued"
                        ? `🟢 ${s.undervaluedTitle}`
                        : valuationResult.status === "fair"
                          ? `🔵 ${s.fairValueTitle}`
                          : `🔴 ${s.overvaluedTitle}`}
                    </div>
                    <div className="text-sm font-semibold">
                      Margin of Safety: {valuationResult.mosPercent.toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-card-border/50 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Implied P/E Ratio:</span>
                      <span className="font-semibold text-foreground">
                        {valuationResult.impliedPE.toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Implied P/BV Ratio:</span>
                      <span className="font-semibold text-foreground">
                        {valuationResult.impliedPBV.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RESULT 3: AVERAGE DOWN */}
              {subTab === "averageDown" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {s.newAveragePrice}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                      {formatIDR(avgDownResult.newAveragePrice)} / lbr
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200">
                    Penurunan harga rata-rata portofolio sebesar{" "}
                    <strong>{avgDownResult.priceReductionPercent.toFixed(1)}%</strong> dari harga awal.
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-card-border/50 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{s.totalLotsAfter}:</span>
                      <span className="font-semibold text-foreground">
                        {avgDownResult.totalLotsAfter} Lot ({avgDownResult.totalSharesAfter.toLocaleString("id-ID")} lbr)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{s.additionalCapital}:</span>
                      <span className="font-semibold text-foreground">
                        {formatIDR(avgDownResult.additionalCapital)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400">
                      <span>{s.reboundNeeded}:</span>
                      <span className="text-sm font-black">
                        +{avgDownResult.reboundNeededPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RESULT 4: DIVIDEND */}
              {subTab === "dividend" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {s.annualDividendNet}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatIDR(dividendResult.annualNet)}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Yield {dividendResult.dividendYieldNet.toFixed(2)}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({formatIDR(dividendResult.monthlyNet)} / bulan)
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-card-border/50 text-xs sm:text-sm">
                    <div className="font-bold text-foreground">Kebutuhan Target Pasif Income:</div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{s.requiredLotsForTarget}:</span>
                      <span className="font-semibold text-foreground">
                        {dividendResult.requiredLots.toLocaleString("id-ID")} Lot
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 font-bold">
                      <span>{s.requiredCapitalForTarget}:</span>
                      <span className="text-sm font-black">
                        {formatIDR(dividendResult.requiredCapital)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education Dos and Don'ts */}
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>{s.dos1}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-950 dark:text-rose-200 flex items-start gap-2">
              <span className="font-bold">✗</span>
              <span>{s.donts1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
