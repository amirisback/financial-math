"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";

interface LandCalculatorProps {
  dict: Dictionary;
}

export function LandCalculator({ dict }: LandCalculatorProps) {
  // Skenario default riil: Luas = 100 m²; Harga = Rp3.000.000/m² (Total Rp300.000.000); NJOP = Rp2.000.000/m²; NPTKP = Rp60.000.000; Status = Tunai.
  const [inputMethod, setInputMethod] = useState<"area" | "total">("area");
  const [area, setArea] = useState<number>(100);
  const [pricePerM2, setPricePerM2] = useState<number>(3000000);
  const [totalPriceKesepakatan, setTotalPriceKesepakatan] = useState<number>(300000000);
  const [njopPerM2, setNjopPerM2] = useState<number>(2000000);
  const [nptkp, setNptkp] = useState<number>(60000000);
  const [incentive, setIncentive] = useState<"normal" | "discount" | "free">("normal");
  const [statusPembeli, setStatusPembeli] = useState<"cash" | "kpr">("cash");

  // Jika KPR/KPT
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [tenor, setTenor] = useState<number>(10);

  // State Baru untuk POV Lanjutan & Analisis Keuntungan
  const [sellerInitialPrice, setSellerInitialPrice] = useState<number>(150000000);
  const [yearsHeld, setYearsHeld] = useState<number>(5);
  const [marketPricePerM2, setMarketPricePerM2] = useState<number>(3500000);
  const [totalMarketPriceKesepakatan, setTotalMarketPriceKesepakatan] = useState<number>(350000000);
  const [activeTab, setActiveTab] = useState<"buyer" | "seller" | "analysis">("buyer");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Logika Rumus
  const totalPrice = inputMethod === "area" ? area * pricePerM2 : totalPriceKesepakatan;
  const totalNjop = area * njopPerM2;
  const acuanPajak = Math.max(totalPrice, totalNjop);

  // Pajak Penjual (PPh Final 2.5%)
  const pphFinal = 0.025 * acuanPajak;

  // Pajak Pembeli (BPHTB 5% setelah dikurangi NPTKP)
  const bphtbBase = acuanPajak - nptkp;
  let bphtb = bphtbBase > 0 ? 0.05 * bphtbBase : 0;
  
  if (incentive === "discount") {
    bphtb = bphtb * 0.5;
  } else if (incentive === "free") {
    bphtb = 0;
  }

  // Notaris PPAT (AJB & Jasa ~1%, ditanggung 50:50)
  const totalNotaris = 0.01 * totalPrice;
  const AJBBagi = totalNotaris / 2;

  // Biaya Balik Nama (BBN) Resmi: (Nilai Tanah/1000) + Rp50.000 + PPAT Paket (~Rp2.000.000)
  const bbnResmi = (totalPrice / 1000) + 50000 + 2000000;

  // Sisi Penjual (Uang Bersih)
  const uangBersihPenjual = totalPrice - pphFinal - AJBBagi;

  // Sisi Pembeli KPR
  const dpAmount = (dpPercent / 100) * totalPrice;
  const plafon = totalPrice - dpAmount;
  
  // Biaya Bank (Provisi 1% + Admin Rp1.000.000)
  const bankFees = statusPembeli === "kpr" ? (0.01 * plafon) + 1000000 : 0;

  // Annuity Cicilan Bulanan KPR
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenor * 12;
  let installment = 0;
  if (statusPembeli === "kpr" && monthlyRate > 0 && totalMonths > 0) {
    installment = (plafon * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
  }

  // Uang Bersih Siap di Awal Pembeli
  const cashRequiredPembeli = statusPembeli === "cash"
    ? totalPrice + bphtb + AJBBagi + bbnResmi
    : dpAmount + bphtb + AJBBagi + bbnResmi + bankFees;

  // Rekomendasi Gaji Minimum
  const minIncome = installment * 3;

  // RUMUS BARU POV & INVESTASI
  const totalMarketPrice = inputMethod === "area" ? area * marketPricePerM2 : totalMarketPriceKesepakatan;
  
  // Total Cost Pembeli (Total modal riil: Uang Muka/Harga Properti + Semua Biaya Tambahan)
  const totalAcquisitionCost = statusPembeli === "cash"
    ? cashRequiredPembeli
    : cashRequiredPembeli + plafon;

  // Keuntungan Kertas Pembeli (Valuation Benefit) terhadap estimasi harga pasar wajar
  const valuationBenefit = totalMarketPrice - totalAcquisitionCost;

  // Laba Bersih Penjual (Capital Gain) setelah potongan biaya transaksi penjual
  const capitalGain = uangBersihPenjual - sellerInitialPrice;
  const roi = sellerInitialPrice > 0 ? (capitalGain / sellerInitialPrice) * 100 : 0;
  
  // CAGR (Compound Annual Growth Rate) - Laju pertumbuhan rata-rata tahunan disetahunkan
  const cagr = sellerInitialPrice > 0 && yearsHeld > 0
    ? (Math.pow(uangBersihPenjual / sellerInitialPrice, 1 / yearsHeld) - 1) * 100
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.tanah.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.tanah.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Form Column (Left/7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Input Method Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.tanah.calcMethod}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/[0.02] dark:bg-white/[0.04] p-1 rounded-xl border border-card-border">
                  <button
                    type="button"
                    onClick={() => setInputMethod("area")}
                    className={`rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      inputMethod === "area"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {dict.tanah.methodArea}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMethod("total")}
                    className={`rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      inputMethod === "total"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {dict.tanah.methodTotal}
                  </button>
                </div>
              </div>

              {/* Area Input (Always shown for NJOP calculation) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="area-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.tanah.area}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {area} m²
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="area-input"
                    type="range"
                    min="20"
                    max="10000"
                    step="10"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="20"
                    max="10000"
                    step="10"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {inputMethod === "area" ? (
                /* Price per m2 Input */
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="price-per-m2" className="text-sm font-semibold text-foreground">
                      {dict.tanah.pricePerM2}
                    </label>
                    <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                      {formatIDR(pricePerM2)} / m²
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="price-per-m2"
                      type="range"
                      min="200000"
                      max="50000000"
                      step="100000"
                      value={pricePerM2}
                      onChange={(e) => setPricePerM2(Number(e.target.value))}
                      className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="200000"
                      max="50000000"
                      step="100000"
                      value={pricePerM2}
                      onChange={(e) => setPricePerM2(Number(e.target.value))}
                      className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                /* Total Negotiated Price Input */
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="total-price" className="text-sm font-semibold text-foreground">
                      {dict.tanah.totalPrice}
                    </label>
                    <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                      {formatIDR(totalPriceKesepakatan)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="total-price"
                      type="range"
                      min="10000000"
                      max="10000000000"
                      step="10000000"
                      value={totalPriceKesepakatan}
                      onChange={(e) => setTotalPriceKesepakatan(Number(e.target.value))}
                      className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="10000000"
                      max="10000000000"
                      step="10000000"
                      value={totalPriceKesepakatan}
                      onChange={(e) => setTotalPriceKesepakatan(Number(e.target.value))}
                      className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* NJOP per m2 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="njop-input" className="text-sm font-semibold text-foreground">
                    {dict.tanah.njop}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(njopPerM2)} / m²
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="njop-input"
                    type="range"
                    min="100000"
                    max="40000000"
                    step="100000"
                    value={njopPerM2}
                    onChange={(e) => setNjopPerM2(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="100000"
                    max="40000000"
                    step="100000"
                    value={njopPerM2}
                    onChange={(e) => setNjopPerM2(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* NPTKP and Incentive */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.tanah.nptkp}</span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.tanah.nptkpDesc}</span>
                  </label>
                  <select
                    value={nptkp}
                    onChange={(e) => setNptkp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value={60000000} className="bg-background">Rp60.000.000 (Daerah Umum)</option>
                    <option value={350000000} className="bg-background">Rp350.000.000 (DKI Jakarta)</option>
                    <option value={80000000} className="bg-background">Rp80.000.000 (Daerah Lain)</option>
                    <option value={0} className="bg-background">Tanpa NPTKP (Rp0)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">
                    {dict.tanah.incentive}
                  </label>
                  <select
                    value={incentive}
                    onChange={(e) => setIncentive(e.target.value as "normal" | "discount" | "free")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="normal" className="bg-background">{dict.tanah.incNormal}</option>
                    <option value="discount" className="bg-background">{dict.tanah.incDiscount}</option>
                    <option value="free" className="bg-background">{dict.tanah.incFree}</option>
                  </select>
                </div>
              </div>

              {/* Status Pembeli & KPR */}
              <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">
                    {dict.tanah.status}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: "cash", label: dict.tanah.statusCash },
                      { val: "kpr", label: dict.tanah.statusKpr },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setStatusPembeli(item.val as "cash" | "kpr")}
                        className={`rounded-xl py-2.5 px-3 text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          statusPembeli === item.val
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {statusPembeli === "kpr" && (
                  /* KPR Details inputs */
                  <div className="grid gap-4 sm:grid-cols-3 bg-black/[0.01] dark:bg-white/[0.01] p-4 rounded-2xl border border-card-border border-dashed">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="dp-percent" className="text-xs font-semibold text-zinc-500">
                        {dict.tanah.dp}
                      </label>
                      <input
                        id="dp-percent"
                        type="number"
                        min="5"
                        max="90"
                        value={dpPercent}
                        onChange={(e) => setDpPercent(Math.max(5, Math.min(90, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="interest-rate" className="text-xs font-semibold text-zinc-500">
                        {dict.tanah.interest}
                      </label>
                      <input
                        id="interest-rate"
                        type="number"
                        step="0.1"
                        min="1"
                        max="25"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Math.max(1, Math.min(25, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="tenor-input" className="text-xs font-semibold text-zinc-500">
                        {dict.tanah.tenor}
                      </label>
                      <input
                        id="tenor-input"
                        type="number"
                        min="1"
                        max="30"
                        value={tenor}
                        onChange={(e) => setTenor(Math.max(1, Math.min(30, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card Input Baru: Analisis Perspektif & Nilai Pasar (POV) */}
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-card-border/50 pb-2">
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
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.656 48.656 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0Zm0 0c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7c2.44.17 4.884.17 7.324 0a4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M3 12l-3 3m3-3 3 3"
                  />
                </svg>
                <span>{dict.tanah.povAnalysis}</span>
              </h3>

              {/* Seller Acquisition Price */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="seller-initial-price" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.tanah.sellerInitialPrice}</span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.tanah.sellerInitialPriceHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(sellerInitialPrice)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="seller-initial-price"
                    type="range"
                    min="10000000"
                    max="5000000000"
                    step="10000000"
                    value={sellerInitialPrice}
                    onChange={(e) => setSellerInitialPrice(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="10000000"
                    max="5000000000"
                    step="10000000"
                    value={sellerInitialPrice}
                    onChange={(e) => setSellerInitialPrice(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Years Held */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="years-held" className="text-sm font-semibold text-foreground">
                    {dict.tanah.yearsHeld}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {yearsHeld} {dict.tanah.tenor.includes("Years") ? "Years" : "Tahun"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="years-held"
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={yearsHeld}
                    onChange={(e) => setYearsHeld(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={yearsHeld}
                    onChange={(e) => setYearsHeld(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Market Price */}
              {inputMethod === "area" ? (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="market-price-per-m2" className="text-sm font-semibold text-foreground flex flex-col">
                      <span>{dict.tanah.marketPricePerM2}</span>
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.tanah.marketPriceHelp}</span>
                    </label>
                    <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                      {formatIDR(marketPricePerM2)} / m²
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="market-price-per-m2"
                      type="range"
                      min="200000"
                      max="50000000"
                      step="100000"
                      value={marketPricePerM2}
                      onChange={(e) => setMarketPricePerM2(Number(e.target.value))}
                      className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="200000"
                      max="50000000"
                      step="100000"
                      value={marketPricePerM2}
                      onChange={(e) => setMarketPricePerM2(Number(e.target.value))}
                      className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="total-market-price" className="text-sm font-semibold text-foreground flex flex-col">
                      <span>{dict.tanah.totalMarketPrice}</span>
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.tanah.marketPriceHelp}</span>
                    </label>
                    <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                      {formatIDR(totalMarketPriceKesepakatan)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="total-market-price"
                      type="range"
                      min="10000000"
                      max="10000000000"
                      step="10000000"
                      value={totalMarketPriceKesepakatan}
                      onChange={(e) => setTotalMarketPriceKesepakatan(Number(e.target.value))}
                      className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="10000000"
                      max="10000000000"
                      step="10000000"
                      value={totalMarketPriceKesepakatan}
                      onChange={(e) => setTotalMarketPriceKesepakatan(Number(e.target.value))}
                      className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
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
                <li>{dict.tanah.dos1}</li>
                <li>{dict.tanah.dos2}</li>
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
                <li>{dict.tanah.donts1}</li>
                <li>{dict.tanah.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Panel (Right/5cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01]">
              <button
                type="button"
                onClick={() => setActiveTab("buyer")}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "buyer"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white/[0.02]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {dict.tanah.tabBuyer}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seller")}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "seller"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white/[0.02]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {dict.tanah.tabSeller}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analysis")}
                className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === "analysis"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-white/[0.02]"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {dict.tanah.tabAnalysis}
              </button>
            </div>

            <CardContent className="flex flex-col gap-6 pt-6">
              {/* TAB 1: POV PEMBELI */}
              {activeTab === "buyer" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      {dict.tanah.buyerAnalysisTitle}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {dict.tanah.buyerSide}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Basic Price */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.tanah.totalPrice}</span>
                      <span className="font-semibold text-foreground">{formatIDR(totalPrice)}</span>
                    </div>

                    {/* Taxes and Fees */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.tanah.bphtb}</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(bphtb)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">AJB PPAT Notaris (0.5%)</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(AJBBagi)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.tanah.bbn}</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(bbnResmi)}</span>
                    </div>

                    {statusPembeli === "kpr" && (
                      <div className="flex flex-col gap-2 border-t border-dashed border-card-border/50 pt-2.5 my-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">{dict.tanah.plafon}</span>
                          <span className="font-semibold text-foreground">{formatIDR(plafon)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">Biaya Admin & Provisi KPR</span>
                          <span className="font-semibold text-rose-500">+{formatIDR(bankFees)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">{dict.tanah.installment}</span>
                          <span className="font-bold text-indigo-500">{formatIDR(installment)} / bln</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">{dict.tanah.ratio}</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.tanah.ratioDesc}</span>
                          </div>
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                            {formatIDR(minIncome)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Total acquisition cost card */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-zinc-500/[0.04] dark:bg-white/[0.03] border border-card-border mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{dict.tanah.totalAcquisitionCost}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.tanah.totalAcquisitionCostDesc}</span>
                      </div>
                      <span className="text-sm font-extrabold text-foreground">{formatIDR(totalAcquisitionCost)}</span>
                    </div>

                    {/* Upfront Cash required */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{dict.tanah.cashRequired}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.tanah.cashRequiredDesc}</span>
                      </div>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(cashRequiredPembeli)}</span>
                    </div>

                    {/* Valuation status */}
                    <div className="flex flex-col gap-2 border-t border-card-border/50 pt-3.5 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-600 dark:text-zinc-400">{dict.tanah.valuationStatus}</span>
                        <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${
                          valuationBenefit >= 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}>
                          {valuationBenefit >= 0 ? dict.tanah.belowMarket : dict.tanah.aboveMarket}
                        </span>
                      </div>
                      <div className={`flex justify-between items-center p-3 rounded-xl border ${
                        valuationBenefit >= 0
                          ? "bg-emerald-500/[0.03] border-emerald-500/10"
                          : "bg-rose-500/[0.03] border-rose-500/10"
                      }`}>
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          {valuationBenefit >= 0 ? dict.tanah.valuationBenefit : dict.tanah.valuationLoss}
                        </span>
                        <span className={`text-sm font-bold ${
                          valuationBenefit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {valuationBenefit >= 0 ? "" : "-"}{formatIDR(Math.abs(valuationBenefit))}
                        </span>
                      </div>
                    </div>

                    {/* Share Summary Button - Buyer */}
                    <div className="pt-2">
                      <ShareSummaryButton
                        title={`Simulasi Beli Tanah (${area} m²)`}
                        summaryText={
                          `🏡 *Simulasi Pembelian Tanah (${statusPembeli === "cash" ? "Tunai / Cash" : "KPR / Pembiayaan Bank"})*\n` +
                          `• Luas Tanah: ${area} m²\n` +
                          `• Harga Kesepakatan: ${formatIDR(totalPrice)}\n` +
                          `• BPHTB (Pajak Pembeli): ${formatIDR(bphtb)}\n` +
                          `• Biaya AJB PPAT (0.5%): ${formatIDR(AJBBagi)}\n` +
                          `• Biaya Balik Nama (BBN): ${formatIDR(bbnResmi)}\n` +
                          (statusPembeli === "kpr" ? `• DP: ${formatIDR(dpAmount)} (${dpPercent}%)\n• Cicilan: ${formatIDR(installment)} / bln (${tenor} thn)\n` : "") +
                          `---------------------------------\n` +
                          `*Total Modal Diperlukan: ${formatIDR(totalAcquisitionCost)}*\n` +
                          `*Dana Siap di Awal: ${formatIDR(cashRequiredPembeli)}*`
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: POV PENJUAL */}
              {activeTab === "seller" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {dict.tanah.sellerAnalysisTitle}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {dict.tanah.sellerSide}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Basic Selling Price */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">{dict.tanah.totalPrice}</span>
                      <span className="font-semibold text-foreground">{formatIDR(totalPrice)}</span>
                    </div>

                    {/* Deductions */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">{dict.tanah.pph}</span>
                      <span className="font-semibold text-rose-500">-{formatIDR(pphFinal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {dict.tanah.notaris} <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.tanah.notarisDesc}</span>
                      </span>
                      <span className="font-semibold text-rose-500">-{formatIDR(AJBBagi)}</span>
                    </div>

                    {/* Net Cash Received */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mt-1">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{dict.tanah.netReceived}</span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatIDR(uangBersihPenjual)}</span>
                    </div>

                    {/* Initial Price comparison */}
                    <div className="flex flex-col gap-2 border-t border-card-border/50 pt-3.5 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-600 dark:text-zinc-400">{dict.tanah.sellerInitialPrice}</span>
                        <span className="font-semibold text-foreground">{formatIDR(sellerInitialPrice)}</span>
                      </div>
                      
                      {/* Capital Gain */}
                      <div className={`flex justify-between items-center p-3 rounded-xl border ${
                        capitalGain >= 0
                          ? "bg-emerald-500/[0.03] border-emerald-500/10"
                          : "bg-rose-500/[0.03] border-rose-500/10"
                      }`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{dict.tanah.capitalGain}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.tanah.capitalGainDesc}</span>
                        </div>
                        <span className={`text-sm font-bold ${
                          capitalGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {capitalGain >= 0 ? "+" : ""}{formatIDR(capitalGain)}
                        </span>
                      </div>

                      {/* ROI & CAGR Grid */}
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase">{dict.tanah.roi}</span>
                          <span className={`text-base font-extrabold block mt-0.5 ${
                            capitalGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {roi.toFixed(1)}%
                          </span>
                        </div>
                        <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase">{dict.tanah.cagr}</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 -mt-0.5">{dict.tanah.cagrDesc}</span>
                          </div>
                          <span className={`text-base font-extrabold block mt-0.5 ${
                            capitalGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {cagr.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Share Summary Button - Seller */}
                      <div className="pt-2">
                        <ShareSummaryButton
                          title={`Simulasi Jual Tanah (${area} m²)`}
                          summaryText={
                            `🏡 *Simulasi Penjualan Tanah*\n` +
                            `• Luas Tanah: ${area} m²\n` +
                            `• Harga Jual Kesepakatan: ${formatIDR(totalPrice)}\n` +
                            `• Pajak PPh Final (2.5%): ${formatIDR(pphFinal)}\n` +
                            `• Biaya Notaris PPAT (0.5%): ${formatIDR(AJBBagi)}\n` +
                            `---------------------------------\n` +
                            `*Uang Bersih Diterima: ${formatIDR(uangBersihPenjual)}*\n` +
                            `*Keuntungan Modal (Capital Gain): ${capitalGain >= 0 ? "+" : ""}${formatIDR(capitalGain)} (ROI: ${roi.toFixed(1)}%, CAGR: ${cagr.toFixed(1)}%)*`
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SIAPA UNTUNG? */}
              {activeTab === "analysis" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      {dict.tanah.dealAnalyzerTitle}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {dict.tanah.negotiationVerdict}
                    </p>
                  </div>

                  {/* Negotiation Verdict Card */}
                  {totalPrice < totalMarketPrice ? (
                    <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 animate-bounce"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.13c1.434-1.25 3.8-1.25 5.233 0a.75.75 0 0 1-.99 1.13ZM9.75 11.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{dict.tanah.buyerAdvantage}</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {dict.tanah.buyerAdvantageDesc}
                      </p>
                    </div>
                  ) : totalPrice > totalMarketPrice ? (
                    <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 animate-bounce"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.13c1.434-1.25 3.8-1.25 5.233 0a.75.75 0 0 1-.99 1.13ZM9.75 11.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{dict.tanah.sellerAdvantage}</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {dict.tanah.sellerAdvantageDesc}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 animate-pulse"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.13c1.434-1.25 3.8-1.25 5.233 0a.75.75 0 0 1-.99 1.13ZM9.75 11.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Zm0 3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{dict.tanah.fairDeal}</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {dict.tanah.fairDealDesc}
                      </p>
                    </div>
                  )}

                  {/* Price comparison breakdown & bars */}
                  <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4">
                    <h4 className="text-xs font-bold text-foreground">
                      {dict.tanah.dealBalance}
                    </h4>

                    {/* Numeric comparison list */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block"></span>
                          {dict.tanah.dealPrice}
                        </span>
                        <span className="font-bold text-indigo-500">{formatIDR(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                          {dict.tanah.marketVal}
                        </span>
                        <span className="font-bold text-emerald-500">{formatIDR(totalMarketPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-zinc-400 rounded-full inline-block"></span>
                          {dict.tanah.njopVal} (NJOP)
                        </span>
                        <span className="font-bold text-zinc-500 dark:text-zinc-300">{formatIDR(totalNjop)}</span>
                      </div>
                    </div>

                    {/* Visual bar chart comparing the three */}
                    <div className="flex flex-col gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] p-4 rounded-xl border border-card-border mt-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                        {dict.tanah.comparisonChart || "Grafik Komparasi"}
                      </span>
                      
                      {/* Deal price relative to market price */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                          <span>{dict.tanah.dealPrice}</span>
                          <span>{((totalPrice / Math.max(totalPrice, totalMarketPrice, totalNjop)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(totalPrice / Math.max(totalPrice, totalMarketPrice, totalNjop)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Market price relative to max */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                          <span>{dict.tanah.marketVal}</span>
                          <span>{((totalMarketPrice / Math.max(totalPrice, totalMarketPrice, totalNjop)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(totalMarketPrice / Math.max(totalPrice, totalMarketPrice, totalNjop)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* NJOP relative to max */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                          <span>{dict.tanah.njopVal}</span>
                          <span>{((totalNjop / Math.max(totalPrice, totalMarketPrice, totalNjop)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-zinc-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(totalNjop / Math.max(totalPrice, totalMarketPrice, totalNjop)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* NJOP tax calculation warning if transaction price is below NJOP */}
                    {totalPrice < totalNjop && (
                      <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] text-xs text-amber-700 dark:text-amber-300 leading-relaxed flex gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{dict.tanah.njopWarning}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edukasi PPAT */}
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
                {dict.tanah.eduTitle}
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                <p>{dict.tanah.edu1}</p>
                <p>{dict.tanah.edu2}</p>
                <p>{dict.tanah.edu3}</p>
                <p>{dict.tanah.edu4}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
