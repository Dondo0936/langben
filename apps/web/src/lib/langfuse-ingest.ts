import type { ObservationType } from "./types";

export type LangfuseIngestEvent = {
  id: string;
  type: string;
  timestamp: string;
  body: Record<string, unknown>;
};

export function langfuseConfigured() {
  return Boolean(process.env.LANGFUSE_PUBLIC_KEY?.trim() && process.env.LANGFUSE_SECRET_KEY?.trim());
}

export function langfuseBaseUrl() {
  return (
    process.env.LANGFUSE_BASE_URL ||
    process.env.NEXT_PUBLIC_VET_CONSOLE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function eventId() {
  return crypto.randomUUID();
}

export function langfuseSessionId(channel: string, userId: string) {
  return `${channel}:${userId}`;
}

function observationEventType(type: ObservationType | string) {
  return type === "generation" ? "generation-create" : "span-create";
}

export function channelEventsToLangfuseBatch(opts: {
  traceId: string;
  observationId: string;
  parentObservationId?: string | null;
  projectId: string;
  channel: string;
  userId: string;
  name: string;
  type: ObservationType | string;
  input: unknown;
  output: unknown;
  metadata?: Record<string, unknown>;
  routeId?: string;
  traceName: string;
  startTime: string;
  endTime?: string;
  model?: string | null;
  provider?: string | null;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  } | null;
}): LangfuseIngestEvent[] {
  const timestamp = opts.startTime;
  const sessionId = langfuseSessionId(opts.channel, opts.userId);
  const vetType = opts.type;
  const metadata = {
    vet_type: vetType,
    vet_project_id: opts.projectId,
    ...(opts.routeId ? { routeId: opts.routeId } : {}),
    ...(opts.provider ? { provider: opts.provider } : {}),
    ...(opts.metadata ?? {}),
  };
  const traceEvent: LangfuseIngestEvent = {
    id: eventId(),
    type: "trace-create",
    timestamp,
    body: {
      id: opts.traceId,
      name: opts.traceName,
      userId: opts.userId,
      sessionId,
      timestamp,
      tags: [`channel:${opts.channel}`, opts.channel],
      metadata: {
        vet_channel: opts.channel,
        vet_project_id: opts.projectId,
        ...(opts.routeId ? { routeId: opts.routeId } : {}),
      },
      ...(String(vetType).includes("inbound") ? { input: opts.input } : {}),
      ...(String(vetType).includes("outbound") ? { output: opts.output } : {}),
    },
  };
  const obsBody: Record<string, unknown> = {
    id: opts.observationId,
    traceId: opts.traceId,
    name: opts.name,
    startTime: opts.startTime,
    endTime: opts.endTime ?? opts.startTime,
    input: opts.input,
    output: opts.output,
    metadata,
  };
  if (opts.parentObservationId) obsBody.parentObservationId = opts.parentObservationId;
  if (vetType === "generation") {
    if (opts.model) obsBody.model = opts.model;
    if (opts.usage && (opts.usage.inputTokens || opts.usage.outputTokens)) {
      obsBody.usageDetails = {
        input: opts.usage.inputTokens ?? 0,
        output: opts.usage.outputTokens ?? 0,
      };
    }
  }
  return [
    traceEvent,
    {
      id: eventId(),
      type: observationEventType(vetType),
      timestamp,
      body: obsBody,
    },
  ];
}

export async function ingestLangfuseBatch(batch: LangfuseIngestEvent[]): Promise<void> {
  if (!batch.length || !langfuseConfigured()) return;
  const pk = process.env.LANGFUSE_PUBLIC_KEY!.trim();
  const sk = process.env.LANGFUSE_SECRET_KEY!.trim();
  const token = Buffer.from(`${pk}:${sk}`).toString("base64");
  try {
    const res = await fetch(`${langfuseBaseUrl()}/api/public/ingestion`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${token}`,
        "x-langfuse-sdk-name": "vet-hooks",
        "x-langfuse-sdk-version": "0.1.0",
      },
      body: JSON.stringify({ batch }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok && res.status !== 207) {
      console.error("langfuse ingest", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("langfuse ingest failed", err instanceof Error ? err.message : err);
  }
}

export function legacySdkBatchToLangfuse(opts: {
  projectId: string;
  traces: Array<{
    id: string;
    name: string;
    sessionId?: string | null;
    userId?: string | null;
    channel?: string | null;
    routeId?: string | null;
    tags?: string[] | null;
    startTime: string;
    metadata?: Record<string, unknown> | null;
  }>;
  observations: Array<{
    id: string;
    traceId: string;
    parentId?: string | null;
    type: ObservationType | string;
    name: string;
    startTime: string;
    endTime?: string | null;
    input?: unknown;
    output?: unknown;
    model?: string | null;
    provider?: string | null;
    usage?: { inputTokens?: number; outputTokens?: number } | null;
    metadata?: Record<string, unknown> | null;
  }>;
}): LangfuseIngestEvent[] {
  const batch: LangfuseIngestEvent[] = [];
  for (const t of opts.traces) {
    const channel = t.channel ?? "custom";
    const timestamp = t.startTime;
    batch.push({
      id: eventId(),
      type: "trace-create",
      timestamp,
      body: {
        id: t.id,
        name: t.name,
        userId: t.userId ?? undefined,
        sessionId: t.sessionId ?? (t.userId ? langfuseSessionId(channel, t.userId) : undefined),
        timestamp,
        tags: [...(t.tags ?? []), ...(t.channel ? [`channel:${t.channel}`] : [])],
        metadata: {
          vet_project_id: opts.projectId,
          ...(t.channel ? { vet_channel: t.channel } : {}),
          ...(t.routeId ? { routeId: t.routeId } : {}),
          ...(t.metadata ?? {}),
        },
      },
    });
  }
  for (const o of opts.observations) {
    const timestamp = o.startTime;
    const isGen = o.type === "generation";
    const body: Record<string, unknown> = {
      id: o.id,
      traceId: o.traceId,
      name: o.name,
      startTime: o.startTime,
      endTime: o.endTime ?? o.startTime,
      input: o.input,
      output: o.output,
      metadata: {
        vet_type: o.type,
        ...(o.provider ? { provider: o.provider } : {}),
        ...(o.metadata ?? {}),
      },
    };
    if (o.parentId) body.parentObservationId = o.parentId;
    if (isGen) {
      if (o.model) body.model = o.model;
      if (o.usage && (o.usage.inputTokens || o.usage.outputTokens)) {
        body.usageDetails = {
          input: o.usage.inputTokens ?? 0,
          output: o.usage.outputTokens ?? 0,
        };
      }
    }
    batch.push({
      id: eventId(),
      type: isGen ? "generation-create" : "span-create",
      timestamp,
      body,
    });
  }
  return batch;
}
