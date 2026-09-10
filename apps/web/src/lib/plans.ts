export type PlanId = "hobby" | "core" | "pro" | "enterprise";

export type CloudPlan = {
  id: PlanId;
  name: string;
  taglineVi: string;
  taglineEn: string;
  monthlyUsd: number;
  includedUnits: number;
  retention: string;
  retentionEn: string;
  users: string;
  usersEn: string;
  ctaVi: string;
  ctaEn: string;
  highlighted?: boolean;
};

export const CLOUD_PLANS: CloudPlan[] = [
  {
    id: "hobby",
    name: "Hobby",
    taglineVi: "Dùng thử, không cần thẻ. Phù hợp POC và side project.",
    taglineEn: "Get started, no credit card. Great for hobby projects and POCs.",
    monthlyUsd: 0,
    includedUnits: 50_000,
    retention: "30 ngày",
    retentionEn: "30 days",
    users: "2 thành viên",
    usersEn: "2 users",
    ctaVi: "Bắt đầu miễn phí",
    ctaEn: "Start free",
  },
  {
    id: "core",
    name: "Core",
    taglineVi: "Cho bot production. Lưu lâu hơn, không giới hạn thành viên.",
    taglineEn: "For production projects. Longer retention, unlimited users.",
    monthlyUsd: 29,
    includedUnits: 100_000,
    retention: "90 ngày",
    retentionEn: "90 days",
    users: "Không giới hạn",
    usersEn: "Unlimited",
    ctaVi: "Dùng Core",
    ctaEn: "Choose Core",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    taglineVi: "Team đang scale. Lịch sử dài, hạn mức cao, báo cáo tuân thủ.",
    taglineEn: "For scaling projects. Long history, high limits, compliance reports.",
    monthlyUsd: 199,
    includedUnits: 100_000,
    retention: "3 năm",
    retentionEn: "3 years",
    users: "Không giới hạn",
    usersEn: "Unlimited",
    ctaVi: "Dùng Pro",
    ctaEn: "Choose Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    taglineVi: "Hỗ trợ và bảo mật cấp doanh nghiệp. SLA, audit, SCIM.",
    taglineEn: "Enterprise-grade support and security. SLA, audit logs, SCIM.",
    monthlyUsd: 2499,
    includedUnits: 100_000,
    retention: "3 năm",
    retentionEn: "3 years",
    users: "Không giới hạn",
    usersEn: "Unlimited",
    ctaVi: "Liên hệ sales",
    ctaEn: "Contact sales",
  },
];

export const TEAMS_ADDON_USD = 300;

export const USAGE_TIERS = [
  { upTo: 100_000, usdPer100k: 0, label: "Gói gồm sẵn", labelEn: "Included in plan" },
  { upTo: 1_000_000, usdPer100k: 8, label: "100k – 1M", labelEn: "100k – 1M" },
  { upTo: 10_000_000, usdPer100k: 7, label: "1M – 10M", labelEn: "1M – 10M" },
  { upTo: 50_000_000, usdPer100k: 6.5, label: "10M – 50M", labelEn: "10M – 50M" },
  { upTo: Infinity, usdPer100k: 6, label: "50M+", labelEn: "50M+" },
];

export type CompareRow = {
  group: string;
  groupEn: string;
  feature: string;
  featureEn: string;
  hobby: string;
  core: string;
  pro: string;
  enterprise: string;
};

export const CLOUD_COMPARE: CompareRow[] = [
  {
    group: "Quan sát",
    groupEn: "Observability",
    feature: "Vết, cây quan sát, hội thoại kênh",
    featureEn: "Traces, observation tree, channel replay",
    hobby: "Có",
    core: "Có",
    pro: "Có",
    enterprise: "Có",
  },
  {
    group: "Quan sát",
    groupEn: "Observability",
    feature: "Kênh Zalo OA/Bot, FPT.AI, Viettel, Lark, Google Chat, .NET",
    featureEn: "Zalo OA/Bot, FPT.AI, Viettel, Lark, Google Chat, .NET",
    hobby: "Có",
    core: "Có",
    pro: "Có",
    enterprise: "Có",
  },
  {
    group: "Quan sát",
    groupEn: "Observability",
    feature: "Hyperscaler: Bedrock, Vertex, Foundry",
    featureEn: "Hyperscalers: Bedrock, Vertex, Foundry",
    hobby: "Có",
    core: "Có",
    pro: "Có",
    enterprise: "Có",
  },
  {
    group: "Sử dụng",
    groupEn: "Usage",
    feature: "Đơn vị gồm sẵn / tháng",
    featureEn: "Included units / month",
    hobby: "50k",
    core: "100k",
    pro: "100k",
    enterprise: "100k",
  },
  {
    group: "Sử dụng",
    groupEn: "Usage",
    feature: "Đơn vị phát sinh",
    featureEn: "Additional usage",
    hobby: "—",
    core: "$8/100k",
    pro: "$8/100k",
    enterprise: "$8/100k",
  },
  {
    group: "Sử dụng",
    groupEn: "Usage",
    feature: "Lưu dữ liệu",
    featureEn: "Data access",
    hobby: "30 ngày",
    core: "90 ngày",
    pro: "3 năm",
    enterprise: "3 năm",
  },
  {
    group: "Sử dụng",
    groupEn: "Usage",
    feature: "Ingest (req/phút)",
    featureEn: "Ingestion throughput",
    hobby: "1.000",
    core: "4.000",
    pro: "20.000",
    enterprise: "Tùy chỉnh",
  },
  {
    group: "Cộng tác",
    groupEn: "Collaboration",
    feature: "Thành viên",
    featureEn: "Users",
    hobby: "2",
    core: "Không giới hạn",
    pro: "Không giới hạn",
    enterprise: "Không giới hạn",
  },
  {
    group: "Studio",
    groupEn: "Studio",
    feature: "Prompt, Playground, điểm đánh giá",
    featureEn: "Prompts, Playground, scores",
    hobby: "Có",
    core: "Có",
    pro: "Có",
    enterprise: "Có",
  },
  {
    group: "Hỗ trợ",
    groupEn: "Support",
    feature: "Cộng đồng GitHub",
    featureEn: "Community (GitHub)",
    hobby: "Có",
    core: "Có",
    pro: "Có",
    enterprise: "Có",
  },
  {
    group: "Hỗ trợ",
    groupEn: "Support",
    feature: "Hỗ trợ in-app",
    featureEn: "In-app support",
    hobby: "—",
    core: "Có (48h)",
    pro: "Có (48h)",
    enterprise: "SLA riêng",
  },
  {
    group: "Bảo mật",
    groupEn: "Security",
    feature: "Vùng dữ liệu",
    featureEn: "Data region",
    hobby: "Singapore, EU, US",
    core: "Singapore, EU, US",
    pro: "Singapore, EU, US",
    enterprise: "Singapore, EU, US, HIPAA",
  },
  {
    group: "Bảo mật",
    groupEn: "Security",
    feature: "SSO doanh nghiệp (Okta / Entra)",
    featureEn: "Enterprise SSO (Okta / Entra)",
    hobby: "—",
    core: "—",
    pro: "Add-on Teams",
    enterprise: "Có",
  },
  {
    group: "Bảo mật",
    groupEn: "Security",
    feature: "Nhật ký audit / SCIM",
    featureEn: "Audit logs / SCIM",
    hobby: "—",
    core: "—",
    pro: "—",
    enterprise: "Có",
  },
  {
    group: "Tuân thủ",
    groupEn: "Compliance",
    feature: "Báo cáo SOC 2 / ISO 27001",
    featureEn: "SOC 2 / ISO 27001 reports",
    hobby: "—",
    core: "—",
    pro: "Có",
    enterprise: "Có",
  },
];

export const SELF_HOST_COMPARE = [
  { feature: "Mọi tính năng sản phẩm (MIT)", featureEn: "All product features (MIT)", oss: "Có", ent: "Có" },
  { feature: "Không giới hạn đơn vị", featureEn: "Unlimited units", oss: "Có", ent: "Có" },
  { feature: "Docker Compose / Helm", featureEn: "Docker Compose / Helm", oss: "Có", ent: "Có" },
  { feature: "Hỗ trợ cộng đồng", featureEn: "Community support", oss: "Có", ent: "Có" },
  { feature: "Hỗ trợ riêng + SLA", featureEn: "Dedicated support + SLA", oss: "—", ent: "Có" },
  { feature: "RBAC theo project, audit, SCIM", featureEn: "Project RBAC, audit, SCIM", oss: "—", ent: "Có" },
  { feature: "Giữ dữ liệu trên infra của bạn", featureEn: "Data stays on your infra", oss: "Có", ent: "Có" },
];

export function formatUsd(n: number) {
  if (n === 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

const COMPARE_CELL_EN: Record<string, string> = {
  Có: "Yes",
  "—": "—",
  "Không giới hạn": "Unlimited",
  "30 ngày": "30 days",
  "90 ngày": "90 days",
  "3 năm": "3 years",
  "Tùy chỉnh": "Custom",
  "Có (48h)": "Yes (48h)",
  "SLA riêng": "Custom SLA",
  "Add-on Teams": "Teams add-on",
};

export function compareCell(value: string, lang: "vi" | "en") {
  if (lang === "vi") return value;
  return COMPARE_CELL_EN[value] ?? value;
}

export function estimateOverageUsd(units: number, included: number) {
  const extra = Math.max(0, units - included);
  if (extra === 0) return 0;
  let cost = 0;
  let prev = 0;
  for (const tier of USAGE_TIERS) {
    const chargeStart = Math.max(prev, included);
    const chargeEnd = Math.min(tier.upTo, units);
    const span = Math.max(0, chargeEnd - chargeStart);
    cost += (span / 100_000) * tier.usdPer100k;
    prev = tier.upTo;
    if (prev >= units) break;
  }
  return cost;
}
