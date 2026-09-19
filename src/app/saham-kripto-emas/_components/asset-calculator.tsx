"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import { CurrencyInput } from "@/app/_components/ui/currency-input";

interface AssetCalculatorProps {
  dict: Dictionary;
}

type TabType = "saham" | "kripto" | "emas";
type SahamSubTab = "pnl" | "valuation" | "averageDown" | "dividend";

export function AssetCalculator({ dict }: AssetCalculatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("saham");
  const [sahamSubTab, setSahamSubTab] = useState<SahamSubTab>("pnl");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // State Variables for Stock Tab (PnL)
  const [sahamPriceBuy, setSahamPriceBuy] = useState<number>(5000); // price per share
  const [sahamPriceSell, setSahamPriceSell] = useState<number>(5500); // price per share
  const [sahamLots, setSahamLots] = useState<number>(10);
  const [sahamFeeBuy, setSahamFeeBuy] = useState<number>(0.15); // broker fee %
  const [sahamFeeSell, setSahamFeeSell] = useState<number>(0.25); // broker fee %

  // State Variables for Stock Valuation (Graham & MoS)
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

  // State Variables for Crypto Tab
  const [cryptoPriceBuy, setCryptoPriceBuy] = useState<number>(1000000000); // price per BTC in IDR
  const [cryptoPriceSell, setCryptoPriceSell] = useState<number>(1050000000); // price per BTC in IDR
  const [cryptoAmount, setCryptoAmount] = useState<number>(0.05); // BTC amount
  const [cryptoFeeBuy, setCryptoFeeBuy] = useState<number>(0.1); // exchange fee %
  const [cryptoFeeSell, setCryptoFeeSell] = useState<number>(0.1); // exchange fee %
  const [cryptoTaxType, setCryptoTaxType] = useState<"bappebti" | "non-bappebti">("bappebti");

  // State Variables for Gold Tab
  const [emasWeight, setEmasWeight] = useState<number>(10); // weight in grams
  const [emasPriceBuy, setEmasPriceBuy] = useState<number>(1300000); // price per gram
  const [emasPriceSell, setEmasPriceSell] = useState<number>(1200000); // buyback price per gram
  const [emasNpwp, setEmasNpwp] = useState<"npwp" | "no-npwp">("npwp");

  // ==================== 1. STOCK CALCULATIONS ====================
  // 1.1 Trading PnL & Fee
  const sahamSharesCount = sahamLots * 100;
  const sahamBuyValGross = sahamSharesCount * sahamPriceBuy;
  const sahamFeeBuyAmount = (sahamFeeBuy / 100) * sahamBuyValGross;
  const sahamPpnBuyAmount = sahamFeeBuyAmount * 0.11; // 11% PPN on fee
  const sahamTotalCostBuy = sahamBuyValGross + sahamFeeBuyAmount + sahamPpnBuyAmount; // Net outlay to buy

  const sahamSellValGross = sahamSharesCount * sahamPriceSell;
  const sahamFeeSellAmount = (sahamFeeSell / 100) * sahamSellValGross;
  const sahamPpnSellAmount = sahamFeeSellAmount * 0.11; // 11% PPN on fee
  const sahamPphSellAmount = 0.001 * sahamSellValGross; // 0.1% Final PPh on gross sales value
  const sahamNetReceived = sahamSellValGross - sahamFeeSellAmount - sahamPpnSellAmount - sahamPphSellAmount; // Net received

  const sahamNetProfit = sahamNetReceived - sahamTotalCostBuy;
  const sahamRoi = sahamTotalCostBuy > 0 ? (sahamNetProfit / sahamTotalCostBuy) * 100 : 0;

  // Stock Break-Even Price Calculation
  const sahamRateSellMultiplier = 1 - (sahamFeeSell / 100) * 1.11 - 0.001;
  const sahamBepPrice = sahamRateSellMultiplier > 0
    ? sahamTotalCostBuy / (sahamSharesCount * sahamRateSellMultiplier)
    : 0;

  // 1.2 Graham Valuation & Margin of Safety
  const isGrahamValid = valEps > 0 && valBvps > 0;
  const grahamNumber = isGrahamValid ? Math.round(Math.sqrt(22.5 * valEps * valBvps)) : 0;
  const mosPercent = grahamNumber > 0 ? ((grahamNumber - valCurrentPrice) / grahamNumber) * 100 : 0;
  const valuationStatus: "undervalued" | "fair" | "overvalued" =
    mosPercent >= 20 ? "undervalued" : mosPercent >= 0 ? "fair" : "overvalued";
  const impliedPE = valEps > 0 ? valCurrentPrice / valEps : 0;
  const impliedPBV = valBvps > 0 ? valCurrentPrice / valBvps : 0;

  // 1.3 Average Down Calculations
  const avgInitialCap = avgInitialLots * 100 * avgInitialPrice;
  const avgAdditionalCap = avgNewLots * 100 * avgNewPrice;
  const avgTotalLotsAfter = avgInitialLots + avgNewLots;
  const avgTotalSharesAfter = avgTotalLotsAfter * 100;
  const avgTotalCapAfter = avgInitialCap + avgAdditionalCap;
  const avgNewPriceResult = avgTotalSharesAfter > 0 ? Math.round(avgTotalCapAfter / avgTotalSharesAfter) : 0;
  const avgPriceReduction = avgInitialPrice > 0 ? ((avgInitialPrice - avgNewPriceResult) / avgInitialPrice) * 100 : 0;
  const avgReboundNeeded = avgNewPrice > 0 ? ((avgNewPriceResult - avgNewPrice) / avgNewPrice) * 100 : 0;

  // 1.4 Dividend & Passive Income Calculations
  const divTotalShares = divLots * 100;
  const divTotalCapital = divTotalShares * divStockPrice;
  const divTaxRate = divTaxOption === "reguler" ? 0.10 : 0.0;
  const divNetDps = divDps * (1 - divTaxRate);
  const divAnnualGross = divTotalShares * divDps;
  const divAnnualNet = divTotalShares * divNetDps;
  const divMonthlyNet = divAnnualNet / 12;
  const divYieldNet = divStockPrice > 0 ? (divNetDps / divStockPrice) * 100 : 0;
  const divTargetAnnual = divTargetMonthly * 12;
  const divRequiredShares = divNetDps > 0 ? Math.ceil(divTargetAnnual / divNetDps) : 0;
  const divRequiredLots = Math.ceil(divRequiredShares / 100);
  const divRequiredCapital = divRequiredShares * divStockPrice;

  // ==================== 2. CRYPTO CALCULATIONS ====================
  const cryptoBuyValGross = cryptoAmount * cryptoPriceBuy;
  const cryptoFeeBuyAmount = (cryptoFeeBuy / 100) * cryptoBuyValGross;
  const cryptoTaxRate = cryptoTaxType === "bappebti" ? 0.002 : 0.004; // 0.2% vs 0.4% total (PPh 0.1/0.2 + PPN 0.1/0.2)
  const cryptoBuyTaxAmount = cryptoTaxRate * cryptoBuyValGross;
  const cryptoTotalCostBuy = cryptoBuyValGross + cryptoFeeBuyAmount + cryptoBuyTaxAmount;

  const cryptoSellValGross = cryptoAmount * cryptoPriceSell;
  const cryptoFeeSellAmount = (cryptoFeeSell / 100) * cryptoSellValGross;
  const cryptoSellTaxAmount = cryptoTaxRate * cryptoSellValGross;
  const cryptoNetReceived = cryptoSellValGross - cryptoFeeSellAmount - cryptoSellTaxAmount;

  const cryptoNetProfit = cryptoNetReceived - cryptoTotalCostBuy;
  const cryptoRoi = cryptoTotalCostBuy > 0 ? (cryptoNetProfit / cryptoTotalCostBuy) * 100 : 0;

  // ==================== 3. GOLD CALCULATIONS ====================
  const emasBuyValGross = emasWeight * emasPriceBuy;
  const emasBuyTaxRate = emasNpwp === "npwp" ? 0.0045 : 0.009; // PPh 22: 0.45% vs 0.90%
  const emasBuyTaxAmount = emasBuyTaxRate * emasBuyValGross;
  const emasTotalCostBuy = emasBuyValGross + emasBuyTaxAmount;

  const emasSellValGross = emasWeight * emasPriceSell;
  // PPh 22 on sell/buyback is 1.5% (NPWP) or 3% (No NPWP) ONLY if the transaction exceeds Rp 10 million
  const emasSellTaxRate = emasSellValGross > 10000000 ? (emasNpwp === "npwp" ? 0.015 : 0.03) : 0;
  const emasSellTaxAmount = emasSellTaxRate * emasSellValGross;
  const emasNetReceived = emasSellValGross - emasSellTaxAmount;

  const emasNetProfit = emasNetReceived - emasTotalCostBuy;
  const emasRoi = emasTotalCostBuy > 0 ? (emasNetProfit / emasTotalCostBuy) * 100 : 0;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.sahamKriptoEmas.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.sahamKriptoEmas.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg overflow-hidden shadow-sm">
            {/* Asset Tab switcher */}
            <div className="flex border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
              <button
                type="button"
                onClick={() => setActiveTab("saham")}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "saham"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white/[0.02]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {dict.sahamKriptoEmas.tabSaham}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("kripto")}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "kripto"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white/[0.02]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {dict.sahamKriptoEmas.tabKripto}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("emas")}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "emas"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white/[0.02]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {dict.sahamKriptoEmas.tabEmas}
              </button>
            </div>

            <CardContent className="flex flex-col gap-6 pt-6">
              {/* TAB 1: STOCKS */}
              {activeTab === "saham" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  {/* SUB-TABS SAHAM */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border">
                    <button
                      type="button"
                      onClick={() => setSahamSubTab("pnl")}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                        sahamSubTab === "pnl"
                          ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                      }`}
                    >
                      {dict.sahamKriptoEmas.subTabPnl || "Biaya & PnL"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSahamSubTab("valuation")}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                        sahamSubTab === "valuation"
                          ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                      }`}
                    >
                      {dict.sahamKriptoEmas.subTabValuation || "Valuasi Graham"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSahamSubTab("averageDown")}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                        sahamSubTab === "averageDown"
                          ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                      }`}
                    >
                      {dict.sahamKriptoEmas.subTabAverageDown || "Average Down"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSahamSubTab("dividend")}
                      className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-center ${
                        sahamSubTab === "dividend"
                          ? "bg-white text-primary shadow-sm dark:bg-zinc-800 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                      }`}
                    >
                      {dict.sahamKriptoEmas.subTabDividend || "Dividen Planner"}
                    </button>
                  </div>

                  {/* 1.1 SUB-TAB: PNL & BIAYA TRANSAKSI */}
                  {sahamSubTab === "pnl" && (
                    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                      <CurrencyInput
                        id="saham-buy-price"
                        label={dict.sahamKriptoEmas.sahamPriceBuy}
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
                        label={dict.sahamKriptoEmas.sahamPriceSell}
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
                        label={dict.sahamKriptoEmas.sahamLots}
                        value={sahamLots}
                        onChange={setSahamLots}
                        min={1}
                        max={10000}
                        step={1}
                        isCurrency={false}
                        unit="Lot"
                        presets={[
                          { label: "5 Lot", value: 5 },
                          { label: "10 Lot", value: 10 },
                          { label: "50 Lot", value: 50 },
                          { label: "100 Lot", value: 100 },
                          { label: "500 Lot", value: 500 },
                        ]}
                        tooltip="1 Lot Bursa Efek Indonesia (IDX) setara dengan 100 lembar saham."
                      />

                      {/* Broker Fees */}
                      <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="saham-fee-buy" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                            {dict.sahamKriptoEmas.sahamFeeBuy}
                          </label>
                          <input
                            id="saham-fee-buy"
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            value={sahamFeeBuy}
                            onChange={(e) => setSahamFeeBuy(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary font-bold min-h-[44px]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="saham-fee-sell" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                            {dict.sahamKriptoEmas.sahamFeeSell}
                          </label>
                          <input
                            id="saham-fee-sell"
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            value={sahamFeeSell}
                            onChange={(e) => setSahamFeeSell(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary font-bold min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1.2 SUB-TAB: VALUASI GRAHAM & MOS */}
                  {sahamSubTab === "valuation" && (
                    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        <span className="font-bold text-primary block mb-0.5">Formula Benjamin Graham (Value Investing)</span>
                        Kombinasi batas PER 15x dan PBV 1.5x (akar dari 22.5 × EPS × BVPS) untuk menemukan harga wajar dan diskon saham secara konservatif.
                      </div>

                      <CurrencyInput
                        id="val-current-price"
                        label={dict.sahamKriptoEmas.currentPriceLabel || "Harga Saham Saat Ini"}
                        value={valCurrentPrice}
                        onChange={setValCurrentPrice}
                        min={50}
                        max={200000}
                        step={50}
                        presets={[
                          { label: "1.500", value: 1500 },
                          { label: "3.500", value: 3500 },
                          { label: "5.000", value: 5000 },
                          { label: "10.000", value: 10000 },
                        ]}
                      />

                      <CurrencyInput
                        id="val-eps"
                        label={dict.sahamKriptoEmas.epsLabel || "EPS (Laba Bersih per Lembar)"}
                        value={valEps}
                        onChange={setValEps}
                        min={1}
                        max={50000}
                        step={10}
                        presets={[
                          { label: "150", value: 150 },
                          { label: "350", value: 350 },
                          { label: "500", value: 500 },
                          { label: "1.000", value: 1000 },
                        ]}
                        tooltip="Laba bersih tahunan perusahaan dibagi total lembar saham beredar (Earnings Per Share / TTM)."
                      />

                      <CurrencyInput
                        id="val-bvps"
                        label={dict.sahamKriptoEmas.bvpsLabel || "BVPS (Nilai Buku Ekuitas per Lembar)"}
                        value={valBvps}
                        onChange={setValBvps}
                        min={1}
                        max={100000}
                        step={50}
                        presets={[
                          { label: "1.000", value: 1000 },
                          { label: "2.500", value: 2500 },
                          { label: "5.000", value: 5000 },
                          { label: "10.000", value: 10000 },
                        ]}
                        tooltip="Total ekuitas bersih perusahaan dibagi total lembar saham beredar (Book Value Per Share)."
                      />
                    </div>
                  )}

                  {/* 1.3 SUB-TAB: AVERAGE DOWN */}
                  {sahamSubTab === "averageDown" && (
                    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                      <div className="flex flex-col gap-4 p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">1. Posisi Kepemilikan Awal</span>
                        <CurrencyInput
                          id="avg-init-lots"
                          label={dict.sahamKriptoEmas.initialLots || "Jumlah Lot Awal"}
                          value={avgInitialLots}
                          onChange={setAvgInitialLots}
                          min={1}
                          max={10000}
                          step={1}
                          isCurrency={false}
                          unit="Lot"
                        />
                        <CurrencyInput
                          id="avg-init-price"
                          label={dict.sahamKriptoEmas.initialPrice || "Harga Beli Awal"}
                          value={avgInitialPrice}
                          onChange={setAvgInitialPrice}
                          min={50}
                          max={200000}
                          step={50}
                        />
                      </div>

                      <div className="flex flex-col gap-4 p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">2. Rencana Pembelian Baru (Serok)</span>
                        <CurrencyInput
                          id="avg-new-lots"
                          label={dict.sahamKriptoEmas.newLots || "Rencana Beli Lot Tambahan"}
                          value={avgNewLots}
                          onChange={setAvgNewLots}
                          min={1}
                          max={10000}
                          step={1}
                          isCurrency={false}
                          unit="Lot"
                        />
                        <CurrencyInput
                          id="avg-new-price"
                          label={dict.sahamKriptoEmas.newPrice || "Harga Pembelian Baru"}
                          value={avgNewPrice}
                          onChange={setAvgNewPrice}
                          min={50}
                          max={200000}
                          step={50}
                        />
                      </div>
                    </div>
                  )}

                  {/* 1.4 SUB-TAB: DIVIDEN PLANNER */}
                  {sahamSubTab === "dividend" && (
                    <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                      <CurrencyInput
                        id="div-stock-price"
                        label="Harga Saham Saat Ini"
                        value={divStockPrice}
                        onChange={setDivStockPrice}
                        min={50}
                        max={200000}
                        step={50}
                      />

                      <CurrencyInput
                        id="div-dps"
                        label={dict.sahamKriptoEmas.dpsLabel || "Dividen per Lembar (DPS)"}
                        value={divDps}
                        onChange={setDivDps}
                        min={1}
                        max={20000}
                        step={10}
                        tooltip="Nominal dividen tunai per lembar saham yang dibagikan emiten dalam 1 tahun buku."
                      />

                      <CurrencyInput
                        id="div-lots"
                        label="Jumlah Lot yang Anda Miliki"
                        value={divLots}
                        onChange={setDivLots}
                        min={1}
                        max={100000}
                        step={5}
                        isCurrency={false}
                        unit="Lot"
                      />

                      {/* Tax Selector */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          {dict.sahamKriptoEmas.divTaxLabel || "Pilihan Pajak Dividen"}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDivTaxOption("exempt")}
                            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              divTaxOption === "exempt"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {dict.sahamKriptoEmas.divTaxExempt || "Bebas Pajak 0% (UU HPP)"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDivTaxOption("reguler")}
                            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              divTaxOption === "reguler"
                                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {dict.sahamKriptoEmas.divTaxReguler || "PPh Final 10% (Reguler)"}
                          </button>
                        </div>
                      </div>

                      <CurrencyInput
                        id="div-target-monthly"
                        label={dict.sahamKriptoEmas.targetPassiveIncome || "Target Pasif Income Bulanan"}
                        value={divTargetMonthly}
                        onChange={setDivTargetMonthly}
                        min={500000}
                        max={1000000000}
                        step={500000}
                        presets={[
                          { label: "2 Jt/bln", setAmount: 2000000 },
                          { label: "5 Jt/bln", setAmount: 5000000 },
                          { label: "10 Jt/bln", setAmount: 10000000 },
                          { label: "25 Jt/bln", setAmount: 25000000 },
                        ]}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CRYPTO */}
              {activeTab === "kripto" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                  {/* Buy Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="crypto-buy-price" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.cryptoPriceBuy} (IDR)
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(cryptoPriceBuy)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="crypto-buy-price"
                        type="range"
                        min="10000000"
                        max="2000000000"
                        step="10000000"
                        value={cryptoPriceBuy}
                        onChange={(e) => setCryptoPriceBuy(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="10000000"
                        max="10000000000"
                        step="5000000"
                        value={cryptoPriceBuy}
                        onChange={(e) => setCryptoPriceBuy(Number(e.target.value))}
                        className="w-full sm:w-36 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Sell Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="crypto-sell-price" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.cryptoPriceSell} (IDR)
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(cryptoPriceSell)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="crypto-sell-price"
                        type="range"
                        min="10000000"
                        max="2000000000"
                        step="10000000"
                        value={cryptoPriceSell}
                        onChange={(e) => setCryptoPriceSell(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="10000000"
                        max="10000000000"
                        step="5000000"
                        value={cryptoPriceSell}
                        onChange={(e) => setCryptoPriceSell(Number(e.target.value))}
                        className="w-full sm:w-36 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Amount / Weight */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="crypto-amount" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.cryptoAmount}
                      </label>
                      <span className="text-sm font-bold text-primary">
                        {cryptoAmount}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="crypto-amount"
                        type="range"
                        min="0.001"
                        max="5"
                        step="0.001"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        max="1000"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(Math.max(0.0001, Number(e.target.value)))}
                        className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Tax Scheme & Exchange Fees */}
                  <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="crypto-tax" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.cryptoTaxScheme}
                      </label>
                      <select
                        id="crypto-tax"
                        value={cryptoTaxType}
                        onChange={(e) => setCryptoTaxType(e.target.value as "bappebti" | "non-bappebti")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="bappebti" className="bg-background">{dict.sahamKriptoEmas.cryptoTaxBappebti}</option>
                        <option value="non-bappebti" className="bg-background">{dict.sahamKriptoEmas.cryptoTaxNonBappebti}</option>
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="crypto-fee-buy" className="text-xs font-semibold text-zinc-500">
                          {dict.sahamKriptoEmas.cryptoFeeBuy}
                        </label>
                        <input
                          id="crypto-fee-buy"
                          type="number"
                          step="0.01"
                          min="0"
                          max="2"
                          value={cryptoFeeBuy}
                          onChange={(e) => setCryptoFeeBuy(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="crypto-fee-sell" className="text-xs font-semibold text-zinc-500">
                          {dict.sahamKriptoEmas.cryptoFeeSell}
                        </label>
                        <input
                          id="crypto-fee-sell"
                          type="number"
                          step="0.01"
                          min="0"
                          max="2"
                          value={cryptoFeeSell}
                          onChange={(e) => setCryptoFeeSell(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GOLD */}
              {activeTab === "emas" && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                  {/* Gold Weight */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="emas-weight" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.emasWeight}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {emasWeight} gr
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="emas-weight"
                        type="range"
                        min="1"
                        max="500"
                        step="1"
                        value={emasWeight}
                        onChange={(e) => setEmasWeight(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={emasWeight}
                        onChange={(e) => setEmasWeight(Math.max(1, Number(e.target.value)))}
                        className="w-full sm:w-24 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Gold Buy Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="emas-buy-price" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.emasPriceBuy}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(emasPriceBuy)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="emas-buy-price"
                        type="range"
                        min="500000"
                        max="2500000"
                        step="10000"
                        value={emasPriceBuy}
                        onChange={(e) => setEmasPriceBuy(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="500000"
                        max="2500000"
                        step="10000"
                        value={emasPriceBuy}
                        onChange={(e) => setEmasPriceBuy(Number(e.target.value))}
                        className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Gold Sell Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="emas-sell-price" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.emasPriceSell}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(emasPriceSell)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="emas-sell-price"
                        type="range"
                        min="500000"
                        max="2500000"
                        step="10000"
                        value={emasPriceSell}
                        onChange={(e) => setEmasPriceSell(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="500000"
                        max="2500000"
                        step="10000"
                        value={emasPriceSell}
                        onChange={(e) => setEmasPriceSell(Number(e.target.value))}
                        className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* NPWP status */}
                  <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                    <label htmlFor="emas-npwp" className="text-sm font-semibold text-foreground">
                      {dict.sahamKriptoEmas.emasTaxScheme}
                    </label>
                    <select
                      id="emas-npwp"
                      value={emasNpwp}
                      onChange={(e) => setEmasNpwp(e.target.value as "npwp" | "no-npwp")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="npwp" className="bg-background">{dict.sahamKriptoEmas.emasNpwpActive}</option>
                      <option value="no-npwp" className="bg-background">{dict.sahamKriptoEmas.emasNoNpwp}</option>
                    </select>
                  </div>
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
                <li>{dict.sahamKriptoEmas.dos1}</li>
                <li>{dict.sahamKriptoEmas.dos2}</li>
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
                <li>{dict.sahamKriptoEmas.donts1}</li>
                <li>{dict.sahamKriptoEmas.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          {/* TAB 1: STOCK RESULTS */}
          {activeTab === "saham" && (
            <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden animate-in fade-in duration-200">
              {/* 1.1 RESULT: PNL */}
              {sahamSubTab === "pnl" && (
                <>
                  <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                    <h3 className="text-base font-bold text-foreground">
                      {dict.sahamKriptoEmas.sahamTotalCapital}
                    </h3>
                  </div>

                  <CardContent className="flex flex-col gap-5 pt-6">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Nilai Saham (Kotor)</span>
                        <span className="font-semibold text-foreground">{formatIDR(sahamBuyValGross)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Fee Beli Broker ({sahamFeeBuy}%)</span>
                        <span className="font-semibold text-rose-500">+{formatIDR(sahamFeeBuyAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">{dict.sahamKriptoEmas.sahamPpnOnFee}</span>
                        <span className="font-semibold text-rose-500">+{formatIDR(sahamPpnBuyAmount)}</span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                        <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.sahamTotalCostBuy}</span>
                        <span className="text-sm font-extrabold text-foreground">{formatIDR(sahamTotalCostBuy)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4 mt-1">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Hasil Penjualan</h4>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Nilai Jual (Kotor)</span>
                        <span className="font-semibold text-foreground">{formatIDR(sahamSellValGross)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Fee Jual Broker ({sahamFeeSell}%)</span>
                        <span className="font-semibold text-rose-500">-{formatIDR(sahamFeeSellAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">{dict.sahamKriptoEmas.sahamPpnOnFee}</span>
                        <span className="font-semibold text-rose-500">-{formatIDR(sahamPpnSellAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">{dict.sahamKriptoEmas.sahamPphFinal}</span>
                        <span className="font-semibold text-rose-500">-{formatIDR(sahamPphSellAmount)}</span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                        <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.sahamNetReceived}</span>
                        <span className="text-sm font-extrabold text-foreground">{formatIDR(sahamNetReceived)}</span>
                      </div>
                    </div>

                    {/* Net Laba Rugi */}
                    <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4 mt-1">
                      <div className={`flex justify-between items-center p-4 rounded-xl border ${
                        sahamNetProfit >= 0
                          ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{dict.sahamKriptoEmas.sahamNetProfit}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sahamKriptoEmas.sahamRoi}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-base font-extrabold">{sahamNetProfit >= 0 ? "+" : ""}{formatIDR(sahamNetProfit)}</span>
                          <span className="text-xs font-bold">{sahamNetProfit >= 0 ? "+" : ""}{sahamRoi.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Break Even Price card */}
                    <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.02] text-xs leading-relaxed flex flex-col gap-1">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{dict.sahamKriptoEmas.sahamBep}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 -mt-0.5">Harga saham per lembar agar transaksi impas (setelah semua fee & pajak)</span>
                      <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{formatIDR(sahamBepPrice)}</span>
                    </div>

                    {/* Share Summary Button - Saham PnL */}
                    <div className="pt-2">
                      <ShareSummaryButton
                        title="Simulasi Perhitungan Saham IDX"
                        summaryText={
                          `📈 *Simulasi Trading & Investasi Saham IDX*\n` +
                          `• Total Modal Pembelian: ${formatIDR(sahamTotalCostBuy)}\n` +
                          `• Total Hasil Penjualan Bersih: ${formatIDR(sahamNetReceived)}\n` +
                          `• Titik Impas (BEP): ${formatIDR(sahamBepPrice)} / lembar\n` +
                          `---------------------------------\n` +
                          `*Hasil Bersih (Net Profit): ${sahamNetProfit >= 0 ? "+" : ""}${formatIDR(sahamNetProfit)}*\n` +
                          `*ROI Bersih: ${sahamNetProfit >= 0 ? "+" : ""}${sahamRoi.toFixed(2)}%*`
                        }
                      />
                    </div>
                  </CardContent>
                </>
              )}

              {/* 1.2 RESULT: VALUASI GRAHAM & MOS */}
              {sahamSubTab === "valuation" && (
                <>
                  <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                    <h3 className="text-base font-bold text-foreground">
                      Analisis Nilai Wajar Graham (MoS)
                    </h3>
                  </div>

                  <CardContent className="flex flex-col gap-5 pt-6">
                    {!isGrahamValid ? (
                      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
                        ⚠️ Formula Benjamin Graham hanya berlaku untuk perusahaan yang membukukan laba (EPS &gt; 0) dan ekuitas positif (BVPS &gt; 0).
                      </div>
                    ) : (
                      <>
                        {/* Decision Verdict Badge */}
                        <div className={`p-4 rounded-2xl border flex flex-col gap-1.5 ${
                          valuationStatus === "undervalued"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : valuationStatus === "fair"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider">Status Valuasi</span>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/30">
                              MoS: {mosPercent >= 0 ? "+" : ""}{mosPercent.toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-lg font-black">
                            {valuationStatus === "undervalued" && "🟢 Undervalued (Diskon Menarik)"}
                            {valuationStatus === "fair" && "🟡 Fair Value (Harga Wajar)"}
                            {valuationStatus === "overvalued" && "🔴 Overvalued (Kemahalan)"}
                          </span>
                          <span className="text-xs leading-relaxed opacity-90">
                            {valuationStatus === "undervalued" && "Harga pasar saat ini berada di bawah nilai wajar Benjamin Graham dengan margin diskon yang aman."}
                            {valuationStatus === "fair" && "Harga pasar saat ini berada dalam rentang wajar. Cocok untuk akumulasi berkala (DCA)."}
                            {valuationStatus === "overvalued" && "Harga pasar saat ini diperdagangkan dengan premium di atas nilai wajar intrinsiknya."}
                          </span>
                        </div>

                        {/* Breakdown Data */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Harga Pasar Sekarang</span>
                            <span className="font-bold text-foreground">{formatIDR(valCurrentPrice)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Nilai Wajar Graham (Graham Number)</span>
                            <span className="font-extrabold text-primary text-sm">{formatIDR(grahamNumber)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Margin of Safety (MoS)</span>
                            <span className={`font-bold ${mosPercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                              {mosPercent >= 0 ? "+" : ""}{mosPercent.toFixed(1)}% {mosPercent >= 0 ? "(Diskon)" : "(Premium)"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-t border-card-border/50 pt-2 mt-1">
                            <span className="text-zinc-500">Rasio P/E (Price-to-Earnings)</span>
                            <span className="font-bold text-foreground">{impliedPE.toFixed(1)}x</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Rasio P/BV (Price-to-Book)</span>
                            <span className="font-bold text-foreground">{impliedPBV.toFixed(2)}x</span>
                          </div>
                        </div>

                        {/* Share Summary Button - Graham */}
                        <div className="pt-2">
                          <ShareSummaryButton
                            title="Analisis Valuasi Saham Graham"
                            summaryText={
                              `💎 *Analisis Valuasi Saham (Graham Number) — Amir App*\n` +
                              `• Harga Pasar: ${formatIDR(valCurrentPrice)}\n` +
                              `• EPS: ${formatIDR(valEps)} | BVPS: ${formatIDR(valBvps)}\n` +
                              `• Nilai Wajar Graham: ${formatIDR(grahamNumber)}\n` +
                              `• Margin of Safety (MoS): ${mosPercent >= 0 ? "+" : ""}${mosPercent.toFixed(1)}%\n` +
                              `• Status: ${valuationStatus === "undervalued" ? "🟢 Undervalued (Diskon)" : valuationStatus === "fair" ? "🟡 Fair Value" : "🔴 Overvalued (Kemahalan)"}\n` +
                              `• Implied P/E: ${impliedPE.toFixed(1)}x | P/BV: ${impliedPBV.toFixed(2)}x`
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </>
              )}

              {/* 1.3 RESULT: AVERAGE DOWN */}
              {sahamSubTab === "averageDown" && (
                <>
                  <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                    <h3 className="text-base font-bold text-foreground">
                      Hasil Simulasi Average Down
                    </h3>
                  </div>

                  <CardContent className="flex flex-col gap-5 pt-6">
                    {/* Perubahan Harga Rata-Rata */}
                    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-primary">Harga Rata-Rata Baru (New Avg)</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-foreground">{formatIDR(avgNewPriceResult)}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Turun {avgPriceReduction.toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Dari harga awal {formatIDR(avgInitialPrice)} berhasil ditekan ke {formatIDR(avgNewPriceResult)} per lembar.
                      </span>
                    </div>

                    {/* Breakdown Modal */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Modal Kepemilikan Awal ({avgInitialLots} Lot)</span>
                        <span className="font-semibold text-foreground">{formatIDR(avgInitialCap)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Tambahan Modal Baru ({avgNewLots} Lot)</span>
                        <span className="font-semibold text-primary font-bold">+{formatIDR(avgAdditionalCap)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-card-border/50 pt-2 mt-1">
                        <span className="text-zinc-500">Total Kepemilikan Baru</span>
                        <span className="font-extrabold text-foreground">{avgTotalLotsAfter} Lot ({avgTotalSharesAfter.toLocaleString("id-ID")} lbr)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Total Akumulasi Modal</span>
                        <span className="font-extrabold text-foreground">{formatIDR(avgTotalCapAfter)}</span>
                      </div>
                    </div>

                    {/* Rebound to BEP Card */}
                    <div className="p-3.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.02] flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">Kenaikan untuk Impas (BEP)</span>
                        <span className="text-xs text-zinc-500">Dari harga serok baru ({formatIDR(avgNewPrice)})</span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        +{avgReboundNeeded.toFixed(1)}%
                      </span>
                    </div>

                    {/* Share Summary Button - Average Down */}
                    <div className="pt-2">
                      <ShareSummaryButton
                        title="Simulasi Average Down Saham"
                        summaryText={
                          `📉 *Rencana Average Down Saham — Amir App*\n` +
                          `• Posisi Awal: ${avgInitialLots} Lot @ ${formatIDR(avgInitialPrice)}\n` +
                          `• Pembelian Baru: ${avgNewLots} Lot @ ${formatIDR(avgNewPrice)}\n` +
                          `• Tambahan Modal: ${formatIDR(avgAdditionalCap)}\n` +
                          `---------------------------------\n` +
                          `*Harga Rata-Rata Baru: ${formatIDR(avgNewPriceResult)} / lembar*\n` +
                          `*Penurunan Biaya Rata-Rata: -${avgPriceReduction.toFixed(1)}%*\n` +
                          `*Total Lot Baru: ${avgTotalLotsAfter} Lot (${formatIDR(avgTotalCapAfter)})*\n` +
                          `*Target Rebound to BEP: +${avgReboundNeeded.toFixed(1)}% dari harga serok*`
                        }
                      />
                    </div>
                  </CardContent>
                </>
              )}

              {/* 1.4 RESULT: DIVIDEN PLANNER */}
              {sahamSubTab === "dividend" && (
                <>
                  <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                    <h3 className="text-base font-bold text-foreground">
                      Proyeksi Dividen & Pasif Income
                    </h3>
                  </div>

                  <CardContent className="flex flex-col gap-5 pt-6">
                    {/* Dividen Bersih Box */}
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Dividen Bersih Tahunan</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                          Yield Bersih: {divYieldNet.toFixed(2)}%
                        </span>
                      </div>
                      <span className="text-2xl font-black text-foreground">{formatIDR(divAnnualNet)}</span>
                      <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 border-t border-emerald-500/10 pt-2 mt-1">
                        <span>Setara Pasif Income / Bulan</span>
                        <span className="font-extrabold text-foreground text-sm">{formatIDR(divMonthlyNet)}</span>
                      </div>
                    </div>

                    {/* Rincian Dividen */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Total Modal Saham Saat Ini ({divLots} Lot)</span>
                        <span className="font-semibold text-foreground">{formatIDR(divTotalCapital)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Dividen Kotor Tahunan (Sebelum Pajak)</span>
                        <span className="font-semibold text-foreground">{formatIDR(divAnnualGross)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Potongan Pajak Dividen ({divTaxOption === "reguler" ? "10%" : "0%"})</span>
                        <span className="font-semibold text-rose-500">-{formatIDR(divAnnualGross - divAnnualNet)}</span>
                      </div>
                    </div>

                    {/* Target Passive Income Goal Box */}
                    <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02] flex flex-col gap-2 mt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Target Bulanan: {formatIDR(divTargetMonthly)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Modal Saham yang Dibutuhkan</span>
                        <span className="font-extrabold text-foreground text-sm">{formatIDR(divRequiredCapital)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Jumlah Lot yang Harus Terkumpul</span>
                        <span className="font-bold text-foreground">{divRequiredLots.toLocaleString("id-ID")} Lot</span>
                      </div>
                    </div>

                    {/* Share Summary Button - Dividend */}
                    <div className="pt-2">
                      <ShareSummaryButton
                        title="Perencanaan Dividen Saham"
                        summaryText={
                          `💰 *Proyeksi Dividen & Pasif Income Saham — Amir App*\n` +
                          `• Portofolio: ${divLots} Lot @ ${formatIDR(divStockPrice)} (${formatIDR(divTotalCapital)})\n` +
                          `• DPS: ${formatIDR(divDps)} / lembar\n` +
                          `• Pajak Dividen: ${divTaxOption === "reguler" ? "PPh Final 10%" : "0% (UU HPP)"}\n` +
                          `---------------------------------\n` +
                          `*Dividen Bersih Tahunan: ${formatIDR(divAnnualNet)}*\n` +
                          `*Pasif Income Bersih / Bulan: ${formatIDR(divMonthlyNet)}*\n` +
                          `*Net Dividend Yield: ${divYieldNet.toFixed(2)}%*\n` +
                          `---------------------------------\n` +
                          `🎯 Target Pasif Income: ${formatIDR(divTargetMonthly)} / bulan\n` +
                          `• Modal Diperlukan: ${formatIDR(divRequiredCapital)} (${divRequiredLots.toLocaleString("id-ID")} Lot)`
                        }
                      />
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          )}

          {/* TAB 2: CRYPTO RESULTS */}
          {activeTab === "kripto" && (
            <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden animate-in fade-in duration-200">
              <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                <h3 className="text-base font-bold text-foreground">
                  Detail Transaksi Kripto
                </h3>
              </div>

              <CardContent className="flex flex-col gap-5 pt-6">
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Nilai Pembelian Aset</span>
                    <span className="font-semibold text-foreground">{formatIDR(cryptoBuyValGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Total Fee & Pajak Beli</span>
                    <span className="font-semibold text-rose-500">+{formatIDR(cryptoBuyTaxAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.cryptoTotalSpendBuy}</span>
                    <span className="text-sm font-extrabold text-foreground">{formatIDR(cryptoTotalCostBuy)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4 mt-1">
                  <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Hasil Penjualan</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Nilai Penjualan Kotor</span>
                    <span className="font-semibold text-foreground">{formatIDR(cryptoSellValGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Total Fee & Pajak Jual</span>
                    <span className="font-semibold text-rose-500">-{formatIDR(cryptoSellTaxAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.cryptoNetReceived}</span>
                    <span className="text-sm font-extrabold text-foreground">{formatIDR(cryptoNetReceived)}</span>
                  </div>
                </div>

                {/* Net Laba Rugi */}
                <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4 mt-1">
                  <div className={`flex justify-between items-center p-4 rounded-xl border ${
                    cryptoNetProfit >= 0
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{dict.sahamKriptoEmas.cryptoNetProfit}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sahamKriptoEmas.sahamRoi}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-base font-extrabold">{cryptoNetProfit >= 0 ? "+" : ""}{formatIDR(cryptoNetProfit)}</span>
                      <span className="text-xs font-bold">{cryptoNetProfit >= 0 ? "+" : ""}{cryptoRoi.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Share Summary Button - Kripto */}
                <div className="pt-2">
                  <ShareSummaryButton
                    title="Simulasi Perhitungan Aset Kripto"
                    summaryText={
                      `🪙 *Simulasi Transaksi Aset Kripto*\n` +
                      `• Total Modal Beli: ${formatIDR(cryptoTotalCostBuy)}\n` +
                      `• Total Penjualan Bersih: ${formatIDR(cryptoNetReceived)}\n` +
                      `---------------------------------\n` +
                      `*Hasil Bersih (Net Profit): ${cryptoNetProfit >= 0 ? "+" : ""}${formatIDR(cryptoNetProfit)}*\n` +
                      `*ROI Bersih: ${cryptoNetProfit >= 0 ? "+" : ""}${cryptoRoi.toFixed(2)}%*`
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: GOLD RESULTS */}
          {activeTab === "emas" && (
            <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden animate-in fade-in duration-200">
              <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
                <h3 className="text-base font-bold text-foreground">
                  Detail Transaksi Emas
                </h3>
              </div>

              <CardContent className="flex flex-col gap-5 pt-6">
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Harga Emas Batangan</span>
                    <span className="font-semibold text-foreground">{formatIDR(emasBuyValGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400 flex flex-col">
                      <span className="font-medium text-foreground">{dict.sahamKriptoEmas.emasBuyTax}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sahamKriptoEmas.emasBuyTaxDesc}</span>
                    </span>
                    <span className="font-semibold text-rose-500">+{formatIDR(emasBuyTaxAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.emasTotalSpendBuy}</span>
                    <span className="text-sm font-extrabold text-foreground">{formatIDR(emasTotalCostBuy)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4 mt-1">
                  <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Hasil Penjualan Kembali (Buyback)</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Harga Buyback Rata-rata</span>
                    <span className="font-semibold text-foreground">{formatIDR(emasSellValGross)}</span>
                  </div>
                  {emasSellTaxAmount > 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400 flex flex-col">
                        <span className="font-medium text-foreground">{dict.sahamKriptoEmas.emasSellTax}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sahamKriptoEmas.emasSellTaxDesc}</span>
                      </span>
                      <span className="font-semibold text-rose-500">-{formatIDR(emasSellTaxAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.emasNetReceived}</span>
                    <span className="text-sm font-extrabold text-foreground">{formatIDR(emasNetReceived)}</span>
                  </div>
                </div>

                {/* Net Laba Rugi */}
                <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4 mt-1">
                  <div className={`flex justify-between items-center p-4 rounded-xl border ${
                    emasNetProfit >= 0
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{dict.sahamKriptoEmas.emasNetProfit}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sahamKriptoEmas.sahamRoi}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-base font-extrabold">{emasNetProfit >= 0 ? "+" : ""}{formatIDR(emasNetProfit)}</span>
                      <span className="text-xs font-bold">{emasNetProfit >= 0 ? "+" : ""}{emasRoi.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Share Summary Button - Emas */}
                <div className="pt-2">
                  <ShareSummaryButton
                    title="Simulasi Investasi Emas Batangan"
                    summaryText={
                      `🪙 *Simulasi Investasi Emas Fisik*\n` +
                      `• Total Modal Beli Emas: ${formatIDR(emasTotalCostBuy)}\n` +
                      `• Total Hasil Buyback Bersih: ${formatIDR(emasNetReceived)}\n` +
                      `---------------------------------\n` +
                      `*Hasil Bersih (Net Profit): ${emasNetProfit >= 0 ? "+" : ""}${formatIDR(emasNetProfit)}*\n` +
                      `*ROI Bersih: ${emasNetProfit >= 0 ? "+" : ""}${emasRoi.toFixed(2)}%*`
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visual Bar Comparison of Buy vs Sell Net Value */}
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-4 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Visualisasi Perbandingan Transaksi
              </h4>

              {(() => {
                const buyNet = activeTab === "saham" ? sahamTotalCostBuy : (activeTab === "kripto" ? cryptoTotalCostBuy : emasTotalCostBuy);
                const sellNet = activeTab === "saham" ? sahamNetReceived : (activeTab === "kripto" ? cryptoNetReceived : emasNetReceived);
                const maxVal = Math.max(buyNet, sellNet, 1);
                const buyPct = ((buyNet / maxVal) * 100).toFixed(0);
                const sellPct = ((sellNet / maxVal) * 100).toFixed(0);

                return (
                  <div className="flex flex-col gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] p-4 rounded-xl border border-card-border">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        <span>Total Pengeluaran Beli (Modal Bersih)</span>
                        <span className="text-foreground">{formatIDR(buyNet)}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${buyPct}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        <span>Total Dana Diterima Bersih (Setelah Jual)</span>
                        <span className="text-foreground">{formatIDR(sellNet)}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${sellNet >= buyNet ? "bg-emerald-500" : "bg-rose-500"}`}
                          style={{ width: `${sellPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
