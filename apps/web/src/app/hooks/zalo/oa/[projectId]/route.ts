import { NextRequest, NextResponse } from "next/server";
import { addObservation, claimWebhookReplay, getChannel, getProject } from "@/lib/store";
import { freshZaloTimestamp, verifyZaloOaSignature } from "@/lib/zalo";
import { maybeForward, recordChannelEvent } from "@/lib/hooks";
import { ingestLangfuseBatch } from "@/lib/langfuse-ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Unknown project" }, { status: 404 });

  const raw = await req.text();
  const timestamp = req.headers.get("x-zevent-timestamp") ?? req.headers.get("X-ZEvent-Timestamp");
  const signature = req.headers.get("x-zevent-signature") ?? req.headers.get("X-ZEvent-Signature");
  const ch = getChannel(projectId, "zalo_oa");
  if (!ch?.enabled) {
    return NextResponse.json({ error: "Channel disabled" }, { status: 403 });
  }
  const appId = String(ch.secrets.appId ?? "").trim();
  const oaSecret = String(ch.secrets.oaSecret ?? "").trim();
  if (!appId || !oaSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!freshZaloTimestamp(timestamp)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const ok = verifyZaloOaSignature({
    appId,
    oaSecret,
    rawBody: raw,
    timestamp,
    signature,
  });
  if (!ok) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = String(payload.event_name ?? payload.event ?? "");
  const sender = (payload.sender as { id?: string } | undefined)?.id;
  const userId = String(payload.user_id_by_app ?? sender ?? payload.user_id ?? "unknown");
  const message = payload.message as { text?: string; msg_id?: string } | undefined;
  const isOutbound = eventName.startsWith("oa_send");
  const msgId = String(message?.msg_id ?? payload.msg_id ?? "");
  const replayKey = msgId
    ? `${projectId}:zalo_oa:${timestamp}:${signature}:${msgId}`
    : `${projectId}:zalo_oa:${timestamp}:${signature}`;
  if (!claimWebhookReplay(replayKey)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const recorded = await recordChannelEvent({
    projectId,
    channel: "zalo_oa",
    channelType: "zalo_oa",
    userId,
    name: isOutbound ? "zalo.outbound" : "zalo.inbound",
    type: isOutbound ? "channel.outbound" : "channel.inbound",
    input: payload,
    output: { event_name: eventName, msg_id: message?.msg_id },
    metadata: { msg_id: message?.msg_id, quote_msg_id: (payload as { quote_msg_id?: string }).quote_msg_id },
    routeId: "rt_zalo_fpt_claude",
    traceName: `zalo-oa · ${eventName || (isOutbound ? "outbound" : "inbound")}`,
  });

  const fwd = await maybeForward(projectId, "zalo_oa", req, raw);
  if (fwd.forwarded) {
    const at = new Date().toISOString();
    const forwarded = addObservation(projectId, {
      traceId: recorded.trace.id,
      parentId: recorded.observation.id,
      type: "span",
      name: "zalo.forward",
      status: "error" in fwd && fwd.error ? "error" : "ok",
      input: { url: ch.forwardUrl },
      output: fwd,
    });
    await ingestLangfuseBatch([
      {
        id: crypto.randomUUID(),
        type: "span-create",
        timestamp: at,
        body: {
          id: forwarded.id,
          traceId: recorded.trace.id,
          parentObservationId: recorded.observation.id,
          name: "zalo.forward",
          startTime: at,
          endTime: at,
          input: { url: ch.forwardUrl },
          output: fwd,
          metadata: { vet_type: "span" },
        },
      },
    ]);
  }

  return NextResponse.json({ ok: true, traceId: recorded.trace.id, sessionId: recorded.sessionId });
}
