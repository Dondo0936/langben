"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-xs text-muted hover:text-ink"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        router.replace("/");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
