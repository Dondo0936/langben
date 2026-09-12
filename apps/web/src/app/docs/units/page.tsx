import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { UnitToolkit } from "@/components/marketing/UnitToolkit";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đơn vị — bộ công cụ" };

export default async function UnitsToolkitPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">
          {vi ? "Tài liệu · usage" : "Docs · usage"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {vi
            ? "Đơn vị giúp giải thích usage cho team. Tự vận hành không đếm đơn vị."
            : "Units help explain usage to your team. Self-host does not meter them."}
        </p>
        <p className="mt-3 text-sm">
          <Link href="/docs" className="text-ink underline-offset-4 hover:underline">{vi ? "← Tài liệu" : "← Docs"}</Link>
        </p>
        <div className="mt-10">
          <UnitToolkit lang={lang} />
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
