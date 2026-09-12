import { createVerify } from "node:crypto";

const CHAT_SA = "chat@system.gserviceaccount.com";

function stripSlash(s: string) {
  return s.replace(/\/$/, "");
}

function audiencesFrom(values: Array<string | undefined>) {
  const out = new Set<string>();
  for (const v of values) {
    const t = v?.trim();
    if (!t) continue;
    out.add(t);
    out.add(stripSlash(t));
    out.add(`${stripSlash(t)}/`);
  }
  return out;
}

function audMatches(aud: unknown, allowed: Set<string>) {
  const values = Array.isArray(aud) ? aud : [aud];
  return values.some((a) => typeof a === "string" && allowed.has(a));
}

/** Google Chat HTTP apps send a Bearer OIDC ID token (audience = endpoint URL) or a project-number JWT. */
export async function googleChatBearerOk(
  token: string | null,
  audiences: Array<string | undefined>,
): Promise<boolean> {
  if (!token?.trim()) return false;
  const allowed = audiencesFrom(audiences);
  if (!allowed.size) return false;
  if (await oidcTokenInfoOk(token, allowed)) return true;
  return projectNumberJwtOk(token, allowed);
}

async function oidcTokenInfoOk(token: string, allowed: Set<string>) {
  try {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(4000) },
    );
    if (!res.ok) return false;
    const p = (await res.json()) as {
      email?: string;
      email_verified?: string | boolean;
      aud?: unknown;
    };
    const verified = p.email_verified === true || p.email_verified === "true";
    return p.email === CHAT_SA && verified && audMatches(p.aud, allowed);
  } catch {
    return false;
  }
}

function b64urlJson(part: string) {
  const padded = part.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (part.length % 4)) % 4);
  return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Record<string, unknown>;
}

async function projectNumberJwtOk(token: string, allowed: Set<string>) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [h, p, s] = parts;
  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = b64urlJson(h);
    payload = b64urlJson(p);
  } catch {
    return false;
  }
  if (payload.iss !== CHAT_SA && payload.email !== CHAT_SA) return false;
  if (!audMatches(payload.aud, allowed)) return false;
  try {
    const res = await fetch(`https://www.googleapis.com/service_accounts/v1/metadata/x509/${CHAT_SA}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return false;
    const certs = (await res.json()) as Record<string, string>;
    const kid = typeof header.kid === "string" ? header.kid : "";
    const pem = (kid && certs[kid]) || Object.values(certs)[0];
    if (!pem) return false;
    const verify = createVerify("RSA-SHA256");
    verify.update(`${h}.${p}`);
    verify.end();
    const sig = Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    return verify.verify(pem, sig);
  } catch {
    return false;
  }
}
