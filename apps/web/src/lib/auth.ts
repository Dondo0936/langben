import { cookies } from "next/headers";
import { hmacSign, safeEqualHex } from "./crypto";
import { cookieSecure, sessionSecret } from "./deployment";
import { getUser } from "./store";

const COOKIE = "vet_session";
const MAX_AGE = 60 * 60 * 24 * 14;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
    secure: cookieSecure(),
  };
}

export function signSession(userId: string, epoch = 0) {
  const exp = Date.now() + 1000 * MAX_AGE;
  const payload = `${userId}.${exp}.${epoch}`;
  return `${payload}.${hmacSign(payload, sessionSecret())}`;
}

export function readSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [userId, exp, epoch, sig] = parts;
  if (!userId || !/^\d+$/.test(exp) || !/^\d+$/.test(epoch) || !sig) return null;
  const expected = hmacSign(`${userId}.${exp}.${epoch}`, sessionSecret());
  if (!safeEqualHex(expected, sig)) return null;
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || expMs < Date.now()) return null;
  return { userId, epoch: Number(epoch) };
}

export async function getCurrentUser() {
  const jar = await cookies();
  const parsed = readSessionToken(jar.get(COOKIE)?.value);
  if (!parsed) return null;
  const user = getUser(parsed.userId);
  if (!user) return null;
  if ((user.sessionEpoch ?? 0) !== parsed.epoch) return null;
  return user;
}

export const SESSION_COOKIE = COOKIE;
