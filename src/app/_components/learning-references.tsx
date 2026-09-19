import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import Image from "next/image";

export interface LearningReferencesProps {
  featureId:
    | "tanah"
    | "rumah"
    | "mobil"
    | "motor"
    | "saham"
    | "emas"
    | "kripto"
    | "saham-kripto-emas"
    | "menabung"
    | "investasi"
    | "depresiasi"
    | "forex"
    | "pricing";
  lang: "id" | "en";
}

interface ReferenceItem {
  title: string;
  source: string;
  url: string;
  description: string;
  isLocal: boolean;
}

interface FeatureReferences {
  title: string;
  description: string;
  formulaTitle: string;
  formula: string;
  formulaExplanation: string;
  refList: ReferenceItem[];
}

const referencesData: Record<"id" | "en", Record<string, FeatureReferences>> = {
  id: {
    tanah: {
      title: "📚 Dasar Teori & Pajak Jual Beli Tanah",
      description: "Pahami perhitungan BPHTB, PPh, dan administrasi legalitas tanah di Indonesia berdasarkan peraturan resmi pemerintah.",
      formulaTitle: "Rumus Perhitungan Pajak Properti & PPAT",
      formula: "BPHTB = 5% × (Harga Kesepakatan - NPOPTKP)\nPPh Final = 2.5% × Harga Kesepakatan\nBiaya PPAT/Notaris = Maksimal 1% × Harga Kesepakatan (UU Jabatan Notaris)",
      formulaExplanation: "NPOPTKP (Nilai Perolehan Objek Pajak Tidak Kena Pajak) bervariasi per kabupaten/kota (DKI Jakarta saat ini Rp350 Juta untuk rumah pertama, daerah lain umumnya Rp60 Juta). PPh ditanggung penjual, sedangkan BPHTB ditanggung pembeli.",
      refList: [
        {
          title: "Pajak Penghasilan (PPh) Pengalihan Tanah",
          source: "Direktorat Jenderal Pajak (DJP)",
          url: "https://www.pajak.go.id",
          description: "Dasar hukum pengenaan PPh Final sebesar 2.5% atas pengalihan hak atas tanah dan bangunan.",
          isLocal: true,
        },
        {
          title: "Panduan Sertifikasi & Hak atas Tanah",
          source: "Kementerian ATR/BPN",
          url: "https://www.bpn.go.id",
          description: "Alur resmi pendaftaran sertifikat tanah, balik nama (BBN), dan pengecekan keaslian sertifikat.",
          isLocal: true,
        },
        {
          title: "Perpajakan & Bea Perolehan Properti",
          source: "Hukumonline",
          url: "https://www.hukumonline.com",
          description: "Artikel analisis hukum mengenai pembagian biaya notaris dan PPAT dalam pembuatan AJB.",
          isLocal: true,
        },
      ],
    },
    rumah: {
      title: "📚 Teori Amortisasi KPR & Biaya Pemilikan Rumah",
      description: "Pelajari bagaimana bank menghitung suku bunga KPR bulanan dan biaya-biaya asuransi serta legalitas di awal akad pinjaman.",
      formulaTitle: "Rumus Angsuran KPR Bulanan (Anuitas)",
      formula: "PMT = P × [ r(1+r)^n ] / [ (1+r)^n - 1 ]",
      formulaExplanation: "Di mana P = Plafon pinjaman (Harga - DP), r = suku bunga bulanan (suku bunga tahunan / 12), dan n = total bulan cicilan (tenor). Rumus ini memastikan porsi pokok naik dan porsi bunga turun seiring waktu.",
      refList: [
        {
          title: "Panduan Lengkap KPR & Suku Bunga",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Penjelasan resmi mengenai jenis-jenis KPR, kalkulasi bunga fixed/floating, dan cara meminimalkan risiko gagal bayar.",
          isLocal: true,
        },
        {
          title: "Kebijakan LTV (Loan-to-Value) Properti",
          source: "Bank Indonesia",
          url: "https://www.bi.go.id",
          description: "Rasio maksimum plafon kredit dibanding harga properti dan ketentuan batas minimum Uang Muka KPR.",
          isLocal: true,
        },
        {
          title: "Mortgage Amortization Mechanics",
          source: "Investopedia",
          url: "https://www.investopedia.com/terms/a/amortization_schedule.asp",
          description: "Artikel detail yang membedakan bunga anuitas, flat, dan efektif serta dampaknya terhadap jangka panjang.",
          isLocal: false,
        },
      ],
    },
    mobil: {
      title: "📚 Pembiayaan Otomotif & Biaya Kepemilikan (TCO)",
      description: "Pahami bahwa biaya mobil bukan sekadar cicilan, melainkan total akumulasi depresiasi, asuransi, pajak tahunan (PKB), dan BBM.",
      formulaTitle: "Total Cost of Ownership (TCO) Mobil",
      formula: "TCO = Uang Muka + Total Cicilan + Total Biaya Operasional (Pajak + BBM + Servis + Asuransi) - Nilai Resale Value",
      formulaExplanation: "Membeli mobil baru memiliki risiko depresiasi tahun pertama (Shock Drop) sebesar 15-20% karena perpindahan kepemilikan. Gunakan rumus ini untuk membandingkan opsi kredit vs tunai.",
      refList: [
        {
          title: "Memahami Pembiayaan KKB & Leasing",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Panduan aman membeli kendaraan secara kredit, membedakan skema ADDM vs ADDB, dan hak fidusia konsumen.",
          isLocal: true,
        },
        {
          title: "True Cost to Own® (TCO) Methodology",
          source: "Edmunds",
          url: "https://www.edmunds.com/tco.html",
          description: "Metodologi komprehensif pelacak biaya pemeliharaan, depresiasi, dan biaya operasional riil mobil.",
          isLocal: false,
        },
        {
          title: "Pajak Kendaraan Bermotor (PKB) & Tarif BBN",
          source: "Gaikindo",
          url: "https://www.gaikindo.or.id",
          description: "Data industri otomotif Indonesia serta pemetaan pajak progresif kepemilikan kendaraan.",
          isLocal: true,
        },
      ],
    },
    motor: {
      title: "📚 Manajemen Anggaran & Biaya Operasional Motor",
      description: "Gunakan data efisiensi bahan bakar, perawatan CVT/mesin berkala, dan depresiasi motor harian agar pengeluaran transportasi tetap di bawah 15% dari penghasilan.",
      formulaTitle: "Rekomendasi Batas Cicilan Ideal & Anggaran",
      formula: "Maksimum Cicilan Bulanan = 30% × Pendapatan Bersih\nTotal Biaya Transportasi Bulanan = Servis + BBM + Asuransi + Cicilan < 15% Pendapatan",
      formulaExplanation: "Motor merupakan aset dengan tingkat depresiasi yang cepat. Simulasi kenyamanan berkendara bulanan (Comfort Fee) menghitung selisih harga beli awal dengan resale value dibagi tenor.",
      refList: [
        {
          title: "Perencanaan Keuangan untuk Kredit Konsumtif",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Strategi alokasi dana darurat dan tips menjaga kolektibilitas kredit (BI Checking/SLIK) agar tetap bersih.",
          isLocal: true,
        },
        {
          title: "Perawatan Berkala Sepeda Motor & Estimasi Servis",
          source: "Astra Motor",
          url: "https://www.astramotor.co.id",
          description: "Estimasi biaya servis berkala, penggantian oli, dan tips mempertahankan nilai jual kembali motor.",
          isLocal: true,
        },
      ],
    },
    saham: {
      title: "📚 Teori Pasar Modal, Perpajakan & Valuasi Saham",
      description: "Pahami struktur biaya transaksi Bursa Efek Indonesia (IDX), pajak PPh Final 0.1%, formula harga impas (BEP), valuasi Benjamin Graham, dan strategi dividen.",
      formulaTitle: "Rumus BEP Saham & Nilai Wajar Graham",
      formula: "Saham BEP = Total Modal Beli / [ Jumlah Lembar × (1 - Fee Jual% - PPN Fee 11% - PPh Final 0.1%) ]\nGraham Number = √(22.5 × EPS × BVPS)\nMargin of Safety (MoS) = [ (Graham Number - Harga Pasar) / Graham Number ] × 100%",
      formulaExplanation: "1 Lot saham di Indonesia setara 100 lembar. Biaya transaksi mencakup komisi broker, PPN atas fee broker (11%), levy bursa KPEI/KSEI (0.043%), dan PPh Pasal 4 ayat (2) Final atas penjualan saham sebesar 0.1% dari nilai bruto penjualan.",
      refList: [
        {
          title: "Sekolah Pasar Modal (SPM) & Regulasi Saham",
          source: "Bursa Efek Indonesia (IDX)",
          url: "https://www.idx.co.id",
          description: "Panduan resmi investasi saham, keterbukaan laporan keuangan emiten, dan kalender aksi korporasi/dividen.",
          isLocal: true,
        },
        {
          title: "Pajak Penghasilan Final atas Transaksi Penjualan Saham",
          source: "Direktorat Jenderal Pajak (DJP)",
          url: "https://www.pajak.go.id",
          description: "Dasar hukum pengenaan PPh Pasal 4 ayat 2 sebesar 0.1% yang bersifat final atas penjualan saham di bursa efek.",
          isLocal: true,
        },
        {
          title: "The Intelligent Investor & Benjamin Graham Formula",
          source: "Investopedia",
          url: "https://www.investopedia.com/terms/g/graham-number.asp",
          description: "Metodologi penentuan nilai intrinsik saham konservatif menggunakan kelipatan P/E maksimal 15 dan P/BV maksimal 1.5.",
          isLocal: false,
        },
      ],
    },
    emas: {
      title: "📚 Logam Mulia, Selisih Spread & Pajak PPh 22 Emas",
      description: "Pahami mekanisme transaksi emas fisik batangan (Antam/UBS), perbedaan spread harga beli vs harga jual kembali (buyback), dan ketentuan pajak PPh 22.",
      formulaTitle: "Rumus Spread Emas & Ketentuan PPh Pasal 22",
      formula: "Spread Nominal = Harga Beli per Gram - Harga Buyback per Gram\nSpread Persen = (Spread Nominal / Harga Beli per Gram) × 100%\nPPh 22 Pembelian: 0.45% (NPWP) atau 0.90% (Non-NPWP)\nPPh 22 Buyback: 1.5% (NPWP) atau 3.0% (Non-NPWP) jika Nilai Transaksi > Rp 10 Juta",
      formulaExplanation: "Berdasarkan PMK No. 34/PMK.010/2017 jo. UU HPP, pembelian emas batangan dikenakan PPh 22 sebesar 0.45% bagi pemegang NPWP dan 0.9% untuk non-NPWP. Penjualan kembali (buyback) hanya dipotong pajak jika nilai transaksi melampaui Rp 10 Juta.",
      refList: [
        {
          title: "Ketentuan Pajak PPh 22 Emas Batangan Logam Mulia",
          source: "PT Antam Tbk - Unit Bisnis Pengolahan Logam Mulia",
          url: "https://www.logammulia.com",
          description: "Harga acuan harian emas batangan, syarat buyback resmi, dan pemotongan bukti pungut PPh 22.",
          isLocal: true,
        },
        {
          title: "Peraturan Menteri Keuangan PMK 34/2017 tentang PPh 22",
          source: "Kementerian Keuangan RI",
          url: "https://kemenkeu.go.id",
          description: "Regulasi resmi pemungutan pajak penghasilan atas penjualan dan pembelian emas batangan di Indonesia.",
          isLocal: true,
        },
        {
          title: "Gold Bullion Spread & Safe Haven Investing",
          source: "World Gold Council",
          url: "https://www.gold.org",
          description: "Peran emas sebagai instrumen lindung nilai (hedge) terhadap inflasi dan devaluasi mata uang.",
          isLocal: false,
        },
      ],
    },
    kripto: {
      title: "📚 Regulasi Bappebti, Keamanan Wallet & Pajak Kripto PMK 68",
      description: "Pelajari tata kelola perdagangan aset kripto di Indonesia, kepatuhan bursa terdaftar Bappebti (CPFAK), dan penghitungan tarif pajak PMK 68/2022.",
      formulaTitle: "Skema Pajak Transaksi Kripto PMK 68/PMK.03/2022",
      formula: "Bursa Terdaftar Bappebti: PPh Final 0.1% + PPN 0.1% = Total 0.2%\nBursa Luar Negeri / Non-Bappebti: PPh Final 0.2% + PPN 0.2% = Total 0.4%\nModal Beli Bersih = Harga Beli + Exchange Fee + Pajak PMK 68",
      formulaExplanation: "Pajak kripto di Indonesia dipungut langsung oleh platform exchange (Penyelenggara Perdagangan Melalui Sistem Elektronik / PPMSE). Transaksi di bursa berizin Bappebti mendapatkan insentif pajak 50% lebih hemat dibanding bursa luar negeri.",
      refList: [
        {
          title: "Daftar Aset Kripto & Calon Pedagang Terdaftar",
          source: "Bappebti (Badan Pengawas Perdagangan Berjangka Komoditi)",
          url: "https://bappebti.go.id",
          description: "Daftar resmi pedagang fisik aset kripto (CPFAK) dan jenis koin/token yang legal diperdagangkan di Indonesia.",
          isLocal: true,
        },
        {
          title: "Peraturan Menteri Keuangan No. 68/PMK.03/2022",
          source: "Direktorat Jenderal Pajak",
          url: "https://pajak.go.id",
          description: "Ketentuan PPN dan PPh atas transaksi perdagangan aset kripto di wilayah Indonesia.",
          isLocal: true,
        },
        {
          title: "Crypto Security & Self-Custody Best Practices",
          source: "Ethereum Foundation",
          url: "https://ethereum.org",
          description: "Panduan keamanan dompet non-kustodial, cold storage, dan perlindungan private key.",
          isLocal: false,
        },
      ],
    },
    "saham-kripto-emas": {
      title: "📚 Teori Portofolio & Perpajakan Investasi Aset",
      description: "Hitung laba bersih aset trading dengan menyertakan fee broker, pajak saham final (0.1%), PPh/PPN Kripto PMK 68, dan PPh 22 emas fisik.",
      formulaTitle: "Rumus Harga Impas (Break-Even Price) Saham & Rata-rata DCA",
      formula: "Average Price = [ Σ (Jumlah Aset × Harga Beli) ] / Total Aset\nSaham BEP = Harga Beli × (1 + Fee Beli) / (1 - Fee Jual - PPh Final 0.1%)",
      formulaExplanation: "Investasi emas fisik dibebani spread harga beli-buyback yang lebar (rata-rata 10%). Aset kripto terdaftar Bappebti dikenakan PPh 0.1% & PPN 0.1% per transaksi, sementara luar Bappebti 0.2% & 0.2%.",
      refList: [
        {
          title: "Sekolah Pasar Modal & Analisis Saham",
          source: "Bursa Efek Indonesia (IDX)",
          url: "https://www.idx.co.id",
          description: "Materi belajar analisis teknikikal & fundamental saham, hak dividen, dan keterbukaan informasi emiten.",
          isLocal: true,
        },
        {
          title: "Aturan Pajak Kripto (PMK 68/2022)",
          source: "Bappebti",
          url: "https://bappebti.go.id",
          description: "Regulasi pemungutan PPh dan PPN atas transaksi aset kripto di Indonesia.",
          isLocal: true,
        },
        {
          title: "Dollar-Cost Averaging (DCA) Basics",
          source: "Investopedia",
          url: "https://www.investopedia.com/terms/d/dollarcostaveraging.asp",
          description: "Analisis keunggulan DCA dibanding lump-sum untuk meminimalkan dampak volatilitas pasar keuangan.",
          isLocal: false,
        },
        {
          title: "Kalkulasi Pajak PPh 22 Emas Batangan",
          source: "Logam Mulia Antam",
          url: "https://www.logammulia.com",
          description: "Ketentuan pengenaan PPh Pasal 22 untuk pembelian emas batangan dan buyback.",
          isLocal: true,
        },
      ],
    },
    menabung: {
      title: "📚 Teori Perencanaan Anggaran & Dana Darurat",
      description: "Pelajari metode pembagian kas bulanan klasik dan bagaimana pajak bunga bank konvensional mempengaruhi pertumbuhan riil tabungan Anda.",
      formulaTitle: "Metode Budgeting 50/30/20 & Emergency Fund",
      formula: "Alokasi Bulanan = 50% Kebutuhan Pokok + 30% Keinginan + 20% Tabungan/Investasi\nDana Darurat Ideal = 6 × Biaya Pengeluaran Bulanan (12 × jika memiliki anak)",
      formulaExplanation: "Uang tabungan di bank konvensional dengan nominal besar dikenakan Pajak Penghasilan (PPh) atas bunga tabungan sebesar 20% (jika saldo > Rp7,5 Juta) serta biaya admin bulanan tetap.",
      refList: [
        {
          title: "Mengelola Pos Anggaran & Dana Darurat",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Cara memisahkan rekening tabungan, menghitung kebutuhan dana darurat, dan mengamankan likuiditas keluarga.",
          isLocal: true,
        },
        {
          title: "Sinking Funds vs. Savings Accounts",
          source: "Investopedia",
          url: "https://www.investopedia.com",
          description: "Materi belajar strategi pembagian tabungan khusus untuk target jangka pendek (Sinking Fund).",
          isLocal: false,
        },
        {
          title: "Personal Finance & Budgeting Foundations",
          source: "Khan Academy",
          url: "https://www.khanacademy.org",
          description: "Kursus interaktif gratis mengenai konsep dasar pengelolaan keuangan, inflasi, dan nilai uang.",
          isLocal: false,
        },
      ],
    },
    investasi: {
      title: "📚 Matematika Bunga Majemuk & Pertumbuhan Portofolio",
      description: "Keajaiban bunga majemuk (compound interest) bertumpu pada reinvestasi hasil bunga/kupon untuk menghasilkan pertumbuhan eksponensial.",
      formulaTitle: "Formula Bunga Berbunga & Nilai Masa Depan (FV)",
      formula: "FV = P × (1 + r)^n + PMT × [ ((1 + r)^n - 1) / r ]\nRule of 72: Waktu Penggandaan Uang ≈ 72 / Suku Bunga (%)",
      formulaExplanation: "Di mana P = modal awal, PMT = kontribusi bulanan berkala, r = bunga per periode compounding, n = total periode compounding. Penyesuaian inflasi penting untuk mencari return riil net.",
      refList: [
        {
          title: "Compound Interest Basics & Calculator",
          source: "SEC Investor.gov",
          url: "https://www.investor.gov",
          description: "Materi edukasi resmi Komisi Sekuritas AS mengenai kekuatan penggandaan dana (compounding) jangka panjang.",
          isLocal: false,
        },
        {
          title: "Panduan Investasi SBN, Obligasi & Deposito",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Membandingkan tingkat keamanan Surat Berharga Negara (SBN) dengan jaminan LPS (Lembaga Penjamin Simpanan) pada deposito.",
          isLocal: true,
        },
        {
          title: "Compound Interest & Mathematical Growth",
          source: "Khan Academy",
          url: "https://www.khanacademy.org",
          description: "Pembahasan kurikulum matematika dan fungsi eksponensial dalam konsep suku bunga majemuk.",
          isLocal: false,
        },
      ],
    },
    depresiasi: {
      title: "📚 Akuntansi & Teori Penyusutan Aset Tetap",
      description: "Pahami bagaimana nilai barang menyusut seiring waktu dan bagaimana mencatatnya secara akuntansi bisnis maupun perpajakan.",
      formulaTitle: "Metode Penyusutan Garis Lurus & Saldo Menurun",
      formula: "Garis Lurus = (Harga Beli - Nilai Sisa) / Masa Manfaat\nSaldo Menurun Ganda = 2 × (1 / Masa Manfaat) × Nilai Buku Awal Tahun",
      formulaExplanation: "Dalam akuntansi komersial, penyusutan mencerminkan alokasi biaya penggunaan. Dalam perpajakan Indonesia, penyusutan diatur ketat berdasarkan Kelompok Harta Berwujud (UU PPh Pasal 11).",
      refList: [
        {
          title: "Penyusutan Fiskal Aset Tetap Perusahaan",
          source: "Direktorat Jenderal Pajak (DJP)",
          url: "https://www.pajak.go.id",
          description: "Klasifikasi masa manfaat kelompok aset berwujud dan tarif penyusutan resmi untuk pelaporan SPT Badan.",
          isLocal: true,
        },
        {
          title: "Complete Guide to Depreciation Methods",
          source: "Corporate Finance Institute (CFI)",
          url: "https://corporatefinanceinstitute.com",
          description: "Tutorial lengkap mengenai implementasi Straight-Line, Declining Balance, dan Sum-of-the-Years'-Digits.",
          isLocal: false,
        },
      ],
    },
    forex: {
      title: "📚 Manajemen Risiko Trading & Kalkulasi Lot Aman",
      description: "Penyebab kegagalan 90% trader forex pemula adalah ketiadaan money management. Kuasai position sizing agar kerugian terkontrol.",
      formulaTitle: "Rumus Ukuran Posisi (Position Sizing Lot) & Margin",
      formula: "Lot = Resiko Akun ($) / [ Stop Loss (Pips) × Nilai Pip per Lot Standard ($) ]\nMargin = Nilai Kontrak ($) / Leverage",
      formulaExplanation: "Membatiskan risiko per trade maksimal 1% - 2% dari total modal menjamin akun Anda bertahan dari kerugian beruntun. Hindari over-leveraging yang memicu penutupan paksa (Stop Out).",
      refList: [
        {
          title: "School of Pipsology - Comprehensive Forex Course",
          source: "BabyPips",
          url: "https://www.babypips.com/learn",
          description: "Kurikulum trading forex gratis nomor satu di dunia. Sangat detail membahas pips, leverage, margin, dan psikologi trading.",
          isLocal: false,
        },
        {
          title: "Position Sizing & Money Management Principles",
          source: "Investopedia",
          url: "https://www.investopedia.com",
          description: "Pentingnya manajemen ukuran posisi, penempatan Stop Loss yang logis, dan rasio R:R minimal 1:2.",
          isLocal: false,
        },
        {
          title: "Perdagangan Berjangka Komoditi & Valas",
          source: "Bappebti",
          url: "https://bappebti.go.id",
          description: "Pengawasan dan perlindungan nasabah dalam industri perdagangan valuta asing terdaftar di Indonesia.",
          isLocal: true,
        },
      ],
    },
    pricing: {
      title: "📚 Teori Penetapan Harga Jual & Break-Even Point (BEP)",
      description: "Pahami bagaimana menentukan harga jual produk agar tidak sekadar menutupi modal produksi, tetapi juga menutupi overhead tetap usaha.",
      formulaTitle: "Rumus Margin Keuntungan & Titik Impas (BEP)",
      formula: "Harga Jual Rekomendasi = (HPP + Biaya Tetap per Unit) × (1 + Margin Keuntungan %)\nBEP Unit = Biaya Operasional Bulanan / (Harga Jual - HPP per Unit)",
      formulaExplanation: "Pajak bisnis seperti PPh Final UMKM 0.5% (dari peredaran bruto) atau PPN 11% (dari harga jual) wajib diintegrasikan sejak awal kalkulasi produk agar tidak menggerus keuntungan bersih.",
      refList: [
        {
          title: "Aturan Pajak UMKM & Tarif PPh Final",
          source: "Direktorat Jenderal Pajak (DJP)",
          url: "https://www.pajak.go.id",
          description: "Penjelasan PP 55 Tahun 2022 tentang insentif bebas pajak peredaran bruto hingga Rp500 Juta bagi UMKM perorangan.",
          isLocal: true,
        },
        {
          title: "Cost-Volume-Profit (CVP) Analysis & BEP",
          source: "Investopedia",
          url: "https://www.investopedia.com",
          description: "Memahami hubungan antara harga jual, volume penjualan, biaya variabel, dan biaya tetap untuk profitabilitas.",
          isLocal: false,
        },
      ],
    },
  },
  en: {
    tanah: {
      title: "📚 Theory & Taxes of Land Transaction",
      description: "Understand the calculation of local transaction taxes (BPHTB, PPh) and legal notary administration fees in Indonesia based on official rules.",
      formulaTitle: "Property Taxes & Notary/PPAT Formulas",
      formula: "BPHTB = 5% × (Deal Price - NPOPTKP)\nFinal PPh = 2.5% × Deal Price\nNotary/PPAT Fee = Max 1% × Deal Price (Notary Law regulation)",
      formulaExplanation: "NPOPTKP (tax-free threshold) varies by region (Jakarta is currently IDR 350 Million for first-home acquisition, other regions are usually IDR 60 Million). PPh is borne by the seller, BPHTB by the buyer.",
      refList: [
        {
          title: "Income Tax on Land Transfer (PPh Final)",
          source: "Indonesian Tax Authority (DJP)",
          url: "https://www.pajak.go.id",
          description: "Official legal base for 2.5% flat final income tax on land and building rights transfer.",
          isLocal: true,
        },
        {
          title: "Land Title & Certification Guidelines",
          source: "Ministry of ATR/BPN",
          url: "https://www.bpn.go.id",
          description: "Official procedures for land title registration, certification, and verification.",
          isLocal: true,
        },
        {
          title: "Legal Cost Division in Land Transactions",
          source: "Hukumonline",
          url: "https://www.hukumonline.com",
          description: "Legal analysis regarding Notary and PPAT service fee distribution.",
          isLocal: true,
        },
      ],
    },
    rumah: {
      title: "📚 Mortgage Amortization & Home Ownership Costs",
      description: "Learn how banks compute monthly mortgage payments and upfront costs like insurance and notary fees.",
      formulaTitle: "Monthly Mortgage Payment (Annuity Formula)",
      formula: "PMT = P × [ r(1+r)^n ] / [ (1+r)^n - 1 ]",
      formulaExplanation: "Where P = Plafon/Principal loan (Price - DP), r = monthly interest rate (annual rate / 12), and n = total installments in months (tenor). This ensures your principal portion rises and interest drops over time.",
      refList: [
        {
          title: "Complete Mortgage Guide & Suku Bunga",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Official OJK explanation regarding mortgage types, fixed vs floating calculations, and credit safety tips.",
          isLocal: true,
        },
        {
          title: "Loan-to-Value (LTV) Policy for Properties",
          source: "Bank Indonesia",
          url: "https://www.bi.go.id",
          description: "Official limits on mortgage loan size relative to property value and minimum down payment requirements.",
          isLocal: true,
        },
        {
          title: "Mortgage Amortization Mechanics",
          source: "Investopedia",
          url: "https://www.investopedia.com/terms/a/amortization_schedule.asp",
          description: "Detailed explanation of amortizing loans, effective vs flat interest rates, and loan dynamics.",
          isLocal: false,
        },
      ],
    },
    mobil: {
      title: "📚 Auto Loans & Total Cost of Ownership (TCO)",
      description: "Realize that vehicle expense is not just the monthly loan payment, but the cumulative sum of depreciation, insurance, annual tax, and fuel.",
      formulaTitle: "Vehicle Total Cost of Ownership (TCO)",
      formula: "TCO = Down Payment + Total Installments + Total Running Costs (Tax + Fuel + Service + Insurance) - Resale Value",
      formulaExplanation: "New cars face a steep 15-20% drop in value (Shock Drop) in the first year due to changing ownership status. Use this formula to compare credit vs cash.",
      refList: [
        {
          title: "Auto Loan (KKB) & Leasing Principles",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Guide on auto financing, understanding ADDM vs ADDB credit schemes, and fiduciary consumer rights.",
          isLocal: true,
        },
        {
          title: "True Cost to Own® (TCO) Methodology",
          source: "Edmunds",
          url: "https://www.edmunds.com/tco.html",
          description: "Comprehensive tracking of real ownership costs including depreciation, insurance, and maintenance.",
          isLocal: false,
        },
        {
          title: "Vehicle Tax (PKB) & Industry Updates",
          source: "Gaikindo",
          url: "https://www.gaikindo.or.id",
          description: "Indonesian automotive industry data and vehicle progressive taxation maps.",
          isLocal: true,
        },
      ],
    },
    motor: {
      title: "📚 Budget Management & Motorcycle Operating Costs",
      description: "Utilize fuel efficiency, regular CVT/engine servicing, and daily motorcycle depreciation data to keep transportation costs below 15% of your income.",
      formulaTitle: "Ideal Installment Limits & Budget Allocations",
      formula: "Max Monthly Installment = 30% × Net Income\nTotal Monthly Transport Cost = Service + Fuel + Insurance + Loan < 15% Income",
      formulaExplanation: "Motorcycles are highly depreciating assets. Monthly comfort fee calculates the initial price minus the resale value divided by the tenor.",
      refList: [
        {
          title: "Financial Planning for Consumptive Credits",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Emergency fund allocation strategies and maintaining clean credit scores (SLIK/BI Checking).",
          isLocal: true,
        },
        {
          title: "Motorcycle Servicing & Resale Value Optimization",
          source: "Astra Motor",
          url: "https://www.astramotor.co.id",
          description: "Routine servicing costs, oil guidelines, and practical tips to preserve motorcycle resale value.",
          isLocal: true,
        },
      ],
    },
    saham: {
      title: "📚 Capital Markets, IDX Taxation & Stock Valuation",
      description: "Understand the transaction fee structure on the Indonesia Stock Exchange (IDX), 0.1% final selling tax, break-even pricing (BEP), Benjamin Graham valuation, and dividend strategies.",
      formulaTitle: "Stock BEP & Benjamin Graham Fair Value Formula",
      formula: "Stock BEP = Total Buy Outlay / [ Total Shares × (1 - Sell Fee% - VAT Fee 11% - Final Tax 0.1%) ]\nGraham Number = √(22.5 × EPS × BVPS)\nMargin of Safety (MoS) = [ (Graham Number - Market Price) / Graham Number ] × 100%",
      formulaExplanation: "1 Lot in Indonesia equals 100 shares. Total transaction expenses include broker commission, 11% VAT on the commission, KPEI/KSEI exchange levies (0.043%), and 0.1% final withholding tax on gross selling turnover.",
      refList: [
        {
          title: "Indonesia Stock Exchange Education & Rules",
          source: "Indonesia Stock Exchange (IDX)",
          url: "https://www.idx.co.id",
          description: "Official guide to stock investing, quarterly corporate disclosures, and corporate actions calendar.",
          isLocal: true,
        },
        {
          title: "Final Income Withholding Tax on Stock Sales",
          source: "Direktorat Jenderal Pajak (DJP)",
          url: "https://www.pajak.go.id",
          description: "Legal basis for the 0.1% final Article 4(2) income tax on stock sales executed on the exchange.",
          isLocal: true,
        },
        {
          title: "Benjamin Graham Number & Valuation Mechanics",
          source: "Investopedia",
          url: "https://www.investopedia.com/terms/g/graham-number.asp",
          description: "Conservative intrinsic valuation formula based on a maximum P/E of 15 and maximum P/BV of 1.5.",
          isLocal: false,
        },
      ],
    },
    emas: {
      title: "📚 Physical Gold Bullion, Spread Dynamics & PPh 22 Tax",
      description: "Learn how physical gold transactions work (Antam/UBS), evaluate buy vs buyback spread percentages, and understand PPh 22 tax exemptions and thresholds.",
      formulaTitle: "Gold Bullion Spread & PPh Article 22 Formula",
      formula: "Nominal Spread = Buy Price per Gram - Buyback Price per Gram\nSpread Percentage = (Nominal Spread / Buy Price per Gram) × 100%\nPPh 22 Purchase: 0.45% (NPWP) or 0.90% (Non-NPWP)\nPPh 22 Buyback: 1.5% (NPWP) or 3.0% (Non-NPWP) for Transactions > IDR 10 Million",
      formulaExplanation: "Under PMK 34/2017 and the HPP Law, purchasing physical gold incurs 0.45% PPh 22 for active NPWP holders and 0.9% without NPWP. Selling back (buyback) only incurs tax if the transaction amount exceeds IDR 10 Million.",
      refList: [
        {
          title: "Logam Mulia Official Benchmark Pricing & Taxes",
          source: "PT Antam Tbk",
          url: "https://www.logammulia.com",
          description: "Official daily benchmark prices, buyback terms, and tax withholding tax receipts.",
          isLocal: true,
        },
        {
          title: "Ministry of Finance Regulation PMK 34/2017",
          source: "Ministry of Finance RI",
          url: "https://kemenkeu.go.id",
          description: "Official statutory rules on Article 22 income tax collection for gold bullion trades in Indonesia.",
          isLocal: true,
        },
        {
          title: "Gold Demand Trends & Inflation Hedge Mechanics",
          source: "World Gold Council",
          url: "https://www.gold.org",
          description: "Global analysis on gold as a portfolio diversifier and inflation hedge.",
          isLocal: false,
        },
      ],
    },
    kripto: {
      title: "📚 Bappebti Framework, Wallet Security & PMK 68 Tax",
      description: "Examine Indonesian crypto asset governance, tax incentives for Bappebti-registered local exchanges (CPFAK), and self-custody principles.",
      formulaTitle: "Indonesian Crypto Tax Scheme (PMK 68/PMK.03/2022)",
      formula: "Bappebti Registered Exchange: 0.1% Final PPh + 0.1% VAT = 0.2% Total\nUnregistered / Foreign Exchange: 0.2% Final PPh + 0.2% VAT = 0.4% Total\nNet Buy Capital = Coin Price + Exchange Fee + PMK 68 Tax",
      formulaExplanation: "Crypto taxes in Indonesia are withheld directly by exchange platforms. Trading on Bappebti-licensed exchanges offers a 50% tax discount compared to foreign off-shore platforms.",
      refList: [
        {
          title: "Registered Crypto Asset Exchanges (CPFAK)",
          source: "Bappebti",
          url: "https://bappebti.go.id",
          description: "Official registry of licensed prospective physical crypto asset traders in Indonesia.",
          isLocal: true,
        },
        {
          title: "Crypto Tax Regulation PMK 68/PMK.03/2022",
          source: "Direktorat Jenderal Pajak",
          url: "https://pajak.go.id",
          description: "Tax statutory guidelines on income tax (PPh) and VAT on crypto trades.",
          isLocal: true,
        },
        {
          title: "Hardware Wallet Security & Private Key Storage",
          source: "Ethereum Foundation",
          url: "https://ethereum.org",
          description: "Best practices for cold storage, seed phrase preservation, and smart contract safety.",
          isLocal: false,
        },
      ],
    },
    "saham-kripto-emas": {
      title: "📚 Portfolio Theory & Asset Transaction Taxes",
      description: "Compute the real net profits of your trading assets after subtracting commission fees, final stock tax (0.1%), PMK 68 Crypto PPh/PPN, and PPh 22 physical gold tax.",
      formulaTitle: "Stock Break-Even Price & DCA Average Formula",
      formula: "Average Price = [ Σ (Asset Quantity × Purchase Price) ] / Total Assets\nStock BEP = Purchase Price × (1 + Buy Fee) / (1 - Sell Fee - Final Tax 0.1%)",
      formulaExplanation: "Physical gold transactions carry a wide buy-buyback spread (around 10%). Crypto transactions on Bappebti exchange bear 0.1% PPh & 0.1% PPN, while non-Bappebti bear 0.2% & 0.2%.",
      refList: [
        {
          title: "Stock Market Capital & Fundamental Analysis",
          source: "Indonesia Stock Exchange (IDX)",
          url: "https://www.idx.co.id",
          description: "Materials for technical and fundamental analysis, dividend rights, and disclosure filings.",
          isLocal: true,
        },
        {
          title: "Indonesian Crypto Tax Regulations (PMK 68)",
          source: "Bappebti",
          url: "https://bappebti.go.id",
          description: "Official legal base for income tax (PPh) and PPN on crypto assets.",
          isLocal: true,
        },
        {
          title: "Dollar-Cost Averaging (DCA) Basics",
          source: "Investopedia",
          url: "https://www.investopedia.com/terms/d/dollarcostaveraging.asp",
          description: "DCA advantages compared to lump-sum for minimizing financial market volatility impact.",
          isLocal: false,
        },
        {
          title: "PPh 22 Taxation on Gold Bullion",
          source: "Logam Mulia Antam",
          url: "https://www.logammulia.com",
          description: "Income tax Article 22 provisions on purchasing and selling gold bars in Indonesia.",
          isLocal: true,
        },
      ],
    },
    menabung: {
      title: "📚 Budgeting & Emergency Fund Theory",
      description: "Learn classic cash budgeting systems and understand how conventional bank interest taxes affect real savings growth.",
      formulaTitle: "50/30/20 Budgeting Rule & Ideal Emergency Fund",
      formula: "Monthly Allocation = 50% Needs + 30% Wants + 20% Savings/Investments\nIdeal Emergency Fund = 6 × Monthly Expenses (12 × if you have dependents)",
      formulaExplanation: "Bank savings interest in Indonesian conventional banks exceeding IDR 7.5 Million is subject to 20% Income Tax (PPh) on the interest yield alongside fixed admin fees.",
      refList: [
        {
          title: "Budgeting Allocations & Cash Liquidity",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Separating bank accounts, building emergency savings, and securing domestic finances.",
          isLocal: true,
        },
        {
          title: "Sinking Funds vs. Savings Accounts",
          source: "Investopedia",
          url: "https://www.investopedia.com",
          description: "Tactics for allocating short-term targeted savings (Sinking Funds) vs emergency reserves.",
          isLocal: false,
        },
        {
          title: "Personal Finance & Budgeting Foundations",
          source: "Khan Academy",
          url: "https://www.khanacademy.org",
          description: "Comprehensive free video courses on banking foundations, credit cards, and monetary values.",
          isLocal: false,
        },
      ],
    },
    investasi: {
      title: "📚 Compound Interest Math & Portfolio Growth",
      description: "The miracle of compound interest lies in the reinvestment of interest yields to drive exponential financial growth over time.",
      formulaTitle: "Compound Interest & Future Value (FV) Formula",
      formula: "FV = P × (1 + r)^n + PMT × [ ((1 + r)^n - 1) / r ]\nRule of 72: Doubling Time ≈ 72 / Annual Interest Rate (%)",
      formulaExplanation: "Where P = initial principal, PMT = monthly contributions, r = compounding interest per period, and n = total compounding periods. Inflation adjustments find real returns.",
      refList: [
        {
          title: "Compound Interest Basics & Calculator",
          source: "SEC Investor.gov",
          url: "https://www.investor.gov",
          description: "Official US government guide explaining compounding interest mechanisms and calculators.",
          isLocal: false,
        },
        {
          title: "Indonesian Sovereign Bonds (SBN) & Deposits",
          source: "OJK - Sikapi Uangmu",
          url: "https://sikapiuangmu.ojk.go.id",
          description: "Comparing security and risk levels between state-backed SBNs and bank deposit guarantees under LPS.",
          isLocal: true,
        },
        {
          title: "Compound Interest & Mathematical Growth",
          source: "Khan Academy",
          url: "https://www.khanacademy.org",
          description: "Free algebra curriculum discussing exponential functions and banking interest applications.",
          isLocal: false,
        },
      ],
    },
    depresiasi: {
      title: "📚 Accounting Depreciation & Asset Devaluation",
      description: "Understand how tangible assets lose economic value over time and how they are accounted for under commercial and fiscal rules.",
      formulaTitle: "Straight-Line vs Double-Declining Methods",
      formula: "Straight Line = (Purchase Price - Salvage Value) / Useful Life\nDouble Declining = 2 × (1 / Useful Life) × Beginning Book Value",
      formulaExplanation: "Commercial depreciation measures cost allocations. Under Indonesian tax law, fiscal depreciation is regulated under PPh Law Article 11 based on asset classes (4, 8, 16, and 20 years).",
      refList: [
        {
          title: "Fiscal Asset Depreciation Rules in Indonesia",
          source: "Indonesian Tax Authority (DJP)",
          url: "https://www.pajak.go.id",
          description: "Asset groups, useful lifespans, and official tax depreciation rates for annual tax filings.",
          isLocal: true,
        },
        {
          title: "Complete Guide to Depreciation Methods",
          source: "Corporate Finance Institute (CFI)",
          url: "https://corporatefinanceinstitute.com",
          description: "Professional accounting tutorial covering SLN, Declining Balance, and Sum-of-Years'-Digits.",
          isLocal: false,
        },
      ],
    },
    forex: {
      title: "📚 Trading Risk Management & Lot Size Calculation",
      description: "The primary reason 90% of beginner traders fail is lack of money management. Master position sizing to stay in control.",
      formulaTitle: "Position Sizing & Required Margin Formulas",
      formula: "Lot = Account Risk ($) / [ Stop Loss (Pips) × Pip Value per Std Lot ($) ]\nMargin = Notional Value ($) / Leverage",
      formulaExplanation: "Restricting risk per trade to 1% - 2% of equity guarantees that your account survives losing streaks. Avoid over-leveraging which triggers Stop Outs.",
      refList: [
        {
          title: "School of Pipsology - Comprehensive Forex Course",
          source: "BabyPips",
          url: "https://www.babypips.com/learn",
          description: "The absolute number-one free forex education site in the world. Covers pips, margin, leverage, and psychology.",
          isLocal: false,
        },
        {
          title: "Position Sizing & Money Management Principles",
          source: "Investopedia",
          url: "https://www.investopedia.com",
          description: "Essential rules for risk control, setting logical stop-loss orders, and maintaining R:R ratios above 1:2.",
          isLocal: false,
        },
        {
          title: "Indonesian Commodity Futures & Forex Regulations",
          source: "Bappebti",
          url: "https://bappebti.go.id",
          description: "State regulations and customer protection guidelines for licensed commodity and currency brokers.",
          isLocal: true,
        },
      ],
    },
    pricing: {
      title: "📚 Pricing Strategies & Break-Even Point (BEP)",
      description: "Learn how to compute your product's selling price to ensure you cover both variables (COGS) and fixed monthly operational overheads.",
      formulaTitle: "Profit Margins & Break-Even Analysis Formulas",
      formula: "Recommended Selling Price = (COGS + Fixed Cost per Unit) × (1 + Margin %)\nBEP Units = Fixed Monthly Opex / (Price - COGS per Unit)",
      formulaExplanation: "Integrating business taxes like PPh Final 0.5% (gross revenue tax) or 11% PPN (sales tax) into your product math from day one is critical to protect net profits.",
      refList: [
        {
          title: "Indonesian Small Business Final PPh Final Rules",
          source: "Indonesian Tax Authority (DJP)",
          url: "https://www.pajak.go.id",
          description: "Government Regulation PP 55/2022 providing tax exemption thresholds for micro-enterprises.",
          isLocal: true,
        },
        {
          title: "Cost-Volume-Profit (CVP) Analysis & BEP",
          source: "Investopedia",
          url: "https://www.investopedia.com",
          description: "Detailed mechanics of CVP, variable costs, fixed costs, and breakeven planning.",
          isLocal: false,
        },
      ],
    },
  },
};

export function LearningReferences({ featureId, lang }: LearningReferencesProps) {
  const currentLang = lang === "en" ? "en" : "id";
  const data = referencesData[currentLang]?.[featureId];

  if (!data) return null;

  return (
    <Card className="border border-card-border bg-card-bg/60 shadow-lg backdrop-blur-md mt-8 overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Premium Flat Illustration */}
        <div className="lg:col-span-4 flex items-center justify-center p-6 bg-zinc-50/40 dark:bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-card-border/40">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-full lg:h-64 flex items-center justify-center group">
            <Image
              src={`/illustrations/${featureId}.png`}
              alt={data.title}
              width={256}
              height={256}
              className="object-contain drop-shadow-xl group-hover:scale-105 group-hover:rotate-1 transition-all duration-500"
              priority
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <CardHeader className="border-b border-card-border/40 pb-4">
            <CardTitle className="text-lg sm:text-xl font-extrabold flex items-center gap-2.5 text-zinc-900 dark:text-white">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </span>
              {data.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {data.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 pt-5 pb-6">
            {/* Formula Section */}
            <div className="flex flex-col gap-2.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-card-border/40 p-4.5">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                {data.formulaTitle}
              </h4>
              <div className="relative overflow-x-auto rounded-xl bg-zinc-50 dark:bg-black/60 p-4 text-xs font-mono text-emerald-700 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                <pre className="whitespace-pre-wrap leading-relaxed">{data.formula}</pre>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                {data.formulaExplanation}
              </p>
            </div>

            {/* References Links Section */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {currentLang === "en" ? "📘 Trusted Educational Sources & Articles" : "📘 Sumber Belajar & Artikel Terpercaya"}
              </h4>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {data.refList.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between p-4.5 rounded-2xl border border-card-border/50 bg-black/[0.01] hover:bg-indigo-500/[0.02] dark:bg-white/[0.01] dark:hover:bg-indigo-500/[0.02] hover:border-indigo-500/20 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Source Tag Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border ${
                            ref.isLocal
                              ? "bg-red-500/5 text-red-600 border-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                              : "bg-indigo-500/5 text-indigo-600 border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                          }`}
                        >
                          {ref.isLocal ? (currentLang === "en" ? "ID Tax / Law" : "Regulasi RI") : "Global"}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors">
                          {ref.source}
                        </span>
                      </div>

                      {/* Ref Title */}
                      <h5 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {ref.title}
                      </h5>

                      {/* Ref Description */}
                      <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                        {ref.description}
                      </p>
                    </div>

                    {/* External Link Indicator */}
                    <div className="mt-4.5 flex items-center justify-end text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>{currentLang === "en" ? "Read Article" : "Baca Artikel"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
