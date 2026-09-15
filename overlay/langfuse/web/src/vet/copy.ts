/** Vietnamese chrome for overlaid Langfuse shells. Console is vi-only. */

export const pageTitles: Record<string, string> = {
  Home: "Tổng quan",
  Tracing: "Vết",
  "Tracing - Events Table (New)": "Vết - Bảng sự kiện (Mới)",
  "Tracing Setup": "Thiết lập Vết",
  Sessions: "Phiên",
  Users: "Người dùng",
  Alerts: "Cảnh báo",
  "New Alert": "Cảnh báo mới",
  Prompts: "Prompt",
  "Create new prompt": "Tạo prompt mới",
  Playground: "Playground",
  Scores: "Scores",
  "Scores Configs": "Cấu hình score",
  Evaluators: "Bộ đánh giá",
  Rules: "Quy tắc",
  "Set up evaluator": "Thiết lập bộ đánh giá",
  "Create custom evaluator": "Tạo bộ đánh giá tùy chỉnh",
  "Configure evaluator": "Cấu hình bộ đánh giá",
  "New evaluator": "Bộ đánh giá mới",
  "Upgrade Evaluator": "Nâng cấp bộ đánh giá",
  "Default Evaluation Model": "Mô hình đánh giá mặc định",
  "Annotation Queues": "Gán nhãn",
  Datasets: "Tập dữ liệu",
  Experiments: "Thí nghiệm",
  Dashboards: "Bảng điều khiển",
  Dashboard: "Bảng điều khiển",
  "Create Dashboard": "Tạo bảng điều khiển",
  Widgets: "Widget",
  "New Widget": "Widget mới",
  "Edit Widget": "Sửa widget",
  "Project Settings": "Cài đặt dự án",
  "Organization Settings": "Cài đặt tổ chức",
  "Account Settings": "Cài đặt tài khoản",
  "Slack Integration": "Tích hợp Slack",
  "PostHog Integration": "Tích hợp PostHog",
  "Mixpanel Integration": "Tích hợp Mixpanel",
  "Blob Storage Integration": "Tích hợp lưu trữ Blob",
  "Web Callouts": "Web Callout",
  Setup: "Thiết lập",
  "Migration status": "Trạng thái di chuyển",
  Organizations: "Tổ chức",
  "Demo Organization": "Tổ chức demo",
  Automations: "Tự động hóa",
  "Background Migrations": "Di chuyển nền",
  "Loading...": "Đang tải...",
  "Langfuse Home": "Trang chủ Vết",
};

const PREFIXES: Array<[string, string]> = [
  ["Edit Alert", "Sửa cảnh báo"],
  ["Compare runs:", "So sánh lần chạy:"],
  ["Compare experiments:", "So sánh thí nghiệm:"],
];

export function vetTitle(title: string) {
  if (pageTitles[title]) return pageTitles[title];
  const em = " \u2014 New version";
  if (title.endsWith(em)) return `${title.slice(0, -em.length)} Phiên bản mới`;
  if (title.endsWith(" — New version")) {
    return `${title.slice(0, -" — New version".length)} Phiên bản mới`;
  }
  for (const [en, vi] of PREFIXES) {
    if (title === en) return vi;
    if (title.startsWith(`${en} `) || title.startsWith(en)) {
      return `${vi}${title.slice(en.length)}`;
    }
  }
  return title.replace(" (Langfuse Maintained)", " (Langfuse)");
}

export function vetHeaderProps<T extends { title: string }>(headerProps: T): T {
  return { ...headerProps, title: vetTitle(headerProps.title) };
}
