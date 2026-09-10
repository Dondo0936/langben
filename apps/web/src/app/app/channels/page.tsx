import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { getLang } from "@/lib/get-lang";
import { formatTime } from "@/lib/format";
import { requireConsole } from "@/lib/console";
import { listChannels } from "@/lib/store";
import { publicUrl } from "@/lib/deployment";

export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  zalo_oa: "Zalo OA",
  zalo_bot: "Zalo Bot",
  fpt: "FPT.AI Conversation",
  viettel: "Viettel (ASR / TTS / NLP)",
  lark: "Lark",
  gchat: "Google Chat",
  msteams: ".NET / Teams",
};

export default async function ChannelsPage() {
  const lang = await getLang();
  const { project } = await requireConsole();
  const channels = listChannels(project.id);
  const vi = lang === "vi";
  const base = publicUrl();
  return (
    <AppShell active="channels">
      <h1 className="mb-1 text-xl font-semibold">{vi ? "Kênh" : "Channels"}</h1>
      <p className="mb-4 text-sm text-muted">
        {vi
          ? "Webhook URL — dán vào Zalo OA. Chưa có webhook thì đây là empty state, không phải “No traces yet”."
          : "Webhook URLs — paste into Zalo OA. Empty means no webhook yet, not “No traces yet”."}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {channels.map((ch) => (
          <Link key={ch.id} href={`/app/channels/${ch.type}`} className="rounded-xl border border-line bg-white p-4 hover:border-ink">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{LABELS[ch.type] ?? ch.name}</h2>
              <span className={`text-xs ${ch.enabled ? "text-accent" : "text-muted"}`}>{ch.enabled ? (vi ? "bật" : "on") : (vi ? "tắt" : "off")}</span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-muted">{ch.webhookPath ? `${base}${ch.webhookPath}` : (vi ? "SDK / OTLP — không webhook" : "SDK / OTLP — no webhook")}</p>
            <p className="mt-2 text-xs text-muted">
              {vi ? "Sự kiện cuối" : "Last event"}: {ch.lastEventAt ? formatTime(ch.lastEventAt, lang) : "—"}
              {ch.signatureFailures ? ` · ${ch.signatureFailures} MAC lỗi` : ""}
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
