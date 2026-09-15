"use client";

import type { Lang } from "@/lib/types";

export function LangToggle({ lang, variant = "marketing" }: { lang: Lang; variant?: "marketing" | "console" }) {
  async function setLang(next: Lang) {
    await fetch("/api/lang", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang: next }),
    });
    window.location.reload();
  }
  const wrap =
    variant === "console"
      ? "inline-flex border border-line bg-paper-2 p-0.5 text-xs font-medium"
      : "inline-flex border border-white/20 bg-black/40 p-0.5 text-xs font-medium";
  const on =
    variant === "console"
      ? "bg-ink px-2 py-0.5 text-paper"
      : "bg-ink px-2.5 py-1 text-paper";
  const off =
    variant === "console" ? "px-2 py-0.5 text-muted" : "px-2.5 py-1 text-muted";
  return (
    <div className={wrap}>
      <button type="button" onClick={() => setLang("vi")} className={lang === "vi" ? on : off}>
        VI
      </button>
      <button type="button" onClick={() => setLang("en")} className={lang === "en" ? on : off}>
        EN
      </button>
    </div>
  );
}
