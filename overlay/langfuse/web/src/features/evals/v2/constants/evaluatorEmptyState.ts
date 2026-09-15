export const EVALUATOR_EMPTY_STATE_DOCS_HREF =
  "https://github.com/Dondo0936/langben/blob/main/docs/bo-danh-gia.md";

export const EVALUATOR_ACCENT_BUTTON_CLASSNAME =
  "border-primary-accent/40 bg-primary-accent/10 text-primary-accent hover:bg-primary-accent/15 hover:text-primary-accent";

export const DETECT_TOPICS_ASSISTANT_PROMPT =
  "Identify 5-10 common topics in my traces and create a categorical LLM as a judge evaluator running on root observations of my traces. Make sure to add an 'other' category as well";

export const EVALUATOR_EMPTY_STATE_STARTING_POINTS = [
  {
    action: "detect-topics",
    templateKey: "topic-classifier",
    title: "Phát hiện chủ đề",
    description:
      "Phân loại request đi qua hệ thống để thấy khối lượng từng nhóm.",
  },
  {
    action: "select-template",
    templateKey: "user-disagreement",
  },
] as const;
