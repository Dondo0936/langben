import { sha256Hex, safeEqualHex } from "./crypto";

/** Zalo OA: mac = sha256(appId + data + timestamp + OA secret) */
export function verifyZaloOaSignature(opts: {
  appId: string;
  oaSecret: string;
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
}) {
  if (!opts.oaSecret || !opts.appId) return false;
  if (!opts.signature || !opts.timestamp) return false;
  const mac = sha256Hex(`${opts.appId}${opts.rawBody}${opts.timestamp}${opts.oaSecret}`);
  return safeEqualHex(mac.toLowerCase(), opts.signature.toLowerCase());
}

export function verifyZaloBotToken(header: string | null, expected: string) {
  if (!header || !expected) return false;
  return safeEqualHex(sha256Hex(header), sha256Hex(expected));
}

/** Live Bot Platform events use message.from / message.chat, not OA's sender.id. */
export function zaloBotUserId(payload: Record<string, unknown>) {
  const sender = payload.sender as { id?: string } | undefined;
  const message = payload.message as
    | { from?: { id?: string }; chat?: { id?: string } }
    | undefined;
  return String(
    sender?.id ?? message?.from?.id ?? message?.chat?.id ?? payload.user_id ?? "unknown",
  );
}

/** Zalo POSTs a probe when you save Webhook URL. Do not turn that into a session. */
export function isZaloBotPing(payload: Record<string, unknown>) {
  const event = String(payload.event_name ?? payload.event ?? "").trim();
  if (/received|send/i.test(event)) return false;
  if (zaloBotUserId(payload) !== "unknown") return false;
  if (payload.message) return false;
  return true;
}

export function freshZaloTimestamp(ts: string | null, skewMs = 5 * 60 * 1000) {
  if (!ts || !/^\d+$/.test(ts)) return false;
  const n = Number(ts);
  if (!Number.isFinite(n)) return false;
  const t = n < 1e12 ? n * 1000 : n;
  return Math.abs(Date.now() - t) <= skewMs;
}
