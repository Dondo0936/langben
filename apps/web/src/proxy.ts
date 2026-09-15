import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consoleProjectUrl, consoleSignInUrl } from "./lib/console-target";
import {
  isPlatformPath,
  isPlatformSurface,
  isRetiredConsolePath,
  mapRetiredConsolePath,
} from "./lib/platform-surface";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (isRetiredConsolePath(path)) {
    return NextResponse.redirect(consoleProjectUrl(mapRetiredConsolePath(path)));
  }

  if (!isPlatformSurface()) {
    return NextResponse.next();
  }

  if (path === "/" || path === "") {
    const url = request.nextUrl.clone();
    url.pathname = "/platform";
    return NextResponse.rewrite(url);
  }

  if (path === "/login" || path === "/signup" || path === "/demo") {
    return NextResponse.redirect(consoleSignInUrl());
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
