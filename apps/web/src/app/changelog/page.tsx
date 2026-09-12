import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

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
          <p className="text-sm text-muted">12 Sep 2026 · v0.3.1</p>
          <h2 className="mt-1 text-xl font-semibold">
            {vi ? "Ẩn gói hosted — chỉ tự vận hành" : "Hide hosted plans — self-host only"}
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
            <li>{vi ? "Nền WebGL (khói / sao / chuột) kiểu SpaceXAI; tôn trọng prefers-reduced-motion" : "SpaceXAI-style WebGL field (smoke / stars / cursor); respects prefers-reduced-motion"}</li>
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
            <li>{vi ? "Bộ công cụ /docs/units: đơn vị ≠ token" : "Toolkit at /docs/units: units ≠ tokens"}</li>
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
