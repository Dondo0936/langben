import { AsyncLocalStorage } from "node:async_hooks";

export type VetClientOptions = {
  publicKey: string;
  secretKey: string;
  baseUrl?: string;
};

type TraceContext = {
  traceId: string;
  sessionId?: string;
  userId?: string;
};

const context = new AsyncLocalStorage<TraceContext>();

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
}

async function postIngest(opts: VetClientOptions, body: unknown) {
  const base = (opts.baseUrl ?? "http://localhost:43173").replace(/\/$/, "");
  const token = Buffer.from(`${opts.publicKey}:${opts.secretKey}`).toString("base64");
  const res = await fetch(`${base}/api/ingest`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vết ingest ${res.status}: ${text}`);
  }
  return res.json();
}

export async function observe<T>(
  name: string,
  fn: () => Promise<T>,
  attrs: {
    sessionId?: string;
    userId?: string;
    tags?: string[];
    channel?: string;
    metadata?: Record<string, unknown>;
  } & VetClientOptions,
): Promise<T> {
  const traceId = id("tr");
  const start = nowIso();
  const opts: VetClientOptions = {
    publicKey: attrs.publicKey,
    secretKey: attrs.secretKey,
    baseUrl: attrs.baseUrl,
  };
  await postIngest(opts, {
    traces: [
      {
        id: traceId,
        name,
        sessionId: attrs.sessionId,
        userId: attrs.userId,
        channel: attrs.channel,
        tags: attrs.tags,
        startTime: start,
        status: "unset",
        metadata: attrs.metadata,
      },
    ],
  });
  try {
    const result = await context.run(
      { traceId, sessionId: attrs.sessionId, userId: attrs.userId },
      fn,
    );
    await postIngest(opts, {
      traces: [{ id: traceId, name, endTime: nowIso(), status: "ok" }],
    });
    return result;
  } catch (err) {
    await postIngest(opts, {
      traces: [
        {
          id: traceId,
          name,
          endTime: nowIso(),
          status: "error",
          metadata: { error: err instanceof Error ? err.message : String(err) },
        },
      ],
    });
    throw err;
  }
}

function usageFromAnthropic(response: unknown) {
  const usage = (response as { usage?: Record<string, number> } | null)?.usage;
  if (!usage) return undefined;
  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheReadTokens: usage.cache_read_input_tokens,
    cacheCreationTokens: usage.cache_creation_input_tokens,
  };
}

export function wrapAnthropic<
  T extends { messages: { create: (...args: never[]) => Promise<unknown> } },
>(client: T, opts: VetClientOptions): T {
  const original = client.messages.create.bind(client.messages);
  client.messages.create = (async (...args: unknown[]) => {
    const params = (args[0] ?? {}) as {
      model?: string;
      messages?: unknown;
      max_tokens?: number;
    };
    const obsId = id("obs");
    const start = Date.now();
    const startTime = nowIso();
    const ctx = context.getStore();
    const traceId = ctx?.traceId ?? id("tr");
    if (!ctx) {
      await postIngest(opts, {
        traces: [
          {
            id: traceId,
            name: "anthropic.messages.create",
            startTime,
            status: "unset",
          },
        ],
      });
    }
    try {
      const result = await original(...(args as never[]));
      await postIngest(opts, {
        observations: [
          {
            id: obsId,
            traceId,
            type: "generation",
            name: "anthropic.messages.create",
            startTime,
            endTime: nowIso(),
            status: "ok",
            model: params.model,
            provider: "anthropic",
            input: params.messages,
            output: result,
            usage: usageFromAnthropic(result),
            metadata: { latencyMs: Date.now() - start, max_tokens: params.max_tokens },
          },
        ],
      });
      return result;
    } catch (err) {
      await postIngest(opts, {
        observations: [
          {
            id: obsId,
            traceId,
            type: "generation",
            name: "anthropic.messages.create",
            startTime,
            endTime: nowIso(),
            status: "error",
            model: params.model,
            provider: "anthropic",
            input: params.messages,
            output: { error: err instanceof Error ? err.message : String(err) },
            metadata: { latencyMs: Date.now() - start },
          },
        ],
      });
      throw err;
    }
  }) as T["messages"]["create"];
  return client;
}

export function wrapFptGetAnswer(
  fetchImpl: typeof fetch,
  opts: VetClientOptions & { endpoint?: string },
) {
  const endpoint = opts.endpoint ?? "https://bot.fpt.ai/api/get_answer/";
  return async function getAnswer(body: {
    channel?: string;
    app_code?: string;
    sender_id?: string;
    message?: unknown;
    [k: string]: unknown;
  }) {
    const obsId = id("obs");
    const start = Date.now();
    const startTime = nowIso();
    const ctx = context.getStore();
    const traceId = ctx?.traceId ?? id("tr");
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => null);
    await postIngest(opts, {
      observations: [
        {
          id: obsId,
          traceId,
          type: "nlu",
          name: "fpt.get_answer",
          startTime,
          endTime: nowIso(),
          status: res.ok ? "ok" : "error",
          input: body,
          output: payload,
          metadata: {
            latencyMs: Date.now() - start,
            route: "fpt-conversation",
            sender_id: body.sender_id,
          },
        },
      ],
    });
    return payload;
  };
}

export { context as vetContext };
