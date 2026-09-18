import type { Metadata } from "next";
import { getCurrentDictionary } from "@/lib/i18n-server";
import DemoClient from "./DemoClient";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getCurrentDictionary();

  return {
    title: `${dict.demo.title} — ${dict.metadata.title}`,
    description: dict.demo.subtitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EncryptionDemoPage() {
  const { locale, dict } = await getCurrentDictionary();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
      <Header dict={dict} currentLocale={locale} />
      <main className="flex-1 flex flex-col justify-center items-center py-12 px-4">
        <DemoClient
          dict={dict.demo}
          common={dict.common}
        />
      </main>
      <Footer dict={dict} />
    </div>
  );
}
