import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/brand/Logo";
import { cloudSelfServe, isCloud } from "@/lib/deployment";
import { getLang } from "@/lib/get-lang";
import { t, tr } from "@/lib/i18n";
import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  if (isCloud() && !cloudSelfServe()) return { title: tr(lang, t.signup.selfHostTitle) };
  if (!isCloud()) return { title: tr(lang, t.signup.selfHostTitle) };
  return { title: tr(lang, t.signup.title) };
}

export default async function SignupPage() {
  const lang = await getLang();
  const vi = lang === "vi";
  if (isCloud() && !cloudSelfServe()) {
    redirect("/self-host");
  }
  return (
    <div className="console flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="panel w-full max-w-sm p-6">
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
            <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">{tr(lang, t.nav.unitsToolkit)}</Link>
            {vi ? " — đơn vị không phải token, và instance này không đếm." : " — a unit is not a token, and this instance does not meter them."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
