import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { ensureOrgProject, getOrg, getProject, listProjects } from "./store";
import { isCloud } from "./deployment";
import type { Organization, Project, User } from "./types";

const DEMO_PROJECT = "prj_demo";

export async function requireConsole(): Promise<{ user: User; project: Project; org: Organization | null }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const created = ensureOrgProject(user.orgId);
  if (!created) redirect("/login");
  return { user, project: created.project, org: getOrg(user.orgId) };
}

/** Kênh / Lộ trình stay on marketing. Self-host embed does not need vet_session. */
export async function requireChannelConsole(): Promise<{
  user: User | null;
  project: Project;
  org: Organization | null;
}> {
  const user = await getCurrentUser();
  if (user) {
    const created = ensureOrgProject(user.orgId);
    if (created) return { user, project: created.project, org: getOrg(user.orgId) };
  }
  if (isCloud()) redirect("/login");
  const project = getProject(DEMO_PROJECT) ?? listProjects()[0];
  if (!project) redirect("/login");
  return { user: null, project, org: getOrg(project.orgId) };
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

export async function requireChannelApi() {
  const user = await getCurrentUser();
  if (user) {
    const created = ensureOrgProject(user.orgId);
    if (created) return { user, project: created.project, org: getOrg(user.orgId) };
  }
  if (isCloud()) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as NextResponse };
  }
  const project = getProject(DEMO_PROJECT) ?? listProjects()[0];
  if (!project) {
    return { error: NextResponse.json({ error: "No project" }, { status: 403 }) as NextResponse };
  }
  return { user: null, project, org: getOrg(project.orgId) };
}

export function requestLang(req: Request): "vi" | "en" {
  const cookie = req.headers.get("cookie") ?? "";
  return /(?:^|;\s*)vet_lang=en(?:;|$)/.test(cookie) ? "en" : "vi";
}
