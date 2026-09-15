import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hostnameOf, isLocalOperatorRequest } from "./local-operator.ts";

function req(headers: Record<string, string>) {
  return { headers: new Headers(headers) };
}

describe("hostnameOf", () => {
  it("strips the port", () => {
    assert.equal(hostnameOf("localhost:43173"), "localhost");
  });

  it("reads the first forwarded host", () => {
    assert.equal(hostnameOf("abc.trycloudflare.com, localhost"), "abc.trycloudflare.com");
  });
});

describe("isLocalOperatorRequest", () => {
  it("allows a browser on localhost", () => {
    assert.equal(isLocalOperatorRequest(req({ host: "localhost:43173" })), true);
  });

  it("rejects a tunnel hostname", () => {
    assert.equal(isLocalOperatorRequest(req({ host: "abc.trycloudflare.com" })), false);
  });

  it("rejects localhost Host when x-forwarded-host is the tunnel", () => {
    assert.equal(
      isLocalOperatorRequest(
        req({ host: "localhost:43173", "x-forwarded-host": "abc.trycloudflare.com" }),
      ),
      false,
    );
  });
});
