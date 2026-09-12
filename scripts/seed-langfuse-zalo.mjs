#!/usr/bin/env node
/**
 * Bring-up seed: one Zalo OA «hủy đơn» tree → Langfuse public ingest.
 * Requires the console on :3000 (scripts/up.sh) with INIT keys from .env.console.example.
 *
 *   node scripts/seed-langfuse-zalo.mjs
 */
const base = (process.env.LANGFUSE_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
const pk = process.env.LANGFUSE_PUBLIC_KEY || process.env.LANGFUSE_INIT_PROJECT_PUBLIC_KEY || "pk-lf-vet-demo";
const sk = process.env.LANGFUSE_SECRET_KEY || process.env.LANGFUSE_INIT_PROJECT_SECRET_KEY || "sk-lf-vet-demo";
const projectId = process.env.VET_CONSOLE_PROJECT_ID || process.env.LANGFUSE_INIT_PROJECT_ID || "prj-vet-demo";

const t0ms = Date.now() - 90_000;
const iso = (ms) => new Date(ms).toISOString();
const t0 = iso(t0ms);
const traceId = "tr_zalo_huy_don";
const sessionId = "zalo_oa:user_847712";

function ev(type, timestamp, body) {
  return { id: crypto.randomUUID(), type, timestamp, body };
}

const batch = [
  ev("trace-create", t0, {
    id: traceId,
    name: "zalo-oa · hủy đơn",
    userId: "user_847712",
    sessionId,
    timestamp: t0,
    tags: ["channel:zalo_oa", "zalo_oa", "cx"],
    metadata: { vet_channel: "zalo_oa", oa_id: "oa_9901", routeId: "rt_zalo_fpt_claude" },
    input: { event: "user_send_text", text: "hủy đơn" },
    output: { text: "Dạ, anh/chị cho em xin mã đơn để hủy ạ?" },
  }),
  ev("span-create", t0, {
    id: "obs_in_1",
    traceId,
    name: "zalo.inbound",
    startTime: t0,
    endTime: iso(t0ms + 120),
    input: { event: "user_send_text", text: "hủy đơn" },
    output: { msg_id: "m_1001", user_id: "user_847712" },
    metadata: { vet_type: "channel.inbound", channel: "zalo_oa" },
  }),
  ev("span-create", iso(t0ms + 200), {
    id: "obs_nlu_1",
    traceId,
    parentObservationId: "obs_in_1",
    name: "fpt.nlu",
    startTime: iso(t0ms + 200),
    endTime: iso(t0ms + 540),
    input: { text: "hủy đơn" },
    output: { intent: "cancel_order", confidence: 0.93 },
    metadata: { vet_type: "nlu", route: "fpt-conversation" },
  }),
  ev("generation-create", iso(t0ms + 600), {
    id: "obs_gen_1",
    traceId,
    parentObservationId: "obs_nlu_1",
    name: "anthropic.messages.create",
    startTime: iso(t0ms + 600),
    endTime: iso(t0ms + 2100),
    model: "claude-sonnet-4-5",
    input: { messages: [{ role: "user", content: "Khách: hủy đơn. Intent=cancel_order. Hỏi mã đơn." }] },
    output: { text: "Dạ, anh/chị cho em xin mã đơn để hủy ạ?" },
    usageDetails: { input: 412, output: 38 },
    metadata: { vet_type: "generation", provider: "anthropic" },
  }),
  ev("span-create", iso(t0ms + 2200), {
    id: "obs_out_1",
    traceId,
    parentObservationId: "obs_gen_1",
    name: "zalo.outbound",
    startTime: iso(t0ms + 2200),
    endTime: iso(t0ms + 2400),
    input: { text: "Dạ, anh/chị cho em xin mã đơn để hủy ạ?" },
    output: { event: "oa_send_text", msg_id: "m_1002", quote_msg_id: "m_1001" },
    metadata: { vet_type: "channel.outbound", channel: "zalo_oa" },
  }),
];

const token = Buffer.from(`${pk}:${sk}`).toString("base64");
const res = await fetch(`${base}/api/public/ingestion`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Basic ${token}`,
    "x-langfuse-sdk-name": "vet-seed",
    "x-langfuse-sdk-version": "0.1.0",
  },
  body: JSON.stringify({ batch }),
});
const text = await res.text();
console.log(res.status, text.slice(0, 800));
if (!res.ok && res.status !== 207) process.exit(1);
if (res.status === 207) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    process.exit(1);
  }
  const errors = Array.isArray(parsed.errors) ? parsed.errors : [];
  if (errors.length) {
    console.error(`ingest rejected ${errors.length} event(s)`);
    process.exit(1);
  }
}
console.log(`Seeded ${traceId} → ${base}/project/${projectId}/traces`);
console.log(`Session ${sessionId} → ${base}/project/${projectId}/sessions`);
