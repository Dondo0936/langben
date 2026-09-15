import { Bot, Gauge, Zap, BarChart4 } from "lucide-react";

import {
  type ActionConfig,
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";

const llmAsJudgeValuePropositions: ValueProposition[] = [
  {
    title: "Chấm tự động",
    description:
      "Dùng LLM-as-a-judge để chấm vết, không cần đọc từng lượt.",
    icon: Bot,
  },
  {
    title: "Đo chất lượng",
    description:
      "Đặt tiêu chí chấm cho output LLM (đúng, hữu ích, an toàn).",
    icon: Gauge,
  },
  {
    title: "Chạy theo lô",
    description:
      "Chấm hàng nghìn vết với tỉ lệ lấy mẫu tùy chỉnh.",
    icon: Zap,
  },
  {
    title: "Theo dõi theo thời gian",
    description:
      "Xem score theo thời gian để thấy xu hướng, không chỉ một lượt.",
    icon: BarChart4,
  },
];

export function EvaluatorsOnboardingView({
  codeEvaluatorLanguageDescription,
  createEvaluatorAction,
}: {
  codeEvaluatorLanguageDescription: string | null;
  createEvaluatorAction: ActionConfig;
}) {
  if (codeEvaluatorLanguageDescription) {
    return (
      <SplashScreen
        title="Bắt đầu với bộ đánh giá"
        description={
          <>
            Bộ đánh giá chấm vết và observation tự động. Có hai loại:
            <ul className="text-muted-foreground mx-auto mt-2 max-w-2xl list-disc space-y-2 pl-5 text-left text-sm">
              <li>
                <span className="text-foreground font-bold">
                  LLM-as-a-judge
                </span>{" "}
                dùng LLM chấm output theo tiêu chí viết bằng ngôn ngữ tự nhiên.
              </li>
              <li>
                <span className="text-foreground font-bold">
                  Code evaluator
                </span>{" "}
                dùng logic {codeEvaluatorLanguageDescription} để chấm xác định.
              </li>
            </ul>
          </>
        }
        primaryAction={createEvaluatorAction}
      />
    );
  }

  return (
    <SplashScreen
      title="Bắt đầu với LLM-as-a-judge"
      description="Tạo bộ đánh giá để chấm vết tự động. Đặt tiêu chí, rồi LLM chấm chất lượng câu trả lời."
      valuePropositions={llmAsJudgeValuePropositions}
      primaryAction={createEvaluatorAction}
    />
  );
}
