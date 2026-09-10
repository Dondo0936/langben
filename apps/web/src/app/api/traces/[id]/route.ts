import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/console";
import { getTrace, listObservations, listScores } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireApiSession();
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const project = auth.project;
  const trace = getTrace(project.id, id);
  if (!trace) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    trace,
    observations: listObservations(project.id, id),
    scores: listScores(project.id, id),
  });
}
