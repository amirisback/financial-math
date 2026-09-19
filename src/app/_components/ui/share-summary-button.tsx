"use client";

import React, { useState } from "react";

export interface SummaryItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ShareSummaryButtonProps {
  title: string;
  items?: SummaryItem[];
  summaryText?: string;
  featureUrl?: string;
  className?: string;
}

export function ShareSummaryButton({
  title,
  items = [],
  summaryText,
  featureUrl = "",
  className = "",
}: ShareSummaryButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const generateSummaryText = (): string => {
    if (summaryText) {
      let text = summaryText;
      if (featureUrl && !text.includes(featureUrl)) {
        text += `\n\n🔗 Simulasi lengkap: ${featureUrl}`;
      }
      return text;
    }
    let text = `📊 *Simulasi ${title} — Amir App*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item) => {
      text += `• *${item.label}*: ${item.value}\n`;
    });
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (featureUrl) {
      text += `🔗 Simulasi lengkap: ${featureUrl}\n`;
    }
    text += `_Dihitung akurat sesuai regulasi Indonesia via Amir App._`;
    return text;
  };

  const handleCopy = async () => {
    const text = generateSummaryText();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback textarea
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateSummaryText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2.5 w-full ${className}`}>
      {/* Tombol Salin ke Clipboard */}
      <button
        type="button"
        onClick={handleCopy}
        className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-xs active:scale-98 ${
          copied
            ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20"
            : "bg-white dark:bg-zinc-900 border-card-border text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
        }`}
      >
        {copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>✓ Ringkasan Tersalin!</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>Salin Rangkuman Angka</span>
          </>
        )}
      </button>

      {/* Tombol Kirim ke WhatsApp (Langsung untuk diskusi keluarga) */}
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-98 transition-all cursor-pointer shadow-xs"
        title="Kirim hasil kalkulasi ke WhatsApp"
      >
        <span className="text-base">💬</span>
        <span>Kirim ke WhatsApp</span>
      </button>
    </div>
  );
}
