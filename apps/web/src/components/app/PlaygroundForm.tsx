"use client";

import { useState } from "react";

export function PlaygroundForm() {
  const [message, setMessage] = useState("Viết câu trả lời OA khi khách muốn đổi size.");
  const [out, setOut] = useState("");
  const [pending, setPending] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await fetch("/api/playground", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, provider: "anthropic" }),
    });
    const json = await res.json();
    setPending(false);
    if (!res.ok) {
      setOut(json.error || "Lỗi playground.");
      return;
    }
    setOut(JSON.stringify(json.response ?? json, null, 2));
  }

  return (
    <form onSubmit={run} className="grid gap-4 lg:grid-cols-2">
      <div>
        <textarea className="h-48 w-full border border-line bg-black p-3 text-sm" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button disabled={pending} className="mt-3 h-9 bg-ink px-4 text-sm text-paper">
          {pending ? "Đang gọi…" : "Chạy & ghi vết"}
        </button>
      </div>
      <pre className="panel min-h-48 overflow-auto p-3 font-mono text-xs">{out || "Output"}</pre>
    </form>
  );
}
