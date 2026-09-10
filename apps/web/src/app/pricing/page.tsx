import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";
import { CLOUD_COMPARE, CLOUD_PLANS, TEAMS_ADDON_USD, USAGE_TIERS, compareCell, formatUsd } from "@/lib/plans";

export const dynamic = "force-dynamic";
export const metadata = { title: "Giá Cloud" };

export default async function PricingPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {vi ? "Vết Cloud — chúng tôi host" : "Vết Cloud — we host it"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Bắt đầu Hobby miễn phí. Không cần thẻ." : "Start on Hobby for free. No credit card."}
        </h1>
        <p className="mt-3 text-muted">
          {vi ? "Xem thêm: " : "See also: "}
          <Link href="/pricing/self-host" className="text-accent">
            {vi ? "giá tự vận hành" : "self-hosted pricing"}
          </Link>
          .
        </p>
        <div className="mt-6 inline-flex rounded-full border border-line bg-white p-1 text-sm">
          <span className="rounded-full bg-ink px-4 py-1.5 text-highlight">{vi ? "Cloud" : "Cloud"}</span>
          <Link href="/pricing/self-host" className="rounded-full px-4 py-1.5">
            {vi ? "Tự vận hành" : "Self-host"}
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {CLOUD_PLANS.map((p) => (
            <div key={p.id} className={`flex flex-col rounded-2xl border p-5 ${p.highlighted ? "border-ink bg-white shadow-sm" : "border-line bg-white"}`}>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="mt-2 text-3xl font-semibold">
                {formatUsd(p.monthlyUsd)}
                <span className="text-sm font-normal text-muted">{vi ? "/tháng" : "/mo"}</span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted">{vi ? p.taglineVi : p.taglineEn}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                <li>{vi ? `${p.includedUnits / 1000}k đơn vị / tháng` : `${p.includedUnits / 1000}k units / month`}</li>
                <li>{vi ? p.retention : p.retentionEn}</li>
                <li>{vi ? p.users : p.usersEn}</li>
                {p.id === "hobby" && <li>{vi ? "Hỗ trợ GitHub" : "GitHub community"}</li>}
                {p.id === "core" && <li>{vi ? "Hỗ trợ in-app · 48h" : "In-app support · 48h"}</li>}
                {p.id === "pro" && <li>{vi ? `SOC2 / ISO27001 · Teams +$${TEAMS_ADDON_USD}` : `SOC2 / ISO27001 · Teams +$${TEAMS_ADDON_USD}`}</li>}
                {p.id === "enterprise" && <li>SLA · SCIM · audit</li>}
              </ul>
              <Link
                href={p.id === "enterprise" ? "/enterprise" : "/signup"}
                className="mt-6 rounded-full bg-ink px-4 py-2 text-center text-sm font-medium text-highlight"
              >
                {vi ? p.ctaVi : p.ctaEn}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">
          {vi
            ? `Add-on Teams (+$${TEAMS_ADDON_USD}/tháng trên Pro): SSO Okta/Entra, ép SSO, RBAC theo project, kênh Slack riêng.`
            : `Teams add-on (+$${TEAMS_ADDON_USD}/mo on Pro): Okta/Entra SSO, SSO enforcement, project RBAC, private Slack.`}
        </p>

        <h2 className="mt-16 text-2xl font-semibold">{vi ? "Đơn vị phát sinh (bậc thang)" : "Graduated usage"}</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2">{vi ? "Bậc" : "Tier"}</th>
              <th>{vi ? "Giá / 100k đơn vị" : "Rate / 100k units"}</th>
            </tr>
          </thead>
          <tbody>
            {USAGE_TIERS.map((t) => (
              <tr key={t.label} className="border-b border-line/70">
                <td className="py-2">{vi ? t.label : t.labelEn}</td>
                <td>{t.usdPer100k === 0 ? (vi ? "Gồm trong gói" : "Included") : `$${t.usdPer100k.toFixed(2)}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Một đơn vị = một vết, một quan sát, hoặc một điểm đánh giá gửi lên Cloud."
            : "A billable unit is a trace, observation, or score sent to Cloud."}
        </p>

        <h2 className="mt-16 text-2xl font-semibold">{vi ? "So sánh Cloud" : "Cloud comparison"}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="px-3 py-2">{vi ? "Tính năng" : "Feature"}</th>
                {CLOUD_PLANS.map((p) => (
                  <th key={p.id} className="px-3 py-2">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLOUD_COMPARE.map((row) => (
                <tr key={row.feature} className="border-b border-line even:bg-white">
                  <td className="px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted">{vi ? row.group : row.groupEn}</div>
                    {vi ? row.feature : row.featureEn}
                  </td>
                  <td className="px-3 py-2">{compareCell(row.hobby, lang)}</td>
                  <td className="px-3 py-2">{compareCell(row.core, lang)}</td>
                  <td className="px-3 py-2">{compareCell(row.pro, lang)}</td>
                  <td className="px-3 py-2">{compareCell(row.enterprise, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
