import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";
import { VET_GITHUB_ISSUES, VET_GITHUB_REPO } from "@/lib/github";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nhật ký" };

export default async function ChangelogPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-4xl font-semibold tracking-tight">{vi ? "Nhật ký" : "Changelog"}</h1>
        <article className="mt-8">
          <p className="text-sm text-muted">14 Sep 2026 · v0.3.4</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "Console: Scores, Lộ trình, Hỗ trợ." : "Console: scores, routes, support."}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>
              {vi ? (
                <>
                  Ẩn Cần xử lý (migration Langfuse v4). Hỗ trợ trỏ GitHub{" "}
                  <a href={VET_GITHUB_REPO} className="text-ink underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                    Dondo0936/langben
                  </a>
                  .
                </>
              ) : (
                <>
                  Hide Cần xử lý (Langfuse v4 migration). Support points at GitHub{" "}
                  <a href={VET_GITHUB_REPO} className="text-ink underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                    Dondo0936/langben
                  </a>
                  .
                </>
              )}
            </li>
            <li>
              {vi ? (
                <>
                  Scores: splash trong console;{" "}
                  <Link href="/docs/scores" className="text-ink underline-offset-4 hover:underline">
                    /docs/scores
                  </Link>{" "}
                  trên brochure (không có trên Docker :43173). Lộ trình: mở kênh và phiên. Cài đặt: mục tiếng Việt. Đánh giá agent trên sidebar.
                </>
              ) : (
                <>
                  Scores: console splash;{" "}
                  <Link href="/docs/scores" className="text-ink underline-offset-4 hover:underline">
                    /docs/scores
                  </Link>{" "}
                  on the brochure (not on Docker :43173). Lộ trình: open channel and sessions. Settings nav in Vietnamese. Sidebar group Đánh giá agent.
                </>
              )}
            </li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">14 Sep 2026 · v0.3.3</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "GitHub công khai. Chỉ tự vận hành." : "Public GitHub. Self-host only."}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>
              {vi ? (
                <>
                  Clone:{" "}
                  <a href={VET_GITHUB_REPO} className="text-ink underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                    github.com/Dondo0936/langben
                  </a>
                  . Hỗ trợ:{" "}
                  <a href={VET_GITHUB_ISSUES} className="text-ink underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub Issues
                  </a>{" "}
                  của Vết.
                </>
              ) : (
                <>
                  Clone:{" "}
                  <a href={VET_GITHUB_REPO} className="text-ink underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                    github.com/Dondo0936/langben
                  </a>
                  . Support: Vết{" "}
                  <a href={VET_GITHUB_ISSUES} className="text-ink underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub Issues
                  </a>
                  .
                </>
              )}
            </li>
            <li>
              {vi
                ? "NOTICE bỏ gói Cloud. Bản công khai là MIT docker compose."
                : "NOTICE drops Cloud plans. The public product is MIT docker compose."}
            </li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">13 Sep 2026 · v0.3.2</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "Sidebar console tiếng Việt" : "Vietnamese console sidebar"}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>
              {vi
                ? "Menu Langfuse dùng cùng tiếng Việt với marketing. Kênh và Lộ trình không còn lệch ngôn ngữ."
                : "Langfuse nav uses the same Vietnamese as marketing. Kênh and Lộ trình are no longer the only Vietnamese items."}
            </li>
            <li>
              {vi
                ? "Ẩn Book a call của Langfuse Cloud trên bản tự vận hành."
                : "Hide Langfuse Cloud Book a call on self-host."}
            </li>
            <li>
              {vi
                ? "Tiêu đề trang, empty state và widget Home overlay tiếng Việt. Bảng và form Langfuse vẫn tiếng Anh."
                : "Page titles, empty states, and Home widgets overlay Vietnamese. Langfuse tables and forms stay English."}
            </li>
            <li>
              {vi
                ? "Hỗ trợ tự vận hành bỏ Ask AI / Community Hours. Kênh iframe lưu đúng project trên URL."
                : "Self-host support drops Ask AI / Community Hours. Channel iframe saves against the project on the URL."}
            </li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">12 Sep 2026 · v0.3.1</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "Ẩn gói hosted. Chỉ tự vận hành." : "Hide hosted plans. Self-host only."}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>{vi ? "Marketing: không còn Hobby / Core / Pro / Enterprise hay “sắp có”" : "Marketing: no Hobby / Core / Pro / Enterprise or coming-soon hosted plans"}</li>
            <li>{vi ? "Giá = MIT tự vận hành" : "Pricing = MIT self-host"}</li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">12 Sep 2026 · v0.3.0</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "Giao diện đen trắng + shader" : "Monochrome + shader"}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>{vi ? "Marketing và Kênh: canvas đen, chữ trắng, không accent màu" : "Marketing and Channels: black canvas, white type, no color accent"}</li>
            <li>{vi ? "Nền WebGL khói, sao và chuột. Tôn trọng prefers-reduced-motion." : "WebGL field with smoke, stars, and cursor. Respects prefers-reduced-motion."}</li>
            <li>{vi ? "Console Langfuse ép dark + grayscale overlay" : "Langfuse console forced dark + grayscale overlay"}</li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">10 Sep 2026 · v0.2.0</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "Console = Langfuse OSS" : "Console is Langfuse OSS"}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>{vi ? "Compose: web, worker, Postgres, ClickHouse, Redis, MinIO (:3000)" : "Compose: web, worker, Postgres, ClickHouse, Redis, MinIO (:3000)"}</li>
            <li>{vi ? "Kênh / Lộ trình / hội thoại overlay; hook Zalo ghi ingest Langfuse" : "Kênh / Lộ trình / hội thoại overlay; Zalo hooks write Langfuse ingest"}</li>
            <li>{vi ? "Homemade /app traces chuyển sang console" : "Homemade /app traces redirect to the console"}</li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">10 Sep 2026 · v0.1.1</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "OSS + bộ công cụ đơn vị" : "OSS + units toolkit"}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>{vi ? "Tự vận hành MIT là sản phẩm" : "MIT self-host is the product"}</li>
            <li>
              {vi ? (
                <>
                  Bộ công cụ{" "}
                  <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">
                    /docs/units
                  </Link>
                  : đơn vị ≠ token
                </>
              ) : (
                <>
                  Toolkit at{" "}
                  <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">
                    /docs/units
                  </Link>
                  : units ≠ tokens
                </>
              )}
            </li>
          </ul>
        </article>
        <article className="mt-8">
          <p className="text-sm text-muted">9 Sep 2026 · v0.1.0</p>
          <h2 className="mt-1 text-xl font-semibold">{vi ? "Slice 0 + đóng gói OSS" : "Slice 0 + OSS packaging"}</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted">
            <li>{vi ? "Landing tiếng Việt, tự host MIT" : "Vietnamese landing, MIT self-host"}</li>
            <li>{vi ? "Console: Tổng quan, Vết, Phiên, hội thoại Zalo" : "Console: overview, traces, sessions, Zalo replay"}</li>
            <li>{vi ? "Ingest SDK + webhook Zalo OA (ký MAC)" : "SDK ingest + Zalo OA webhook (MAC)"}</li>
          </ul>
        </article>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
