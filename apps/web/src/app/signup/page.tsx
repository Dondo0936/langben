import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/Chrome";
import { cloudSelfServe, isCloud } from "@/lib/deployment";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  if (isCloud() && !cloudSelfServe()) return { title: tr(lang, t.signup.comingSoonTitle) };
  if (!isCloud()) return { title: tr(lang, t.signup.selfHostTitle) };
  return { title: tr(lang, t.signup.title) };
}

export default async function SignupPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  if (isCloud() && !cloudSelfServe()) {
    return (
      <div>
        <MarketingHeader lang={lang} />
        <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
          <Wordmark />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {tr(lang, t.signup.comingSoonTitle)}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{tr(lang, t.signup.comingSoonTitle)}</h1>
          <p className="mt-3 text-muted">{tr(lang, t.signup.comingSoon)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/self-host" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-highlight">
              {vi ? "Tự vận hành (Docker)" : "Self-host (Docker)"}
            </Link>
            <Link href="/docs/units" className="rounded-full border border-ink/20 px-5 py-2.5 text-sm">
              {tr(lang, t.nav.unitsToolkit)}
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            {vi ? "Đã có instance?" : "Already running an instance?"}{" "}
            <Link href="/login" className="text-accent">{tr(lang, t.nav.login)}</Link>
          </p>
        </main>
        <MarketingFooter lang={lang} />
      </div>
    );
  }
  return (
    <div className="console flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-md border border-line bg-white p-6">
        <Wordmark />
        <h1 className="mt-4 text-xl font-semibold">{tr(lang, isCloud() ? t.signup.title : t.signup.selfHostTitle)}</h1>
        <SignupForm
          lang={lang}
          hobbyBlurb={tr(lang, isCloud() ? t.signup.hobbyBlurb : t.signup.selfHostBlurb)}
          passwordLabel={tr(lang, t.auth.password)}
          minChars={tr(lang, t.signup.minChars)}
          orgName={tr(lang, t.signup.orgName)}
          submitLabel={tr(lang, isCloud() ? t.signup.submit : t.signup.selfHostSubmit)}
          pendingLabel={tr(lang, t.signup.pending)}
          hasAccount={tr(lang, t.signup.hasAccount)}
          loginLabel={tr(lang, t.nav.login)}
          keysOnce={tr(lang, t.signup.keysOnce)}
          continueLabel={tr(lang, t.signup.continue)}
        />
        {!isCloud() ? (
          <p className="mt-4 text-center text-xs text-muted">
            <Link href="/docs/units" className="text-accent">{tr(lang, t.nav.unitsToolkit)}</Link>
            {vi ? " — đơn vị không phải token, và instance này không đếm." : " — a unit is not a token, and this instance does not meter them."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
