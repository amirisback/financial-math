"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import {
  TRADER_PERSONAS,
  CLUSTER_METADATA,
  type ClusterId,
} from "@/lib/trader-personas-data";

interface PersonaCatalogProps {
  dict: Dictionary;
  selectedPersonaId: string;
  onSelectPersona: (personaId: string) => void;
}

export function PersonaCatalog({
  dict,
  selectedPersonaId,
  onSelectPersona,
}: PersonaCatalogProps) {
  const [selectedCluster, setSelectedCluster] = useState<ClusterId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonas = TRADER_PERSONAS.filter((persona) => {
    const matchesCluster = selectedCluster === "all" || persona.clusterId === selectedCluster;
    const matchesSearch =
      searchQuery.trim() === "" ||
      persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      persona.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      persona.emitenUniverse.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCluster && matchesSearch;
  });

  const clusterTabs = [
    { id: "all" as const, label: dict.traderBot.clusterAll, icon: "⚡" },
    { id: "macro" as const, label: dict.traderBot.clusterMacro, icon: "🌐" },
    { id: "fundamental" as const, label: dict.traderBot.clusterFundamental, icon: "📑" },
    { id: "technical" as const, label: dict.traderBot.clusterTechnical, icon: "📈" },
    { id: "flow" as const, label: dict.traderBot.clusterFlow, icon: "🌊" },
  ];

  return (
    <div className="space-y-6">
      {/* Cluster Navigation Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border overflow-x-auto">
          {clusterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCluster(tab.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                selectedCluster === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Cari emiten, pola, atau tipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2 pl-9 rounded-xl text-xs border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
            🔍
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cluster Description Header when specific cluster selected */}
      {selectedCluster !== "all" && (
        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border flex items-start gap-3 text-xs">
          <span className="text-xl">{CLUSTER_METADATA[selectedCluster].icon}</span>
          <div className="space-y-0.5">
            <div className="font-bold text-foreground">
              {CLUSTER_METADATA[selectedCluster].name} — Lead: {CLUSTER_METADATA[selectedCluster].lead} (
              {CLUSTER_METADATA[selectedCluster].leadRole})
            </div>
            <div className="text-muted-foreground">
              {CLUSTER_METADATA[selectedCluster].description}
            </div>
          </div>
        </div>
      )}

      {/* Persona Cards Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonas.map((persona) => {
          const isSelected = selectedPersonaId === persona.id;

          return (
            <div
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/[0.03] ring-2 ring-primary/40 shadow-sm"
                  : "border-card-border bg-card hover:border-primary/40 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{persona.avatarIcon}</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground leading-tight">
                        {persona.name}
                      </h4>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <span>Lead:</span>
                        <span className="font-semibold text-primary">{persona.leadAnalyst}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-2xs">
                      Aktif
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {persona.title}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Timeframe / Hold:</span>
                  <span className="font-bold text-foreground truncate block">{persona.holdingPeriod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Target RRR:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block">{persona.minRrrLabel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Win Rate Ideal:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{persona.targetWinRate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Batas Stop Loss:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 block">{persona.maxStopLossLabel}</span>
                </div>
              </div>

              {/* Ticker Tags & Friction Fee Badge */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {persona.emitenUniverse.slice(0, 4).map((ticker) => (
                    <span
                      key={ticker}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-muted text-muted-foreground border border-card-border"
                    >
                      {ticker}
                    </span>
                  ))}
                  {persona.emitenUniverse.length > 4 && (
                    <span className="text-[10px] text-muted-foreground self-center">
                      +{persona.emitenUniverse.length - 4} emiten
                    </span>
                  )}
                </div>

                {persona.frictionFeeLevel.includes("KRITIKAL") && (
                  <div className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Fee Friksi BEI Kritis ({persona.frictionFeeLevel})</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                className={`w-full min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-card-border bg-background hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-foreground"
                }`}
              >
                <span>{isSelected ? "Buka Workspace Bot Ini" : "Pilih Bot Ini"}</span>
                <span>→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
