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
          <Link href="/self-host" className="rounded-2xl border border-ink bg-ink p-4 text-paper">
            <div className="text-sm font-medium text-highlight">{vi ? "Tự vận hành" : "Self-host"}</div>
            <p className="mt-1 text-sm text-paper/70">docker compose up</p>
          </Link>
          <Link href="/docs/units" className="rounded-2xl border border-line bg-white p-4">
            <div className="text-sm font-medium">{vi ? "Bộ công cụ đơn vị" : "Units toolkit"}</div>
            <p className="mt-1 text-sm text-muted">{vi ? "Đơn vị ≠ token. Máy tính usage." : "Units ≠ tokens. Usage calculator."}</p>
          </Link>
        </div>
        <h2 className="mt-10 text-xl font-semibold">1. {vi ? "Chạy local" : "Run locally"}</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "docker compose up — marketing :43173, console :3000. Đăng nhập console:"
            : "docker compose up — marketing :43173, console :3000. Console login:"}{" "}
          <code>demo@vet.dev</code> / <code>{DEMO_KEYS.consolePassword}</code>
        </p>
        <h2 className="mt-10 text-xl font-semibold">2. SDK JavaScript</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] text-highlight">
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
          POST /hooks/zalo/oa/prj_demo · mac = sha256(appId + body + timestamp + OA secret) · header X-ZEvent-Signature.
          {vi ? " Sau khi verify, hook ghi vào Langfuse ingest (console :3000)." : " After verify, the hook writes Langfuse ingest (console :3000)."}
        </p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] text-highlight">
{`curl -X POST http://localhost:43173/hooks/zalo/oa/prj_demo \\
  -H "content-type: application/json" \\
  -H "X-ZEvent-Timestamp: TS" \\
  -H "X-ZEvent-Signature: MAC" \\
  -d '{"event_name":"user_send_text","sender":{"id":"u1"},"message":{"text":"hủy đơn"}}'`}
        </pre>
        <p className="mt-2 text-sm text-muted">
          {vi ? "Demo OA secret:" : "Demo OA secret:"} <code>{DEMO_KEYS.zaloOaSecret}</code> · appId <code>{DEMO_KEYS.zaloAppId}</code>
        </p>
        <h2 className="mt-10 text-xl font-semibold">4. OTLP</h2>
        <p className="mt-2 text-sm text-muted">
          {vi
            ? "Dùng OTLP trên console (:3000), hoặc POST /otlp/v1/traces trên :43173 khi LANGFUSE_* được set."
            : "Use OTLP on the console (:3000), or POST /otlp/v1/traces on :43173 when LANGFUSE_* is set."}
        </p>
        <p className="mt-8 text-sm text-muted">
          {vi ? "Vết Cloud (Hobby/Core/Pro) " : "Vết Cloud (Hobby/Core/Pro) "}
          <Link href="/pricing" className="text-accent">{vi ? "sắp ra mắt" : "is coming soon"}</Link>.
        </p>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
