import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { isCloud } from "./deployment";

function isPrivateIPv4(ip: string) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!m) return false;
  const oct = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (oct.some((n) => n > 255)) return false;
  const a = oct[0];
  const b = oct[1];
  if (a === 0) return true;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

function isLinkLocalOrUnspecifiedIPv4(ip: string) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a > 255 || b > 255) return false;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

function mappedIPv4(ip: string) {
  const lower = ip.toLowerCase();
  const dotted = /:ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(lower);
  if (dotted) return dotted[1];
  const hex = /:ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(lower);
  if (!hex) return null;
  const hi = parseInt(hex[1], 16);
  const lo = parseInt(hex[2], 16);
  return `${(hi >> 8) & 255}.${hi & 255}.${(lo >> 8) & 255}.${lo & 255}`;
}

function isPrivateIPv6(ip: string) {
  const mapped = mappedIPv4(ip);
  if (mapped) return isPrivateIPv4(mapped);
  const base = ip.toLowerCase().split("%")[0];
  if (base === "::1" || base === "::" || base === "0:0:0:0:0:0:0:1") return true;
  const firstGroup = base.split(":").find((g) => g.length > 0);
  const first = parseInt(firstGroup ?? "", 16);
  if (!Number.isFinite(first)) return false;
  if ((first & 0xfe00) === 0xfc00) return true;
  if ((first & 0xffc0) === 0xfe80) return true;
  return false;
}

function isMetadataIPv6(ip: string) {
  const mapped = mappedIPv4(ip);
  if (mapped) return isLinkLocalOrUnspecifiedIPv4(mapped);
  const base = ip.toLowerCase().split("%")[0];
  if (base === "::1" || base === "::") return false;
  const firstGroup = base.split(":").find((g) => g.length > 0);
  const first = parseInt(firstGroup ?? "", 16);
  if (!Number.isFinite(first)) return false;
  return (first & 0xffc0) === 0xfe80;
}

function isBlockedAddress(address: string, family?: number) {
  const v = family === 4 || family === 6 ? family : isIP(address);
  if (v === 4) return isPrivateIPv4(address);
  return isPrivateIPv6(address);
}

function isMetadataAddress(address: string, family?: number) {
  const v = family === 4 || family === 6 ? family : isIP(address);
  if (v === 4) return isLinkLocalOrUnspecifiedIPv4(address);
  return isMetadataIPv6(address);
}

function metadataHostname(host: string) {
  const h = host.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  return h === "metadata.google.internal" || h === "metadata" || h.endsWith(".metadata.google.internal");
}

function blockedHostname(host: string) {
  const h = host.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  if (metadataHostname(h)) return true;
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "internal" || h.endsWith(".internal")) return true;
  if (h === "local" || h.endsWith(".local")) return true;
  if (isIP(h) === 4) return isPrivateIPv4(h);
  if (isIP(h) === 6) return isPrivateIPv6(h);
  return false;
}

export async function assertSafeForwardUrl(url: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("invalid_forward_url");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("invalid_forward_url");
  }
  const cloud = isCloud();
  if (cloud && parsed.protocol !== "https:") {
    throw new Error("invalid_forward_url");
  }
  const host = parsed.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  if (!host) throw new Error("invalid_forward_url");
  if (metadataHostname(host)) throw new Error("invalid_forward_url");
  if (cloud && blockedHostname(host)) throw new Error("invalid_forward_url");
  if (!cloud && isIP(host) && isMetadataAddress(host)) throw new Error("invalid_forward_url");
  const records = await lookup(host, { all: true }).catch(() => null);
  if (!records?.length) throw new Error("invalid_forward_url");
  for (const rec of records) {
    if (isMetadataAddress(rec.address, rec.family)) throw new Error("invalid_forward_url");
    if (cloud && isBlockedAddress(rec.address, rec.family)) throw new Error("invalid_forward_url");
  }
}
