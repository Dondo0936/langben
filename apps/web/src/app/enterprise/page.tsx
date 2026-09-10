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
        <h1 className="text-4xl font-semibold tracking-tight">
          {vi ? "Vết cho doanh nghiệp" : "Vết for enterprise"}
        </h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Cloud Enterprise hoặc tự host Enterprise: SLA, SCIM, audit, vùng dữ liệu, hóa đơn. Cùng codebase MIT."
            : "Cloud Enterprise or self-hosted Enterprise: SLA, SCIM, audit, residency, invoice. Same MIT codebase."}
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>{vi ? "Vùng Singapore / EU / US (Cloud)" : "Singapore / EU / US regions (Cloud)"}</li>
          <li>SSO Okta / Entra · SCIM</li>
          <li>{vi ? "Hỗ trợ riêng, review kiến trúc" : "Named support, architecture review"}</li>
          <li>AWS Marketplace / invoice</li>
        </ul>
        <Link href="/pricing" className="mt-6 inline-block text-accent">
          {vi ? "Xem giá →" : "See pricing →"}
        </Link>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
