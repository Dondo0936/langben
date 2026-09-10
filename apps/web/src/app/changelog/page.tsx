import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nhật ký" };

export default async function ChangelogPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{vi ? "Nhật ký" : "Changelog"}</h1>
        <article className="mt-8">
          <p className="text-sm text-muted">9 Sep 2026 · v0.1.0</p>
          <h2 className="mt-1 text-xl font-semibold">{vi ? "Slice 0 + đóng gói Cloud/OSS" : "Slice 0 + Cloud/OSS packaging"}</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>{vi ? "Landing tiếng Việt, giá Hobby/Core/Pro/Enterprise, tự host MIT" : "Vietnamese landing, Hobby/Core/Pro/Enterprise, MIT self-host"}</li>
            <li>{vi ? "Console: Tổng quan, Vết, Phiên, hội thoại Zalo" : "Console: overview, traces, sessions, Zalo replay"}</li>
            <li>{vi ? "Ingest SDK + webhook Zalo OA (ký MAC)" : "SDK ingest + Zalo OA webhook (MAC)"}</li>
          </ul>
        </article>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
