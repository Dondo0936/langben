import Link from "next/link";
import { ChevronRight, Github, Plus, Slack, Webhook } from "lucide-react";

import { ActionButton } from "@/src/components/ActionButton";
import { Button } from "@/src/components/ui/button";
import { SplashScreen } from "@/src/components/ui/splash-screen";
import { automationCreateHref } from "@/src/features/automations/components/automationForm";
import { type ActionTypes } from "@langfuse/shared";

type OnboardingChannel = {
  actionType: ActionTypes;
  label: string;
  icon: React.ReactNode;
};

const channels: OnboardingChannel[] = [
  {
    actionType: "SLACK",
    label: "Kết nối Slack",
    icon: <Slack className="h-4 w-4" aria-hidden="true" />,
  },
  {
    actionType: "WEBHOOK",
    label: "Kết nối webhook",
    icon: <Webhook className="h-4 w-4" aria-hidden="true" />,
  },
  {
    actionType: "GITHUB_DISPATCH",
    label: "Kết nối GitHub Actions",
    icon: <Github className="h-4 w-4" aria-hidden="true" />,
  },
];

export function MonitorsOnboarding({
  projectId,
  hasCUDAccess,
}: {
  projectId: string;
  hasCUDAccess: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-xl pt-12">
      <SplashScreen
        title="Bắt vấn đề trước khi ảnh hưởng người dùng"
        description="Nhận thông báo khi chi phí, chất lượng, độ trễ hoặc các chỉ số quan trọng khác lệch khỏi khoảng kỳ vọng."
        steps={[
          {
            title: "Chọn nơi nhận cảnh báo",
            description:
              "Gửi cảnh báo tới Slack, webhook hoặc GitHub Actions để đội ngũ và workflow phản hồi tự động.",
            content: (
              <div className="flex flex-col gap-2">
                {channels.map((channel) => (
                  <Button
                    key={channel.actionType}
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full justify-between gap-2 px-6 py-5"
                  >
                    <Link
                      href={automationCreateHref(
                        projectId,
                        channel.actionType,
                        `/project/${projectId}/alerts`,
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {channel.icon}
                        {channel.label}
                      </span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                ))}
              </div>
            ),
          },
          {
            title: "Chọn nội dung cần giám sát",
            description:
              "Tạo cảnh báo khi chi phí tăng đột biến, chất lượng giảm, độ trễ đổi, hoặc các thay đổi quan trọng khác.",
            content: (
              <ActionButton
                hasAccess={hasCUDAccess}
                icon={<Plus className="h-4 w-4" aria-hidden="true" />}
                href={`/project/${projectId}/alerts/new`}
                variant="default"
                size="lg"
              >
                Tạo cảnh báo
              </ActionButton>
            ),
          },
        ]}
      />
    </div>
  );
}
