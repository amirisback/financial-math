"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import { TabMultiTp } from "./tab-multi-tp";
import { TabQuantRisk } from "./tab-quant-risk";
import { TabCompounding } from "./tab-compounding";
import { TabChecklist } from "./tab-checklist";

interface TraderHubViewProps {
  dict: Dictionary;
}

type TabType = "multiTp" | "quantRisk" | "compounding" | "checklist";
type AssetMode = "saham" | "forex_crypto";

export function TraderHubView({ dict }: TraderHubViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("multiTp");
  const [assetMode, setAssetMode] = useState<AssetMode>("saham");

  const tabs = [
    { id: "multiTp" as TabType, label: dict.traderHub.tabMultiTp, icon: "🎯" },
    { id: "quantRisk" as TabType, label: dict.traderHub.tabQuantRisk, icon: "⚖️" },
    { id: "compounding" as TabType, label: dict.traderHub.tabCompounding, icon: "📈" },
    { id: "checklist" as TabType, label: dict.traderHub.tabChecklist, icon: "🛡️" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <span>⚡</span>
          <span>{dict.traderHub.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {dict.traderHub.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {dict.traderHub.description}
        </p>

        {/* Quick Link Buttons to Existing Pages */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/trader-bot"
            className="text-xs font-bold text-primary hover:text-primary-foreground hover:bg-primary px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 transition-all"
          >
            🤖 18 Persona Trader Bot →
          </Link>
          <Link
            href="/saham"
            className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.03] transition-all hover:bg-black/[0.05]"
          >
            📊 {dict.traderHub.openStockCalc} →
          </Link>
          <Link
            href="/forex"
            className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.03] transition-all hover:bg-black/[0.05]"
          >
            💱 {dict.traderHub.openForexCalc} →
          </Link>
        </div>
      </div>

      {/* Asset Mode Preset Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
        <span className="text-xs sm:text-sm font-bold text-foreground px-2">
          {dict.traderHub.assetTypeLabel}:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAssetMode("saham")}
            className={`min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              assetMode === "saham"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🇮🇩 {dict.traderHub.assetSaham}
          </button>
          <button
            type="button"
            onClick={() => setAssetMode("forex_crypto")}
            className={`min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              assetMode === "forex_crypto"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🌐 {dict.traderHub.assetForexCrypto}
          </button>
        </div>
      </div>

      {/* Navigation Pills (Min-h 44px) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
              activeTab === tab.id
                ? "bg-white dark:bg-zinc-900 text-primary border border-card-border shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === "multiTp" && (
          <TabMultiTp dict={dict} assetMode={assetMode} />
        )}
        {activeTab === "quantRisk" && (
          <TabQuantRisk dict={dict} assetMode={assetMode} />
        )}
        {activeTab === "compounding" && (
          <TabCompounding dict={dict} assetMode={assetMode} />
        )}
        {activeTab === "checklist" && (
          <TabChecklist dict={dict} />
        )}
      </div>
    </div>
  );
}
