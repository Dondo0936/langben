import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { ThumbsUp, Star, LineChart, Code } from "lucide-react";

export function ScoresOnboarding() {
  const valuePropositions: ValueProposition[] = [
    {
      title: "Thu thập phản hồi người dùng",
      description:
        "Thu thập thích hoặc không thích để nhận diện output tốt và kém.",
      icon: ThumbsUp,
    },
    {
      title: "Chạy đánh giá bằng model",
      description: "Dùng LLM để tự động đánh giá output của ứng dụng.",
      icon: Star,
    },
    {
      title: "Theo dõi chỉ số chất lượng",
      description:
        "Giám sát chỉ số chất lượng theo thời gian để thấy xu hướng và vấn đề.",
      icon: LineChart,
    },
    {
      title: "Dùng chỉ số tùy chỉnh",
      description:
        "Điểm linh hoạt, theo dõi được mọi chỉ số gắn với ứng dụng LLM.",
      icon: Code,
    },
  ];

  return (
    <SplashScreen
      title="Bắt đầu với Điểm"
      description="Điểm giúp đánh giá chất lượng hoặc an toàn của ứng dụng LLM qua phản hồi người dùng, đánh giá bằng model, hoặc review thủ công. Có thể dùng qua API và SDK."
      valuePropositions={valuePropositions}
      secondaryAction={{
        label: "Tìm hiểu thêm",
        href: "https://langfuse.com/docs/evaluation/evaluation-methods/custom-scores",
      }}
    />
  );
}
