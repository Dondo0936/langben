"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { t, tr } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function SignupForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ingest, setIngest] = useState<{ publicKey: string; secretKey: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, org }),
    });
    const json = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      if (res.status === 409) setError(tr(lang, t.signup.emailTaken));
      else if (res.status === 400) setError(tr(lang, t.signup.minChars));
      else setError(tr(lang, t.signup.genericError));
      return;
    }
    if (json.ingest?.publicKey && json.ingest?.secretKey) {
      setIngest(json.ingest);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  if (ingest) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6">
          <Wordmark />
          <h1 className="mt-4 text-xl font-semibold">{tr(lang, t.signup.title)}</h1>
          <p className="mt-2 text-sm text-muted">{tr(lang, t.signup.keysOnce)}</p>
          <CopyField label="publicKey" value={ingest.publicKey} />
          <CopyField label="secretKey" value={ingest.secretKey} />
          <button
            type="button"
            className="mt-4 w-full rounded-full bg-ink py-2 text-sm font-medium text-highlight"
            onClick={() => {
              router.push("/app");
              router.refresh();
            }}
          >
            {tr(lang, t.signup.continue)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-6">
        <Wordmark />
        <h1 className="mt-4 text-xl font-semibold">{tr(lang, t.signup.title)}</h1>
        <p className="mt-1 text-sm text-muted">{tr(lang, t.signup.hobbyBlurb)}</p>
        <label className="mt-4 block text-sm">
          Email
          <input required className="mt-1 w-full rounded-lg border border-line px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mt-3 block text-sm">
          {tr(lang, t.auth.password)}
          <input required minLength={8} type="password" className="mt-1 w-full rounded-lg border border-line px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="mt-1 block text-xs text-muted">{tr(lang, t.signup.minChars)}</span>
        </label>
        <label className="mt-3 block text-sm">
          {tr(lang, t.signup.orgName)}
          <input className="mt-1 w-full rounded-lg border border-line px-3 py-2" value={org} onChange={(e) => setOrg(e.target.value)} />
        </label>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={pending} className="mt-4 w-full rounded-full bg-ink py-2 text-sm font-medium text-highlight">
          {pending ? tr(lang, t.signup.pending) : tr(lang, t.signup.submit)}
        </button>
        <p className="mt-3 text-center text-sm text-muted">
          {tr(lang, t.signup.hasAccount)}{" "}
          <Link href="/login" className="text-accent">{tr(lang, t.nav.login)}</Link>
        </p>
      </form>
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <label className="mt-3 block text-sm">
      {label}
      <div className="mt-1 flex gap-2">
        <input readOnly className="w-full rounded-lg border border-line px-3 py-2 font-mono text-xs" value={value} />
        <button
          type="button"
          className="shrink-0 rounded-lg border border-line px-3 text-xs"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </label>
  );
}
