"use client";

import { GOLDEN_DOCTRINES, IHSG_HYBRID_EDGE_STEPS } from "@/lib/trader-personas-data";

interface GoldenDoctrinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoldenDoctrinesModal({ isOpen, onClose }: GoldenDoctrinesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background border border-card-border p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-card-border pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span>👑</span>
              <span>Doktrin Portofolio Institusi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              10 Doktrin Emas CIO Richard & The IHSG Hybrid Edge
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Prinsip tata kelola risiko dan disiplin mental terpadu yang membedakan 5% trader konsisten dari 95% pelaku pasar yang tereliminasi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* The IHSG Hybrid Edge Playbook */}
        <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <span>⚡</span>
            <span>Protokol 5 Langkah: The IHSG Hybrid Edge Playbook</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
            {IHSG_HYBRID_EDGE_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-3 rounded-xl bg-background/80 border border-card-border text-xs space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span className="text-indigo-600 dark:text-indigo-400">Fase {step.step}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {step.analyst}
                  </span>
                </div>
                <div className="font-semibold text-foreground">{step.name}</div>
                <div className="text-[11px] text-muted-foreground leading-snug">{step.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Golden Doctrines List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>📜</span>
            <span>10 Doktrin Emas Portofolio:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOLDEN_DOCTRINES.map((doc) => (
              <div
                key={doc.number}
                className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02] space-y-1.5 hover:border-primary/30 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                    {doc.number}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-foreground">
                    {doc.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                  {doc.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-card-border">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
