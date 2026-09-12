#!/usr/bin/env node
/**
 * Google Chat test bot (no Google Cloud Chat app):
 *   Bearer verification token → Langfuse session gchat:users_fixture
 *
 *   node scripts/gchat-fixture.mjs
 */
const token = process.env.GCHAT_VERIFICATION_TOKEN || "demo-gchat-token";
const projectId = process.env.VET_CONSOLE_PROJECT_ID || "prj-vet-demo";
const base = (process.env.VET_PUBLIC_URL || "http://localhost:43173").replace(/\/$/, "");
const url = `${base}/hooks/google-chat/${projectId}`;

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

const payload = {
  chat: {
    user: { name: "users/fixture" },
    space: { name: "spaces/vet_demo" },
  },
  message: { text: "xin chào từ Google Chat fixture" },
};

const bad = await post("invalid", payload, { authorization: "Bearer wrong" });
if (bad.status !== 401) {
  console.error("expected 401 for bad Google Chat token");
  process.exit(1);
}

const ok = await post("message", payload, { authorization: `Bearer ${token}` });
if (ok.status !== 200) process.exit(1);

console.log(
  `Session gchat:users_fixture → http://localhost:3000/project/${projectId}/sessions/gchat%3Ausers_fixture`,
);
