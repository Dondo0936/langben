import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/store";
import { verifyPassword } from "@/lib/crypto";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Sai email hoặc mật khẩu." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  res.cookies.set(SESSION_COOKIE, signSession(user.id, user.sessionEpoch ?? 0), sessionCookieOptions());
  return res;
}
