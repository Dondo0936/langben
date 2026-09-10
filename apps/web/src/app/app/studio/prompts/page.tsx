import { AppShell } from "@/components/app/AppShell";
import { getLang } from "@/lib/get-lang";
import { requireConsole } from "@/lib/console";
import { listPrompts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const prompts = listPrompts(project.id);
  const vi = lang === "vi";
  return (
    <AppShell active="prompts">
      <h1 className="mb-4 text-xl font-semibold">Prompt</h1>
      <div className="space-y-3">
        {prompts.map((p) => (
          <div key={p.id} className="rounded-xl border border-line bg-white p-4">
            <div className="font-medium">{p.name} <span className="text-xs text-muted">v{p.version}</span></div>
            <pre className="mt-2 overflow-auto font-mono text-xs text-muted">{JSON.stringify(p.messages, null, 2)}</pre>
          </div>
        ))}
      </div>
      {!prompts.length ? <p className="text-sm text-muted">{vi ? "Chưa có prompt." : "No prompts yet."}</p> : null}
    </AppShell>
  );
}
