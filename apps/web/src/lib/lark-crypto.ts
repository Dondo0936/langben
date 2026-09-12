import { createDecipheriv, createHash } from "node:crypto";

/** Official Lark AES-256-CBC encrypt-key scheme (SHA-256 of key, IV = first 16 bytes). */
export function decryptLarkEncrypt(encrypt: string, encryptKey: string) {
  const key = createHash("sha256").update(encryptKey).digest();
  const buf = Buffer.from(encrypt, "base64");
  if (buf.length < 32) throw new Error("cipher too short");
  const decipher = createDecipheriv("aes-256-cbc", key, buf.subarray(0, 16));
  return Buffer.concat([decipher.update(buf.subarray(16)), decipher.final()]).toString("utf8");
}

export function unwrapLarkPayload(rawJson: Record<string, unknown>, encryptKey: string | undefined) {
  const enc = rawJson.encrypt;
  if (typeof enc !== "string" || !enc.trim()) return rawJson;
  const key = encryptKey?.trim();
  if (!key) throw new Error("encrypted");
  const plain = decryptLarkEncrypt(enc, key);
  const parsed = JSON.parse(plain) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("invalid plaintext");
  }
  return parsed as Record<string, unknown>;
}
