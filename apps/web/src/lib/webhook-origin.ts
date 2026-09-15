/** Origin operators paste into Zalo / Lark / Chat. Not the loopback Gửi thử URL. */

export function normalizeWebhookOrigin(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProto = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProto);
  } catch {
    throw new Error("invalid_webhook_origin");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("invalid_webhook_origin");
  }
  if (!url.hostname) throw new Error("invalid_webhook_origin");
  return `${url.protocol}//${url.host}`;
}

export function envHttpsOrigin(envPublicUrl: string): string | null {
  const origin = envPublicUrl.replace(/\/$/, "");
  if (/^https:\/\//i.test(origin)) return origin;
  return null;
}

/** Env https is only a default until the operator saves or clears origin. */
export function resolveWebhookOrigin(
  store: { webhookOrigin?: string | null },
  envPublicUrl: string,
): string | null {
  if (Object.prototype.hasOwnProperty.call(store, "webhookOrigin")) {
    return (store.webhookOrigin ?? "").trim() || null;
  }
  return envHttpsOrigin(envPublicUrl);
}

export function hookUrl(origin: string | null, path: string) {
  if (!origin || !path) return null;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
