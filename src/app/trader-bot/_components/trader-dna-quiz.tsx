"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { diagnoseTraderDna, type DnaAnswerParams } from "@/lib/trader-persona-math";

interface TraderDnaQuizProps {
  dict: Dictionary;
  onSelectPersona: (personaId: string) => void;
}

export function TraderDnaQuiz({ dict, onSelectPersona }: TraderDnaQuizProps) {
  const [answers, setAnswers] = useState<DnaAnswerParams>({
    screenTime: "night_only",
    capitalScale: "range_25_100m",
    riskFocus: "analytical_precision",
  });

  const diagnostic = diagnoseTraderDna(answers);

  return (
    <div className="rounded-3xl border border-card-border bg-card p-5 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <span>🧬</span>
          <span>Self-Assessment DNA Pasar Modal</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          {dict.traderBot.quizTitle}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {dict.traderBot.quizSubtitle}
        </p>
      </div>

      {/* 3 Step Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Screen Time */}
        <div className="p-4 sm:p-5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02] space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <h3 className="text-sm font-bold text-foreground">{dict.traderBot.step1Title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{dict.traderBot.step1Desc}</p>

          <div className="space-y-2 pt-1">
            {[
              {
                id: "full_time" as const,
                label: dict.traderBot.timeFull,
                desc: dict.traderBot.timeFullDesc,
                icon: "⚡",
              },
              {
                id: "part_time" as const,
                label: dict.traderBot.timePart,
                desc: dict.traderBot.timePartDesc,
                icon: "⏱️",
              },
              {
                id: "night_only" as const,
                label: dict.traderBot.timeNight,
                desc: dict.traderBot.timeNightDesc,
                icon: "🌙",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, screenTime: opt.id }))}
                className={`w-full min-h-[44px] p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  answers.screenTime === opt.id
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                    : "border-card-border bg-background hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                <div className="text-[11px] text-muted-foreground pl-5 leading-snug">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Capital Scale */}
        <div className="p-4 sm:p-5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02] space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
              2
            </span>
            <h3 className="text-sm font-bold text-foreground">{dict.traderBot.step2Title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{dict.traderBot.step2Desc}</p>

          <div className="space-y-2 pt-1">
            {[
              { id: "under_25m" as const, label: dict.traderBot.capUnder25, icon: "🌱" },
              { id: "range_25_100m" as const, label: dict.traderBot.cap25to100, icon: "🌿" },
              { id: "range_100_500m" as const, label: dict.traderBot.cap100to500, icon: "🌳" },
              { id: "over_500m" as const, label: dict.traderBot.capOver500, icon: "🏦" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, capitalScale: opt.id }))}
                className={`w-full min-h-[44px] p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  answers.capitalScale === opt.id
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                    : "border-card-border bg-background hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="text-xs font-bold text-foreground leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Risk Focus */}
        <div className="p-4 sm:p-5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02] space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
              3
            </span>
            <h3 className="text-sm font-bold text-foreground">{dict.traderBot.step3Title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{dict.traderBot.step3Desc}</p>

          <div className="space-y-2 pt-1">
            {[
              { id: "fast_adrenaline" as const, label: dict.traderBot.riskAdrenaline, icon: "🏎️" },
              { id: "analytical_precision" as const, label: dict.traderBot.riskAnalytical, icon: "📐" },
              { id: "flow_momentum" as const, label: dict.traderBot.riskFlow, icon: "🌊" },
              { id: "value_dividend" as const, label: dict.traderBot.riskValue, icon: "💎" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, riskFocus: opt.id }))}
                className={`w-full min-h-[44px] p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  answers.riskFocus === opt.id
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                    : "border-card-border bg-background hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="text-xs font-bold text-foreground leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Card Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-emerald-500/10 border border-primary/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
            <span>🎯</span>
            <span>{dict.traderBot.quizResultBadge}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {dict.traderBot.quizAltBadge}:{" "}
            <span className="font-bold text-foreground">
              {diagnostic.secondaryPersona.avatarIcon} {diagnostic.secondaryPersona.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{diagnostic.primaryPersona.avatarIcon}</span>
              <h3 className="text-lg sm:text-2xl font-black text-foreground">
                {diagnostic.primaryPersona.name}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80 max-w-2xl leading-relaxed">
              {diagnostic.rationale}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectPersona(diagnostic.primaryPersona.id)}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl text-sm font-extrabold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>{dict.traderBot.quizActivateBtn}</span>
            <span>→</span>
          </button>
        </div>

        {/* Richard Doctrine Callout */}
        <div className="p-3.5 rounded-2xl bg-background/80 border border-card-border text-xs space-y-1">
          <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>{diagnostic.richardRuleTitle}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {diagnostic.richardRuleDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
