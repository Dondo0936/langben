import { NextResponse } from "next/server";
import { cloudSelfServe, isCloud } from "@/lib/deployment";
import { addOrg, createProjectForOrg, createUser, getUserByEmail } from "@/lib/store";
import { hashPassword } from "@/lib/crypto";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (isCloud() && !cloudSelfServe()) {
    return NextResponse.json(
      { error: "Vết Cloud signup is not open yet. Self-host the MIT build.", comingSoon: true },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
    name?: string;
    org?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";
  const name = body?.name?.trim() || email.split("@")[0];
  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Email và mật khẩu (tối thiểu 8 ký tự) là bắt buộc." }, { status: 400 });
  }
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "Email đã được dùng." }, { status: 409 });
  }
  const orgId = `org_${crypto.randomUUID().slice(0, 8)}`;
  const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
  const org = addOrg({
    id: orgId,
    name: body?.org?.trim() || name,
    plan: "hobby",
    teamsAddon: false,
    region: "ap-southeast-1",
    createdAt: new Date().toISOString(),
  });
  const user = createUser({
    id: userId,
    email,
    name,
    passwordHash: hashPassword(password),
    orgId,
    sessionEpoch: 0,
  });
  const { project, secretKey } = createProjectForOrg({ id: org.id, name: org.name });
  const res = NextResponse.json({
    ok: true,
    deployment: isCloud() ? "cloud" : "self-host",
    ...(isCloud() ? { plan: "hobby" as const } : {}),
    ingest: { publicKey: project.publicKey, secretKey },
  });
  res.cookies.set(SESSION_COOKIE, signSession(user.id, 0), sessionCookieOptions());
  return res;
}
