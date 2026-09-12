"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { t, tr } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function LoginForm({
  lang,
  next,
  passwordLabel,
  submitLabel,
  pendingLabel,
  noOrg,
  signupLabel,
}: {
  lang: Lang;
  next: string;
  passwordLabel: string;
  submitLabel: string;
  pendingLabel: string;
  noOrg: string;
  signupLabel: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("demo@vet.dev");
  const [password, setPassword] = useState("demodemo");
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
    <form onSubmit={onSubmit}>
      <label className="mt-4 block text-sm">
        Email
        <input className="mt-1 h-9 w-full rounded-md border border-line px-3 text-[13px]" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm">
        {passwordLabel}
        <input type="password" className="mt-1 h-9 w-full rounded-md border border-line px-3 text-[13px]" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <button disabled={pending} className="mt-4 h-9 w-full rounded-md bg-ink text-sm font-medium text-white">
        {pending ? pendingLabel : submitLabel}
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        {noOrg}{" "}
        <Link href="/signup" className="text-accent">{signupLabel}</Link>
      </p>
    </form>
  );
}
