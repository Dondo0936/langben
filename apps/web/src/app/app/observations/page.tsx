import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { getLang } from "@/lib/get-lang";
import { formatDuration, formatTime, latencyOf, typeLabel } from "@/lib/format";
import { requireConsole } from "@/lib/console";
import { listObservations } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ObservationsPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const rows = listObservations(project.id).slice(0, 200);
  const vi = lang === "vi";
  return (
    <AppShell active="observations">
      <h1 className="mb-4 text-xl font-semibold">{vi ? "Quan sát" : "Observations"}</h1>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-paper-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2">{vi ? "Tên" : "Name"}</th>
              <th className="px-3 py-2">{vi ? "Loại" : "Type"}</th>
              <th className="px-3 py-2">{vi ? "Mô hình" : "Model"}</th>
              <th className="px-3 py-2">Latency</th>
              <th className="px-3 py-2">{vi ? "Vết" : "Trace"}</th>
              <th className="px-3 py-2">{vi ? "Thời gian" : "Time"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-3 py-2 font-medium">{o.name}</td>
                <td className="px-3 py-2 text-xs">{typeLabel(o.type, lang)}</td>
                <td className="px-3 py-2 font-mono text-xs">{o.model ?? "—"}</td>
                <td className="px-3 py-2 tabular">{formatDuration(latencyOf(o.startTime, o.endTime) ?? 0, lang)}</td>
                <td className="px-3 py-2"><Link className="text-accent" href={`/app/traces/${o.traceId}`}>{o.traceId.slice(0, 12)}</Link></td>
                <td className="px-3 py-2 text-xs text-muted">{formatTime(o.startTime, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
