import type { ReactNode } from "react";

export function ConsoleFrame({ title, children }: { title: string; children: ReactNode }) {
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

export function ReplayView({ vi }: { vi: boolean }) {
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
        <SessionReplay vi={vi} />
      </ConsoleFrame>
    </div>
  );
}

export function SessionReplay({ vi }: { vi: boolean }) {
  return (
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
          <li data-hit="obs-inbound">channel.inbound</li>
          <li className="pl-3" data-hit="obs-nlu">
            nlu · fpt
          </li>
          <li className="pl-3">generation · sonnet</li>
          <li>channel.outbound</li>
        </ol>
      </div>
    </div>
  );
}

export function ChannelsView({ vi, highlight }: { vi: boolean; highlight?: string }) {
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
        <table className="w-full min-w-[480px] text-left text-sm">
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
              <tr
                key={row[0]}
                data-hit={row[0] === "Zalo OA" ? "row-zalo" : undefined}
                className={`border-b border-white/10 text-white/80 last:border-0 ${
                  highlight === row[0] ? "bg-white/[0.08]" : ""
                }`}
              >
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

export function RoutesView({ vi }: { vi: boolean }) {
  const routes = [
    {
      name: "zalo-oa → fpt-conversation → claude → zalo-reply",
      steps: ["zalo.inbound", "fpt.nlu", "generation", "zalo.outbound"],
      meta: vi ? "128 vết · 2 lỗi" : "128 traces · 2 errors",
      hit: "route-zalo",
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
          <div
            key={route.name}
            data-hit={route.hit}
            className="border border-white/10 bg-white/[0.03] p-3"
          >
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

export function TracesView({ vi, highlight }: { vi: boolean; highlight?: string }) {
  const rows = [
    [vi ? "zalo-oa · hủy đơn" : "zalo-oa · cancel order", "1.5s", "450 tok", "$0.0018", "OK"],
    ["lark · VPN timeout", "2.1s", "610 tok", "$0.0031", "OK"],
    ["gchat · INC-442", "0.9s", "280 tok", "$0.0009", "OK"],
    [vi ? "zalo-oa · đổi địa chỉ" : "zalo-oa · change address", "3.4s", "890 tok", "$0.0044", vi ? "lỗi" : "error"],
  ];
  return (
    <ConsoleFrame title={vi ? "Vết · 24h" : "Traces · 24h"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
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
            {rows.map((row, rowIndex) => (
              <tr
                key={row[0]}
                data-hit={rowIndex === 0 ? "row-trace" : undefined}
                className={`border-b border-white/10 text-white/80 last:border-0 ${
                  highlight === row[0] ? "bg-white/[0.08]" : ""
                }`}
              >
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

export function LlmsView({ vi }: { vi: boolean }) {
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
        <table className="w-full min-w-[480px] text-left text-sm">
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
              <tr
                key={row[0]}
                data-hit={row[0] === "Google Chat" ? "row-gchat" : row[0] === "Anthropic" ? "row-anthropic" : undefined}
                className="border-b border-white/10 text-white/80 last:border-0"
              >
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

export function Bubble({
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
