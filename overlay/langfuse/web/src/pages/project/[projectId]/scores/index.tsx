import { useRouter } from "next/router";
import ScoresTable from "@/src/components/table/use-cases/scores";
import Page from "@/src/components/layouts/page";
import { api } from "@/src/utils/api";
import { ScoresOnboarding } from "@/src/components/onboarding/ScoresOnboarding";
import {
  getScoresTabs,
  SCORES_TABS,
} from "@/src/features/navigation/utils/scores-tabs";

export default function ScoresPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const { data: hasAnyScore, isLoading } = api.scores.hasAny.useQuery(
    { projectId },
    {
      enabled: !!projectId,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
      refetchInterval: 10_000,
    },
  );

  const showOnboarding = !isLoading && !hasAnyScore;

  return (
    <Page
      headerProps={{
        title: "Scores",
        help: {
          description:
            "Score là đánh giá gắn vào một lượt. Gắn từ Phiên, hoặc gửi kèm ingest.",
        },
        tabsProps: {
          tabs: getScoresTabs(projectId),
          activeTab: SCORES_TABS.SCORES,
        },
      }}
      scrollable={showOnboarding}
    >
      {showOnboarding ? (
        <ScoresOnboarding />
      ) : (
        <ScoresTable
          projectId={projectId}
          showControlsInPageHeader
          showAllEnvironments={router.query.showAllEnvironments === "true"}
        />
      )}
    </Page>
  );
}
