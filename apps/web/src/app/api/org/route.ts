import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cloudSelfServe } from "@/lib/deployment";
import { CLOUD_PLANS } from "@/lib/plans";
import { getOrg, updateOrgPlan } from "@/lib/store";
import type { PlanId } from "@/lib/types";

export const dynamic = "force-dynamic";

const SELF_SERVE_PLANS = CLOUD_PLANS.filter((p) => p.id !== "enterprise").map((p) => p.id);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const org = getOrg(user.orgId);
  return NextResponse.json({ org });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!cloudSelfServe()) {
    return NextResponse.json(
      { error: "Cloud plans are not self-serve yet.", comingSoon: true },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => null)) as { plan?: string; teamsAddon?: boolean } | null;
  if (!body?.plan) return NextResponse.json({ error: "plan required" }, { status: 400 });
  if (body.plan === "enterprise") {
    return NextResponse.json({ error: "Enterprise is not self-serve. Contact sales." }, { status: 400 });
  }
  if (!SELF_SERVE_PLANS.includes(body.plan as PlanId)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  updateOrgPlan(user.orgId, body.plan as PlanId, body.teamsAddon);
  return NextResponse.json({ ok: true, org: getOrg(user.orgId) });
}
