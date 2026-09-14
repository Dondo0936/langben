import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { LangToggle } from "@/components/LangToggle";
import { tr, t } from "@/lib/i18n";
import { consoleSignInUrl } from "@/lib/console-target";
import { VET_GITHUB_ISSUES, VET_GITHUB_REPO } from "@/lib/github";
import type { Lang } from "@/lib/types";

export function MarketingHeader({ lang }: { lang: Lang }) {
  const items = [
    { href: "/#san-pham", label: tr(lang, t.nav.product) },
    { href: "/docs", label: tr(lang, t.nav.docs) },
    { href: "/self-host", label: tr(lang, t.nav.selfHost) },
    { href: "/pricing", label: tr(lang, t.nav.pricing) },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-2 md:flex">
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
          <Link href={consoleSignInUrl()} className="text-[11px] uppercase tracking-[0.14em]">
            {tr(lang, t.nav.login)}
          </Link>
          <Link href="/self-host" className="btn-solid !min-h-0 whitespace-nowrap px-3 py-1.5 text-[11px]">
            {tr(lang, t.nav.selfHost)}
          </Link>
        </div>
      </div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-2 md:hidden">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-ink">
            {item.label}
          </Link>
        ))}
        <Link href="/open-source" className="hover:text-ink">
          {tr(lang, t.nav.openSource)}
        </Link>
      </nav>
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
              ? "Nền tảng quan sát LLM mã nguồn mở cho bot sản xuất Việt Nam. MIT. Tự vận hành trên infra của bạn."
              : "Open-source LLM observability for Vietnamese production bots. MIT. Self-host on your infra."}
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em]">{lang === "vi" ? "Sản phẩm" : "Product"}</div>
          <ul className="space-y-2 text-muted">
            <li><Link href="/self-host" className="hover:text-ink">{tr(lang, t.nav.selfHost)}</Link></li>
            <li><Link href="/pricing" className="hover:text-ink">{tr(lang, t.nav.pricing)}</Link></li>
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
            <li>
              <a href={VET_GITHUB_REPO} className="hover:text-ink" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={VET_GITHUB_ISSUES} className="hover:text-ink" target="_blank" rel="noopener noreferrer">
                Issues
              </a>
            </li>
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
