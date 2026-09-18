"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";

interface DepreciationCalculatorProps {
  dict: Dictionary;
}

interface DepRecord {
  year: number;
  depRate: number;
  resaleValue: number;
}

export function DepreciationCalculator({ dict }: DepreciationCalculatorProps) {
  // Skenario default riil: Kategori = Mobil Bekas; Harga Beli Seken = Rp180.000.000; Umur Ekonomis = 5 Tahun; Depresiasi = Preset Mobil Bekas (8%/tahun).
  const [category, setCategory] = useState<string>("mobil-bekas");
  const [price, setPrice] = useState<number>(180000000);
  const [lifeSpan, setLifeSpan] = useState<number>(5);
  const [manualRate, setManualRate] = useState<number>(8);

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Logika Rumus & Iterasi Tahunan
  const records: DepRecord[] = [];
  let currentVal = price;

  for (let i = 1; i <= lifeSpan; i++) {
    let rate = 0;
    
    if (category === "gadget") {
      rate = i === 1 ? 40 : 20;
    } else if (category === "mobil-baru") {
      rate = i === 1 ? 20 : 10;
    } else if (category === "mobil-bekas") {
      rate = 8;
    } else if (category === "motor") {
      rate = i === 1 ? 15 : 12;
    } else {
      rate = manualRate;
    }

    const depAmount = currentVal * (rate / 100);
    currentVal = currentVal - depAmount;

    records.push({
      year: i,
      depRate: rate,
      resaleValue: currentVal,
    });
  }

  const resaleValueEnd = currentVal;
  const totalDepreciation = price - resaleValueEnd;
  const comfortFeeMonthly = lifeSpan > 0 ? totalDepreciation / (lifeSpan * 12) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.depresiasi.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.depresiasi.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Form Column (Left/7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Kategori Barang */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  {dict.depresiasi.category}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="mobil-bekas" className="bg-background">{dict.depresiasi.catMobilUsed} (8%/tahun)</option>
                  <option value="mobil-baru" className="bg-background">{dict.depresiasi.catMobilNew} (Showroom shock drop: 20% / 10%)</option>
                  <option value="gadget" className="bg-background">{dict.depresiasi.catGadget} (Shock drop: 40% / 20%)</option>
                  <option value="motor" className="bg-background">{dict.depresiasi.catMotor} (Shock drop: 15% / 12%)</option>
                  <option value="manual" className="bg-background">{dict.depresiasi.catManual}</option>
                </select>
              </div>

              {/* Input Manual Rate jika Kategori Manual */}
              {category === "manual" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="manual-rate-input" className="text-sm font-semibold text-foreground">
                      {dict.depresiasi.manualRate}
                    </label>
                    <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                      {manualRate}% / tahun
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      id="manual-rate-input"
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={manualRate}
                      onChange={(e) => setManualRate(Number(e.target.value))}
                      className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={manualRate}
                      onChange={(e) => setManualRate(Number(e.target.value))}
                      className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Harga Beli */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="price-input-dep" className="text-sm font-semibold text-foreground">
                    {dict.depresiasi.buyPrice}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(price)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="price-input-dep"
                    type="range"
                    min="1000000"
                    max="2000000000"
                    step="5000000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1000000"
                    max="2000000000"
                    step="5000000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Rp1.000.000</span>
                  <span>Rp1.000.000.000</span>
                  <span>Rp2.000.000.000</span>
                </div>
              </div>

              {/* Masa Penggunaan */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="lifespan-input" className="text-sm font-semibold text-foreground">
                    {dict.depresiasi.lifeSpan}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {lifeSpan} Tahun
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="lifespan-input"
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={lifeSpan}
                    onChange={(e) => setLifeSpan(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="15"
                    step="1"
                    value={lifeSpan}
                    onChange={(e) => setLifeSpan(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>1 Tahun</span>
                  <span>8 Tahun</span>
                  <span>15 Tahun</span>
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
                <li>{dict.depresiasi.dos1}</li>
                <li>{dict.depresiasi.dos2}</li>
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
                <li>{dict.depresiasi.donts1}</li>
                <li>{dict.depresiasi.donts2}</li>
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
                    d="M19.5 8.25l-7.5 7.5-3.75-3.75m3 2.5l3-3m-7.25-2.5h16.5a1.5 1.5 0 001.5-1.5v-1.5A1.5 1.5 0 0018 3H6a1.5 1.5 0 00-1.5 1.5v1.5A1.5 1.5 0 006 7.5z"
                  />
                </svg>
                Estimasi Penurunan Nilai Barang
              </h3>

              {/* Resale Value Tahun Akhir (Utama) */}
              <div className="flex flex-col gap-1 items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {dict.depresiasi.resaleVal.replace("{year}", lifeSpan.toString())}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight py-1 animate-fade-in">
                  {formatIDR(resaleValueEnd)}
                </span>
              </div>

              {/* Total Penyusutan & Biaya Kenyamanan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
                  <span className="text-[10px] text-zinc-500">{dict.depresiasi.totalDep}</span>
                  <span className="text-sm font-bold text-rose-500">{formatIDR(totalDepreciation)}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500">{dict.depresiasi.comfortFee}</span>
                    <span className="text-[8px] text-zinc-400">{dict.depresiasi.comfortFeeDesc}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{formatIDR(comfortFeeMonthly)} / bln</span>
                </div>
              </div>

              {/* Premium Visual SVG Decay Chart */}
              {records.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                    {dict.depresiasi.chartTitle}
                  </span>
                  <div className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-card-border rounded-2xl p-4 flex justify-center items-center">
                    <svg viewBox="0 0 300 120" className="w-full h-auto">
                      {/* Grid Lines */}
                      <line x1="20" y1="10" x2="280" y2="10" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="20" y1="50" x2="280" y2="50" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="20" y1="90" x2="280" y2="90" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />

                      {(() => {
                        const points = records.map((r, idx) => {
                          const x = 20 + (idx / (records.length - 1)) * 260;
                          const y = 10 + (1 - r.resaleValue / price) * 80;
                          return `${x},${y}`;
                        });

                        return (
                          <>
                            {/* Decay Line (rose gradient) */}
                            <polyline
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="3"
                              strokeLinecap="round"
                              points={`20,10 ${points.join(" ")}`}
                            />
                            {/* Highlight Dots */}
                            {records.map((r, idx) => {
                              const x = 20 + (idx / (records.length - 1)) * 260;
                              const y = 10 + (1 - r.resaleValue / price) * 80;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  className="fill-rose-500 stroke-white dark:stroke-zinc-900 stroke-2"
                                />
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* Year Labels */}
                      <text x="20" y="112" fontSize="8" className="fill-zinc-400 font-sans" textAnchor="middle">Beli</text>
                      {records.map((r, idx) => {
                        const x = 20 + (idx / (records.length - 1)) * 260;
                        return (
                          <text key={idx} x={x} y="112" fontSize="8" className="fill-zinc-400 font-sans" textAnchor="middle">
                            Th {r.year}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}

              {/* Yearly breakdown table */}
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                  {dict.depresiasi.tableTitle}
                </span>
                <div className="overflow-x-auto max-h-48 border border-card-border rounded-xl">
                  <table className="min-w-full text-left border-collapse text-xs">
                    <thead className="bg-black/[0.02] dark:bg-white/[0.04] text-zinc-500 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2 border-b border-card-border">{dict.depresiasi.year}</th>
                        <th className="p-2 border-b border-card-border">{dict.depresiasi.depPercentage}</th>
                        <th className="p-2 border-b border-card-border">{dict.depresiasi.resale}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {records.map((rec) => (
                        <tr key={rec.year} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                          <td className="p-2 font-medium text-foreground">Tahun {rec.year}</td>
                          <td className="p-2 text-rose-500 font-medium">-{rec.depRate}%</td>
                          <td className="p-2 font-semibold text-indigo-500">{formatIDR(rec.resaleValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
