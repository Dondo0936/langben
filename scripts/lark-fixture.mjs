#!/usr/bin/env node
/**
 * Lark test bot (no Lark developer app):
 *   1) url_verification handshake (how Lark "connects")
 *   2) inbound IM event → Langfuse session lark:ou_fixture
 *
 *   node scripts/lark-fixture.mjs
 */
const token = process.env.LARK_VERIFICATION_TOKEN || "demo-lark-token";
const projectId = process.env.VET_CONSOLE_PROJECT_ID || "prj-vet-demo";
const base = (process.env.VET_PUBLIC_URL || "http://localhost:43173").replace(/\/$/, "");
const url = `${base}/hooks/lark/${projectId}`;

async function post(label, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(label, res.status, text);
  return { status: res.status, text };
}

const challenge = await post("challenge", {
  type: "url_verification",
  token,
  challenge: "vet-lark-challenge",
});
if (challenge.status !== 200) process.exit(1);

const bad = await post("invalid", {
  type: "url_verification",
  token: "wrong",
  challenge: "vet-lark-challenge",
});
if (bad.status !== 401) {
  console.error("expected 401 for bad Lark token");
  process.exit(1);
}

const msg = await post(
  "message",
  {
    event: {
      sender: { sender_id: "ou_fixture" },
      message: { content: "xin chào từ Lark fixture" },
    },
  },
  { authorization: `Bearer ${token}` },
);
if (msg.status !== 200) process.exit(1);

console.log(`Session lark:ou_fixture → http://localhost:3000/project/${projectId}/sessions/lark%3Aou_fixture`);
