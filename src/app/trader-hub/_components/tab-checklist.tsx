"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ShareSummaryButton } from "@/app/_components/ui/share-summary-button";

interface TabChecklistProps {
  dict: Dictionary;
}

export function TabChecklist({ dict }: TabChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    trend: false,
    keyLevel: false,
    riskReward: false,
    noNews: false,
    stopLossSet: false,
    emotionsCheck: false,
  });

  const checklistDefs = [
    { id: "trend", label: dict.traderHub.itemTrend, icon: "📈" },
    { id: "keyLevel", label: dict.traderHub.itemKeyLevel, icon: "🎯" },
    { id: "riskReward", label: dict.traderHub.itemRiskReward, icon: "⚖️" },
    { id: "noNews", label: dict.traderHub.itemNoNews, icon: "📰" },
    { id: "stopLossSet", label: dict.traderHub.itemStopLossSet, icon: "🛑" },
    { id: "emotionsCheck", label: dict.traderHub.itemEmotionsCheck, icon: "🧘" },
  ];

  const totalItems = checklistDefs.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const scorePercent = Math.round((completedCount / totalItems) * 100);
  const isFullyReady = completedCount === totalItems;

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    setCheckedItems({
      trend: false,
      keyLevel: false,
      riskReward: false,
      noNews: false,
      stopLossSet: false,
      emotionsCheck: false,
    });
  };

  const handleSelectAll = () => {
    setCheckedItems({
      trend: true,
      keyLevel: true,
      riskReward: true,
      noNews: true,
      stopLossSet: true,
      emotionsCheck: true,
    });
  };

  const summaryItems = [
    { label: "Skor Disiplin", value: `${scorePercent}% (${completedCount}/${totalItems} kriteria)`, highlight: true },
    { label: "Status Kesiapan", value: isFullyReady ? "100% SIAP EKSEKUSI" : "BELUM LENGKAP - JANGAN ENTRY" },
    ...checklistDefs.map((def) => ({
      label: def.label.slice(0, 30) + "...",
      value: checkedItems[def.id] ? "✓ Lolos" : "✗ Belum",
    })),
  ];

  return (
    <div className="space-y-6">
      <Card className="border-card-border shadow-xs bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                {dict.traderHub.checklistTitle}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {dict.traderHub.checklistSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="min-h-[44px] px-3.5 rounded-xl border border-card-border text-xs font-bold hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                Centang Semua
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] px-3.5 rounded-xl border border-card-border text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Readiness Meter */}
          <div className="p-5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {dict.traderHub.scoreLabel}
              </span>
              <span className="text-sm sm:text-base font-black text-foreground">
                {scorePercent}% ({completedCount} dari {totalItems})
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isFullyReady
                    ? "bg-emerald-500"
                    : scorePercent >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>

            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                isFullyReady
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              }`}
            >
              <span>{isFullyReady ? "🛡️" : "⚠️"}</span>
              <span>
                {isFullyReady
                  ? dict.traderHub.scoreReady
                  : dict.traderHub.scoreIncomplete}
              </span>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {checklistDefs.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`min-h-[56px] p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                      : "border-card-border bg-white dark:bg-zinc-900 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className={`text-xs sm:text-sm font-medium ${
                      isChecked ? "text-foreground font-bold" : "text-muted-foreground"
                    }`}>
                      {item.label}
                    </span>
                  </div>

                  <div
                    className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-card-border bg-black/[0.02] dark:bg-white/[0.04]"
                    }`}
                  >
                    {isChecked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <ShareSummaryButton
            title="Audit Kedisiplinan Trading"
            items={summaryItems}
            featureUrl="https://amir-app.local/trader-hub"
          />
        </CardContent>
      </Card>
    </div>
  );
}
