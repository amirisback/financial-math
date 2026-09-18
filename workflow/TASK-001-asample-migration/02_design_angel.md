# UI/UX Specification: Restrukturisasi Desain & Komponen `.asample`

**Author:** Angel (`angel_uiux`) — UI/UX Designer  
**Epic / Task ID:** `TASK-001-asample-migration`  
**Status:** Approved  
**Date:** 2026-09-18  

---

## 1. Design System & Tokens
Sistem desain memadukan token modern dari `.asample` berbasis Tailwind CSS v4 dengan identitas visual khas `life-calculator` (glassmorphism, subtle glowing cards, dan font Geist).

### Palette & Variabel CSS (`src/app/globals.css`)

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

:root {
  --background: #f8fafc;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --card-bg: rgba(255, 255, 255, 0.75);
  --card-border: rgba(226, 232, 240, 0.85);
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #4f46e5;
  --primary-foreground: #fafafa;
  --primary-hover: #4338ca;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #4f46e5;
  --radius: 0.75rem;
  --glow-color: rgba(99, 102, 241, 0.15);
}

.dark {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #121215;
  --card-foreground: #fafafa;
  --card-bg: rgba(18, 18, 22, 0.7);
  --card-border: rgba(39, 39, 42, 0.8);
  --popover: #09090b;
  --popover-foreground: #fafafa;
  --primary: #6366f1;
  --primary-foreground: #18181b;
  --primary-hover: #4f46e5;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #7f1d1d;
  --destructive-foreground: #fafafa;
  --border: #27272a;
  --input: #27272a;
  --ring: #818cf8;
  --glow-color: rgba(99, 102, 241, 0.28);
}
```

---

## 2. Component Specifications

### 1. ThemeSwitcher (`src/app/_components/theme-switcher.tsx`)
- **Tampilan:** Pill capsule dengan border halus dan background semitransparan.
- **Pilihan:**
  - ☀️ `Light` (`setTheme("light")`)
  - 🌙 `Dark` (`setTheme("dark")`)
  - 💻 `System` (`setTheme("system")`)
- **State Handling:** Menggunakan `useSyncExternalStore` hook untuk mencegah hydration mismatch saat client rendering theme.

### 2. LanguageSwitcher (`src/app/_components/language-switcher.tsx`)
- **Tampilan:** Compact pill selector dengan icon bendera dan kode bahasa:
  - 🇮🇩 `ID` (Bahasa Indonesia — Default)
  - 🇺🇸 `EN` (English US)
- **Interaksi:** Menjalankan Server Action `setLocaleAction(newLocale)` di dalam `startTransition()`, diikuti `router.refresh()` untuk memuat ulang terjemahan secara instan.

### 3. Header (`src/app/_components/header.tsx`)
- **Sticky Glassmorphism Header:** `backdrop-blur-md`, z-index 50.
- **Elemen:**
  - Tombol Back (pada rute selain `/`): Mengarahkan pengguna ke histori browser atau fallback ke `/`.
  - Brand Logo + App Name dengan gradasi indigo-emerald.
  - Quick action bar berisi `ThemeSwitcher` dan `LanguageSwitcher`.

### 4. Demo Encryption Page (`src/app/demo-encryption/`)
- Dua panel card interaktif:
  - **Panel 1: Penyamaran ID (Sqids)** dengan input angka, tombol "Samarkan ID" & "Kembalikan ID", badge output, dan tombol copy.
  - **Panel 2: Enkripsi Kriptografis (AES-256-GCM)** dengan input teks/UUID, tombol "Enkripsi Teks" & "Dekripsi Teks", tag otentikasi, dan status feedback.

---

## 3. Layout & Accessibility
- **Touch Targets:** Minimal 44px x 44px pada interaksi mobile.
- **Contrast Ratio:** Memenuhi WCAG AA (rasio kontras teks minimal 4.5:1 terhadap latar belakang).
- **Dark Mode Support:** Menghilangkan flash lay-out dengan atribut `suppressHydrationWarning` dan integrasi script inline di `next-themes`.
