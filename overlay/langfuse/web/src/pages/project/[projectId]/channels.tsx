import { useRouter } from "next/router";
import Page from "@/src/components/layouts/page";

export default function VetChannelsPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;
  const marketing =
    process.env.NEXT_PUBLIC_VET_MARKETING_URL ?? "http://localhost:43173";
  return (
    <Page headerProps={{ title: "Kênh" }}>
      <iframe
        title="Kênh"
        src={`${marketing}/app/channels?embed=1${projectId ? `&project=${encodeURIComponent(projectId)}` : ""}`}
        className="h-[calc(100dvh-7rem)] w-full rounded-md border bg-background"
      />
    </Page>
  );
}
