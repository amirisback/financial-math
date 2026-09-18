"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";

interface SavingsCalculatorProps {
  dict: Dictionary;
}

interface YearRecord {
  year: number;
  principal: number;
  interestAc: number;
  balance: number;
}

export function SavingsCalculator({ dict }: SavingsCalculatorProps) {
  // Skenario default riil: Modal Awal = Rp10.000.000; Setoran = Rp2.000.000/bulan; Imbal Hasil = 5.5%; Tenor = 5 Tahun; Pajak = OFF; Admin = Rp0.
  const [initial, setInitial] = useState<number>(10000000);
  const [monthly, setMonthly] = useState<number>(2000000);
  const [rate, setRate] = useState<number>(5.5);
  const [duration, setDuration] = useState<number>(5);
  const [taxToggle, setTaxToggle] = useState<boolean>(false);
  const [adminFee, setAdminFee] = useState<number>(0);

  // Format IDR Helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Perhitungan Bulanan
  const totalMonths = duration * 12;
  const bungaBulananRiil = rate / 12 / 100;
  const bungaBulananBersih = taxToggle ? bungaBulananRiil * 0.8 : bungaBulananRiil;

  let currentBalance = initial;
  let totalPrincipal = initial;
  const yearlyRecords: YearRecord[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const bungaBulanIni = currentBalance * bungaBulananBersih;
    // Rumus: Saldo Bulan Ini = (Saldo Bulan Lalu * (1 + Bunga bulanan bersih)) + Setoran Rutin - Biaya Admin Bulanan
    currentBalance = currentBalance + bungaBulanIni + monthly - adminFee;
    totalPrincipal += monthly;

    // Record data akhir tahun
    if (m % 12 === 0) {
      const year = m / 12;
      const totalAccumulatedInterest = currentBalance - totalPrincipal + (adminFee * m);
      yearlyRecords.push({
        year,
        principal: totalPrincipal,
        interestAc: Math.max(0, totalAccumulatedInterest),
        balance: currentBalance,
      });
    }
  }

  const totalInterestNet = currentBalance - totalPrincipal;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {dict.menabung.title}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {dict.menabung.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Form Column (Left/7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg">
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Modal Awal */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="initial-input" className="text-sm font-semibold text-foreground">
                    {dict.menabung.initial}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(initial)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="initial-input"
                    type="range"
                    min="0"
                    max="100000000"
                    step="500000"
                    value={initial}
                    onChange={(e) => setInitial(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="500000"
                    value={initial}
                    onChange={(e) => setInitial(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Rp0</span>
                  <span>Rp50.000.000</span>
                  <span>Rp100.000.000</span>
                </div>
              </div>

              {/* Setoran Bulanan */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="monthly-input" className="text-sm font-semibold text-foreground">
                    {dict.menabung.monthly}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(monthly)} / bln
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="monthly-input"
                    type="range"
                    min="0"
                    max="20000000"
                    step="100000"
                    value={monthly}
                    onChange={(e) => setMonthly(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="20000000"
                    step="100000"
                    value={monthly}
                    onChange={(e) => setMonthly(Number(e.target.value))}
                    className="w-full sm:w-32 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Rp0</span>
                  <span>Rp10.000.000</span>
                  <span>Rp20.000.000</span>
                </div>
              </div>

              {/* Suku Bunga per Tahun */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="rate-input" className="text-sm font-semibold text-foreground">
                    {dict.menabung.rate}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {rate}%
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="rate-input"
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>0.5%</span>
                  <span>10%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Tenor Menabung */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="duration-input" className="text-sm font-semibold text-foreground">
                    {dict.menabung.duration}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {duration} {dict.depresiasi.lifeSpan}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="duration-input"
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>1 Tahun</span>
                  <span>15 Tahun</span>
                  <span>30 Tahun</span>
                </div>
              </div>

              {/* Pajak Bunga */}
              <div className="flex items-center justify-between border-t border-card-border/50 pt-4">
                <div className="flex flex-col">
                  <label htmlFor="tax-toggle" className="text-sm font-semibold text-foreground">
                    {dict.menabung.taxToggle}
                  </label>
                </div>
                <button
                  id="tax-toggle"
                  type="button"
                  onClick={() => setTaxToggle(!taxToggle)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    taxToggle ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      taxToggle ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Admin Fee Input */}
              <div className="flex flex-col gap-2 border-t border-card-border/50 pt-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="admin-input" className="text-sm font-semibold text-foreground">
                    {dict.menabung.adminFee}
                  </label>
                  <span className="text-base font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                    {formatIDR(adminFee)} / bln
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    id="admin-input"
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={adminFee}
                    onChange={(e) => setAdminFee(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="5000"
                    value={adminFee}
                    onChange={(e) => setAdminFee(Number(e.target.value))}
                    className="w-full sm:w-28 px-3 py-1.5 text-center text-xs font-semibold rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
                <li>{dict.menabung.dos1}</li>
                <li>{dict.menabung.dos2}</li>
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
                <li>{dict.menabung.donts1}</li>
                <li>{dict.menabung.donts2}</li>
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
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-1.971-.659-1.171-.879-1.171-2.303 0-3.182 1.171-.879 3.07-.879 4.242 0L15 8.818"
                  />
                </svg>
                Akumulasi Compound Interest
              </h3>

              {/* Total Dana Bersih Terkumpul (Utama) */}
              <div className="flex flex-col gap-1 items-center justify-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {dict.menabung.totalNet}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight animate-fade-in py-1">
                  {formatIDR(currentBalance)}
                </span>
              </div>

              {/* Modal vs Bunga */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
                  <span className="text-[10px] text-zinc-500">{dict.menabung.totalPrincipal}</span>
                  <span className="text-sm font-bold text-foreground">{formatIDR(totalPrincipal)}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
                  <span className="text-[10px] text-zinc-500">{dict.menabung.totalInterest}</span>
                  <span className="text-sm font-bold text-emerald-500">{formatIDR(totalInterestNet)}</span>
                </div>
              </div>

              {/* Premium Visual SVG Line Chart */}
              {yearlyRecords.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                    {dict.menabung.chartTitle}
                  </span>
                  <div className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-card-border rounded-2xl p-4 flex justify-center items-center">
                    <svg viewBox="0 0 300 120" className="w-full h-auto">
                      {/* Grid Lines */}
                      <line x1="20" y1="10" x2="280" y2="10" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="20" y1="50" x2="280" y2="50" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="20" y1="90" x2="280" y2="90" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      
                      {/* Generasikan Polyline Path */}
                      {(() => {
                        const maxVal = yearlyRecords[yearlyRecords.length - 1].balance;
                        const points = yearlyRecords.map((r, idx) => {
                          const x = 20 + (idx / (yearlyRecords.length - 1)) * 260;
                          const y = 100 - (r.balance / maxVal) * 80;
                          return `${x},${y}`;
                        });
                        
                        const principalPoints = yearlyRecords.map((r, idx) => {
                          const x = 20 + (idx / (yearlyRecords.length - 1)) * 260;
                          const y = 100 - (r.principal / maxVal) * 80;
                          return `${x},${y}`;
                        });

                        return (
                          <>
                            {/* Principal line (gray) */}
                            <polyline
                              fill="none"
                              stroke="#9ca3af"
                              strokeWidth="1.5"
                              strokeDasharray="4"
                              points={`20,100 ${principalPoints.join(" ")}`}
                            />
                            {/* Balance line (indigo gradient color) */}
                            <polyline
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="3"
                              strokeLinecap="round"
                              points={`20,100 ${points.join(" ")}`}
                            />
                            {/* Highlight Dots */}
                            {yearlyRecords.map((r, idx) => {
                              const x = 20 + (idx / (yearlyRecords.length - 1)) * 260;
                              const y = 100 - (r.balance / maxVal) * 80;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  className="fill-indigo-500 stroke-white dark:stroke-zinc-900 stroke-2"
                                />
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* Year Labels */}
                      <text x="20" y="112" fontSize="8" className="fill-zinc-400 font-sans" textAnchor="middle">Mulai</text>
                      {yearlyRecords.map((r, idx) => {
                        const x = 20 + (idx / (yearlyRecords.length - 1)) * 260;
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
                  {dict.menabung.tableTitle}
                </span>
                <div className="overflow-x-auto max-h-48 border border-card-border rounded-xl">
                  <table className="min-w-full text-left border-collapse text-xs">
                    <thead className="bg-black/[0.02] dark:bg-white/[0.04] text-zinc-500 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2 border-b border-card-border">{dict.menabung.year}</th>
                        <th className="p-2 border-b border-card-border">{dict.menabung.principal}</th>
                        <th className="p-2 border-b border-card-border">{dict.menabung.interestAc}</th>
                        <th className="p-2 border-b border-card-border">{dict.menabung.balance}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {yearlyRecords.map((rec) => (
                        <tr key={rec.year} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                          <td className="p-2 font-medium text-foreground">Th {rec.year}</td>
                          <td className="p-2 text-zinc-500">{formatIDR(rec.principal)}</td>
                          <td className="p-2 text-emerald-500 font-medium">{formatIDR(rec.interestAc)}</td>
                          <td className="p-2 font-semibold text-indigo-500">{formatIDR(rec.balance)}</td>
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
