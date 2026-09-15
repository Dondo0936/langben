import Page from "@/src/components/layouts/page";
import { useRouter } from "next/router";
import { useHasProjectAccess } from "@/src/features/rbac";
import { Plus } from "lucide-react";
import EvaluatorTable from "@/src/features/evals/components/evaluator-table";
import {
  getEvalsTabs,
  EVALS_TABS,
} from "@/src/features/navigation/utils/evals-tabs";
import { ActionButton } from "@/src/components/ActionButton";
import { api } from "@/src/utils/api";
import { useEntitlementLimit } from "@/src/features/entitlements";
import { SupportOrUpgradePage } from "@/src/ee/features/billing/components/SupportOrUpgradePage";
import { EvaluatorsOnboarding } from "@/src/components/onboarding/EvaluatorsOnboarding";
import { ManageDefaultEvalModel } from "@/src/features/evals/components/manage-default-eval-model";

export default function EvaluatorsPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const evaluatorLimit = useEntitlementLimit(
    "model-based-evaluations-count-evaluators",
  );
  const hasWriteAccess = useHasProjectAccess({
    projectId,
    scope: "evaluationRule:CUD",
  });

  const hasReadAccess = useHasProjectAccess({
    projectId,
    scope: "evaluationRule:read",
  });

  const countsQuery = api.evals.counts.useQuery(
    {
      projectId,
    },
    {
      enabled: !!projectId,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  const showOnboarding =
    countsQuery.data?.configCount === 0 &&
    countsQuery.data?.templateCount === 0;

  if (!hasReadAccess) {
    return <SupportOrUpgradePage />;
  }

  if (showOnboarding) {
    return (
      <Page
        headerProps={{
          title: "Evaluators",
          help: {
            description:
              "Cấu hình bộ đánh giá (có sẵn hoặc tự viết) để chấm vết vào.",
          },
        }}
        scrollable
      >
        <EvaluatorsOnboarding
          projectId={projectId}
          createEvaluatorAction={{
            label: "Tạo bộ đánh giá",
            href: `/project/${projectId}/evals/legacy/new`,
          }}
        />
      </Page>
    );
  }

  return (
    <Page
      headerProps={{
        title: "Evaluators",
        help: {
          description:
            "Cấu hình bộ đánh giá (có sẵn hoặc tự viết) để chấm vết vào.",
        },
        tabsProps: {
          tabs: getEvalsTabs(projectId),
          activeTab: EVALS_TABS.CONFIGS,
        },
        actionButtonsRight: (
          <>
            <ManageDefaultEvalModel projectId={projectId} />
            <ActionButton
              hasAccess={hasWriteAccess}
              href={`/project/${projectId}/evals/legacy/new`}
              icon={<Plus className="h-4 w-4" />}
              trackingEventName="eval_config:new_form_open"
              variant="default"
              usageLimit={
                typeof evaluatorLimit === "number"
                  ? {
                      current: countsQuery.data?.configActiveCount ?? 0,
                      max: evaluatorLimit,
                    }
                  : undefined
              }
            >
              Thiết lập bộ đánh giá
            </ActionButton>
          </>
        ),
        actionButtonsRightClassName: "justify-end",
      }}
    >
      <EvaluatorTable projectId={projectId} />
    </Page>
  );
}
