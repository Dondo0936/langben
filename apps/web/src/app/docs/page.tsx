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
          {vi ? "Bắt đầu nhanh: Cloud signup, hoặc trỏ SDK vào instance tự host." : "Quick start: Cloud signup, or point the SDK at your instance."}
        </p>
        <h2 className="mt-10 text-xl font-semibold">1. {vi ? "Dùng Cloud" : "Use Cloud"}</h2>
        <p className="mt-2 text-sm text-muted">
          <Link href="/signup" className="text-accent">{vi ? "Tạo org Hobby" : "Create a Hobby org"}</Link>
          {vi ? " — không cần thẻ. Vùng mặc định Singapore (ap-southeast-1)." : " — no credit card. Default region Singapore (ap-southeast-1)."}
        </p>
        <h2 className="mt-10 text-xl font-semibold">2. SDK JavaScript</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] text-highlight">
{`import Anthropic from "@anthropic-ai/sdk"
import { wrapAnthropic, observe } from "@vet/sdk"

const client = wrapAnthropic(new Anthropic(), {
  publicKey: "${DEMO_KEYS.publicKey}",
  secretKey: "${DEMO_KEYS.secretKey}",
  baseUrl: "http://localhost:43173",
})

await observe("hỗ-trợ-khách", () =>
  client.messages.create({ model: "claude-sonnet-4-5", max_tokens: 256, messages }),
{ publicKey: "${DEMO_KEYS.publicKey}", secretKey: "${DEMO_KEYS.secretKey}", sessionId, userId, tags: ["zalo"] })`}
        </pre>
        <h2 className="mt-10 text-xl font-semibold">3. {vi ? "Webhook Zalo OA" : "Zalo OA webhook"}</h2>
        <p className="mt-2 text-sm text-muted">
          POST /hooks/zalo/oa/prj_demo · mac = sha256(appId + body + timestamp + OA secret) · header X-ZEvent-Signature.
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
        <p className="mt-2 text-sm text-muted">POST /otlp/v1/traces · Basic pk:sk · JSON OTLP.</p>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
