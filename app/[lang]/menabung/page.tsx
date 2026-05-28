import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { generatePageSeo } from "@/lib/seo";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";
import { SavingsCalculator } from "./_components/savings-calculator";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return { title: "Savings Calculator" };
  }

  const dict = await getDictionary(lang);

  return generatePageSeo({
    title: dict.menabung.metaTitle,
    description: dict.menabung.metaDescription,
    locale: lang,
    pathname: "/menabung",
  });
}

export default async function SavingsPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col min-h-screen">
      <Header dict={dict} lang={lang} />
      <main className="flex-1 bg-gradient-to-b from-transparent via-black/[0.01] to-black/[0.02] dark:via-white/[0.01] dark:to-white/[0.02] py-12 px-4 sm:px-6 lg:px-8">
        <SavingsCalculator dict={dict} />
      </main>
      <Footer dict={dict} />
    </div>
  );
}
