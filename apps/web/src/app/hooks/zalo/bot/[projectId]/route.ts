import { NextRequest, NextResponse } from "next/server";
import { getChannel, getProject } from "@/lib/store";
import { isZaloBotPing } from "@/lib/zalo";
import { maybeForward, recordChannelEvent, tokenMatches } from "@/lib/hooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  const ch = getChannel(projectId, "zalo_bot");
  if (!ch?.enabled) return NextResponse.json({ error: "Channel disabled" }, { status: 403 });
  const token = req.headers.get("x-bot-api-secret-token");
  if (!tokenMatches(token, ch.secrets.botToken, ch.secrets.webhookToken)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const raw = await req.text();
  if (!raw.trim()) {
    return NextResponse.json({ ok: true });
  }
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (isZaloBotPing(payload)) {
    return NextResponse.json({ ok: true });
  }
  const event = String(payload.event_name ?? payload.event ?? "message.text.received");
  const userId = String((payload.sender as { id?: string } | undefined)?.id ?? "unknown");
  const recorded = await recordChannelEvent({
    projectId,
    channel: "zalo_bot",
    channelType: "zalo_bot",
    userId,
    name: event.includes("send") ? "zalo.outbound" : "zalo.inbound",
    type: event.includes("send") ? "channel.outbound" : "channel.inbound",
    input: payload,
    output: { event },
    traceName: `zalo-bot · ${event}`,
  });
  await maybeForward(projectId, "zalo_bot", req, raw);
  return NextResponse.json({ ok: true, traceId: recorded.trace.id, sessionId: recorded.sessionId });
}
