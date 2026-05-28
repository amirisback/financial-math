"use client";

import { useState } from "react";
import type { Dictionary } from "../../dictionaries";
import { Card, CardContent } from "../../_components/ui/card";

interface InvestmentCalculatorProps {
  dict: Dictionary;
}

export function InvestmentCalculator({ dict }: InvestmentCalculatorProps) {
  const [activeTab, setActiveTab] = useState<"saham" | "emas" | "sbn">("saham");

  // Tab Saham
  const [sahamLot, setSahamLot] = useState<number>(10);
  const [sahamPrice, setSahamPrice] = useState<number>(9000);
  const [sahamDps, setSahamDps] = useState<number>(350);
  const [sahamFeeBuy, setSahamFeeBuy] = useState<number>(0.15);
  const [sahamFeeSell, setSahamFeeSell] = useState<number>(0.25);
  const [sahamTaxToggle, setSahamTaxToggle] = useState<boolean>(false); // false = 0% reinvested, true = 10% cash out

  // Tab Emas
  const [emasGram, setEmasGram] = useState<number>(10);
  const [emasPriceBuy, setEmasPriceBuy] = useState<number>(950000);
  const [emasPriceBack, setEmasPriceBack] = useState<number>(1050000);

  // Tab SBN
  const [sbnNominal, setSbnNominal] = useState<number>(100000000);
  const [sbnRate, setSbnRate] = useState<number>(6.0);
  const [sbnType, setSbnType] = useState<"sbn" | "deposito">("sbn");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // 1. Saham Math
  const sahamTotalShares = sahamLot * 100;
  const sahamRawCost = sahamTotalShares * sahamPrice;
  const sahamFeeBuyAmount = sahamRawCost * (sahamFeeBuy / 100);
  const sahamTotalModal = sahamRawCost + sahamFeeBuyAmount;
  const sahamRawDividen = sahamTotalShares * sahamDps;
  const sahamPajakDividen = sahamTaxToggle ? sahamRawDividen * 0.10 : 0;
  const sahamNetDividen = sahamRawDividen - sahamPajakDividen;
  const sahamYield = sahamTotalModal > 0 ? (sahamNetDividen / sahamTotalModal) * 100 : 0;

  // 2. Emas Math
  const emasModal = emasGram * emasPriceBuy;
  const emasCurrentVal = emasGram * emasPriceBack;
  const emasProfit = emasCurrentVal - emasModal;
  const emasProfitPercent = emasModal > 0 ? (emasProfit / emasModal) * 100 : 0;

  // 3. SBN Math
  const sbnTaxRate = sbnType === "sbn" ? 0.10 : 0.20;
  const sbnGrossMonthly = (sbnNominal * (sbnRate / 100)) / 12;
  const sbnTaxMonthly = sbnGrossMonthly * sbnTaxRate;
  const sbnNetMonthly = sbnGrossMonthly - sbnTaxMonthly;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.investasi.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.investasi.description}
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex bg-black/[0.02] dark:bg-white/[0.04] p-1.5 rounded-2xl border border-card-border mb-8 max-w-lg">
        {[
          { id: "saham", label: dict.investasi.tabSaham },
          { id: "emas", label: dict.investasi.tabEmas },
          { id: "sbn", label: dict.investasi.tabSbn },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as "saham" | "emas" | "sbn")}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column inputs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {activeTab === "saham" && (
                <>
                  {/* Lot Saham */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="saham-lot" className="text-sm font-semibold text-foreground">
                        {dict.investasi.sahamLot}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {sahamLot} Lot
                      </span>
                    </div>
                    <input
                      id="saham-lot"
                      type="range"
                      min="1"
                      max="1000"
                      step="1"
                      value={sahamLot}
                      onChange={(e) => setSahamLot(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Harga Lembar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="saham-price" className="text-sm font-semibold text-foreground">
                        {dict.investasi.sahamPrice}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(sahamPrice)}
                      </span>
                    </div>
                    <input
                      id="saham-price"
                      type="range"
                      min="50"
                      max="150000"
                      step="50"
                      value={sahamPrice}
                      onChange={(e) => setSahamPrice(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* DPS Lembar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="saham-dps" className="text-sm font-semibold text-foreground">
                        {dict.investasi.sahamDps}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(sahamDps)}
                      </span>
                    </div>
                    <input
                      id="saham-dps"
                      type="range"
                      min="0"
                      max="5000"
                      step="5"
                      value={sahamDps}
                      onChange={(e) => setSahamDps(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Broker Fees */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fee-buy" className="text-xs font-semibold text-zinc-500">
                        {dict.investasi.sahamFeeBuy}
                      </label>
                      <input
                        id="fee-buy"
                        type="number"
                        step="0.01"
                        min="0"
                        max="2"
                        value={sahamFeeBuy}
                        onChange={(e) => setSahamFeeBuy(Math.max(0, Math.min(2, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fee-sell" className="text-xs font-semibold text-zinc-500">
                        {dict.investasi.sahamFeeSell}
                      </label>
                      <input
                        id="fee-sell"
                        type="number"
                        step="0.01"
                        min="0"
                        max="2"
                        value={sahamFeeSell}
                        onChange={(e) => setSahamFeeSell(Math.max(0, Math.min(2, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Dividen Tax Toggle */}
                  <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                    <label className="text-sm font-semibold text-foreground">
                      {dict.investasi.sahamTax}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSahamTaxToggle(false)}
                        className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          !sahamTaxToggle
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {dict.investasi.sahamTaxFree}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSahamTaxToggle(true)}
                        className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          sahamTaxToggle
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {dict.investasi.sahamTaxFull}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "emas" && (
                <>
                  {/* Gram Emas */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="emas-gram" className="text-sm font-semibold text-foreground">
                        {dict.investasi.emasGram}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {emasGram} Gram
                      </span>
                    </div>
                    <input
                      id="emas-gram"
                      type="range"
                      min="1"
                      max="1000"
                      step="1"
                      value={emasGram}
                      onChange={(e) => setEmasGram(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Harga Beli Gram */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="emas-price-buy" className="text-sm font-semibold text-foreground">
                        {dict.investasi.emasPriceBuy}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(emasPriceBuy)} / Gram
                      </span>
                    </div>
                    <input
                      id="emas-price-buy"
                      type="range"
                      min="500000"
                      max="2000000"
                      step="10000"
                      value={emasPriceBuy}
                      onChange={(e) => setEmasPriceBuy(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Harga Buyback */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="emas-price-back" className="text-sm font-semibold text-foreground">
                        {dict.investasi.emasPriceBack}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(emasPriceBack)} / Gram
                      </span>
                    </div>
                    <input
                      id="emas-price-back"
                      type="range"
                      min="500000"
                      max="2000000"
                      step="10000"
                      value={emasPriceBack}
                      onChange={(e) => setEmasPriceBack(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTab === "sbn" && (
                <>
                  {/* Nominal Investasi */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="sbn-nominal" className="text-sm font-semibold text-foreground">
                        {dict.investasi.sbnNominal}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {formatIDR(sbnNominal)}
                      </span>
                    </div>
                    <input
                      id="sbn-nominal"
                      type="range"
                      min="1000000"
                      max="1000000000"
                      step="5000000"
                      value={sbnNominal}
                      onChange={(e) => setSbnNominal(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Kupon Bunga */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="sbn-rate" className="text-sm font-semibold text-foreground">
                        {dict.investasi.sbnRate}
                      </label>
                      <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {sbnRate}%
                      </span>
                    </div>
                    <input
                      id="sbn-rate"
                      type="range"
                      min="1"
                      max="15"
                      step="0.1"
                      value={sbnRate}
                      onChange={(e) => setSbnRate(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* SBN vs Deposito Type */}
                  <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                    <label className="text-sm font-semibold text-foreground">
                      {dict.investasi.sbnType}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSbnType("sbn")}
                        className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          sbnType === "sbn"
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {dict.investasi.sbnSbn}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSbnType("deposito")}
                        className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          sbnType === "deposito"
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {dict.investasi.sbnDepo}
                      </button>
                    </div>
                  </div>
                </>
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
                <li>{dict.investasi.dos1}</li>
                <li>{dict.investasi.dos2}</li>
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
                <li>{dict.investasi.donts1}</li>
                <li>{dict.investasi.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column results */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow">
            <CardContent className="flex flex-col gap-6 pt-6">
              {activeTab === "saham" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-card-border/50 pb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5 text-indigo-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                      />
                    </svg>
                    Kalkulasi Dividen Saham
                  </h3>

                  <div className="flex flex-col gap-1 items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {dict.investasi.sahamYield}
                    </span>
                    <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight py-1">
                      {sahamYield.toFixed(2)}% <span className="text-xs font-normal">/ tahun</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.investasi.sahamModal}</span>
                      <span className="text-sm font-bold">{formatIDR(sahamTotalModal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">Broker Fee Beli</span>
                      <span className="text-xs font-medium text-rose-500">+{formatIDR(sahamFeeBuyAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.investasi.sahamDivClean}</span>
                      <span className="text-sm font-bold text-emerald-500">{formatIDR(sahamNetDividen)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-zinc-500">Potongan Pajak Dividen</span>
                      <span className="text-xs font-medium text-rose-500">{formatIDR(sahamPajakDividen)}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "emas" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-card-border/50 pb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5 text-indigo-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                    Kalkulasi Profit Emas Fisik
                  </h3>

                  <div className="flex flex-col gap-1 items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {dict.investasi.emasProfit}
                    </span>
                    <span className={`text-3xl font-extrabold tracking-tight py-1 ${emasProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {emasProfit >= 0 ? "+" : ""}{emasProfitPercent.toFixed(2)}%
                    </span>
                    <span className={`text-base font-bold ${emasProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatIDR(emasProfit)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.investasi.emasModal}</span>
                      <span className="text-sm font-semibold">{formatIDR(emasModal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-zinc-500">{dict.investasi.emasCurrentVal}</span>
                      <span className="text-sm font-semibold">{formatIDR(emasCurrentVal)}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "sbn" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 border-b border-card-border/50 pb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5 text-indigo-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007v.008H3.75V4.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3 13.25m-2.25 0a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z"
                      />
                    </svg>
                    Kupon SBN & Deposito Bulanan
                  </h3>

                  <div className="flex flex-col gap-1 items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {dict.investasi.sbnNet}
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight py-1 animate-fade-in">
                      {formatIDR(sbnNetMonthly)} <span className="text-xs font-normal">/ bln</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.investasi.sbnGross}</span>
                      <span className="text-sm font-semibold">{formatIDR(sbnGrossMonthly)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">
                        {dict.investasi.sbnTaxPotongan} ({sbnTaxRate * 100}%)
                      </span>
                      <span className="text-xs font-semibold text-rose-500">-{formatIDR(sbnTaxMonthly)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-zinc-500">Skema Pajak</span>
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {sbnType === "sbn" ? "PPh SBN 10%" : "PPh Deposito 20%"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
