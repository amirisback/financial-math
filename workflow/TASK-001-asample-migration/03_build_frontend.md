# Frontend Implementation Report: Restrukturisasi Arsitektur & Fitur `.asample`

**Author:** Fiqry (`fiqry_frontend`) — Frontend Web Developer  
**Epic / Task ID:** `TASK-001-asample-migration`  
**Status:** Completed  
**Date:** 2026-09-18  

---

## 1. Arsitektur & Restrukturisasi Folder (`src/`)
Seluruh basis kode Next.js 16 telah dimigrasikan ke dalam direktori `src/` sesuai arsitektur `.asample`:
- `src/app/`: Next.js App Router (Layout, Providers, Page, Sitemap, Robots, Manifest, Service Worker).
- `src/app/_components/`: Komponen antarmuka global (`header.tsx`, `footer.tsx`, `theme-switcher.tsx`, `language-switcher.tsx`, `learning-references.tsx`, `ui/card.tsx`, `ui/button.tsx`).
- `src/app/demo-encryption/`: Modul interaktif demonstrasi Sqids & AES-256-GCM (`page.tsx`, `actions.ts`, `DemoClient.tsx`).
- `src/app/{pricing,tanah,rumah,mobil,motor,menabung,investasi,depresiasi,saham-kripto-emas,forex}/`: 10 modul kalkulator finansial dengan rute bersih tanpa segment `[lang]`.
- `src/dictionaries/`: JSON translations terintegrasi (`id.json`, `en.json`) mencakup semua modul kalkulator + theme + demo.
- `src/i18n/`: Konfigurasi locale (`config.ts`).
- `src/lib/`: Modul utilitas server-only & client (`rate-limiter.ts`, `security-guards.ts`, `crypto.ts`, `obfuscator.ts`, `i18n-server.ts`, `i18n-actions.ts`, `dictionaries.ts`, `seo.ts`).
- `src/proxy.ts`: Middleware proxy dengan bot scanner blocker, probe path filter, dan in-memory sliding window rate limiter.
- `src/lib/__tests__/`: Unit test suite untuk rate limiter, proxy, dan security guard.

---

## 2. Inovasi & Fitur Baru yang Diimplementasikan
1. **Cookie-Based i18n**:
   - Menghapus folder rute bertingkat `app/[lang]/`.
   - Mengambil bahasa pengguna di Server Component menggunakan `getCurrentDictionary()` dan `getCurrentLocale()`.
   - Mengubah bahasa pengguna via Server Action `setLocaleAction()` yang menetapkan cookie `NEXT_LOCALE` selama 1 tahun.
2. **Security Shield & Anti-DDoS**:
   - `rate-limiter.ts`: In-memory sliding window counter dengan pembersihan berkala (5 menit) dan deteksi IP Cloudflare / X-Forwarded-For.
   - `security-guards.ts`: Memblokir otomatis automated tool (sqlmap, nikto, masscan, dirbuster) dan traversal probe.
   - `proxy.ts`: Menegakkan header keamanan dan merespons `403 Forbidden` atau `429 Too Many Requests`.
3. **ID Obfuscation & AES-256-GCM Encryption**:
   - `obfuscator.ts`: Konversi integer ID ke string Sqids URL-safe (panjang min. 6 karakter).
   - `crypto.ts`: Enkripsi simetris terotentikasi 256-bit berbasis Node.js native `crypto`.
4. **Dark Mode & Theming**:
   - Integrasi `next-themes` via `src/app/providers.tsx`.
   - Komponen `ThemeSwitcher` responsif dengan dukungan Light, Dark, dan System.

---

## 3. Preservasi Kalkulator Finansial
Semua 10 kalkulator dipertahankan 100% dan dihubungkan ke rute bersih:
1. `/pricing` — Kalkulator Harga Jual & BEP Bisnis
2. `/tanah` — Kalkulator Pajak Jual Beli Tanah & BPHTB
3. `/rumah` — Simulasi KPR & Pembelian Rumah
4. `/mobil` — Simulasi Kredit & Biaya Kepemilikan Mobil
5. `/motor` — Simulasi Kredit & Biaya Kepemilikan Motor
6. `/menabung` — Perencanaan Tabungan & Alokasi Gaji
7. `/investasi` — Kalkulator Pertumbuhan Investasi Majemuk
8. `/depresiasi` — Kalkulator Penyusutan Nilai Aset
9. `/saham-kripto-emas` — Analisis Portofolio Saham, Kripto & Emas
10. `/forex` — Kalkulator Manajemen Risiko Forex & Kamus Valas
