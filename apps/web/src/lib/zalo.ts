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

export function freshZaloTimestamp(ts: string | null, skewMs = 5 * 60 * 1000) {
  if (!ts || !/^\d+$/.test(ts)) return false;
  const n = Number(ts);
  if (!Number.isFinite(n)) return false;
  const t = n < 1e12 ? n * 1000 : n;
  return Math.abs(Date.now() - t) <= skewMs;
}
