import { NextResponse } from "next/server";
import { getCurrentUser, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { bumpSessionEpoch } from "@/lib/store";

export async function POST() {
  const user = await getCurrentUser();
  if (user) bumpSessionEpoch(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
