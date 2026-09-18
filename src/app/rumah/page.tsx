import type { Metadata } from "next";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { generatePageSeo } from "@/lib/seo";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";
import { HouseCalculator } from "./_components/house-calculator";
import { LearningReferences } from "@/app/_components/learning-references";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getCurrentDictionary();

  return generatePageSeo({
    title: dict.rumah.metaTitle,
    description: dict.rumah.metaDescription,
    locale,
    pathname: "/rumah",
  });
}

export default async function HousePage() {
  const { locale, dict } = await getCurrentDictionary();

  return (
    <div className="flex flex-col min-h-screen">
      <Header dict={dict} currentLocale={locale} />
      <main className="flex-1 bg-gradient-to-b from-transparent via-black/[0.01] to-black/[0.02] dark:via-white/[0.01] dark:to-white/[0.02] py-12 px-4 sm:px-6 lg:px-8">
        <HouseCalculator dict={dict} />
        <div className="mx-auto max-w-6xl mt-8">
          <LearningReferences featureId="rumah" lang={locale} />
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  );
}
