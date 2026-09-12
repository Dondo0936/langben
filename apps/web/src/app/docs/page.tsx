import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";
import { DEMO_KEYS } from "@/lib/seed";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tài liệu" };

export default async function DocsPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{vi ? "Tài liệu" : "Documentation"}</h1>
        <p className="mt-3 text-muted">
          {vi
            ? "Bắt đầu bằng instance tự host. Cloud signup chưa mở."
            : "Start on a self-hosted instance. Cloud signup is not open."}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/self-host" className="panel p-4">
            <div className="text-sm font-medium">{vi ? "Tự vận hành" : "Self-host"}</div>
            <p className="mt-1 text-sm text-muted">bash scripts/up.sh</p>
          </Link>
          <Link href="/docs/units" className="panel p-4">
            <div className="text-sm font-medium">{vi ? "Bộ công cụ đơn vị" : "Units toolkit"}</div>
            <p className="mt-1 text-sm text-muted">{vi ? "Đơn vị ≠ token. Máy tính usage." : "Units ≠ tokens. Usage calculator."}</p>
          </Link>
        </div>
        <h2 className="mt-10 text-xl font-semibold">1. {vi ? "Chạy local" : "Run locally"}</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "bash scripts/up.sh — marketing :43173, console :3000. Đăng nhập console:"
            : "bash scripts/up.sh — marketing :43173, console :3000. Console login:"}{" "}
          <code>demo@vet.dev</code> / <code>{DEMO_KEYS.consolePassword}</code>
        </p>
        <h2 className="mt-10 text-xl font-semibold">2. SDK JavaScript</h2>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-[12px]">
{`import Anthropic from "@anthropic-ai/sdk"
import { wrapAnthropic, observe } from "@vet/sdk"

const client = wrapAnthropic(new Anthropic(), {
  publicKey: "${DEMO_KEYS.langfusePublicKey}",
  secretKey: "${DEMO_KEYS.langfuseSecretKey}",
  baseUrl: "http://localhost:3000",
})

await observe("hỗ-trợ-khách", () =>
  client.messages.create({ model: "claude-sonnet-4-5", max_tokens: 256, messages }),
{ publicKey: "${DEMO_KEYS.langfusePublicKey}", secretKey: "${DEMO_KEYS.langfuseSecretKey}", sessionId, userId, tags: ["zalo"] })`}
        </pre>
        <h2 className="mt-10 text-xl font-semibold">3. {vi ? "Webhook Zalo OA" : "Zalo OA webhook"}</h2>
        <p className="mt-2 text-sm text-muted">
          POST /hooks/zalo/oa/prj-vet-demo · mac = sha256(appId + body + timestamp + OA secret) · header X-ZEvent-Signature.
          {vi ? " Sau khi verify, hook ghi vào Langfuse ingest (console :3000)." : " After verify, the hook writes Langfuse ingest (console :3000)."}
        </p>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-[12px]">
{`curl -X POST http://localhost:43173/hooks/zalo/oa/prj-vet-demo \\
  -H "content-type: application/json" \\
  -H "X-ZEvent-Timestamp: TS" \\
  -H "X-ZEvent-Signature: MAC" \\
  -d '{"event_name":"user_send_text","sender":{"id":"u1"},"message":{"text":"hủy đơn"}}'`}
        </pre>
        <p className="mt-2 text-sm text-muted">
          {vi ? "Demo OA secret:" : "Demo OA secret:"} <code>{DEMO_KEYS.zaloOaSecret}</code> · appId <code>{DEMO_KEYS.zaloAppId}</code>
        </p>
        <h2 className="mt-10 text-xl font-semibold">4. {vi ? "Lark / Google Chat (chưa cần app)" : "Lark / Google Chat (no app yet)"}</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "Chưa có Zalo OA cũng chưa cần app Lark/Google. Token demo đã nằm trên Kênh. node scripts/lark-fixture.mjs và node scripts/gchat-fixture.mjs — hoặc nút Gửi thử trên trang kênh."
            : "No Zalo OA and no Lark/Google app required. Demo tokens are already on Channels. node scripts/lark-fixture.mjs and node scripts/gchat-fixture.mjs — or Gửi thử on the channel page."}
        </p>
        <pre className="panel mt-3 overflow-x-auto p-4 font-mono text-[12px]">
{`node scripts/lark-fixture.mjs    # session lark:ou_fixture
node scripts/gchat-fixture.mjs   # session gchat:users_fixture
# or Kênh → Gửi thử → lark:ou_local / gchat:users_local`}
        </pre>
        <h2 className="mt-10 text-xl font-semibold">5. OTLP</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "Dùng OTLP trên console (:3000), hoặc POST /otlp/v1/traces trên :43173 khi LANGFUSE_* được set."
            : "Use OTLP on the console (:3000), or POST /otlp/v1/traces on :43173 when LANGFUSE_* is set."}
        </p>
        <p className="mt-8 text-sm text-muted">
          {vi ? "Vết Cloud (Hobby/Core/Pro) " : "Vết Cloud (Hobby/Core/Pro) "}
          <Link href="/pricing" className="text-ink underline-offset-4 hover:underline">{vi ? "sắp ra mắt" : "is coming soon"}</Link>.
        </p>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
