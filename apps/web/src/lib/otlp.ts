import { addObservation, upsertTrace } from "./store";

type OtlpSpan = {
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  name?: string;
  startTimeUnixNano?: string | number;
  endTimeUnixNano?: string | number;
  attributes?: Array<{ key?: string; value?: { stringValue?: string; intValue?: string } }>;
  status?: { code?: number | string };
};

function isoFromMs(ms: number, fallback: string | null) {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString();
}

function nanoToIso(n: string | number | undefined) {
  if (n == null || n === "") return new Date().toISOString();
  const num = Number(n);
  if (!Number.isFinite(num)) return new Date().toISOString();
  return isoFromMs(num / 1e6, new Date().toISOString()) as string;
}

function endTimeFromNano(n: string | number | undefined): string | null {
  if (n == null || n === "") return null;
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  return isoFromMs(num / 1e6, null);
}

function isOtlpError(status: OtlpSpan["status"]) {
  const code = status?.code;
  return code === 2 || code === "2" || code === "STATUS_CODE_ERROR";
}

function attrMap(attrs: OtlpSpan["attributes"]) {
  const out: Record<string, string> = {};
  for (const a of attrs ?? []) {
    if (!a?.key) continue;
    out[a.key] = a.value?.stringValue ?? a.value?.intValue ?? "";
  }
  return out;
}

export function ingestOtlpJson(projectId: string, body: unknown) {
  const resourceSpans = (body as { resourceSpans?: Array<{ scopeSpans?: Array<{ spans?: OtlpSpan[] }> }> })
    ?.resourceSpans ?? [];
  let count = 0;
  for (const rs of resourceSpans) {
    for (const scope of rs.scopeSpans ?? []) {
      for (const span of scope.spans ?? []) {
        const hex = (span.traceId || crypto.randomUUID()).replace(/[^a-fA-F0-9]/g, "");
        const traceId = `tr_${hex.slice(0, 32)}`;
        const attrs = attrMap(span.attributes);
        const status = isOtlpError(span.status) ? "error" : "ok";
        const endTime = endTimeFromNano(span.endTimeUnixNano);
        upsertTrace(projectId, {
          id: traceId,
          name: span.name || attrs["vet.trace_name"] || "otlp.span",
          channel: attrs["vet.channel"] || attrs["channel"] || null,
          userId: attrs["enduser.id"] || attrs["user.id"] || null,
          sessionId: attrs["session.id"] || undefined,
          startTime: nanoToIso(span.startTimeUnixNano),
          endTime,
          status,
          metadata: { otlp: true, ...attrs },
        });
        addObservation(projectId, {
          id: span.spanId ? `obs_${span.spanId.slice(0, 16)}` : undefined,
          traceId,
          parentId: span.parentSpanId ? `obs_${span.parentSpanId.slice(0, 16)}` : null,
          type: "span",
          name: span.name || "span",
          startTime: nanoToIso(span.startTimeUnixNano),
          endTime,
          status,
          metadata: attrs,
        });
        count += 1;
      }
    }
  }
  return { spans: count };
}
