import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { LangToggle } from "@/components/LangToggle";
import { tr, t } from "@/lib/i18n";
import { consoleSignInUrl } from "@/lib/console-target";
import type { Lang } from "@/lib/types";

export function MarketingHeader({ lang }: { lang: Lang }) {
  const items = [
    { href: "/#san-pham", label: tr(lang, t.nav.product) },
    { href: "/docs", label: tr(lang, t.nav.docs) },
    { href: "/self-host", label: tr(lang, t.nav.selfHost) },
    { href: "/pricing/self-host", label: tr(lang, t.nav.pricing) },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-2 lg:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link href="/open-source" className="hover:text-ink">
            {tr(lang, t.nav.openSource)}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LangToggle lang={lang} />
          <Link href="/pricing" className="hidden text-[11px] uppercase tracking-[0.14em] text-muted xl:inline">
            {tr(lang, t.nav.signup)}
          </Link>
          <Link href={consoleSignInUrl()} className="hidden text-[11px] uppercase tracking-[0.14em] xl:inline">
            {tr(lang, t.nav.login)}
          </Link>
          <Link href="/self-host" className="btn-solid !min-h-0 whitespace-nowrap px-3 py-1.5 text-[11px]">
            {tr(lang, t.nav.selfHost)}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-white/10 bg-black/70 text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <Wordmark light />
          <p className="mt-3 max-w-xs text-sm text-muted">
            {lang === "vi"
              ? "Nền tảng quan sát LLM mã nguồn mở cho bot sản xuất Việt Nam. MIT. Tự vận hành hôm nay; Cloud sắp ra mắt."
              : "Open-source LLM observability for Vietnamese production bots. MIT. Self-host today; Cloud is coming soon."}
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em]">{lang === "vi" ? "Sản phẩm" : "Product"}</div>
          <ul className="space-y-2 text-muted">
            <li><Link href="/self-host" className="hover:text-ink">{tr(lang, t.nav.selfHost)}</Link></li>
            <li><Link href="/pricing/self-host" className="hover:text-ink">{tr(lang, t.nav.pricing)}</Link></li>
            <li><Link href="/pricing" className="hover:text-ink">{tr(lang, t.nav.signup)}</Link></li>
            <li><Link href="/docs/units" className="hover:text-ink">{tr(lang, t.nav.unitsToolkit)}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em]">{lang === "vi" ? "Tài nguyên" : "Resources"}</div>
          <ul className="space-y-2 text-muted">
            <li><Link href="/docs" className="hover:text-ink">{tr(lang, t.nav.docs)}</Link></li>
            <li><Link href="/open-source" className="hover:text-ink">{tr(lang, t.nav.openSource)}</Link></li>
            <li><Link href="/changelog" className="hover:text-ink">{tr(lang, t.nav.changelog)}</Link></li>
            <li><Link href="/security" className="hover:text-ink">{lang === "vi" ? "Bảo mật" : "Security"}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em]">{lang === "vi" ? "Pháp lý" : "Legal"}</div>
          <ul className="space-y-2 text-muted">
            <li><Link href="/open-source" className="hover:text-ink">MIT License</Link></li>
            <li>© 2026 Vết</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
