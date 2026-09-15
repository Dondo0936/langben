import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { signatureHint } from "./channel-copy.ts";

describe("signatureHint", () => {
  it("does not mention webhook HMAC for SDK channels", () => {
    assert.match(signatureHint("viettel"), /SDK \/ OTLP/);
    assert.doesNotMatch(signatureHint("viettel"), /HMAC|webhook trả 401/);
    assert.equal(signatureHint("viettel"), signatureHint("msteams"));
  });

  it("keeps webhook 401 copy for messenger channels", () => {
    assert.match(signatureHint("fpt"), /HMAC/);
    assert.match(signatureHint("zalo_oa"), /OA-MAC/);
    assert.match(signatureHint("lark"), /Verification token/);
  });
});
