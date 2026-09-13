"use client";

import { useState } from "react";

export function CopyHookUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const https = url.startsWith("https://");
  return (
    <div className="mb-4">
      <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
        <span className="break-all">{url}</span>
        <button
          type="button"
          className="h-7 border border-white/25 px-2 text-[11px] uppercase tracking-[0.12em] text-ink"
          onClick={() => {
            void navigator.clipboard.writeText(url);
            setCopied(true);
          }}
        >
          {copied ? "Đã chép" : "Sao chép"}
        </button>
      </p>
      {https ? null : (
        <p className="mt-1 text-xs text-muted">
          Zalo Bot chỉ nhận URL https://. Chạy tunnel (cloudflared hoặc ngrok) tới :43173, đặt VET_PUBLIC_URL
          trong .env, rồi sao chép lại.
        </p>
      )}
    </div>
  );
}
