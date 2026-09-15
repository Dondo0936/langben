import { ChannelShell } from "@/components/app/ChannelShell";
import { requireChannelConsole } from "@/lib/console";
import { formatTime } from "@/lib/format";
import { getLang } from "@/lib/get-lang";
import { getWebhookOrigin, listChannels } from "@/lib/store";
import { hookUrl } from "@/lib/webhook-origin";
import Link from "next/link";

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

export default async function ChannelsPage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string; project?: string }>;
}) {
  const lang = await getLang();
  const { embed, project: projectParam } = await searchParams;
  const embedded = embed === "1";
  const { project } = await requireChannelConsole(projectParam);
  const channels = listChannels(project.id);
  const vi = lang === "vi";
  const origin = getWebhookOrigin();
  const q = new URLSearchParams();
  if (embedded) q.set("embed", "1");
  if (project.id) q.set("project", project.id);
  const qs = q.toString() ? `?${q.toString()}` : "";
  return (
    <ChannelShell embed={embedded} title={vi ? "Kênh" : "Channels"}>
      <h1 className="mb-1 text-lg font-semibold">{vi ? "Kênh" : "Channels"}</h1>
      <p className="mb-4 text-sm text-muted">
        {vi
          ? "Mở kênh, dán origin https:// (domain hoặc tunnel), rồi sao chép webhook. Lark / Google Chat: Gửi thử không cần origin."
          : "Open a channel, paste an https:// origin (your domain or tunnel), then copy the webhook. Lark / Google Chat: Gửi thử does not need an origin."}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {channels.map((ch) => (
          <Link
            key={ch.id}
            href={`/app/channels/${ch.type}${qs}`}
            className="panel p-4 hover:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{LABELS[ch.type] ?? ch.name}</h2>
              <span className={`text-xs ${ch.enabled ? "text-ink" : "text-muted"}`}>
                {ch.enabled ? (vi ? "bật" : "on") : vi ? "tắt" : "off"}
              </span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-muted">
              {ch.webhookPath
                ? hookUrl(origin, ch.webhookPath) ?? `https://<host>${ch.webhookPath}`
                : vi
                  ? "SDK / OTLP, không webhook"
                  : "SDK / OTLP, no webhook"}
            </p>
            <p className="mt-2 text-xs text-muted">
              {vi ? "Sự kiện cuối" : "Last event"}: {ch.lastEventAt ? formatTime(ch.lastEventAt, lang) : vi ? "chưa có" : "none"}
              {ch.signatureFailures ? ` · ${ch.signatureFailures} MAC lỗi` : ""}
            </p>
          </Link>
        ))}
      </div>
    </ChannelShell>
  );
}
