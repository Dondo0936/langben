#!/usr/bin/env node
/**
 * Zalo Bot webhook fixture → Vết hooks (:43173) → Langfuse session zalo_bot:user_bot_fixture
 * Usage: unset VET_PUBLIC_URL && node scripts/zalo-bot-fixture.mjs
 *
 * Secret Token must match Kênh → Zalo Bot (demo default: demo-bot-token).
 */
const token = process.env.ZALO_BOT_SECRET || "demo-bot-token";
const projectId = process.env.VET_CONSOLE_PROJECT_ID || "prj-vet-demo";
const base = (process.env.VET_PUBLIC_URL || "http://localhost:43173").replace(/\/$/, "");
const url = `${base}/hooks/zalo/bot/${projectId}`;

async function post(label, headers, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: body === null ? "" : JSON.stringify(body),
  });
  const text = await res.text();
  console.log(label, res.status, text);
  return { status: res.status, text };
}

const ping = await post("ping", { "X-Bot-Api-Secret-Token": token }, null);
if (ping.status !== 200) {
  console.error("expected 200 for empty webhook probe");
  process.exit(1);
}

const bad = await post("invalid", { "X-Bot-Api-Secret-Token": "wrong-secret" }, {
  event_name: "message.text.received",
  sender: { id: "user_bot_fixture" },
  message: { text: "should 401", msg_id: "m_bot_bad" },
});
if (bad.status !== 401) {
  console.error("expected 401 for a bad Secret Token");
  process.exit(1);
}

const ok = await post("message", { "X-Bot-Api-Secret-Token": token }, {
  event_name: "message.text.received",
  sender: { id: "user_bot_fixture" },
  message: { text: "xin chào từ Zalo Bot fixture", msg_id: "m_bot_fixture" },
});
if (ok.status !== 200) {
  console.error("expected 200 for a valid Zalo Bot inbound");
  process.exit(1);
}
console.log(`Session zalo_bot:user_bot_fixture → http://localhost:3000/project/${projectId}/sessions/zalo_bot%3Auser_bot_fixture`);
