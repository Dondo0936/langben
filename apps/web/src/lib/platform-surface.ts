/** Docker self-host serves Kênh / Lộ trình + ingress, not the public brochure. */

export function isPlatformSurface() {
  const surface = process.env.VET_SURFACE ?? process.env.NEXT_PUBLIC_VET_SURFACE ?? "";
  return surface === "platform";
}

export function isRetiredConsolePath(pathname: string) {
  const path = pathname.split("?")[0] || "/";
  if (path === "/app" || path === "/app/") return true;
  if (!path.startsWith("/app/")) return false;
  if (path === "/app/channels" || path.startsWith("/app/channels/")) return false;
  if (path === "/app/routes") return false;
  return true;
}

export function isPlatformPath(pathname: string) {
  const path = pathname.split("?")[0] || "/";
  if (path === "/" || path === "") return true;
  if (path === "/platform") return true;
  if (path === "/robots.txt") return true;
  if (path.startsWith("/_next/")) return true;
  if (path === "/logo.svg" || path === "/favicon.ico") return true;
  if (path === "/app/channels" || path.startsWith("/app/channels/")) return true;
  if (path === "/app/routes") return true;
  if (path.startsWith("/hooks/")) return true;
  if (path === "/api/channels" || path.startsWith("/api/channels/")) return true;
  if (path === "/api/settings") return true;
  if (path === "/api/lang") return true;
  if (path.startsWith("/otlp/")) return true;
  return false;
}

export function mapRetiredConsolePath(path: string) {
  if (path.startsWith("/app/sessions/")) return `/sessions/${path.slice("/app/sessions/".length)}`;
  if (path.startsWith("/app/traces/")) return `/traces/${path.slice("/app/traces/".length)}`;
  if (path.startsWith("/app/studio/playground")) return "/playground";
  if (path.startsWith("/app/studio/prompts")) return "/prompts";
  if (path.startsWith("/app/studio/evals")) return "/scores";
  if (path.startsWith("/app/sessions")) return "/sessions";
  if (path.startsWith("/app/traces")) return "/traces";
  if (path.startsWith("/app/observations")) return "/traces";
  if (path.startsWith("/app/settings")) return "/settings";
  return "/traces";
}
