import type { Metadata } from "next";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { generatePageSeo } from "@/lib/seo";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";
import { AssetCalculator } from "./_components/asset-calculator";
import { LearningReferences } from "@/app/_components/learning-references";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getCurrentDictionary();

  return generatePageSeo({
    title: dict.sahamKriptoEmas.metaTitle,
    description: dict.sahamKriptoEmas.metaDescription,
    locale,
    pathname: "/saham-kripto-emas",
  });
}

export default async function AssetPage() {
  const { locale, dict } = await getCurrentDictionary();

  return (
    <div className="flex flex-col min-h-screen">
      <Header dict={dict} currentLocale={locale} />
      <main className="flex-1 bg-gradient-to-b from-transparent via-black/[0.01] to-black/[0.02] dark:via-white/[0.01] dark:to-white/[0.02] py-12 px-4 sm:px-6 lg:px-8">
        {/* Hub Portal Quick Access Banner */}
        <div className="mx-auto max-w-6xl mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-violet-500/10 border border-card-border shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {locale === "id"
                    ? "Fitur Baru: Menu Mandiri Tersedia!"
                    : "New Update: Dedicated Menus Available!"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "id"
                  ? "Kini kalkulator Saham, Emas, dan Kripto telah dipisahkan menjadi halaman tersendiri dengan fitur lebih lengkap & mendalam."
                  : "Stock, Gold, and Crypto calculators are now separated into their own dedicated pages with specialized features."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/saham"
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-transform active:scale-98"
              >
                📈 {locale === "id" ? "Menu Saham" : "Stocks Menu"}
              </a>
              <a
                href="/emas"
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-transform active:scale-98"
              >
                🪙 {locale === "id" ? "Menu Emas" : "Gold Menu"}
              </a>
              <a
                href="/kripto"
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition-transform active:scale-98"
              >
                ⚡ {locale === "id" ? "Menu Kripto" : "Crypto Menu"}
              </a>
            </div>
          </div>
        </div>

        <AssetCalculator dict={dict} />
        <div className="mx-auto max-w-6xl mt-8">
          <LearningReferences featureId="saham-kripto-emas" lang={locale} />
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  );
}
