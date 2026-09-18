"use client";

import { useState, useMemo } from "react";
import type { Dictionary } from "@/lib/dictionaries";

interface ForexDictionaryProps {
  dict: Dictionary;
}

export function ForexDictionary({ dict }: ForexDictionaryProps) {
  // 1. States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});

  const dictionaryData = dict?.forexDictionary;
  const terms = useMemo(() => dictionaryData?.terms || [], [dictionaryData]);

  // Get categories translation
  const categories = useMemo(() => [
    { id: "all", label: dictionaryData?.categoryAll || "All" },
    { id: "basic", label: dictionaryData?.categoryBasic || "Basic" },
    { id: "technical", label: dictionaryData?.categoryTechnical || "Technical" },
    { id: "risk", label: dictionaryData?.categoryRisk || "Risk" },
    { id: "market", label: dictionaryData?.categoryMarket || "Market" }
  ], [dictionaryData]);

  // Generate unique list of letters from first letters of names
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    terms.forEach((term) => {
      const firstChar = term.name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, [terms]);

  // Toggling term expanded example
  const toggleExpand = (id: string) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      // Search matching name, definition, or example
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === "" || 
        term.name.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.example.toLowerCase().includes(query);

      // Category matching
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;

      // Letter prefix matching
      const firstChar = term.name.charAt(0).toUpperCase();
      const matchesLetter = selectedLetter === "" || firstChar === selectedLetter;

      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [terms, searchQuery, selectedCategory, selectedLetter]);

  // Get style configs per category
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "basic":
        return {
          bg: "bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
          border: "border-blue-500/10",
          hover: "hover:border-blue-500/30",
          indicator: "bg-blue-500",
        };
      case "technical":
        return {
          bg: "bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
          border: "border-indigo-500/10",
          hover: "hover:border-indigo-500/30",
          indicator: "bg-indigo-500",
        };
      case "risk":
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
          border: "border-amber-500/10",
          hover: "hover:border-amber-500/30",
          indicator: "bg-amber-500",
        };
      case "market":
        return {
          bg: "bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
          border: "border-rose-500/10",
          hover: "hover:border-rose-500/30",
          indicator: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
          border: "border-zinc-500/10",
          hover: "hover:border-zinc-500/30",
          indicator: "bg-zinc-500",
        };
    }
  };

  return (
    <section className="mx-auto max-w-6xl mt-10 border-t border-card-border/50 pt-10">
      {/* Title Header */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          {dictionaryData.title}
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {dictionaryData.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search and Filters Controls */}
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-card-border bg-card-bg/60 shadow-sm backdrop-blur-md">
          {/* Search bar input */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dictionaryData.searchPlaceholder}
              className="w-full pl-10 pr-9 py-2 rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.04] text-xs text-foreground placeholder-zinc-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5 border-t border-card-border/30 pt-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // Reset letter index when clicking categories to prevent empty subsets
                  setSelectedLetter("");
                }}
                className={`py-1 px-2.5 rounded-md text-[11px] font-semibold transition-all duration-200 cursor-pointer border ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-black/[0.01] hover:bg-black/[0.04] dark:bg-white/[0.01] dark:hover:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 border-card-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Alphabet Letter scroller */}
          <div className="flex flex-wrap items-center gap-1 border-t border-card-border/30 pt-3 overflow-x-auto pb-0.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mr-1.5">Index:</span>
            <button
              type="button"
              onClick={() => setSelectedLetter("")}
              className={`h-6 px-2 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                selectedLetter === ""
                  ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black border-zinc-800 dark:border-zinc-200"
                  : "bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border-transparent"
              }`}
            >
              ALL
            </button>
            {availableLetters.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
                className={`h-6 w-6 flex items-center justify-center rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                  selectedLetter === letter
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-black/[0.01] hover:bg-black/[0.03] dark:bg-white/[0.01] dark:hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border-card-border"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Dictionary Entries Grid */}
        {filteredTerms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTerms.map((term) => {
              const styles = getCategoryStyles(term.category);
              const isExpanded = !!expandedTerms[term.id];

              return (
                <div
                  key={term.id}
                  className={`rounded-xl border ${styles.border} ${styles.hover} bg-card-bg glass-panel shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-in fade-in duration-200 p-3.5 sm:p-4`}
                >
                  <div className="flex flex-col gap-2 flex-1">
                    {/* Badge and Title */}
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-sm font-bold text-foreground tracking-tight sm:text-base flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${styles.indicator}`} />
                        {term.name}
                      </h3>
                      <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full border uppercase ${styles.bg}`}>
                        {term.category === "basic" && dictionaryData.categoryBasic}
                        {term.category === "technical" && dictionaryData.categoryTechnical}
                        {term.category === "risk" && dictionaryData.categoryRisk}
                        {term.category === "market" && dictionaryData.categoryMarket}
                      </span>
                    </div>

                    {/* Definition */}
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {term.definition}
                    </p>

                    {/* Example Toggler Accordion */}
                    {term.example && (
                      <div className="mt-1.5 border-t border-card-border/30 pt-2 flex flex-col">
                        <button
                          type="button"
                          onClick={() => toggleExpand(term.id)}
                          className="flex justify-between items-center text-[11px] font-bold text-primary/95 hover:text-primary transition-colors cursor-pointer group"
                        >
                          <span className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="h-3.5 w-3.5 text-primary"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {dictionaryData.exampleLabel}
                          </span>
                          <svg
                            className={`h-3.5 w-3.5 transform transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-2.5 rounded-lg border border-primary/10 bg-primary/[0.02] dark:bg-primary/[0.03] text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-4 border-l-primary shadow-sm">
                              {term.example}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Result */
          <div className="py-12 text-center border border-dashed border-card-border rounded-2xl bg-black/[0.005] dark:bg-white/[0.005]">
            <svg
              className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {dictionaryData.noResults}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
