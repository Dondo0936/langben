import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState } from "@/components/app/Ui";
import { getLang } from "@/lib/get-lang";
import { formatTime } from "@/lib/format";
import { requireConsole } from "@/lib/console";
import { listSessions, tracesForSession } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const sessions = listSessions(project.id);
  const vi = lang === "vi";
  return (
    <AppShell active="sessions">
      <h1 className="mb-4 text-xl font-semibold">{vi ? "Phiên" : "Sessions"}</h1>
      {sessions.length === 0 ? (
        <EmptyState title={vi ? "Chưa có phiên kênh" : "No channel sessions"} hint={vi ? "Webhook Zalo sẽ tạo phiên theo user." : "A Zalo webhook creates a session per user."} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-2 text-xs text-muted">
              <tr>
                <th className="px-3 py-2">{vi ? "Kênh" : "Channel"}</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">{vi ? "Vết" : "Traces"}</th>
                <th className="px-3 py-2">{vi ? "Cuối" : "Last seen"}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">{s.channel}</td>
                  <td className="px-3 py-2">
                    <Link href={`/app/sessions/${encodeURIComponent(s.id)}`} className="font-medium hover:text-accent">
                      {s.userId}
                    </Link>
                  </td>
                  <td className="px-3 py-2 tabular">{tracesForSession(project.id, s.id).length}</td>
                  <td className="px-3 py-2 text-xs text-muted">{formatTime(s.lastSeen, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
