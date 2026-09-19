# PRD & Scoping: Peningkatan Ergonomi & Aksesibilitas untuk Pengguna Usia 35++

**Author:** Faisal (`faisal_pm`) — Product Manager & Business Analyst  
**Epic / Task ID:** `TASK-002-ergonomi-usia-35plus`  
**Status:** Approved  
**Date:** 2026-09-19  

---

## 1. Product Overview & User Persona 35++

Life Calculator (`life-calculator` / Amir App) memiliki 10 modul kalkulator finansial dan bisnis yang secara konten sangat relevan dengan kebutuhan orang dewasa mapan (usia 35–55 tahun). Pengguna pada demografi ini umumnya berada di fase *peak financial responsibility* (kepala keluarga, sandwich generation, perencanaan KPR rumah, renovasi, ganti mobil keluarga, tabungan pensiun, dan pajak properti).

Namun, audit antarmuka menemukan beberapa hambatan kenyamanan (ergonomi) bagi mata dan motorik pengguna 35++:
1. **Presbyopia & Ukuran Teks:** Penurunan daya akomodasi mata alami di usia 38+ membuat teks berukuran kecil (`text-[10px]` dan `text-xs`) sulit dibaca tanpa menyipitkan mata.
2. **Sensitivitas Kontras:** Teks abu-abu tipis (`text-zinc-400`) pada latar terang tidak memenuhi standar WCAG AA (rasio < 4.5:1).
3. **Cognitive Load pada Input Angka:** Input angka polos tanpa pemisah ribuan (`500000000`) memaksa pengguna menghitung jumlah angka nol secara manual.
4. **Touch Target Motorik Halus:** Slider tipis (`h-2`) dan tombol berukuran kecil (`< 44px`) sering terlewat saat ditekan menggunakan jempol di layar smartphone.
5. **Kebutuhan Berbagi (Collaborative Decision Making):** Keputusan finansial di usia 35+ dilakukan bersama pasangan/keluarga, sehingga diperlukan ringkasan hitungan yang siap dibagikan via WhatsApp.

### User Stories
- **Sebagai Pengguna Usia 35++**, saya ingin membaca semua teks, angka, dan hasil hitungan dengan jelas tanpa harus menyipitkan mata atau mencari kacamata baca.
- **Sebagai Pengguna Usia 35++**, saya ingin mengetik nominal uang dengan pemisah ribuan otomatis (`Rp 500.000.000`) dan tombol cepat (`+10 Jt`, `+50 Jt`) agar tidak salah memasukkan jumlah angka nol.
- **Sebagai Pengguna Usia 35++**, saya ingin mengontrol slider dan tombol dengan nyaman melalui jempol tanpa takut meleset (touch target minimal 44px).
- **Sebagai Pengguna Usia 35++**, saya ingin memahami istilah finansial teknis (seperti ADDM, BPHTB, APHT) melalui penjelasan singkat yang mudah dipahami.
- **Sebagai Pengguna Usia 35++**, saya ingin menyalin ringkasan kalkulasi dalam format rapi untuk didiskusikan dengan pasangan/keluarga via WhatsApp.

---

## 2. Acceptance Criteria (AC)

- [x] **AC-01: Peningkatan Skala Tipografi & Penghapusan Teks Mikroskopis**
  Semua teks berukuran `text-[10px]` dihapus dan diganti menjadi minimal `text-xs` (12px dengan medium/semibold weight) atau `text-sm` (14px). Judul kartu, angka hasil kalkulasi, dan tabel data diperbesar untuk keterbacaan optimal.
- [x] **AC-02: Peningkatan Rasio Kontras Warna (WCAG 2.1 AA Compliance)**
  Semua teks label sekunder yang sebelumnya `text-zinc-400` / `text-zinc-500` pada latar terang dinaikkan kontrasnya menjadi minimal `text-zinc-600` (Light) / `text-zinc-300` (Dark) dengan rasio kontras $\ge 4.5:1$. Border card dibuat lebih tegas.
- [x] **AC-03: Komponen CurrencyInput dengan Masking Pemisah Titik Ribuan**
  Tersedia komponen input angka finansial yang memformat nominal secara live dengan separator ribuan (contoh: `10.000.000`) dengan prefix `Rp` yang jelas, tinggi sentuh `min-h-[44px]`, dan keyboard input numerik yang aman.
- [x] **AC-04: Tombol Pintasan Cepat (Quick Increment Chips) & Slider Ergonomis**
  Kalkulator utama dilengkapi tombol pintasan penambah nominal cepat (`+1 Jt`, `+10 Jt`, `+50 Jt`, preset DP, dsb.) dan slider dinaikkan ketebalan track-nya (`h-2.5` / `h-3`) agar nyaman digeser jempol.
- [x] **AC-05: Tooltip/Penjelasan Ringkas Istilah Teknis Finansial**
  Tersedia penjelasan manusiawi untuk istilah teknis (ADDM vs ADDB, BPHTB, APHT, PBB, Asuransi Jiwa KPR) sehingga pengguna tidak bingung.
- [x] **AC-06: Fitur Salin Ringkasan untuk Diskusi Keluarga (WhatsApp Share Ready)**
  Panel hasil kalkulator dilengkapi tombol aksi untuk menyalin ringkasan angka simulasi secara lengkap dan rapi ke clipboard untuk dikirimkan ke WhatsApp/chat keluarga.
- [x] **AC-07: Verifikasi Kualitas & Quality Gate Approval**
  Semua kalkulator eksisting berfungsi tanpa regresi, build produksi lulus tanpa error, dan lint bersih tanpa peringatan.

---

## 3. Verbatim Cross-Role Alignment Meeting Log

### Cross-Role Alignment Meeting Log

#### 1. Sandra (QA):
- **Question**: *"Jika kita mengganti `input type="number"` menjadi komponen string-masked dengan titik pemisah ribuan, bagaimana mencegah bug parsing NaN atau format desimal pada kalkulator bunga/persentase?"*
  - **Faisal (PM Decision)**: Komponen `CurrencyInput` khusus menangani nominal Rupiah (integer tanpa desimal). Untuk input persentase bunga (misal 5.5%), gunakan `NumberInput` khusus yang mendukung desimal dengan safe min-max clamping dan stepper tombol `[-]` `[+]` 0.1% agar tetap ramah sentuhan.
  - **Fiqry (Frontend)**: Kami akan membuat helper sanitasi `parseNumber(rawString)` yang otomatis membuang semua karakter non-angka sebelum diteruskan ke state number React. State kalkulator internal tetap `number`, sehingga 100% kompatibel dengan rumus kalkulasi yang sudah ada tanpa breaking changes.

#### 2. Bryan (Backend/DevOps):
- **Question**: *"Apakah perubahan ergonomi dan penambahan tombol salin ringkasan WhatsApp ini berdampak pada API server atau state session?"*
  - **Bryan's Assessment**: Seluruh perbaikan ini berada pada lapisan presentasi client-side (Client Components & Tailwind UI tokens). Zero overhead memori server, zero API payload increase, dan Serwist PWA cache tetap ringan.
  - **Faisal (PM Decision)**: Pertahankan prinsip zero server latency. Semua pemformatan dan penyalinan clipboard dijalankan lokal di browser.

#### 3. Angel (UI/UX):
- **Question**: *"Bagaimana kita menyeimbangkan tampilan modern glassmorphism dengan kebutuhan kontras tinggi agar tidak terlihat 'kuno' tapi tetap sangat nyaman untuk mata 35++?"*
  - **Angel's Explanation**: Kita tidak menghilangkan estetika premium, melainkan mempertajam hierarki visual. 
  - **Fix**: 
    1. Naikkan ketegasan border card dari `rgba(226,232,240,0.85)` menjadi `rgba(203,213,225,0.95)` (slate-300) di mode terang.
    2. Ganti semua `text-[10px]` menjadi `text-xs font-semibold` (12px) atau `text-sm` (14px).
    3. Perbesar area sentuh button dan input ke tinggi minimal `44px` (`min-h-[44px]`).
    4. Ganti warna teks pudar `text-zinc-400` dengan `text-zinc-600 dark:text-zinc-300`.
  - **Angel's Specification**: Tombol aksi "Salin Ringkasan" diletakkan di bawah total nominal utama dengan aksen hijau emerald/indigo yang menonjol dan ikon WhatsApp/Clipboard yang mudah dikenali.

#### 4. Fiqry (Frontend Web Developer):
- **Question**: *"Apakah kita akan membuat komponen reusable untuk input dan quick chips agar konsisten di seluruh modul kalkulator?"*
  - **Fiqry's Proposal**: Ya, kita buat `src/app/_components/ui/currency-input.tsx` dan `src/app/_components/ui/share-summary-button.tsx`. Komponen ini akan dipakai di kalkulator utama seperti Menabung, KPR Rumah, Mobil, Motor, Investasi, Tanah, dsb.
  - **Faisal (PM Decision)**: Disetujui. Pastikan komponen ini memiliki dukungan aksesibilitas keyboard (Enter, Tab, ARIA labels) dan visual feedback saat tombol disalin (misal: "Tersalin ke Clipboard!").
  - **Fiqry's Inventory**:
    1. UI Components baru: `currency-input.tsx`, `share-summary-button.tsx`.
    2. Global tokens: `globals.css` (perbaikan kontras dan ketebalan border card).
    3. Update `button.tsx` (skala ukuran touch target minimum 44px).
    4. Refactor kalkulator utama: `savings-calculator.tsx`, `house-calculator.tsx`, `car-calculator.tsx`, dsb.
    5. Pengujian lint & build produksi.
