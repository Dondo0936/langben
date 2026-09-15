import { NextRequest, NextResponse } from "next/server";
import { getChannel, getProject } from "@/lib/store";
import { bearerToken, hasSharedWebhookSecret, recordChannelEvent, tokenMatches } from "@/lib/hooks";
import { safeEqualHex, sha256Hex } from "@/lib/crypto";
import { unwrapLarkPayload } from "@/lib/lark-crypto";
import { larkInbound } from "@/lib/messenger-inbound";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function larkSignatureOk(req: Request, raw: string, encryptKey: string | undefined) {
  const key = encryptKey?.trim();
  const sig = req.headers.get("x-lark-signature");
  const ts = req.headers.get("x-lark-request-timestamp");
  const nonce = req.headers.get("x-lark-request-nonce");
  if (!key || !sig || !ts || !nonce) return false;
  const mac = sha256Hex(`${ts}${nonce}${key}${raw}`);
  const presented = sig.toLowerCase().replace(/^sha256=/, "");
  return safeEqualHex(mac.toLowerCase(), presented);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  if (!getProject(projectId)) return NextResponse.json({ error: "Unknown project" }, { status: 404 });
  const ch = getChannel(projectId, "lark");
  if (!ch?.enabled) return NextResponse.json({ error: "Channel disabled" }, { status: 403 });
  if (!hasSharedWebhookSecret(ch.secrets)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.text();
  let parsed: Record<string, unknown> = {};
  try {
    parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = unwrapLarkPayload(parsed, ch.secrets.encryptKey);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "encrypted") {
      return NextResponse.json({ error: "Encrypt key required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Invalid ciphertext" }, { status: 400 });
  }

  const headerObj = payload.header as { token?: string } | undefined;
  const bodyToken =
    (typeof payload.token === "string" && payload.token) ||
    (typeof headerObj?.token === "string" && headerObj.token) ||
    "";

  if (payload.challenge || payload.type === "url_verification") {
    if (!tokenMatches(bodyToken, ch.secrets.verificationToken, ch.secrets.webhookToken)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ challenge: payload.challenge });
  }

  const headerToken =
    bearerToken(req) ?? req.headers.get("x-lark-token") ?? req.headers.get("x-lark-verification-token");
  const tokenOk =
    tokenMatches(headerToken, ch.secrets.webhookToken, ch.secrets.verificationToken) ||
    tokenMatches(bodyToken, ch.secrets.webhookToken, ch.secrets.verificationToken);
  const sigOk = larkSignatureOk(req, raw, ch.secrets.encryptKey);
  if (!tokenOk && !sigOk) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const inbound = larkInbound(payload);
  const recorded = await recordChannelEvent({
    projectId,
    channel: "lark",
    channelType: "lark",
    userId: inbound.userId,
    name: "lark.inbound",
    type: "channel.inbound",
    input: payload,
    output: { text: inbound.text },
    traceName: "lark · im.message.receive_v1",
    routeId: "rt_lark",
  });
  return NextResponse.json({ ok: true, traceId: recorded.trace.id, sessionId: recorded.sessionId });
}
