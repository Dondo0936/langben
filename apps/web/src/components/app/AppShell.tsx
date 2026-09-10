import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LangToggle } from "@/components/LangToggle";
import { isCloud } from "@/lib/deployment";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
import { requireConsole } from "@/lib/console";
import { LogoutButton } from "@/components/app/LogoutButton";
import { CLOUD_PLANS } from "@/lib/plans";
import type { Lang } from "@/lib/types";

const NAV = [
  { href: "/app", key: "overview" as const, group: "tracing" as const },
  { href: "/app/traces", key: "traces" as const, group: "tracing" as const },
  { href: "/app/sessions", key: "sessions" as const, group: "tracing" as const },
  { href: "/app/observations", key: "observations" as const, group: "tracing" as const },
  { href: "/app/channels", key: "channels" as const, group: "channels" as const },
  { href: "/app/routes", key: "routes" as const, group: "routes" as const },
  { href: "/app/studio/playground", key: "playground" as const, group: "studio" as const },
  { href: "/app/studio/prompts", key: "prompts" as const, group: "studio" as const },
  { href: "/app/studio/evals", key: "evals" as const, group: "studio" as const },
  { href: "/app/settings", key: "settings" as const, group: "settings" as const },
];

export async function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: string;
}) {
  const lang = await getLang();
  const { user, project, org } = await requireConsole();
  const cloud = isCloud();
  const plan = CLOUD_PLANS.find((p) => p.id === (org?.plan ?? "hobby"));

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-[220px] shrink-0 flex-col bg-sidebar text-paper md:flex">
        <div className="flex items-center gap-2 px-4 py-4">
          <Logo className="h-6 w-6" />
          <span className="font-semibold">Vết</span>
        </div>
        <nav className="flex-1 space-y-4 px-2 text-sm">
          <NavGroup label={tr(lang, t.app.tracing)} items={NAV.filter((i) => i.group === "tracing")} active={active} lang={lang} />
          <NavGroup label={tr(lang, t.app.channels)} items={NAV.filter((i) => i.group === "channels")} active={active} lang={lang} />
          <NavGroup label={tr(lang, t.app.routes)} items={NAV.filter((i) => i.group === "routes")} active={active} lang={lang} />
          <NavGroup label={tr(lang, t.app.studio)} items={NAV.filter((i) => i.group === "studio")} active={active} lang={lang} />
          <NavGroup label={tr(lang, t.app.settings)} items={NAV.filter((i) => i.group === "settings")} active={active} lang={lang} />
        </nav>
        <div className="px-3 py-3 text-[11px] text-paper/50">
          {cloud ? (
            <Link href="/app/settings" className="rounded bg-white/10 px-2 py-1 text-highlight">
              Cloud · {plan?.name ?? "Hobby"}
            </Link>
          ) : (
            <span>{tr(lang, t.app.selfHostBadge)}</span>
          )}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center justify-between gap-3 border-b border-line bg-white px-3">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="truncate font-medium">{project.name}</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{tr(lang, t.app.tracing)}</span>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle lang={lang} />
            <span className="hidden text-xs text-muted sm:inline">{user?.email ?? (lang === "vi" ? "chưa đăng nhập" : "signed out")}</span>
            <LogoutButton label={lang === "vi" ? "Thoát" : "Sign out"} />
          </div>
        </header>
        <div className="flex gap-1 overflow-x-auto border-b border-line bg-white px-2 py-1 text-xs md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`whitespace-nowrap rounded px-2 py-1 ${active === item.key ? "bg-ink text-highlight" : ""}`}>
              {tr(lang, t.app[item.key])}
            </Link>
          ))}
        </div>
        <main className="min-w-0 flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

function NavGroup({
  label,
  items,
  active,
  lang,
}: {
  label: string;
  items: typeof NAV;
  active: string;
  lang: Lang;
}) {
  return (
    <div>
      <div className="px-2 pb-1 text-[10px] uppercase tracking-wider text-paper/40">{label}</div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block rounded-md px-2 py-1.5 ${active === item.key ? "bg-white/10 text-highlight" : "text-paper/80 hover:bg-white/5"}`}
        >
          {tr(lang, t.app[item.key])}
        </Link>
      ))}
    </div>
  );
}
