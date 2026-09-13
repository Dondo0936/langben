"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChannelConfig, ChannelType } from "@/lib/types";

const SAVED = "đã lưu. Nhập lại để đổi.";

const FORWARD_PLACEHOLDER: Partial<Record<ChannelType, string>> = {
  zalo_oa: "https://bot.example.com/zalo",
  zalo_bot: "https://bot.example.com/zalo",
  lark: "https://bot.example.com/lark",
  gchat: "https://bot.example.com/google-chat",
  fpt: "https://bot.example.com/fpt",
  viettel: "https://bot.example.com/viettel",
  msteams: "https://bot.example.com/teams",
};

function channelApi(path: string, projectId: string) {
  return `${path}?project=${encodeURIComponent(projectId)}`;
}

function signatureHint(type: ChannelType) {
  if (type === "lark") return "Verification token sai thì webhook trả 401, không tạo lượt.";
  if (type === "gchat") return "Bearer token sai thì webhook trả 401, không tạo lượt.";
  if (type === "fpt" || type === "viettel") return "HMAC sai thì webhook trả 401, không tạo lượt.";
  if (type === "msteams") return "Kênh này đi SDK, không kiểm chữ ký webhook messenger.";
  if (type === "zalo_bot") return "Secret Token sai thì webhook trả 401, không tạo lượt.";
  return "Chữ ký OA-MAC sai thì webhook trả 401, không tạo lượt.";
}

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
  const [encryptKey, setEncryptKey] = useState("");
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
    if (channel.type === "lark") {
      if (verificationToken.trim()) secrets.verificationToken = verificationToken.trim();
      if (encryptKey.trim()) secrets.encryptKey = encryptKey.trim();
    }
    if (channel.type === "gchat" && verificationToken.trim()) secrets.verificationToken = verificationToken.trim();
    const res = await fetch(channelApi("/api/channels", channel.projectId), {
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

  async function sendTest() {
    setMsg("Đang gửi thử…");
    const res = await fetch(channelApi("/api/channels/test", channel.projectId), {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: channel.type }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      sessionId?: string;
      sessionUrl?: string;
    };
    if (!res.ok) {
      setMsg(data.error || "Thử thất bại.");
      return;
    }
    setMsg(data.sessionId ? `Thử OK · ${data.sessionId}` : "Thử OK.");
    if (data.sessionUrl) {
      window.open(data.sessionUrl, "_blank", "noopener,noreferrer");
    }
    router.refresh();
  }

  return (
    <form onSubmit={save} className="panel max-w-xl space-y-3 p-4 text-sm">
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
        <>
          <label className="block">
            Secret Token
            <input
              type="password"
              className="mt-1 h-9 w-full rounded-md border border-line px-3"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder={SAVED}
              autoComplete="new-password"
            />
          </label>
          <p className="text-xs text-muted">
            Dán Secret Token trên bot.zapps.me (8-256 ký tự). Không dán Bot Token. Zalo gửi header
            X-Bot-Api-Secret-Token. Webhook URL phải là https://.../hooks/zalo/bot/prj-vet-demo, không chỉ
            đường dẫn.
          </p>
        </>
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
      {channel.type === "lark" ? (
        <label className="block">
          Encrypt key
          <input
            type="password"
            className="mt-1 h-9 w-full rounded-md border border-line px-3"
            value={encryptKey}
            onChange={(e) => setEncryptKey(e.target.value)}
            placeholder={SAVED}
            autoComplete="new-password"
          />
        </label>
      ) : null}
      <label className="block">
        Forward URL (tap)
        <input
          className="mt-1 h-9 w-full rounded-md border border-line px-3"
          value={forwardUrl}
          onChange={(e) => setForwardUrl(e.target.value)}
          placeholder={FORWARD_PLACEHOLDER[channel.type] ?? "https://bot.example.com/hook"}
        />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={forwardEnabled} onChange={(e) => setForwardEnabled(e.target.checked)} />
        Bật forward (timeout 4s, 0 retry)
      </label>
      <p className="text-xs text-muted">Tắt forward không ảnh hưởng ingest. {signatureHint(channel.type)}</p>
      {channel.type === "lark" || channel.type === "gchat" ? (
        <p className="text-xs text-muted">
          {channel.type === "lark"
            ? "Token demo vẫn dùng được cho Gửi thử. App thật: dán Verification Token (và Encrypt Key nếu Open Platform bật mã hóa) rồi trỏ request URL vào đường dẫn phía trên."
            : "Token demo vẫn dùng được cho Gửi thử. App Google Chat thật gửi JWT. Hook nhận cả token demo và JWT Google."}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button className="h-9 bg-ink px-4 text-paper">Lưu</button>
        {["lark", "gchat", "zalo_oa", "zalo_bot", "fpt"].includes(channel.type) ? (
          <button
            type="button"
            className="h-9 border border-white/25 px-4"
            onClick={() => void sendTest()}
          >
            Gửi thử
          </button>
        ) : null}
        {msg ? <span className="text-muted">{msg}</span> : null}
      </div>
    </form>
  );
}
