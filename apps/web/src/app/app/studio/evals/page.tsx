import { AppShell } from "@/components/app/AppShell";
import { getLang } from "@/lib/get-lang";
import { requireConsole } from "@/lib/console";
import { listScores } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function EvalsPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const scores = listScores(project.id);
  const vi = lang === "vi";
  return (
    <AppShell active="evals">
      <h1 className="mb-4 text-xl font-semibold">{vi ? "Đánh giá" : "Evals"}</h1>
      <p className="mb-4 text-sm text-muted">
        {vi ? "Điểm thủ công + LLM-as-judge trên lượt (bot đã trả lời / intent ≠ unknown)." : "Manual scores + LLM-as-judge on a turn."}
      </p>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2">{vi ? "Tên" : "Name"}</th>
              <th className="px-3 py-2">{vi ? "Giá trị" : "Value"}</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Trace</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2 tabular">{s.value}</td>
                <td className="px-3 py-2">{s.source}</td>
                <td className="px-3 py-2 font-mono text-xs">{s.traceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
