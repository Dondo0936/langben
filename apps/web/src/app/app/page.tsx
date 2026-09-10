import { AppShell } from "@/components/app/AppShell";
import { Stat } from "@/components/app/Ui";
import { getLang } from "@/lib/get-lang";
import { formatDuration, formatUsd } from "@/lib/format";
import { stats } from "@/lib/store";
import { isCloud } from "@/lib/deployment";
import { CLOUD_PLANS } from "@/lib/plans";
import { requireConsole } from "@/lib/console";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const lang = await getLang();
  const { project, org } = await requireConsole();
  const s = stats(project.id);
  const plan = CLOUD_PLANS.find((p) => p.id === (org?.plan ?? "hobby"));
  const vi = lang === "vi";
  return (
    <AppShell active="overview">
      <h1 className="mb-4 text-xl font-semibold">{vi ? "Tổng quan" : "Overview"}</h1>
      {isCloud() && plan ? (
        <div className="mb-4 rounded-xl border border-line bg-white p-4 text-sm">
          <div className="font-medium">Vết Cloud · {plan.name}</div>
          <div className="mt-1 text-muted">
            {vi
              ? `${s.units.toLocaleString("vi-VN")} / ${plan.includedUnits.toLocaleString("vi-VN")} đơn vị tháng này · vùng ${org?.region ?? "ap-southeast-1"}`
              : `${s.units.toLocaleString("en-US")} / ${plan.includedUnits.toLocaleString("en-US")} units this month · region ${org?.region ?? "ap-southeast-1"}`}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2">
            <div className="h-2 bg-accent" style={{ width: `${Math.min(100, (s.units / plan.includedUnits) * 100)}%` }} />
          </div>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={vi ? "Vết" : "Traces"} value={String(s.traces)} />
        <Stat label={vi ? "Tỷ lệ lỗi" : "Error rate"} value={`${(s.errorRate * 100).toFixed(1)}%`} />
        <Stat label="p50 / p95" value={`${formatDuration(s.p50, lang)} / ${formatDuration(s.p95, lang)}`} />
        <Stat label={vi ? "Chi phí (ước tính)" : "Cost (est.)"} value={formatUsd(s.costUsd)} />
      </div>
      <h2 className="mb-2 mt-8 text-sm font-medium">{vi ? "Theo kênh" : "By channel"}</h2>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2">{vi ? "Kênh" : "Channel"}</th>
              <th className="px-3 py-2">{vi ? "Số vết" : "Traces"}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(s.byChannel).map(([ch, n]) => (
              <tr key={ch} className="border-t border-line">
                <td className="px-3 py-2 font-mono text-xs">{ch}</td>
                <td className="px-3 py-2 tabular">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm">
        <Link href="/app/traces" className="text-accent">{vi ? "Xem vết →" : "Open traces →"}</Link>
      </p>
    </AppShell>
  );
}
