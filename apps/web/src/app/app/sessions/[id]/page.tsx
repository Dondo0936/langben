import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { TraceView } from "@/components/app/TraceView";
import { getLang } from "@/lib/get-lang";
import { requireConsole } from "@/lib/console";
import { getSession, listObservations, tracesForSession } from "@/lib/store";

export const dynamic = "force-dynamic";

function routeParam(id: string) {
  try {
    return id.includes("%") ? decodeURIComponent(id) : id;
  } catch {
    return id;
  }
}

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = routeParam(id);
  const lang = await getLang();
  const { project } = await requireConsole();
  const session = getSession(project.id, sessionId);
  if (!session) notFound();
  const traces = tracesForSession(project.id, sessionId);
  const observations = traces.flatMap((t) => listObservations(project.id, t.id));
  const vi = lang === "vi";
  const synthetic = traces[0];
  return (
    <AppShell active="sessions">
      <Link href="/app/sessions" className="text-xs text-muted">{vi ? "← Phiên" : "← Sessions"}</Link>
      <h1 className="mt-1 text-xl font-semibold">
        {session.channel} · {session.userId}
      </h1>
      <p className="mb-4 text-sm text-muted">
        {traces.length} {vi ? "vết trong phiên" : "traces in session"}
      </p>
      <ul className="mb-4 space-y-1 text-sm">
        {traces.map((t) => (
          <li key={t.id}>
            <Link href={`/app/traces/${t.id}`} className="text-accent">{t.name}</Link>
          </li>
        ))}
      </ul>
      {synthetic ? (
        <TraceView
          trace={{ ...synthetic, name: vi ? "Hội thoại phiên" : "Session replay", id: session.id }}
          observations={observations}
          lang={lang}
        />
      ) : null}
    </AppShell>
  );
}
