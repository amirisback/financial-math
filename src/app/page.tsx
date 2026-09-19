import Link from "next/link";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { generateWebsiteJsonLd } from "@/lib/seo";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { Card, CardTitle, CardDescription, CardContent } from "./_components/ui/card";

export default async function Home() {
  const { locale, dict } = await getCurrentDictionary();
  const websiteJsonLd = generateWebsiteJsonLd(locale);

  const calculators = [
    {
      id: "pricing",
      href: "/pricing",
      title: dict.pricing.title,
      description: dict.pricing.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-emerald-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007v.008H3.75V4.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3 13.25m-2.25 0a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM5.625 18.125a5.625 5.625 0 100-11.25 5.625 5.625 0 000 11.25zM12 4.5h.008v.008H12V4.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 9h.008v.008H12V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 4.5h.008v.008H12v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 18h.008v.008H12V18zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm6.375-13.5h.008v.008h-.008V4.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 4.5h.008v.008h-.008V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 4.5h.008v.008h-.008v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      ),
      color: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/30",
    },
    {
      id: "tanah",
      href: "/tanah",
      title: dict.tanah.title,
      description: dict.tanah.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-amber-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8m-3-12h.008v.008H12V3.75zm0 16.5h.008v.008H12v-.008zM1.5 19.5h21M2.25 15h19.5A2.25 2.25 0 0024 12.75V5.25A2.25 2.25 0 0021.75 3H2.25A2.25 2.25 0 000 5.25v7.5A2.25 2.25 0 002.25 15z"
          />
        </svg>
      ),
      color: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/30",
    },
    {
      id: "rumah",
      href: "/rumah",
      title: dict.rumah.title,
      description: dict.rumah.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-indigo-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      color: "from-indigo-500/10 to-blue-500/5 hover:border-indigo-500/30",
    },
    {
      id: "mobil",
      href: "/mobil",
      title: dict.mobil.title,
      description: dict.mobil.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V14.25M3 14.25h18M3 14.25l1.44-4.8c.217-.722.88-1.2 1.632-1.2h11.856c.751 0 1.415.478 1.632 1.2l1.44 4.8M5.25 9.75V4.5a2.25 2.25 0 0 1 2.25-2.25h9a2.25 2.25 0 0 1 2.25 2.25v5.25"
          />
        </svg>
      ),
      color: "from-blue-500/10 to-cyan-500/5 hover:border-blue-500/30",
    },
    {
      id: "motor",
      href: "/motor",
      title: dict.motor.title,
      description: dict.motor.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-violet-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11.25 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-13.5-3h9.75M16.5 10.5h-5.25L9.75 14.25m4.5-9H10.5m4.5 0v3.75m0-3.75h1.5a1.5 1.5 0 0 1 1.5 1.5v2.25m-7.5-3.75H9m1.5 0V7.5"
          />
        </svg>
      ),
      color: "from-violet-500/10 to-purple-500/5 hover:border-violet-500/30",
    },
    {
      id: "saham",
      href: "/saham",
      title: dict.saham.title,
      description: dict.saham.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
          />
        </svg>
      ),
      color: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/30",
    },
    {
      id: "emas",
      href: "/emas",
      title: dict.emas.title,
      description: dict.emas.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-amber-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
      ),
      color: "from-amber-500/10 to-yellow-500/5 hover:border-amber-500/30",
    },
    {
      id: "kripto",
      href: "/kripto",
      title: dict.kripto.title,
      description: dict.kripto.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-violet-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0-.414.168-.75.375-.75h3.75c.207 0 .375.336.375.75s-.168.75-.375.75H12v3.75h1.875c.207 0 .375.336.375.75s-.168.75-.375.75h-3.75c-.207 0-.375-.336-.375-.75s.168-.75.375-.75H12V10.5h-1.875c-.207 0-.375-.336-.375-.75z"
          />
        </svg>
      ),
      color: "from-violet-500/10 to-cyan-500/5 hover:border-violet-500/30",
    },
    {
      id: "menabung",
      href: "/menabung",
      title: dict.menabung.title,
      description: dict.menabung.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-pink-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-1.971-.659-1.171-.879-1.171-2.303 0-3.182 1.171-.879 3.07-.879 4.242 0L15 8.818M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "from-pink-500/10 to-rose-500/5 hover:border-pink-500/30",
    },
    {
      id: "investasi",
      href: "/investasi",
      title: dict.investasi.title,
      description: dict.investasi.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-cyan-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
          />
        </svg>
      ),
      color: "from-cyan-500/10 to-blue-500/5 hover:border-cyan-500/30",
    },
    {
      id: "depresiasi",
      href: "/depresiasi",
      title: dict.depresiasi.title,
      description: dict.depresiasi.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-rose-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6L9 12.75l4.286-4.286L21.75 15M2.25 6v12a1.5 1.5 0 001.5 1.5h16.5a1.5 1.5 0 001.5-1.5v-12A1.5 1.5 0 0020.25 4.5H3.75A1.5 1.5 0 002.25 6z"
          />
        </svg>
      ),
      color: "from-rose-500/10 to-red-500/5 hover:border-rose-500/30",
    },
    {
      id: "forex",
      href: "/forex",
      title: dict.forex.title,
      description: dict.forex.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-indigo-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
      ),
      color: "from-indigo-500/10 to-emerald-500/5 hover:border-indigo-500/30",
    },
    {
      id: "trader-hub",
      href: "/trader-hub",
      title: dict.traderHub.title,
      description: dict.traderHub.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-amber-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25l1.5-1.5 2 2 3-3.75"
          />
        </svg>
      ),
      color: "from-amber-500/10 to-emerald-500/5 hover:border-amber-500/30",
    },
    {
      id: "trader-bot",
      href: "/trader-bot",
      title: dict.traderBot.title,
      description: dict.traderBot.subtitle,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
          />
        </svg>
      ),
      color: "from-primary/10 to-indigo-500/5 hover:border-primary/30",
    },
    {
      id: "demo-encryption",
      href: "/demo-encryption",
      title: dict.demo.title,
      description: dict.demo.subtitle,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-purple-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
      color: "from-purple-500/10 to-indigo-500/5 hover:border-purple-500/30",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <Header dict={dict} currentLocale={locale} />

      <main className="flex-1 bg-gradient-to-b from-transparent via-black/[0.01] to-black/[0.02] dark:via-white/[0.01] dark:to-white/[0.02] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <section className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              PWA Active & Offline Ready
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground via-foreground to-indigo-600 dark:to-indigo-400 bg-clip-text text-transparent pb-1">
              {dict.dashboard.subtitle}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {dict.dashboard.description}
            </p>
          </section>

          {/* Calculators Grid */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calc) => (
              <Link
                key={calc.id}
                href={calc.href}
                className="group block outline-none"
              >
                <Card
                  className={`h-full hover-glow bg-gradient-to-br ${calc.color} cursor-pointer border border-card-border overflow-hidden`}
                >
                  <CardContent className="flex flex-col h-full justify-between gap-6">
                    <div className="flex flex-col gap-4">
                      {/* Icon Container */}
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-card-border shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {calc.icon}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-2">
                        <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                          {calc.title}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-3">
                          {calc.description}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-500 dark:text-indigo-400">
                      <span>{dict.dashboard.cta}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <Footer dict={dict} />
    </div>
  );
}
