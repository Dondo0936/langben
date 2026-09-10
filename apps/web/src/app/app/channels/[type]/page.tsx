import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { ChannelForm } from "@/components/app/ChannelForm";
import { getLang } from "@/lib/get-lang";
import { requireConsole } from "@/lib/console";
import { getChannel } from "@/lib/store";
import { publicUrl } from "@/lib/deployment";

export const dynamic = "force-dynamic";

export default async function ChannelDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const { project } = await requireConsole();
  const channel = getChannel(project.id, type);
  if (!channel) notFound();
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <AppShell active="channels">
      <Link href="/app/channels" className="text-xs text-muted">{vi ? "← Kênh" : "← Channels"}</Link>
      <h1 className="mb-1 mt-1 text-xl font-semibold">{channel.name}</h1>
      {channel.webhookPath ? (
        <p className="mb-4 font-mono text-xs text-muted">
          {publicUrl()}
          {channel.webhookPath}
        </p>
      ) : (
        <p className="mb-4 text-sm text-muted">{vi ? "Kênh này đi SDK / OTLP, không phải webhook messenger." : "This channel is SDK / OTLP, not a messenger webhook."}</p>
      )}
      <ChannelForm channel={{ ...channel, secrets: {} }} />
    </AppShell>
  );
}
