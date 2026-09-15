import { NextRequest, NextResponse } from "next/server";
import { requireChannelApi, requireChannelWrite } from "@/lib/console";
import { getWebhookOrigin, setWebhookOrigin } from "@/lib/store";
import { normalizeWebhookOrigin } from "@/lib/webhook-origin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireChannelApi(req);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ webhookOrigin: getWebhookOrigin() });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireChannelWrite(req);
  if ("error" in auth) return auth.error;
  const body = (await req.json().catch(() => null)) as { webhookOrigin?: unknown } | null;
  if (typeof body?.webhookOrigin !== "string") {
    return NextResponse.json({ error: "webhookOrigin required" }, { status: 400 });
  }
  try {
    const origin = normalizeWebhookOrigin(body.webhookOrigin);
    return NextResponse.json({ webhookOrigin: setWebhookOrigin(origin) });
  } catch {
    return NextResponse.json({ error: "Origin phải là http(s) URL." }, { status: 400 });
  }
}
