import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/console";
import { stats } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireApiSession();
  if ("error" in auth) return auth.error;
  return NextResponse.json(stats(auth.project.id));
}
