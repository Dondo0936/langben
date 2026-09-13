import { NextRequest, NextResponse } from "next/server";
import { requireChannelApi } from "@/lib/console";
import { getChannel } from "@/lib/store";
import { consoleProjectId } from "@/lib/console-target";
import { buildChannelTestCalls, canSendChannelTest } from "@/lib/messenger-test";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireChannelApi();
  if ("error" in auth) return auth.error;
  const body = (await req.json().catch(() => null)) as { type?: string } | null;
  const type = body?.type;
  if (!type || !canSendChannelTest(type)) {
    return NextResponse.json({ error: "Unsupported channel" }, { status: 400 });
  }
  const ch = getChannel(auth.project.id, type);
  if (!ch?.enabled) return NextResponse.json({ error: "Channel disabled" }, { status: 403 });
  if (!ch.webhookPath) {
    return NextResponse.json({ error: "No webhook on this channel" }, { status: 400 });
  }
  const calls = buildChannelTestCalls(ch, auth.project.id);
  if (!calls.length) return NextResponse.json({ error: "No test payload" }, { status: 400 });

  const steps: Array<{ label: string; status: number; body: unknown }> = [];
  for (const call of calls) {
    const res = await fetch(call.url, {
      method: "POST",
      headers: call.headers,
      body: call.body,
    });
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      /* keep text */
    }
    steps.push({ label: call.label, status: res.status, body: parsed });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Test ${call.label} failed`, steps },
        { status: res.status },
      );
    }
  }
  const last = steps[steps.length - 1]?.body as {
    traceId?: string;
    sessionId?: string;
    challenge?: string;
  } | null;
  const consoleBase = (
    process.env.NEXT_PUBLIC_VET_CONSOLE_URL ||
    process.env.VET_CONSOLE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  const sessionId = last && typeof last === "object" ? last.sessionId : undefined;
  return NextResponse.json({
    ok: true,
    steps,
    traceId: last && typeof last === "object" ? last.traceId : undefined,
    sessionId,
    sessionUrl: sessionId
      ? `${consoleBase}/project/${consoleProjectId()}/sessions/${encodeURIComponent(sessionId)}`
      : undefined,
  });
}
