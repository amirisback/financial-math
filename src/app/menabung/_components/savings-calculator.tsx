"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";

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
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-300 font-medium">
          {dict.menabung.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Input Form Column (Left/7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-card-border bg-card-bg shadow-sm">
            <CardContent className="flex flex-col gap-7 pt-6">
              {/* Modal Awal (CurrencyInput dengan Quick Presets) */}
              <CurrencyInput
                id="initial-input"
                label={dict.menabung.initial}
                value={initial}
                onChange={setInitial}
                min={0}
                max={100000000}
                step={500000}
                tickMarks={["Rp0", "Rp50 Juta", "Rp100 Juta"]}
                tooltip="Dana tunai pertama yang Anda alokasikan untuk tabungan atau deposito awal."
                quickPresets={[
                  { label: "+1 Jt", addAmount: 1000000 },
                  { label: "+5 Jt", addAmount: 5000000 },
                  { label: "+10 Jt", addAmount: 10000000 },
                  { label: "+50 Jt", addAmount: 50000000 },
                  { label: "Reset (Rp0)", setAmount: 0 },
                ]}
              />

              {/* Setoran Bulanan */}
              <CurrencyInput
                id="monthly-input"
                label={dict.menabung.monthly}
                value={monthly}
                onChange={setMonthly}
                min={0}
                max={20000000}
                step={100000}
                unit="bln"
                tickMarks={["Rp0", "Rp10 Juta", "Rp20 Juta"]}
                tooltip="Komitmen dana yang Anda sisihkan secara rutin setiap bulan dari penghasilan."
                quickPresets={[
                  { label: "+500 Rb", addAmount: 500000 },
                  { label: "+1 Jt", addAmount: 1000000 },
                  { label: "+2 Jt", addAmount: 2000000 },
                  { label: "+5 Jt", addAmount: 5000000 },
                ]}
              />

              {/* Suku Bunga per Tahun */}
              <CurrencyInput
                id="rate-input"
                label={dict.menabung.rate}
                value={rate}
                onChange={setRate}
                min={0.5}
                max={20}
                step={0.1}
                isCurrency={false}
                unit="%"
                tickMarks={["0.5%", "10%", "20%"]}
                tooltip="Tingkat imbal hasil rata-rata per tahun (deposito bank umumnya 3-5%, reksadana 5-8%)."
                quickPresets={[
                  { label: "3.5% (Bank)", setAmount: 3.5 },
                  { label: "5.5% (Deposito)", setAmount: 5.5 },
                  { label: "7.0% (Reksadana)", setAmount: 7.0 },
                  { label: "10.0% (Saham/Campuran)", setAmount: 10.0 },
                ]}
              />

              {/* Tenor Menabung */}
              <CurrencyInput
                id="duration-input"
                label={dict.menabung.duration}
                value={duration}
                onChange={setDuration}
                min={1}
                max={30}
                step={1}
                isCurrency={false}
                unit={dict.depresiasi.lifeSpan}
                tickMarks={["1 Tahun", "15 Tahun", "30 Tahun"]}
                tooltip="Target waktu menabung hingga dana digunakan (misal: dana pendidikan atau pensiun)."
                quickPresets={[
                  { label: "1 Tahun", setAmount: 1 },
                  { label: "3 Tahun", setAmount: 3 },
                  { label: "5 Tahun", setAmount: 5 },
                  { label: "10 Tahun", setAmount: 10 },
                  { label: "20 Tahun", setAmount: 20 },
                ]}
              />

              {/* Pajak Bunga (Pph Final 20% jika bunga > 7.5jt) */}
              <div className="flex items-center justify-between border-t border-card-border/60 pt-5">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {dict.menabung.taxToggle}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                    Pajak PPh Final 20% atas bunga bank (efektif untuk tabungan/deposito)
                  </span>
                </div>
                <button
                  id="tax-toggle"
                  type="button"
                  onClick={() => setTaxToggle(!taxToggle)}
                  className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    taxToggle ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  aria-label="Toggle pajak bunga"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                      taxToggle ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Admin Fee Input */}
              <div className="border-t border-card-border/60 pt-5">
                <CurrencyInput
                  id="admin-input"
                  label={dict.menabung.adminFee}
                  value={adminFee}
                  onChange={setAdminFee}
                  min={0}
                  max={100000}
                  step={5000}
                  unit="bln"
                  tickMarks={["Rp0", "Rp50.000", "Rp100.000"]}
                  tooltip="Biaya administrasi bulanan yang dipotong oleh pihak bank."
                  quickPresets={[
                    { label: "Rp0 (Bebas Biaya)", setAmount: 0 },
                    { label: "Rp12.000", setAmount: 12000 },
                    { label: "Rp15.000", setAmount: 15000 },
                    { label: "Rp20.000", setAmount: 20000 },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Do's & Don'ts Panel (Lebih jelas & kontras) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base">
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
              <ul className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 list-disc pl-4 flex flex-col gap-2 font-medium">
                <li>{dict.menabung.dos1}</li>
                <li>{dict.menabung.dos2}</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] dark:bg-rose-500/[0.08] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm sm:text-base">
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
              <ul className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 list-disc pl-4 flex flex-col gap-2 font-medium">
                <li>{dict.menabung.donts1}</li>
                <li>{dict.menabung.donts2}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Panel (Right/5cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <Card className="border-2 border-primary/30 bg-card-bg shadow-xl glass-panel-glow">
            <CardContent className="flex flex-col gap-6 pt-6">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 border-b border-card-border pb-3 flex items-center gap-2">
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
                Akumulasi Bunga & Tabungan
              </h3>

              {/* Total Dana Bersih Terkumpul (Utama) */}
              <div className="flex flex-col gap-1.5 items-center justify-center p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <span className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                  {dict.menabung.totalNet}
                </span>
                <span className="text-2xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight animate-fade-in py-1">
                  {formatIDR(currentBalance)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Estimasi saldo akhir setelah {duration} tahun
                </span>
              </div>

              {/* Modal vs Bunga */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{dict.menabung.totalPrincipal}</span>
                  <span className="text-sm sm:text-base font-extrabold text-foreground">{formatIDR(totalPrincipal)}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{dict.menabung.totalInterest}</span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatIDR(totalInterestNet)}</span>
                </div>
              </div>

              {/* Tombol Salin Ringkasan untuk Keluarga / WhatsApp */}
              <ShareSummaryButton
                title="Tabungan & Compound Interest"
                items={[
                  { label: "Modal Awal", value: formatIDR(initial) },
                  { label: "Setoran Bulanan", value: `${formatIDR(monthly)} / bulan` },
                  { label: "Imbal Hasil (Bunga)", value: `${rate}% / tahun` },
                  { label: "Jangka Waktu", value: `${duration} Tahun` },
                  { label: "Total Modal Disetor", value: formatIDR(totalPrincipal) },
                  { label: "Total Bunga Bersih", value: formatIDR(totalInterestNet), highlight: true },
                  { label: "Total Dana Akhir", value: formatIDR(currentBalance), highlight: true },
                ]}
                featureUrl="https://financial-math.app/menabung"
              />

              {/* Visual SVG Line Chart dengan Label Jelas */}
              {yearlyRecords.length > 0 && (
                <div className="mt-1 flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-600 dark:text-zinc-300">
                    {dict.menabung.chartTitle}
                  </span>
                  <div className="w-full bg-black/[0.02] dark:bg-white/[0.03] border border-card-border rounded-2xl p-4 flex justify-center items-center">
                    <svg viewBox="0 0 300 130" className="w-full h-auto">
                      {/* Grid Lines */}
                      <line x1="20" y1="15" x2="280" y2="15" stroke="rgba(156,163,175,0.25)" strokeWidth="1" />
                      <line x1="20" y1="55" x2="280" y2="55" stroke="rgba(156,163,175,0.25)" strokeWidth="1" />
                      <line x1="20" y1="95" x2="280" y2="95" stroke="rgba(156,163,175,0.25)" strokeWidth="1" />
                      
                      {/* Polyline Path */}
                      {(() => {
                        const maxVal = yearlyRecords[yearlyRecords.length - 1].balance;
                        const points = yearlyRecords.map((r, idx) => {
                          const x = 25 + (idx / (yearlyRecords.length - 1)) * 250;
                          const y = 95 - (r.balance / maxVal) * 80;
                          return `${x},${y}`;
                        });
                        
                        const principalPoints = yearlyRecords.map((r, idx) => {
                          const x = 25 + (idx / (yearlyRecords.length - 1)) * 250;
                          const y = 95 - (r.principal / maxVal) * 80;
                          return `${x},${y}`;
                        });

                        return (
                          <>
                            {/* Principal line (gray dash) */}
                            <polyline
                              fill="none"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeDasharray="4"
                              points={`25,95 ${principalPoints.join(" ")}`}
                            />
                            {/* Balance line (indigo bold) */}
                            <polyline
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              points={`25,95 ${points.join(" ")}`}
                            />
                            {/* Highlight Dots */}
                            {yearlyRecords.map((r, idx) => {
                              const x = 25 + (idx / (yearlyRecords.length - 1)) * 250;
                              const y = 95 - (r.balance / maxVal) * 80;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="5"
                                  className="fill-indigo-600 stroke-white dark:stroke-zinc-900 stroke-2"
                                />
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* Year Labels dengan Font 11px yang Mudah Dibaca */}
                      <text x="25" y="118" fontSize="11" fontWeight="bold" className="fill-zinc-600 dark:fill-zinc-300 font-sans" textAnchor="middle">Mulai</text>
                      {yearlyRecords.map((r, idx) => {
                        const x = 25 + (idx / (yearlyRecords.length - 1)) * 250;
                        return (
                          <text key={idx} x={x} y="118" fontSize="11" fontWeight="bold" className="fill-zinc-600 dark:fill-zinc-300 font-sans" textAnchor="middle">
                            Th {r.year}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}

              {/* Yearly breakdown table */}
              <div className="mt-1 flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-zinc-600 dark:text-zinc-300">
                  {dict.menabung.tableTitle}
                </span>
                <div className="overflow-x-auto max-h-52 border border-card-border rounded-xl">
                  <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-black/[0.04] dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-200 font-bold sticky top-0">
                      <tr>
                        <th className="p-2.5 border-b border-card-border">{dict.menabung.year}</th>
                        <th className="p-2.5 border-b border-card-border">{dict.menabung.principal}</th>
                        <th className="p-2.5 border-b border-card-border">{dict.menabung.interestAc}</th>
                        <th className="p-2.5 border-b border-card-border">{dict.menabung.balance}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {yearlyRecords.map((rec) => (
                        <tr key={rec.year} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                          <td className="p-2.5 font-bold text-foreground">Th {rec.year}</td>
                          <td className="p-2.5 text-zinc-600 dark:text-zinc-300 font-medium">{formatIDR(rec.principal)}</td>
                          <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{formatIDR(rec.interestAc)}</td>
                          <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400">{formatIDR(rec.balance)}</td>
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
