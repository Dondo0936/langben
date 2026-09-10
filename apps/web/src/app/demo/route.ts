import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";
import { allowPublicDemo } from "@/lib/deployment";
import { getUser } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!allowPublicDemo()) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const url = new URL("/app", req.url);
  const res = NextResponse.redirect(url);
  const epoch = getUser("usr_demo")?.sessionEpoch ?? 0;
  res.cookies.set(SESSION_COOKIE, signSession("usr_demo", epoch), sessionCookieOptions());
  return res;
}
