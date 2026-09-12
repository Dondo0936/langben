import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { getLang } from "@/lib/get-lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Giá tự vận hành" };

export default async function PricingPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">
          {vi ? "Bạn host · giấy phép MIT" : "You host · MIT license"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Tự vận hành miễn phí. Bạn trả infra." : "Self-host for free. You pay infra."}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {vi
            ? "MIT — toàn bộ tính năng sản phẩm, không giới hạn đơn vị. Docker Compose trên máy bạn."
            : "MIT — all product features, unlimited units. Docker Compose on your machines."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/self-host" className="btn-solid">
            {vi ? "Tự vận hành (Docker)" : "Self-host (Docker)"}
          </Link>
          <Link href="/docs/units" className="btn-ghost">
            {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
          </Link>
        </div>

        <div className="panel mt-10 max-w-xl p-6">
          <h2 className="text-xl font-semibold">{vi ? "Mã nguồn mở" : "Open Source"}</h2>
          <p className="mt-1 text-3xl font-semibold">{vi ? "Miễn phí" : "Free"}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{vi ? "MIT — toàn bộ tính năng sản phẩm, không giới hạn đơn vị" : "MIT — all product features, unlimited units"}</li>
            <li>Docker Compose / Kubernetes</li>
            <li>{vi ? "Hỗ trợ cộng đồng GitHub" : "GitHub community support"}</li>
            <li>{vi ? "Dữ liệu ở infra của bạn" : "Data on your infrastructure"}</li>
          </ul>
          <Link href="/self-host" className="btn-solid mt-6">
            {vi ? "Hướng dẫn deploy" : "Deployment guide"}
          </Link>
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
