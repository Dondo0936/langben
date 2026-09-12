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
          {cloud
            ? vi
              ? "Vết Cloud — gói Hobby / Core / Pro / Enterprise sắp ra mắt. Instance này chạy mã nguồn mở."
              : "Vết Cloud — Hobby / Core / Pro / Enterprise are coming soon. This instance is running the open-source build."
            : vi
              ? "Instance tự vận hành — MIT, không giới hạn đơn vị, không billing Cloud."
              : "Self-hosted instance — MIT, unlimited units, no Cloud billing."}
        </p>
        <p className="mt-2">
          <Link href="/docs/units" className="text-accent">
            {vi ? "Bộ công cụ đơn vị" : "Units toolkit"}
          </Link>
          {" · "}
          <Link href="/self-host" className="text-accent">
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
          className={`rounded-md px-3 py-1.5 text-sm ${current === p ? "bg-ink text-white" : "border border-line bg-white"}`}
        >
          {p}
        </button>
      ))}
      <Link
        href="/enterprise"
        className={`rounded-md px-3 py-1.5 text-sm ${current === "enterprise" ? "bg-ink text-white" : "border border-line bg-white"}`}
      >
        enterprise
      </Link>
    </div>
  );
}
