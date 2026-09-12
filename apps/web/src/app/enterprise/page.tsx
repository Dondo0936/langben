import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enterprise" };

export default async function EnterprisePage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {vi ? "Sắp ra mắt" : "Coming soon"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Enterprise chưa mở" : "Enterprise is not open yet"}
        </h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Cloud Enterprise và add-on tự host Enterprise đang pending cùng các gói Cloud. Hôm nay hãy tự vận hành MIT."
            : "Cloud Enterprise and the self-hosted Enterprise add-on are pending with the rest of Cloud. Self-host the MIT build today."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/self-host" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-highlight">
            {vi ? "Tự vận hành" : "Self-host"}
          </Link>
          <Link href="/pricing" className="rounded-full border border-ink/20 px-5 py-2.5 text-sm">
            {vi ? "Cloud sắp có" : "Cloud coming soon"}
          </Link>
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
