"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PlanId } from "@/lib/types";

const SELF_SERVE: PlanId[] = ["hobby", "core", "pro"];

export function PlanSwitcher({ current, cloud }: { current: PlanId; cloud: boolean }) {
  const router = useRouter();
  if (!cloud) {
    return <p className="text-sm text-muted">Instance tự vận hành — MIT, không giới hạn đơn vị, không billing Cloud.</p>;
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
          className={`rounded-full px-3 py-1.5 text-sm ${current === p ? "bg-ink text-highlight" : "border border-line bg-white"}`}
        >
          {p}
        </button>
      ))}
      <Link
        href="/enterprise"
        className={`rounded-full px-3 py-1.5 text-sm ${current === "enterprise" ? "bg-ink text-highlight" : "border border-line bg-white"}`}
      >
        enterprise
      </Link>
    </div>
  );
}
