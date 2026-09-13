import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/console";
import { addObservation, upsertTrace } from "@/lib/store";

export const dynamic = "force-dynamic";

const g = globalThis as typeof globalThis & { __vetPlaygroundHits?: Map<string, number[]> };

function playgroundAllowed(userId: string, limit = 20, windowMs = 60_000) {
  g.__vetPlaygroundHits ??= new Map();
  const now = Date.now();
  const recent = (g.__vetPlaygroundHits.get(userId) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    g.__vetPlaygroundHits.set(userId, recent);
    return false;
  }
  recent.push(now);
  g.__vetPlaygroundHits.set(userId, recent);
  return true;
}

export async function POST(req: Request) {
  const auth = await requireApiSession();
  if ("error" in auth) return auth.error;
  if (!playgroundAllowed(auth.user.id)) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu. Thử lại sau." }, { status: 429 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Chưa có ANTHROPIC_API_KEY. Playground vẫn ghi vết mẫu. Thêm khóa vào môi trường để gọi model thật.",
        degraded: true,
      },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => null)) as {
    provider?: string;
    model?: string;
    message?: string;
  } | null;
  const project = auth.project;
  const start = new Date().toISOString();
  const trace = upsertTrace(project.id, {
    name: "playground.chat",
    environment: "default",
    tags: ["playground"],
    startTime: start,
    status: "unset",
    metadata: { provider: body?.provider ?? "anthropic" },
  });
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: body?.model || "claude-sonnet-4-5",
      max_tokens: 256,
      messages: [{ role: "user", content: body?.message || "Xin chào" }],
    }),
  });
  const json = await res.json().catch(() => null);
  const end = new Date().toISOString();
  addObservation(project.id, {
    traceId: trace.id,
    type: "generation",
    name: "playground.chat",
    startTime: start,
    endTime: end,
    status: res.ok ? "ok" : "error",
    provider: "anthropic",
    model: body?.model || "claude-sonnet-4-5",
    input: { message: body?.message },
    output: json,
  });
  upsertTrace(project.id, { id: trace.id, name: "playground.chat", endTime: end, status: res.ok ? "ok" : "error" });
  return NextResponse.json({ traceId: trace.id, response: json }, { status: res.ok ? 200 : 502 });
}
