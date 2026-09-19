"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { TraderPersona } from "@/lib/trader-personas-data";
import { auditTradeSetup, type TradeAuditResult } from "@/lib/trader-persona-math";

interface TradeAuditBotProps {
  persona: TraderPersona;
  dict: Dictionary;
  onOpenDoctrinesModal: () => void;
}

const POPULAR_IDX_TICKERS = [
  { code: "BBCA", name: "Bank Central Asia", entry: 10200, sl: 9800, tp: 11200, adv: 80_000_000 },
  { code: "BBRI", name: "Bank Rakyat Indonesia", entry: 4800, sl: 4560, tp: 5400, adv: 120_000_000 },
  { code: "BMRI", name: "Bank Mandiri", entry: 6900, sl: 6550, tp: 7750, adv: 90_000_000 },
  { code: "TLKM", name: "Telkom Indonesia", entry: 2950, sl: 2800, tp: 3350, adv: 75_000_000 },
  { code: "ASII", name: "Astra International", entry: 4950, sl: 4700, tp: 5600, adv: 45_000_000 },
  { code: "PTBA", name: "Bukit Asam", entry: 2600, sl: 2470, tp: 2950, adv: 25_000_000 },
  { code: "ADRO", name: "Adaro Energy", entry: 3600, sl: 3420, tp: 4100, adv: 40_000_000 },
  { code: "ANTM", name: "Aneka Tambang", entry: 1550, sl: 1470, tp: 1750, adv: 60_000_000 },
  { code: "MEDC", name: "Medco Energi", entry: 1250, sl: 1180, tp: 1450, adv: 35_000_000 },
  { code: "ICBP", name: "Indofood CBP", entry: 11500, sl: 10900, tp: 12800, adv: 15_000_000 },
];

export function TradeAuditBot({ persona, dict, onOpenDoctrinesModal }: TradeAuditBotProps) {
  const [ticker, setTicker] = useState<string>("PTBA");
  const [entryPrice, setEntryPrice] = useState<number>(2600);
  const [stopLossPrice, setStopLossPrice] = useState<number>(2470);
  const [targetPrice, setTargetPrice] = useState<number>(2950);
  const [capitalIdr, setCapitalIdr] = useState<number>(100_000_000);
  const [advShares, setAdvShares] = useState<number>(25_000_000);

  const [auditResult, setAuditResult] = useState<TradeAuditResult | null>(() => {
    return auditTradeSetup({
      personaId: persona.id,
      ticker: "PTBA",
      entryPrice: 2600,
      stopLossPrice: 2470,
      targetPrice: 2950,
      capitalIdr: 100_000_000,
      advShares: 25_000_000,
    });
  });

  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = auditTradeSetup({
      personaId: persona.id,
      ticker,
      entryPrice,
      stopLossPrice,
      targetPrice,
      capitalIdr,
      advShares,
    });
    setAuditResult(res);
  };

  const handleSelectPreset = (preset: (typeof POPULAR_IDX_TICKERS)[0]) => {
    setTicker(preset.code);
    setEntryPrice(preset.entry);
    setStopLossPrice(preset.sl);
    setTargetPrice(preset.tp);
    setAdvShares(preset.adv);

    const res = auditTradeSetup({
      personaId: persona.id,
      ticker: preset.code,
      entryPrice: preset.entry,
      stopLossPrice: preset.sl,
      targetPrice: preset.tp,
      capitalIdr,
      advShares: preset.adv,
    });
    setAuditResult(res);
  };

  const handleCopyPlan = () => {
    if (!auditResult) return;

    const summaryText = `📋 *TRADING PLAN AUDIT — ${auditResult.ticker}*
🤖 *Persona:* ${persona.name} (Lead: ${persona.leadAnalyst})
⚖️ *Vonis Bot:* ${auditResult.verdict} (Skor: ${auditResult.score}/100)

💵 *Entry:* Rp ${entryPrice.toLocaleString("id-ID")}
🛑 *Stop Loss:* Rp ${stopLossPrice.toLocaleString("id-ID")} (-${auditResult.slDistancePct}%)
🎯 *Target Profit:* Rp ${targetPrice.toLocaleString("id-ID")} (RRR: ${auditResult.rrrActual}:1)

📦 *Ukuran Posisi 1% Risk:* ${auditResult.positionSizing.maxLots} Lot
💰 *Nilai Transaksi:* Rp ${auditResult.positionSizing.transactionValueIdr.toLocaleString("id-ID")}
🛡️ *Risiko Moneter:* Rp ${auditResult.positionSizing.maxRiskAmountIdr.toLocaleString("id-ID")}

💡 *Instruksi:* ${auditResult.recommendedAction}
📜 *Doktrin Richard:* "${auditResult.goldenDoctrineQuote}"
---
_Dibuat via Amir App Stock Trader Bot Suite_`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    if (!auditResult) return;
    const summaryText = `📋 *TRADING PLAN AUDIT — ${auditResult.ticker}*
🤖 *Persona:* ${persona.name} (Lead: ${persona.leadAnalyst})
⚖️ *Vonis Bot:* ${auditResult.verdict} (Skor: ${auditResult.score}/100)

💵 *Entry:* Rp ${entryPrice.toLocaleString("id-ID")}
🛑 *Stop Loss:* Rp ${stopLossPrice.toLocaleString("id-ID")} (-${auditResult.slDistancePct}%)
🎯 *Target Profit:* Rp ${targetPrice.toLocaleString("id-ID")} (RRR: ${auditResult.rrrActual}:1)

📦 *Posisi 1% Risk:* ${auditResult.positionSizing.maxLots} Lot
🛡️ *Risiko Maks:* Rp ${auditResult.positionSizing.maxRiskAmountIdr.toLocaleString("id-ID")}

💡 *Instruksi:* ${auditResult.recommendedAction}
📜 *Doktrin:* "${auditResult.goldenDoctrineQuote}"`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div id="trade-audit-section" className="rounded-3xl border border-card-border bg-card p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span>🛡️</span>
            <span>Bramantyo Risk Guard Engine</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-foreground">
            {dict.traderBot.auditTitle}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {dict.traderBot.auditSubtitle} (Persona Aktif: <strong className="text-foreground">{persona.name}</strong>)
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDoctrinesModal}
          className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border border-card-border bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] text-foreground transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>📜</span>
          <span>{dict.traderBot.openDoctrines}</span>
        </button>
      </div>

      {/* Quick Select Popular IDX Tickers */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-muted-foreground block">
          {dict.traderBot.quickTickers}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_IDX_TICKERS.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelectPreset(item)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer min-h-[36px] ${
                ticker === item.code
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-card-border bg-background hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-foreground"
              }`}
            >
              {item.code}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Input Form */}
      <form onSubmit={handleRunAudit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              {dict.traderBot.inputTicker}:
            </label>
            <input
              type="text"
              required
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-mono font-black text-foreground uppercase tracking-wider"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              {dict.traderBot.inputCapital}:
            </label>
            <input
              type="number"
              required
              min={100000}
              value={capitalIdr}
              onChange={(e) => setCapitalIdr(Number(e.target.value) || 0)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              {dict.traderBot.inputAdv}:
            </label>
            <input
              type="number"
              min={0}
              value={advShares}
              onChange={(e) => setAdvShares(Number(e.target.value) || 0)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              {dict.traderBot.inputEntry}:
            </label>
            <input
              type="number"
              required
              min={1}
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value) || 1)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              {dict.traderBot.inputStopLoss}:
            </label>
            <input
              type="number"
              required
              min={1}
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(Number(e.target.value) || 1)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              {dict.traderBot.inputTargetPrice}:
            </label>
            <input
              type="number"
              required
              min={1}
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value) || 1)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full min-h-[48px] px-6 py-3 rounded-2xl text-sm font-extrabold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span>🔍</span>
          <span>{dict.traderBot.btnAudit}</span>
        </button>
      </form>

      {/* Audit Verdict Banner & Results */}
      {auditResult && (
        <div className="space-y-6 pt-4 border-t border-card-border animate-in fade-in duration-300">
          {/* Main Verdict Card */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
              auditResult.verdict === "APPROVED"
                ? "border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                : auditResult.verdict === "WARNING"
                ? "border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200"
                : "border-rose-300 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-3xl sm:text-4xl">
                {auditResult.verdict === "APPROVED" ? "🟢" : auditResult.verdict === "WARNING" ? "🟡" : "🔴"}
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                  Vonis Audit Bot ({auditResult.ticker})
                </span>
                <h4 className="text-lg sm:text-xl font-black">
                  {auditResult.verdict === "APPROVED"
                    ? dict.traderBot.verdictApproved
                    : auditResult.verdict === "WARNING"
                    ? dict.traderBot.verdictWarning
                    : dict.traderBot.verdictRejected}
                </h4>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-[10px] font-semibold block opacity-75">{dict.traderBot.fitScoreLabel}:</span>
              <span className="text-2xl sm:text-3xl font-black font-mono">
                {auditResult.score} / 100
              </span>
            </div>
          </div>

          {/* Position Sizing 1% Box (Bramantyo Guard) */}
          <div className="p-5 rounded-3xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                <span>📦</span>
                <span>{dict.traderBot.lotSizingTitle} (Bramantyo Guard):</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
                1% Modal = Rp {auditResult.positionSizing.maxRiskAmountIdr.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-background/90 border border-card-border">
                <span className="text-[10px] text-muted-foreground block">{dict.traderBot.maxLotLabel}:</span>
                <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {auditResult.positionSizing.maxLots} Lot
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {auditResult.positionSizing.maxShares.toLocaleString("id-ID")} lbr
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background/90 border border-card-border">
                <span className="text-[10px] text-muted-foreground block">{dict.traderBot.transValLabel}:</span>
                <span className="text-xs sm:text-sm font-extrabold text-foreground">
                  Rp {auditResult.positionSizing.transactionValueIdr.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {auditResult.positionSizing.positionPercentOfCapital}% modal
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background/90 border border-card-border">
                <span className="text-[10px] text-muted-foreground block">Rasio Risk-to-Reward:</span>
                <span className="text-sm font-black text-foreground">
                  {auditResult.rrrActual} : 1
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Min {persona.name}: {auditResult.rrrRequired}:1
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-background/90 border border-card-border">
                <span className="text-[10px] text-muted-foreground block">Jarak Stop Loss:</span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                  -{auditResult.slDistancePct}%
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Maks {persona.name}: {auditResult.maxSlAllowedPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Findings Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">
              {dict.traderBot.findingsTitle}
            </h4>
            <div className="space-y-2">
              {auditResult.findings.map((finding, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                    finding.status === "PASS"
                      ? "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300"
                      : finding.status === "WARN"
                      ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300"
                      : "border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300"
                  }`}
                >
                  <span className="text-base">
                    {finding.status === "PASS" ? "✅" : finding.status === "WARN" ? "⚠️" : "❌"}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-extrabold">{finding.title}</div>
                    <div className="text-muted-foreground leading-relaxed">{finding.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bot Instruction & Richard Golden Doctrine */}
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-2 text-xs">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <span>💡</span>
              <span>{dict.traderBot.recommendationTitle}</span>
            </div>
            <p className="text-foreground/90 font-semibold leading-relaxed">
              {auditResult.recommendedAction}
            </p>

            <div className="pt-2 border-t border-card-border text-[11px] text-muted-foreground space-y-1">
              <span className="font-bold text-amber-600 dark:text-amber-400 block">
                {dict.traderBot.quoteTitle}
              </span>
              <p className="italic leading-relaxed">
                &ldquo;{auditResult.goldenDoctrineQuote}&rdquo;
              </p>
            </div>
          </div>

          {/* Action Sharing Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyPlan}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold border border-card-border bg-background hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all cursor-pointer text-foreground flex items-center gap-2"
            >
              <span>📋</span>
              <span>{copyFeedback ? dict.traderBot.copyPlanSuccess : dict.traderBot.copyPlanBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>💬</span>
              <span>Bagikan ke WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
