import { redirect } from "next/navigation";
import { consoleProjectUrl } from "@/lib/console-target";

export const dynamic = "force-dynamic";

export default function RetiredSettingsPage() {
  redirect(consoleProjectUrl("/settings"));
}
