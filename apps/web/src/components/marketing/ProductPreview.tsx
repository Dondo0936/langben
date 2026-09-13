"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { consoleSignInUrl } from "@/lib/console-target";
import type { Lang } from "@/lib/types";

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
      blurb: "Phiên Zalo gom tin khách, intent, lần sinh và tin bot",
      body: "Langfuse ghi messages.create. Vết mở phiên Zalo với tin khách, intent FPT, lần sinh, TTS và tin bot.",
      cta: "Mở console",
    },
    en: {
      eyebrow: "Vs Langfuse",
      title: "Channel replay",
      blurb: "Zalo session with the user, intent, generation, and bot reply",
      body: "Langfuse records messages.create. Vết opens the Zalo session with the customer message, FPT intent, generation, TTS, and bot reply.",
      cta: "Open console",
    },
  },
  {
    id: "channels",
    vi: {
      eyebrow: "Console",
      title: "Kênh",
      blurb: "Zalo OA, FPT.AI, Viettel, Lark, Google Chat, .NET",
      body: "Kết nối webhook Zalo OA, FPT.AI Conversation, Viettel ASR/TTS, Lark, Google Chat và Teams.",
      cta: "Mở console",
    },
    en: {
      eyebrow: "Console",
      title: "Channels",
      blurb: "Zalo OA, FPT.AI, Viettel, Lark, Google Chat, .NET",
      body: "Wire Zalo OA webhooks, FPT.AI Conversation, Viettel ASR/TTS, Lark, Google Chat, and Teams.",
      cta: "Open console",
    },
  },
  {
    id: "routes",
    vi: {
      eyebrow: "Console",
      title: "Lộ trình",
      blurb: "Zalo vào rồi NLU, LLM, TTS, tin ra",
      body: "Mỗi bot có một luồng cố định từ tin vào kênh đến tin trả lời, kèm số vết và lỗi trên từng bước.",
      cta: "Mở console",
    },
    en: {
      eyebrow: "Console",
      title: "Routes",
      blurb: "Zalo in, then NLU, LLM, TTS, and the reply",
      body: "Each bot keeps a fixed path from the inbound channel message to the reply, with trace and error counts on every step.",
      cta: "Open console",
    },
  },
  {
    id: "traces",
    vi: {
      eyebrow: "Console",
      title: "Vết",
      blurb: "Cây quan sát, token và chi phí",
      body: "Generation, span, token và chi phí giữ nguyên từ Langfuse OSS. Overlay Vết gắn thêm kênh và lộ trình.",
      cta: "Mở console",
    },
    en: {
      eyebrow: "Console",
      title: "Traces",
      blurb: "Observation tree, tokens, and cost",
      body: "Generations, spans, tokens, and cost stay Langfuse OSS. The Vết overlay attaches the channel and the route.",
      cta: "Open console",
    },
  },
  {
    id: "llms",
    vi: {
      eyebrow: "Console",
      title: "Kết nối LLM",
      blurb: "Anthropic, Bedrock, Vertex, Foundry",
      body: "Generation gắn provider và region. Google Chat và Teams nằm ở Kênh, không lẫn với lớp mô hình.",
      cta: "Mở console",
    },
    en: {
      eyebrow: "Console",
      title: "LLM connections",
      blurb: "Anthropic, Bedrock, Vertex, Foundry",
      body: "Generations carry provider and region. Google Chat and Teams live under Channels, not the model layer.",
      cta: "Open console",
    },
  },
];

export function ProductPreview({ lang }: { lang: Lang }) {
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
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[radial-gradient(ellipse_at_22%_12%,rgba(240,240,250,0.08),transparent_52%),#050506]">
        <div className="flex flex-col gap-6 p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">{copy.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{copy.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{copy.body}</p>
            </div>
            <Link href={consoleSignInUrl()} className="btn-solid !min-h-0 px-4 py-2">
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

function ConsoleFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-black/70">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/45">
        <span className="h-2 w-2 rounded-full bg-white" />
        {title}
      </div>
      {children}
    </div>
  );
}

function ReplayView({ vi }: { vi: boolean }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ConsoleFrame title="Langfuse">
        <div className="space-y-3 p-4 text-sm">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">generation · sonnet</p>
          <div className="bg-white/10 px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/40">messages.create</div>
            <p className="text-white/80">Khách: hủy đơn. Intent=cancel_order. Hỏi mã đơn.</p>
          </div>
          <p className="font-mono text-[11px] text-white/45">450 tokens · $0.0018</p>
        </div>
      </ConsoleFrame>
      <ConsoleFrame title="Vết · Zalo · user_847712 · 14:02">
        <div className="grid md:grid-cols-[1fr_160px]">
          <div className="space-y-2 p-3 text-sm">
            <Bubble who={vi ? "khách" : "user"} time="14:02:01" text="hủy đơn" />
            <Bubble who="FPT" time="14:02:01" text="intent = cancel_order · 0.93" muted />
            <Bubble
              who="bot"
              time="14:03:08"
              text={vi ? "Dạ, anh/chị cho em xin mã đơn để hủy ạ?" : "Could you share the order id to cancel?"}
            />
          </div>
          <div className="border-t border-white/10 p-3 font-mono text-[11px] text-white/70 md:border-l md:border-t-0">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
              {vi ? "Quan sát" : "Observations"}
            </div>
            <ol className="space-y-1.5">
              <li>channel.inbound</li>
              <li className="pl-3">nlu · fpt</li>
              <li className="pl-3">generation · sonnet</li>
              <li>channel.outbound</li>
            </ol>
          </div>
        </div>
      </ConsoleFrame>
    </div>
  );
}

function ChannelsView({ vi }: { vi: boolean }) {
  const rows = [
    ["Zalo OA", "webhook", vi ? "14:02 · hủy đơn" : "14:02 · cancel order", "OK"],
    ["FPT.AI Conversation", "NLU", "cancel_order · 0.93", "OK"],
    ["Viettel ASR/TTS", vi ? "giọng" : "voice", "tts · 1.1s", "OK"],
    ["Lark", "webhook", "VPN timeout", "OK"],
    ["Google Chat", "webhook", "INC-442", "OK"],
    [".NET / Teams", "SDK", vi ? "chưa có sự kiện" : "no events yet", vi ? "chờ" : "idle"],
  ];
  return (
    <ConsoleFrame title={vi ? "Kênh · demo-bot" : "Channels · demo-bot"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-white/40">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 font-medium">{vi ? "Kênh" : "Channel"}</th>
              <th className="px-3 py-2 font-medium">{vi ? "Loại" : "Type"}</th>
              <th className="px-3 py-2 font-medium">{vi ? "Sự kiện cuối" : "Last event"}</th>
              <th className="px-3 py-2 font-medium">{vi ? "Trạng thái" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-white/10 text-white/80 last:border-0">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConsoleFrame>
  );
}

function RoutesView({ vi }: { vi: boolean }) {
  const routes = [
    {
      name: "zalo-oa → fpt-conversation → claude → zalo-reply",
      steps: ["zalo.inbound", "fpt.nlu", "generation", "zalo.outbound"],
      meta: vi ? "128 vết · 2 lỗi" : "128 traces · 2 errors",
    },
    {
      name: "zalo-oa → viettel-asr → nlu → tts → zalo-reply",
      steps: ["zalo.inbound", "speech.asr", "nlu", "speech.tts", "zalo.outbound"],
      meta: vi ? "41 vết · 0 lỗi" : "41 traces · 0 errors",
    },
    {
      name: "lark → claude → lark",
      steps: ["lark.inbound", "generation", "lark.outbound"],
      meta: vi ? "19 vết · 1 lỗi" : "19 traces · 1 error",
    },
  ];
  return (
    <ConsoleFrame title={vi ? "Lộ trình · demo-bot" : "Routes · demo-bot"}>
      <div className="space-y-3 p-3">
        {routes.map((route) => (
          <div key={route.name} className="border border-white/10 bg-white/[0.03] p-3">
            <div className="text-sm font-medium">{route.name}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
              {route.steps.map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-white/80">{step}</span>
                  {index < route.steps.length - 1 ? <span className="text-white/30">→</span> : null}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-white/45">{route.meta}</p>
          </div>
        ))}
      </div>
    </ConsoleFrame>
  );
}

function TracesView({ vi }: { vi: boolean }) {
  const rows = [
    [vi ? "zalo-oa · hủy đơn" : "zalo-oa · cancel order", "1.5s", "450 tok", "$0.0018", "OK"],
    ["lark · VPN timeout", "2.1s", "610 tok", "$0.0031", "OK"],
    ["gchat · INC-442", "0.9s", "280 tok", "$0.0009", "OK"],
    [vi ? "zalo-oa · đổi địa chỉ" : "zalo-oa · change address", "3.4s", "890 tok", "$0.0044", vi ? "lỗi" : "error"],
  ];
  return (
    <ConsoleFrame title={vi ? "Vết · 24h" : "Traces · 24h"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-white/40">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 font-medium">{vi ? "Tên" : "Name"}</th>
              <th className="px-3 py-2 font-medium">{vi ? "Thời gian" : "Latency"}</th>
              <th className="px-3 py-2 font-medium">Tokens</th>
              <th className="px-3 py-2 font-medium">{vi ? "Chi phí" : "Cost"}</th>
              <th className="px-3 py-2 font-medium">{vi ? "Trạng thái" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-white/10 text-white/80 last:border-0">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className="px-3 py-2 font-mono text-[12px] sm:text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConsoleFrame>
  );
}

function LlmsView({ vi }: { vi: boolean }) {
  const rows = [
    ["Anthropic", "claude-sonnet", "us", "generation"],
    ["FPT Factory", "factory-llm", "vn", "generation"],
    ["Bedrock", "claude-sonnet", "ap-southeast-1", "generation"],
    ["Vertex", "gemini", "asia-southeast1", "generation"],
    ["Foundry", "gpt-4o", "eastus", "generation"],
    ["Google Chat", vi ? "không phải model" : "not a model", "global", vi ? "kênh" : "channel"],
  ];
  return (
    <ConsoleFrame title={vi ? "Kết nối LLM · demo-bot" : "LLM connections · demo-bot"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-white/40">
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 font-medium">{vi ? "Nhà cung cấp" : "Provider"}</th>
              <th className="px-3 py-2 font-medium">{vi ? "Mô hình" : "Model"}</th>
              <th className="px-3 py-2 font-medium">Region</th>
              <th className="px-3 py-2 font-medium">{vi ? "Vai trò" : "Role"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-white/10 text-white/80 last:border-0">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConsoleFrame>
  );
}

function Bubble({
  who,
  time,
  text,
  muted,
}: {
  who: string;
  time: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <div className={`px-3 py-2 ${muted ? "bg-white/5 text-white/70" : "bg-white/10 text-white"}`}>
      <div className="mb-1 flex gap-2 text-[10px] uppercase tracking-[0.14em] text-white/40">
        <span>{who}</span>
        <span>{time}</span>
      </div>
      {text}
    </div>
  );
}
