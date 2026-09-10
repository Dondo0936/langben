import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/console";
import { listTraces } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireApiSession();
  if ("error" in auth) return auth.error;
  const { searchParams } = req.nextUrl;
  const traces = listTraces(auth.project.id, {
    q: searchParams.get("q") ?? undefined,
    channel: searchParams.get("channel") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  return NextResponse.json({ traces });
}
