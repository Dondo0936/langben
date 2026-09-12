import type { Lang } from "./types";

export function langFromCookie(cookie: string): Lang {
  return /(?:^|;\s*)vet_lang=en(?:;|$)/.test(cookie) ? "en" : "vi";
}

export const t = {
  brand: { vi: "Vết", en: "Vết" },
  tagline: {
    vi: "Quan sát LLM — và cả kênh Zalo, FPT, Viettel",
    en: "LLM observability, plus Zalo / FPT / Viettel routes",
  },
  nav: {
    product: { vi: "Sản phẩm", en: "Product" },
    docs: { vi: "Tài liệu", en: "Docs" },
    selfHost: { vi: "Tự vận hành", en: "Self-host" },
    changelog: { vi: "Nhật ký", en: "Changelog" },
    pricing: { vi: "Giá", en: "Pricing" },
    openSource: { vi: "Mã nguồn mở", en: "Open source" },
    login: { vi: "Đăng nhập", en: "Sign in" },
    signup: { vi: "Tạo org", en: "Create org" },
    demo: { vi: "Xem demo", en: "Interactive demo" },
    unitsToolkit: { vi: "Đơn vị", en: "Units" },
  },
  app: {
    overview: { vi: "Tổng quan", en: "Overview" },
    traces: { vi: "Vết", en: "Traces" },
    sessions: { vi: "Phiên", en: "Sessions" },
    observations: { vi: "Quan sát", en: "Observations" },
    channels: { vi: "Kênh", en: "Channels" },
    routes: { vi: "Lộ trình", en: "Routes" },
    studio: { vi: "Studio", en: "Studio" },
    playground: { vi: "Playground", en: "Playground" },
    prompts: { vi: "Prompt", en: "Prompts" },
    evals: { vi: "Đánh giá", en: "Evals" },
    settings: { vi: "Cài đặt", en: "Settings" },
    billing: { vi: "Gói dịch vụ", en: "Plan" },
    tracing: { vi: "Theo dõi", en: "Tracing" },
    search: { vi: "Tìm vết, user, kênh…", en: "Search traces, users, channels…" },
    emptyTraces: { vi: "Chưa có webhook Zalo", en: "No Zalo webhook yet" },
    emptyHint: {
      vi: "Dán URL hook vào Zalo OA, hoặc gửi một lượt ingest từ SDK.",
      en: "Paste the hook URL into Zalo OA, or ingest once from the SDK.",
    },
    loading: { vi: "Đang tải…", en: "Loading…" },
    error: { vi: "Không tải được dữ liệu.", en: "Could not load data." },
    costEst: { vi: "Chi phí (ước tính)", en: "Cost (estimate)" },
    tree: { vi: "Cây", en: "Tree" },
    timeline: { vi: "Timeline", en: "Timeline" },
    graph: { vi: "Graph", en: "Graph" },
    detail: { vi: "Chi tiết", en: "Detail" },
    conversation: { vi: "Hội thoại", en: "Replay" },
    selfHostBadge: { vi: "Tự vận hành · MIT", en: "Self-host · MIT" },
  },
  auth: {
    title: { vi: "Đăng nhập Vết", en: "Sign in to Vết" },
    demoHint: { vi: "Demo: demo@vet.dev / demodemo (console :3000)", en: "Demo: demo@vet.dev / demodemo (console :3000)" },
    password: { vi: "Mật khẩu", en: "Password" },
    submit: { vi: "Vào console", en: "Enter console" },
    pending: { vi: "Đang vào…", en: "Signing in…" },
    badCredentials: { vi: "Sai email hoặc mật khẩu.", en: "Wrong email or password." },
    noOrg: { vi: "Chưa có org trên instance này?", en: "No org on this instance yet?" },
    createOrg: { vi: "Tạo org", en: "Create an org" },
  },
  signup: {
    title: { vi: "Tạo org trên instance này", en: "Create an org on this instance" },
    selfHostTitle: { vi: "Tạo org trên instance này", en: "Create an org on this instance" },
    hobbyBlurb: {
      vi: "MIT tự vận hành — không giới hạn đơn vị, bạn trả infra.",
      en: "MIT self-host — unlimited units, you pay infra.",
    },
    selfHostBlurb: {
      vi: "MIT tự vận hành — không giới hạn đơn vị, bạn trả infra.",
      en: "MIT self-host — unlimited units, you pay infra.",
    },
    orgName: { vi: "Tên tổ chức", en: "Organization name" },
    minChars: { vi: "Tối thiểu 8 ký tự", en: "Minimum 8 characters" },
    keysOnce: { vi: "Khóa ingest chỉ hiện một lần.", en: "Ingest keys are shown once." },
    continue: { vi: "Tiếp tục", en: "Continue" },
    submit: { vi: "Bắt đầu miễn phí", en: "Start free" },
    selfHostSubmit: { vi: "Tạo org", en: "Create org" },
    pending: { vi: "Đang tạo…", en: "Creating…" },
    hasAccount: { vi: "Đã có tài khoản?", en: "Already have an account?" },
    genericError: { vi: "Không tạo được tài khoản.", en: "Could not create account." },
    emailTaken: { vi: "Email đã được dùng.", en: "That email is already in use." },
    comingSoonTitle: { vi: "Tự vận hành Vết", en: "Self-host Vết" },
    comingSoon: {
      vi: "Vết là phần mềm tự vận hành (MIT). Chạy docker compose trên infra của bạn.",
      en: "Vết is self-hosted software (MIT). Run docker compose on your infra.",
    },
  },
} as const;

export function tr(lang: Lang, node: { vi: string; en: string }) {
  return node[lang];
}
