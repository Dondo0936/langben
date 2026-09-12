import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";
import { SELF_HOST_COMPARE, compareCell } from "@/lib/plans";

export const dynamic = "force-dynamic";
export const metadata = { title: "Giá tự vận hành" };

export default async function SelfHostPricingPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">
          {vi ? "Bạn host · giấy phép MIT" : "You host · MIT license"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Tự vận hành OSS hôm nay. Enterprise khi cần." : "Deploy OSS today. Upgrade to Enterprise anytime."}
        </h1>
        <p className="mt-3 text-muted">
          {vi ? "Cloud đang pending — " : "Cloud is pending — "}
          <Link href="/pricing" className="text-ink underline-offset-4 hover:underline">{vi ? "xem trang sắp ra mắt" : "see the coming-soon page"}</Link>.
        </p>
        <div className="mt-6 inline-flex border border-white/20 p-1 text-sm">
          <Link href="/pricing" className="px-4 py-1.5">{vi ? "Cloud · sắp có" : "Cloud · soon"}</Link>
          <span className="bg-ink px-4 py-1.5 text-paper">{vi ? "Tự vận hành" : "Self-host"}</span>
        </div>

        <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-2">
          <div className="bg-black/70 p-6">
            <h2 className="text-xl font-semibold">{vi ? "Mã nguồn mở" : "Open Source"}</h2>
            <p className="mt-1 text-3xl font-semibold">{vi ? "Miễn phí" : "Free"}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>{vi ? "MIT — toàn bộ tính năng sản phẩm, không giới hạn đơn vị" : "MIT — all product features, unlimited units"}</li>
              <li>Docker Compose / Kubernetes</li>
              <li>{vi ? "Hỗ trợ cộng đồng GitHub" : "GitHub community support"}</li>
              <li>{vi ? "Dữ liệu ở infra của bạn" : "Data on your infrastructure"}</li>
            </ul>
            <Link href="/self-host" className="btn-solid mt-6">
              {vi ? "Hướng dẫn deploy" : "Deployment guide"}
            </Link>
          </div>
          <div className="bg-black/70 p-6 opacity-80">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Enterprise</h2>
              <span className="border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                {vi ? "Sắp có" : "Soon"}
              </span>
            </div>
            <p className="mt-1 text-3xl font-semibold">{vi ? "Pending" : "Pending"}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>{vi ? "Add-on thương mại trên OSS: RBAC, audit, SCIM, SLA" : "Commercial add-on on OSS: RBAC, audit, SCIM, SLA"}</li>
              <li>{vi ? "Chưa mở sales — dùng MIT hôm nay" : "Sales not open — run MIT today"}</li>
            </ul>
            <Link href="/enterprise" className="btn-ghost mt-6">
              {vi ? "Trang Enterprise" : "Enterprise page"}
            </Link>
          </div>
        </div>

        <h2 className="mt-16 text-2xl font-semibold">{vi ? "So sánh tự vận hành" : "Self-hosted comparison"}</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="px-3 py-2">{vi ? "Tính năng" : "Feature"}</th>
              <th className="px-3 py-2">OSS</th>
              <th className="px-3 py-2">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {SELF_HOST_COMPARE.map((row) => (
              <tr key={row.feature} className="border-b border-white/10 even:bg-white/5">
                <td className="px-3 py-2">{vi ? row.feature : row.featureEn}</td>
                <td className="px-3 py-2">{compareCell(row.oss, lang)}</td>
                <td className="px-3 py-2">{compareCell(row.ent, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
