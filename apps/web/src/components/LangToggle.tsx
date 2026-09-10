"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/types";

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  async function setLang(next: Lang) {
    await fetch("/api/lang", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang: next }),
    });
    router.refresh();
  }
  return (
    <div className="inline-flex rounded-full border border-line bg-white/70 p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => setLang("vi")}
        className={`rounded-full px-2.5 py-1 ${lang === "vi" ? "bg-ink text-highlight" : "text-muted"}`}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1 ${lang === "en" ? "bg-ink text-highlight" : "text-muted"}`}
      >
        EN
      </button>
    </div>
  );
}
