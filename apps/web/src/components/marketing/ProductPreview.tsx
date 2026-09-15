"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { ChannelsView, LlmsView, ReplayView, RoutesView, TracesView } from "./console-mocks";

type ModuleId = "replay" | "channels" | "routes" | "traces" | "llms";

type Copy = {
  eyebrow: string;
  title: string;
  blurb: string;
  body: string;
  cta: string;
};

const MODULES: { id: ModuleId; vi: Copy; en: Copy }[] = [
  {
    id: "replay",
    vi: {
      eyebrow: "Khác Langfuse",
      title: "Hội thoại kênh",
      blurb: "Chunk, retrieve, tool call, OpenAI và Anthropic trong một vết",
      body: "Langfuse ghi messages.create. Vết ghi chunk, index, retrieval, tool CRM, input/output OpenAI và Anthropic, rồi tin Zalo ra.",
      cta: "Xem demo",
    },
    en: {
      eyebrow: "Vs Langfuse",
      title: "Channel replay",
      blurb: "Chunk, retrieve, tool calls, OpenAI and Anthropic in one trace",
      body: "Langfuse records messages.create. Vết records chunking, indexing, retrieval, a CRM tool call, OpenAI and Anthropic input/output, then the Zalo reply.",
      cta: "See demo",
    },
  },
  {
    id: "channels",
    vi: {
      eyebrow: "Console",
      title: "Kênh",
      blurb: "Zalo OA, FPT.AI, Viettel, Lark, Google Chat, .NET",
      body: "Webhook Zalo OA, FPT.AI, Lark, Google Chat. Viettel ASR/TTS đi trên cây Zalo. Teams ghi span qua SDK hoặc OTLP.",
      cta: "Xem demo",
    },
    en: {
      eyebrow: "Console",
      title: "Channels",
      blurb: "Zalo OA, FPT.AI, Viettel, Lark, Google Chat, .NET",
      body: "Webhooks for Zalo OA, FPT.AI, Lark, and Google Chat. Viettel ASR/TTS rides the Zalo tree. Teams uses the SDK or OTLP.",
      cta: "See demo",
    },
  },
  {
    id: "routes",
    vi: {
      eyebrow: "Console",
      title: "Lộ trình",
      blurb: "Zalo vào rồi chunk, retrieve, tools, LLM, tin ra",
      body: "Mỗi bot có một luồng cố định từ tin vào kênh đến tin trả lời, gồm RAG và tool call.",
      cta: "Xem demo",
    },
    en: {
      eyebrow: "Console",
      title: "Routes",
      blurb: "Zalo in, then chunk, retrieve, tools, LLM, and the reply",
      body: "Each bot keeps a fixed path from the inbound channel message to the reply, including RAG and tool calls.",
      cta: "See demo",
    },
  },
  {
    id: "traces",
    vi: {
      eyebrow: "Console",
      title: "Vết",
      blurb: "Cây quan sát, token và chi phí",
      body: "Generation, span, token và chi phí giữ nguyên từ Langfuse OSS. Overlay Vết gắn thêm kênh và lộ trình.",
      cta: "Xem demo",
    },
    en: {
      eyebrow: "Console",
      title: "Traces",
      blurb: "Observation tree, tokens, and cost",
      body: "Generations, spans, tokens, and cost stay Langfuse OSS. The Vết overlay attaches the channel and the route.",
      cta: "See demo",
    },
  },
  {
    id: "llms",
    vi: {
      eyebrow: "Console",
      title: "Kết nối LLM",
      blurb: "OpenAI, Anthropic, Bedrock, Vertex, Foundry",
      body: "Generation và embeddings gắn provider và region. Google Chat và Teams nằm ở Kênh, không lẫn với lớp mô hình.",
      cta: "Xem demo",
    },
    en: {
      eyebrow: "Console",
      title: "LLM connections",
      blurb: "OpenAI, Anthropic, Bedrock, Vertex, Foundry",
      body: "Generations and embeddings carry provider and region. Google Chat and Teams live under Channels, not the model layer.",
      cta: "See demo",
    },
  },
];

export function ProductPreview({ lang, demoHref }: { lang: Lang; demoHref: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const vi = lang === "vi";
  const current = MODULES[active];
  const copy = vi ? current.vi : current.en;
  const panelId = `${baseId}-panel`;

  function selectTab(index: number) {
    setActive(index);
    tabsRef.current[index]?.focus();
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    selectTab((active + delta + MODULES.length) % MODULES.length);
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
          {vi ? "Từng module" : "Each module"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {vi ? "Console làm gì" : "What the console does"}
        </h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[radial-gradient(ellipse_at_22%_12%,rgba(240,240,250,0.08),transparent_52%),#050506]">
        <div className="flex flex-col gap-6 p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">{copy.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{copy.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{copy.body}</p>
            </div>
            <Link href={demoHref} className="btn-solid !min-h-0 px-4 py-2">
              {copy.cta}
            </Link>
          </div>
          <div role="tabpanel" id={panelId} aria-labelledby={`${baseId}-tab-${current.id}`}>
            {renderView(current.id, vi)}
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={vi ? "Module console" : "Console modules"}
        onKeyDown={onTabKey}
        className="mt-3 flex overflow-x-auto rounded-2xl border border-white/12 bg-black/55"
      >
        {MODULES.map((mod, index) => {
          const tab = vi ? mod.vi : mod.en;
          const selected = index === active;
          const tabId = `${baseId}-tab-${mod.id}`;
          return (
            <button
              key={mod.id}
              type="button"
              role="tab"
              id={tabId}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={`min-h-[6.25rem] min-w-[11.5rem] flex-1 border-r border-white/10 px-3 py-3 text-left last:border-r-0 ${
                selected ? "bg-white/[0.09] text-ink shadow-[inset_0_2px_0_0_#f0f0fa]" : "text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <div className="text-sm font-medium">{tab.title}</div>
              <p className="mt-1 text-[12px] leading-snug text-white/45">{tab.blurb}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderView(id: ModuleId, vi: boolean) {
  switch (id) {
    case "replay":
      return <ReplayView vi={vi} />;
    case "channels":
      return <ChannelsView vi={vi} />;
    case "routes":
      return <RoutesView vi={vi} />;
    case "traces":
      return <TracesView vi={vi} />;
    case "llms":
      return <LlmsView vi={vi} />;
  }
}
