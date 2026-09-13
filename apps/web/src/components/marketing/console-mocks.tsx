import { useState, type ReactNode } from "react";

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

type TreeNode = {
  id: string;
  hit: string;
  depth: number;
  kind: string;
  name: string;
  meta: string;
};

type IoCopy = { input: string; output: string };

export type TraceTreeId = "zalo-rag" | "lark" | "gchat";

const ZALO_TREE: TreeNode[] = [
  { id: "in", hit: "n-in", depth: 0, kind: "SPAN", name: "zalo.inbound", meta: "12ms" },
  { id: "rag", hit: "n-rag", depth: 0, kind: "SPAN", name: "rag.pipeline", meta: "1.12s" },
  { id: "chunk", hit: "n-chunk", depth: 1, kind: "SPAN", name: "docs.chunk", meta: "84ms · 12 chunks" },
  { id: "embed", hit: "n-embed", depth: 1, kind: "GENERATION", name: "openai.embeddings", meta: "text-embedding-3-small" },
  { id: "index", hit: "n-index", depth: 1, kind: "SPAN", name: "vector.upsert", meta: "95ms · 12 vectors" },
  { id: "retr", hit: "n-retr", depth: 1, kind: "SPAN", name: "retriever.similarity", meta: "top_k=6" },
  { id: "tool", hit: "n-tool", depth: 0, kind: "TOOL", name: "crm.lookup_order", meta: "140ms" },
  { id: "search", hit: "n-search", depth: 0, kind: "TOOL", name: "knowledge.search", meta: "3 hits" },
  { id: "openai", hit: "n-openai", depth: 0, kind: "GENERATION", name: "openai.chat.completions", meta: "gpt-4o · 1.8s" },
  { id: "anthropic", hit: "n-anthropic", depth: 0, kind: "GENERATION", name: "anthropic.messages.create", meta: "sonnet · 1.5s" },
  { id: "out", hit: "n-out", depth: 0, kind: "SPAN", name: "zalo.outbound", meta: "40ms" },
];

const LARK_TREE: TreeNode[] = [
  { id: "lin", hit: "l-in", depth: 0, kind: "SPAN", name: "lark.inbound", meta: "40ms" },
  { id: "lgen", hit: "l-gen", depth: 0, kind: "GENERATION", name: "anthropic.messages.create", meta: "sonnet · 1.7s" },
  { id: "lout", hit: "l-out", depth: 0, kind: "SPAN", name: "lark.outbound", meta: "28ms" },
];

const GCHAT_TREE: TreeNode[] = [
  { id: "gin", hit: "g-in", depth: 0, kind: "SPAN", name: "googlechat.inbound", meta: "30ms" },
  { id: "ggen", hit: "g-gen", depth: 0, kind: "GENERATION", name: "openai.chat.completions", meta: "gpt-4o · 0.9s" },
  { id: "gout", hit: "g-out", depth: 0, kind: "SPAN", name: "googlechat.outbound", meta: "22ms" },
];

const TREES: Record<TraceTreeId, { titleVi: string; titleEn: string; nodes: TreeNode[]; fallbackId: string }> = {
  "zalo-rag": {
    titleVi: "Vết · zalo-oa · RAG hoàn tiền",
    titleEn: "Trace · zalo-oa · refund RAG",
    nodes: ZALO_TREE,
    fallbackId: "anthropic",
  },
  lark: {
    titleVi: "Vết · lark · DM nội bộ",
    titleEn: "Trace · lark · internal DM",
    nodes: LARK_TREE,
    fallbackId: "lin",
  },
  gchat: {
    titleVi: "Vết · google-chat · VPN",
    titleEn: "Trace · google-chat · VPN",
    nodes: GCHAT_TREE,
    fallbackId: "gin",
  },
};

export function traceTreeFromHit(hit?: string): TraceTreeId {
  if (hit?.startsWith("l-")) return "lark";
  if (hit?.startsWith("g-")) return "gchat";
  return "zalo-rag";
}

export function traceHitFromName(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("lark")) return "l-in";
  if (lower.includes("gchat") || lower.includes("google-chat") || lower.includes("google chat")) return "g-in";
  return "n-in";
}

function ioFor(id: string, vi: boolean): IoCopy {
  const table: Record<string, { vi: IoCopy; en: IoCopy }> = {
    in: {
      vi: {
        input: "event=user_send_text\ntext=Chính sách hoàn tiền đơn DH-88421?",
        output: "user_847712 · msg m_1001",
      },
      en: {
        input: "event=user_send_text\ntext=Refund policy for order DH-88421?",
        output: "user_847712 · msg m_1001",
      },
    },
    chunk: {
      vi: {
        input: "docs/chinh-sach-hoan-tien.md · 18 240 chars · splitter=recursive · size=512 · overlap=64",
        output: "12 chunks\nchunk[0] Hoàn tiền 1 đến 3 ngày với đơn paid\nchunk[3] Không hoàn phí vận chuyển",
      },
      en: {
        input: "docs/refund-policy.md · 18,240 chars · splitter=recursive · size=512 · overlap=64",
        output: "12 chunks\nchunk[0] Refund in 1 to 3 days when paid\nchunk[3] Shipping fee is non-refundable",
      },
    },
    embed: {
      vi: {
        input: "openai.embeddings\nmodel=text-embedding-3-small\ninput=12 chunk texts",
        output: "12 vectors × 1536 dim · 1 842 tokens · $0.00002",
      },
      en: {
        input: "openai.embeddings\nmodel=text-embedding-3-small\ninput=12 chunk texts",
        output: "12 vectors × 1536 dim · 1,842 tokens · $0.00002",
      },
    },
    index: {
      vi: {
        input: "upsert namespace=oa-prod\nids=chunk_0..chunk_11\nmetadata={doc, route, lang=vi}",
        output: "indexed=12 · upsert_ms=95",
      },
      en: {
        input: "upsert namespace=oa-prod\nids=chunk_0..chunk_11\nmetadata={doc, route, lang=vi}",
        output: "indexed=12 · upsert_ms=95",
      },
    },
    retr: {
      vi: {
        input: "query=chính sách hoàn tiền DH-88421\ntop_k=6 · metric=cosine",
        output: "chunk_0 0.91\nchunk_3 0.84\nchunk_7 0.79\nchunk_2 0.71",
      },
      en: {
        input: "query=refund policy DH-88421\ntop_k=6 · metric=cosine",
        output: "chunk_0 0.91\nchunk_3 0.84\nchunk_7 0.79\nchunk_2 0.71",
      },
    },
    tool: {
      vi: {
        input: "crm.lookup_order\n{ \"order_id\": \"DH-88421\" }",
        output: "{ \"status\": \"paid\", \"cancellable\": true, \"amount\": 1290000 }",
      },
      en: {
        input: "crm.lookup_order\n{ \"order_id\": \"DH-88421\" }",
        output: "{ \"status\": \"paid\", \"cancellable\": true, \"amount\": 1290000 }",
      },
    },
    search: {
      vi: {
        input: "knowledge.search\nquery=hoàn tiền đơn paid\nfilters={doc:refund}",
        output: "3 hits từ chính sách hoàn tiền.md",
      },
      en: {
        input: "knowledge.search\nquery=refund paid order\nfilters={doc:refund}",
        output: "3 hits from refund-policy.md",
      },
    },
    openai: {
      vi: {
        input:
          "openai.chat.completions\nmodel=gpt-4o\nmessages=[{role:system},{role:user}]\ntools=[crm.lookup_order, knowledge.search]",
        output:
          "tool_calls=[{name:crm.lookup_order, arguments:{order_id:DH-88421}}]\nusage in=1 204 out=86 · $0.0041",
      },
      en: {
        input:
          "openai.chat.completions\nmodel=gpt-4o\nmessages=[{role:system},{role:user}]\ntools=[crm.lookup_order, knowledge.search]",
        output:
          "tool_calls=[{name:crm.lookup_order, arguments:{order_id:DH-88421}}]\nusage in=1,204 out=86 · $0.0041",
      },
    },
    anthropic: {
      vi: {
        input:
          "anthropic.messages.create\nmodel=claude-sonnet-4-5\nsystem=Trả lời OA bằng tiếng Việt\nuser=retrieved chunks + CRM paid/cancellable",
        output:
          "Dạ đơn DH-88421 đã thanh toán, em hủy được ạ. Hoàn tiền trong 1 đến 3 ngày làm việc.\nusage in=2 410 out=64 · $0.0088",
      },
      en: {
        input:
          "anthropic.messages.create\nmodel=claude-sonnet-4-5\nsystem=Reply on OA in Vietnamese\nuser=retrieved chunks + CRM paid/cancellable",
        output:
          "Order DH-88421 is paid and can be cancelled. Refund in 1 to 3 business days.\nusage in=2,410 out=64 · $0.0088",
      },
    },
    rag: {
      vi: {
        input: "rag.pipeline\nquery=Chính sách hoàn tiền đơn DH-88421?",
        output: "chunk → embed → index → retrieve · 6 passages",
      },
      en: {
        input: "rag.pipeline\nquery=Refund policy for order DH-88421?",
        output: "chunk → embed → index → retrieve · 6 passages",
      },
    },
    out: {
      vi: {
        input: "oa_send_text · quote m_1001",
        output: "msg_id=m_1004 · delivered",
      },
      en: {
        input: "oa_send_text · quote m_1001",
        output: "msg_id=m_1004 · delivered",
      },
    },
    lin: {
      vi: {
        input: "event=im.message.receive_v1\ntext=stand-up lúc mấy?",
        output: "ou_88aa · om_1",
      },
      en: {
        input: "event=im.message.receive_v1\ntext=what time is stand-up?",
        output: "ou_88aa · om_1",
      },
    },
    lgen: {
      vi: {
        input: "anthropic.messages.create\nmodel=claude-sonnet-4-5\nuser=stand-up lúc mấy?",
        output: "Stand-up 9:15 hàng ngày trên channel #eng.",
      },
      en: {
        input: "anthropic.messages.create\nmodel=claude-sonnet-4-5\nuser=what time is stand-up?",
        output: "Stand-up is 9:15 daily in #eng.",
      },
    },
    lout: {
      vi: {
        input: "im.message.reply · quote om_1",
        output: "message_id=om_2 · delivered",
      },
      en: {
        input: "im.message.reply · quote om_1",
        output: "message_id=om_2 · delivered",
      },
    },
    gin: {
      vi: {
        input: "event=MESSAGE\ntext=reset mật khẩu VPN\nspace=spaces/abc",
        output: "users/113 · message 1",
      },
      en: {
        input: "event=MESSAGE\ntext=reset VPN password\nspace=spaces/abc",
        output: "users/113 · message 1",
      },
    },
    ggen: {
      vi: {
        input: "openai.chat.completions\nmodel=gpt-4o\nuser=reset mật khẩu VPN",
        output: "Gửi link reset VPN nội bộ. Không dùng credential Vertex.",
      },
      en: {
        input: "openai.chat.completions\nmodel=gpt-4o\nuser=reset VPN password",
        output: "Send the internal VPN reset link. Do not use Vertex credentials.",
      },
    },
    gout: {
      vi: {
        input: "spaces.messages.create · quote message 1",
        output: "message_id=2 · delivered",
      },
      en: {
        input: "spaces.messages.create · quote message 1",
        output: "message_id=2 · delivered",
      },
    },
  };
  const entry = table[id] ?? table.in;
  return vi ? entry.vi : entry.en;
}

export function TraceInspector({
  vi,
  selectedHit,
  onSelectHit,
  treeId,
}: {
  vi: boolean;
  selectedHit?: string;
  onSelectHit?: (hit: string) => void;
  treeId?: TraceTreeId;
}) {
  const tree = TREES[treeId ?? traceTreeFromHit(selectedHit)];
  const [internalHit, setInternalHit] = useState(selectedHit ?? tree.nodes[0]?.hit);
  const currentHit = onSelectHit ? selectedHit : internalHit;
  const selected =
    tree.nodes.find((node) => node.hit === currentHit) ??
    tree.nodes.find((node) => node.id === tree.fallbackId) ??
    tree.nodes[0];
  const io = ioFor(selected.id, vi);
  return (
    <ConsoleFrame title={vi ? tree.titleVi : tree.titleEn}>
      <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="border-b border-white/10 md:border-b-0 md:border-r">
          <div className="border-b border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/40">
            {vi ? "Cây quan sát" : "Observation tree"}
          </div>
          <ol className="max-h-[22rem] overflow-auto py-1 font-mono text-[11px]">
            {tree.nodes.map((node) => {
              const active = node.id === selected.id;
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    data-hit={node.hit}
                    onClick={() => (onSelectHit ? onSelectHit(node.hit) : setInternalHit(node.hit))}
                    style={{ paddingLeft: 12 + node.depth * 16 }}
                    className={`flex w-full items-baseline justify-between gap-2 border-0 py-1.5 pr-3 text-left hover:bg-white/[0.06] ${
                      active ? "bg-white/[0.09] text-ink" : "bg-transparent text-white/75"
                    }`}
                  >
                    <span>
                      <span className="mr-2 text-[9px] uppercase tracking-[0.12em] text-white/35">{node.kind}</span>
                      {node.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-white/40">{node.meta}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <div>
          <div className="border-b border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/40">
            {vi ? "Input / output" : "Input / output"}
          </div>
          <div className="space-y-3 p-3 text-[12px] leading-relaxed">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Input</div>
              <pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap border-0 bg-white/[0.04] p-2 text-[11px] text-white/80">
                {io.input}
              </pre>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-white/40">Output</div>
              <pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap border-0 bg-white/[0.04] p-2 text-[11px] text-white/80">
                {io.output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ConsoleFrame>
  );
}

export function ReplayView({ vi }: { vi: boolean }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
      <ConsoleFrame title="Langfuse">
        <div className="space-y-3 p-4 text-sm">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">generation · sonnet</p>
          <div className="bg-white/10 px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/40">messages.create</div>
            <p className="text-white/80">Khách: Chính sách hoàn tiền đơn DH-88421?</p>
          </div>
          <p className="font-mono text-[11px] text-white/45">2 474 tokens · $0.0088</p>
        </div>
      </ConsoleFrame>
      <TraceInspector vi={vi} selectedHit="n-anthropic" />
    </div>
  );
}

export function ChannelsView({
  vi,
  highlight,
  onSelect,
}: {
  vi: boolean;
  highlight?: string;
  onSelect?: (name: string) => void;
}) {
  const rows = [
    ["Zalo OA", "webhook", vi ? "14:02 · RAG hoàn tiền" : "14:02 · refund RAG", "OK"],
    ["FPT.AI Conversation", "NLU", "cancel_order · 0.93", "OK"],
    ["Viettel ASR/TTS", vi ? "giọng" : "voice", "tts · 1.1s", "OK"],
    ["Lark", "webhook", vi ? "stand-up #eng" : "stand-up #eng", "OK"],
    ["Google Chat", "webhook", vi ? "reset VPN" : "reset VPN", "OK"],
    [".NET / Teams", "SDK", "INC-442", "OK"],
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
                data-hit={row[0] === "Zalo OA" ? "row-zalo" : `ch-${row[0]}`}
                onClick={onSelect ? () => onSelect(row[0]) : undefined}
                onKeyDown={
                  onSelect
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelect(row[0]);
                        }
                      }
                    : undefined
                }
                tabIndex={onSelect ? 0 : undefined}
                className={`border-b border-white/10 text-white/80 last:border-0 ${
                  highlight === row[0] ? "bg-white/[0.08]" : ""
                } ${onSelect ? "cursor-pointer hover:bg-white/[0.06]" : ""}`}
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

export function RoutesView({
  vi,
  selectedHit,
  onSelect,
}: {
  vi: boolean;
  selectedHit?: string;
  onSelect?: (hit: string) => void;
}) {
  const routes = [
    {
      name: "zalo-oa → chunk → embed → retrieve → tools → llm → zalo-reply",
      steps: ["zalo.inbound", "docs.chunk", "openai.embeddings", "retriever", "tools", "generation", "zalo.outbound"],
      meta: vi ? "128 vết · 2 lỗi" : "128 traces · 2 errors",
      hit: "route-zalo",
    },
    {
      name: "zalo-oa → viettel-asr → nlu → tts → zalo-reply",
      steps: ["zalo.inbound", "speech.asr", "nlu", "speech.tts", "zalo.outbound"],
      meta: vi ? "41 vết · 0 lỗi" : "41 traces · 0 errors",
      hit: "route-voice",
    },
    {
      name: "lark → claude → lark",
      steps: ["lark.inbound", "generation", "lark.outbound"],
      meta: vi ? "19 vết · 1 lỗi" : "19 traces · 1 error",
      hit: "route-lark",
    },
    {
      name: "google-chat → gpt-4o → google-chat",
      steps: ["googlechat.inbound", "generation", "googlechat.outbound"],
      meta: vi ? "11 vết · 0 lỗi" : "11 traces · 0 errors",
      hit: "route-gchat",
    },
  ];
  return (
    <ConsoleFrame title={vi ? "Lộ trình · demo-bot" : "Routes · demo-bot"}>
      <div className="space-y-3 p-3">
        {routes.map((route) => {
          const active = selectedHit === route.hit;
          const className = `block w-full border p-3 text-left ${
            active ? "border-white/30 bg-white/[0.08]" : "border-white/10 bg-white/[0.03]"
          } ${onSelect ? "cursor-pointer hover:bg-white/[0.06]" : ""}`;
          const body = (
            <>
              <div className="text-sm font-medium">{route.name}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                {route.steps.map((step, index) => (
                  <span key={`${route.name}-${step}`} className="flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-white/80">{step}</span>
                    {index < route.steps.length - 1 ? <span className="text-white/30">→</span> : null}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[12px] text-white/45">{route.meta}</p>
            </>
          );
          if (onSelect) {
            return (
              <button type="button" key={route.name} data-hit={route.hit} onClick={() => onSelect(route.hit)} className={className}>
                {body}
              </button>
            );
          }
          return (
            <div key={route.name} data-hit={route.hit} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </ConsoleFrame>
  );
}

export function TracesView({
  vi,
  highlight,
  onSelect,
}: {
  vi: boolean;
  highlight?: string;
  onSelect?: (name: string) => void;
}) {
  const rows = [
    [vi ? "zalo-oa · RAG hoàn tiền" : "zalo-oa · refund RAG", "4.1s", "5.6k tok", "$0.013", "OK"],
    [vi ? "lark · DM nội bộ" : "lark · internal DM", "1.7s", "142 tok", "$0.0004", "OK"],
    [vi ? "google-chat · VPN" : "google-chat · VPN", "0.9s", "280 tok", "$0.0009", "OK"],
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
                data-hit={rowIndex === 0 ? "row-trace" : `row-${rowIndex}`}
                onClick={onSelect ? () => onSelect(row[0]) : undefined}
                onKeyDown={
                  onSelect
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelect(row[0]);
                        }
                      }
                    : undefined
                }
                tabIndex={onSelect ? 0 : undefined}
                className={`border-b border-white/10 text-white/80 last:border-0 ${
                  highlight === row[0] ? "bg-white/[0.08]" : ""
                } ${onSelect ? "cursor-pointer hover:bg-white/[0.06]" : ""}`}
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

export function LlmsView({
  vi,
  highlight,
  onSelect,
}: {
  vi: boolean;
  highlight?: string;
  onSelect?: (name: string) => void;
}) {
  const rows = [
    ["OpenAI", "gpt-4o / embeddings", "us", vi ? "tools + embed" : "tools + embed"],
    ["Anthropic", "claude-sonnet", "us", "generation"],
    ["FPT Factory", "factory-llm", "vn", "generation"],
    ["Bedrock", "claude-sonnet", "ap-southeast-1", "generation"],
    ["Vertex", "gemini", "asia-southeast1", "generation"],
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
                data-hit={row[0] === "Google Chat" ? "row-gchat" : row[0] === "OpenAI" ? "row-openai" : `llm-${row[0]}`}
                onClick={onSelect ? () => onSelect(row[0]) : undefined}
                onKeyDown={
                  onSelect
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelect(row[0]);
                        }
                      }
                    : undefined
                }
                tabIndex={onSelect ? 0 : undefined}
                className={`border-b border-white/10 text-white/80 last:border-0 ${
                  highlight === row[0] ? "bg-white/[0.08]" : ""
                } ${onSelect ? "cursor-pointer hover:bg-white/[0.06]" : ""}`}
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
