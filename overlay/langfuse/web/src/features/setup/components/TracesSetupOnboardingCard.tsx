import { ActionButton } from "@/src/components/ActionButton";
import { Button } from "@/src/components/ui/button";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { ApiKeyDetailContent } from "@/src/features/public-api/components/ApiKeyDetailContent";
import { useLangfuseBaseUrl } from "@/src/features/public-api/hooks/useLangfuseEnvCode";
import { useHasProjectAccess } from "@/src/features/rbac";
import { api, reportNonTrpcError } from "@/src/utils/api";
import { type RouterOutput } from "@/src/utils/types";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TracesSetupOnboardingCard({
  projectId,
}: {
  projectId: string;
}) {
  const capture = usePostHogClientCapture();
  const baseUrl = useLangfuseBaseUrl();
  const hasApiKeyCreateAccess = useHasProjectAccess({
    projectId,
    scope: "apiKeys:CUD",
  });
  const [apiKeys, setApiKeys] = useState<
    RouterOutput["projectApiKeys"]["create"] | null
  >(null);
  const utils = api.useUtils();
  const mutCreateApiKey = api.projectApiKeys.create.useMutation({
    onSuccess: (data) => {
      utils.projectApiKeys.invalidate();
      setApiKeys(data);
    },
  });

  const createApiKey = async () => {
    capture("onboarding:tracing_api_key_create_clicked");

    try {
      await mutCreateApiKey.mutateAsync({ projectId });
    } catch (error) {
      reportNonTrpcError(error, "setup");
      toast.error("Không tạo được API key");
    }
  };

  return (
    <SplashScreen
      waitingFor="Đang chờ vết đầu tiên"
      title="Ghi lượt đầu tiên"
      description="Gửi thử trên Kênh. Khóa API chỉ cần khi bot production ingest."
      videoPosition="bottom"
      steps={[
        {
          title: "Gửi thử trên Kênh",
          description: "Bật Lark hoặc Google Chat, nhấn Gửi thử. Phiên xuất hiện trong vài giây.",
          content: (
            <ActionButton
              href={`/project/${projectId}/channels`}
              variant="default"
            >
              Mở Kênh
            </ActionButton>
          ),
        },
        {
          title: "Khóa API (bot production)",
          description: "pk/sk để ingest từ bot. Không cần cho Gửi thử local.",
          content: apiKeys ? (
            <ApiKeyDetailContent
              scope="project"
              secretKey={apiKeys.secretKey}
              publicKey={apiKeys.publicKey}
              baseUrl={baseUrl}
              className="mt-1"
              showMcpSection={false}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {hasApiKeyCreateAccess ? (
                <Button
                  onClick={createApiKey}
                  loading={mutCreateApiKey.isPending}
                  className="self-start"
                >
                  Tạo khóa API
                </Button>
              ) : (
                <Button disabled className="self-start">
                  <LockIcon
                    className="mr-2 -ml-0.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  Tạo khóa API
                </Button>
              )}
              <ActionButton
                href={`/project/${projectId}/settings/api-keys`}
                variant="secondary"
              >
                Quản lý khóa API
              </ActionButton>
            </div>
          ),
        },
      ]}
    />
  );
}
