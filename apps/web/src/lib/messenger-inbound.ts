/** Pull user + text out of Lark / Google Chat webhook bodies (fixture or vendor). */

export function unwrapMessengerText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as { text?: unknown };
      if (typeof parsed.text === "string") return parsed.text;
    } catch {
      /* keep the raw string */
    }
  }
  return value;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function larkInbound(payload: Record<string, unknown>) {
  const event = asRecord(payload.event);
  const sender = asRecord(event?.sender);
  const senderId = sender?.sender_id;
  let userId = "unknown";
  if (typeof senderId === "string" && senderId.trim()) userId = senderId;
  else {
    const ids = asRecord(senderId);
    const openId = ids?.open_id ?? ids?.user_id ?? ids?.union_id;
    if (typeof openId === "string" && openId.trim()) userId = openId;
  }
  const message = asRecord(event?.message);
  const text =
    unwrapMessengerText(message?.content) ??
    (typeof message?.text === "string" ? message.text : undefined);
  return { userId, text };
}

export function gchatInbound(payload: Record<string, unknown>) {
  const message = asRecord(payload.message);
  const chat = asRecord(payload.chat);
  const user =
    asRecord(payload.user) ?? asRecord(chat?.user) ?? asRecord(message?.sender);
  const space = asRecord(payload.space) ?? asRecord(chat?.space);
  const userId =
    typeof user?.name === "string" && user.name.trim() ? user.name : "unknown";
  const text = typeof message?.text === "string" ? message.text : undefined;
  const spaceName = typeof space?.name === "string" ? space.name : undefined;
  return { userId, text, space: spaceName };
}
