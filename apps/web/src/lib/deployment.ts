import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

const PLACEHOLDERS = new Set(["", "dev-session-secret-change-me", "change-me"]);

export function isCloud() {
  return (process.env.VET_DEPLOYMENT ?? "cloud") !== "self-host";
}

/** Cloud Hobby/Core/Pro/Enterprise are not for sale yet. OSS self-host is the live product. */
export function cloudSelfServe() {
  return process.env.VET_CLOUD_SELF_SERVE === "1";
}

export function publicUrl() {
  return (process.env.VET_PUBLIC_URL ?? "http://localhost:43173").replace(/\/$/, "");
}

export function cookieSecure() {
  return publicUrl().startsWith("https:");
}

export function allowPublicDemo() {
  if (process.env.VET_ALLOW_PUBLIC_DEMO === "1") return true;
  return process.env.NODE_ENV !== "production";
}

function dataDir() {
  return process.env.VET_DATA_DIR
    ? path.resolve(process.env.VET_DATA_DIR)
    : path.join(process.cwd(), "data");
}

function persistedSessionSecret() {
  const dir = dataDir();
  const file = path.join(dir, "session.secret");
  if (existsSync(file)) {
    const existing = readFileSync(file, "utf8").trim();
    if (existing) return existing;
  }
  mkdirSync(dir, { recursive: true });
  const generated = randomBytes(32).toString("hex");
  writeFileSync(file, generated, { encoding: "utf8", mode: 0o600 });
  return generated;
}

export function sessionSecret() {
  const env = process.env.VET_SESSION_SECRET?.trim() ?? "";
  if (env && !PLACEHOLDERS.has(env)) return env;
  if (isCloud() && process.env.NODE_ENV === "production") {
    throw new Error("VET_SESSION_SECRET must be set in Cloud production");
  }
  return persistedSessionSecret();
}
