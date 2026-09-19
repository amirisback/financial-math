# 01 Product Requirements Document (PRD) — Enhanced Investment Decision Tools (Saham & Forex)

**Task ID**: `TASK-003`  
**Feature**: Alat Bantu Keputusan Investasi & Trading: Valuasi Saham, Average Down, Dividen, Biaya Riil Forex & Recovery Drawdown  
**Lead PM**: Faisal (`faisal_pm`)  
**Collaborating Teams**: Tim FE (Faisal, Angel, Fiqry, Sandra) & Tim Saham (Richard, Adrian, Arya, Bramantyo, Darmawan, Clarissa)  
**Target Release**: Production Ready  

---

## 1. Executive Summary & Problem Statement

Aplikasi saat ini sudah memiliki kalkulator kalkulasi biaya transaksi saham dan kalkulator ukuran lot forex standar. Namun, dari sudut pandang investor pasar modal dan trader profesional (Tim Saham), fitur tersebut **baru menghitung ongkos transaksi, belum memfasilitasi pengambilan keputusan investasi yang krusial**.

Investor saham sering menghadapi kebingungan:
1. Apakah harga saham saat ini murah (*undervalued*) atau mahal (*overvalued*)?
2. Jika harga saham turun setelah dibeli, berapa lot yang harus dibeli lagi (*average down*) agar modal rata-rata turun ke harga tertentu dan cepat mencapai titik impas (*break-even*)?
3. Berapa dividen bersih yang riil diterima setelah pajak (10% vs 0% UU HPP), dan berapa modal yang harus disiapkan untuk mencapai target passive income per bulan?

Di sisi lain, trader forex sering:
1. Mengabaikan biaya riil (*spread* dan komisi broker) yang menggerus profit aktual.
2. Mengalami *drawdown* (penurunan modal) tanpa menyadari bahwa pemulihan modal membutuhkan persentase keuntungan yang berlipat ganda secara eksponensial.
3. Mengalami kesulitan input nominal saldo karena belum menggunakan pemisah titik ribuan.

**Tujuan Proyek**:
Membangun dan mengintegrasikan modul pendukung keputusan investasi berstandar kuantitatif institusional pada halaman Saham dan Forex, dibalut dengan desain antarmuka responsif, kontras tinggi, dan ramah pengguna usia 35++.

---

## 2. User Stories

1. **Sebagai Investor Nilai (Value Investor)**, saya ingin mengetahui Nilai Wajar Graham (*Graham Number*) dan persentase *Margin of Safety* (MoS) suatu saham secara instan berdasarkan laba per saham (EPS) dan nilai buku (BVPS), agar saya tidak membeli saham di harga pucuk yang kemahalan.
2. **Sebagai Swing Trader / Investor Saham**, saya ingin mensimulasikan strategi *Average Down* ketika harga saham terkoreksi, agar saya mengetahui berapa modal tambahan yang dibutuhkan dan berapa target harga *rebound* untuk impas.
3. **Sebagai Dividend Growth Investor**, saya ingin memproyeksikan dividen bersih tahunan/bulanan dan mengetahui berapa lot serta modal yang dibutuhkan untuk hidup dari dividen (misal: target Rp 5 Jt - Rp 10 Jt/bulan).
4. **Sebagai Trader Forex**, saya ingin kalkulator memperhitungkan *spread* dan komisi broker riil, agar saya mengetahui *Real Break-Even Pips* dan potensi keuntungan bersih yang sesungguhnya.
5. **Sebagai Trader yang Mengutamakan Manajemen Risiko**, saya ingin melihat Matriks Pemulihan Kerugian (*Drawdown & Recovery Matrix*) untuk memahami risiko psikologis dan persentase gain yang harus dicapai agar kembali impas tanpa *revenge trading*.

---

## 3. Kriteria Keberterimaan (Acceptance Criteria)

- [ ] **AC-01 (Kalkulator Valuasi Graham & Margin of Safety)**:
  - Mengimplementasikan formula Benjamin Graham: $\text{Graham Number} = \sqrt{22.5 \times \text{EPS} \times \text{BVPS}}$.
  - Menampilkan persentase Margin of Safety (MoS) dan badge status visual (Undervalued > 20%, Fair Value 0-20%, Overvalued < 0%).
- [ ] **AC-02 (Kalkulator Average Down & Plan Piramida)**:
  - Menerima input posisi awal (Lot awal & Harga awal) dan rencana pembelian baru (Lot baru & Harga baru).
  - Menghitung modal tambahan, total lot baru, dan harga rata-rata baru (*New Average Price*) serta % penurunan rata-rata modal.
- [ ] **AC-03 (Kalkulator Dividen & Target Passive Income)**:
  - Menghitung Dividend Yield (%), Dividen Kotor, Pajak Dividen (10% PPh Final atau 0% Reinvestasi UU HPP), dan Dividen Bersih per tahun & per bulan.
  - Fitur *Passive Income Goal*: Input target penghasilan bulanan dan otomatis menghasilkan modal saham serta lot yang harus dikumpulkan.
- [ ] **AC-04 (Forex Real Costs: Spread & Broker Commission)**:
  - Input Spread (pips) dan Komisi ($/lot) terintegrasi ke kalkulator forex.
  - Menampilkan rincian biaya kotor, total biaya riil (Spread + Komisi), keuntungan bersih (*Net Profit*), dan jarak pips impas (*Real Break-Even Distance*).
- [ ] **AC-05 (Forex Drawdown & Recovery Matrix)**:
  - Menyediakan simulator penurunan modal (% loss atau saldo puncak vs saldo terkini).
  - Menampilkan persentase keuntungan yang dibutuhkan untuk *recovery*: $\text{Gain Needed} = \left(\frac{1}{1 - \text{Loss}} - 1\right) \times 100\%$.
  - Dilengkapi *Circuit Breaker Alert* jika drawdown melampaui batas aman (≥ 20%).
- [ ] **AC-06 (Ergonomi Antarmuka 35++ & Sharing)**:
  - Input saldo forex dan nominal input saham menggunakan `CurrencyInput` (pemisah titik ribuan/jutaan otomatis).
  - Touch target tombol interaktif memenuhi minimal 44px (`min-h-[44px]`).
  - Dilengkapi `ShareSummaryButton` untuk menyalin hasil kalkulasi atau mengirimkannya ke WhatsApp dengan format terstruktur.
- [ ] **AC-07 (Integritas Kode & Clean Build)**:
  - Seluruh rumus matematis tervalidasi 100% tanpa risiko `division-by-zero` atau `NaN`.
  - `bun run lint` dan `bun run build` lolos tanpa peringatan (*zero warning suppression*).

---

## 4. Cross-Role Alignment Meeting Log (Verbatim)

### Faisal (PM - Moderator):
*"Rekan-rekan Tim FE dan Tim Saham, user telah menyetujui Opsi A (Paket Lengkap). Mari kita selaraskan spesifikasi fungsional, formula matematika, token visual, serta pengujian kualitas sebelum dieksekusi oleh Fiqry."*

#### 1. Richard (CIO & Lead Portfolio Manager - Tim Saham):
- **Assessment**: *"Langkah yang sangat tepat. Saat ini retail investor di Indonesia sering terjebak membeli saham di harga valuasi PER 40x tanpa sadar, atau terjebak averaging down tanpa perhitungan lot yang jelas. Di forex, 90% akun bangkrut karena tidak paham bahwa loss 50% butuh profit 100% untuk kembali impas. Paket A ini akan mengubah Amir App dari sekadar kalkulator biasa menjadi terminal perencanaan investasi cerdas."*

#### 2. Adrian (Senior Equity Research Analyst - Tim Saham):
- **Question**: *"Untuk formula Graham Number, bagaimana menangani kasus emiten yang memiliki EPS negatif (rugi) atau BVPS negatif?"*
  - **Faisal (PM Decision)**: *"Jika EPS atau BVPS bernilai nol atau negatif, Graham Number tidak dapat dihitung ($\sqrt{\text{negatif}} = \text{NaN}$). UI harus menampilkan pesan edukatif yang ramah: 'Formula Benjamin Graham hanya berlaku untuk perusahaan dengan laba dan nilai buku positif. Perusahaan ini sedang merugi sehingga tidak memiliki nilai wajar Graham'."*
  - **Fiqry (Frontend)**: *"Siap, saya buat guards `if (eps <= 0 || bvps <= 0)` agar langsung memberikan fallback pesan yang jelas tanpa merusak render."*

#### 3. Arya (Lead Chartist & Quantitative Technical - Tim Saham):
- **Question**: *"Pada Average Down, apakah kita menampilkan perbandingan harga impas terhadap harga pasar sekarang?"*
  - **Faisal (PM Decision)**: *"Ya. Tampilkan harga rata-rata baru dan persentase kenaikan harga yang dibutuhkan dari harga serok baru agar posisi mencapai BEP. Ini memberikan visualisasi realistis kepada investor."*

#### 4. Bramantyo (Chief Risk Officer - Tim Saham):
- **Question**: *"Untuk Forex, apakah kita memasukkan peringatan jika Spread melebihi 3 pips atau Komisi broker terlalu tinggi?"*
  - **Bramantyo's Assessment**: *"Jika spread > 3 pips pada pair mayor, atau rasio komisi memakan > 15% dari potensi keuntungan, sistem harus memunculkan peringatan Amber: 'Biaya trading menggerus lebih dari 15% potensi reward. Pertimbangkan ganti tipe akun/broker zero-spread'."*
  - **Faisal (PM Decision)**: *"Setuju! Ini nilai tambah yang sangat mengedukasi pengguna."*

#### 5. Angel (UI/UX Designer - Tim FE):
- **Question**: *"Bagaimana penataan sub-tab di halaman Saham agar tidak membebani layout kartu?"*
  - **Angel's Specification**: *"Gunakan sub-segmented pill switcher di dalam tab Saham dengan 4 pill: 1) Biaya & PnL, 2) Valuasi Graham, 3) Average Down, 4) Dividen Planner. Setiap pill memiliki `min-h-[44px]` dan label teks kontras tinggi (`text-xs sm:text-sm font-bold`). Untuk MoS, gunakan visual badge: Emerald (Undervalued), Amber (Fair Value), Rose (Overvalued)."*

#### 6. Sandra (QA Engineer - Tim FE):
- **Question**: *"Bagaimana dengan pengujian edge case? Misal input loss 100% pada Drawdown Matrix yang bisa memicu pembagian nol (`1 / (1 - 1) = Infinity`)?"*
  - **Fiqry's Response**: *"Saya akan membatasi slider Drawdown maksimal di 95%. Jika ada input 100%, sistem akan menampilkan pesan khusus: 'Modal habis total (100% Drawdown) — Recovery tidak memungkinkan tanpa deposit modal baru'."*
  - **Sandra's Rule**: *"Quality Gate akan menguji: 1) input ekstrem nol dan negatif, 2) responsivitas mobile 375px, 3) akurasi format ribuan CurrencyInput, 4) kesesuaian WhatsApp copy generator."*
