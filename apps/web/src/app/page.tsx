import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
import { CLOUD_PLANS, formatUsd } from "@/lib/plans";

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
            {vi ? "Mã nguồn mở · Cloud do chúng tôi host" : "Open source · Cloud we host"}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.12] tracking-tight md:text-6xl">
            {tr(lang, t.tagline)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            {vi
              ? "Langfuse nhìn thấy messages.create. Bot production Việt Nam là Zalo → FPT / Viettel → LLM → TTS → trả lời. Vết ghi cả lộ trình đó. MIT — tự host miễn phí, hoặc dùng Vết Cloud, chúng tôi vận hành giúp bạn."
              : "Langfuse sees messages.create. A Vietnamese production bot is Zalo → FPT / Viettel → LLM → TTS → reply. Vết traces that whole route. MIT — self-host for free, or use Vết Cloud and we run it for you."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-highlight">
              {tr(lang, t.nav.signup)}
            </Link>
            <Link href="/self-host" className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium">
              {vi ? "Tự vận hành (Docker)" : "Self-host (Docker)"}
            </Link>
            <Link href="/demo" className="rounded-full px-5 py-2.5 text-sm font-medium text-accent">
              {tr(lang, t.nav.demo)} →
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted">
            {vi
              ? "Hobby miễn phí · 50k đơn vị/tháng · không cần thẻ."
              : "Hobby is free · 50k units/month · no credit card."}
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
                <h3 className="font-medium text-highlight">Vết Cloud</h3>
                <p className="mt-2 text-sm text-paper/70">
                  {vi
                    ? "Chúng tôi host. Cùng một codebase. Vùng Singapore mặc định. Nâng gói khi bot lên production."
                    : "We host it. Same codebase. Singapore region by default. Upgrade when the bot hits production."}
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
              <h2 className="text-3xl font-semibold tracking-tight">{vi ? "Giá Cloud" : "Cloud pricing"}</h2>
              <p className="mt-2 text-muted">
                {vi
                  ? "Cùng mô hình Hobby / Core / Pro / Enterprise. Tự vận hành thì miễn phí."
                  : "Same Hobby / Core / Pro / Enterprise motion. Self-host is free."}
              </p>
            </div>
            <Link href="/pricing" className="text-sm text-accent">
              {vi ? "Bảng so sánh đầy đủ →" : "Full comparison →"}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {CLOUD_PLANS.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 ${p.highlighted ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}
              >
                <div className="text-sm font-medium">{p.name}</div>
                <div className="mt-2 text-3xl font-semibold">
                  {formatUsd(p.monthlyUsd)}
                  <span className={`text-sm font-normal ${p.highlighted ? "text-paper/60" : "text-muted"}`}>
                    {vi ? "/tháng" : "/mo"}
                  </span>
                </div>
                <p className={`mt-3 text-sm ${p.highlighted ? "text-paper/70" : "text-muted"}`}>
                  {vi ? p.taglineVi : p.taglineEn}
                </p>
                <Link
                  href={p.id === "enterprise" ? "/enterprise" : "/signup"}
                  className={`mt-5 inline-block rounded-full px-4 py-2 text-sm font-medium ${
                    p.highlighted ? "bg-highlight text-ink" : "bg-ink text-highlight"
                  }`}
                >
                  {vi ? p.ctaVi : p.ctaEn}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold">{vi ? "Câu hỏi thường gặp" : "FAQ"}</h2>
          <dl className="mt-6 space-y-6 text-sm">
            {(vi
              ? [
                  ["Vết khác gì một bản Langfuse dán sticker?", "Langfuse thấy lần gọi LLM. Vết thấy Zalo vào, FPT NLU, TTS Viettel, tin ra — cùng một phiên. UI tiếng Việt gốc, không dịch trình duyệt."],
                  ["Tự host có thật sự miễn phí?", "Có. MIT, docker compose up, không giới hạn đơn vị. Bạn trả infra. Cloud là chúng tôi host, tính theo gói + đơn vị."],
                  ["Đơn vị (unit) là gì?", "Mỗi vết, quan sát (span/lần sinh/kênh) và điểm đánh giá gửi lên đều là một đơn vị — cùng cách đóng gói usage-based."],
                  ["Vertex khác Google Chat chứ?", "Có. Vertex/Foundry/Bedrock là lớp mô hình. Google Chat và Teams là kênh. Tách menu: Kết nối LLM vs Kênh."],
                ]
              : [
                  ["Is this a Langfuse reskin?", "Langfuse sees the LLM call. Vết sees Zalo in, FPT NLU, Viettel TTS, the reply — one session. Native Vietnamese chrome."],
                  ["Is self-hosting actually free?", "Yes. MIT, docker compose up, unlimited units. You pay infra. Cloud is us hosting, billed by plan + units."],
                  ["What is a unit?", "Each trace, observation (span/generation/channel), and score you send — the same usage-based packaging."],
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
              {vi ? "Bắt đầu miễn phí trên Cloud, hoặc tự host tonight." : "Start free on Cloud, or self-host tonight."}
            </h2>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/signup" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-highlight">
                {tr(lang, t.nav.signup)}
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
