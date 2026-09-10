import { NextRequest, NextResponse } from "next/server";
import { getChannel, getProject } from "@/lib/store";
import { bearerToken, recordChannelEvent, tokenMatches } from "@/lib/hooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  if (!getProject(projectId)) return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  const ch = getChannel(projectId, "fpt");
  if (!ch?.enabled) return NextResponse.json({ error: "Channel disabled" }, { status: 403 });
  if (!ch.secrets.webhookToken?.trim() && !ch.secrets.verificationToken?.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const presented = req.headers.get("x-fpt-token") ?? bearerToken(req);
  if (!tokenMatches(presented, ch.secrets.webhookToken, ch.secrets.verificationToken)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const senderId = String(payload.sender_id ?? payload.senderId ?? "unknown");
  const recorded = recordChannelEvent({
    projectId,
    channel: "zalo_oa",
    channelType: "fpt",
    userId: senderId,
    name: "fpt.webhook",
    type: "nlu",
    input: payload,
    output: payload.messages ?? payload,
    metadata: { route: "fpt-conversation", broker_id: payload.broker_id },
    routeId: "rt_zalo_fpt_claude",
    traceName: "fpt-conversation · webhook",
  });
  return NextResponse.json({ ok: true, traceId: recorded.trace.id, sessionId: recorded.sessionId });
}
