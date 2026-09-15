import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPlatformPath, isRetiredConsolePath, mapRetiredConsolePath } from "./platform-surface.ts";

describe("isPlatformPath", () => {
  it("allows operator home, Kênh, Lộ trình, and ingress", () => {
    for (const path of [
      "/",
      "/platform",
      "/app/channels",
      "/app/channels/zalo_oa",
      "/app/routes",
      "/hooks/zalo/bot/prj-vet-demo",
      "/hooks/lark/prj-vet-demo",
      "/api/channels",
      "/api/channels/test",
      "/api/settings",
      "/api/lang",
      "/otlp/v1/traces",
      "/logo.svg",
      "/robots.txt",
      "/_next/static/chunks/app.js",
    ]) {
      assert.equal(isPlatformPath(path), true, path);
    }
  });

  it("rejects the public brochure", () => {
    for (const path of [
      "/docs",
      "/docs/units",
      "/docs/diem",
      "/docs/scores",
      "/pricing",
      "/self-host",
      "/open-source",
      "/changelog",
      "/security",
      "/enterprise",
      "/signup",
      "/login",
      "/demo",
    ]) {
      assert.equal(isPlatformPath(path), false, path);
    }
  });
});

describe("retired console clones", () => {
  it("keeps Kênh and Lộ trình on this origin", () => {
    assert.equal(isRetiredConsolePath("/app/channels"), false);
    assert.equal(isRetiredConsolePath("/app/channels/zalo_bot"), false);
    assert.equal(isRetiredConsolePath("/app/routes"), false);
  });

  it("maps leftover /app traces to the Langfuse console", () => {
    assert.equal(isRetiredConsolePath("/app/traces"), true);
    assert.equal(mapRetiredConsolePath("/app/traces/abc"), "/traces/abc");
  });
});
