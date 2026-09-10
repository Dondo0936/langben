import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, StatusPill } from "@/components/app/Ui";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
import { formatDuration, formatTime, latencyOf } from "@/lib/format";
import { requireConsole } from "@/lib/console";
import { listTraces } from "@/lib/store";
import { publicUrl } from "@/lib/deployment";

export const dynamic = "force-dynamic";

export default async function TracesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; channel?: string; status?: string }>;
}) {
  const lang = await getLang();
  const query = await searchParams;
  const { project } = await requireConsole();
  const traces = listTraces(project.id, query);
  const vi = lang === "vi";
  return (
    <AppShell active="traces">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{tr(lang, t.app.traces)}</h1>
          <p className="text-sm text-muted">{traces.length} {vi ? "vết" : "traces"}</p>
        </div>
        <form className="flex flex-wrap gap-2 text-sm">
          <input name="q" defaultValue={query.q} placeholder={tr(lang, t.app.search)} className="rounded-lg border border-line bg-white px-3 py-1.5" />
          <select name="channel" defaultValue={query.channel ?? ""} className="rounded-lg border border-line bg-white px-2 py-1.5">
            <option value="">{vi ? "Mọi kênh" : "All channels"}</option>
            {["zalo_oa", "lark", "gchat", "msteams"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="rounded-lg bg-ink px-3 py-1.5 text-highlight">{vi ? "Lọc" : "Filter"}</button>
        </form>
      </div>
      {traces.length === 0 ? (
        <EmptyState
          title={tr(lang, t.app.emptyTraces)}
          hint={`${tr(lang, t.app.emptyHint)} ${publicUrl()}/hooks/zalo/oa/${project.id}`}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-paper-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2">{vi ? "Tên" : "Name"}</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">{vi ? "Kênh" : "Channel"}</th>
                <th className="px-3 py-2">Latency</th>
                <th className="px-3 py-2">{vi ? "Trạng thái" : "Status"}</th>
                <th className="px-3 py-2">{vi ? "Thời gian" : "Time"}</th>
              </tr>
            </thead>
            <tbody>
              {traces.map((trRow) => (
                <tr key={trRow.id} className="border-t border-line hover:bg-paper/60">
                  <td className="px-3 py-2">
                    <Link href={`/app/traces/${trRow.id}`} className="font-medium hover:text-accent">
                      {trRow.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{trRow.userId ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{trRow.channel ?? "sdk"}</td>
                  <td className="px-3 py-2 tabular">{formatDuration(latencyOf(trRow.startTime, trRow.endTime) ?? 0, lang)}</td>
                  <td className="px-3 py-2"><StatusPill status={trRow.status} /></td>
                  <td className="px-3 py-2 text-xs text-muted">{formatTime(trRow.startTime, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
