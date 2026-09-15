import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { envHttpsOrigin, hookUrl, normalizeWebhookOrigin, resolveWebhookOrigin } from "./webhook-origin.ts";

describe("normalizeWebhookOrigin", () => {
  it("clears a blank value", () => {
    assert.equal(normalizeWebhookOrigin("  "), null);
  });

  it("keeps https host and drops a path", () => {
    assert.equal(normalizeWebhookOrigin("https://hooks.example.com/vet/"), "https://hooks.example.com");
  });

  it("adds https when the scheme is missing", () => {
    assert.equal(normalizeWebhookOrigin("abc.trycloudflare.com"), "https://abc.trycloudflare.com");
  });

  it("rejects a non-http scheme", () => {
    assert.throws(() => normalizeWebhookOrigin("ftp://hooks.example.com"), /invalid_webhook_origin/);
  });
});

describe("envHttpsOrigin", () => {
  it("ignores loopback compose defaults", () => {
    assert.equal(envHttpsOrigin("http://localhost:43173"), null);
  });

  it("uses a deployed https origin", () => {
    assert.equal(envHttpsOrigin("https://vet.example.com/"), "https://vet.example.com");
  });
});

describe("resolveWebhookOrigin", () => {
  it("uses env https only when origin was never saved", () => {
    assert.equal(resolveWebhookOrigin({}, "https://hooks.example.com"), "https://hooks.example.com");
  });

  it("keeps a cleared origin empty", () => {
    assert.equal(resolveWebhookOrigin({ webhookOrigin: null }, "https://hooks.example.com"), null);
    assert.equal(resolveWebhookOrigin({ webhookOrigin: "  " }, "https://hooks.example.com"), null);
  });

  it("returns the saved origin", () => {
    assert.equal(resolveWebhookOrigin({ webhookOrigin: "https://pin.example" }, "https://env.example"), "https://pin.example");
  });
});

describe("hookUrl", () => {
  it("joins origin and path", () => {
    assert.equal(hookUrl("https://vet.example.com", "/hooks/lark/prj-vet-demo"), "https://vet.example.com/hooks/lark/prj-vet-demo");
  });
});
