import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { FileText, GitBranch, Zap, BarChart4 } from "lucide-react";

export function PromptsOnboarding({ projectId }: { projectId: string }) {
  const valuePropositions: ValueProposition[] = [
    {
      title: "Tách khỏi code",
      description:
        "Đưa Prompt mới lên mà không cần redeploy ứng dụng, cập nhật nhanh hơn.",
      icon: FileText,
    },
    {
      title: "Sửa trên UI hoặc bằng code",
      description:
        "Người không chuyên kỹ thuật sửa Prompt trên UI. Developer có thể cập nhật qua API và SDK.",
      icon: GitBranch,
    },
    {
      title: "Tối ưu hiệu năng",
      description:
        "Cache phía client giúp tránh vấn đề độ trễ hoặc sẵn sàng của ứng dụng.",
      icon: Zap,
    },
    {
      title: "So sánh chỉ số",
      description:
        "Theo dõi độ trễ, chi phí và chỉ số đánh giá giữa các phiên bản Prompt.",
      icon: BarChart4,
    },
  ];

  return (
    <SplashScreen
      title="Bắt đầu với quản lý Prompt"
      description="Quản lý tập trung, version control và cùng chỉnh Prompt. Dùng để cải thiện hiệu năng và khả năng bảo trì ứng dụng LLM."
      valuePropositions={valuePropositions}
      primaryAction={{
        label: "Tạo Prompt",
        href: `/project/${projectId}/prompts/new`,
      }}
      secondaryAction={{
        label: "Tìm hiểu thêm",
        href: "https://langfuse.com/docs/prompt-management/get-started",
      }}
    />
  );
}
