import { notFound } from "next/navigation";
import Link from "next/link";
import { ChannelForm } from "@/components/app/ChannelForm";
import { ChannelShell } from "@/components/app/ChannelShell";
import { CopyHookUrl } from "@/components/app/CopyHookUrl";
import { getLang } from "@/lib/get-lang";
import { requireChannelConsole } from "@/lib/console";
import { getChannel, getWebhookOrigin } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ChannelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ embed?: string; project?: string }>;
}) {
  const { type } = await params;
  const { embed, project: projectParam } = await searchParams;
  const embedded = embed === "1";
  const { project } = await requireChannelConsole(projectParam);
  const channel = getChannel(project.id, type);
  if (!channel) notFound();
  const lang = await getLang();
  const vi = lang === "vi";
  const backQs = new URLSearchParams();
  if (embedded) backQs.set("embed", "1");
  if (project.id) backQs.set("project", project.id);
  const back = `/app/channels${backQs.toString() ? `?${backQs.toString()}` : ""}`;
  return (
    <ChannelShell embed={embedded} title={channel.name}>
      <Link href={back} className="text-xs text-muted hover:text-ink">
        {vi ? "← Kênh" : "← Channels"}
      </Link>
      <h1 className="mb-1 mt-1 text-lg font-semibold">{channel.name}</h1>
      {channel.webhookPath ? (
        <CopyHookUrl
          path={channel.webhookPath}
          origin={getWebhookOrigin()}
          requireHttps={channel.type === "zalo_bot"}
          projectId={project.id}
        />
      ) : (
        <p className="mb-4 text-sm text-muted">
          {vi ? "Kênh này đi SDK / OTLP, không phải webhook messenger." : "This channel is SDK / OTLP, not a messenger webhook."}
        </p>
      )}
      <ChannelForm channel={{ ...channel, secrets: {} }} />
    </ChannelShell>
  );
}
