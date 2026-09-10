import { AppShell } from "@/components/app/AppShell";
import { PlaygroundForm } from "@/components/app/PlaygroundForm";
import { getLang } from "@/lib/get-lang";
import { requireConsole } from "@/lib/console";
import { listConnections } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PlaygroundPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const connections = listConnections(project.id);
  const vi = lang === "vi";
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  return (
    <AppShell active="playground">
      <h1 className="text-xl font-semibold">Playground</h1>
      <p className="mb-4 text-sm text-muted">
        {vi
          ? "Kết nối LLM (Anthropic, Bedrock, Vertex, Foundry) — không phải kênh Zalo/Chat."
          : "LLM connections (Anthropic, Bedrock, Vertex, Foundry) — not Zalo/Chat channels."}
      </p>
      {!hasKey ? (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm">
          {vi
            ? "Chưa có ANTHROPIC_API_KEY. Playground hiện thông báo tiếng Việt; vết seed vẫn xem được."
            : "No ANTHROPIC_API_KEY. Playground shows a Vietnamese message; seeded traces still work."}
        </p>
      ) : null}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {connections.map((c) => (
          <span key={c.id} className="rounded-full border border-line bg-white px-3 py-1">
            {c.name} {c.region ? `· ${c.region}` : ""} {c.lastPingOk ? "· ping ok" : ""}
          </span>
        ))}
      </div>
      <PlaygroundForm />
    </AppShell>
  );
}
