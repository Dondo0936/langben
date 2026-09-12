import { NextRequest, NextResponse } from "next/server";
import { ingestBatchSchema } from "@vet/schema";
import { projectFromRequest } from "@/lib/ingest-auth";
import { addObservation, getTrace, upsertTrace } from "@/lib/store";
import { ingestLangfuseBatch, legacySdkBatchToLangfuse } from "@/lib/langfuse-ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const project = projectFromRequest(req);
  if (!project) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = ingestBatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const traces = (parsed.data.traces ?? []).map((t) =>
    upsertTrace(project.id, {
      id: t.id,
      name: t.name,
      sessionId: t.sessionId,
      userId: t.userId,
      channel: t.channel,
      routeId: t.routeId,
      release: t.release,
      environment: t.environment,
      tags: t.tags,
      startTime: t.startTime,
      endTime: t.endTime,
      status: t.status,
      metadata: t.metadata,
    }),
  );
  const observations = (parsed.data.observations ?? []).map((o) => {
    if (!getTrace(project.id, o.traceId)) {
      upsertTrace(project.id, {
        id: o.traceId,
        name: o.name,
        startTime: o.startTime,
        status: o.status,
      });
    }
    return addObservation(project.id, {
      id: o.id,
      traceId: o.traceId,
      parentId: o.parentId,
      type: o.type,
      name: o.name,
      startTime: o.startTime,
      endTime: o.endTime,
      status: o.status,
      input: o.input,
      output: o.output,
      model: o.model,
      provider: o.provider,
      region: o.region,
      usage: o.usage,
      metadata: o.metadata,
    });
  });
  await ingestLangfuseBatch(
    legacySdkBatchToLangfuse({
      projectId: project.id,
      traces,
      observations,
    }),
  );
  return NextResponse.json({ traces: traces.length, observations: observations.length });
}
