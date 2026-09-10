import { requireConsole } from "@/lib/console";

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  await requireConsole();
  return children;
}
