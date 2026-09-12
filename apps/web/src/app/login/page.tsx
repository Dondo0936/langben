import { redirect } from "next/navigation";
import { consoleSignInUrl } from "@/lib/console-target";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  redirect(consoleSignInUrl());
}
