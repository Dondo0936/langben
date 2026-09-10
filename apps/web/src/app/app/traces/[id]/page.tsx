import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { TraceView } from "@/components/app/TraceView";
import { StatusPill } from "@/components/app/Ui";
import { getLang } from "@/lib/get-lang";
import { formatDuration, formatUsd, latencyOf } from "@/lib/format";
import { requireConsole } from "@/lib/console";
import { getTrace, listObservations, listScores } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const { project } = await requireConsole();
  const trace = getTrace(project.id, id);
  if (!trace) notFound();
  const observations = listObservations(project.id, id);
  const scores = listScores(project.id, id);
  const cost = observations.reduce((n, o) => n + (o.usage?.estimatedCostUsd ?? 0), 0);
  const tokens = observations.reduce((n, o) => n + (o.usage?.inputTokens ?? 0) + (o.usage?.outputTokens ?? 0), 0);
  const vi = lang === "vi";
  return (
    <AppShell active="traces">
      <div className="mb-4">
        <Link href="/app/traces" className="text-xs text-muted">{vi ? "← Vết" : "← Traces"}</Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">{trace.name}</h1>
          <StatusPill status={trace.status} />
        </div>
        <p className="mt-1 text-sm text-muted">
          {trace.channel ?? "sdk"} · {trace.userId ?? "—"} · {formatDuration(latencyOf(trace.startTime, trace.endTime) ?? 0, lang)} · {tokens} tok · {vi ? "ước tính" : "est."} {formatUsd(cost)}
          {trace.sessionId ? (
            <>
              {" · "}
              <Link className="text-accent" href={`/app/sessions/${encodeURIComponent(trace.sessionId)}`}>
                {vi ? "Phiên" : "Session"}
              </Link>
            </>
          ) : null}
        </p>
        {scores.length ? (
          <p className="mt-1 text-xs text-muted">
            {vi ? "Điểm" : "Scores"}: {scores.map((s) => `${s.name}=${s.value}`).join(" · ")}
          </p>
        ) : null}
      </div>
      <TraceView trace={trace} observations={observations} lang={lang} />
    </AppShell>
  );
}
