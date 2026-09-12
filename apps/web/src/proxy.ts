import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consoleProjectUrl } from "./lib/console-target";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/app/channels" || path.startsWith("/app/channels/") || path === "/app/routes") {
    return NextResponse.next();
  }
  return NextResponse.redirect(consoleProjectUrl(mapRetiredPath(path)));
}

function mapRetiredPath(path: string) {
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

export const config = {
  matcher: ["/app", "/app/:path*"],
};
