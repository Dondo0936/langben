import { api } from "@/src/utils/api";

function textOf(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return textOf(JSON.parse(trimmed));
      } catch {
        return value.length > 240 ? `${value.slice(0, 240)}…` : value;
      }
    }
    return value;
  }
  if (typeof value === "object") {
    const rec = value as Record<string, unknown>;
    if (typeof rec.text === "string") return rec.text;
    const msg = rec.message as { text?: string } | undefined;
    if (typeof msg?.text === "string") return msg.text;
    if (typeof rec.intent === "string") {
      const conf = rec.confidence != null ? ` · ${rec.confidence}` : "";
      return `intent = ${rec.intent}${conf}`;
    }
    try {
      const s = JSON.stringify(value);
      return s.length > 240 ? `${s.slice(0, 240)}…` : s;
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function who(name: string | null | undefined, type: string | null | undefined) {
  const n = `${name ?? ""} ${type ?? ""}`.toLowerCase();
  if (n.includes("inbound") || n.includes("channel.inbound")) return "khách";
  if (n.includes("outbound") || n.includes("channel.outbound")) return "bot";
  if (n.includes("nlu") || n.includes("fpt")) return "NLU";
  if (n.includes("generation") || n.includes("anthropic") || n.includes("llm"))
    return "LLM";
  if (n.includes("asr") || n.includes("tts") || n.includes("speech")) return "speech";
  return name ?? type ?? "span";
}

function Bubble({
  id,
  label,
  name,
  text,
}: {
  id: string;
  label: string;
  name?: string | null;
  text: string;
}) {
  if (!text) return null;
  return (
    <div key={id} className="rounded-md bg-muted/50 px-2.5 py-1.5 text-sm">
      <div className="mb-0.5 flex gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        {name ? <span className="font-mono">{name}</span> : null}
      </div>
      {text}
    </div>
  );
}

function ObservationLine({
  projectId,
  traceId,
  observationId,
  name,
  type,
}: {
  projectId: string;
  traceId: string;
  observationId: string;
  name?: string | null;
  type?: string | null;
}) {
  const obs = api.observations.byId.useQuery({
    observationId,
    traceId,
    projectId,
    verbosity: "truncated",
  });
  const text = textOf(obs.data?.output) || textOf(obs.data?.input);
  return <Bubble id={observationId} label={who(name, type)} name={name} text={text} />;
}

function TraceTurns({
  projectId,
  sessionId,
  traceId,
}: {
  projectId: string;
  sessionId: string;
  traceId: string;
}) {
  const events = api.sessions.observationsForTraceFromEvents.useQuery({
    projectId,
    sessionId,
    traceId,
    filter: null,
  });
  const withObs = api.traces.byIdWithObservationsAndScores.useQuery({
    traceId,
    projectId,
  });
  const eventRows = Array.isArray(events.data) ? events.data : [];
  if (eventRows.length) {
    return (
      <>
        {eventRows.map((o) => (
          <Bubble
            key={o.id}
            id={o.id}
            label={who(o.name, o.type)}
            name={o.name}
            text={textOf(o.output) || textOf(o.input)}
          />
        ))}
      </>
    );
  }
  const observations = withObs.data?.observations ?? [];
  return (
    <>
      {observations.map((o) => (
        <ObservationLine
          key={o.id}
          projectId={projectId}
          traceId={traceId}
          observationId={o.id}
          name={o.name}
          type={o.type}
        />
      ))}
    </>
  );
}

export function HoiThoai({
  projectId,
  sessionId,
}: {
  projectId: string;
  sessionId: string;
}) {
  const session = api.sessions.byIdWithScores.useQuery(
    { sessionId, projectId },
    { enabled: Boolean(projectId) && Boolean(sessionId) },
  );
  const traces = session.data?.traces ?? [];
  if (!traces.length) return null;

  return (
    <section className="border-t px-4 py-3">
      <h2 className="mb-2 text-xs font-medium text-muted-foreground">Hội thoại</h2>
      <div className="space-y-1.5">
        {traces.map((t) => (
          <TraceTurns key={t.id} projectId={projectId} sessionId={sessionId} traceId={t.id} />
        ))}
      </div>
    </section>
  );
}
