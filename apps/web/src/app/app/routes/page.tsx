import Link from "next/link";
import { ChannelShell } from "@/components/app/ChannelShell";
import { consoleProjectUrl } from "@/lib/console-target";
import { getLang } from "@/lib/get-lang";
import { requireChannelConsole } from "@/lib/console";
import { channelTypeForRoute } from "@/lib/route-channel";
import { listRoutes, listTraces } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string; project?: string }>;
}) {
  const lang = await getLang();
  const { embed, project: projectParam } = await searchParams;
  const embedded = embed === "1";
  const { project } = await requireChannelConsole(projectParam);
  const routes = listRoutes(project.id);
  const traces = listTraces(project.id);
  const vi = lang === "vi";
  const q = new URLSearchParams();
  if (embedded) q.set("embed", "1");
  if (project.id) q.set("project", project.id);
  const qs = q.toString() ? `?${q.toString()}` : "";

  return (
    <ChannelShell embed={embedded} title={vi ? "Lộ trình" : "Routes"}>
      <h1 className="mb-1 text-lg font-semibold">{vi ? "Lộ trình" : "Routes"}</h1>
      <p className="mb-4 text-sm text-muted">
        {vi
          ? "Đường tin từ kênh vào đến câu trả lời. Bước trên đây là sơ đồ seed — bật/tắt và Gửi thử nằm ở Kênh. Lượt thật nằm ở Phiên."
          : "Path from inbound to the reply. Steps here are the seeded map — enable and Gửi thử live on Channels. Live turns live in Sessions."}
      </p>
      <div className="space-y-3">
        {routes.map((r) => {
          const n = traces.filter((t) => t.routeId === r.id).length;
          const errors = traces.filter((t) => t.routeId === r.id && t.status === "error").length;
          const channel = channelTypeForRoute(r);
          const channelHref = channel ? `/app/channels/${channel}${qs}` : null;
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
                {n} {vi ? "lượt local" : "local turns"} · {errors} {vi ? "lỗi" : "errors"}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {channelHref ? (
                  <Link href={channelHref} className="text-ink underline-offset-4 hover:underline">
                    {vi ? "Mở kênh" : "Open channel"}
                  </Link>
                ) : null}
                <a
                  href={consoleProjectUrl("/sessions")}
                  className="text-ink underline-offset-4 hover:underline"
                  target={embedded ? "_top" : undefined}
                  rel={embedded ? "noopener" : undefined}
                >
                  {vi ? "Xem phiên" : "Open sessions"}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </ChannelShell>
  );
}
