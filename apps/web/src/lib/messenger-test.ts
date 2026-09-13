import { sha256Hex } from "./crypto";
import type { ChannelConfig, ChannelType } from "./types";

const TESTABLE = new Set<ChannelType>(["zalo_oa", "zalo_bot", "fpt", "lark", "gchat"]);

export function canSendChannelTest(type: string): type is ChannelType {
  return TESTABLE.has(type as ChannelType);
}

/** Gửi thử posts to this process. Loopback so a dead tunnel URL cannot break local tests. */
export function testHookOrigin() {
  return (process.env.VET_HOOK_ORIGIN || "http://127.0.0.1:43173").replace(/\/$/, "");
}

export type HookCall = {
  url: string;
  headers: Record<string, string>;
  body: string;
  label: string;
};

export function buildChannelTestCalls(ch: ChannelConfig, projectId: string): HookCall[] {
  const url = `${testHookOrigin()}${ch.webhookPath}`;
  const stamp = Date.now();
  if (ch.type === "lark") {
    const token = String(ch.secrets.verificationToken ?? ch.secrets.webhookToken ?? "").trim();
    return [
      {
        url,
        label: "url_verification",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "url_verification",
          token,
          challenge: `vet-lark-${stamp}`,
        }),
      },
      {
        url,
        label: "im.message.receive_v1",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schema: "2.0",
          header: { event_type: "im.message.receive_v1" },
          event: {
            sender: { sender_id: { open_id: "ou_local" }, sender_type: "user" },
            message: {
              message_type: "text",
              content: JSON.stringify({ text: "xin chào từ Lark (cục bộ)" }),
            },
          },
        }),
      },
    ];
  }
  if (ch.type === "gchat") {
    const token = String(ch.secrets.verificationToken ?? ch.secrets.webhookToken ?? "").trim();
    return [
      {
        url,
        label: "message",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "MESSAGE",
          user: { name: "users/local" },
          space: { name: "spaces/vet_demo", type: "DM" },
          message: { text: "xin chào từ Google Chat (cục bộ)" },
        }),
      },
    ];
  }
  if (ch.type === "zalo_oa") {
    const appId = String(ch.secrets.appId ?? "").trim();
    const oaSecret = String(ch.secrets.oaSecret ?? "").trim();
    const timestamp = String(stamp);
    const body = JSON.stringify({
      event_name: "user_send_text",
      sender: { id: "user_fixture" },
      message: { text: "xin chào từ fixture OA", msg_id: `m_test_${stamp}` },
    });
    const mac = sha256Hex(`${appId}${body}${timestamp}${oaSecret}`);
    return [
      {
        url,
        label: "user_send_text",
        headers: {
          "content-type": "application/json",
          "X-ZEvent-Timestamp": timestamp,
          "X-ZEvent-Signature": mac,
        },
        body,
      },
    ];
  }
  if (ch.type === "zalo_bot") {
    const token = String(ch.secrets.botToken ?? ch.secrets.webhookToken ?? "").trim();
    return [
      {
        url,
        label: "message.text.received",
        headers: {
          "content-type": "application/json",
          "x-bot-api-secret-token": token,
        },
        body: JSON.stringify({
          event_name: "message.text.received",
          sender: { id: "user_bot_fixture" },
          message: { text: "xin chào từ Zalo Bot (cục bộ)", msg_id: `m_bot_${stamp}` },
        }),
      },
    ];
  }
  if (ch.type === "fpt") {
    const token = String(ch.secrets.webhookToken ?? ch.secrets.verificationToken ?? "").trim();
    return [
      {
        url,
        label: "webhook",
        headers: {
          "content-type": "application/json",
          "x-fpt-token": token,
        },
        body: JSON.stringify({
          sender_id: "sender_fixture",
          messages: [{ text: "xin chào từ FPT fixture" }],
          broker_id: "broker_fixture",
        }),
      },
    ];
  }
  void projectId;
  return [];
}
