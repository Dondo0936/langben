"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChannelConfig } from "@/lib/types";

const SAVED = "đã lưu — nhập lại để đổi";

export function ChannelForm({ channel }: { channel: ChannelConfig }) {
  const router = useRouter();
  const [forwardUrl, setForwardUrl] = useState(channel.forwardUrl ?? "");
  const [forwardEnabled, setForwardEnabled] = useState(channel.forwardEnabled);
  const [enabled, setEnabled] = useState(channel.enabled);
  const [appId, setAppId] = useState("");
  const [oaSecret, setOaSecret] = useState("");
  const [botToken, setBotToken] = useState("");
  const [webhookToken, setWebhookToken] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const secrets: Record<string, string> = {};
    if (channel.type === "zalo_oa") {
      if (appId.trim()) secrets.appId = appId.trim();
      if (oaSecret.trim()) secrets.oaSecret = oaSecret.trim();
    }
    if (channel.type === "zalo_bot" && botToken.trim()) secrets.botToken = botToken.trim();
    if (channel.type === "fpt" && webhookToken.trim()) secrets.webhookToken = webhookToken.trim();
    if (channel.type === "lark" && verificationToken.trim()) secrets.verificationToken = verificationToken.trim();
    if (channel.type === "gchat" && verificationToken.trim()) secrets.verificationToken = verificationToken.trim();
    const res = await fetch("/api/channels", {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: channel.type,
        forwardUrl: forwardUrl || null,
        forwardEnabled,
        enabled,
        ...(Object.keys(secrets).length ? { secrets } : {}),
      }),
    });
    setMsg(res.ok ? "Đã lưu." : "Không lưu được.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-3 rounded-md border border-line bg-white p-4 text-sm">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Kênh bật
      </label>
      {channel.type === "zalo_oa" ? (
        <>
          <label className="block">
            App ID
            <input
              className="mt-1 h-9 w-full rounded-md border border-line px-3"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder={SAVED}
              autoComplete="off"
            />
          </label>
          <label className="block">
            OA secret
            <input
              type="password"
              className="mt-1 h-9 w-full rounded-md border border-line px-3"
              value={oaSecret}
              onChange={(e) => setOaSecret(e.target.value)}
              placeholder={SAVED}
              autoComplete="new-password"
            />
          </label>
        </>
      ) : null}
      {channel.type === "zalo_bot" ? (
        <label className="block">
          Bot token
          <input
            type="password"
            className="mt-1 h-9 w-full rounded-md border border-line px-3"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder={SAVED}
            autoComplete="new-password"
          />
        </label>
      ) : null}
      {channel.type === "fpt" ? (
        <label className="block">
          Webhook token
          <input
            type="password"
            className="mt-1 h-9 w-full rounded-md border border-line px-3"
            value={webhookToken}
            onChange={(e) => setWebhookToken(e.target.value)}
            placeholder={SAVED}
            autoComplete="new-password"
          />
        </label>
      ) : null}
      {channel.type === "lark" || channel.type === "gchat" ? (
        <label className="block">
          Verification token
          <input
            type="password"
            className="mt-1 h-9 w-full rounded-md border border-line px-3"
            value={verificationToken}
            onChange={(e) => setVerificationToken(e.target.value)}
            placeholder={SAVED}
            autoComplete="new-password"
          />
        </label>
      ) : null}
      <label className="block">
        Forward URL (tap)
        <input className="mt-1 h-9 w-full rounded-md border border-line px-3" value={forwardUrl} onChange={(e) => setForwardUrl(e.target.value)} placeholder="https://bot.example.com/zalo" />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={forwardEnabled} onChange={(e) => setForwardEnabled(e.target.checked)} />
        Bật forward (timeout 4s, 0 retry)
      </label>
      <p className="text-xs text-muted">Tắt forward không ảnh hưởng ingest. Signature sai → 401, không tạo lượt.</p>
      <button className="h-9 rounded-md bg-ink px-4 text-white">Lưu</button>
      {msg ? <span className="ml-2 text-muted">{msg}</span> : null}
    </form>
  );
}
