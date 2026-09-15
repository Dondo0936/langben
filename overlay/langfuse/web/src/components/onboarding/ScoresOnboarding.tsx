import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { useQueryProject } from "@/src/features/projects/hooks";
import { MessageSquare, PenLine, Code } from "lucide-react";

export function ScoresOnboarding() {
  const { project } = useQueryProject();
  const sessionsHref = project?.id
    ? `/project/${project.id}/sessions`
    : "/";
  const valuePropositions: ValueProposition[] = [
    {
      title: "Gắn vào một lượt",
      description:
        "Mở Phiên, chọn lượt, thêm score (tên + giá trị). Gửi thử trên Kênh chỉ tạo phiên — chưa tạo score.",
      icon: PenLine,
    },
    {
      title: "Đo câu trả lời, không đo token",
      description:
        "Ví dụ helpful 0/1, hoặc nhãn đúng/sai. Cấu hình tên score ở Cài đặt → Cấu hình score.",
      icon: MessageSquare,
    },
    {
      title: "SDK khi bot chạy production",
      description:
        "Ingest khi bot chạy production, cùng lượt với tin Zalo/Lark. Khóa pk/sk ở Cài đặt → Khóa API.",
      icon: Code,
    },
  ];

  return (
    <SplashScreen
      title="Chưa có score"
      description="Score là nhãn chất lượng trên một lượt agent. Bảng này trống cho đến khi bạn gắn score vào một phiên."
      valuePropositions={valuePropositions}
      primaryAction={{
        label: "Mở Phiên",
        href: sessionsHref,
      }}
    />
  );
}
