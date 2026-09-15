import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import path from "node:path";
import { hashSecret, secretsEqual } from "./crypto";
import type {
  ChannelConfig,
  ChannelType,
  Observation,
  Organization,
  Project,
  Score,
  StoreShape,
  Trace,
  User,
} from "./types";
import { seedStore } from "./seed";
import { publicUrl } from "./deployment";
import { resolveWebhookOrigin } from "./webhook-origin";

const DEMO_PROJECT_ID = "prj-vet-demo";
const LEGACY_DEMO_PROJECT_ID = "prj_demo";

const DATA_DIR = process.env.VET_DATA_DIR
  ? path.resolve(process.env.VET_DATA_DIR)
  : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "vet.json");

const g = globalThis as typeof globalThis & { __vetStore?: StoreShape };

const CHANNEL_STUBS: { type: ChannelType; name: string; path: (projectId: string) => string }[] = [
  { type: "zalo_oa", name: "Zalo OA", path: (id) => `/hooks/zalo/oa/${id}` },
  { type: "zalo_bot", name: "Zalo Bot", path: (id) => `/hooks/zalo/bot/${id}` },
  { type: "fpt", name: "FPT.AI Conversation", path: (id) => `/hooks/fpt/${id}` },
  { type: "viettel", name: "Viettel ASR/TTS/NLP", path: () => "" },
  { type: "lark", name: "Lark", path: (id) => `/hooks/lark/${id}` },
  { type: "gchat", name: "Google Chat", path: (id) => `/hooks/google-chat/${id}` },
  { type: "msteams", name: ".NET / Teams", path: () => "" },
];

function persist(next: StoreShape) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify(next), "utf8");
  renameSync(tmp, DATA_FILE);
}

function rewriteProjectId(store: StoreShape, from: string, to: string) {
  const project = store.projects.find((item) => item.id === from);
  if (!project || store.projects.some((item) => item.id === to)) return false;
  project.id = to;
  const collections = [
    store.traces,
    store.observations,
    store.sessions,
    store.scores,
    store.prompts,
    store.channels,
    store.routes,
    store.connections,
  ];
  for (const rows of collections) {
    for (const row of rows) {
      if (row.projectId === from) row.projectId = to;
    }
  }
  for (const channel of store.channels) {
    if (channel.webhookPath?.includes(from)) {
      channel.webhookPath = channel.webhookPath.split(from).join(to);
    }
  }
  return true;
}

function patchMessengerRoutes(store: StoreShape) {
  let dirty = false;
  for (const route of store.routes) {
    if (route.id === "rt_lark") {
      const next = ["lark.inbound", "generation", "lark.outbound"];
      if (route.steps.join(">") !== next.join(">") || route.name !== "lark → claude → lark") {
        route.name = "lark → claude → lark";
        route.steps = next;
        dirty = true;
      }
    }
    if (route.id === "rt_gchat") {
      const next = ["googlechat.inbound", "generation", "googlechat.outbound"];
      if (route.steps.join(">") !== next.join(">") || route.name !== "google-chat → generation → google-chat") {
        route.name = "google-chat → generation → google-chat";
        route.steps = next;
        dirty = true;
      }
    }
  }
  return dirty;
}

function stubObs(partial: Partial<Observation> & Pick<Observation, "id" | "traceId" | "type" | "name" | "startTime">): Observation {
  return {
    projectId: DEMO_PROJECT_ID,
    parentId: null,
    usage: null,
    model: null,
    provider: null,
    region: null,
    metadata: {},
    status: "ok",
    input: null,
    output: null,
    endTime: null,
    ...partial,
  };
}

function ensureMessengerOutboundObs(store: StoreShape) {
  const have = new Set(store.observations.map((item) => item.id));
  const extras: Observation[] = [];
  if (store.traces.some((trace) => trace.id === "tr_lark_dm") && !have.has("obs_lark_out")) {
    extras.push(
      stubObs({
        id: "obs_lark_out",
        traceId: "tr_lark_dm",
        parentId: have.has("obs_lark_gen") ? "obs_lark_gen" : "obs_lark_in",
        type: "channel.outbound",
        name: "lark.outbound",
        startTime: "2026-09-09T08:02:11.900Z",
        endTime: "2026-09-09T08:02:12.020Z",
        input: { text: "Stand-up 9:15 hàng ngày trên channel #eng." },
        output: { message_id: "om_2" },
      }),
    );
  }
  if (store.traces.some((trace) => trace.id === "tr_gchat")) {
    if (!have.has("obs_gchat_gen")) {
      extras.push(
        stubObs({
          id: "obs_gchat_gen",
          traceId: "tr_gchat",
          parentId: "obs_gchat_in",
          type: "generation",
          name: "openai.chat.completions",
          startTime: "2026-09-09T07:30:00.100Z",
          endTime: "2026-09-09T07:30:01.000Z",
          model: "gpt-4o",
          provider: "openai",
          input: { messages: [{ role: "user", content: "reset mật khẩu VPN" }] },
          output: { text: "Gửi link reset VPN nội bộ. Không dùng credential Vertex." },
          usage: { inputTokens: 80, outputTokens: 24, estimatedCostUsd: 0.0003 },
        }),
      );
    }
    if (!have.has("obs_gchat_out")) {
      extras.push(
        stubObs({
          id: "obs_gchat_out",
          traceId: "tr_gchat",
          parentId: have.has("obs_gchat_gen") || extras.some((item) => item.id === "obs_gchat_gen")
            ? "obs_gchat_gen"
            : "obs_gchat_in",
          type: "channel.outbound",
          name: "googlechat.outbound",
          startTime: "2026-09-09T07:30:01.050Z",
          endTime: "2026-09-09T07:30:01.120Z",
          input: { text: "Gửi link reset VPN nội bộ. Không dùng credential Vertex." },
          output: { message_id: "2" },
        }),
      );
    }
  }
  if (!extras.length) return false;
  store.observations.push(...extras);
  return true;
}

function normalizeStore(raw: StoreShape): StoreShape {
  if (!Array.isArray(raw.projects) || !Array.isArray(raw.users) || !Array.isArray(raw.orgs)) {
    throw new Error("corrupt store");
  }
  if (!Array.isArray(raw.webhookReplays)) raw.webhookReplays = [];
  for (const user of raw.users) {
    if (typeof user.sessionEpoch !== "number") user.sessionEpoch = 0;
  }
  const migrated = rewriteProjectId(raw, LEGACY_DEMO_PROJECT_ID, DEMO_PROJECT_ID);
  const routesPatched = patchMessengerRoutes(raw);
  const obsPatched = ensureMessengerOutboundObs(raw);
  if (migrated || routesPatched || obsPatched) persist(raw);
  return raw;
}

export function loadStore(): StoreShape {
  if (g.__vetStore) return g.__vetStore;
  if (existsSync(DATA_FILE)) {
    try {
      const parsed = JSON.parse(readFileSync(DATA_FILE, "utf8")) as StoreShape;
      g.__vetStore = normalizeStore(parsed);
      return g.__vetStore;
    } catch {
      // corrupt on-disk store — re-seed
    }
  }
  g.__vetStore = seedStore();
  persist(g.__vetStore);
  return g.__vetStore;
}

function commit(mutator: (s: StoreShape) => void) {
  const s = loadStore();
  mutator(s);
  g.__vetStore = s;
  persist(s);
  return s;
}

export { hashSecret, secretsEqual };

export function listProjects() {
  return loadStore().projects;
}

export function getProject(id: string) {
  const store = loadStore();
  const exact = store.projects.find((p) => p.id === id);
  if (exact) return exact;
  if (id === DEMO_PROJECT_ID || id === LEGACY_DEMO_PROJECT_ID) {
    return store.projects.find((p) => p.id === DEMO_PROJECT_ID || p.id === LEGACY_DEMO_PROJECT_ID) ?? null;
  }
  return null;
}

export function getProjectForOrg(orgId: string) {
  return loadStore().projects.find((p) => p.orgId === orgId) ?? null;
}

function randomToken(len = 16) {
  return crypto.randomUUID().replace(/-/g, "").slice(0, len);
}

function channelStubs(projectId: string): ChannelConfig[] {
  return CHANNEL_STUBS.map((stub) => ({
    id: `ch_${stub.type}_${projectId}`,
    projectId,
    type: stub.type,
    name: stub.name,
    enabled: true,
    forwardUrl: null,
    forwardEnabled: false,
    secrets: {},
    webhookPath: stub.path(projectId),
    lastEventAt: null,
    lastError: null,
    signatureFailures: 0,
  }));
}

export function createProjectForOrg(org: { id: string; name: string }): { project: Project; secretKey: string } {
  const projectId = `prj_${randomToken(12)}`;
  const publicKey = `pk-vet-${randomToken(16)}`;
  const secretKey = `sk-vet-${randomToken(24)}`;
  const project: Project = {
    id: projectId,
    orgId: org.id,
    name: org.name,
    publicKey,
    secretKeyHash: hashSecret(secretKey),
    webhookSuffix: randomToken(8),
  };
  const channels = channelStubs(projectId);
  commit((s) => {
    s.projects.push(project);
    s.channels.push(...channels);
  });
  return { project, secretKey };
}

export function ensureOrgProject(orgId: string): { project: Project; secretKey: string | null } | null {
  const existing = getProjectForOrg(orgId);
  if (existing) return { project: existing, secretKey: null };
  const org = getOrg(orgId);
  if (!org) return null;
  const created = createProjectForOrg({ id: org.id, name: org.name });
  return { project: created.project, secretKey: created.secretKey };
}

export function getOrg(id: string) {
  return loadStore().orgs.find((o) => o.id === id) ?? null;
}

function withEpoch(user: User): User {
  if (typeof user.sessionEpoch !== "number") user.sessionEpoch = 0;
  return user;
}

export function getUserByEmail(email: string) {
  const user = loadStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  return user ? withEpoch(user) : null;
}

export function getUser(id: string) {
  const user = loadStore().users.find((u) => u.id === id) ?? null;
  return user ? withEpoch(user) : null;
}

export function createUser(user: User) {
  commit((s) => {
    s.users.push({ ...user, sessionEpoch: user.sessionEpoch ?? 0 });
  });
  return user;
}

export function bumpSessionEpoch(userId: string) {
  commit((s) => {
    const user = s.users.find((u) => u.id === userId);
    if (!user) return;
    user.sessionEpoch = (user.sessionEpoch ?? 0) + 1;
  });
}

export function addOrg(org: Organization) {
  commit((s) => {
    s.orgs.push(org);
  });
  return org;
}

export function updateOrgPlan(orgId: string, plan: StoreShape["orgs"][0]["plan"], teamsAddon?: boolean) {
  commit((s) => {
    const org = s.orgs.find((o) => o.id === orgId);
    if (!org) return;
    org.plan = plan;
    if (typeof teamsAddon === "boolean") org.teamsAddon = teamsAddon;
  });
}

export function authenticateProject(publicKey: string, secretKey: string): Project | null {
  const project = loadStore().projects.find((p) => p.publicKey === publicKey);
  if (!project) return null;
  if (!secretsEqual(secretKey, project.secretKeyHash)) return null;
  return project;
}

export function authenticateBySecretKey(secretKey: string): Project | null {
  for (const project of loadStore().projects) {
    if (secretsEqual(secretKey, project.secretKeyHash)) return project;
  }
  return null;
}

export function listTraces(projectId: string, query?: { q?: string; channel?: string; status?: string }) {
  let rows = loadStore().traces.filter((t) => t.projectId === projectId);
  if (query?.channel) rows = rows.filter((t) => t.channel === query.channel);
  if (query?.status) rows = rows.filter((t) => t.status === query.status);
  if (query?.q) {
    const q = query.q.toLowerCase();
    rows = rows.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.userId ?? "").toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q),
    );
  }
  return rows.sort((a, b) => b.startTime.localeCompare(a.startTime));
}

export function getTrace(projectId: string, id: string) {
  return loadStore().traces.find((t) => t.projectId === projectId && t.id === id) ?? null;
}

export function listObservations(projectId: string, traceId?: string) {
  const rows = loadStore().observations.filter((o) => o.projectId === projectId);
  if (traceId) return rows.filter((o) => o.traceId === traceId).sort((a, b) => a.startTime.localeCompare(b.startTime));
  return rows.sort((a, b) => b.startTime.localeCompare(a.startTime));
}

export function listSessions(projectId: string) {
  return loadStore()
    .sessions.filter((s) => s.projectId === projectId)
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
}

export function getSession(projectId: string, id: string) {
  return loadStore().sessions.find((s) => s.projectId === projectId && s.id === id) ?? null;
}

export function tracesForSession(projectId: string, sessionId: string) {
  return listTraces(projectId).filter((t) => t.sessionId === sessionId);
}

export function listChannels(projectId: string) {
  return loadStore().channels.filter((c) => c.projectId === projectId);
}

export function getChannel(projectId: string, type: string) {
  return loadStore().channels.find((c) => c.projectId === projectId && c.type === type) ?? null;
}

export function getWebhookOrigin(): string | null {
  return resolveWebhookOrigin(loadStore(), publicUrl());
}

export function setWebhookOrigin(origin: string | null) {
  commit((s) => {
    s.webhookOrigin = origin;
  });
  return origin;
}

export function updateChannel(projectId: string, type: string, patch: Partial<ChannelConfig>) {
  let updated: ChannelConfig | null = null;
  commit((s) => {
    const ch = s.channels.find((c) => c.projectId === projectId && c.type === type);
    if (!ch) return;
    Object.assign(ch, patch);
    updated = ch;
  });
  return updated;
}

export function listRoutes(projectId: string) {
  return loadStore().routes.filter((r) => r.projectId === projectId);
}

export function listPrompts(projectId: string) {
  return loadStore().prompts.filter((p) => p.projectId === projectId);
}

export function listScores(projectId: string, traceId?: string) {
  const rows = loadStore().scores.filter((s) => s.projectId === projectId);
  return traceId ? rows.filter((s) => s.traceId === traceId) : rows;
}

export function addScore(score: Score) {
  commit((s) => {
    s.scores.push(score);
  });
  return score;
}

export function listConnections(projectId: string) {
  return loadStore().connections.filter((c) => c.projectId === projectId);
}

function sanitizeId(value: string) {
  return value.replace(/[/\\%]/g, "_");
}

export function upsertSession(projectId: string, channel: string, userId: string, at: string, sessionId?: string) {
  const uid = sanitizeId(userId);
  const sid = sessionId ? sanitizeId(sessionId) : `${channel}:${uid}`;
  commit((s) => {
    const existing = s.sessions.find((x) => x.projectId === projectId && x.id === sid);
    if (existing) {
      existing.lastSeen = at;
      return;
    }
    s.sessions.push({
      id: sid,
      projectId,
      channel,
      userId: uid,
      firstSeen: at,
      lastSeen: at,
    });
  });
  return sid;
}

export function upsertTrace(projectId: string, incoming: Partial<Trace> & { name: string; id?: string }): Trace {
  let saved!: Trace;
  const userId = incoming.userId != null ? sanitizeId(incoming.userId) : incoming.userId;
  const sessionId = incoming.sessionId != null ? sanitizeId(incoming.sessionId) : incoming.sessionId;
  const cleaned = { ...incoming, userId, sessionId };
  commit((s) => {
    const id = cleaned.id ?? `tr_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const existing = s.traces.find((t) => t.id === id && t.projectId === projectId);
    if (existing) {
      Object.assign(existing, Object.fromEntries(Object.entries(cleaned).filter(([, v]) => v !== undefined)));
      saved = existing;
      return;
    }
    saved = {
      id,
      projectId,
      name: cleaned.name,
      sessionId: cleaned.sessionId ?? null,
      userId: cleaned.userId ?? null,
      channel: cleaned.channel ?? null,
      routeId: incoming.routeId ?? null,
      release: incoming.release ?? null,
      environment: incoming.environment ?? "production",
      tags: incoming.tags ?? [],
      startTime: incoming.startTime ?? new Date().toISOString(),
      endTime: incoming.endTime ?? null,
      status: incoming.status ?? "unset",
      metadata: incoming.metadata ?? {},
    };
    s.traces.push(saved);
  });
  if (saved.sessionId) {
    upsertSession(projectId, saved.channel ?? "sdk", saved.userId ?? saved.sessionId, saved.startTime, saved.sessionId);
  } else if (saved.channel && saved.userId) {
    const sid = upsertSession(projectId, saved.channel, saved.userId, saved.startTime);
    commit((s) => {
      const t = s.traces.find((x) => x.id === saved.id && x.projectId === projectId);
      if (t && !t.sessionId) t.sessionId = sid;
    });
  }
  return saved;
}

export function addObservation(projectId: string, incoming: Partial<Observation> & { traceId: string; name: string; type: Observation["type"] }): Observation {
  let saved!: Observation;
  commit((s) => {
    saved = {
      id: incoming.id ?? `obs_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
      projectId,
      traceId: incoming.traceId,
      parentId: incoming.parentId ?? null,
      type: incoming.type,
      name: incoming.name,
      startTime: incoming.startTime ?? new Date().toISOString(),
      endTime: incoming.endTime ?? null,
      status: incoming.status ?? "ok",
      input: incoming.input ?? null,
      output: incoming.output ?? null,
      model: incoming.model ?? null,
      provider: incoming.provider ?? null,
      region: incoming.region ?? null,
      usage: incoming.usage ?? null,
      metadata: incoming.metadata ?? {},
    };
    s.observations.push(saved);
    const trace = s.traces.find((t) => t.id === incoming.traceId && t.projectId === projectId);
    if (trace) {
      if (!trace.endTime || (saved.endTime && saved.endTime > trace.endTime)) {
        trace.endTime = saved.endTime;
      }
      if (saved.status === "error") trace.status = "error";
      else if (trace.status === "unset" && saved.status === "ok") trace.status = "ok";
    }
  });
  return saved;
}

export function countUnits(projectId: string) {
  const s = loadStore();
  const traces = s.traces.filter((t) => t.projectId === projectId).length;
  const observations = s.observations.filter((o) => o.projectId === projectId).length;
  const scores = s.scores.filter((x) => x.projectId === projectId).length;
  return traces + observations + scores;
}

export function stats(projectId: string) {
  const traces = listTraces(projectId);
  const observations = listObservations(projectId);
  const byChannel: Record<string, number> = {};
  const latencies: number[] = [];
  let errors = 0;
  let tokens = 0;
  let cost = 0;
  for (const t of traces) {
    const ch = t.channel ?? "sdk";
    byChannel[ch] = (byChannel[ch] ?? 0) + 1;
    if (t.status === "error") errors += 1;
    if (t.startTime && t.endTime) {
      latencies.push(new Date(t.endTime).getTime() - new Date(t.startTime).getTime());
    }
  }
  for (const o of observations) {
    tokens += (o.usage?.inputTokens ?? 0) + (o.usage?.outputTokens ?? 0);
    cost += o.usage?.estimatedCostUsd ?? 0;
  }
  latencies.sort((a, b) => a - b);
  const pct = (p: number) => {
    if (!latencies.length) return 0;
    const n = latencies.length;
    const i = Math.min(n - 1, Math.max(0, Math.ceil((p / 100) * n) - 1));
    return latencies[i];
  };
  return {
    traces: traces.length,
    observations: observations.length,
    sessions: listSessions(projectId).length,
    errors,
    errorRate: traces.length ? errors / traces.length : 0,
    p50: pct(50),
    p95: pct(95),
    tokens,
    costUsd: cost,
    byChannel,
    units: countUnits(projectId),
  };
}

export function conversationTurns(projectId: string, sessionId: string) {
  const traces = tracesForSession(projectId, sessionId);
  const obs = traces.flatMap((t) => listObservations(projectId, t.id));
  return obs
    .filter((o) =>
      o.type === "channel.inbound" ||
      o.type === "channel.outbound" ||
      o.type === "nlu" ||
      o.type === "generation" ||
      o.type === "speech.tts" ||
      o.type === "speech.asr",
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function claimWebhookReplay(key: string, ttlMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  let claimed = false;
  commit((s) => {
    s.webhookReplays = (s.webhookReplays ?? []).filter((r) => now - r.at < ttlMs);
    if (s.webhookReplays.some((r) => r.key === key)) return;
    s.webhookReplays.push({ key, at: now });
    claimed = true;
  });
  return claimed;
}
