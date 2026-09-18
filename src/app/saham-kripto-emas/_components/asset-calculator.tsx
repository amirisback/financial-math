"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";

interface AssetCalculatorProps {
  dict: Dictionary;
}

type TabType = "saham" | "kripto" | "emas";

export function AssetCalculator({ dict }: AssetCalculatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("saham");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // State Variables for Stock Tab
  const [sahamPriceBuy, setSahamPriceBuy] = useState<number>(5000); // price per share
  const [sahamPriceSell, setSahamPriceSell] = useState<number>(5500); // price per share
  const [sahamLots, setSahamLots] = useState<number>(10);
  const [sahamFeeBuy, setSahamFeeBuy] = useState<number>(0.15); // broker fee %
  const [sahamFeeSell, setSahamFeeSell] = useState<number>(0.25); // broker fee %

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
  // P_sell = sahamTotalCostBuy / (sharesCount * (1 - (sahamFeeSell / 100) * 1.11 - 0.001))
  const sahamRateSellMultiplier = 1 - (sahamFeeSell / 100) * 1.11 - 0.001;
  const sahamBepPrice = sahamRateSellMultiplier > 0
    ? sahamTotalCostBuy / (sahamSharesCount * sahamRateSellMultiplier)
    : 0;

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
                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                  {/* Share Buy Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="saham-buy-price" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.sahamPriceBuy}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(sahamPriceBuy)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="saham-buy-price"
                        type="range"
                        min="50"
                        max="200000"
                        step="50"
                        value={sahamPriceBuy}
                        onChange={(e) => setSahamPriceBuy(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="50"
                        max="200000"
                        step="50"
                        value={sahamPriceBuy}
                        onChange={(e) => setSahamPriceBuy(Number(e.target.value))}
                        className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Share Sell Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="saham-sell-price" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.sahamPriceSell}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(sahamPriceSell)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="saham-sell-price"
                        type="range"
                        min="50"
                        max="200000"
                        step="50"
                        value={sahamPriceSell}
                        onChange={(e) => setSahamPriceSell(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="50"
                        max="200000"
                        step="50"
                        value={sahamPriceSell}
                        onChange={(e) => setSahamPriceSell(Number(e.target.value))}
                        className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Lots Input */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="saham-lots" className="text-sm font-semibold text-foreground">
                        {dict.sahamKriptoEmas.sahamLots}
                      </label>
                      <span className="text-sm font-bold text-zinc-500">
                        {sahamLots} Lot ({sahamSharesCount} {dict.sahamKriptoEmas.sahamLots.includes("Shares") ? "Shares" : "Lembar"})
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="saham-lots"
                        type="range"
                        min="1"
                        max="2000"
                        step="1"
                        value={sahamLots}
                        onChange={(e) => setSahamLots(Number(e.target.value))}
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={sahamLots}
                        onChange={(e) => setSahamLots(Math.max(1, Number(e.target.value)))}
                        className="w-full sm:w-24 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Broker Fees */}
                  <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="saham-fee-buy" className="text-xs font-semibold text-zinc-500">
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
                        className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="saham-fee-sell" className="text-xs font-semibold text-zinc-500">
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
                        className="w-full px-3.5 py-2 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>
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
                      <span className="text-[9px] text-zinc-400">{dict.sahamKriptoEmas.sahamRoi}</span>
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
                  <span className="text-[10px] text-zinc-400 -mt-0.5">Harga saham per lembar agar transaksi impas (setelah semua fee & pajak)</span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{formatIDR(sahamBepPrice)}</span>
                </div>
              </CardContent>
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
                    <span className="text-zinc-500">Nilai Pembelian Awal</span>
                    <span className="font-semibold text-foreground">{formatIDR(cryptoBuyValGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Fee Beli Exchange ({cryptoFeeBuy}%)</span>
                    <span className="font-semibold text-rose-500">+{formatIDR(cryptoFeeBuyAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Pajak PPh & PPN PMK 68 ({cryptoTaxRate * 100}%)</span>
                    <span className="font-semibold text-rose-500">+{formatIDR(cryptoBuyTaxAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.cryptoTotalSpendBuy}</span>
                    <span className="text-sm font-extrabold text-foreground">{formatIDR(cryptoTotalCostBuy)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4 mt-1">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Hasil Penjualan</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Nilai Penjualan Kotor</span>
                    <span className="font-semibold text-foreground">{formatIDR(cryptoSellValGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Fee Jual Exchange ({cryptoFeeSell}%)</span>
                    <span className="font-semibold text-rose-500">-{formatIDR(cryptoFeeSellAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Pajak PPh & PPN PMK 68 ({cryptoTaxRate * 100}%)</span>
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
                      <span className="text-[9px] text-zinc-400">{dict.sahamKriptoEmas.sahamRoi}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-base font-extrabold">{cryptoNetProfit >= 0 ? "+" : ""}{formatIDR(cryptoNetProfit)}</span>
                      <span className="text-xs font-bold">{cryptoNetProfit >= 0 ? "+" : ""}{cryptoRoi.toFixed(2)}%</span>
                    </div>
                  </div>
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
                    <span className="text-zinc-500">Harga Emas Batangan</span>
                    <span className="font-semibold text-foreground">{formatIDR(emasBuyValGross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 flex flex-col">
                      <span>{dict.sahamKriptoEmas.emasBuyTax}</span>
                      <span className="text-[9px] text-zinc-400">{dict.sahamKriptoEmas.emasBuyTaxDesc}</span>
                    </span>
                    <span className="font-semibold text-rose-500">+{formatIDR(emasBuyTaxAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.sahamKriptoEmas.emasTotalSpendBuy}</span>
                    <span className="text-sm font-extrabold text-foreground">{formatIDR(emasTotalCostBuy)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 border-t border-card-border/50 pt-4 mt-1">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Hasil Penjualan Kembali (Buyback)</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Harga Buyback Rata-rata</span>
                    <span className="font-semibold text-foreground">{formatIDR(emasSellValGross)}</span>
                  </div>
                  {emasSellTaxAmount > 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 flex flex-col">
                        <span>{dict.sahamKriptoEmas.emasSellTax}</span>
                        <span className="text-[9px] text-zinc-400">{dict.sahamKriptoEmas.emasSellTaxDesc}</span>
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
                      <span className="text-[9px] text-zinc-400">{dict.sahamKriptoEmas.sahamRoi}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-base font-extrabold">{emasNetProfit >= 0 ? "+" : ""}{formatIDR(emasNetProfit)}</span>
                      <span className="text-xs font-bold">{emasNetProfit >= 0 ? "+" : ""}{emasRoi.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visual Bar Comparison of Buy vs Sell Net Value */}
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-4 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
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
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>Total Pengeluaran Beli (Modal Bersih)</span>
                        <span className="text-foreground">{formatIDR(buyNet)}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${buyPct}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>Total Dana Diterima Bersih (Setelah Jual)</span>
                        <span className="text-foreground">{formatIDR(sellNet)}</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
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
