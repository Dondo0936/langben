import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tài liệu" };

const sdkSnippet = `import Anthropic from "@anthropic-ai/sdk"
import { wrapAnthropic, observe } from "@vet/sdk"

const vet = {
  publicKey: "pk-lf-vet-demo",
  secretKey: "sk-lf-vet-demo",
  baseUrl: "http://localhost:3000",
}

const client = wrapAnthropic(new Anthropic(), vet)

await observe(
  "hoan-tien",
  () =>
    client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 256,
      messages,
    }),
  { ...vet, sessionId, userId, channel: "zalo_oa", tags: ["zalo"] },
)`;

const fptSnippet = `import { wrapFptGetAnswer } from "@vet/sdk"

const getAnswer = wrapFptGetAnswer(fetch, {
  publicKey: "pk-lf-vet-demo",
  secretKey: "sk-lf-vet-demo",
  baseUrl: "http://localhost:3000",
})

await getAnswer({
  channel: "zalo",
  sender_id: userId,
  message: "Chính sách hoàn tiền đơn DH-88421?",
})`;

const composeSnippet = `git submodule update --init --recursive
cp .env.console.example .env
bash scripts/up.sh`;

const zaloSnippet = `curl -X POST http://localhost:43173/hooks/zalo/oa/<projectId> \\
  -H "content-type: application/json" \\
  -H "X-ZEvent-Timestamp: <ts>" \\
  -H "X-ZEvent-Signature: <mac>" \\
  -d '{"event_name":"user_send_text","sender":{"id":"u1"},"message":{"text":"Hoàn tiền DH-88421?"}}'`;

export default async function DocsPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  const cards = [
    {
      href: "/self-host",
      title: vi ? "Tự vận hành" : "Self-host",
      body: vi ? "Docker Compose trên infra của bạn." : "Docker Compose on your infra.",
    },
    {
      href: "#console",
      title: vi ? "Console" : "Console",
      body: vi ? "Cây, kênh, lộ trình, input/output model." : "Tree, channels, routes, model input/output.",
    },
    {
      href: "#sdk",
      title: "SDK",
      body: vi ? "observe, Anthropic, FPT.AI, OTLP." : "observe, Anthropic, FPT.AI, OTLP.",
    },
    {
      href: "#kenh",
      title: vi ? "Kênh" : "Channels",
      body: vi ? "Zalo, FPT.AI, Viettel, Lark, Google Chat." : "Zalo, FPT.AI, Viettel, Lark, Google Chat.",
    },
  ];
  const surfaces = [
    {
      k: vi ? "Vết" : "Traces",
      v: vi ? "Danh sách lượt, token, chi phí." : "Turn list, tokens, cost.",
    },
    {
      k: vi ? "Cây" : "Tree",
      v: vi
        ? "Chunk, embeddings, retrieval, tool call, rồi input/output OpenAI và Anthropic."
        : "Chunking, embeddings, retrieval, tool calls, then OpenAI and Anthropic input/output.",
    },
    {
      k: vi ? "Kênh" : "Channels",
      v: vi
        ? "Webhook Zalo OA, FPT.AI, Lark, Google Chat. Viettel ASR/TTS đi trên cây Zalo. Teams ghi span qua SDK hoặc OTLP."
        : "Webhooks for Zalo OA, FPT.AI, Lark, Google Chat. Viettel ASR/TTS rides the Zalo tree. Teams uses the SDK or OTLP.",
    },
    {
      k: vi ? "Lộ trình" : "Routes",
      v: vi
        ? "Inbound, RAG, tools, generation, outbound trên một luồng."
        : "Inbound, RAG, tools, generation, outbound on one path.",
    },
    {
      k: "LLM",
      v: vi
        ? "OpenAI, Anthropic, FPT Factory, Bedrock, Vertex, Foundry."
        : "OpenAI, Anthropic, FPT Factory, Bedrock, Vertex, Foundry.",
    },
  ];

  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">{vi ? "MIT · tự vận hành" : "MIT · self-host"}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          {vi ? "Tài liệu" : "Docs"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          {vi
            ? "Từ tin nhắn Zalo đến câu trả lời, bạn nhìn thấy agent đi từng bước. Sau docker compose: marketing :43173, console :3000."
            : "From the Zalo message to the reply, you see each step the agent takes. After docker compose: marketing :43173, console :3000."}
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="panel block p-4 transition hover:border-white/30"
            >
              <div className="text-sm font-medium">{card.title}</div>
              <p className="mt-1 text-sm text-muted">{card.body}</p>
            </Link>
          ))}
        </div>

        <section id="console" className="scroll-mt-24">
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">
            {vi ? "Bạn thấy gì trong console" : "What the console shows"}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {vi
              ? "Console là Langfuse OSS với overlay Vết. Langfuse ghi lần gọi model. Vết ghi cả lộ trình kênh, RAG và tool trên cùng một lượt."
              : "The console is Langfuse OSS with a Vết overlay. Langfuse records the model call. Vết records the channel, RAG, and tool path on the same turn."}
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {surfaces.map((row) => (
              <div key={row.k} className="panel p-4">
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">{row.k}</div>
                <p className="mt-2 text-sm text-muted">{row.v}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="self-host" className="scroll-mt-24">
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">
            {vi ? "Chạy trên máy bạn" : "Run it on your machine"}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {vi
              ? "scripts/up.sh gắn overlay Vết, build console, rồi docker compose up. Lần đầu mất vài phút. Chi tiết biến môi trường nằm ở trang Tự vận hành."
              : "scripts/up.sh applies the Vết overlay, builds the console, then runs docker compose up. The first run takes a few minutes. Environment variables live on the Self-host page."}
          </p>
          <pre className="panel mt-4 overflow-x-auto p-4 font-mono text-[12px]">{composeSnippet}</pre>
          <p className="mt-3 text-sm text-muted">
            {vi
              ? "Marketing http://localhost:43173. Console http://localhost:3000. Tài khoản local: demo@vet.dev / demodemo."
              : "Marketing http://localhost:43173. Console http://localhost:3000. Local login: demo@vet.dev / demodemo."}
          </p>
          <Link href="/self-host" className="btn-solid mt-4">
            {vi ? "Hướng dẫn deploy" : "Deployment guide"}
          </Link>
        </section>

        <section id="sdk" className="scroll-mt-24">
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">
            {vi ? "Gửi bước đi của agent" : "Send each agent step"}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {vi
              ? "Local demo dùng khóa Langfuse pk-lf-vet-demo / sk-lf-vet-demo. Trỏ baseUrl về http://localhost:3000. Production: copy key trong console của bạn. Đừng gửi khóa OpenAI, Anthropic, AWS, GCP hay Azure vào Vết. Chỉ gửi trace."
              : "The local demo uses Langfuse keys pk-lf-vet-demo / sk-lf-vet-demo. Point baseUrl at http://localhost:3000. In production, copy keys from your console. Do not send OpenAI, Anthropic, AWS, GCP, or Azure keys to Vết. Send traces only."}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            {vi
              ? "@vet/sdk nằm trong packages/sdk-js của repo này. Chưa phát hành trên npm. Console nói API Langfuse, nên SDK Langfuse cũng trỏ được vào cùng baseUrl."
              : "@vet/sdk lives in packages/sdk-js in this repo. It is not on npm yet. The console speaks the Langfuse API, so a Langfuse SDK can use the same baseUrl."}
          </p>
          <pre className="panel mt-4 overflow-x-auto p-4 font-mono text-[12px]">{sdkSnippet}</pre>
          <p className="mt-6 text-sm font-medium">{vi ? "FPT.AI Conversation" : "FPT.AI Conversation"}</p>
          <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-[12px]">{fptSnippet}</pre>
        </section>

        <section id="kenh" className="scroll-mt-24">
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">
            {vi ? "Kênh production Việt Nam" : "Vietnamese production channels"}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {vi
              ? "Trên Kênh, dán webhook vào Zalo OA, FPT.AI, Lark hoặc Google Chat. Viettel ASR/TTS hiện trên cùng một cây với lượt Zalo, không phải webhook riêng."
              : "On Channels, paste the webhook into Zalo OA, FPT.AI, Lark, or Google Chat. Viettel ASR/TTS shows on the same tree as the Zalo turn. It is not a separate webhook."}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            {vi
              ? "Zalo OA bắt chữ ký X-ZEvent-Signature. Hook sai chữ ký trả 401 và không ghi lượt."
              : "Zalo OA requires the X-ZEvent-Signature header. A bad signature returns 401 and does not write a turn."}
          </p>
          <pre className="panel mt-4 overflow-x-auto p-4 font-mono text-[12px]">{zaloSnippet}</pre>
          <p className="mt-3 text-sm text-muted">
            {vi
              ? "Thử local không cần app Zalo, Lark hay Google: nút Gửi thử trên trang Kênh (inbound), hoặc node scripts/zalo-fixture.mjs, zalo-bot-fixture.mjs, lark-fixture.mjs, gchat-fixture.mjs. Tin nhắn Zalo thật cần Cloudflare Tunnel tới :43173. Hướng dẫn: trang Tự vận hành, mục Cloudflare Tunnel. Teams không có webhook tin nhắn như Zalo."
              : "Try locally without a Zalo, Lark, or Google app: Gửi thử on the Channels page (inbound), or node scripts/zalo-fixture.mjs, zalo-bot-fixture.mjs, lark-fixture.mjs, gchat-fixture.mjs. A live Zalo message needs a Cloudflare Tunnel to :43173. Steps: Self-host page, Cloudflare Tunnel. Teams has no messenger webhook like Zalo."}
          </p>
        </section>

        <section id="otlp" className="scroll-mt-24">
          <h2 className="mt-16 text-2xl font-semibold tracking-tight">OTLP</h2>
          <p className="mt-3 max-w-2xl text-muted">
            {vi
              ? "Gửi OTLP vào console (:3000). Marketing :43173 cũng nhận POST /otlp/v1/traces khi LANGFUSE_* được set, rồi ghi tiếp vào console."
              : "Send OTLP to the console (:3000). Marketing :43173 also accepts POST /otlp/v1/traces when LANGFUSE_* is set, then writes through to the console."}
          </p>
        </section>

        <p className="mt-16 text-sm text-muted">
          {vi ? "Giấy phép MIT. Bạn trả infra." : "MIT license. You pay infra."}{" "}
          <Link href="/pricing" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Giá tự vận hành" : "Self-host pricing"}
          </Link>
          {" · "}
          <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Đơn vị là gì" : "What a unit is"}
          </Link>
        </p>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
