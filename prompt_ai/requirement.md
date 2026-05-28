# Blueprint Kalkulator Finansial & Bisnis (Regulasi Indonesia)

Dokumen ini berisi spesifikasi teknis, komponen input, logika rumus, panduan lapangan, serta skenario data riil untuk pengembangan aplikasi kalkulator finansial.

---

## 1. Kalkulator Bisnis & Harga Jual (Pricing Calculator)

### Komponen Input

* **HPP (Harga Pokok Penjualan) per unit:** (Rp)
* **Biaya Operasional Tetap Bulanan:** Gaji, sewa, listrik, dll. (Rp)
* **Target Volume Penjualan per Bulan:** (Unit)
* **Target Margin Keuntungan:** (%)
* **Skema Pajak Bisnis:** (Pilihan: Non-Pajak / PPh Final UMKM 0.5% / PPN 11%)

### Logika & Rumus

* $\text{Biaya Operasional per unit} = \frac{\text{Biaya Operasional Tetap}}{\text{Target Volume Penjualan}}$
* $\text{Total Biaya per unit} = \text{HPP} + \text{Biaya Operasional per unit}$
* $\text{Harga Jual Dasar (Sebelum Pajak)} = \frac{\text{Total Biaya per unit}}{1 - \frac{\text{Target Margin}}{100}}$
* **Penyesuaian Pajak:**
  * *Jika PPh Final UMKM:* $\text{Harga Jual} = \frac{\text{Harga Jual Dasar}}{1 - 0.005}$
  * *Jika PPN 11%:* $\text{Harga Jual} = \text{Harga Jual Dasar} \times 1.11$
  * *Jika Non-Pajak:* $\text{Harga Jual} = \text{Harga Jual Dasar}$
* $\text{Total Keuntungan Bersih Bulanan} = (\text{Harga Jual} - \text{Total Biaya per unit} - \text{Pajak per unit}) \times \text{Target Volume Penjualan}$
* $\text{BEP (Break Even Point) dalam Unit} = \frac{\text{Biaya Operasional Tetap}}{\text{Harga Jual} - \text{HPP}}$

### Output

* Harga Jual per Unit (Rekomendasi)
* Harga Jual setelah Pembulatan (ke ribuan teratas)
* Total Biaya per Unit
* BEP dalam Unit
* Estimasi Profit Bersih Bulanan

### Panduan Lapangan (Do's & Don'ts)
>
> 📌 **Do's (Lakukan & Perhatikan):**
>
> * Hitung biaya sekecil apa pun (seperti lakban, plastik kemasan, kuota internet jualan) ke dalam HPP agar tidak menggerus keuntungan.
> * Riset harga kompetitor agar harga rekomendasi dari kalkulator tetap kompetitif di pasar.
>
> ❌ **Don'ts (Hindari & Jangan Dilakukan):**
>
> * Jangan abaikan gaji sendiri. Pemilik usaha wajib memasukkan alokasi gaji mereka ke dalam komponen Biaya Operasional Tetap.
> * Jangan gunakan asumsi target volume penjualan yang terlalu optimistis di awal bisnis.

### Skenario Contoh Riil (Default Aplikasi)

* **Input:** HPP Rice Bowl = Rp15.000; Biaya Tetap = Rp4.500.000; Target Jualan = 500 unit/bulan; Target Margin = 40%; Pajak = PPh Final UMKM 0.5%.
* **Output:** Total Biaya/unit = Rp24.000; Harga Jual Rekomendasi setelah pembulatan = **Rp41.000 / porsi**; BEP = **173 unit/bulan**; Estimasi Profit Bersih = **Rp8.397.500 / bulan**.

---

## 2. Kalkulator Jual Beli Tanah Indonesia

### Komponen Input

* **Luas Tanah (m²) & Harga per m²** ATAU **Total Harga Kesepakatan (Rp)**
* **Nilai Jual Objek Pajak (NJOP) per m²:** (Rp)
* **NPTKP (Nilai Perolehan Tidak Kena Pajak):** Default Rp60.000.000 (Khusus DKI Jakarta perolehan pertama Rp350.000.000).
* **Skema Insentif Daerah:** (Pilihan: Normal / Diskon BPHTB Daerah)
* **Status Pembeli:** (Pilihan: Tunai / KPR-KPT Bank)
* **Jika Melalui Bank:** Uang Muka/DP (%), Suku Bunga Pinjaman (% efektif per tahun), Tenor (Tahun).

### Logika & Rumus

* $\text{Total Harga Tanah} = \text{Luas} \times \text{Harga per m²}$
* $\text{Nilai Acuan Pajak (Nilai Tertinggi)} = \text{Maksimum}(\text{Total Harga Tanah}, \text{Total NJOP})$
* $\text{Pajak Penjual (PPh Final)} = 2.5\% \times \text{Nilai Tertinggi}$
* $\text{Pajak Pembeli (BPHTB)} = 5\% \times (\text{Nilai Tertinggi} - \text{NPTKP})$ *(Jika hasil minus atau mendapat diskon daerah, maka dianggap 0)*
* $\text{Biaya Notaris/PPAT (AJB & Jasa)} = \text{Estimasi } 1\% \text{ dari nilai transaksi}$
* $\text{Biaya Balik Nama (BBN) Resmi} = \left(\frac{\text{Nilai Tanah}}{1000}\right) + \text{Rp50.000} + \text{Jasa Paket Notaris (~Rp2.000.000)}$
* **Sisi Penjual (Uang Bersih):** $\text{Total Harga} - \text{PPh} - \left(\frac{\text{Biaya AJB}}{2} \text{ jika dibagi 50:50}\right)$
* **Sisi Pembeli (Jika Bank):** $\text{Plafon Pinjaman} = \text{Total Harga} - \text{DP}$. Ditambah Biaya Bank (Provisi 1% + Admin Rp1.000.000). Angsuran dihitung menggunakan rumus *Amortisasi Suku Bunga Efektif (Annuity)*.

### Output

* **Sisi Penjual:** Uang bersih diterima dan rincian potongan (PPh & Notaris).
* **Sisi Pembeli:** Total uang tunai siap di awal, angsuran bulanan bank, dan rasio ideal cicilan terhadap pendapatan.
* **Edukasi Teks:** Langkah singkat pengurusan sertifikat tanah di BPN/PPAT.

### Panduan Lapangan (Do's & Don'ts)
>
> 📌 **Do's (Lakukan & Perhatikan):**
>
> * Wajib melakukan pengecekan keaslian sertifikat (*plotting*) ke kantor BPN setempat sebelum membayar DP untuk memastikan lahan bebas dari sengketa.
> * Tegaskan kesepakatan tertulis mengenai pembagian biaya notaris sejak awal transaksi.
>
> ❌ **Don'ts (Hindari & Jangan Dilakukan):**
>
> * Jangan gunakan kwitansi bawah tangan tanpa melibatkan PPAT resmi karena berisiko tinggi secara legal.
> * Jangan melakukan *under-invoicing* (memalsukan/menurunkan harga transaksi di akta agar bayar pajak lebih murah) karena merupakan pelanggaran hukum berat.

### Skenario Contoh Riil (Default Aplikasi)

* **Input:** Luas = 100 m²; Harga = Rp3.000.000/m² (Total Rp300.000.000); NJOP = Rp2.000.000/m²; NPTKP = Rp60.000.000; Status = Tunai.
* **Output:** PPh Penjual = Rp7.500.000; BPHTB Pembeli = Rp12.000.000; Biaya AJB (50:50) = Rp1.500.000; **Uang Bersih Penjual = Rp291.000.000**; **Total Dana Siap Pembeli di Awal = Rp315.850.000**.

---

## 3. Kalkulator Jual Beli Rumah Indonesia

### Komponen Input

* **Harga Kesepakatan Rumah:** (Rp)
* **Nilai NJOP Rumah:** (Rp)
* **NPTKP Daerah:** Default Rp60.000.000 (DKI Jakarta Rp350.000.000).
* **Skema Pembayaran:** (Pilihan: Cash / KPR)
* **Jika KPR:** DP (%), Suku Bunga KPR (% per tahun), Tenor (Tahun), Usia Pemohon KPR (Tahun).

### Logika & Rumus

* Regulasi pajak & notaris mengikuti aturan properti dasar (PPh 2.5%, BPHTB 5% setelah dikurangi NPTKP, AJB/Notaris ~1%, BBN BPN).
* **Biaya Tambahan KPR:** Biaya Provisi (1% dari plafon) + Biaya Administrasi (~Rp1.000.000) + Biaya APHT (~0.5% dari plafon).
* **Asuransi KPR (Jiwa & Kebakaran) dinamis berdasarkan usia:**
  * *Usia < 30 tahun:* 1.2% dari plafon
  * *Usia 30-45 tahun:* 1.7% dari plafon
  * *Usia > 45 tahun:* 2.5% dari plafon
* **Simulasi Cicilan KPR:** Menggunakan rumus *Amortisasi Suku Bunga Efektif (Annuity)*.
* **Dana Mengendap:** Menambahkan komponen wajib saldo mengendap setara 1x s.d 2x cicilan bulanan.

### Output

* Total Dana Siap di Awal bagi pembeli (DP + Pajak BPHTB + Notaris + Seluruh Biaya KPR + Saldo Mengendap Bank)
* Rincian Angsuran KPR per bulan
* Rekomendasi Penghasilan Minimum Pembeli (3x lipat dari nilai cicilan)

### Panduan Lapangan (Do's & Don'ts)
>
> 📌 **Do's (Lakukan & Perhatikan):**
>
> * Perhatikan masa *Fixed Rate* (Bunga Tetap) KPR dan bersiaplah dengan skema finansial saat bunga mulai naik mengikuti pasar (*Floating Rate*).
> * Cek kondisi fisik bangunan secara mendetail (*retensi*) sebelum menandatangani berita acara serah terima kunci.
>
> ❌ **Don'ts (Hindari & Jangan Dilakukan):**
>
> * Jangan mengabaikan biaya saldo mengendap bank yang sering memicu kegagalan akad di hari H.
> * Jangan mengambil cicilan bulanan yang nilainya melebihi 30% dari total pendapatan bersih bulanan Anda.

### Skenario Contoh Riil (Default Aplikasi)

* **Input:** Harga Rumah = Rp500.000.000; NJOP = Rp400.000.000; NPTKP = Rp60.000.000; KPR dengan DP = 10%, Bunga = 6% Fixed, Tenor = 15 Tahun, Usia = 28 Tahun.
* **Output:** Plafon KPR = Rp450.000.000; BPHTB = Rp22.000.000; Total Biaya KPR + Asuransi = Rp13.150.000; Cicilan = **Rp3.797.000/bulan**; **Total Dana Siap di Awal = Rp95.947.000**; **Penghasilan Minimum Pembeli = Rp11.400.000/bulan**.

---

## 4. Kalkulator Menabung & Compound Interest

### Komponen Input

* **Tabungan Awal / Modal Awal:** (Rp)
* **Setoran Rutin Bulanan:** (Rp)
* **Suku Bunga / Imbal Hasil per Tahun:** (%)
* **Durasi / Tenor Menabung:** (Tahun)
* **Pajak atas Bunga:** (Toggle On/Off 20% untuk instrumen bank konvensional)
* **Biaya Administrasi Bulanan Bank:** Default Rp15.000. (Rp)

### Logika & Rumus

* $\text{Bunga bulanan riil} = \frac{\text{Suku Bunga}}{12}$
* *Jika pajak aktif:* $\text{Bunga bulanan bersih} = \text{Bunga bulanan riil} \times (1 - 0.20)$
* **Iterasi Pertumbuhan Bulanan (Looping):**
  $$\text{Saldo Bulan Ini} = (\text{Saldo Bulan Lalu} \times (1 + \text{Bunga bulanan bersih})) + \text{Setoran Rutin} - \text{Biaya Admin Bulanan}$$

### Output

* Total Akumulasi Dana Bersih
* Total Modal yang Disetor
* Total Keuntungan dari Bunga (setelah dipotong pajak & admin)
* Tabel Pertumbuhan Dana Tahunan

### Panduan Lapangan (Do's & Don'ts)
>
> 📌 **Do's (Lakukan & Perhatikan):**
>
> * Aktifkan fitur otomatis (*Autodebet*) tepat di tanggal gajian agar disiplin menabung berjalan konsisten.
> * Pahami efek inflasi; jika persentase bunga tabungan di bawah inflasi tahunan, daya beli riil uang Anda sebenarnya berkurang.
>
> ❌ **Don't (Hindari & Jangan Dilakukan):**
>
> * Jangan menabung dalam nominal kecil di bank konvensional yang memiliki biaya admin tinggi, karena saldo Anda justru akan habis tergerus biaya bulanan.
> * Jangan pernah mencampur rekening tabungan utama dengan rekening operasional belanja harian.

### Skenario Contoh Riil (Default Aplikasi)

* **Input:** Modal Awal = Rp10.000.000; Setoran = Rp2.000.000/bulan; Imbal Hasil = 5.5% (Contoh: Reksa Dana Pasar Uang); Tenor = 5 Tahun; Pajak = OFF; Admin = Rp0.
* **Output:** Total Modal Disetor = Rp130.000.000; **Total Akumulasi Dana Bersih = Rp151.240.000**; **Keuntungan Bersih Bunga = Rp21.240.000**.

---

## 5. Kalkulator Investasi (Multi-Aset)

### Sub-Tab: Saham (Dividen & Estimasi Return)

* **Input:** Jumlah Lot, Harga Beli per lembar, Dividen per Share (DPS) terakhir. Fee Beli (default 0.15%), Fee Jual (default 0.25%). Toggle Pajak Dividen (0% jika diinvestasikan kembali, 10% jika langsung dicairkan).
* **Logika:** $\text{Total Modal Riil} = (\text{Jumlah Lot} \times 100 \times \text{Harga Beli}) \times (1 + \text{Fee Broker Beli})$
* **Output:** Total Modal Bersih (setelah fee), Estimasi Total Dividen Cair, Dividen Yield (%), serta catatan edukasi regulasi *Cum/Ex Date*.
* **Skenario Riil (Default):** Input 10 Lot (1.000 lembar) saham perbankan di harga Rp9.000, DPS = Rp350, Pajak Dividen = 0% (Investasi kembali). Total Modal Riil = Rp9.013.500; **Dividen Bersih = Rp350.000**; **Dividen Yield = 3.88% per tahun**.

### Sub-Tab: Emas Antam / Pegadaian

* **Input:** Jumlah Gram, Harga Beli awal per gram, Harga Buyback saat ini per gram.
* **Logika:** Menghitung profit/loss riil berdasarkan selisih harga acuan beli masa lalu terhadap harga jual kembali (*buyback*) pasar hari ini.
* **Output:** Total Modal Beli, Nilai Jual saat ini, Keuntungan/Kerugian bersih (Rp dan %).

### Sub-Tab: SBN (Surat Berharga Negara) & Deposito

* **Input:** Nominal Investasi (Rp), Kupon/Bunga per tahun (%).
* **Logika Pajak:** Otomatis memotong Pajak SBN terbaru sebesar 10% atau Pajak Deposito sebesar 20%.
* **Output:** Kupon kotor bulanan, Potongan pajak bulanan, dan Kupon bersih yang ditransfer ke rekening nasabah setiap bulan.

### Panduan Lapangan (Do's & Don'ts)
>
> 📌 **Do's (Lakukan & Perhatikan):**
>
> * Perhatikan tanggal *Cum Date* jika Anda berinvestasi demi mengincar dividen saham; Anda wajib memegang saham tersebut hingga pasar tutup di hari itu.
> * Tempatkan investasi emas untuk jangka panjang (3-5 tahun) sebagai pelindung nilai instrumen inflasi, bukan untuk trading harian.
>
> ❌ **Don'ts (Hindari & Jangan Dilakukan):**
>
> * Jangan gunakan "Uang Panas" (seperti uang bayar sekolah atau pinjaman online) untuk masuk ke instrumen investasi berisiko.
> * Jangan terjebak FOMO (*Fear of Missing Out*) membeli aset finansial hanya karena sedang viral tanpa memahami fundamentalnya.

---

## 6. Kalkulator Depresiasi Barang Konsumtif

### Komponen Input

* **Nama Barang / Kategori:** (Preset: Gadget / Mobil Baru / Mobil Bekas / Motor / Input Manual)
* **Harga Beli:** Baru atau Seken (Rp)
* **Umur Ekonomis Penggunaan:** (Tahun)

### Logika & Rumus

Menggunakan pendekatan *Metode Saldo Menurun (Declining Balance)* dengan penyesuaian *Shock Drop* (Penurunan ekstrem) di tahun pertama sesuai realitas pasar komoditas Indonesia:

* *Kategori Gadget/Laptop:* Tahun ke-1 langsung turun 40%, tahun berikutnya melandai 20% per tahun.
* *Kategori Mobil Baru:* Tahun ke-1 (Efek keluar showroom) turun 20%, tahun berikutnya melandai 10% per tahun.
* *Kategori Mobil Bekas:* Depresiasi cenderung stabil di rentang 8% s.d 10% per tahun sejak tahun pertama.
* **Rumus:** $\text{Nilai Tahun N} = \text{Nilai Tahun (N-1)} \times (1 - \text{Persentase Depresiasi Tahun Tersebut})$

### Output

* Estimasi Nilai Jual Kembali (*Resale Value*) barang dari tahun ke tahun selama masa ekonomis.
* Total kerugian finansial akibat penurunan nilai komoditas.
* Rata-rata nominal "Biaya Kenyamanan" yang dihabiskan pengguna per bulan/tahun.

### Panduan Lapangan (Do's & Don'ts)
>
> 📌 **Do's (Lakukan & Perhatikan):**
>
> * Sadari nominal "Biaya Kenyamanan" bulanan yang keluar dari kalkulator untuk mengukur apakah fungsi kegunaan barang sepadan dengan nilai penyusutannya.
> * Rawat barang dengan baik (rekam medis servis rutin dan pelindung fisik) agar nilai jual kembalinya bisa berada di atas rata-rata estimasi pasar.
>
> ❌ **Don'ts (Hindari & Jangan Dilakukan):**
>
> * Jangan membeli kendaraan baru dengan skema utang konsumtif tenor panjang (> 5 tahun), karena nilai aset menyusut jauh lebih cepat daripada sisa silsilah utang pokok Anda.
> * Jangan menganggap pembelian barang elektronik sebagai bentuk investasi, karena siklus pembaruan teknologi berjalan sangat agresif.

### Skenario Contoh Riil (Default Aplikasi)

* **Input:** Kategori = Mobil Bekas (Membeli mobil seken berkualitas); Harga Beli Seken = Rp180.000.000; Umur Ekonomis = 5 Tahun; Depresiasi = Preset Mobil Bekas (8%/tahun).
* **Output:** Nilai Jual Tahun ke-5 = **Rp118.630.000**; Total Penyusutan nilai = Rp61.370.000; **Rata-rata Biaya Kenyamanan = Rp1.022.000 / bulan**. *(Pilihan finansial yang jauh lebih taktis dibandingkan membeli mobil baru).*
