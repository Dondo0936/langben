import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/console";
import { getChannel, listChannels, updateChannel } from "@/lib/store";
import { assertSafeForwardUrl } from "@/lib/ssrf";
import type { ChannelConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

function looksRedacted(value: string) {
  const v = value.trim();
  if (!v) return true;
  if (/^[•*]+$/.test(v)) return true;
  const lower = v.toLowerCase();
  return lower === "redacted" || v === "[redacted]";
}

function mergeSecrets(existing: Record<string, string>, incoming?: Record<string, string>) {
  if (!incoming) return existing;
  const next = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    if (typeof value !== "string" || looksRedacted(value)) continue;
    next[key] = value;
  }
  return next;
}

function publicChannel(ch: ChannelConfig) {
  return { ...ch, secrets: {} as Record<string, string> };
}

export async function GET() {
  const auth = await requireApiSession();
  if ("error" in auth) return auth.error;
  return NextResponse.json({ channels: listChannels(auth.project.id).map(publicChannel) });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireApiSession();
  if ("error" in auth) return auth.error;
  const project = auth.project;
  const body = (await req.json().catch(() => null)) as {
    type?: string;
    forwardUrl?: string | null;
    forwardEnabled?: boolean;
    enabled?: boolean;
    secrets?: Record<string, string>;
  } | null;
  if (!body?.type) return NextResponse.json({ error: "type required" }, { status: 400 });
  const existing = getChannel(project.id, body.type);
  if (!existing) return NextResponse.json({ error: "Unknown channel" }, { status: 404 });
  if (typeof body.forwardUrl === "string" && body.forwardUrl) {
    try {
      await assertSafeForwardUrl(body.forwardUrl);
    } catch {
      return NextResponse.json({ error: "Unsafe forward URL" }, { status: 400 });
    }
  }
  const updated = updateChannel(project.id, body.type, {
    forwardUrl: body.forwardUrl === undefined ? existing.forwardUrl : body.forwardUrl,
    forwardEnabled: body.forwardEnabled ?? existing.forwardEnabled,
    enabled: body.enabled ?? existing.enabled,
    secrets: mergeSecrets(existing.secrets, body.secrets),
  });
  if (!updated) return NextResponse.json({ error: "Unknown channel" }, { status: 404 });
  return NextResponse.json({ channel: publicChannel(updated) });
}
