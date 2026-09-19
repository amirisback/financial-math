# 02 Design Specifications & Tokens — Investment Decision Tools (Saham & Forex)

**Task ID**: `TASK-003`  
**Feature**: Antarmuka Keputusan Investasi Saham & Forex  
**Author**: Angel (`angel_uiux`) — UI/UX Designer  
**Status**: Ready for Implementation  

---

## 1. Konsep & Hirarki Desain Antarmuka

Untuk membantu pengguna (terutama usia 35 tahun ke atas) mencerna data finansial kuantitatif yang kompleks tanpa rasa kewalahan (*cognitive overload*), Angel menerapkan prinsip **3-Second Investment Verdict**:
1. **At-a-Glance Verdict Card**: Ringkasan kesimpulan investasi (Undervalued / Fair / Overvalued, atau Rasio Keamanan Trading) diletakkan di puncak kartu hasil dengan badge warna kontras tinggi.
2. **Sub-Segmented Pill Switcher**: Pembagian sub-fitur di dalam modul Saham dan Forex menggunakan pill button `min-h-[44px]` dengan transisi halus dan kontras jelas.
3. **Data Hierarchy & Formatting**: Angka kesimpulan berukuran `text-2xl sm:text-3xl font-black`, sedangkan angka rincian berukuran `text-sm font-bold`.

---

## 2. Design Tokens & Visual Badges

### A. Valuasi & Margin of Safety (MoS) Badges
- **Undervalued (Diskon > 20%)**:
  - Background: `bg-emerald-500/10 dark:bg-emerald-500/20`
  - Border: `border-emerald-500/30`
  - Text: `text-emerald-700 dark:text-emerald-300 font-extrabold`
  - Icon: 🟢 *Diskon Signifikan (Strong Value)*
- **Fair Value (Diskon 0% – 20%)**:
  - Background: `bg-amber-500/10 dark:bg-amber-500/20`
  - Border: `border-amber-500/30`
  - Text: `text-amber-700 dark:text-amber-300 font-extrabold`
  - Icon: 🟡 *Harga Wajar (Hold / Cicil)*
- **Overvalued (Harga > Nilai Wajar)**:
  - Background: `bg-rose-500/10 dark:bg-rose-500/20`
  - Border: `border-rose-500/30`
  - Text: `text-rose-700 dark:text-rose-300 font-extrabold`
  - Icon: 🔴 *Kemahalan (Wait & See)*

### B. Forex Circuit Breaker & Safety Tokens
- **Aman (Drawdown < 10% / Risk < 2%)**:
  - Border: `border-emerald-500/30`
  - Text: `text-emerald-600 dark:text-emerald-400`
- **Waspada (Drawdown 10% – 25% / Risk 2% – 3%)**:
  - Border: `border-amber-500/30`
  - Text: `text-amber-600 dark:text-amber-400`
- **Bahaya / Circuit Breaker (Drawdown > 25% / Risk > 3%)**:
  - Border: `border-rose-500/40`
  - Text: `text-rose-600 dark:text-rose-400 font-black`
  - Card: `bg-rose-500/[0.04]` dengan peringatan: *"Drawdown kritis! Stop trading sejenak."*

---

## 3. Tata Letak Sub-Segmented Navigation

### Sub-Mode Saham:
```text
[ 📊 Transaksi & Pajak ]  [ 💎 Valuasi Graham ]  [ 📉 Average Down ]  [ 💰 Dividen Planner ]
```
- Setiap tombol memiliki:
  - `min-h-[44px]`
  - `px-3.5 py-2`
  - Font: `text-xs sm:text-sm font-bold`
  - State Aktif: `bg-primary text-white shadow-sm font-extrabold`
  - State Inaktif: `bg-black/[0.03] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.06]`

### Sub-Mode Forex:
```text
[ ⚖️ Position Sizing & Biaya Riil ]  [ 📉 Drawdown & Recovery Matrix ]
```

---

## 4. Format Teks Berbagi (WhatsApp & Clipboard Template)

### Template WhatsApp Valuasi Saham:
```text
📊 *Analisis Valuasi Saham — Amir App*
━━━━━━━━━━━━━━━━━━━━━━
• *Harga Pasar*: Rp 4.000
• *EPS / Laba per Lembar*: Rp 400
• *BVPS / Nilai Buku*: Rp 3.000
• *Nilai Wajar Graham*: Rp 5.196
• *Margin of Safety (MoS)*: +23.0% (Diskon)
• *Status*: 🟢 Undervalued (Diskon Menarik)
━━━━━━━━━━━━━━━━━━━━━━
🔗 Simulasi: https://amirapp.com/saham-kripto-emas
_Dihitung akurat sesuai kaidah Value Investing via Amir App._
```

### Template WhatsApp Trading Plan Forex:
```text
📊 *Trading Plan & Biaya Riil — Amir App*
━━━━━━━━━━━━━━━━━━━━━━
• *Pair*: EUR/USD
• *Sizing*: 0.50 Standard Lot (50.000 Units)
• *Resiko Akun*: $100 (1.0% dari saldo)
• *Stop Loss / TP*: 20 Pips / 40 Pips (R:R 1:2.0)
• *Biaya Riil (Spread + Komisi)*: $11.00
• *Potensi Reward Bersih*: $189.00
• *Real Break-Even Distance*: +2.2 Pips
• *Status Keamanan*: 🟢 Sangat Aman
━━━━━━━━━━━━━━━━━━━━━━
🔗 Simulasi: https://amirapp.com/forex
_Manajemen risiko terukur via Amir App._
```

---
*Spesifikasi desain ini diserahkan kepada Fiqry (`fiqry_frontend`) untuk diimplementasikan ke dalam komponen React.*
