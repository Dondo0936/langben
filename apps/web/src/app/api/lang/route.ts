import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { lang?: string } | null;
  const lang = body?.lang === "en" ? "en" : "vi";
  const res = NextResponse.json({ lang });
  res.cookies.set("vet_lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}
