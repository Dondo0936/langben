"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/types";

export function LangToggle({ lang, variant = "marketing" }: { lang: Lang; variant?: "marketing" | "console" }) {
  const router = useRouter();
  async function setLang(next: Lang) {
    await fetch("/api/lang", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang: next }),
    });
    router.refresh();
    window.location.reload();
  }
  const wrap =
    variant === "console"
      ? "inline-flex rounded-md border border-line bg-white p-0.5 text-xs font-medium"
      : "inline-flex rounded-full border border-line bg-white/70 p-0.5 text-xs font-medium";
  const on =
    variant === "console"
      ? "rounded-sm bg-paper-2 px-2 py-0.5 text-ink"
      : "rounded-full px-2.5 py-1 bg-ink text-highlight";
  const off =
    variant === "console" ? "rounded-sm px-2 py-0.5 text-muted" : "rounded-full px-2.5 py-1 text-muted";
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
