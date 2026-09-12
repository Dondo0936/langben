#!/usr/bin/env node
/**
 * Signed Zalo OA fixture → Vết hooks (:43173) → Langfuse console (:3000).
 * Usage: node scripts/zalo-fixture.mjs
 */
import { createHash } from "node:crypto";

const appId = "1234567890";
const oaSecret = "demo-oa-secret";
const projectId = "prj_demo";
const base = process.env.VET_PUBLIC_URL || "http://localhost:43173";
const timestamp = String(Date.now());
const body = JSON.stringify({
  event_name: "user_send_text",
  sender: { id: "user_fixture" },
  message: { text: "hủy đơn", msg_id: "m_fixture" },
});
const mac = createHash("sha256").update(appId + body + timestamp + oaSecret).digest("hex");

const res = await fetch(`${base}/hooks/zalo/oa/${projectId}`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "X-ZEvent-Timestamp": timestamp,
    "X-ZEvent-Signature": mac,
  },
  body,
});
console.log(res.status, await res.text());
