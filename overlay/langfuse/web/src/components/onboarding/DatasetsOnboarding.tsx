import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { ButtonWithIcon } from "@/src/components/ButtonWithIcon";
import { DialogTrigger } from "@/src/components/ui/dialog";
import { CreateDatasetDialogController } from "@/src/features/datasets/components/CreateDatasetDialogController";
import { Database, Beaker, Zap, Code, LockIcon, PlusIcon } from "lucide-react";

export function DatasetsOnboarding({ projectId }: { projectId: string }) {
  const valuePropositions: ValueProposition[] = [
    {
      title: "Cải tiến liên tục",
      description:
        "Tạo dataset từ edge case production để cải thiện ứng dụng.",
      icon: Zap,
    },
    {
      title: "Kiểm thử trước khi deploy",
      description: "Benchmark bản mới trước khi đưa lên production.",
      icon: Beaker,
    },
    {
      title: "Kiểm thử có cấu trúc",
      description:
        "Chạy experiment trên các tập input và expected output.",
      icon: Database,
    },
    {
      title: "Workflow tùy chỉnh",
      description:
        "Xây workflow quanh dataset qua API và SDK, ví dụ fine-tuning hoặc few-shotting.",
      icon: Code,
    },
  ];

  return (
    <SplashScreen
      title="Bắt đầu với Dataset và Experiment"
      description="Dataset là tập input (và expected output) cho ứng dụng LLM. Chạy Experiment trên dataset để kiểm thử bản mới trước khi lên production."
      valuePropositions={valuePropositions}
      primaryAction={{
        label: "Tạo Dataset",
        component: (
          <CreateDatasetDialogController
            projectId={projectId}
            target={{ type: "root" }}
          >
            {({ disabled, openDialog }) => (
              <DialogTrigger asChild>
                <ButtonWithIcon
                  size="lg"
                  disabled={disabled !== undefined}
                  onClick={openDialog}
                  variant="default"
                  icon={disabled === undefined ? PlusIcon : LockIcon}
                  text="Dataset mới"
                />
              </DialogTrigger>
            )}
          </CreateDatasetDialogController>
        ),
      }}
      secondaryAction={{
        label: "Tìm hiểu thêm",
        href: "https://langfuse.com/docs/datasets",
      }}
    />
  );
}
