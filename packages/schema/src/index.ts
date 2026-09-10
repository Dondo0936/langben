import { z } from "zod";

export const observationTypeSchema = z.enum([
  "generation",
  "span",
  "tool",
  "channel.inbound",
  "channel.outbound",
  "nlu",
  "speech.asr",
  "speech.tts",
]);

export const channelTypeSchema = z.enum([
  "zalo_oa",
  "zalo_bot",
  "fpt",
  "viettel",
  "lark",
  "gchat",
  "msteams",
  "custom",
]);

export const llmProviderSchema = z.enum([
  "anthropic",
  "openai-compat",
  "fpt-factory",
  "bedrock",
  "vertex",
  "foundry",
  "google-ai-studio",
]);

export const traceStatusSchema = z.enum(["ok", "error", "unset"]);
export const scoreSourceSchema = z.enum(["manual", "eval"]);
export const planIdSchema = z.enum(["hobby", "core", "pro", "enterprise"]);
export const deploymentModeSchema = z.enum(["cloud", "self-host"]);

export const usageSchema = z.object({
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  cacheReadTokens: z.number().optional(),
  cacheCreationTokens: z.number().optional(),
  estimatedCostUsd: z.number().nullable().optional(),
  audioMs: z.number().optional(),
  voiceId: z.string().optional(),
});

export const ingestObservationSchema = z.object({
  id: z.string().optional(),
  traceId: z.string(),
  parentId: z.string().nullable().optional(),
  type: observationTypeSchema,
  name: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: traceStatusSchema.optional(),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
  region: z.string().optional(),
  usage: usageSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ingestTraceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  channel: z.string().optional(),
  routeId: z.string().optional(),
  release: z.string().optional(),
  environment: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: traceStatusSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ingestBatchSchema = z.object({
  traces: z.array(ingestTraceSchema).optional(),
  observations: z.array(ingestObservationSchema).optional(),
});

export type ObservationType = z.infer<typeof observationTypeSchema>;
export type ChannelType = z.infer<typeof channelTypeSchema>;
export type LlmProvider = z.infer<typeof llmProviderSchema>;
export type TraceStatus = z.infer<typeof traceStatusSchema>;
export type PlanId = z.infer<typeof planIdSchema>;
export type DeploymentMode = z.infer<typeof deploymentModeSchema>;
export type Usage = z.infer<typeof usageSchema>;
export type IngestObservation = z.infer<typeof ingestObservationSchema>;
export type IngestTrace = z.infer<typeof ingestTraceSchema>;
export type IngestBatch = z.infer<typeof ingestBatchSchema>;
