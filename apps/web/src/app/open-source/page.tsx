import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";
import { VET_GITHUB_ISSUES, VET_GITHUB_REPO } from "@/lib/github";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mã nguồn mở" };

export default async function OpenSourcePage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">
          {vi ? "Mã nguồn mở. Tự vận hành." : "Open source. Self-host."}
        </h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Vết là MIT. Bạn chạy docker compose trên infra của mình. Không giới hạn đơn vị."
            : "Vết is MIT. You run docker compose on your infra. Unlimited units."}
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="px-3 py-2" />
                <th className="px-3 py-2">{vi ? "Tự host OSS" : "OSS self-host"}</th>
              </tr>
            </thead>
            <tbody className="bg-black/40">
              {[
                [vi ? "Tính năng sản phẩm" : "Product features", "✓"],
                [vi ? "Đơn vị" : "Units", vi ? "Không giới hạn" : "Unlimited"],
                [vi ? "Ai host" : "Who hosts", vi ? "Bạn" : "You"],
                [vi ? "Giấy phép" : "License", "MIT"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-line">
                  {row.map((c) => (
                    <td key={c} className="px-3 py-2">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-sm text-muted">
          {vi
            ? "LICENSE là MIT. NOTICE ghi runtime console là Langfuse OSS (ClickHouse, Inc. MIT) + overlay Vết. Không ee/, không wordmark Langfuse, không tuyên bố affiliation."
            : "LICENSE is MIT. NOTICE: console runtime is Langfuse OSS (ClickHouse, Inc. MIT) plus a Vết overlay. No ee/, no Langfuse wordmark, no affiliation claim."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={VET_GITHUB_REPO} className="btn-solid" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={VET_GITHUB_ISSUES} className="btn-ghost" target="_blank" rel="noopener noreferrer">
            Issues
          </a>
          <Link href="/self-host" className="btn-ghost">
            docker compose up
          </Link>
          <Link href="/docs/units" className="btn-ghost">
            {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
          </Link>
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
