"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { t, tr } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function LoginForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/app";
  const [email, setEmail] = useState("demo@vet.dev");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setPending(false);
    if (!res.ok) {
      setError(tr(lang, t.auth.badCredentials));
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-6">
        <Wordmark />
        <h1 className="mt-4 text-xl font-semibold">{tr(lang, t.auth.title)}</h1>
        <p className="mt-1 text-sm text-muted">{tr(lang, t.auth.demoHint)}</p>
        <label className="mt-4 block text-sm">
          Email
          <input className="mt-1 w-full rounded-lg border border-line px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mt-3 block text-sm">
          {tr(lang, t.auth.password)}
          <input type="password" className="mt-1 w-full rounded-lg border border-line px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={pending} className="mt-4 w-full rounded-full bg-ink py-2 text-sm font-medium text-highlight">
          {pending ? tr(lang, t.auth.pending) : tr(lang, t.auth.submit)}
        </button>
        <p className="mt-3 text-center text-sm text-muted">
          {tr(lang, t.auth.noOrg)}{" "}
          <Link href="/signup" className="text-accent">{tr(lang, t.nav.signup)}</Link>
        </p>
      </form>
    </div>
  );
}
