import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 32;

export function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function secretsEqual(provided: string, storedHash: string) {
  const ha = Buffer.from(hashSecret(provided));
  const hb = Buffer.from(storedHash);
  if (ha.length !== hb.length) return false;
  return timingSafeEqual(ha, hb);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P }).toString("hex");
  return `scrypt$${salt}$${key}`;
}

export function verifyPassword(password: string, stored: string) {
  if (stored.startsWith("scrypt$")) {
    const parts = stored.split("$");
    const salt = parts[1];
    const key = parts[2];
    if (!salt || !key) return false;
    const actual = scryptSync(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
    const expected = Buffer.from(key, "hex");
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  }
  return secretsEqual(password, stored);
}

export function hmacSign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function sha256Hex(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}

export function safeEqualHex(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function safeEqualString(a: string, b: string) {
  return safeEqualHex(sha256Hex(a), sha256Hex(b));
}
