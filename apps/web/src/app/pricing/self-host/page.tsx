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
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {vi ? "Bạn host · giấy phép MIT" : "You host · MIT license"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Tự vận hành OSS hôm nay. Enterprise khi cần." : "Deploy OSS today. Upgrade to Enterprise anytime."}
        </h1>
        <p className="mt-3 text-muted">
          {vi ? "Xem thêm: " : "See also: "}
          <Link href="/pricing" className="text-accent">{vi ? "giá Cloud" : "Cloud pricing"}</Link>.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-line bg-white p-1 text-sm">
          <Link href="/pricing" className="rounded-full px-4 py-1.5">{vi ? "Cloud" : "Cloud"}</Link>
          <span className="rounded-full bg-ink px-4 py-1.5 text-highlight">{vi ? "Tự vận hành" : "Self-host"}</span>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-xl font-semibold">{vi ? "Mã nguồn mở" : "Open Source"}</h2>
            <p className="mt-1 text-3xl font-semibold">{vi ? "Miễn phí" : "Free"}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>{vi ? "MIT — toàn bộ tính năng sản phẩm, không giới hạn đơn vị" : "MIT — all product features, unlimited units"}</li>
              <li>Docker Compose / Kubernetes</li>
              <li>{vi ? "Hỗ trợ cộng đồng GitHub" : "GitHub community support"}</li>
              <li>{vi ? "Dữ liệu ở infra của bạn" : "Data on your infrastructure"}</li>
            </ul>
            <Link href="/self-host" className="mt-6 inline-block rounded-full bg-ink px-4 py-2 text-sm text-highlight">
              {vi ? "Hướng dẫn deploy" : "Deployment guide"}
            </Link>
          </div>
          <div className="rounded-2xl border border-ink bg-ink p-6 text-paper">
            <h2 className="text-xl font-semibold">Enterprise</h2>
            <p className="mt-1 text-3xl font-semibold">{vi ? "Liên hệ" : "Custom"}</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              <li>{vi ? "Mọi thứ OSS + RBAC project, audit, SCIM, retention" : "Everything in OSS plus project RBAC, audit, SCIM, retention"}</li>
              <li>{vi ? "Kỹ sư hỗ trợ + SLA" : "Named support engineer + SLA"}</li>
              <li>SOC 2 / ISO 27001</li>
              <li>{vi ? "Hóa đơn / AWS Marketplace" : "Invoice / AWS Marketplace"}</li>
            </ul>
            <Link href="/enterprise" className="mt-6 inline-block rounded-full bg-highlight px-4 py-2 text-sm text-ink">
              {vi ? "Nói chuyện với sales" : "Talk to sales"}
            </Link>
          </div>
        </div>

        <h2 className="mt-16 text-2xl font-semibold">{vi ? "So sánh tự vận hành" : "Self-hosted comparison"}</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="bg-ink text-paper">
            <tr>
              <th className="px-3 py-2">{vi ? "Tính năng" : "Feature"}</th>
              <th className="px-3 py-2">OSS</th>
              <th className="px-3 py-2">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {SELF_HOST_COMPARE.map((row) => (
              <tr key={row.feature} className="border-b border-line even:bg-white">
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
