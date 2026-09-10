import { addObservation, getChannel, upsertSession, upsertTrace, updateChannel } from "./store";
import { safeEqualString } from "./crypto";
import { assertSafeForwardUrl } from "./ssrf";
import type { ObservationType } from "./types";

const FORWARD_SKIP_HEADERS = new Set([
  "host",
  "content-length",
  "authorization",
  "proxy-authorization",
  "cookie",
  "x-zevent-signature",
  "x-zevent-timestamp",
  "x-bot-api-secret-token",
  "x-fpt-token",
  "x-lark-signature",
  "x-lark-token",
  "x-lark-verification-token",
  "x-lark-request-timestamp",
  "x-lark-request-nonce",
]);

export function bearerToken(req: Request) {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const m = /^Bearer\s+(\S+)/i.exec(h.trim());
  return m?.[1] ?? null;
}

export function hasSharedWebhookSecret(secrets: Record<string, string>) {
  return ["webhookToken", "verificationToken", "encryptKey"].some((k) => Boolean(secrets[k]?.trim()));
}

export function tokenMatches(presented: string | null, ...expected: Array<string | undefined>) {
  if (!presented) return false;
  let any = false;
  let ok = false;
  for (const e of expected) {
    const v = e?.trim();
    if (!v) continue;
    any = true;
    if (safeEqualString(presented, v)) ok = true;
  }
  return any && ok;
}

function sanitizeUserId(userId: string) {
  return userId.replace(/[/%]/g, "_");
}

export async function maybeForward(projectId: string, type: string, req: Request, raw: string) {
  const ch = getChannel(projectId, type);
  if (!ch?.forwardEnabled || !ch.forwardUrl) return { forwarded: false as const };
  try {
    await assertSafeForwardUrl(ch.forwardUrl);
  } catch {
    return { forwarded: false as const };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  const start = Date.now();
  try {
    const headers = new Headers();
    req.headers.forEach((v, k) => {
      if (FORWARD_SKIP_HEADERS.has(k.toLowerCase())) return;
      headers.set(k, v);
    });
    const res = await fetch(ch.forwardUrl, {
      method: "POST",
      headers,
      body: raw,
      signal: ctrl.signal,
      redirect: "error",
    });
    return { forwarded: true as const, status: res.status, ms: Date.now() - start };
  } catch (err) {
    return {
      forwarded: true as const,
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - start,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function recordChannelEvent(opts: {
  projectId: string;
  channel: string;
  channelType: string;
  userId: string;
  name: string;
  type: ObservationType;
  input: unknown;
  output: unknown;
  metadata?: Record<string, unknown>;
  routeId?: string;
  traceName: string;
  parentTraceId?: string;
}) {
  const at = new Date().toISOString();
  const userId = sanitizeUserId(opts.userId);
  const sessionId = upsertSession(opts.projectId, opts.channel, userId, at);
  const trace = upsertTrace(opts.projectId, {
    id: opts.parentTraceId,
    name: opts.traceName,
    sessionId,
    userId,
    channel: opts.channel,
    routeId: opts.routeId ?? null,
    startTime: at,
    endTime: at,
    status: "ok",
    tags: [opts.channel],
  });
  const observation = addObservation(opts.projectId, {
    traceId: trace.id,
    type: opts.type,
    name: opts.name,
    startTime: at,
    endTime: at,
    input: opts.input,
    output: opts.output,
    metadata: opts.metadata,
  });
  updateChannel(opts.projectId, opts.channelType, { lastEventAt: at, lastError: null });
  return { trace, observation, sessionId };
}
