import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { PlatformTour } from "@/components/marketing/PlatformTour";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
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
        <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-16 md:py-24">
          <p className="eyebrow rise">{vi ? "Mã nguồn mở · MIT · tự vận hành hôm nay" : "Open source · MIT · self-host today"}</p>
          <h1 className="rise rise-d1 mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-7xl">
            {tr(lang, t.tagline)}
          </h1>
          <p className="rise rise-d2 mt-6 max-w-2xl text-lg text-muted">
            {vi
              ? "Langfuse nhìn thấy messages.create. Bot production Việt Nam đi từ Zalo qua FPT hoặc Viettel, rồi LLM, TTS, rồi trả lời. Vết ghi cả lộ trình đó. Giấy phép MIT, tự host miễn phí trên infra của bạn."
              : "Langfuse sees messages.create. A Vietnamese production bot goes from Zalo through FPT or Viettel, then the LLM, TTS, and the reply. Vết traces that whole route. MIT license, self-host for free on your infra."}
          </p>
          <div className="rise rise-d3 mt-10 flex flex-wrap gap-3">
            <Link href="/self-host" className="btn-solid">
              {vi ? "Tự vận hành (Docker)" : "Self-host (Docker)"}
            </Link>
            <Link href={consoleSignInUrl()} className="btn-ghost">
              {tr(lang, t.nav.demo)}
            </Link>
            <Link href="/docs" className="btn-ghost">
              {tr(lang, t.nav.docs)}
            </Link>
            <Link href="/docs/units" className="inline-flex items-center px-3 text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">
              {vi ? "Đơn vị là gì?" : "What is a unit?"} →
            </Link>
          </div>
          <p className="rise rise-d3 mt-4 text-sm text-muted">
            {vi ? "OSS không giới hạn đơn vị. Bạn trả infra." : "OSS has unlimited units. You pay infra."}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            {logos.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="san-pham">
          <PlatformTour lang={lang} />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" id="module">
          <ProductPreview lang={lang} />
        </section>

        <section className="border-y border-white/10 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              {vi ? "Mở, không khóa dữ liệu" : "Open platform, no lock-in"}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">MIT</h3>
                <p className="mt-2 text-sm text-muted">
                  {vi
                    ? "Toàn bộ tính năng sản phẩm nằm trong giấy phép MIT. Fork, sửa, đóng góp. Không nhánh ee/."
                    : "All product features ship under MIT. Fork, modify, contribute. No ee/ split in v1."}
                </p>
              </div>
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">{vi ? "Tự vận hành" : "Self-host"}</h3>
                <p className="mt-2 text-sm text-muted">
                  {vi
                    ? "docker compose up. Không giới hạn đơn vị. Dữ liệu ở infra của bạn."
                    : "docker compose up. Unlimited units. Data stays on your infra."}
                </p>
              </div>
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">
                  {vi ? "Console" : "Console"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {vi
                    ? "Langfuse OSS + overlay Vết: Kênh, Lộ trình, hội thoại Zalo / Lark / Google Chat."
                    : "Langfuse OSS plus a Vết overlay: Channels, Routes, Zalo / Lark / Google Chat replay."}
                </p>
              </div>
            </div>
            <Link href="/open-source" className="mt-8 inline-block text-[12px] uppercase tracking-[0.14em] text-ink">
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
                  ? "MIT, docker compose up, không giới hạn đơn vị. Bạn trả infra."
                  : "MIT, docker compose up, unlimited units. You pay infra."}
              </p>
            </div>
            <Link href="/pricing" className="text-[12px] uppercase tracking-[0.14em] text-ink">
              {vi ? "Giá tự vận hành →" : "Self-host pricing →"}
            </Link>
          </div>
          <div className="panel mb-6 p-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em]">{vi ? "Mã nguồn mở" : "Open Source"}</div>
            <div className="mt-2 text-3xl font-semibold">{vi ? "Miễn phí" : "Free"}</div>
            <p className="mt-3 max-w-xl text-sm text-muted">
              {vi
                ? "MIT, docker compose up, không giới hạn đơn vị. Bạn trả infra."
                : "MIT, docker compose up, unlimited units. You pay infra."}
            </p>
            <Link href="/self-host" className="btn-solid mt-5">
              {vi ? "Hướng dẫn deploy" : "Deployment guide"}
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link href="/docs/units" className="text-ink">{vi ? "Giải thích đơn vị" : "What a unit is"}</Link>
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold">{vi ? "Câu hỏi thường gặp" : "FAQ"}</h2>
          <dl className="mt-6 space-y-6 text-sm">
            {(vi
              ? [
                  ["Vết khác gì một bản Langfuse dán sticker?", "Langfuse thấy lần gọi LLM. Vết thấy Zalo vào, FPT NLU, TTS Viettel và tin ra trong cùng một phiên. UI tiếng Việt gốc, không dịch trình duyệt."],
                  ["Tự host có thật sự miễn phí?", "Có. MIT, docker compose up, không giới hạn đơn vị. Bạn trả infra."],
                  ["Đơn vị (unit) là gì?", "Không phải token. Mỗi vết, quan sát, và điểm đánh giá là một đơn vị. Tự vận hành không đếm. Xem /docs/units."],
                  ["Vertex khác Google Chat chứ?", "Có. Vertex/Foundry/Bedrock là lớp mô hình. Google Chat và Teams là kênh. Tách menu: Kết nối LLM vs Kênh."],
                ]
              : [
                  ["Is this a Langfuse reskin?", "Langfuse sees the LLM call. Vết sees Zalo in, FPT NLU, Viettel TTS and the reply in the same session. Native Vietnamese chrome."],
                  ["Is self-hosting actually free?", "Yes. MIT, docker compose up, unlimited units. You pay infra."],
                  ["What is a unit?", "Not a token. Each trace, observation, and score is one unit. Self-host does not meter them. See /docs/units."],
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

        <section className="border-t border-white/10 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-semibold">
              {vi ? "Tự host tonight." : "Self-host tonight."}
            </h2>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/self-host" className="btn-solid">
                docker compose up
              </Link>
              <Link href="/docs" className="btn-ghost">
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
