"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import type { Lang } from "@/lib/types";
import { ChannelsView, LlmsView, RoutesView, TraceInspector, TracesView } from "./console-mocks";

type Scene = "traces" | "tree" | "channels" | "routes" | "llms";

type Step = {
  scene: Scene;
  hit: string;
  ms: number;
  caption: { vi: string; en: string };
  highlight?: string;
};

const NAV: { id: Scene; vi: string; en: string }[] = [
  { id: "traces", vi: "Vết", en: "Traces" },
  { id: "tree", vi: "Cây", en: "Tree" },
  { id: "channels", vi: "Kênh", en: "Channels" },
  { id: "routes", vi: "Lộ trình", en: "Routes" },
  { id: "llms", vi: "LLM", en: "LLMs" },
];

const STEPS: Step[] = [
  {
    scene: "traces",
    hit: "nav-traces",
    ms: 2000,
    caption: { vi: "Mở danh sách vết.", en: "Open the trace list." },
  },
  {
    scene: "traces",
    hit: "row-trace",
    ms: 2600,
    highlight: "zalo-oa · RAG hoàn tiền",
    caption: { vi: "Một lượt Zalo là cả pipeline RAG.", en: "One Zalo turn is the whole RAG pipeline." },
  },
  {
    scene: "tree",
    hit: "n-chunk",
    ms: 3200,
    caption: { vi: "Chunk tài liệu hoàn tiền thành 12 đoạn.", en: "Chunk the refund policy into 12 passages." },
  },
  {
    scene: "tree",
    hit: "n-embed",
    ms: 3000,
    caption: { vi: "OpenAI embeddings ghi input và output vector.", en: "OpenAI embeddings with vector input and output." },
  },
  {
    scene: "tree",
    hit: "n-index",
    ms: 2400,
    caption: { vi: "Index 12 vector vào namespace oa-prod.", en: "Index 12 vectors into the oa-prod namespace." },
  },
  {
    scene: "tree",
    hit: "n-retr",
    ms: 3000,
    caption: { vi: "Retrieval trả 6 chunk kèm cosine score.", en: "Retrieval returns 6 chunks with cosine scores." },
  },
  {
    scene: "tree",
    hit: "n-tool",
    ms: 3000,
    caption: { vi: "Tool call CRM lookup_order với DH-88421.", en: "CRM lookup_order tool call for DH-88421." },
  },
  {
    scene: "tree",
    hit: "n-openai",
    ms: 3400,
    caption: {
      vi: "OpenAI gpt-4o: messages, tools, rồi tool_calls.",
      en: "OpenAI gpt-4o: messages, tools, then tool_calls.",
    },
  },
  {
    scene: "tree",
    hit: "n-anthropic",
    ms: 3600,
    caption: {
      vi: "Anthropic sonnet: retrieved chunks cộng CRM, rồi câu trả lời OA.",
      en: "Anthropic sonnet: retrieved chunks plus CRM, then the OA reply.",
    },
  },
  {
    scene: "routes",
    hit: "route-zalo",
    ms: 2800,
    caption: {
      vi: "Lộ trình: inbound, chunk, embed, retrieve, tools, generation, outbound.",
      en: "Route: inbound, chunk, embed, retrieve, tools, generation, outbound.",
    },
  },
];

export function PlatformTour({ lang }: { lang: Lang }) {
  const vi = lang === "vi";
  const rootRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [cursor, setCursor] = useState({ x: 96, y: 88 });
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden] = useState(false);
  const frozen = paused || hover || reduce || hidden;
  const step = STEPS[stepIndex];
  const highlight = step.highlight
    ? vi
      ? step.highlight
      : step.highlight === "zalo-oa · RAG hoàn tiền"
        ? "zalo-oa · refund RAG"
        : step.highlight
    : undefined;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (frozen) return;
    const timer = window.setTimeout(() => {
      setStepIndex((current) => (current + 1) % STEPS.length);
    }, step.ms);
    return () => window.clearTimeout(timer);
  }, [frozen, step.ms, stepIndex]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const hit = root.querySelector(`[data-hit="${step.hit}"]`);
    if (!(hit instanceof HTMLElement)) return;
    const rootBox = root.getBoundingClientRect();
    const hitBox = hit.getBoundingClientRect();
    setCursor({
      x: hitBox.left - rootBox.left + Math.min(hitBox.width * 0.72, 140),
      y: hitBox.top - rootBox.top + hitBox.height * 0.55,
    });
    if (reduce) return;
    setClicking(false);
    const clickAt = window.setTimeout(() => setClicking(true), 720);
    const clickOff = window.setTimeout(() => setClicking(false), 1100);
    return () => {
      window.clearTimeout(clickAt);
      window.clearTimeout(clickOff);
    };
  }, [reduce, step.hit, step.scene]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
            {vi ? "Demo console" : "Console demo"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {vi ? "Đi một vòng nền tảng" : "Walk the platform"}
          </h2>
        </div>
        <button
          type="button"
          className="btn-ghost !min-h-0 px-3 py-1.5 text-[11px]"
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (vi ? "Chạy" : "Play") : vi ? "Tạm dừng" : "Pause"}
        </button>
      </div>

      <div
        ref={rootRef}
        className="tour-stage relative overflow-hidden rounded-2xl border border-white/15 bg-[#050506]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          </span>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <span className="truncate rounded-md border border-white/10 bg-black/50 px-3 py-1 text-[11px] tracking-[0.18em] text-white/70">
              vet
            </span>
          </div>
        </div>

        <div className="grid min-h-[30rem] md:grid-cols-[168px_1fr]">
          <aside className="hidden border-r border-white/10 bg-black/40 p-3 md:block">
            <div className="mb-4 flex items-center gap-2 px-2">
              <Logo className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-tight">Vết</span>
            </div>
            <nav className="space-y-1 text-[13px]">
              {NAV.map((item) => {
                const selected = item.id === step.scene;
                return (
                  <div
                    key={item.id}
                    data-hit={`nav-${item.id}`}
                    className={`rounded-md px-2 py-1.5 ${selected ? "bg-white/[0.1] text-ink" : "text-white/55"}`}
                  >
                    {vi ? item.vi : item.en}
                  </div>
                );
              })}
            </nav>
          </aside>
          <div className="min-w-0 p-3 md:p-4">
            {step.scene === "traces" ? <TracesView vi={vi} highlight={highlight} /> : null}
            {step.scene === "tree" ? <TraceInspector vi={vi} selectedHit={step.hit} /> : null}
            {step.scene === "channels" ? <ChannelsView vi={vi} highlight={highlight} /> : null}
            {step.scene === "routes" ? <RoutesView vi={vi} /> : null}
            {step.scene === "llms" ? <LlmsView vi={vi} /> : null}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-16 md:left-[168px]">
          <p className="max-w-xl text-sm text-white/80">{vi ? step.caption.vi : step.caption.en}</p>
        </div>

        {reduce ? null : (
          <div className={`tour-cursor ${clicking ? "is-click" : ""}`} style={{ left: cursor.x, top: cursor.y }} aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 3.5 18.5 12.2l-6.1 1.3 3.4 7.2-2.6 1.2-3.4-7.3L4 20.2V3.5Z"
                fill="#f0f0fa"
                stroke="#000"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
