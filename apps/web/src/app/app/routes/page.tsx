import { ChannelShell } from "@/components/app/ChannelShell";
import { getLang } from "@/lib/get-lang";
import { requireChannelConsole } from "@/lib/console";
import { listRoutes, listTraces } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const lang = await getLang();
  const { embed } = await searchParams;
  const embedded = embed === "1";
  const { project } = await requireChannelConsole();
  const routes = listRoutes(project.id);
  const traces = listTraces(project.id);
  const vi = lang === "vi";
  return (
    <ChannelShell embed={embedded} title={vi ? "Lộ trình" : "Routes"}>
      <h1 className="mb-3 text-lg font-semibold">{vi ? "Lộ trình" : "Routes"}</h1>
      <div className="space-y-3">
        {routes.map((r) => {
          const n = traces.filter((t) => t.routeId === r.id).length;
          const errors = traces.filter((t) => t.routeId === r.id && t.status === "error").length;
          return (
            <div key={r.id} className="panel p-4">
              <div className="font-medium">{r.name}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {r.steps.map((s, i) => (
                  <span key={s} className="flex items-center gap-2">
                    <span className="rounded-md bg-paper-2 px-2 py-1 font-mono">{s}</span>
                    {i < r.steps.length - 1 ? <span className="text-muted">→</span> : null}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted">
                {n} {vi ? "vết (store local)" : "traces (local store)"} · {errors} {vi ? "lỗi" : "errors"}
              </p>
            </div>
          );
        })}
      </div>
    </ChannelShell>
  );
}
