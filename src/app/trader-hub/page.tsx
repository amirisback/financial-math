import type { Metadata } from "next";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { generatePageSeo } from "@/lib/seo";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";
import { TraderHubView } from "./_components/trader-hub-view";
import { LearningReferences } from "@/app/_components/learning-references";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getCurrentDictionary();

  return generatePageSeo({
    title: dict.traderHub.metaTitle,
    description: dict.traderHub.metaDescription,
    locale,
    pathname: "/trader-hub",
  });
}

export default async function TraderHubPage() {
  const { locale, dict } = await getCurrentDictionary();

  return (
    <div className="flex flex-col min-h-screen">
      <Header dict={dict} currentLocale={locale} />
      <main className="flex-1 bg-gradient-to-b from-transparent via-black/[0.01] to-black/[0.02] dark:via-white/[0.01] dark:to-white/[0.02] py-12 px-4 sm:px-6 lg:px-8">
        <TraderHubView dict={dict} />
        <div className="mx-auto max-w-6xl mt-10">
          <LearningReferences featureId="forex" lang={locale} />
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  );
}
