import { NextRequest, NextResponse } from "next/server";
import { getChannel, getProject } from "@/lib/store";
import { bearerToken, recordChannelEvent, tokenMatches } from "@/lib/hooks";
import { gchatInbound } from "@/lib/messenger-inbound";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  if (!getProject(projectId)) return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  const ch = getChannel(projectId, "gchat");
  if (!ch?.enabled) return NextResponse.json({ error: "Channel disabled" }, { status: 403 });
  if (!ch.secrets.webhookToken?.trim() && !ch.secrets.verificationToken?.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!tokenMatches(bearerToken(req), ch.secrets.verificationToken, ch.secrets.webhookToken)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const inbound = gchatInbound(payload);
  const recorded = await recordChannelEvent({
    projectId,
    channel: "gchat",
    channelType: "gchat",
    userId: inbound.userId,
    name: "googlechat.inbound",
    type: "channel.inbound",
    input: payload,
    output: { text: inbound.text, space: inbound.space },
    metadata: { note: "Google Chat channel — not Vertex AI" },
    traceName: "google-chat · message",
  });
  return NextResponse.json({ ok: true, traceId: recorded.trace.id, sessionId: recorded.sessionId });
}
