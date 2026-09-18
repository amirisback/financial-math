"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";

interface HouseCalculatorProps {
  dict: Dictionary;
}

export function HouseCalculator({ dict }: HouseCalculatorProps) {
  // Skenario default riil: Harga Rumah = Rp500.000.000; NJOP = Rp400.000.000; NPTKP = Rp60.000.000; KPR dengan DP = 10%, Bunga = 6% Fixed, Tenor = 15 Tahun, Usia = 28 Tahun.
  const [price, setPrice] = useState<number>(500000000);
  const [njop, setNjop] = useState<number>(400000000);
  const [nptkp, setNptkp] = useState<number>(60000000);
  const [statusPembeli, setStatusPembeli] = useState<"cash" | "kpr">("kpr");

  // Jika KPR
  const [dpPercent, setDpPercent] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(6);
  const [tenor, setTenor] = useState<number>(15);
  const [age, setAge] = useState<number>(28);

  // State Baru untuk PBB
  const [njoptkpPbb, setNjoptkpPbb] = useState<number>(12000000); // Default Rp12.000.000 (minimum statutory)
  const [njkpPercent, setNjkpPercent] = useState<number>(20); // Default 20%
  const [tarifPbb, setTarifPbb] = useState<number>(0.2); // Default 0.2%
  const [stimulusPbb, setStimulusPbb] = useState<number>(0); // Default 0% (no discount)

  // State Baru untuk POV & Laba Rugi Investasi
  const [sellerInitialPrice, setSellerInitialPrice] = useState<number>(300000000);
  const [yearsHeld, setYearsHeld] = useState<number>(5);
  const [marketPrice, setMarketPrice] = useState<number>(600000000);
  const [activeTab, setActiveTab] = useState<"buyer" | "seller" | "analysis">("buyer");

  // Helper to adjust NJOP and auto-adjust NJKP based on Indonesian guideline (NJOP < 1B -> 20%, >= 1B -> 40%)
  const handleUpdateNjop = (newNjop: number) => {
    setNjop(newNjop);
    setNjkpPercent(newNjop < 1000000000 ? 20 : 40);
  };

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Perhitungan Utama
  const acuanPajak = Math.max(price, njop);

  // BPHTB (Pajak Pembeli 5% setelah dikurangi NPTKP)
  const bphtbBase = acuanPajak - nptkp;
  const bphtb = bphtbBase > 0 ? 0.05 * bphtbBase : 0;

  // AJB Notaris (Estimasi 1% total, dibagi bersama 50:50 antara Pembeli & Penjual)
  const totalNotaris = 0.01 * price;
  const ajbBagi = totalNotaris / 2;

  // BBN Flat paket PPAT (Rp2.000.000)
  const bbnPaket = 2000000;

  // Plafon KPR & DP
  const dpAmount = (dpPercent / 100) * price;
  const plafon = Math.max(0, price - dpAmount);

  // Biaya KPR Bank
  const provisi = statusPembeli === "kpr" ? 0.01 * plafon : 0;
  const adminKpr = statusPembeli === "kpr" ? 1000000 : 0;
  const apht = statusPembeli === "kpr" ? 0.005 * plafon : 0;

  // Asuransi Jiwa & Kebakaran berdasarkan usia
  let insuranceRate = 0;
  if (statusPembeli === "kpr") {
    if (age < 30) {
      insuranceRate = 0.012; // 1.2%
    } else if (age >= 30 && age <= 45) {
      insuranceRate = 0.017; // 1.7%
    } else {
      insuranceRate = 0.025; // 2.5%
    }
  }
  const insuranceAmount = insuranceRate * plafon;
  const totalKprAndInsurance = provisi + adminKpr + apht + insuranceAmount;

  // Annuity KPR Cicilan
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenor * 12;
  let installment = 0;
  if (statusPembeli === "kpr" && monthlyRate > 0 && totalMonths > 0) {
    installment = (plafon * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
  }

  // Saldo mengendap wajib bank (1x cicilan)
  const saldoMengendap = statusPembeli === "kpr" ? installment : 0;

  // Pendapatan Minimum (3x cicilan)
  const minIncome = installment * 3;

  // ==========================================
  // PERHITUNGAN BARU: PAJAK BUMI & BANGUNAN (PBB)
  // ==========================================
  const pbbBase = Math.max(0, njop - njoptkpPbb);
  const pbbTerutang = pbbBase * (njkpPercent / 100) * (tarifPbb / 100);
  const stimulusAmount = pbbTerutang * (stimulusPbb / 100);
  const pbbYangHarusDibayar = Math.max(0, pbbTerutang - stimulusAmount);

  // ==========================================
  // PERHITUNGAN BARU: POV PEMBELI & PENJUAL
  // ==========================================
  
  // Total Cost Pembeli (Total modal riil: Uang Muka + Semua Biaya Tambahan + sisa Plafon)
  const totalAcquisitionCost = statusPembeli === "cash"
    ? price + bphtb + ajbBagi + bbnPaket
    : dpAmount + bphtb + ajbBagi + bbnPaket + totalKprAndInsurance + saldoMengendap + plafon;

  // Total Dana Siap di Awal
  const totalDanaSiapAwal = statusPembeli === "cash"
    ? price + bphtb + ajbBagi + bbnPaket
    : dpAmount + bphtb + ajbBagi + bbnPaket + totalKprAndInsurance + saldoMengendap;

  // Keuntungan Kertas Pembeli (Valuation Benefit) terhadap estimasi harga pasar wajar
  const valuationBenefit = marketPrice - totalAcquisitionCost;

  // Sisi Penjual (PPh 2.5% & AJB 50:50)
  const pphFinal = 0.025 * acuanPajak;
  const uangBersihPenjual = price - pphFinal - ajbBagi;

  // Laba Bersih Penjual (Capital Gain) & Investasi
  const capitalGain = uangBersihPenjual - sellerInitialPrice;
  const roi = sellerInitialPrice > 0 ? (capitalGain / sellerInitialPrice) * 100 : 0;
  const cagr = sellerInitialPrice > 0 && yearsHeld > 0
    ? (Math.pow(uangBersihPenjual / sellerInitialPrice, 1 / yearsHeld) - 1) * 100
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.rumah.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.rumah.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Form Column (Left/7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* CARD 1: INFORMASI DASAR & KPR */}
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
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <span>Informasi Dasar Kesepakatan & KPR</span>
              </h3>

              {/* Input: Harga Rumah Kesepakatan */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="price-input" className="text-sm font-semibold text-foreground">
                    {dict.rumah.price}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(price)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="price-input"
                    type="range"
                    min="50000000"
                    max="5000000000"
                    step="10000000"
                    value={price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPrice(val);
                      // Sesuaikan NJOP otomatis agar proporsional sebagai pembantu input (80% harga)
                      handleUpdateNjop(Math.round(val * 0.8));
                      // Sesuaikan taksiran harga pasar otomatis (1.2x harga) sebagai pembantu
                      setMarketPrice(Math.round(val * 1.2));
                    }}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="50000000"
                    max="5000000000"
                    step="10000000"
                    value={price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPrice(val);
                      // Sesuaikan NJOP otomatis agar proporsional sebagai pembantu input (80% harga)
                      handleUpdateNjop(Math.round(val * 0.8));
                      // Sesuaikan taksiran harga pasar otomatis (1.2x harga) sebagai pembantu
                      setMarketPrice(Math.round(val * 1.2));
                    }}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Rp50.000.000</span>
                  <span>Rp2.500.000.000</span>
                  <span>Rp5.000.000.000</span>
                </div>
              </div>

              {/* Input: NJOP Rumah */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="njop-input" className="text-sm font-semibold text-foreground">
                    {dict.rumah.njopTotal}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(njop)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="njop-input"
                    type="range"
                    min="40000000"
                    max="4000000000"
                    step="10000000"
                    value={njop}
                    onChange={(e) => handleUpdateNjop(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="40000000"
                    max="4000000000"
                    step="10000000"
                    value={njop}
                    onChange={(e) => handleUpdateNjop(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* NPTKP Selector (untuk BPHTB) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground flex flex-col">
                  <span>{dict.tanah.nptkp}</span>
                </label>
                <select
                  value={nptkp}
                  onChange={(e) => setNptkp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value={60000000} className="bg-background">Rp60.000.000 (Daerah Umum)</option>
                  <option value={350000000} className="bg-background">Rp350.000.000 (DKI Jakarta)</option>
                  <option value={80000000} className="bg-background">Rp80.000.000 (Daerah Lain)</option>
                </select>
              </div>

              {/* Payment Scheme Switcher */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  Skema Pembayaran
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

              {/* KPR Config Panel */}
              {statusPembeli === "kpr" && (
                <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4 animate-in slide-in-from-top-3 duration-200">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="age-input" className="text-xs font-semibold text-zinc-500">
                        {dict.rumah.age}
                      </label>
                      <input
                        id="age-input"
                        type="number"
                        min="18"
                        max="70"
                        value={age}
                        onChange={(e) => setAge(Math.max(18, Math.min(70, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="dp-percent-input" className="text-xs font-semibold text-zinc-500">
                        {dict.tanah.dp}
                      </label>
                      <input
                        id="dp-percent-input"
                        type="number"
                        min="5"
                        max="90"
                        value={dpPercent}
                        onChange={(e) => setDpPercent(Math.max(5, Math.min(90, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="interest-input" className="text-xs font-semibold text-zinc-500">
                        {dict.tanah.interest}
                      </label>
                      <input
                        id="interest-input"
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
                      <label htmlFor="tenor-input-house" className="text-xs font-semibold text-zinc-500">
                        {dict.tanah.tenor}
                      </label>
                      <input
                        id="tenor-input-house"
                        type="number"
                        min="1"
                        max="35"
                        value={tenor}
                        onChange={(e) => setTenor(Math.max(1, Math.min(35, Number(e.target.value))))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CARD 2: PAJAK BUMI & BANGUNAN (PBB) */}
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              <div className="flex flex-col gap-1 border-b border-card-border/50 pb-2">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
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
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 16.5h1.5m3 0H15"
                    />
                  </svg>
                  <span>{dict.rumah.pbbSectionTitle}</span>
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {dict.rumah.pbbSectionDesc}
                </p>
              </div>

              {/* Input: NJOPTKP PBB */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="njoptkp-pbb-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.rumah.njoptkpPbb}</span>
                    <span className="text-[10px] font-normal text-zinc-400">{dict.rumah.njoptkpPbbHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(njoptkpPbb)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="njoptkp-pbb-input"
                    type="range"
                    min="0"
                    max="100000000"
                    step="1000000"
                    value={njoptkpPbb}
                    onChange={(e) => setNjoptkpPbb(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="1000000"
                    value={njoptkpPbb}
                    onChange={(e) => setNjoptkpPbb(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Input: NJKP Percentage */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="njkp-percent-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.rumah.njkpPercent}</span>
                    <span className="text-[10px] font-normal text-zinc-400">{dict.rumah.njkpPercentHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {njkpPercent}%
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="njkp-percent-input"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={njkpPercent}
                    onChange={(e) => setNjkpPercent(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="10"
                    max="100"
                    step="5"
                    value={njkpPercent}
                    onChange={(e) => setNjkpPercent(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Grid: Tarif PBB & Stimulus */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Input: Tarif PBB */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="tarif-pbb-input" className="text-xs font-semibold text-zinc-500 flex flex-col">
                      <span>{dict.rumah.tarifPbb}</span>
                      <span className="text-[9px] font-normal text-zinc-400">{dict.rumah.tarifPbbHelp}</span>
                    </label>
                    <span className="text-xs font-bold text-foreground">
                      {tarifPbb}%
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="tarif-pbb-input"
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tarifPbb}
                      onChange={(e) => setTarifPbb(Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={tarifPbb}
                      onChange={(e) => setTarifPbb(Number(e.target.value))}
                      className="w-full sm:w-24 px-2 py-1 text-center text-[10px] font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Input: Stimulus / Pengurangan PBB */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="stimulus-pbb-input" className="text-xs font-semibold text-zinc-500 flex flex-col">
                      <span>{dict.rumah.stimulusPbb}</span>
                      <span className="text-[9px] font-normal text-zinc-400">{dict.rumah.stimulusPbbHelp}</span>
                    </label>
                    <span className="text-xs font-bold text-foreground">
                      {stimulusPbb}%
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="stimulus-pbb-input"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={stimulusPbb}
                      onChange={(e) => setStimulusPbb(Number(e.target.value))}
                      className="flex-1 h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={stimulusPbb}
                      onChange={(e) => setStimulusPbb(Number(e.target.value))}
                      className="w-full sm:w-24 px-2 py-1 text-center text-[10px] font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: ANALISIS PERSPEKTIF & NILAI PASAR (POV) */}
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
                    <span className="text-[10px] font-normal text-zinc-400">{dict.tanah.sellerInitialPriceHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(sellerInitialPrice)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="seller-initial-price"
                    type="range"
                    min="50000000"
                    max="5000000000"
                    step="10000000"
                    value={sellerInitialPrice}
                    onChange={(e) => setSellerInitialPrice(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="50000000"
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
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="market-price-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.tanah.totalMarketPrice}</span>
                    <span className="text-[10px] font-normal text-zinc-400">{dict.tanah.marketPriceHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(marketPrice)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="market-price-input"
                    type="range"
                    min="50000000"
                    max="5000000000"
                    step="10000000"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="50000000"
                    max="5000000000"
                    step="10000000"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
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
                <li>{dict.rumah.dos1}</li>
                <li>{dict.rumah.dos2}</li>
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
                <li>{dict.rumah.donts1}</li>
                <li>{dict.rumah.donts2}</li>
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
                      <span className="text-zinc-500">{dict.rumah.price}</span>
                      <span className="font-semibold text-foreground">{formatIDR(price)}</span>
                    </div>

                    {/* BPHTB & AJB Split & BBN */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.tanah.bphtb}</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(bphtb)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">
                        {dict.tanah.notaris} <span className="text-[9px] text-zinc-400">{dict.tanah.notarisDesc}</span>
                      </span>
                      <span className="font-semibold text-rose-500">+{formatIDR(ajbBagi)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.tanah.bbn}</span>
                      <span className="font-semibold text-rose-500">+{formatIDR(bbnPaket)}</span>
                    </div>

                    {statusPembeli === "kpr" && (
                      <div className="flex flex-col gap-2 border-t border-dashed border-card-border/50 pt-2.5 my-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">{dict.tanah.plafon}</span>
                          <span className="font-semibold text-foreground">{formatIDR(plafon)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">{dict.rumah.provisi}</span>
                          <span className="font-semibold text-rose-500">+{formatIDR(provisi)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">{dict.rumah.admin}</span>
                          <span className="font-semibold text-rose-500">+{formatIDR(adminKpr)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">{dict.rumah.apht}</span>
                          <span className="font-semibold text-rose-500">+{formatIDR(apht)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-500">{dict.rumah.insurance}</span>
                            <span className="text-[9px] text-zinc-400">{dict.rumah.insuranceDesc}</span>
                          </div>
                          <span className="font-semibold text-rose-500">+{formatIDR(insuranceAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-500">{dict.rumah.holdBalance}</span>
                            <span className="text-[9px] text-zinc-400">{dict.rumah.holdBalanceDesc}</span>
                          </div>
                          <span className="font-semibold text-rose-500">+{formatIDR(saldoMengendap)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">{dict.tanah.installment}</span>
                          <span className="font-bold text-indigo-500">{formatIDR(installment)} / bln</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">{dict.rumah.minIncome}</span>
                            <span className="text-[9px] text-zinc-400">{dict.rumah.minIncomeDesc}</span>
                          </div>
                          <span className="text-xs font-semibold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                            {formatIDR(minIncome)} / bln
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Total Outlay (Total cost) */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-zinc-500/[0.03] dark:bg-white/[0.02] border border-card-border mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{dict.tanah.totalAcquisitionCost}</span>
                        <span className="text-[9px] text-zinc-400">{dict.tanah.totalAcquisitionCostDesc}</span>
                      </div>
                      <span className="text-sm font-extrabold text-foreground">{formatIDR(totalAcquisitionCost)}</span>
                    </div>

                    {/* Cash required upfront */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{dict.tanah.cashRequired}</span>
                        <span className="text-[9px] text-zinc-400">{dict.tanah.cashRequiredDesc}</span>
                      </div>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{formatIDR(totalDanaSiapAwal)}</span>
                    </div>

                    {/* Valuation paper benefit */}
                    <div className="flex flex-col gap-2 border-t border-card-border/50 pt-3.5 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">{dict.tanah.valuationStatus}</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          valuationBenefit >= 0
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}>
                          {valuationBenefit >= 0 ? dict.tanah.belowMarket : dict.tanah.aboveMarket}
                        </span>
                      </div>
                      <div className={`flex justify-between items-center p-3 rounded-xl border ${
                        valuationBenefit >= 0
                          ? "bg-emerald-500/[0.03] border-emerald-500/10"
                          : "bg-rose-500/[0.03] border-rose-500/10"
                      }`}>
                        <span className="text-xs font-semibold text-zinc-500">
                          {valuationBenefit >= 0 ? dict.tanah.valuationBenefit : dict.tanah.valuationLoss}
                        </span>
                        <span className={`text-sm font-bold ${
                          valuationBenefit >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          {valuationBenefit >= 0 ? "" : "-"}{formatIDR(Math.abs(valuationBenefit))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: POV PENJUAL */}
              {activeTab === "seller" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                      {dict.tanah.sellerAnalysisTitle}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {dict.tanah.sellerSide}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Basic Selling Price */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.rumah.price}</span>
                      <span className="font-semibold text-foreground">{formatIDR(price)}</span>
                    </div>

                    {/* Deductions */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">{dict.tanah.pph}</span>
                      <span className="font-semibold text-rose-500">-{formatIDR(pphFinal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">
                        {dict.tanah.notaris} <span className="text-[9px] text-zinc-400">{dict.tanah.notarisDesc}</span>
                      </span>
                      <span className="font-semibold text-rose-500">-{formatIDR(ajbBagi)}</span>
                    </div>

                    {/* Net Cash Received */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mt-1">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{dict.tanah.netReceived}</span>
                      <span className="text-base font-extrabold text-emerald-500">{formatIDR(uangBersihPenjual)}</span>
                    </div>

                    {/* Initial Price & Growth comparison */}
                    <div className="flex flex-col gap-2 border-t border-card-border/50 pt-3.5 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">{dict.tanah.sellerInitialPrice}</span>
                        <span className="font-semibold text-foreground">{formatIDR(sellerInitialPrice)}</span>
                      </div>
                      
                      {/* Capital Gain */}
                      <div className={`flex justify-between items-center p-3 rounded-xl border ${
                        capitalGain >= 0
                          ? "bg-emerald-500/[0.03] border-emerald-500/10"
                          : "bg-rose-500/[0.03] border-rose-500/10"
                      }`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-zinc-500">{dict.tanah.capitalGain}</span>
                          <span className="text-[9px] text-zinc-400">{dict.tanah.capitalGainDesc}</span>
                        </div>
                        <span className={`text-sm font-bold ${
                          capitalGain >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          {capitalGain >= 0 ? "+" : ""}{formatIDR(capitalGain)}
                        </span>
                      </div>

                      {/* ROI & CAGR Grid */}
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                          <span className="block text-[10px] text-zinc-400 font-semibold uppercase">{dict.tanah.roi}</span>
                          <span className={`text-base font-extrabold block mt-0.5 ${
                            capitalGain >= 0 ? "text-emerald-500" : "text-rose-500"
                          }`}>
                            {roi.toFixed(1)}%
                          </span>
                        </div>
                        <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-400 font-semibold uppercase">{dict.tanah.cagr}</span>
                            <span className="text-[8px] text-zinc-500 -mt-0.5">{dict.tanah.cagrDesc}</span>
                          </div>
                          <span className={`text-base font-extrabold block mt-0.5 ${
                            capitalGain >= 0 ? "text-emerald-500" : "text-rose-500"
                          }`}>
                            {cagr.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DEAL ANALYZER */}
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

                  {/* Verdict Cards */}
                  {price < marketPrice ? (
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
                  ) : price > marketPrice ? (
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

                  {/* Price comparison numeric details */}
                  <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4">
                    <h4 className="text-xs font-bold text-foreground">
                      {dict.tanah.dealBalance}
                    </h4>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block"></span>
                          {dict.tanah.dealPrice}
                        </span>
                        <span className="font-bold text-indigo-500">{formatIDR(price)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                          {dict.tanah.marketVal}
                        </span>
                        <span className="font-bold text-emerald-500">{formatIDR(marketPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-zinc-400 rounded-full inline-block"></span>
                          {dict.tanah.njopVal} (NJOP)
                        </span>
                        <span className="font-bold text-zinc-500 dark:text-zinc-300">{formatIDR(njop)}</span>
                      </div>
                    </div>

                    {/* Comparison Bars */}
                    <div className="flex flex-col gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] p-4 rounded-xl border border-card-border mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        {dict.tanah.comparisonChart || "Grafik Komparasi"}
                      </span>

                      {/* Deal price relative bar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-zinc-400">
                          <span>{dict.tanah.dealPrice}</span>
                          <span>{((price / Math.max(price, marketPrice, njop)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(price / Math.max(price, marketPrice, njop)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Market price relative bar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-zinc-400">
                          <span>{dict.tanah.marketVal}</span>
                          <span>{((marketPrice / Math.max(price, marketPrice, njop)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(marketPrice / Math.max(price, marketPrice, njop)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* NJOP relative bar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-zinc-400">
                          <span>{dict.tanah.njopVal}</span>
                          <span>{((njop / Math.max(price, marketPrice, njop)) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-zinc-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(njop / Math.max(price, marketPrice, njop)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* NJOP Tax Warning */}
                    {price < njop && (
                      <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed flex gap-2">
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

              {/* DETAILS SECTION: RINCIAN PBB TAHUNAN */}
              <div className="flex flex-col gap-3.5 border-t border-card-border/50 pt-4 mt-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4.5 w-4.5 text-indigo-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0112 3m0 0c2.917 0 5.747.294 8.5.862m-21 10.398c0-.552.448-1 1-1h6.25a1 1 0 011 1v3.875a1 1 0 01-1 1H2.5a1 1 0 01-1-1v-3.875z"
                    />
                  </svg>
                  <span>Rincian PBB Tahunan Properti</span>
                </h4>

                <div className="flex flex-col gap-2 bg-black/[0.01] dark:bg-white/[0.01] p-3.5 rounded-xl border border-card-border text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/30">
                    <span className="text-zinc-500">Dasar Pengenaan (NJOP Total)</span>
                    <span className="font-semibold text-foreground">{formatIDR(njop)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/30">
                    <span className="text-zinc-500">NJOPTKP Pengurang</span>
                    <span className="font-semibold text-rose-500">-{formatIDR(njoptkpPbb)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/30">
                    <span className="text-zinc-500">NJOP Kena Pajak Bersih</span>
                    <span className="font-semibold text-foreground">{formatIDR(pbbBase)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/30">
                    <span className="text-zinc-500">Persentase NJKP ({njkpPercent}%)</span>
                    <span className="font-semibold text-foreground">
                      {formatIDR(pbbBase * (njkpPercent / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/30">
                    <span className="text-zinc-500">PBB Terutang ({tarifPbb}%)</span>
                    <span className="font-semibold text-foreground">{formatIDR(pbbTerutang)}</span>
                  </div>
                  {stimulusPbb > 0 && (
                    <div className="flex justify-between items-center py-1.5 border-b border-card-border/30 text-emerald-600 dark:text-emerald-400">
                      <span>Diskon Stimulus ({stimulusPbb}%)</span>
                      <span>-{formatIDR(stimulusAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 text-indigo-500 font-extrabold text-sm">
                    <span>{dict.rumah.pbbYangHarusDibayar}</span>
                    <span>{formatIDR(pbbYangHarusDibayar)} / thn</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
