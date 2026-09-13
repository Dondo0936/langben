import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { ensureOrgProject, getOrg, getProject, listProjects } from "./store";
import { isCloud } from "./deployment";
import type { Organization, Project, User } from "./types";

const DEMO_PROJECT = "prj-vet-demo";

export async function requireConsole(): Promise<{ user: User; project: Project; org: Organization | null }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const created = ensureOrgProject(user.orgId);
  if (!created) redirect("/login");
  return { user, project: created.project, org: getOrg(user.orgId) };
}

function requestedProjectFrom(requestedProjectId?: string | null): Project | null {
  const requested = requestedProjectId?.trim() || null;
  return requested ? getProject(requested) : null;
}

async function resolveChannelContext(requestedProjectId?: string | null): Promise<{
  user: User | null;
  project: Project | null;
  org: Organization | null;
}> {
  const requestedProject = requestedProjectFrom(requestedProjectId);
  const user = await getCurrentUser();
  if (user) {
    const created = ensureOrgProject(user.orgId);
    if (created) {
      if (requestedProject && requestedProject.orgId === user.orgId) {
        return { user, project: requestedProject, org: getOrg(user.orgId) };
      }
      return { user, project: created.project, org: getOrg(user.orgId) };
    }
  }
  if (isCloud()) {
    return { user: null, project: null, org: null };
  }
  const project = requestedProject ?? getProject(DEMO_PROJECT) ?? listProjects()[0] ?? null;
  if (!project) return { user: null, project: null, org: null };
  return { user: null, project, org: getOrg(project.orgId) };
}

function projectIdFromRequest(req?: Request): string | null {
  if (!req) return null;
  try {
    return new URL(req.url).searchParams.get("project");
  } catch {
    return null;
  }
}

/** Kênh / Lộ trình stay on marketing. Self-host embed does not need vet_session. */
export async function requireChannelConsole(requestedProjectId?: string | null): Promise<{
  user: User | null;
  project: Project;
  org: Organization | null;
}> {
  const ctx = await resolveChannelContext(requestedProjectId);
  if (!ctx.project) redirect("/login");
  return { user: ctx.user, project: ctx.project, org: ctx.org };
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

export async function requireChannelApi(req?: Request) {
  const ctx = await resolveChannelContext(projectIdFromRequest(req));
  if (!ctx.project) {
    if (isCloud()) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as NextResponse };
    }
    return { error: NextResponse.json({ error: "No project" }, { status: 403 }) as NextResponse };
  }
  return { user: ctx.user, project: ctx.project, org: ctx.org };
}

export function requestLang(req: Request): "vi" | "en" {
  const cookie = req.headers.get("cookie") ?? "";
  return /(?:^|;\s*)vet_lang=en(?:;|$)/.test(cookie) ? "en" : "vi";
}
