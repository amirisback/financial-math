# Frontend Technical Implementation — TASK-003: Saham & Forex Investment Decision Suite

**Lead Frontend Developer**: Fiqry (`fiqry_frontend`)  
**Collaborator Roles**: Angel (`angel_uiux`), Richard (`richard_portfolio`), Adrian (`adrian_fundamental`), Arya (`arya_technical`), Bramantyo (`bramantyo_risk`), Faisal (`faisal_pm`)  
**Date**: 2026-09-19  
**Status**: Implemented & Verified  

---

## 1. Executive Summary

Fitur kalkulator Saham dan Forex pada Amir App telah di-upgrade secara komprehensif menjadi **Decision Support System (DSS)** untuk membantu investor pemula hingga usia 35+ mengambil keputusan berinvestasi secara objektif, terukur, dan terbebas dari bias emosional (FOMO / Panic Selling).

Implementasi dilakukan dengan arsitektur sub-tab modular tanpa mengubah skema routing URL utama, menjamin *backward compatibility*, performa *lightning-fast* tanpa re-render berlebih (React 19 Compiler-friendly), serta kepatuhan penuh terhadap standar aksesibilitas WCAG 2.1 AA (`min-h-[44px]` touch targets, font kontras tinggi, dan `CurrencyInput` otomatis).

---

## 2. File Inventory & Perubahan

| File | Tipe Perubahan | Deskripsi Singkat |
| :--- | :--- | :--- |
| `src/dictionaries/id.json` | Modified | Menambahkan 40+ kamus teks lokalisasi ID untuk Graham Valuation, Margin of Safety, Average Down, Dividen PPh/UU HPP, Biaya Riil Forex, dan Matriks Drawdown. |
| `src/dictionaries/en.json` | Modified | Menambahkan pasangan lokalisasi bahasa Inggris yang presisi dan konsisten secara terminologi pasar modal global. |
| `src/app/saham-kripto-emas/_components/asset-calculator.tsx` | Modified | Mengintegrasikan 4 sub-tab Saham: `pnl` (Profit/Loss), `valuation` (Graham Number), `averageDown` (DCA Simulator), dan `dividend` (Passive Income Planner). Memasang `CurrencyInput`, safety guards, dan WhatsApp share summary di setiap sub-tab. |
| `src/app/forex/_components/forex-calculator.tsx` | Modified | Mengintegrasikan 2 sub-tab Forex: `sizing` (Position Sizing + Biaya Riil Spread/Komisi) dan `drawdown` (Drawdown & Recovery Matrix). Memasang `CurrencyInput`, friction cost alert, dan WhatsApp share summary. |

---

## 3. Implementasi Algoritma Matematis Finansial

### 3.1. Benjamin Graham Fair Value & Margin of Safety (MoS)
- **Formula Fair Value Graham**:
  $$\text{Graham Number} = \sqrt{22.5 \times \text{EPS} \times \text{BVPS}}$$
- **Formula Margin of Safety (MoS)**:
  $$\text{MoS (\%)} = \frac{\text{Graham Number} - \text{Harga Pasar}}{\text{Graham Number}} \times 100\%$$
- **Safety Boundary Guard**:
  Jika $\text{EPS} \le 0$ atau $\text{BVPS} \le 0$ (perusahaan merugi atau ekuitas negatif), kalkulasi akar dihentikan untuk mencegah `NaN`. Sistem menampilkan kotak edukasi: *"Kalkulasi Nilai Wajar Graham memerlukan EPS & BVPS positif (> 0). Emiten yang merugi tidak dapat dinilai menggunakan rumus klasik Benjamin Graham."*
- **Verdict Rules**:
  - `MoS >= 20%`: **Undervalued (Diskon Menarik)** — Badge Hijau (`bg-emerald-500/10 text-emerald-600`)
  - `0% <= MoS < 20%`: **Fair Price (Harga Wajar)** — Badge Kuning (`bg-amber-500/10 text-amber-600`)
  - `MoS < 0%`: **Overvalued (Harga Premium / Kemahalan)** — Badge Merah (`bg-rose-500/10 text-rose-600`)

### 3.2. Average Down / Dollar-Cost Averaging (DCA) Simulator
- **Formula Harga Rata-Rata Baru**:
  $$\text{Lembar Baru} = \text{Lot Baru} \times 100$$
  $$\text{Total Modal Baru} = \text{Modal Lama} + (\text{Lembar Baru} \times \text{Harga Baru})$$
  $$\text{Total Lembar} = (\text{Lot Lama} + \text{Lot Baru}) \times 100$$
  $$\text{Harga Rata-Rata Baru} = \frac{\text{Total Modal Baru}}{\text{Total Lembar}}$$
- **Efisiensi & Rebound BEP**:
  $$\text{Penurunan Harga Rerata (\%)} = \frac{\text{Harga Beli Lama} - \text{Harga Rata-Rata Baru}}{\text{Harga Beli Lama}} \times 100\%$$
  $$\text{Kenaikan Rebound untuk BEP (\%)} = \frac{\text{Harga Rata-Rata Baru} - \text{Harga Saat Ini}}{\text{Harga Saat Ini}} \times 100\%$$

### 3.3. Perencanaan Dividen & Pasif Income Saham
- **Pajak Dividen (UU Harmonisasi Peraturan Perpajakan)**:
  - Opsi Reguler: PPh Final 10% $\rightarrow \text{Net DPS} = \text{DPS} \times 0.90$
  - Opsi Reinvestasi (Bebas Pajak UU HPP): PPh 0% $\rightarrow \text{Net DPS} = \text{DPS} \times 1.00$
- **Yield & Target Modal Bulanan**:
  $$\text{Net Yield (\%)} = \frac{\text{Net DPS}}{\text{Harga Saham}} \times 100\%$$
  $$\text{Kebutuhan Lembar Saham} = \left\lceil \frac{\text{Target Pasif Income Bulanan} \times 12}{\text{Net DPS}} \right\rceil$$
  $$\text{Kebutuhan Modal Total} = \text{Kebutuhan Lembar Saham} \times \text{Harga Saham}$$

### 3.4. Forex Real Trading Costs & Net Profit
- **Formula Biaya Riil**:
  $$\text{Biaya Spread (\$)} = \text{Standard Lots} \times \text{Spread (pips)} \times \text{Pip Value (\$)}$$
  $$\text{Biaya Komisi (\$)} = \text{Standard Lots} \times \text{Komisi Broker (\$/Lot)}$$
  $$\text{Total Biaya Riil} = \text{Biaya Spread} + \text{Biaya Komisi}$$
- **Profit Bersih & BEP Riil**:
  $$\text{Gross Profit (\$)} = \text{Standard Lots} \times \text{Take Profit (pips)} \times \text{Pip Value (\$)}$$
  $$\text{Net Profit} = \text{Gross Profit} - \text{Total Biaya Riil}$$
  $$\text{BEP Pips Riil} = \frac{\text{Total Biaya Riil}}{\text{Standard Lots} \times \text{Pip Value}}$$
- **High-Cost Friction Warning**:
  $$\text{Cost-to-Reward Ratio} = \frac{\text{Total Biaya Riil}}{\text{Gross Profit}} \times 100\%$$
  Jika rasio $> 15\%$, sistem memicu *warning alert* kuning bahwa transaksi terlalu terbebani biaya perantara.

### 3.5. Forex Drawdown & Exponential Recovery Matrix
- **Asymmetric Loss-to-Gain Formula**:
  $$\text{Required Gain (\%)} = \left(\frac{1}{1 - \text{Drawdown Fraction}} - 1\right) \times 100\%$$
- **Capital Depletion Guard**:
  Input drawdown dibatasi maksimal 95% untuk mencegah pembagian dengan nol ($1 - 1 = 0 \rightarrow \infty$).
- **Benchmark Table & Visual Alert**:
  Menyediakan tabel pembanding instan (10%, 20%, 30%, 50%, 70%, 90%) beserta Circuit Breaker Guard:
  - $\le 10\%$: Hijau (Normal trading noise)
  - $10\% - 20\%$: Amber (Waspada, evaluasi strategi)
  - $> 20\%$: Merah (Bahaya, kurangi lot size secara drastis)

---

## 4. Aksesibilitas & Pengalaman Pengguna (Usia 35++)

1. **Input Ergonomis**:
   - Seluruh input nominal rupiah dan modal saldo forex menggunakan komponen `CurrencyInput` dengan pemisah ribuan otomatis (`toLocaleString`).
   - Tidak ada angka menempel tanpa format pemisah.
2. **Target Sentuh Nyaman**:
   - Sub-tab pills dan tombol aksi memiliki `min-h-[44px]` dan `px-4 py-2.5` sesuai pedoman Apple HIG dan Android Material Design.
3. **Virality & Sharing**:
   - Setiap sub-tab dilengkapi tombol `ShareSummaryButton` dengan teks WhatsApp terformat rapi dan ringkas untuk dikirimkan ke grup investor atau komunitas diskusi.

---

## 5. Kepatuhan Standar & Kualitas Kode

- **No Warning Suppression**: Nol penggunaan `// @ts-ignore`, `// @ts-nocheck`, atau `// eslint-disable`. Seluruh variabel yang tidak digunakan dibersihkan secara bersih (*zero dead code*).
- **TypeScript Strict Mode**: 100% tipe data terdefinisi secara eksplisit.
- **Next.js 16 & React 19 Standards**: Kompatibel penuh dengan Server/Client component boundary dan tidak memicu cascading effect loop.
