export type Lang = "vi" | "en";

export type TraceStatus = "ok" | "error" | "unset";

export type ObservationType =
  | "generation"
  | "span"
  | "tool"
  | "channel.inbound"
  | "channel.outbound"
  | "nlu"
  | "speech.asr"
  | "speech.tts";

export type ChannelType =
  | "zalo_oa"
  | "zalo_bot"
  | "fpt"
  | "viettel"
  | "lark"
  | "gchat"
  | "msteams"
  | "custom";

export type PlanId = "hobby" | "core" | "pro" | "enterprise";

export type Usage = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
  estimatedCostUsd?: number | null;
  audioMs?: number;
  voiceId?: string;
};

export type Project = {
  id: string;
  orgId: string;
  name: string;
  publicKey: string;
  secretKeyHash: string;
  webhookSuffix: string;
};

export type Organization = {
  id: string;
  name: string;
  plan: PlanId;
  teamsAddon: boolean;
  region: "ap-southeast-1" | "eu-central-1" | "us-east-1";
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  orgId: string;
  sessionEpoch: number;
};

export type ChannelConfig = {
  id: string;
  projectId: string;
  type: ChannelType;
  name: string;
  enabled: boolean;
  forwardUrl: string | null;
  forwardEnabled: boolean;
  secrets: Record<string, string>;
  webhookPath: string;
  lastEventAt: string | null;
  lastError: string | null;
  signatureFailures: number;
};

export type RouteDef = {
  id: string;
  projectId: string;
  name: string;
  steps: string[];
};

export type Trace = {
  id: string;
  projectId: string;
  name: string;
  sessionId: string | null;
  userId: string | null;
  channel: string | null;
  routeId: string | null;
  release: string | null;
  environment: string;
  tags: string[];
  startTime: string;
  endTime: string | null;
  status: TraceStatus;
  metadata: Record<string, unknown>;
};

export type Observation = {
  id: string;
  projectId: string;
  traceId: string;
  parentId: string | null;
  type: ObservationType;
  name: string;
  startTime: string;
  endTime: string | null;
  status: TraceStatus;
  input: unknown;
  output: unknown;
  model: string | null;
  provider: string | null;
  region: string | null;
  usage: Usage | null;
  metadata: Record<string, unknown>;
};

export type Session = {
  id: string;
  projectId: string;
  channel: string;
  userId: string;
  firstSeen: string;
  lastSeen: string;
};

export type Score = {
  id: string;
  projectId: string;
  traceId: string | null;
  observationId: string | null;
  name: string;
  value: number;
  comment: string | null;
  source: "manual" | "eval";
  createdAt: string;
};

export type Prompt = {
  id: string;
  projectId: string;
  name: string;
  version: number;
  messages: unknown[];
  config: Record<string, unknown>;
  createdAt: string;
};

export type LlmConnection = {
  id: string;
  projectId: string;
  provider: string;
  name: string;
  region: string | null;
  model: string | null;
  lastPingMs: number | null;
  lastPingAt: string | null;
  lastPingOk: boolean | null;
};

export type WebhookReplay = {
  key: string;
  at: number;
};

export type StoreShape = {
  orgs: Organization[];
  users: User[];
  projects: Project[];
  traces: Trace[];
  observations: Observation[];
  sessions: Session[];
  scores: Score[];
  prompts: Prompt[];
  channels: ChannelConfig[];
  routes: RouteDef[];
  connections: LlmConnection[];
  webhookReplays: WebhookReplay[];
};
