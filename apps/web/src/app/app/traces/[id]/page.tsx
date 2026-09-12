import { redirect } from "next/navigation";
import { consoleProjectUrl } from "@/lib/console-target";

export const dynamic = "force-dynamic";

export default async function RetiredTracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(consoleProjectUrl(`/traces/${encodeURIComponent(id)}`));
}
