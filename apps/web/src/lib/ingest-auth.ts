import type { NextRequest } from "next/server";
import { authenticateBySecretKey, authenticateProject } from "./store";

export function parseBasic(header: string | null) {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx < 0) return null;
    return { publicKey: decoded.slice(0, idx), secretKey: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

export function projectFromRequest(req: NextRequest) {
  const basic = parseBasic(req.headers.get("authorization"));
  const publicKey = req.headers.get("x-public-key") ?? basic?.publicKey;
  const secretKey = req.headers.get("x-secret-key") ?? basic?.secretKey;
  if (publicKey && secretKey) {
    return authenticateProject(publicKey, secretKey);
  }
  const bearer = req.headers.get("authorization");
  if (bearer?.startsWith("Bearer sk-")) {
    return authenticateBySecretKey(bearer.slice(7));
  }
  return null;
}
