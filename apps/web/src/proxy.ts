import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consoleProjectUrl, consoleSignInUrl } from "./lib/console-target";
import {
  isPlatformPath,
  isPlatformSurface,
  isRetiredConsolePath,
  mapRetiredConsolePath,
} from "./lib/platform-surface";

function redirectTo(request: NextRequest, dest: string) {
  if (dest.startsWith("http://") || dest.startsWith("https://")) {
    return NextResponse.redirect(dest);
  }
  return NextResponse.redirect(new URL(dest, request.url));
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!isPlatformSurface()) {
    if (path === "/app" || path.startsWith("/app/")) {
      return redirectTo(request, "/self-host");
    }
    return NextResponse.next();
  }

  if (isRetiredConsolePath(path)) {
    return redirectTo(request, consoleProjectUrl(mapRetiredConsolePath(path)));
  }

  if (path === "/" || path === "") {
    const url = request.nextUrl.clone();
    url.pathname = "/platform";
    return NextResponse.rewrite(url);
  }

  if (path === "/login" || path === "/signup" || path === "/demo") {
    return redirectTo(request, consoleSignInUrl());
  }

  if (isPlatformPath(path)) {
    return NextResponse.next();
  }

  return new NextResponse("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
