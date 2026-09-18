# PRD & Scoping: Restrukturisasi Arsitektur & Implementasi Fitur dari `.asample`

**Author:** Faisal (`faisal_pm`) — Product Manager & Business Analyst  
**Epic / Task ID:** `TASK-001-asample-migration`  
**Status:** Approved  
**Date:** 2026-09-18  

---

## 1. Product Overview
Life Calculator (`life-calculator`) adalah aplikasi web berbasis Next.js yang menyediakan 10 modul kalkulator finansial dan bisnis terintegrasi dengan regulasi Indonesia. Untuk meningkatkan maintainability, performa, keamanan dari serangan bot/DDoS, serta pengalaman pengguna yang mulus (Dark Mode, URL bersih, i18n cookie-based), proyek ini dimigrasikan mengikuti standar arsitektur pada repositori template `.asample`.

### User Stories
- **Sebagai Pengguna**, saya ingin mengakses kalkulator finansial melalui URL yang bersih (contoh: `/rumah`, `/mobil`, `/pricing`) tanpa prefix `/id/` atau `/en/`, dengan preferensi bahasa yang tetap tersimpan.
- **Sebagai Pengguna**, saya ingin beralih antara tema Terang (Light), Gelap (Dark), atau Sistem dengan transisi mulus tanpa kedip (hydration flash).
- **Sebagai Administrator/Developer**, saya ingin aplikasi terlindungi dari bot berbahaya, path scanner probe (`/.env`, `wp-admin`, path traversal), dan lonjakan request berlebihan (rate limiting).
- **Sebagai Administrator/Developer**, saya ingin ID sensitif dan payload dapat disamarkan dengan Sqids serta dienkripsi dengan AES-256-GCM secara aman di sisi server.
- **Sebagai Pengguna**, saya ingin 10 modul kalkulator finansial yang sudah ada tetap berfungsi 100% tanpa adanya regresi fitur atau kerusakan tampilan.

---

## 2. Acceptance Criteria (AC)

- [x] **AC-01: Migrasi Direktori `src/` & Path Alias**
  Semua kode aplikasi dipindahkan ke `src/` (`src/app/`, `src/dictionaries/`, `src/i18n/`, `src/lib/`, `src/proxy.ts`). Path alias `@/*` di `tsconfig.json` diarahkan ke `./src/*`.
- [x] **AC-02: Arsitektur i18n Berbasis Cookie & Clean URLs**
  URL tidak lagi menggunakan route parameter `[lang]`. Preferensi bahasa disimpan dalam cookie `NEXT_LOCALE` (default: `id`) dan dikelola via Server Action `setLocaleAction()`.
- [x] **AC-03: Security Shield, Bot Guard & In-Memory Rate Limiter**
  `src/proxy.ts` terintegrasi dengan `security-guards.ts` dan `rate-limiter.ts` (sliding window in-memory store) untuk memblokir probe berbahaya (403) dan request melebihi batas tier (429).
- [x] **AC-04: ID Obfuscation (Sqids) & Enkripsi Kriptografis (AES-256-GCM)**
  Tersedia helper `obfuscateId`/`deobfuscateId` (`src/lib/obfuscator.ts`) dan `encrypt`/`decrypt` (`src/lib/crypto.ts`), serta halaman demo interaktif di `/demo-encryption`.
- [x] **AC-05: Integrasi `next-themes` & UI Switchers**
  `src/app/providers.tsx` membungkus aplikasi dengan `next-themes` ThemeProvider. Komponen `ThemeSwitcher` dan `LanguageSwitcher` tersedia dan terintegrasi di antarmuka.
- [x] **AC-06: Preservasi Penuh 10 Modul Kalkulator Finansial**
  Kesepuluh modul kalkulator (`pricing`, `tanah`, `rumah`, `mobil`, `motor`, `menabung`, `investasi`, `depresiasi`, `saham-kripto-emas`, `forex`) dimigrasikan ke rute bersih di `src/app/` dan berfungsi normal.
- [x] **AC-07: SEO & PWA Enhancement**
  File `src/app/robots.ts` dan `src/app/sitemap.ts` mencakup seluruh rute aplikasi. Serwist PWA dikonfigurasi dengan path `src/app/sw.ts`.
- [x] **AC-08: Automated Test Suite & Quality Gate**
  Vitest dikonfigurasi dengan test rate limiter, proxy, dan CLI. Seluruh pengujian lulus, build produksi sukses tanpa error lint.

---

## 3. Verbatim Cross-Role Alignment Meeting Log

### Cross-Role Alignment Meeting Log

#### 1. Sandra (QA):
- **Question**: *"Bagaimana penanganan rute kalkulator yang sebelumnya mengandalkan dynamic parameter `params: { lang: string }`? Jika kita ubah ke Clean URL (`/rumah`), apakah ada risiko broken link atau kegagalan SSR/i18n?"*
  - **Faisal (PM Decision)**: Seluruh rute kalkulator wajib dimigrasikan ke rute flat langsung di bawah `src/app/` (misal `src/app/rumah/page.tsx`). Pemuatan dictionary dialihkan ke `getCurrentDictionary()` dari `src/lib/i18n-server.ts` di sisi server. Rute lama `[lang]` sepenuhnya digantikan oleh clean URLs.
  - **Fiqry (Frontend)**: Kami akan meng-update seluruh `page.tsx` dari 10 kalkulator untuk menggunakan `const { locale, dict } = await getCurrentDictionary()`. Link internal seperti navigasi ke beranda atau antar kalkulator akan langsung merujuk ke `/` atau nama fitur tanpa prefix bahasa.

#### 2. Bryan (Backend/DevOps):
- **Question**: *"Untuk modul keamanan `crypto.ts` dan `rate-limiter.ts`, apakah ada dependency native atau overhead memori yang perlu diantisipasi di server?"*
  - **Bryan's Assessment**: Modul `crypto.ts` menggunakan native Node.js `crypto` modul (`aes-256-gcm`), bertanda `import "server-only"`, dengan zero runtime npm dependency overhead. Untuk `rate-limiter.ts`, in-memory Map dilengkapi dengan garbage collection berkala setiap 5 menit (`CLEANUP_INTERVAL_MS`), membatasi footprint memori tetap di bawah 15MB.
  - **Faisal (PM Decision)**: Pastikan `ENCRYPTION_KEY` diset 32 byte di env development (`d3v_s3cr3t_k3y_for_aes_256_gcm_32`) dan tambahkan fallback hash SHA-256 agar server tidak crash jika developer belum mengisi key di `.env.local`.

#### 3. Angel (UI/UX):
- **Question**: *"Apakah desain visual, glassmorphism panel, dan token warna khas `life-calculator` tetap dipertahankan saat menggabungkan token Tailwind v4 dari `.asample`?"*
  - **Angel's Explanation**: Kita tidak boleh merusak identitas visual kalkulator finansial (`glass-panel`, `hover-glow`, gradasi emerald/indigo).
  - **Fix**: Satukan `globals.css` dengan mendefinisikan `@variant dark (&:where(.dark, .dark *));`, variabel standard shadcn (`--card`, `--primary`, `--border`) serta custom utility `glass-panel` dan `pulse-glow`.
  - **Angel's Specification**: `ThemeSwitcher` menggunakan toggle pill modern dengan emoji ☀️/🌙/💻, dan `LanguageSwitcher` menggunakan pill bendera 🇮🇩 ID / 🇺🇸 EN.
  - **Angel's Rule**: Theme default adalah `system` dengan fallback `dark` pada browser dengan preferensi gelap, didukung oleh `next-themes`.

#### 4. Fiqry (Frontend Web Developer):
- **Question**: *"Apakah dictionary eksisting `id.json` dan `en.json` (720+ baris) langsung dipindahkan dan digabungkan dengan blok `theme` dan `demo` dari `.asample`?"*
  - **Fiqry's Proposal**: Ya, kita merge dictionary secara lossless. Key kalkulator eksisting dipertahankan 100%, dan ditambahkan namespace `theme` serta `demo`.
  - **Faisal (PM Decision)**: Disetujui. Pastikan kedua file `src/dictionaries/id.json` dan `src/dictionaries/en.json` identik secara struktur schema sehingga tidak ada runtime missing translation key.
  - **Fiqry's Inventory**: 
    1. Konfigurasi (`package.json`, `tsconfig.json`, `next.config.ts`, `.env*`).
    2. Lib core (`rate-limiter.ts`, `security-guards.ts`, `crypto.ts`, `obfuscator.ts`, `i18n-server.ts`, `i18n-actions.ts`, `dictionaries.ts`, `seo.ts`).
    3. Middleware proxy (`proxy.ts`).
    4. Dictionaries (`id.json`, `en.json`).
    5. App layout, providers, globals, robots, sitemap, manifest, sw.
    6. Components (`header`, `footer`, `theme-switcher`, `language-switcher`, `learning-references`, `ui/`).
    7. 10 Kalkulator pages.
    8. Demo page (`demo-encryption`).
