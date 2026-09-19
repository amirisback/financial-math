"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";

interface PricingCalculatorProps {
  dict: Dictionary;
}

export function PricingCalculator({ dict }: PricingCalculatorProps) {
  // Skenario default riil: HPP Rice Bowl = Rp15.000; Biaya Tetap = Rp4.500.000; Target Jualan = 500 unit; Margin = 40%; Pajak = PPh Final UMKM 0.5%.
  const [hpp, setHpp] = useState<number>(15000);
  const [opex, setOpex] = useState<number>(4500000);
  const [volume, setVolume] = useState<number>(500);
  const [margin, setMargin] = useState<number>(40);
  const [tax, setTax] = useState<string>("pph");

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Logika Rumus
  const biayaOpsPerUnit = volume > 0 ? opex / volume : 0;
  const totalBiayaPerUnit = hpp + biayaOpsPerUnit;
  
  // Harga Jual Dasar sebelum pajak
  const marginFactor = 1 - margin / 100;
  const hargaJualDasar = marginFactor > 0 ? totalBiayaPerUnit / marginFactor : totalBiayaPerUnit;
  
  // Penyesuaian Pajak
  let hargaJual = hargaJualDasar;

  if (tax === "pph") {
    hargaJual = hargaJualDasar / (1 - 0.005);
  } else if (tax === "ppn") {
    hargaJual = hargaJualDasar * 1.11;
  }

  // Pembulatan ke ribuan teratas
  const hargaPembulatan = Math.ceil(hargaJual / 1000) * 1000;
  
  // Pajak setelah pembulatan
  let pajakPembulatanPerUnit = 0;
  if (tax === "pph") {
    pajakPembulatanPerUnit = hargaPembulatan * 0.005;
  } else if (tax === "ppn") {
    // PPN 11% dari harga dasar (harga dasar = hargaPembulatan / 1.11)
    const dasarPembulatan = hargaPembulatan / 1.11;
    pajakPembulatanPerUnit = dasarPembulatan * 0.11;
  }

  // Estimasi Profit Bersih Bulanan
  const profitBersih = (hargaPembulatan - totalBiayaPerUnit - pajakPembulatanPerUnit) * volume;
  
  // BEP dalam unit
  const bepDenom = hargaPembulatan - hpp;
  const bepUnit = bepDenom > 0 ? Math.ceil(opex / bepDenom) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.pricing.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.pricing.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Form Column (Left/7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Input: HPP */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="hpp-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.pricing.hpp}</span>
                    <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">{dict.pricing.hppHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(hpp)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="hpp-input"
                    type="range"
                    min="1000"
                    max="500000"
                    step="500"
                    value={hpp}
                    onChange={(e) => setHpp(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1000"
                    max="500000"
                    step="500"
                    value={hpp}
                    onChange={(e) => setHpp(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-2 text-center text-sm font-semibold rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[44px]"
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Rp1.000</span>
                  <span>Rp250.000</span>
                  <span>Rp500.000</span>
                </div>
              </div>

              {/* Input: OPEX */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="opex-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.pricing.opex}</span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.pricing.opexHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(opex)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="opex-input"
                    type="range"
                    min="0"
                    max="50000000"
                    step="100000"
                    value={opex}
                    onChange={(e) => setOpex(Number(e.target.value))}
                    className="flex-1 h-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50000000"
                    step="100000"
                    value={opex}
                    onChange={(e) => setOpex(Number(e.target.value))}
                    className="w-full sm:w-36 px-3 py-2 text-center text-sm font-semibold rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[44px]"
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Rp0</span>
                  <span>Rp25.000.000</span>
                  <span>Rp50.000.000</span>
                </div>
              </div>

              {/* Input: Volume */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="volume-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.pricing.volume}</span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.pricing.volumeHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {volume} Unit
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="volume-input"
                    type="range"
                    min="10"
                    max="10000"
                    step="10"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    step="10"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-2 text-center text-sm font-semibold rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[44px]"
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>10 unit</span>
                  <span>5.000 unit</span>
                  <span>10.000 unit</span>
                </div>
              </div>

              {/* Input: Margin */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="margin-input" className="text-sm font-semibold text-foreground flex flex-col">
                    <span>{dict.pricing.margin}</span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{dict.pricing.marginHelp}</span>
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {margin}%
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="margin-input"
                    type="range"
                    min="5"
                    max="95"
                    step="1"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="flex-1 h-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="5"
                    max="95"
                    step="1"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-2 text-center text-sm font-semibold rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[44px]"
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>5%</span>
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Input: Tax */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.pricing.tax}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "none", label: dict.pricing.taxNone },
                    { val: "pph", label: dict.pricing.taxPph },
                    { val: "ppn", label: dict.pricing.taxPpn },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setTax(item.val)}
                      className={`rounded-xl py-2.5 px-3 text-xs font-medium border transition-all duration-200 text-center cursor-pointer ${
                        tax === item.val
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-black/[0.02] border-card-border hover:bg-black/[0.04] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
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
                <li>{dict.pricing.dos1}</li>
                <li>{dict.pricing.dos2}</li>
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
                <li>{dict.pricing.donts1}</li>
                <li>{dict.pricing.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Column (Right/5cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border border-card-border bg-card-bg shadow-lg overflow-hidden glass-panel-glow">
            <CardContent className="flex flex-col gap-6 pt-6">
              <h3 className="text-lg font-bold border-b border-card-border pb-3 flex items-center gap-2">
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
                    d="M3.75 3v16.5M21 19.5H3.75M6.75 15h.008v.008H6.75V15zm0-3h.008v.008H6.75V12zm0-3h.008v.008H6.75V9zm4 6h.008v.008h-.008V15zm0-3h.008v.008h-.008V12zm0-3h.008v.008h-.008V9zm4 6h.008v.008h-.008V15zm0-3h.008v.008h-.008V12zm0-3h.008v.008h-.008V9zm4 6h.008v.008h-.008V15zm0-3h.008v.008h-.008V12zm0-3h.008v.008h-.008V9z"
                  />
                </svg>
                {dict.pricing.result}
              </h3>

              {/* Rekomendasi Harga Jual Bulat (Utama) */}
              <div className="flex flex-col gap-1 items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {dict.pricing.roundPrice}
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight animate-fade-in py-1">
                  {formatIDR(hargaPembulatan)}
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {dict.pricing.recPrice}: {formatIDR(hargaJual)}
                </span>
              </div>

              {/* Rincian Finansial Lainnya */}
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{dict.pricing.unitCost}</span>
                  <span className="text-sm font-semibold">{formatIDR(totalBiayaPerUnit)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Pajak per Unit</span>
                  <span className="text-sm font-semibold">{formatIDR(pajakPembulatanPerUnit)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-card-border/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{dict.pricing.bep}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{dict.pricing.bepDesc}</span>
                  </div>
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {bepUnit} Unit
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{dict.pricing.profit}</span>
                  <span className={`text-base font-bold ${profitBersih >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {formatIDR(profitBersih)}
                  </span>
                </div>
              </div>

              {/* BEP Visual Chart (Premium SVG Graphic) */}
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-zinc-600 dark:text-zinc-400">Visualisasi BEP vs Target</span>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between text-xs">
                    <div className="font-semibold text-amber-600 dark:text-amber-400">BEP ({bepUnit} U)</div>
                    <div className="text-right font-semibold text-primary">Target ({volume} U)</div>
                  </div>
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-zinc-200 dark:bg-zinc-800 border border-card-border">
                    {/* Progress Bar for BEP */}
                    <div
                      style={{ width: `${Math.min(100, (bepUnit / volume) * 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-500"
                    ></div>
                    {/* Remaining/Target Bar */}
                    <div
                      style={{ width: `${Math.max(0, 100 - (bepUnit / volume) * 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary/70 transition-all duration-500"
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    <span>0 U</span>
                    {bepUnit > volume && <span className="text-rose-500 font-bold">BEP melebihi Target Jualan!</span>}
                    <span>{volume} U</span>
                  </div>
                </div>
              </div>

              {/* Share Summary Button */}
              <div className="pt-3">
                <ShareSummaryButton
                  title="Simulasi Penetapan Harga & BEP Jualan"
                  summaryText={
                    `📊 *Simulasi Penetapan Harga Jual & BEP*\n` +
                    `• HPP Bahan per Unit: ${formatIDR(hpp)}\n` +
                    `• Biaya Operasional Tetap: ${formatIDR(opex)} / bulan\n` +
                    `• Target Volume: ${volume} unit / bulan\n` +
                    `• Margin Keuntungan: ${margin}%\n` +
                    `---------------------------------\n` +
                    `*Rekomendasi Harga Jual: ${formatIDR(hargaPembulatan)} / unit*\n` +
                    `*BEP (Titik Impas): ${bepUnit} unit*\n` +
                    `*Estimasi Profit Bersih: ${formatIDR(profitBersih)} / bulan*`
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
