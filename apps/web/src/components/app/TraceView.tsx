"use client";

import { useMemo, useState } from "react";
import type { Observation, Trace } from "@/lib/types";
import { formatDuration, formatTime, latencyOf, previewJson, typeLabel } from "@/lib/format";
import { StatusPill } from "./Ui";
import type { Lang } from "@/lib/types";

export function TraceView({
  trace,
  observations,
  lang,
}: {
  trace: Trace;
  observations: Observation[];
  lang: Lang;
}) {
  const [tab, setTab] = useState<"tree" | "timeline" | "io" | "chat">("tree");
  const [selected, setSelected] = useState(observations[0]?.id ?? null);
  const current = observations.find((o) => o.id === selected) ?? observations[0];
  const t0 = new Date(trace.startTime).getTime();
  const t1 = new Date(trace.endTime ?? observations.at(-1)?.endTime ?? trace.startTime).getTime();
  const span = Math.max(1, t1 - t0);

  const roots = useMemo(() => observations.filter((o) => !o.parentId || !observations.some((x) => x.id === o.parentId)), [observations]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1 md:hidden">
        {(
          [
            ["tree", lang === "vi" ? "Cây" : "Tree"],
            ["timeline", "Timeline"],
            ["io", lang === "vi" ? "Chi tiết" : "Detail"],
            ["chat", lang === "vi" ? "Hội thoại" : "Replay"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-xs ${tab === k ? "bg-ink text-highlight" : "bg-white border border-line"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="hidden min-h-[480px] grid-cols-[240px_1fr_280px] gap-3 md:grid">
        <Panel title={lang === "vi" ? "Cây quan sát" : "Observation tree"}>
          {roots.map((o) => (
            <TreeNode key={o.id} node={o} all={observations} selected={selected} onSelect={setSelected} lang={lang} />
          ))}
        </Panel>
        <Panel title="Waterfall">
          <div className="space-y-1.5">
            {observations.map((o) => {
              const start = new Date(o.startTime).getTime() - t0;
              const dur = latencyOf(o.startTime, o.endTime) ?? 8;
              return (
                <button key={o.id} onClick={() => setSelected(o.id)} className="block w-full text-left">
                  <div className="mb-0.5 truncate font-mono text-[10px] text-muted">{o.name}</div>
                  <div className="relative h-3 rounded bg-paper-2">
                    <div
                      className={`absolute h-3 rounded ${o.status === "error" ? "bg-red-400" : "bg-accent"}`}
                      style={{ left: `${(start / span) * 100}%`, width: `${Math.max(2, (dur / span) * 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>
        <Panel title={lang === "vi" ? "Chi tiết" : "I/O"}>
          {current ? <Io current={current} lang={lang} /> : <p className="text-sm text-muted">—</p>}
        </Panel>
      </div>
      <div className="md:hidden">
        {tab === "tree" && roots.map((o) => (
          <TreeNode key={o.id} node={o} all={observations} selected={selected} onSelect={setSelected} lang={lang} />
        ))}
        {tab === "timeline" && observations.map((o) => (
          <div key={o.id} className="border-b border-line py-2 font-mono text-xs">{o.name} · {formatDuration(latencyOf(o.startTime, o.endTime) ?? 0, lang)}</div>
        ))}
        {tab === "io" && current && <Io current={current} lang={lang} />}
        {tab === "chat" && <Chat observations={observations} lang={lang} />}
      </div>
      <div className="mt-4 hidden md:block">
        <h3 className="mb-2 text-sm font-medium">{lang === "vi" ? "Hội thoại" : "Replay"}</h3>
        <Chat observations={observations} lang={lang} />
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-auto rounded-xl border border-line bg-white p-3">
      <div className="mb-2 text-xs font-medium text-muted">{title}</div>
      {children}
    </div>
  );
}

function TreeNode({
  node,
  all,
  selected,
  onSelect,
  lang,
  depth = 0,
}: {
  node: Observation;
  all: Observation[];
  selected: string | null;
  onSelect: (id: string) => void;
  lang: Lang;
  depth?: number;
}) {
  const kids = all.filter((o) => o.parentId === node.id);
  return (
    <div>
      <button
        onClick={() => onSelect(node.id)}
        className={`flex w-full items-center gap-2 rounded px-1 py-1 text-left text-xs ${selected === node.id ? "bg-highlight/40" : "hover:bg-paper-2"}`}
        style={{ paddingLeft: 4 + depth * 12 }}
      >
        <StatusPill status={node.status} />
        <span className="truncate font-medium">{node.name}</span>
        <span className="ml-auto text-[10px] text-muted">{typeLabel(node.type, lang)}</span>
      </button>
      {kids.map((k) => (
        <TreeNode key={k.id} node={k} all={all} selected={selected} onSelect={onSelect} lang={lang} depth={depth + 1} />
      ))}
    </div>
  );
}

function Io({ current, lang }: { current: Observation; lang: Lang }) {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between">
        <span className="font-medium">{current.name}</span>
        <span className="text-muted">{formatTime(current.startTime, lang)}</span>
      </div>
      {current.model ? (
        <p className="text-muted">
          {current.provider} · {current.model} {current.region ? `· ${current.region}` : ""}
        </p>
      ) : null}
      {current.usage ? (
        <p className="text-muted">
          {current.usage.inputTokens ?? 0} → {current.usage.outputTokens ?? 0} tok
          {current.usage.estimatedCostUsd != null ? ` · $${current.usage.estimatedCostUsd}` : ""}
          {current.usage.voiceId ? ` · voice ${current.usage.voiceId}` : ""}
        </p>
      ) : null}
      <div>
        <div className="mb-1 font-medium">Input</div>
        <pre className="max-h-40 overflow-auto rounded bg-paper p-2 font-mono">{previewJson(current.input, 2000)}</pre>
      </div>
      <div>
        <div className="mb-1 font-medium">Output</div>
        <pre className="max-h-40 overflow-auto rounded bg-paper p-2 font-mono">{previewJson(current.output, 2000)}</pre>
      </div>
    </div>
  );
}

function turnText(o: Observation) {
  const input = o.input as Record<string, unknown> | null;
  const output = o.output as Record<string, unknown> | null;
  const nested = input?.message as { text?: string } | undefined;
  if (typeof input?.text === "string") return input.text;
  if (typeof nested?.text === "string") return nested.text;
  if (typeof output?.text === "string") return output.text;
  const intent = output && typeof output.intent === "string" ? `intent = ${output.intent}` : null;
  if (intent) return intent;
  return previewJson(o.output ?? o.input, 180);
}

function Chat({ observations, lang }: { observations: Observation[]; lang: Lang }) {
  const turns = observations.filter((o) =>
    ["channel.inbound", "channel.outbound", "nlu", "generation", "speech.asr", "speech.tts"].includes(o.type),
  );
  if (!turns.length) {
    return <p className="text-sm text-muted">{lang === "vi" ? "Không phải phiên kênh." : "Not a channel session."}</p>;
  }
  return (
    <div className="space-y-2 rounded-xl border border-line bg-white p-3">
      {turns.map((o) => {
        const who =
          o.type === "channel.inbound"
            ? lang === "vi" ? "khách" : "user"
            : o.type === "channel.outbound"
              ? "bot"
              : o.type === "nlu"
                ? "NLU"
                : o.type.startsWith("speech")
                  ? o.type
                  : "LLM";
        const text = turnText(o);
        return (
          <div key={o.id} className="rounded-lg bg-paper px-3 py-2 text-sm">
            <div className="mb-1 flex gap-2 text-[10px] uppercase tracking-wide text-muted">
              <span>{who}</span>
              <span>{formatTime(o.startTime, lang)}</span>
              <span className="font-mono">{o.name}</span>
            </div>
            {text}
          </div>
        );
      })}
    </div>
  );
}
