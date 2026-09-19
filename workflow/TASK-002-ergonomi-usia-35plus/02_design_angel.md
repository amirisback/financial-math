# Spesifikasi Desain Antarmuka: Ergonomi Usia 35++

**Author:** Angel (`angel_uiux`) — UI/UX Designer  
**Epic / Task ID:** `TASK-002-ergonomi-usia-35plus`  
**Status:** Approved  
**Date:** 2026-09-19  

---

## 1. Prinsip Ergonomi Penglihatan & Motorik Usia 35++

Pengguna usia 35 tahun ke atas mengalami perubahan fisiologis alami pada penglihatan dan interaksi sentuh:
1. **Presbiopia (Gejala Penurunan Akomodasi Lensa Mata):**
   - Jarak baca ponsel cenderung menjauh (35–45 cm).
   - Teks di bawah 12px (`0.75rem`) sulit dibedakan, terutama angka kecil seperti `0`, `6`, `8`, `9`.
   - **Solusi:** Menetapkan standar ukuran teks minimal **13px–14px** untuk deskripsi/helper, **15px–16px** untuk teks input, dan judul kalkulator **24px–32px** yang tegas.
2. **Sensitivitas Kontras Warna (WCAG AA Minimal 4.5:1):**
   - Mata usia 35+ membutuhkan pemisahan kontras yang lebih tajam antara teks dengan latar belakang.
   - **Solusi:** Ganti warna teks abu-abu tipis `text-zinc-400` dengan `text-zinc-600` (Light) / `text-zinc-300` (Dark). Border card ditingkatkan opacity-nya agar kontur kartu terlihat jelas.
3. **Fitts's Law & Motorik Jempol (Touch Target >= 44x44px):**
   - Menghilangkan slider track tipis yang licin. Gunakan track slider minimal `h-2.5` hingga `h-3` dengan thumb yang mudah ditangkap jempol.
   - Input number dan button dinaikkan tingginya menjadi minimal `min-h-[44px]` (standar Apple HIG & Google Material).

---

## 2. Design Tokens & Color Contrast System

### A. Tipografi Baru untuk Ergonomi 35++:
| Skala | Class Tailwind | Ukuran Pixel | Font Weight | Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Micro Caption (Lama)** | ~~`text-[10px]`~~ | ❌ 10px | Normal | *Dihapus seluruhnya* |
| **Helper / Caption Baru** | `text-xs sm:text-sm` | 12px - 14px | Medium / Semibold | Tick mark slider, info kecil, badge |
| **Body / Input Text** | `text-sm sm:text-base`| 14px - 16px | Semibold | Teks form, input angka, deskripsi |
| **Card Title / Subhead** | `text-base sm:text-lg`| 16px - 18px | Bold | Label input utama, sub-judul kartu |
| **Headline Angka Hasil** | `text-2xl sm:text-3xl`| 24px - 30px | Extrabold | Total nominal bersih, cicilan bulanan |

### B. Contrast Upgrade Token:
- **Card Border (Light Mode):** Dari `rgba(226, 232, 240, 0.85)` menjadi `rgba(203, 213, 225, 0.95)` (Slate-300).
- **Secondary Text (Light Mode):** Dari `text-zinc-400` (#a1a1aa, kontras 2.8:1) menjadi `text-zinc-600` (#52525b, kontras **5.8:1** - Lolos WCAG AAA).
- **Secondary Text (Dark Mode):** Dari `text-zinc-500` menjadi `text-zinc-300` (#d4d4d8, kontras **7.2:1** - Lolos WCAG AAA).
- **Primary Accent:** Tetap mempertahankan Indigo (#4f46e5 / #6366f1) dan Emerald (#10b981) yang memiliki kontras tinggi terhadap latar putih dan gelap.

---

## 3. Spesifikasi Komponen Baru

### A. `CurrencyInput` (Input Rupiah dengan Pemisah Ribuan)
```text
┌────────────────────────────────────────────────────────────┐
│ [Label Field, misal: Modal Awal]         [Rp 10.000.000]   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │  Rp  │  10.000.000                       │  [ - ] [+]  │ │  <-- Tinggi 46px (min-h-[44px])
│ └────────────────────────────────────────────────────────┘ │
│ [ ═════════════════════════════════════════════════════ ] │  <-- Slider Track h-2.5
│ Rp0                   Rp50.000.000            Rp100.000.000│  <-- text-xs font-semibold
│ ┌───────────────┐ ┌───────────────┐ ┌────────────────────┐ │
│ │  + 1 Juta     │ │  + 5 Juta     │ │  + 10 Juta         │ │  <-- Quick Increment Chips
│ └───────────────┘ └───────────────┘ └────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

- **Fitur Utama:**
  - Menampilkan angka dengan separator titik `10.000.000`.
  - Prefix `Rp` terintegrasi di dalam kotak input.
  - Tombol stepper cepat `[-]` dan `[+]` atau preset chips `[+1 Jt]`, `[+5 Jt]`, `[+10 Jt]`.
  - Tinggi tombol dan input minimal `44px` sehingga ramah jempol.

### B. `ShareSummaryButton` (Salin Ringkasan untuk WhatsApp / Diskusi Keluarga)
```text
┌────────────────────────────────────────────────────────────┐
│  TOTAL ESTIMASI DANA BERSIH                                │
│  Rp 154.200.000                                            │
│                                                            │
│  [ 📋 Salin Ringkasan untuk Diskusi Keluarga (WhatsApp) ]  │  <-- Tombol Ramah Keluarga
└────────────────────────────────────────────────────────────┘
```

- **Format Teks yang Disalin:**
  ```text
  📊 Simulasi Perhitungan Finansial (Amir App)
  ---------------------------------------------
  Fitur: [Nama Fitur, misal: KPR Rumah]
  • Harga Properti: Rp 500.000.000
  • Uang Muka (DP 20%): Rp 100.000.000
  • Tenor: 15 Tahun (Bunga 6.0%)
  • Estimasi Cicilan: Rp 3.375.426 / bulan
  • Total Biaya Awal (DP + Pajak + Notaris): Rp 124.500.000
  ---------------------------------------------
  Dihitung otomatis via Amir App: https://financial-math.app/rumah
  ```
- **Feedback Visual:** Setelah ditekan, tombol berubah hijau dengan teks `"✓ Ringkasan Tersalin!"` selama 2.5 detik.

### C. Jargon Financial Tooltip Helper
- Istilah teknis (seperti `ADDM`, `BPHTB`, `APHT`) dilengkapi icon info kecil `ⓘ` yang jika diklik/hover menampilkan popup bahasa awam yang bersahabat.
