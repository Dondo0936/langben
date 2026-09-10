import { NextRequest, NextResponse } from "next/server";
import { projectFromRequest } from "@/lib/ingest-auth";
import { ingestOtlpJson } from "@/lib/otlp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const project = projectFromRequest(req);
  if (!project) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const result = ingestOtlpJson(project.id, body);
  return NextResponse.json(result);
}
