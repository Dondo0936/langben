"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { t, tr } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function SignupForm({
  lang,
  hobbyBlurb,
  passwordLabel,
  minChars,
  orgName,
  submitLabel,
  pendingLabel,
  hasAccount,
  loginLabel,
  keysOnce,
  continueLabel,
}: {
  lang: Lang;
  hobbyBlurb: string;
  passwordLabel: string;
  minChars: string;
  orgName: string;
  submitLabel: string;
  pendingLabel: string;
  hasAccount: string;
  loginLabel: string;
  keysOnce: string;
  continueLabel: string;
}) {
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
      <div>
        <p className="mt-2 text-sm text-muted">{keysOnce}</p>
        <CopyField label="publicKey" value={ingest.publicKey} />
        <CopyField label="secretKey" value={ingest.secretKey} />
        <button
          type="button"
          className="mt-4 h-9 w-full rounded-md bg-ink text-sm font-medium text-white"
          onClick={() => {
            router.push("/app");
            router.refresh();
          }}
        >
          {continueLabel}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <p className="mt-1 text-sm text-muted">{hobbyBlurb}</p>
      <label className="mt-4 block text-sm">
        Email
        <input required className="mt-1 h-9 w-full rounded-md border border-line px-3 text-[13px]" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm">
        {passwordLabel}
        <input required minLength={8} type="password" className="mt-1 h-9 w-full rounded-md border border-line px-3 text-[13px]" value={password} onChange={(e) => setPassword(e.target.value)} />
        <span className="mt-1 block text-xs text-muted">{minChars}</span>
      </label>
      <label className="mt-3 block text-sm">
        {orgName}
        <input className="mt-1 h-9 w-full rounded-md border border-line px-3 text-[13px]" value={org} onChange={(e) => setOrg(e.target.value)} />
      </label>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <button disabled={pending} className="mt-4 h-9 w-full rounded-md bg-ink text-sm font-medium text-white">
        {pending ? pendingLabel : submitLabel}
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        {hasAccount}{" "}
        <Link href="/login" className="text-accent">{loginLabel}</Link>
      </p>
    </form>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <label className="mt-3 block text-sm">
      {label}
      <div className="mt-1 flex gap-2">
        <input readOnly className="h-9 w-full rounded-md border border-line px-3 font-mono text-xs" value={value} />
        <button
          type="button"
          className="h-9 shrink-0 rounded-md border border-line px-3 text-xs"
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
