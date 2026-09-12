"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lang, PlanId } from "@/lib/types";

const SELF_SERVE: PlanId[] = ["hobby", "core", "pro"];

export function PlanSwitcher({
  current,
  cloud,
  live,
  lang,
}: {
  current: PlanId;
  cloud: boolean;
  live: boolean;
  lang: Lang;
}) {
  const router = useRouter();
  const vi = lang === "vi";
  if (!cloud || !live) {
    return (
      <div className="text-sm text-muted">
        <p>
          {vi
            ? "Instance tự vận hành — MIT, không giới hạn đơn vị."
            : "Self-hosted instance — MIT, unlimited units."}
        </p>
        <p className="mt-2">
          <Link href="/docs/units" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
          </Link>
          {" · "}
          <Link href="/self-host" className="text-ink underline-offset-4 hover:underline">
            {vi ? "Tự vận hành" : "Self-host"}
          </Link>
        </p>
      </div>
    );
  }
  async function choose(plan: PlanId) {
    await fetch("/api/org", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    router.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      {SELF_SERVE.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => choose(p)}
          className={`px-3 py-1.5 text-sm ${current === p ? "bg-ink text-paper" : "border border-line"}`}
        >
          {p}
        </button>
      ))}
      <Link
        href="/enterprise"
        className={`px-3 py-1.5 text-sm ${current === "enterprise" ? "bg-ink text-paper" : "border border-line"}`}
      >
        enterprise
      </Link>
    </div>
  );
}
