import { AppShell } from "@/components/app/AppShell";
import { PlanSwitcher } from "@/components/app/PlanSwitcher";
import { requireConsole } from "@/lib/console";
import { isCloud, publicUrl } from "@/lib/deployment";
import { getLang } from "@/lib/get-lang";
import { CLOUD_PLANS } from "@/lib/plans";
import { listConnections, stats } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const lang = await getLang();
  const { project, org } = await requireConsole();
  const s = stats(project.id);
  const cloud = isCloud();
  const plan = CLOUD_PLANS.find((p) => p.id === (org?.plan ?? "hobby"));
  const connections = listConnections(project.id);
  const vi = lang === "vi";
  return (
    <AppShell active="settings">
      <h1 className="mb-4 text-xl font-semibold">{vi ? "Cài đặt" : "Settings"}</h1>
      <section className="mb-8 rounded-xl border border-line bg-white p-4">
        <h2 className="font-medium">{vi ? "Gói dịch vụ" : "Plan"}</h2>
        <p className="mt-1 text-sm text-muted">
          {cloud
            ? `Cloud · ${plan?.name} · ${s.units.toLocaleString("vi-VN")} / ${plan?.includedUnits.toLocaleString("vi-VN")} ${vi ? "đơn vị" : "units"}`
            : vi ? "Tự vận hành · MIT" : "Self-host · MIT"}
        </p>
        <div className="mt-3">
          <PlanSwitcher current={org?.plan ?? "hobby"} cloud={cloud} />
        </div>
        {cloud ? (
          <p className="mt-2 text-xs text-muted">
            {vi ? "Demo: đổi gói ngay (chưa gắn Stripe). Production sẽ checkout như Langfuse Cloud." : "Demo: switch plans in-place (no Stripe yet). Production will checkout like Langfuse Cloud."}
          </p>
        ) : null}
      </section>
      <section className="mb-8 rounded-xl border border-line bg-white p-4">
        <h2 className="font-medium">{vi ? "Project & khóa ingest" : "Project & ingest keys"}</h2>
        <p className="mt-2 font-mono text-xs">public: {project.publicKey}</p>
        <p className="mt-1 text-xs text-muted">
          {vi ? "Secret chỉ hiện một lần lúc đăng ký org." : "The secret is shown once at org signup."}
        </p>
        <p className="mt-2 text-xs text-muted">POST {publicUrl()}/api/ingest · Basic pk:sk</p>
      </section>
      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-medium">{vi ? "Kết nối LLM" : "LLM connections"}</h2>
        <p className="mt-1 text-xs text-muted">{vi ? "Mô hình (Vertex) ≠ kênh Google Chat." : "Vertex models ≠ Google Chat channel."}</p>
        <ul className="mt-3 space-y-2 text-sm">
          {connections.map((c) => (
            <li key={c.id} className="flex justify-between border-b border-line py-2">
              <span>{c.name}</span>
              <span className="text-xs text-muted">{c.region ?? "—"} {c.lastPingOk ? "· ping ok" : "· chưa ping"}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
