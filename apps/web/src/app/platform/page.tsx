import { notFound } from "next/navigation";
import { PlatformHome } from "@/components/platform/Home";
import { isPlatformSurface } from "@/lib/platform-surface";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kênh" };

export default async function PlatformPage() {
  if (!isPlatformSurface()) notFound();
  return <PlatformHome />;
}
