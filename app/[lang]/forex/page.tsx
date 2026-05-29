import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { generatePageSeo } from "@/lib/seo";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";
import { ForexCalculator } from "./_components/forex-calculator";
import { ForexDictionary } from "./_components/forex-dictionary";
import { LearningReferences } from "../_components/learning-references";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return { title: "Low-Risk Forex Trading Calculator" };
  }

  const dict = await getDictionary(lang);

  return generatePageSeo({
    title: dict.forex.metaTitle,
    description: dict.forex.metaDescription,
    locale: lang,
    pathname: "/forex",
  });
}

export default async function ForexPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <Header dict={dict} lang={lang} />
      <main className="flex-1 bg-gradient-to-b from-transparent via-black/[0.01] to-black/[0.02] dark:via-white/[0.01] dark:to-white/[0.02] py-12 px-4 sm:px-6 lg:px-8">
        <ForexCalculator dict={dict} />
        <div className="mx-auto max-w-6xl mt-8">
          <LearningReferences featureId="forex" lang={lang as any} />
        </div>
        <ForexDictionary dict={dict} />
      </main>
      <Footer dict={dict} />
    </div>
  );
}
