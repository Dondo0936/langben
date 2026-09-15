import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { channelTypeForRoute } from "./route-channel.ts";
import type { RouteDef } from "./types.ts";

function route(partial: Partial<RouteDef> & Pick<RouteDef, "id" | "name" | "steps">): RouteDef {
  return { projectId: "prj-vet-demo", ...partial };
}

describe("channelTypeForRoute", () => {
  it("maps seeded pipelines to a channel", () => {
    assert.equal(
      channelTypeForRoute(route({ id: "rt_lark", name: "lark → claude → lark", steps: ["lark.inbound", "generation"] })),
      "lark",
    );
    assert.equal(
      channelTypeForRoute(route({ id: "rt_zalo_fpt_claude", name: "zalo-oa → fpt → claude", steps: ["zalo.inbound", "fpt.nlu"] })),
      "zalo_oa",
    );
    assert.equal(
      channelTypeForRoute(route({ id: "rt_voice", name: "zalo-oa → viettel-asr", steps: ["zalo.inbound", "speech.asr"] })),
      "zalo_oa",
    );
  });
});
