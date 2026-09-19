"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import { TRADER_PERSONAS, type TraderPersona } from "@/lib/trader-personas-data";
import { TraderDnaQuiz } from "./trader-dna-quiz";
import { PersonaCatalog } from "./persona-catalog";
import { PersonaDetailCard } from "./persona-detail-card";
import { PersonaFormulaSimulator } from "./persona-formula-simulator";
import { TradeAuditBot } from "./trade-audit-bot";
import { GoldenDoctrinesModal } from "./golden-doctrines-modal";

interface TraderBotViewProps {
  dict: Dictionary;
}

type MainTab = "quiz" | "catalog";

export function TraderBotView({ dict }: TraderBotViewProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("quiz");
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("swing-trader");
  const [isDoctrinesModalOpen, setIsDoctrinesModalOpen] = useState<boolean>(false);

  const activePersona: TraderPersona =
    TRADER_PERSONAS.find((p) => p.id === selectedPersonaId) || TRADER_PERSONAS[10];

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    // Smooth scroll to the workspace section
    const el = document.getElementById("active-persona-workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToSimulator = () => {
    const el = document.getElementById("formula-simulator-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToAudit = () => {
    const el = document.getElementById("trade-audit-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <span>🤖</span>
          <span>{dict.traderBot.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
          {dict.traderBot.title}
        </h1>
        <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {dict.traderBot.subtitle}
        </p>

        {/* Quick Links & Golden Doctrines Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setIsDoctrinesModalOpen(true)}
            className="min-h-[44px] text-xs font-bold text-amber-600 dark:text-amber-400 px-3.5 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <span>👑</span>
            <span>{dict.traderBot.tabDoctrines}</span>
          </button>
          <Link
            href="/trader-hub"
            className="min-h-[44px] text-xs font-bold text-muted-foreground hover:text-foreground px-3.5 py-1.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.03] transition-all hover:bg-black/[0.05] flex items-center gap-1.5"
          >
            <span>🎯</span>
            <span>{dict.traderBot.quickOpenHub} →</span>
          </Link>
          <Link
            href="/saham"
            className="min-h-[44px] text-xs font-bold text-muted-foreground hover:text-foreground px-3.5 py-1.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.03] transition-all hover:bg-black/[0.05] flex items-center gap-1.5"
          >
            <span>📊</span>
            <span>{dict.traderBot.quickOpenStock} →</span>
          </Link>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-card-border max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "quiz"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🧬</span>
          <span>{dict.traderBot.tabDnaQuiz}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "catalog"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📚</span>
          <span>{dict.traderBot.tabCatalog}</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "quiz" ? (
        <TraderDnaQuiz dict={dict} onSelectPersona={handleSelectPersona} />
      ) : (
        <PersonaCatalog
          dict={dict}
          selectedPersonaId={selectedPersonaId}
          onSelectPersona={handleSelectPersona}
        />
      )}

      {/* Active Persona Workspace Section */}
      <div id="active-persona-workspace" className="space-y-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-card-border" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-2">
            Workspace Persona Terpilih: {activePersona.name}
          </span>
          <div className="h-px flex-1 bg-card-border" />
        </div>

        {/* 1. Persona Operational Profile & Rules Card */}
        <PersonaDetailCard
          persona={activePersona}
          dict={dict}
          onScrollToSimulator={handleScrollToSimulator}
          onScrollToAudit={handleScrollToAudit}
        />

        {/* 2. Dynamic Formula Simulator */}
        <PersonaFormulaSimulator persona={activePersona} dict={dict} />

        {/* 3. Pre-Flight Trade Validator Bot */}
        <TradeAuditBot
          persona={activePersona}
          dict={dict}
          onOpenDoctrinesModal={() => setIsDoctrinesModalOpen(true)}
        />
      </div>

      {/* Golden Doctrines Modal */}
      <GoldenDoctrinesModal
        isOpen={isDoctrinesModalOpen}
        onClose={() => setIsDoctrinesModalOpen(false)}
      />
    </div>
  );
}
