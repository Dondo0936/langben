import { redirect } from "next/navigation";
import { consoleProjectUrl } from "@/lib/console-target";
import { isPlatformSurface } from "@/lib/platform-surface";

export const dynamic = "force-dynamic";

export default function RetiredOverviewPage() {
  redirect(isPlatformSurface() ? consoleProjectUrl("/traces") : "/self-host");
}
