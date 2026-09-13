"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const CAPTIONS: Record<string, { vi: string; en: string }> = {
  "nav-traces": { vi: "Danh sách vết trong 24 giờ.", en: "The last 24 hours of traces." },
  "nav-tree": { vi: "Cây quan sát của một lượt Zalo.", en: "Observation tree for one Zalo turn." },
  "nav-channels": { vi: "Kênh Zalo, FPT, Viettel, Lark, Google Chat.", en: "Zalo, FPT, Viettel, Lark, and Google Chat." },
  "nav-routes": { vi: "Lộ trình từ tin vào đến tin ra.", en: "Routes from inbound to the reply." },
  "nav-llms": { vi: "Kết nối model. Google Chat nằm ở Kênh.", en: "Model connections. Google Chat lives under Channels." },
  "row-trace": { vi: "Một lượt Zalo là cả pipeline RAG.", en: "One Zalo turn is the whole RAG pipeline." },
  "n-in": { vi: "Tin Zalo vào, text hoàn tiền DH-88421.", en: "Zalo inbound, refund text for DH-88421." },
  "n-rag": { vi: "Pipeline RAG: chunk, embed, index, retrieve.", en: "RAG pipeline: chunk, embed, index, retrieve." },
  "n-chunk": { vi: "Chunk tài liệu hoàn tiền thành 12 đoạn.", en: "Chunk the refund policy into 12 passages." },
  "n-embed": { vi: "OpenAI embeddings ghi input và output vector.", en: "OpenAI embeddings with vector input and output." },
  "n-index": { vi: "Index 12 vector vào namespace oa-prod.", en: "Index 12 vectors into the oa-prod namespace." },
  "n-retr": { vi: "Retrieval trả 6 chunk kèm cosine score.", en: "Retrieval returns 6 chunks with cosine scores." },
  "n-tool": { vi: "Tool call CRM lookup_order với DH-88421.", en: "CRM lookup_order tool call for DH-88421." },
  "n-search": { vi: "knowledge.search trả 3 đoạn chính sách.", en: "knowledge.search returns 3 policy passages." },
  "n-openai": { vi: "OpenAI gpt-4o: messages, tools, rồi tool_calls.", en: "OpenAI gpt-4o: messages, tools, then tool_calls." },
  "n-anthropic": {
    vi: "Anthropic sonnet: retrieved chunks cộng CRM, rồi câu trả lời OA.",
    en: "Anthropic sonnet: retrieved chunks plus CRM, then the OA reply.",
  },
  "n-out": { vi: "Tin Zalo ra, quote tin khách.", en: "Zalo outbound, quoting the customer." },
  "route-zalo": {
    vi: "Lộ trình: inbound, chunk, embed, retrieve, tools, generation, outbound.",
    en: "Route: inbound, chunk, embed, retrieve, tools, generation, outbound.",
  },
  "route-voice": {
    vi: "Lộ trình giọng: Zalo, ASR Viettel, NLU, TTS, tin ra.",
    en: "Voice route: Zalo, Viettel ASR, NLU, TTS, then the reply.",
  },
  "route-lark": { vi: "Lộ trình Lark vào, Claude, Lark ra.", en: "Lark in, Claude, Lark out." },
  "row-zalo": { vi: "Webhook Zalo OA. Lượt hoàn tiền vừa vào.", en: "Zalo OA webhook. The refund turn just landed." },
  "row-openai": { vi: "OpenAI: chat completions và embeddings.", en: "OpenAI: chat completions and embeddings." },
  "row-gchat": { vi: "Google Chat là kênh, không phải model.", en: "Google Chat is a channel, not a model." },
};

const SCENE_CAPTIONS: Record<Scene, { vi: string; en: string }> = {
  traces: { vi: "Bấm một lượt để mở cây.", en: "Click a turn to open the tree." },
  tree: { vi: "Bấm từng span để xem input và output.", en: "Click a span to see input and output." },
  channels: { vi: "Bấm một kênh để chọn.", en: "Click a channel to select it." },
  routes: { vi: "Bấm một lộ trình để chọn.", en: "Click a route to select it." },
  llms: { vi: "Bấm một nhà cung cấp để chọn.", en: "Click a provider to select it." },
};

const STEPS: Step[] = [
  { scene: "traces", hit: "nav-traces", ms: 1100, caption: CAPTIONS["nav-traces"] },
  {
    scene: "traces",
    hit: "row-trace",
    ms: 1300,
    highlight: "zalo-oa · RAG hoàn tiền",
    caption: CAPTIONS["row-trace"],
  },
  { scene: "tree", hit: "n-chunk", ms: 1400, caption: CAPTIONS["n-chunk"] },
  { scene: "tree", hit: "n-embed", ms: 1300, caption: CAPTIONS["n-embed"] },
  { scene: "tree", hit: "n-index", ms: 1100, caption: CAPTIONS["n-index"] },
  { scene: "tree", hit: "n-retr", ms: 1300, caption: CAPTIONS["n-retr"] },
  { scene: "tree", hit: "n-tool", ms: 1300, caption: CAPTIONS["n-tool"] },
  { scene: "tree", hit: "n-openai", ms: 1400, caption: CAPTIONS["n-openai"] },
  { scene: "tree", hit: "n-anthropic", ms: 1400, caption: CAPTIONS["n-anthropic"] },
  { scene: "routes", hit: "route-zalo", ms: 1300, caption: CAPTIONS["route-zalo"] },
];

function localizeHighlight(value: string | undefined, vi: boolean) {
  if (!value) return undefined;
  if (vi) return value;
  if (value === "zalo-oa · RAG hoàn tiền") return "zalo-oa · refund RAG";
  return value;
}

function captionFor(hit: string, scene: Scene) {
  return CAPTIONS[hit] ?? SCENE_CAPTIONS[scene];
}

function NavButtons({
  vi,
  scene,
  onSelect,
  stretch,
}: {
  vi: boolean;
  scene: Scene;
  onSelect: (id: Scene) => void;
  stretch?: boolean;
}) {
  return (
    <>
      {NAV.map((item) => {
        const selected = item.id === scene;
        return (
          <button
            key={item.id}
            type="button"
            data-hit={`nav-${item.id}`}
            onClick={() => onSelect(item.id)}
            className={`${stretch ? "w-full" : "shrink-0"} rounded-md border-0 px-2 py-1.5 text-left ${
              selected ? "bg-white/[0.1] text-ink" : "bg-transparent text-white/55 hover:bg-white/[0.06] hover:text-ink"
            }`}
          >
            {vi ? item.vi : item.en}
          </button>
        );
      })}
    </>
  );
}

export function PlatformTour({ lang }: { lang: Lang }) {
  const vi = lang === "vi";
  const rootRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [cursor, setCursor] = useState({ x: 96, y: 88 });
  const [clicking, setClicking] = useState(false);
  const [scene, setScene] = useState<Scene>(STEPS[0].scene);
  const [hit, setHit] = useState(STEPS[0].hit);
  const [highlight, setHighlight] = useState<string | undefined>(localizeHighlight(STEPS[0].highlight, vi));

  const autoplay = !paused && !exploring && !reduce && !hidden;
  const caption = captionFor(hit, scene);

  const takeOver = useCallback((next: { scene?: Scene; hit?: string; highlight?: string }) => {
    setExploring(true);
    setPaused(true);
    if (next.scene) setScene(next.scene);
    if (next.hit) setHit(next.hit);
    if ("highlight" in next) setHighlight(next.highlight);
  }, []);

  const selectScene = useCallback(
    (id: Scene) => {
      const nextHit =
        id === "tree" ? (hit.startsWith("n-") ? hit : "n-chunk") : id === "routes" ? "route-zalo" : `nav-${id}`;
      takeOver({
        scene: id,
        hit: nextHit,
        highlight:
          id === "traces"
            ? vi
              ? "zalo-oa · RAG hoàn tiền"
              : "zalo-oa · refund RAG"
            : id === "channels"
              ? "Zalo OA"
              : undefined,
      });
    },
    [hit, takeOver, vi],
  );

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
    if (exploring) return;
    const step = STEPS[stepIndex];
    setScene(step.scene);
    setHit(step.hit);
    setHighlight(localizeHighlight(step.highlight, vi));
  }, [exploring, stepIndex, vi]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => {
      setStepIndex((current) => (current + 1) % STEPS.length);
    }, STEPS[stepIndex].ms);
    return () => window.clearTimeout(timer);
  }, [autoplay, stepIndex]);

  useLayoutEffect(() => {
    if (exploring || reduce) return;
    const root = rootRef.current;
    if (!root) return;
    const target = root.querySelector(`[data-hit="${hit}"]`);
    if (!(target instanceof HTMLElement)) return;
    const rootBox = root.getBoundingClientRect();
    const hitBox = target.getBoundingClientRect();
    setCursor({
      x: hitBox.left - rootBox.left + Math.min(hitBox.width * 0.72, 140),
      y: hitBox.top - rootBox.top + hitBox.height * 0.55,
    });
    setClicking(false);
    const clickAt = window.setTimeout(() => setClicking(true), 180);
    const clickOff = window.setTimeout(() => setClicking(false), 420);
    return () => {
      window.clearTimeout(clickAt);
      window.clearTimeout(clickOff);
    };
  }, [exploring, reduce, hit, scene]);

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
          <p className="mt-1 text-sm text-muted">
            {vi ? "Bấm menu, từng span, hoặc từng dòng." : "Click the menu, a span, or a row."}
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost !min-h-0 px-3 py-1.5 text-[11px]"
          onClick={() => {
            if (autoplay) {
              setPaused(true);
              return;
            }
            const match = STEPS.findIndex((step) => step.hit === hit || step.scene === scene);
            if (match >= 0) setStepIndex(match);
            setExploring(false);
            setPaused(false);
          }}
        >
          {autoplay ? (vi ? "Tạm dừng" : "Pause") : vi ? "Chạy" : "Play"}
        </button>
      </div>

      <div ref={rootRef} className="tour-stage relative overflow-hidden rounded-2xl border border-white/15 bg-[#050506]">
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

        <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-2 py-2 text-[13px] md:hidden">
          <NavButtons vi={vi} scene={scene} onSelect={selectScene} />
        </div>

        <div className="grid min-h-[30rem] md:grid-cols-[168px_1fr]">
          <aside className="hidden border-r border-white/10 bg-black/40 p-3 md:block">
            <div className="mb-4 flex items-center gap-2 px-2">
              <Logo className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-tight">Vết</span>
            </div>
            <nav className="flex flex-col space-y-1 text-[13px]">
              <NavButtons vi={vi} scene={scene} onSelect={selectScene} stretch />
            </nav>
          </aside>
          <div className="min-w-0 p-3 md:p-4">
            {scene === "traces" ? (
              <TracesView
                vi={vi}
                highlight={highlight}
                onSelect={(name) => takeOver({ scene: "tree", hit: "n-in", highlight: name })}
              />
            ) : null}
            {scene === "tree" ? (
              <TraceInspector vi={vi} selectedHit={hit.startsWith("n-") ? hit : "n-chunk"} onSelectHit={(next) => takeOver({ scene: "tree", hit: next })} />
            ) : null}
            {scene === "channels" ? (
              <ChannelsView
                vi={vi}
                highlight={highlight}
                onSelect={(name) => takeOver({ scene: "channels", hit: name === "Zalo OA" ? "row-zalo" : `ch-${name}`, highlight: name })}
              />
            ) : null}
            {scene === "routes" ? (
              <RoutesView vi={vi} selectedHit={hit} onSelect={(next) => takeOver({ scene: "routes", hit: next })} />
            ) : null}
            {scene === "llms" ? (
              <LlmsView
                vi={vi}
                highlight={highlight}
                onSelect={(name) =>
                  takeOver({
                    scene: "llms",
                    hit: name === "Google Chat" ? "row-gchat" : name === "OpenAI" ? "row-openai" : `llm-${name}`,
                    highlight: name,
                  })
                }
              />
            ) : null}
          </div>
        </div>

        <div
          className={
            exploring
              ? "pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-4 md:left-[168px]"
              : "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-16 md:left-[168px]"
          }
        >
          <p className="max-w-xl text-sm text-white/80">{vi ? caption.vi : caption.en}</p>
        </div>

        {reduce || exploring ? null : (
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
