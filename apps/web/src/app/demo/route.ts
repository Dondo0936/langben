import { NextResponse } from "next/server";
import { consoleProjectUrl, consoleSignInUrl } from "@/lib/console-target";
import { allowPublicDemo } from "@/lib/deployment";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!allowPublicDemo()) {
    return NextResponse.redirect(consoleSignInUrl());
  }
  return NextResponse.redirect(consoleProjectUrl("/traces"));
}
