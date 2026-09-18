import type { Dictionary } from "@/lib/dictionaries";

interface FooterProps {
  dict: Dictionary;
}

export function Footer({ dict }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = dict.footer.copyright.replace("{year}", currentYear.toString());

  return (
    <footer className="w-full border-t border-card-border bg-black/[0.01] dark:bg-white/[0.01] py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Brand details */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            {copyrightText}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {dict.footer.madeWith}
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-center sm:text-right max-w-md">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
            Disclaimer: Perhitungan kalkulator ini bersifat edukatif dan simulasi finansial semata. Pengguna diharapkan melakukan konsultasi hukum, pajak, atau keuangan dengan profesional tersertifikasi sebelum mengambil keputusan bisnis/investasi riil.
          </p>
        </div>
      </div>
    </footer>
  );
}
