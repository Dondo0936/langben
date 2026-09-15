const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function hostnameOf(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  if (!first) return null;
  try {
    const url = new URL(first.includes("://") ? first : `http://${first}`);
    return url.hostname.replace(/^\[(.*)\]$/, "$1");
  } catch {
    return first.replace(/:\d+$/, "").replace(/^\[(.*)\]$/, "$1") || null;
  }
}

/** True when the operator is on the laptop UI, not a public tunnel to :43173. */
export function isLocalOperatorRequest(req: Pick<Request, "headers">): boolean {
  const host = hostnameOf(req.headers.get("host"));
  if (!host || !LOCAL_HOSTS.has(host)) return false;
  const xfHost = hostnameOf(req.headers.get("x-forwarded-host"));
  if (xfHost && !LOCAL_HOSTS.has(xfHost)) return false;
  return true;
}
