export const EVALS_V2_TABS = {
  EVALUATORS: "evaluators",
  RULES: "rules",
} as const;

export const getEvalsV2Tabs = (projectId: string) => [
  {
    value: EVALS_V2_TABS.EVALUATORS,
    label: "Bộ đánh giá",
    href: `/project/${projectId}/evals`,
  },
  {
    value: EVALS_V2_TABS.RULES,
    label: "Quy tắc",
    href: `/project/${projectId}/evals/rules`,
  },
];
