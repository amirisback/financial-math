"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/i18n/config";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";

interface HeaderProps {
  dict: Dictionary;
  currentLocale: Locale;
}

export function Header({ dict, currentLocale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomepage = pathname === "/" || pathname === "";

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-card-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          {!isHomepage && (
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  router.push("/");
                }
              }}
              className="flex h-9 items-center gap-1 rounded-full border border-card-border bg-black/[0.02] dark:bg-white/[0.04] px-3.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all hover:scale-102 cursor-pointer shadow-sm"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span>{currentLocale === "id" ? "Kembali" : "Back"}</span>
            </button>
          )}
          <Link
            href="/"
            className="group flex items-center gap-2 font-sans text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5.5 w-5.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75V18m-3-3V18m-3-3V18m3-12h.008v.008H12V6zm0 2.25h.008v.008H12V8.25zm0 2.25h.008v.008H12V10.5zm0 2.25h.008v.008H12V12.75zM3 16.25v-2.5h18v2.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.25zM3 7.75A2.25 2.25 0 015.25 5.5h13.5A2.25 2.25 0 0121 7.75v5.75H3V7.75z"
                />
              </svg>
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-indigo-600 transition-all duration-300">
              {dict.common.appName}
            </span>
          </Link>
        </div>

        {/* Navigation, Theme & Language switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden md:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
          >
            {dict.nav.home}
          </Link>
          <Link
            href="/demo-encryption"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 py-1.5 px-3 rounded-full border border-indigo-500/20 transition-all"
          >
            🛡️ {currentLocale === "id" ? "Keamanan ID" : "ID Security"}
          </Link>
          <ThemeSwitcher labels={dict.theme} />
          <LanguageSwitcher currentLocale={currentLocale} />
        </div>
      </div>
    </header>
  );
}
