import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { UnitToolkit } from "@/components/marketing/UnitToolkit";
import { getLang } from "@/lib/get-lang";
import { CLOUD_PLANS, formatUsd } from "@/lib/plans";

export const dynamic = "force-dynamic";
export const metadata = { title: "Giá Cloud — sắp ra mắt" };

export default async function PricingPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  return (
    <div>
      <MarketingHeader lang={lang} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">
          {vi ? "Vết Cloud — sắp ra mắt" : "Vết Cloud — coming soon"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {vi ? "Cloud chưa mở. Tự vận hành MIT hôm nay." : "Cloud isn’t open yet. Self-host the MIT build today."}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {vi
            ? "Hobby, Core, Pro, Enterprise đang pending. Cùng codebase sẽ được chúng tôi host sau — chưa có đăng ký, chưa có thanh toán."
            : "Hobby, Core, Pro, and Enterprise are pending. We’ll host the same codebase later — no signup, no billing yet."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/self-host" className="btn-solid">
            {vi ? "Tự vận hành (Docker)" : "Self-host (Docker)"}
          </Link>
          <Link href="/pricing/self-host" className="btn-ghost">
            {vi ? "Giá mã nguồn mở" : "Open-source pricing"}
          </Link>
          <Link href="/docs/units" className="btn-ghost">
            {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
          </Link>
        </div>
        <div className="mt-6 inline-flex border border-white/20 p-1 text-sm">
          <span className="bg-ink px-4 py-1.5 text-paper">{vi ? "Cloud · sắp có" : "Cloud · soon"}</span>
          <Link href="/pricing/self-host" className="px-4 py-1.5">
            {vi ? "Tự vận hành" : "Self-host"}
          </Link>
        </div>

        <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-4">
          {CLOUD_PLANS.map((p) => (
            <div key={p.id} className="relative flex flex-col bg-black/70 p-5 opacity-80">
              <span className="absolute right-4 top-4 border border-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                {vi ? "Sắp có" : "Soon"}
              </span>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="mt-2 text-3xl font-semibold">
                {formatUsd(p.monthlyUsd)}
                <span className="text-sm font-normal text-muted">{vi ? "/tháng" : "/mo"}</span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted">{vi ? p.taglineVi : p.taglineEn}</p>
              <p className="mt-6 text-center text-xs text-muted">{vi ? "Chưa mở đăng ký" : "Signup not open"}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <UnitToolkit lang={lang} />
        </div>
      </main>
      <MarketingFooter lang={lang} />
    </div>
  );
}
