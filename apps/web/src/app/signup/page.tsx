import { redirect } from "next/navigation";
import { consoleSignInUrl } from "@/lib/console-target";
import { isPlatformSurface } from "@/lib/platform-surface";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  redirect(isPlatformSurface() ? consoleSignInUrl() : "/self-host");
}
