"use client";

import { useState } from "react";
import type { Dictionary } from "../../dictionaries";
import { Card, CardContent } from "../../_components/ui/card";

interface CarCalculatorProps {
  dict: Dictionary;
}

export function CarCalculator({ dict }: CarCalculatorProps) {
  // State variables for inputs
  const [condition, setCondition] = useState<"new" | "used">("new");
  const [price, setPrice] = useState<number>(300000000); // 300 Million IDR
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("credit");
  
  // Credit details
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(5.5); // Flat per year
  const [tenor, setTenor] = useState<number>(3); // 1 - 5 years
  const [creditScheme, setCreditScheme] = useState<"addm" | "addb">("addm");
  
  // Tax / Region / Insurance details
  const [region, setRegion] = useState<"dki" | "jabar" | "other">("dki");
  const [insuranceType, setInsuranceType] = useState<"none" | "tlo" | "allRisk">("allRisk");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // 1. Calculate Taxes and Legal Fees
  // BBN-KB (Bea Balik Nama Kendaraan Bermotor)
  // For new cars: DKI is 12.5%, Jabar is 10%, others generally 10%
  // For used cars: generally 1% of OTR / NJKB
  const bbnRate = condition === "new" 
    ? (region === "dki" ? 0.125 : 0.10) 
    : 0.01;
  const bbnKb = bbnRate * price;

  // PKB (Pajak Kendaraan Bermotor) - roughly 2% of OTR / NJKB
  const pkb = 0.02 * price;

  // POLRI Official Admin Fees for STNK & Plates & BPKB
  // New: STNK 200k, TNKB 100k
  // Used (Balik Nama package): STNK 200k, TNKB 100k, BPKB book 375k = 675k
  const polriFees = condition === "new" ? 300000 : 675000;

  // Total Legal Registration Cost
  const totalRegistrationFees = bbnKb + pkb + polriFees;

  // 2. Insurance Calculation
  // TLO is ~1% per year; All Risk is ~2.5% per year
  const insuranceAnnualRate = insuranceType === "none" ? 0 : (insuranceType === "tlo" ? 0.01 : 0.025);
  const insuranceFee = insuranceAnnualRate * price * tenor;

  // 3. Credit Calculations
  const dpAmount = (dpPercent / 100) * price;
  const plafon = price - dpAmount;

  // Flat credit calculation
  const totalInterest = plafon * (interestRate / 100) * tenor;
  const totalLoan = plafon + totalInterest;
  const monthlyInstallment = totalLoan / (tenor * 12);

  // Admin Fee for credit (usually tiered by tenor, e.g. 2M to 3M)
  const creditAdminFee = 2000000 + (tenor * 250000);

  // TDP (Total Down Payment / Upfront Cash for Credit)
  // ADDM (Angsuran Dibayar Di Muka): DP + Credit Admin + Total Insurance + 1st Month Installment
  // ADDB (Angsuran Dibayar Di Belakang): DP + Credit Admin + Total Insurance (No 1st installment)
  const tdp = creditScheme === "addm"
    ? dpAmount + creditAdminFee + insuranceFee + monthlyInstallment
    : dpAmount + creditAdminFee + insuranceFee;

  // Recommended income (repayment maximum 33% of income)
  const minIncome = monthlyInstallment * 3;

  // 4. Cash Purchase Total Outlay
  // Cash Total = OTR Price + Taxes/Fees + Insurance (if opted)
  const cashTotal = price + totalRegistrationFees + insuranceFee;

  // 5. Depreciation & Resale Value Simulation
  // New car: 18% drop year 1 (shock drop), then 10% drop annually
  // Used car: 7% drop annually (slower depreciation)
  const years = Array.from({ length: Math.max(5, tenor + 2) }, (_, i) => i + 1);
  const resaleValues = years.map((yr) => {
    let currentVal = price;
    for (let y = 1; y <= yr; y++) {
      if (condition === "new") {
        if (y === 1) {
          currentVal *= 0.82; // 18% shock drop
        } else {
          currentVal *= 0.90; // 10% annual drop
        }
      } else {
        currentVal *= 0.93; // 7% annual drop
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
          {dict.mobil.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.mobil.description}
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
                  {dict.mobil.condition}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/[0.02] dark:bg-white/[0.04] p-1 rounded-xl border border-card-border">
                  <button
                    type="button"
                    onClick={() => {
                      setCondition("new");
                      // Adjust price default for new car
                      if (price < 50000000) setPrice(250000000);
                    }}
                    className={`rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      condition === "new"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {dict.mobil.condNew}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition("used")}
                    className={`rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      condition === "used"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {dict.mobil.condUsed}
                  </button>
                </div>
              </div>

              {/* OTR Price Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="price-input" className="text-sm font-semibold text-foreground">
                    {dict.mobil.price}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(price)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="price-input"
                    type="range"
                    min={condition === "new" ? "100000000" : "30000000"}
                    max="3000000000"
                    step="10000000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min={condition === "new" ? "100000000" : "30000000"}
                    max="3000000000"
                    step="5000000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full sm:w-36 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Payment Type Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.mobil.paymentType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType("cash")}
                    className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      paymentType === "cash"
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                    }`}
                  >
                    {dict.mobil.payCash}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("credit")}
                    className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      paymentType === "credit"
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                    }`}
                  >
                    {dict.mobil.payCredit}
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
                        {dict.mobil.dpPercent}
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
                        className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                      />
                      <input
                        type="number"
                        min="10"
                        max="90"
                        value={dpPercent}
                        onChange={(e) => setDpPercent(Math.max(10, Math.min(90, Number(e.target.value))))}
                        className="w-full sm:w-20 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Interest rate & Tenor */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="interest-input" className="text-xs font-semibold text-zinc-500">
                        {dict.mobil.interest}
                      </label>
                      <input
                        id="interest-input"
                        type="number"
                        step="0.1"
                        min="1"
                        max="20"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Math.max(1, Math.min(20, Number(e.target.value))))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="tenor-input" className="text-xs font-semibold text-zinc-500">
                        {dict.mobil.tenor}
                      </label>
                      <select
                        id="tenor-input"
                        value={tenor}
                        onChange={(e) => setTenor(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((t) => (
                          <option key={t} value={t} className="bg-background">
                            {t} {t === 1 ? "Year" : "Years"} / {t * 12} Bln
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="scheme-input" className="text-xs font-semibold text-zinc-500">
                        {dict.mobil.creditScheme}
                      </label>
                      <select
                        id="scheme-input"
                        value={creditScheme}
                        onChange={(e) => setCreditScheme(e.target.value as "addm" | "addb")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="addm" className="bg-background">ADDM</option>
                        <option value="addb" className="bg-background">ADDB</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Region and Insurance Option */}
              <div className="grid gap-4 sm:grid-cols-2 border-t border-card-border/50 pt-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="region-input" className="text-sm font-semibold text-foreground">
                    {dict.mobil.region}
                  </label>
                  <select
                    id="region-input"
                    value={region}
                    onChange={(e) => setRegion(e.target.value as "dki" | "jabar" | "other")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="dki" className="bg-background">{dict.mobil.regDKI}</option>
                    <option value="jabar" className="bg-background">{dict.mobil.regJabar}</option>
                    <option value="other" className="bg-background">{dict.mobil.regOther}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="insurance-input" className="text-sm font-semibold text-foreground">
                    {dict.mobil.insurance}
                  </label>
                  <select
                    id="insurance-input"
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value as "none" | "tlo" | "allRisk")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="none" className="bg-background">{dict.mobil.insNone}</option>
                    <option value="tlo" className="bg-background">{dict.mobil.insTlo}</option>
                    <option value="allRisk" className="bg-background">{dict.mobil.insAllRisk}</option>
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
                <li>{dict.mobil.dos1}</li>
                <li>{dict.mobil.dos2}</li>
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
                <li>{dict.mobil.donts1}</li>
                <li>{dict.mobil.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden">
            <div className="p-5 border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
              <h3 className="text-base font-bold text-foreground">
                {dict.mobil.summary}
              </h3>
            </div>

            <CardContent className="flex flex-col gap-5 pt-6">
              {/* Financial Breakdowns */}
              <div className="flex flex-col gap-2.5">
                {/* OTR Price */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{dict.mobil.price}</span>
                  <span className="font-semibold text-foreground">{formatIDR(price)}</span>
                </div>

                {/* Taxes Breakdown */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 flex flex-col">
                    <span>{dict.mobil.bbnKb}</span>
                    <span className="text-[9px] text-zinc-400">{dict.mobil.bbnKbDesc}</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatIDR(bbnKb)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 flex flex-col">
                    <span>{dict.mobil.pkb}</span>
                    <span className="text-[9px] text-zinc-400">{dict.mobil.pkbDesc}</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatIDR(pkb)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 flex flex-col">
                    <span>{dict.mobil.admTNKB}</span>
                    <span className="text-[9px] text-zinc-400">{dict.mobil.admTNKBDesc}</span>
                  </span>
                  <span className="font-semibold text-foreground">{formatIDR(polriFees)}</span>
                </div>

                {insuranceType !== "none" && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{dict.mobil.insuranceFee}</span>
                    <span className="font-semibold text-foreground">{formatIDR(insuranceFee)}</span>
                  </div>
                )}

                {/* Cash vs Credit Layout */}
                {paymentType === "cash" ? (
                  /* CASH PURCHASE TOTAL */
                  <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{dict.mobil.cashTotal}</span>
                      <span className="text-[9px] text-zinc-400">{dict.mobil.cashTotalDesc}</span>
                    </div>
                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(cashTotal)}</span>
                  </div>
                ) : (
                  /* CREDIT SIMULATION RESULTS */
                  <div className="flex flex-col gap-2.5 border-t border-dashed border-card-border/50 pt-4 mt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.mobil.plafon}</span>
                      <span className="font-semibold text-foreground">{formatIDR(plafon)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Total Bunga ({interestRate}% x {tenor} Thn)</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Biaya Admin Kredit KKB</span>
                      <span className="font-semibold text-foreground">{formatIDR(creditAdminFee)}</span>
                    </div>
                    
                    {/* Monthly Repayment */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/[0.03] dark:bg-white/[0.02] border border-card-border my-1.5">
                      <span className="text-xs font-bold text-foreground">{dict.mobil.monthlyInstallment}</span>
                      <span className="text-sm font-extrabold text-indigo-500">{formatIDR(monthlyInstallment)} / bln</span>
                    </div>

                    {/* Minimum salary recommended */}
                    <div className="flex justify-between items-center text-xs px-1 mb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-semibold">{dict.mobil.minIncome}</span>
                        <span className="text-[8px] text-zinc-400">{dict.mobil.minIncomeDesc}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-500 bg-amber-500/5 px-2.5 py-0.5 rounded border border-amber-500/10">
                        {formatIDR(minIncome)} / bln
                      </span>
                    </div>

                    {/* Total TDP Upfront */}
                    <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{dict.mobil.tdp}</span>
                        <span className="text-[9px] text-zinc-400">{dict.mobil.tdpDesc}</span>
                      </div>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(tdp)}</span>
                    </div>
                  </div>
                )}
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
                <span>{dict.mobil.depSection}</span>
              </h4>

              {/* Resale Value bars */}
              <div className="flex flex-col gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] p-4 rounded-xl border border-card-border">
                {years.slice(0, 5).map((yr, idx) => {
                  const val = resaleValues[idx];
                  const pct = ((val / price) * 100).toFixed(0);
                  return (
                    <div key={yr} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>{dict.mobil.depYear.replace("{year}", String(yr))}</span>
                        <span className="text-foreground">{formatIDR(val)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
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
                <span className="text-xs font-bold text-rose-500">{dict.mobil.comfortFee}</span>
                <span className="text-[10px] text-zinc-400 -mt-0.5">{dict.mobil.tdpDesc.split("(")[0]}</span>
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
                {dict.mobil.eduTitle}
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                <p>{dict.mobil.edu1}</p>
                <p>{dict.mobil.edu2}</p>
                <p>{dict.mobil.edu3}</p>
                <p>{dict.mobil.edu4}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
