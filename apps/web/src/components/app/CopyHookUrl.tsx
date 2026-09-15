"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hookUrl } from "@/lib/webhook-origin";

function settingsApi(projectId: string) {
  return `/api/settings?project=${encodeURIComponent(projectId)}`;
}

export function CopyHookUrl({
  path,
  origin,
  requireHttps,
  projectId,
}: {
  path: string;
  origin: string | null;
  requireHttps: boolean;
  projectId: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(origin ?? "");
  const [saved, setSaved] = useState(origin);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  const url = hookUrl(saved, path);
  const https = Boolean(saved?.startsWith("https://"));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(settingsApi(projectId), {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ webhookOrigin: draft }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      webhookOrigin?: string | null;
    };
    if (!res.ok) {
      setMsg(data.error || "Không lưu được.");
      return;
    }
    setSaved(data.webhookOrigin ?? null);
    setDraft(data.webhookOrigin ?? "");
    setCopied(false);
    setMsg("Đã lưu.");
    router.refresh();
  }

  return (
    <div className="mb-4 space-y-3">
      <form onSubmit={(e) => void save(e)} className="max-w-xl space-y-1">
        <label className="block text-sm">
          Origin công khai
          <input
            className="mt-1 h-9 w-full rounded-md border border-line px-3 font-mono text-xs"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://your-public-host"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <p className="text-xs text-muted">
          Host Zalo / Lark / Chat gọi vào. Để trống cho đến khi bạn có một origin
          https công khai. Gửi thử không cần.
        </p>
        <button type="submit" className="h-8 border border-white/25 px-3 text-[11px] uppercase tracking-[0.12em]">
          Lưu origin
        </button>
        {msg ? <span className="ml-2 text-xs text-muted">{msg}</span> : null}
      </form>
      <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
        <span className="break-all">{url ?? `https://<host>${path}`}</span>
        <button
          type="button"
          className="h-7 border border-white/25 px-2 text-[11px] uppercase tracking-[0.12em] text-ink disabled:opacity-40"
          disabled={!url}
          onClick={() => {
            if (!url) return;
            void navigator.clipboard.writeText(url);
            setCopied(true);
          }}
        >
          {copied ? "Đã chép" : "Sao chép"}
        </button>
      </p>
      {requireHttps && saved && !https ? (
        <p className="text-xs text-muted">Zalo Bot cần URL bắt đầu bằng https://.</p>
      ) : null}
    </div>
  );
}
