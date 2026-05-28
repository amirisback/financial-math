"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "../dictionaries";
import type { Locale } from "@/i18n/config";
import { useTheme } from "./theme-provider";

interface HeaderProps {
  dict: Dictionary;
  lang: Locale;
}

export function Header({ dict, lang }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Helper to get the path for the other language
  const getLanguageSwitchPath = (targetLocale: Locale) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/");
    // segments[0] is empty because pathname starts with /
    // segments[1] is the current locale
    if (segments[1] === "id" || segments[1] === "en") {
      segments[1] = targetLocale;
      return segments.join("/");
    }
    return `/${targetLocale}${pathname}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-card-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${lang}`}
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
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-indigo-600 transition-all duration-300">
              {dict.common.appName}
            </span>
          </Link>
        </div>

        {/* Navigation & Language switcher */}
        <div className="flex items-center gap-4">
          <Link
            href={`/${lang}`}
            className="hidden sm:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
          >
            {dict.nav.home}
          </Link>

          {/* Dark Mode Toggle Switcher */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-foreground hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? (
              /* Sun Icon */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-amber-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              /* Moon Icon */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-indigo-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </button>

          {/* Language Switcher Buttons */}
          <div className="flex items-center gap-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] p-1 border border-card-border">
            <Link
              href={getLanguageSwitchPath("id")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                lang === "id"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </Link>
            <Link
              href={getLanguageSwitchPath("en")}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                lang === "en"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              title="English"
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
