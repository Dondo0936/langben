"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import type { Lang } from "@/lib/types";
import { ChannelsView, LlmsView, RoutesView, SessionReplay, TracesView } from "./console-mocks";

type Scene = "traces" | "channels" | "replay" | "routes" | "llms";

type Step = {
  scene: Scene;
  hit: string;
  ms: number;
  caption: { vi: string; en: string };
  highlight?: string;
};

const NAV: { id: Scene; vi: string; en: string }[] = [
  { id: "traces", vi: "Vết", en: "Traces" },
  { id: "channels", vi: "Kênh", en: "Channels" },
  { id: "replay", vi: "Hội thoại", en: "Replay" },
  { id: "routes", vi: "Lộ trình", en: "Routes" },
  { id: "llms", vi: "LLM", en: "LLMs" },
];

const STEPS: Step[] = [
  {
    scene: "traces",
    hit: "nav-traces",
    ms: 2200,
    caption: { vi: "Mở console Vết.", en: "Open the Vết console." },
  },
  {
    scene: "traces",
    hit: "row-trace",
    ms: 2800,
    highlight: "zalo-oa · hủy đơn",
    caption: { vi: "Langfuse dừng ở generation.", en: "Langfuse stops at the generation." },
  },
  {
    scene: "channels",
    hit: "nav-channels",
    ms: 2400,
    caption: { vi: "Sang Kênh.", en: "Open Channels." },
  },
  {
    scene: "channels",
    hit: "row-zalo",
    ms: 2600,
    highlight: "Zalo OA",
    caption: { vi: "Chọn Zalo OA.", en: "Select Zalo OA." },
  },
  {
    scene: "replay",
    hit: "nav-replay",
    ms: 2800,
    caption: { vi: "Mở hội thoại kênh.", en: "Open the channel replay." },
  },
  {
    scene: "replay",
    hit: "obs-nlu",
    ms: 3400,
    caption: {
      vi: "Tin khách, intent FPT, lần sinh và tin bot trong cùng phiên.",
      en: "Customer text, FPT intent, generation, and bot reply in one session.",
    },
  },
  {
    scene: "routes",
    hit: "nav-routes",
    ms: 2400,
    caption: { vi: "Sang Lộ trình.", en: "Open Routes." },
  },
  {
    scene: "routes",
    hit: "route-zalo",
    ms: 3000,
    caption: { vi: "Zalo vào rồi NLU, LLM, TTS, tin ra.", en: "Zalo in, then NLU, LLM, TTS, and the reply." },
  },
  {
    scene: "llms",
    hit: "nav-llms",
    ms: 2400,
    caption: { vi: "Sang kết nối LLM.", en: "Open LLM connections." },
  },
  {
    scene: "llms",
    hit: "row-gchat",
    ms: 3200,
    caption: {
      vi: "Google Chat là kênh. Anthropic và Bedrock là lớp mô hình.",
      en: "Google Chat is a channel. Anthropic and Bedrock are the model layer.",
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
      : step.highlight === "zalo-oa · hủy đơn"
        ? "zalo-oa · cancel order"
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
      x: hitBox.left - rootBox.left + Math.min(hitBox.width * 0.72, 120),
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

        <div className="grid min-h-[28rem] md:grid-cols-[168px_1fr]">
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
            {step.scene === "channels" ? <ChannelsView vi={vi} highlight={highlight} /> : null}
            {step.scene === "replay" ? (
              <div className="overflow-hidden rounded-xl border border-white/12 bg-black/70">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/45">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Vết · Zalo · user_847712
                </div>
                <SessionReplay vi={vi} />
              </div>
            ) : null}
            {step.scene === "routes" ? <RoutesView vi={vi} /> : null}
            {step.scene === "llms" ? <LlmsView vi={vi} /> : null}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-16">
          <p className="max-w-xl text-sm text-white/80">{vi ? step.caption.vi : step.caption.en}</p>
        </div>

        {reduce ? null : (
          <div
            className={`tour-cursor ${clicking ? "is-click" : ""}`}
            style={{ left: cursor.x, top: cursor.y }}
            aria-hidden
          >
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
