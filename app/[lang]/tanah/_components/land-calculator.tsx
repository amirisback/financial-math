"use client";

import { useState } from "react";
import type { Dictionary } from "../../dictionaries";
import { Card, CardContent } from "../../_components/ui/card";

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
                <input
                  id="area-input"
                  type="range"
                  min="20"
                  max="10000"
                  step="10"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                />
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
                  <input
                    id="price-per-m2"
                    type="range"
                    min="200000"
                    max="50000000"
                    step="100000"
                    value={pricePerM2}
                    onChange={(e) => setPricePerM2(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
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
                  <input
                    id="total-price"
                    type="range"
                    min="10000000"
                    max="10000000000"
                    step="10000000"
                    value={totalPriceKesepakatan}
                    onChange={(e) => setTotalPriceKesepakatan(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
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
                <input
                  id="njop-input"
                  type="range"
                  min="100000"
                  max="40000000"
                  step="100000"
                  value={njopPerM2}
                  onChange={(e) => setNjopPerM2(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                />
              </div>

              {/* NPTKP and Incentive */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.tanah.nptkp}</span>
                    <span className="text-[10px] font-normal text-zinc-400">{dict.tanah.nptkpDesc}</span>
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
          <Card className="border border-card-border bg-card-bg shadow-lg glass-panel-glow">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* SISI PENJUAL */}
              <div className="flex flex-col gap-4 border-b border-card-border/50 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  {dict.tanah.sellerSide}
                </h3>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">{dict.tanah.pph}</span>
                    <span className="text-xs font-semibold text-rose-500">-{formatIDR(pphFinal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">
                      {dict.tanah.notaris} <span className="text-[9px] text-zinc-400">{dict.tanah.notarisDesc}</span>
                    </span>
                    <span className="text-xs font-semibold text-rose-500">-{formatIDR(AJBBagi)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mt-1">
                    <span className="text-xs font-bold text-foreground">{dict.tanah.netReceived}</span>
                    <span className="text-base font-extrabold text-emerald-500">{formatIDR(uangBersihPenjual)}</span>
                  </div>
                </div>
              </div>

              {/* SISI PEMBELI */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  {dict.tanah.buyerSide}
                </h3>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Pajak BPHTB</span>
                    <span className="text-xs font-semibold text-rose-500">{formatIDR(bphtb)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">AJB Notaris</span>
                    <span className="text-xs font-semibold text-rose-500">{formatIDR(AJBBagi)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">BBN PPAT Paket</span>
                    <span className="text-xs font-semibold text-rose-500">{formatIDR(bbnResmi)}</span>
                  </div>
                  {statusPembeli === "kpr" && (
                    <div className="flex flex-col gap-2 border-t border-dashed border-card-border/50 pt-2.5 my-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-500">{dict.tanah.plafon}</span>
                        <span className="text-xs font-semibold">{formatIDR(plafon)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-500">Biaya KPR Bank</span>
                        <span className="text-xs font-semibold text-rose-500">{formatIDR(bankFees)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-500">{dict.tanah.installment}</span>
                        <span className="text-sm font-bold text-primary">{formatIDR(installment)} / bln</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-500">{dict.tanah.ratio}</span>
                          <span className="text-[9px] text-zinc-400">{dict.tanah.ratioDesc}</span>
                        </div>
                        <span className="text-xs font-semibold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                          {formatIDR(minIncome)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-1">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{dict.tanah.cashRequired}</span>
                      <span className="text-[9px] text-zinc-400">{dict.tanah.cashRequiredDesc}</span>
                    </div>
                    <span className="text-base font-extrabold text-indigo-500">{formatIDR(cashRequiredPembeli)}</span>
                  </div>
                </div>
              </div>
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
