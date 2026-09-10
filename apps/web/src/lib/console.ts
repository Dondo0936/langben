import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { ensureOrgProject, getOrg } from "./store";
import type { Organization, Project, User } from "./types";

export async function requireConsole(): Promise<{ user: User; project: Project; org: Organization | null }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const created = ensureOrgProject(user.orgId);
  if (!created) redirect("/login");
  return { user, project: created.project, org: getOrg(user.orgId) };
}

export async function requireApiSession() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as NextResponse };
  }
  const created = ensureOrgProject(user.orgId);
  if (!created) {
    return { error: NextResponse.json({ error: "No project" }, { status: 403 }) as NextResponse };
  }
  return { user, project: created.project, org: getOrg(user.orgId) };
}

export function requestLang(req: Request): "vi" | "en" {
  const cookie = req.headers.get("cookie") ?? "";
  return /(?:^|;\s*)vet_lang=en(?:;|$)/.test(cookie) ? "en" : "vi";
}
