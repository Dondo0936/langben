import { AppShell } from "@/components/app/AppShell";
import { getLang } from "@/lib/get-lang";
import { requireConsole } from "@/lib/console";
import { listRoutes, listTraces } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const routes = listRoutes(project.id);
  const traces = listTraces(project.id);
  const vi = lang === "vi";
  return (
    <AppShell active="routes">
      <h1 className="mb-4 text-xl font-semibold">{vi ? "Lộ trình" : "Routes"}</h1>
      <div className="space-y-3">
        {routes.map((r) => {
          const n = traces.filter((t) => t.routeId === r.id).length;
          const errors = traces.filter((t) => t.routeId === r.id && t.status === "error").length;
          return (
            <div key={r.id} className="rounded-xl border border-line bg-white p-4">
              <div className="font-medium">{r.name}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {r.steps.map((s, i) => (
                  <span key={s} className="flex items-center gap-2">
                    <span className="rounded-full bg-paper-2 px-2 py-1 font-mono">{s}</span>
                    {i < r.steps.length - 1 ? <span className="text-muted">→</span> : null}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">
                {n} {vi ? "vết" : "traces"} · {errors} {vi ? "lỗi / drop-off" : "errors / drop-off"}
              </p>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
