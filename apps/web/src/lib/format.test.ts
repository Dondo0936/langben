import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatTime } from "./format.ts";

describe("formatTime", () => {
  it("formats UTC instants in Asia/Ho_Chi_Minh, not the host TZ", () => {
    const text = formatTime("2026-09-15T06:30:43.000Z", "vi");
    assert.match(text, /13:30:43/);
    assert.match(text, /15/);
  });
});
