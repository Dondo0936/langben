import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
import { CLOUD_PLANS, formatUsd } from "@/lib/plans";
import { consoleSignInUrl } from "@/lib/console-target";

export const dynamic = "force-dynamic";

const logos = ["Zalo OA", "FPT.AI", "Viettel", "Lark", "Google Chat", ".NET", "Anthropic", "Bedrock", "Vertex", "Foundry"];

export default async function LandingPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-16 md:pt-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {vi ? "Mã nguồn mở · MIT · tự vận hành hôm nay" : "Open source · MIT · self-host today"}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-tight md:text-6xl">
            {tr(lang, t.tagline)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            {vi
              ? "Langfuse nhìn thấy messages.create. Bot production Việt Nam là Zalo → FPT / Viettel → LLM → TTS → trả lời. Vết ghi cả lộ trình đó. MIT — tự host miễn phí. Vết Cloud (chúng tôi host) sắp ra mắt."
              : "Langfuse sees messages.create. A Vietnamese production bot is Zalo → FPT / Viettel → LLM → TTS → reply. Vết traces that whole route. MIT — self-host for free. Vết Cloud (we host it) is coming soon."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/self-host" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-highlight">
              {vi ? "Tự vận hành (Docker)" : "Self-host (Docker)"}
            </Link>
            <Link href={consoleSignInUrl()} className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium">
              {tr(lang, t.nav.demo)}
            </Link>
            <Link href="/docs" className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium">
              {tr(lang, t.nav.docs)}
            </Link>
            <Link href="/docs/units" className="rounded-full px-5 py-2.5 text-sm font-medium text-accent">
              {vi ? "Đơn vị là gì?" : "What is a unit?"} →
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted">
            {vi
              ? "OSS không giới hạn đơn vị. Cloud Hobby / Core / Pro / Enterprise — sắp có."
              : "OSS has unlimited units. Cloud Hobby / Core / Pro / Enterprise — coming soon."}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-muted">
            {logos.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="san-pham">
          <ProductPreview />
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {[
            {
              k: vi ? "Hội thoại kênh" : "Channel replay",
              v: vi
                ? "Mở phiên Zalo: tin khách, intent FPT, lần sinh, TTS, tin bot — một cây, không phải log rời."
                : "Open a Zalo session: user text, FPT intent, generation, TTS, bot reply — one tree, not scattered logs.",
            },
            {
              k: vi ? "Kênh Việt Nam" : "Vietnamese channels",
              v: vi
                ? "Zalo OA/Bot (tap webhook), FPT.AI Conversation, Viettel ASR/TTS/NLP, Lark, Google Chat, .NET/Teams."
                : "Zalo OA/Bot (webhook tap), FPT.AI Conversation, Viettel ASR/TTS/NLP, Lark, Google Chat, .NET/Teams.",
            },
            {
              k: vi ? "LLM hyperscaler" : "Hyperscaler LLMs",
              v: vi
                ? "Anthropic, FPT Factory, Bedrock, Vertex, Foundry — generation gắn provider + region, tách biệt kênh Chat/Teams."
                : "Anthropic, FPT Factory, Bedrock, Vertex, Foundry — generations tagged with provider + region, not mixed up with Chat/Teams.",
            },
          ].map((c) => (
            <div key={c.k} className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-lg font-semibold">{c.k}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.v}</p>
            </div>
          ))}
        </section>

        <section className="bg-ink py-16 text-paper">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              {vi ? "Mở, không khóa dữ liệu" : "Open platform, no lock-in"}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="font-medium text-highlight">MIT</h3>
                <p className="mt-2 text-sm text-paper/70">
                  {vi
                    ? "Toàn bộ tính năng sản phẩm nằm trong giấy phép MIT. Fork, sửa, đóng góp. Không nhánh ee/."
                    : "All product features ship under MIT. Fork, modify, contribute. No ee/ split in v1."}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-highlight">{vi ? "Tự vận hành" : "Self-host"}</h3>
                <p className="mt-2 text-sm text-paper/70">
                  {vi
                    ? "docker compose up. Không giới hạn đơn vị. Dữ liệu ở infra của bạn."
                    : "docker compose up. Unlimited units. Data stays on your infra."}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-highlight">
                  Vết Cloud <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-normal">{vi ? "Sắp có" : "Soon"}</span>
                </h3>
                <p className="mt-2 text-sm text-paper/70">
                  {vi
                    ? "Chúng tôi sẽ host cùng codebase. Chưa mở đăng ký — xem bộ công cụ đơn vị để hiểu cách tính khi Cloud ra mắt."
                    : "We will host the same codebase. Signup is not open — see the units toolkit for how metering will work."}
                </p>
              </div>
            </div>
            <Link href="/open-source" className="mt-8 inline-block text-sm text-highlight">
              {vi ? "Xem cách đóng gói mã nguồn mở →" : "See how we package open source →"}
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">{vi ? "Giá" : "Pricing"}</h2>
              <p className="mt-2 text-muted">
                {vi
                  ? "Tự vận hành miễn phí hôm nay. Các gói Cloud đang chờ ra mắt."
                  : "Self-host is free today. Cloud plans are pending launch."}
              </p>
            </div>
            <Link href="/pricing/self-host" className="text-sm text-accent">
              {vi ? "Giá tự vận hành →" : "Self-host pricing →"}
            </Link>
          </div>
          <div className="mb-6 rounded-2xl border border-ink bg-ink p-6 text-paper">
            <div className="text-sm font-medium text-highlight">{vi ? "Mã nguồn mở" : "Open Source"}</div>
            <div className="mt-2 text-3xl font-semibold">{vi ? "Miễn phí" : "Free"}</div>
            <p className="mt-3 max-w-xl text-sm text-paper/70">
              {vi
                ? "MIT, docker compose up, không giới hạn đơn vị. Bạn trả infra."
                : "MIT, docker compose up, unlimited units. You pay infra."}
            </p>
            <Link href="/self-host" className="mt-5 inline-block rounded-full bg-highlight px-4 py-2 text-sm font-medium text-ink">
              {vi ? "Hướng dẫn deploy" : "Deployment guide"}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {CLOUD_PLANS.map((p) => (
              <div key={p.id} className="relative rounded-2xl border border-line bg-white p-5 opacity-70">
                <span className="absolute right-4 top-4 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                  {vi ? "Sắp có" : "Soon"}
                </span>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="mt-2 text-3xl font-semibold">
                  {formatUsd(p.monthlyUsd)}
                  <span className="text-sm font-normal text-muted">{vi ? "/tháng" : "/mo"}</span>
                </div>
                <p className="mt-3 text-sm text-muted">{vi ? p.taglineVi : p.taglineEn}</p>
                <p className="mt-5 text-xs text-muted">{vi ? "Chưa mở đăng ký" : "Signup not open"}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link href="/pricing" className="text-accent">{vi ? "Trang Cloud (sắp có)" : "Cloud page (coming soon)"}</Link>
            {" · "}
            <Link href="/docs/units" className="text-accent">{vi ? "Giải thích đơn vị" : "What a unit is"}</Link>
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold">{vi ? "Câu hỏi thường gặp" : "FAQ"}</h2>
          <dl className="mt-6 space-y-6 text-sm">
            {(vi
              ? [
                  ["Vết khác gì một bản Langfuse dán sticker?", "Langfuse thấy lần gọi LLM. Vết thấy Zalo vào, FPT NLU, TTS Viettel, tin ra — cùng một phiên. UI tiếng Việt gốc, không dịch trình duyệt."],
                  ["Tự host có thật sự miễn phí?", "Có. MIT, docker compose up, không giới hạn đơn vị. Bạn trả infra. Cloud (chúng tôi host) sắp ra mắt."],
                  ["Đơn vị (unit) là gì?", "Không phải token. Mỗi vết, quan sát, và điểm đánh giá là một đơn vị — chỉ Cloud mới đếm. Xem bộ công cụ trên /docs/units."],
                  ["Vertex khác Google Chat chứ?", "Có. Vertex/Foundry/Bedrock là lớp mô hình. Google Chat và Teams là kênh. Tách menu: Kết nối LLM vs Kênh."],
                ]
              : [
                  ["Is this a Langfuse reskin?", "Langfuse sees the LLM call. Vết sees Zalo in, FPT NLU, Viettel TTS, the reply — one session. Native Vietnamese chrome."],
                  ["Is self-hosting actually free?", "Yes. MIT, docker compose up, unlimited units. You pay infra. Cloud (we host) is coming soon."],
                  ["What is a unit?", "Not a token. Each trace, observation, and score is one unit — Cloud will meter them. See /docs/units."],
                  ["Vertex vs Google Chat?", "Vertex/Foundry/Bedrock are model layers. Google Chat and Teams are channels. Separate nav."],
                ]
            ).map(([q, a]) => (
              <div key={q}>
                <dt className="font-medium">{q}</dt>
                <dd className="mt-1 text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-line bg-paper-2 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-semibold">
              {vi ? "Tự host tonight. Cloud khi sẵn sàng." : "Self-host tonight. Cloud when it’s ready."}
            </h2>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/self-host" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-highlight">
                {vi ? "docker compose up" : "docker compose up"}
              </Link>
              <Link href="/docs" className="rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm">
                {tr(lang, t.nav.docs)}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
