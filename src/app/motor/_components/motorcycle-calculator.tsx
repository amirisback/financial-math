"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";

interface MotorcycleCalculatorProps {
  dict: Dictionary;
}

export function MotorcycleCalculator({ dict }: MotorcycleCalculatorProps) {
  // State variables for inputs
  const [condition, setCondition] = useState<"new" | "used">("new");
  const [price, setPrice] = useState<number>(25000000); // 25 Million IDR default
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("credit");
  
  // Credit details
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(12.0); // Flat per year (generally higher for motorcycles)
  const [tenor, setTenor] = useState<number>(2); // 1 - 3 years
  const [creditScheme, setCreditScheme] = useState<"addm" | "addb">("addb"); // Motorcycles usually use ADDB
  
  // Tax / Region / Insurance details
  const [region, setRegion] = useState<"dki" | "jabar" | "other">("dki");
  const [insuranceType, setInsuranceType] = useState<"none" | "tlo">("tlo");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // 1. Calculate Taxes and Legal Fees
  // BBN-KB for new motor: DKI is 12.5%, Jabar is 10%, others 10%
  // For used motor: generally 1% of NJKB
  const bbnRate = condition === "new" 
    ? (region === "dki" ? 0.125 : 0.10) 
    : 0.01;
  const bbnKb = bbnRate * price;

  // PKB (Pajak Kendaraan Bermotor) - roughly 2% of OTR / NJKB
  const pkb = 0.02 * price;

  // POLRI Official Admin Fees for STNK & Plates & BPKB (Motorcycle rates are lower)
  // New: STNK 100k, TNKB plate 60k = 160k
  // Used (Balik Nama package): STNK 100k, TNKB 60k, BPKB book 225k = 385k
  const polriFees = condition === "new" ? 160000 : 385000;

  // Total Legal Registration Cost
  const totalRegistrationFees = bbnKb + pkb + polriFees;

  // 2. Insurance Calculation
  // TLO is ~1.8% per year for motorcycles
  const insuranceAnnualRate = insuranceType === "none" ? 0 : 0.018;
  const insuranceFee = insuranceAnnualRate * price * tenor;

  // 3. Credit Calculations
  const dpAmount = (dpPercent / 100) * price;
  const plafon = price - dpAmount;

  // Flat credit calculation
  const totalInterest = plafon * (interestRate / 100) * tenor;
  const totalLoan = plafon + totalInterest;
  const monthlyInstallment = totalLoan / (tenor * 12);

  // Admin Fee for credit (usually around 800k to 1.5M for motorcycles)
  const creditAdminFee = 700000 + (tenor * 200000);

  // TDP (Total Down Payment / Upfront Cash for Credit)
  const tdp = creditScheme === "addm"
    ? dpAmount + creditAdminFee + insuranceFee + monthlyInstallment
    : dpAmount + creditAdminFee + insuranceFee;

  // Recommended income (repayment maximum 33% of income)
  const minIncome = monthlyInstallment * 3;

  // 4. Cash Purchase Total Outlay
  const cashTotal = price + totalRegistrationFees + insuranceFee;

  // 5. Depreciation & Resale Value Simulation
  // New motor: 20% drop year 1 (shock drop), then 10% drop annually
  // Used motor: 8% drop annually
  const years = Array.from({ length: 4 }, (_, i) => i + 1);
  const resaleValues = years.map((yr) => {
    let currentVal = price;
    for (let y = 1; y <= yr; y++) {
      if (condition === "new") {
        if (y === 1) {
          currentVal *= 0.80; // 20% shock drop
        } else {
          currentVal *= 0.90; // 10% annual drop
        }
      } else {
        currentVal *= 0.92; // 8% annual drop
      }
    }
    return Math.round(currentVal);
  });

  // Average monthly comfort fee (depreciation cost over tenor)
  const finalResaleAfterTenor = resaleValues[tenor - 1] || resaleValues[resaleValues.length - 1];
  const totalDepreciation = price - finalResaleAfterTenor;
  const comfortFeeMonthly = totalDepreciation / (tenor * 12);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.motor.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.motor.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (Inputs) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Condition Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.motor.condition}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/[0.02] dark:bg-white/[0.04] p-1.5 rounded-xl border border-card-border">
                  <button
                    type="button"
                    onClick={() => {
                      setCondition("new");
                      if (price < 10000000) setPrice(25000000);
                    }}
                    className={`rounded-lg py-2.5 px-3 text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                      condition === "new"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {dict.motor.condNew}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition("used")}
                    className={`rounded-lg py-2.5 px-3 text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                      condition === "used"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {dict.motor.condUsed}
                  </button>
                </div>
              </div>

              {/* OTR Price Input with CurrencyInput */}
              <CurrencyInput
                id="price-input"
                label={dict.motor.price}
                value={price}
                onChange={setPrice}
                min={condition === "new" ? 15000000 : 5000000}
                max={250000000}
                step={500000}
                presets={[
                  { label: "+5 Jt", value: 5000000, isAdd: true },
                  { label: "+10 Jt", value: 10000000, isAdd: true },
                  { label: "20 Jt", value: 20000000 },
                  { label: "35 Jt", value: 35000000 },
                  { label: "60 Jt", value: 60000000 },
                ]}
                tooltipText="Harga On The Road (OTR) resmi atau kesepakatan motor bekas."
              />

              {/* Payment Type Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.motor.paymentType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType("cash")}
                    className={`rounded-xl py-2.5 px-3 text-sm font-semibold border transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                      paymentType === "cash"
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {dict.motor.payCash}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("credit")}
                    className={`rounded-xl py-2.5 px-3 text-sm font-semibold border transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                      paymentType === "credit"
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {dict.motor.payCredit}
                  </button>
                </div>
              </div>

              {/* Credit Details */}
              {paymentType === "credit" && (
                <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4">
                  {/* DP percentage */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="dp-input" className="text-sm font-semibold text-foreground">
                        {dict.motor.dpPercent}
                      </label>
                      <span className="text-sm font-bold text-primary">
                        {dpPercent}% ({formatIDR(dpAmount)})
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        id="dp-input"
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={dpPercent}
                        onChange={(e) => setDpPercent(Number(e.target.value))}
                        className="flex-1 h-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="10"
                        max="90"
                        value={dpPercent}
                        onChange={(e) => setDpPercent(Math.max(10, Math.min(90, Number(e.target.value))))}
                        className="w-full sm:w-24 px-3 py-2 text-center text-sm font-semibold rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[44px]"
                      />
                    </div>
                    {/* DP Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mr-1">Preset DP:</span>
                      {[15, 20, 25, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDpPercent(pct)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer min-h-[36px] ${
                            dpPercent === pct
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-black/[0.02] dark:bg-white/[0.04] border-card-border text-zinc-700 dark:text-zinc-300 hover:border-primary/50"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interest rate & Tenor */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="interest-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {dict.motor.interest}
                      </label>
                      <input
                        id="interest-input"
                        type="number"
                        step="0.5"
                        min="5"
                        max="35"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Math.max(5, Math.min(35, Number(e.target.value))))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary min-h-[44px]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="tenor-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {dict.motor.tenor}
                      </label>
                      <select
                        id="tenor-input"
                        value={tenor}
                        onChange={(e) => setTenor(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer min-h-[44px]"
                      >
                        {[1, 2, 3].map((t) => (
                          <option key={t} value={t} className="bg-background">
                            {t} {t === 1 ? "Tahun" : "Tahun"} / {t * 12} Bln
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="scheme-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {dict.motor.creditScheme}
                      </label>
                      <select
                        id="scheme-input"
                        value={creditScheme}
                        onChange={(e) => setCreditScheme(e.target.value as "addm" | "addb")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer min-h-[44px]"
                      >
                        <option value="addb" className="bg-background">ADDB (Angsuran Belakang)</option>
                        <option value="addm" className="bg-background">ADDM (Angsuran Dimuka)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Region and Insurance Option */}
              <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="region-input" className="text-sm font-semibold text-foreground">
                    {dict.motor.region}
                  </label>
                  <select
                    id="region-input"
                    value={region}
                    onChange={(e) => setRegion(e.target.value as "dki" | "jabar" | "other")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer min-h-[44px]"
                  >
                    <option value="dki" className="bg-background">{dict.motor.regDKI}</option>
                    <option value="jabar" className="bg-background">{dict.motor.regJabar}</option>
                    <option value="other" className="bg-background">{dict.motor.regOther}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="insurance-input" className="text-sm font-semibold text-foreground">
                    {dict.motor.insurance}
                  </label>
                  <select
                    id="insurance-input"
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value as "none" | "tlo")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer min-h-[44px]"
                  >
                    <option value="none" className="bg-background">{dict.motor.insNone}</option>
                    <option value="tlo" className="bg-background">{dict.motor.insTlo}</option>
                  </select>
                </div>
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
                <li>{dict.motor.dos1}</li>
                <li>{dict.motor.dos2}</li>
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
                <li>{dict.motor.donts1}</li>
                <li>{dict.motor.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden">
            <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
              <h3 className="text-base font-bold text-foreground">
                {dict.motor.summary}
              </h3>
            </div>

            <CardContent className="flex flex-col gap-5 pt-6">
              {/* Financial Breakdowns */}
              <div className="flex flex-col gap-3">
                {/* OTR Price */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">{dict.motor.price}</span>
                  <span className="font-semibold text-foreground">{formatIDR(price)}</span>
                </div>

                {/* Taxes Breakdown */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 flex flex-col">
                    <span className="font-medium text-foreground">{dict.motor.bbnKb}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.motor.bbnKbDesc}</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatIDR(bbnKb)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 flex flex-col">
                    <span className="font-medium text-foreground">{dict.motor.pkb}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.motor.pkbDesc}</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatIDR(pkb)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 flex flex-col">
                    <span className="font-medium text-foreground">{dict.motor.admTNKB}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.motor.admTNKBDesc}</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatIDR(polriFees)}</span>
                </div>

                {insuranceType !== "none" && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">{dict.motor.insuranceFee}</span>
                    <span className="font-semibold text-foreground">{formatIDR(insuranceFee)}</span>
                  </div>
                )}

                {/* Cash vs Credit Layout */}
                {paymentType === "cash" ? (
                  /* CASH PURCHASE TOTAL */
                  <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{dict.motor.cashTotal}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.motor.cashTotalDesc}</span>
                    </div>
                    <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(cashTotal)}</span>
                  </div>
                ) : (
                  /* CREDIT SIMULATION RESULTS */
                  <div className="flex flex-col gap-3 border-t border-dashed border-card-border/50 pt-4 mt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">{dict.motor.plafon}</span>
                      <span className="font-semibold text-foreground">{formatIDR(plafon)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Total Bunga ({interestRate}% x {tenor} Thn)</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Biaya Admin Pembiayaan</span>
                      <span className="font-semibold text-foreground">{formatIDR(creditAdminFee)}</span>
                    </div>
                    
                    {/* Monthly Repayment */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-indigo-500/[0.04] dark:bg-white/[0.03] border border-card-border my-1.5">
                      <span className="text-sm font-bold text-foreground">{dict.motor.monthlyInstallment}</span>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(monthlyInstallment)} / bln</span>
                    </div>

                    {/* Minimum salary recommended */}
                    <div className="flex justify-between items-center text-xs px-1 mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">{dict.motor.minIncome}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.motor.minIncomeDesc}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                        {formatIDR(minIncome)} / bln
                      </span>
                    </div>

                    {/* Total TDP Upfront */}
                    <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{dict.motor.tdp}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.motor.tdpDesc}</span>
                      </div>
                      <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(tdp)}</span>
                    </div>
                  </div>
                )}

                {/* Share Summary Button */}
                <div className="pt-2">
                  <ShareSummaryButton
                    title={`Simulasi Motor ${condition === "new" ? "Baru" : "Bekas"}`}
                    summaryText={
                      paymentType === "cash"
                        ? `🛵 *Simulasi Pembelian Motor (${condition === "new" ? "Motor Baru" : "Motor Bekas"})*\n` +
                          `• Harga OTR: ${formatIDR(price)}\n` +
                          `• BBN-KB: ${formatIDR(bbnKb)}\n` +
                          `• PKB: ${formatIDR(pkb)}\n` +
                          `• STNK & Plat POLRI: ${formatIDR(polriFees)}\n` +
                          (insuranceType !== "none" ? `• Asuransi TLO: ${formatIDR(insuranceFee)}\n` : "") +
                          `---------------------------------\n` +
                          `*Total Pengeluaran Tunai: ${formatIDR(cashTotal)}*`
                        : `🛵 *Simulasi Kredit Motor (${condition === "new" ? "Motor Baru" : "Motor Bekas"})*\n` +
                          `• Harga OTR: ${formatIDR(price)}\n` +
                          `• Uang Muka (DP ${dpPercent}%): ${formatIDR(dpAmount)}\n` +
                          `• Plafon Pembiayaan: ${formatIDR(plafon)}\n` +
                          `• Bunga Kredit: ${interestRate}% / thn (Tenor ${tenor} thn)\n` +
                          `• Skema: ${creditScheme.toUpperCase()}\n` +
                          `---------------------------------\n` +
                          `*Cicilan Bulanan: ${formatIDR(monthlyInstallment)} / bln*\n` +
                          `*Total Bayar Pertama (TDP): ${formatIDR(tdp)}*\n` +
                          `*Rekomendasi Gaji Minimum: ${formatIDR(minIncome)} / bln*`
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resale Value & Depreciation Simulation */}
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-4 pt-6">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-card-border/50 pb-2">
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
                    d="M2.25 6L9 12.75l4.286-4.286L21.75 15"
                  />
                </svg>
                <span>{dict.motor.depSection}</span>
              </h4>

              {/* Resale Value bars */}
              <div className="flex flex-col gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] p-4 rounded-xl border border-card-border">
                {years.map((yr, idx) => {
                  const val = resaleValues[idx];
                  const pct = ((val / price) * 100).toFixed(0);
                  return (
                    <div key={yr} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        <span>{dict.motor.depYear.replace("{year}", String(yr))}</span>
                        <span className="text-foreground">{formatIDR(val)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comfort Fee */}
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] flex flex-col gap-1">
                <span className="text-xs font-bold text-rose-500">{dict.motor.comfortFee}</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 -mt-0.5">{dict.motor.tdpDesc.split("(")[0]}</span>
                <span className="text-lg font-extrabold text-rose-500 mt-1">{formatIDR(comfortFeeMonthly)} <span className="text-xs font-normal text-zinc-400">/ bln</span></span>
              </div>
            </CardContent>
          </Card>

          {/* Education guidelines */}
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-4 pt-6">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
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
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                {dict.motor.eduTitle}
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                <p>{dict.motor.edu1}</p>
                <p>{dict.motor.edu2}</p>
                <p>{dict.motor.edu3}</p>
                <p>{dict.motor.edu4}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
