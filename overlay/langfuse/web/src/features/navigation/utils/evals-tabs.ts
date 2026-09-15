export const EVALS_TABS = {
  CONFIGS: "configs",
  TEMPLATES: "templates",
} as const;

export const getEvalsTabs = (projectId: string) => [
  {
    value: EVALS_TABS.CONFIGS,
    label: "Bộ đang chạy",
    href: `/project/${projectId}/evals/legacy`,
  },
  {
    value: EVALS_TABS.TEMPLATES,
    label: "Thư viện",
    href: `/project/${projectId}/evals/templates`,
  },
];
