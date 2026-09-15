import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { ClipboardCheck, Users, BarChart4, GitMerge } from "lucide-react";
import { CreateOrEditAnnotationQueueButton } from "@/src/features/annotation-queues/components/CreateOrEditAnnotationQueueButton";

export function AnnotationQueuesOnboarding({
  projectId,
}: {
  projectId: string;
}) {
  const valuePropositions: ValueProposition[] = [
    {
      title: "Quản lý quy trình chấm điểm",
      description:
        "Tạo và quản lý hàng đợi gán nhãn để quy trình chấm điểm gọn hơn.",
      icon: ClipboardCheck,
    },
    {
      title: "Cộng tác với annotator",
      description:
        "Mời thành viên gán nhãn và đánh giá output LLM.",
      icon: Users,
    },
    {
      title: "Theo dõi chỉ số gán nhãn",
      description:
        "Giám sát tiến độ và chất lượng gán nhãn của cả đội.",
      icon: BarChart4,
    },
    {
      title: "Baseline cho đánh giá",
      description:
        "Dùng dữ liệu gán nhãn làm baseline cho các chỉ số đánh giá khác.",
      icon: GitMerge,
    },
  ];

  return (
    <SplashScreen
      title="Bắt đầu với hàng đợi gán nhãn"
      description="Hàng đợi gán nhãn giúp quản lý việc gán nhãn thủ công cho dự án LLM. Tạo hàng đợi, định nghĩa chỉ số và theo dõi tiến độ."
      valuePropositions={valuePropositions}
      primaryAction={{
        label: "Tạo hàng đợi gán nhãn",
        component: (
          <CreateOrEditAnnotationQueueButton
            variant="default"
            projectId={projectId}
            size="lg"
          />
        ),
      }}
    />
  );
}
