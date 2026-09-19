"use client";

import type { Dictionary } from "@/lib/dictionaries";
import type { TraderPersona } from "@/lib/trader-personas-data";

interface PersonaDetailCardProps {
  persona: TraderPersona;
  dict: Dictionary;
  onScrollToSimulator: () => void;
  onScrollToAudit: () => void;
}

export function PersonaDetailCard({
  persona,
  dict,
  onScrollToSimulator,
  onScrollToAudit,
}: PersonaDetailCardProps) {
  return (
    <div className="rounded-3xl border border-card-border bg-card p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-xs border border-primary/20">
            {persona.avatarIcon}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-card-border">
                {persona.clusterName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                Lead: {persona.leadAnalyst} ({persona.analystRole})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {persona.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {persona.title}
            </p>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onScrollToSimulator}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold border border-card-border bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] transition-all cursor-pointer text-foreground flex items-center justify-center gap-1.5"
          >
            <span>📊</span>
            <span>Formula Simulator</span>
          </button>
          <button
            type="button"
            onClick={onScrollToAudit}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>🛡️</span>
            <span>Audit Setup Saham</span>
          </button>
        </div>
      </div>

      {/* 8 Quantitative Parameters Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-1">
          <span className="text-[11px] text-muted-foreground block">{dict.traderBot.holdingTimeLabel}</span>
          <span className="text-sm font-extrabold text-foreground block">{persona.holdingPeriod}</span>
          <span className="text-[10px] text-muted-foreground block">Timeframe: {persona.timeframe}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-1">
          <span className="text-[11px] text-muted-foreground block">{dict.traderBot.minRrrLabel}</span>
          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 block">{persona.minRrrLabel}</span>
          <span className="text-[10px] text-muted-foreground block">Target Return: {persona.targetGain}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-1">
          <span className="text-[11px] text-muted-foreground block">{dict.traderBot.winRateLabel}</span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">{persona.targetWinRate}</span>
          <span className="text-[10px] text-muted-foreground block">Max Drawdown: {persona.maxDrawdown}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-1">
          <span className="text-[11px] text-muted-foreground block">{dict.traderBot.maxSlLabel}</span>
          <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 block">{persona.maxStopLossLabel}</span>
          <span className="text-[10px] text-muted-foreground block">Modal: {persona.idealCapital}</span>
        </div>
      </div>

      {/* Universe & Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emiten Universe */}
        <div className="p-4 rounded-2xl bg-black/[0.01] dark:bg-white/[0.02] border border-card-border space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span>🎯</span>
            <span>{dict.traderBot.emitenUniverseLabel}:</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {persona.emitenDescription}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {persona.emitenUniverse.map((ticker) => (
              <span
                key={ticker}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20"
              >
                {ticker}
              </span>
            ))}
          </div>
        </div>

        {/* Indicators & Tools */}
        <div className="p-4 rounded-2xl bg-black/[0.01] dark:bg-white/[0.02] border border-card-border space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span>⚙️</span>
            <span>{dict.traderBot.indicatorsLabel} & {dict.traderBot.toolsLabel}:</span>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Indikator: </span>
              {persona.keyIndicators.join(", ")}
            </div>
            <div>
              <span className="font-semibold text-foreground">Tools Utama: </span>
              {persona.primaryTools.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Do's */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
          <h4 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <span>✅</span>
            <span>{dict.traderBot.dosLabel}:</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-foreground/80">
            {persona.dos.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts */}
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-2">
          <h4 className="text-xs font-extrabold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
            <span>⛔</span>
            <span>{dict.traderBot.dontsLabel}:</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-foreground/80">
            {persona.donts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Philosophy Quote */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {dict.traderBot.doctrineQuoteLabel} — CIO Richard:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-foreground italic leading-relaxed">
            &ldquo;{persona.goldenDoctrineQuote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
