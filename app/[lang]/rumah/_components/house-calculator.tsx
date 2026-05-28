"use client";

import { useState } from "react";
import type { Dictionary } from "../../dictionaries";
import { Card, CardContent } from "../../_components/ui/card";

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

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Perhitungan
  const acuanPajak = Math.max(price, njop);

  // BPHTB (Pajak Pembeli 5% setelah dikurangi NPTKP)
  const bphtbBase = acuanPajak - nptkp;
  const bphtb = bphtbBase > 0 ? 0.05 * bphtbBase : 0;

  // AJB Notaris (Estimasi 1% ditanggung Pembeli)
  const ajbNotaris = 0.01 * price;

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

  // Total Dana Siap di Awal
  const totalDanaSiapAwal = statusPembeli === "cash"
    ? price + bphtb + ajbNotaris + bbnPaket
    : dpAmount + bphtb + ajbNotaris + bbnPaket + totalKprAndInsurance + saldoMengendap;

  // Pendapatan Minimum (3x cicilan)
  const minIncome = installment * 3;

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
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Input: Harga Rumah */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="price-input" className="text-sm font-semibold text-foreground">
                    {dict.rumah.price}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(price)}
                  </span>
                </div>
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
                    // Sesuaikan NJOP otomatis agar proporsional sebagai pembantu input
                    setNjop(Math.round(val * 0.8));
                  }}
                  className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                />
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
                <input
                  id="njop-input"
                  type="range"
                  min="40000000"
                  max="4000000000"
                  step="10000000"
                  value={njop}
                  onChange={(e) => setNjop(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                />
              </div>

              {/* NPTKP Selector */}
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
                <div className="flex flex-col gap-4 border-t border-card-border/50 pt-4">
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
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow">
            <CardContent className="flex flex-col gap-6 pt-6">
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0112 3m0 0c2.917 0 5.747.294 8.5.862m-21 10.398c0-.552.448-1 1-1h6.25a1 1 0 011 1v3.875a1 1 0 01-1 1H2.5a1 1 0 01-1-1v-3.875z"
                  />
                </svg>
                Rencana Biaya Akuisisi Rumah
              </h3>

              <div className="flex flex-col gap-3">
                {statusPembeli === "kpr" ? (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">Uang Muka (DP)</span>
                      <span className="text-sm font-semibold">{formatIDR(dpAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.rumah.provisi}</span>
                      <span className="text-xs font-semibold text-rose-500">+{formatIDR(provisi)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.rumah.admin}</span>
                      <span className="text-xs font-semibold text-rose-500">+{formatIDR(adminKpr)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <span className="text-xs text-zinc-500">{dict.rumah.apht}</span>
                      <span className="text-xs font-semibold text-rose-500">+{formatIDR(apht)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500">{dict.rumah.insurance}</span>
                        <span className="text-[9px] text-zinc-400">{dict.rumah.insuranceDesc}</span>
                      </div>
                      <span className="text-xs font-semibold text-rose-500">+{formatIDR(insuranceAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500">{dict.rumah.holdBalance}</span>
                        <span className="text-[9px] text-zinc-400">{dict.rumah.holdBalanceDesc}</span>
                      </div>
                      <span className="text-xs font-semibold text-rose-500">+{formatIDR(saldoMengendap)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                    <span className="text-xs text-zinc-500">Harga Rumah Kesepakatan</span>
                    <span className="text-sm font-semibold">{formatIDR(price)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                  <span className="text-xs text-zinc-500">Pajak BPHTB Pembeli</span>
                  <span className="text-xs font-semibold text-rose-500">+{formatIDR(bphtb)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                  <span className="text-xs text-zinc-500">AJB Notaris PPAT</span>
                  <span className="text-xs font-semibold text-rose-500">+{formatIDR(ajbNotaris)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                  <span className="text-xs text-zinc-500">BBN Resmi & Paket PPAT</span>
                  <span className="text-xs font-semibold text-rose-500">+{formatIDR(bbnPaket)}</span>
                </div>

                {statusPembeli === "kpr" && (
                  <div className="flex flex-col gap-2 bg-primary/5 p-4 rounded-xl border border-primary/10 my-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">{dict.tanah.installment}</span>
                      <span className="text-base font-extrabold text-primary">{formatIDR(installment)} / bln</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{dict.rumah.minIncome}</span>
                        <span className="text-[9px] text-zinc-400">{dict.rumah.minIncomeDesc}</span>
                      </div>
                      <span className="text-sm font-extrabold text-amber-500">{formatIDR(minIncome)} / bln</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">{dict.rumah.totalInitial}</span>
                    <span className="text-[9px] text-zinc-400">{dict.rumah.totalInitialDesc}</span>
                  </div>
                  <span className="text-xl font-black text-indigo-500 tracking-tight">{formatIDR(totalDanaSiapAwal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
