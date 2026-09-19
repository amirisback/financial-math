"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { CurrencyInput } from "@/app/_components/ui/currency-input";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";
import { calculateCompoundingGrowth } from "@/lib/trader-math";

interface TabCompoundingProps {
  dict: Dictionary;
  assetMode: "saham" | "forex_crypto";
}

export function TabCompounding({ dict, assetMode }: TabCompoundingProps) {
  const isSaham = assetMode === "saham";
  const currencyPrefix = isSaham ? "Rp" : "$";

  // Form States
  const [initialCapital, setInitialCapital] = useState<number>(isSaham ? 10000000 : 1000);
  const [targetGrowthRate, setTargetGrowthRate] = useState<number>(isSaham ? 3 : 2);
  const [periods, setPeriods] = useState<number>(12);
  const [periodType, setPeriodType] = useState<"week" | "month">("month");

  // Calculations
  const result = calculateCompoundingGrowth(
    initialCapital,
    targetGrowthRate,
    periods,
    periodType
  );

  const formatCurrency = (val: number) => {
    if (isSaham) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const summaryItems = [
    { label: "Modal Awal", value: formatCurrency(initialCapital) },
    { label: "Target Pertumbuhan", value: `${targetGrowthRate}% per ${periodType === "week" ? "Minggu" : "Bulan"}` },
    { label: "Durasi Waktu", value: `${periods} ${periodType === "week" ? "Minggu" : "Bulan"}` },
    { label: "Saldo Akhir", value: formatCurrency(result.finalBalance), highlight: true },
    { label: "Total Laba Bersih", value: formatCurrency(result.netProfit) },
    { label: "Akumulasi ROI", value: `+${result.totalReturnPct}%`, highlight: true },
  ];

  return (
    <div className="space-y-6">
      {/* Parameter Input Card */}
      <Card className="border-card-border shadow-xs bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <div className="border-b border-card-border pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {dict.traderHub.compoundingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {dict.traderHub.compoundingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurrencyInput
              id="initialCapital"
              label={dict.traderHub.capitalLabel}
              value={initialCapital}
              onChange={setInitialCapital}
              min={isSaham ? 100000 : 10}
              max={isSaham ? 10000000000 : 500000}
              step={isSaham ? 1000000 : 100}
              prefix={currencyPrefix}
              showSlider={false}
              tooltip="Modal pokok awal yang siap dialokasikan untuk compounding."
            />

            <CurrencyInput
              id="targetGrowth"
              label={dict.traderHub.targetGrowthLabel}
              value={targetGrowthRate}
              onChange={setTargetGrowthRate}
              min={0.5}
              max={30}
              step={0.5}
              isCurrency={false}
              unit="%"
              showSlider={true}
              tooltip="Target realistis per periode (disarankan 2% - 5% per bulan)."
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-foreground">
                  {dict.traderHub.periodTypeLabel} & {dict.traderHub.periodsLabel}
                </label>
                <span className="text-sm font-black text-primary">
                  {periods} {periodType === "week" ? "Minggu" : "Bulan"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPeriodType("week")}
                  className={`min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    periodType === "week"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-card-border bg-white dark:bg-zinc-900 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dict.traderHub.periodWeek}
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodType("month")}
                  className={`min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    periodType === "month"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-card-border bg-white dark:bg-zinc-900 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dict.traderHub.periodMonth}
                </button>
              </div>

              <input
                type="range"
                min={2}
                max={52}
                step={1}
                value={periods}
                onChange={(e) => setPeriods(Number(e.target.value))}
                className="w-full h-3 rounded-lg bg-zinc-200 dark:bg-zinc-700 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outcome Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-card-border shadow-xs">
          <CardContent className="p-5 space-y-1.5">
            <div className="text-xs text-muted-foreground font-semibold">
              {dict.traderHub.finalBalance}
            </div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {formatCurrency(result.finalBalance)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Setelah {periods} {periodType === "week" ? "minggu" : "bulan"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border shadow-xs">
          <CardContent className="p-5 space-y-1.5">
            <div className="text-xs text-muted-foreground font-semibold">
              {dict.traderHub.netProfit}
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(result.netProfit)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Murni hasil akumulasi profit
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border shadow-xs">
          <CardContent className="p-5 space-y-1.5">
            <div className="text-xs text-muted-foreground font-semibold">
              {dict.traderHub.totalRoi}
            </div>
            <div className="text-xl sm:text-2xl font-black text-primary">
              +{result.totalReturnPct}%
            </div>
            <div className="text-[11px] text-muted-foreground">
              Pertumbuhan portofolio bersih
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Ladder Table */}
      <Card className="border-card-border shadow-xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {dict.traderHub.milestoneTable}
              </h3>
              <p className="text-xs text-muted-foreground">
                Jalur pertumbuhan modal bertahap dengan batas toleransi drawdown per tahap.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-black/[0.03] dark:bg-white/[0.04] text-muted-foreground font-bold border-b border-card-border">
                <tr>
                  <th className="p-3 text-center w-16">{dict.traderHub.thPeriod}</th>
                  <th className="p-3">{dict.traderHub.thStart}</th>
                  <th className="p-3 text-emerald-600 dark:text-emerald-400">{dict.traderHub.thTarget}</th>
                  <th className="p-3 font-extrabold text-foreground">{dict.traderHub.thEnd}</th>
                  <th className="p-3 text-rose-600 dark:text-rose-400">{dict.traderHub.thDrawdownBudget}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border font-medium">
                {result.milestones.map((m) => (
                  <tr
                    key={m.period}
                    className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-3 text-center font-bold text-muted-foreground">
                      #{m.period}
                    </td>
                    <td className="p-3 text-foreground">{formatCurrency(m.startBalance)}</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      +{formatCurrency(m.targetProfit)}
                    </td>
                    <td className="p-3 font-extrabold text-foreground">
                      {formatCurrency(m.endBalance)}
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400">
                      -{formatCurrency(m.maxDrawdownBudget)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed">
            💡 <strong>Disiplin Compounding:</strong> Jangan menaikkan ukuran lot sebelum modal secara konsisten melewati milestone berikutnya. Jika drawdown melewati kolom batas toleransi, hentikan trading dan kembali ke ukuran lot fase sebelumnya.
          </div>

          <ShareSummaryButton
            title="Simulasi Compounding Akun"
            items={summaryItems}
            featureUrl="https://amir-app.local/trader-hub"
          />
        </CardContent>
      </Card>
    </div>
  );
}
