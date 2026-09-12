import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

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
          {vi ? "Mã nguồn mở trước. Cloud sau." : "Open source first. Cloud later."}
        </h1>
        <p className="mt-4 text-muted">
          {vi
            ? "Hôm nay: tự host OSS (MIT). Cùng một repo sẽ chạy Cloud khi chúng tôi host — gói đang pending, chưa mở đăng ký."
            : "Today: OSS self-host (MIT). The same repo will run as Cloud when we host it — plans are pending, signup is closed."}
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="px-3 py-2" />
                <th className="px-3 py-2">{vi ? "Tự host OSS" : "OSS self-host"}</th>
                <th className="px-3 py-2">
                  Vết Cloud <span className="font-normal opacity-70">{vi ? "(sắp có)" : "(soon)"}</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                [vi ? "Tính năng sản phẩm" : "Product features", "✓", "✓"],
                [vi ? "Đơn vị" : "Units", vi ? "Không giới hạn" : "Unlimited", vi ? "Sẽ tính khi Cloud mở" : "Metered when Cloud opens"],
                [vi ? "Dịch vụ managed" : "Fully managed", "—", vi ? "Sắp có" : "Coming soon"],
                [vi ? "Ai host" : "Who hosts", vi ? "Bạn" : "You", vi ? "Chúng tôi" : "We do"],
                [vi ? "Trạng thái" : "Status", vi ? "Live" : "Live", vi ? "Pending" : "Pending"],
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
          <Link href="/self-host" className="rounded-full bg-ink px-4 py-2 text-sm text-highlight">
            docker compose up
          </Link>
          <Link href="/docs/units" className="rounded-full border border-line px-4 py-2 text-sm">
            {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
          </Link>
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
