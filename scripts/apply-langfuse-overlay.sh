#!/usr/bin/env bash
# Copy Vết overlay onto a Langfuse tree (default: .build/langfuse).
# Does not dirty vendor/langfuse — run after rsync from the submodule.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor/langfuse"
OVERLAY="$ROOT/overlay/langfuse"
DEST="${1:-$ROOT/.build/langfuse}"

if [[ ! -d "$VENDOR/web" ]]; then
  echo "vendor/langfuse is missing. Run: bash scripts/bootstrap-langfuse.sh" >&2
  exit 1
fi

mkdir -p "$DEST"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --checksum --delete --exclude .git "$VENDOR/" "$DEST/"
  rsync -a --checksum "$OVERLAY/" "$DEST/"
else
  rm -rf "$DEST"
  cp -R "$VENDOR" "$DEST"
  rm -rf "$DEST/.git"
  cp -R "$OVERLAY/." "$DEST/"
fi

python3 - "$DEST" <<'PY'
from pathlib import Path
from urllib.parse import urlparse
import os
import sys
dest = Path(sys.argv[1])
replacements = {
    "Sign in | Langfuse": "Sign in | Vết",
    "Sign up | Langfuse": "Sign up | Vết",
    "Sign-in Error | Langfuse": "Sign-in Error | Vết",
    "Signing in | Langfuse": "Signing in | Vết",
    "Onboarding | Langfuse": "Onboarding | Vết",
    "Enterprise SSO Required | Langfuse": "Enterprise SSO Required | Vết",
    "Langfuse on Hugging Face": "Vết on Hugging Face",
}
pages = dest / "web/src"
if pages.is_dir():
    for path in pages.rglob("*"):
        if path.suffix not in {".tsx", ".ts"}:
            continue
        rel = str(path).replace("\\", "/")
        if "/ee/" in rel or "clienttest" in path.name or ".test." in path.name:
            continue
        text = path.read_text()
        orig = text
        for a, b in replacements.items():
            text = text.replace(a, b)
        text = text.replace(" | Langfuse", " | Vết")
        if text != orig:
            path.write_text(text)
            print("retitled", path.relative_to(dest))

doc = dest / "web/src/pages/_document.tsx"
if doc.is_file():
    text = doc.read_text()
    needle = "      <Head />"
    inject = '''      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`html,body{font-family:"Be Vietnam Pro",ui-sans-serif,system-ui,sans-serif}`}</style>
      </Head>'''
    if "Be Vietnam Pro" not in text and needle in text:
        doc.write_text(text.replace(needle, inject, 1))
        print("fonts", doc.relative_to(dest))

css = dest / "web/src/styles/globals.css"
if css.is_file():
    extra = """
/* Vết overlay: monochrome + Be Vietnam Pro. */
html {
  font-family: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
  color-scheme: dark;
}
html, body, #__next {
  background: #000 !important;
}
.dark {
  --background: 0 0% 0%;
  --foreground: 0 0% 88%;
  --card: 0 0% 4%;
  --header: 0 0% 0%;
  --primary-accent: 0 0% 88%;
  --link: 0 0% 88%;
  --link-hover: 0 0% 100%;
  --ring: 0 0% 80%;
  --destructive: 0 0% 72%;
  --chart-1: 0 0% 88%;
  --chart-2: 0 0% 72%;
  --chart-3: 0 0% 54%;
  --chart-4: 0 0% 80%;
  --chart-5: 0 0% 64%;
  --chart-6: 0 0% 48%;
  --chart-7: 0 0% 76%;
  --chart-8: 0 0% 40%;
  --muted-blue: 0 0% 72%;
  --muted-green: 0 0% 72%;
  --muted-magenta: 0 0% 72%;
  --light-red: oklch(28% 0 0 / 0.7);
  --dark-red: oklch(78% 0 0);
  --light-yellow: oklch(32% 0 0 / 0.45);
  --dark-yellow: oklch(82% 0 0);
  --light-green: oklch(30% 0 0 / 0.7);
  --dark-green: oklch(80% 0 0);
  --light-blue: 0 0% 16%;
  --dark-blue: 0 0% 72%;
  --accent-light-green: 0 0% 9%;
  --accent-dark-green: 0 0% 70%;
  --accent-light-blue: 0 0% 12%;
  --accent-dark-blue: 0 0% 78%;
  --light-violet: 0 0% 16%;
  --dark-violet: 0 0% 78%;
  --light-teal: 0 0% 12%;
  --dark-teal: 0 0% 70%;
  --qlang-field: 0 0% 78%;
  --qlang-value: 0 0% 70%;
  --qlang-number: 0 0% 82%;
  --qlang-keyword: 0 0% 74%;
  --preview-banner: 0 0% 12%;
  --preview-banner-border: 0 0% 22%;
  --preview-banner-link: 0 0% 80%;
  --preview-banner-link-hover: 0 0% 92%;
}
"""
    current = css.read_text()
    if "Vết overlay" not in current:
        css.write_text(current + extra)
        print("css", css.relative_to(dest))

app = dest / "web/src/pages/_app.tsx"
if app.is_file():
    text = app.read_text()
    old_theme = """                        <ThemeProvider
                          attribute="class"
                          enableSystem
                          disableTransitionOnChange
                        >"""
    new_theme = """                        <ThemeProvider
                          attribute="class"
                          forcedTheme="dark"
                          enableSystem={false}
                          disableTransitionOnChange
                        >"""
    if "forcedTheme" not in text and old_theme in text:
        app.write_text(text.replace(old_theme, new_theme, 1))
        print("theme", app.relative_to(dest))

envp = dest / "web/src/env.mjs"
if envp.is_file():
    env = envp.read_text()
    if "NEXT_PUBLIC_VET_MARKETING_URL" not in env:
        env = env.replace(
            "    NEXT_PUBLIC_BASE_PATH: z.string().optional(),\n",
            "    NEXT_PUBLIC_BASE_PATH: z.string().optional(),\n    NEXT_PUBLIC_VET_MARKETING_URL: z.string().url().optional(),\n",
            1,
        )
        env = env.replace(
            "    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,\n",
            "    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,\n    NEXT_PUBLIC_VET_MARKETING_URL: process.env.NEXT_PUBLIC_VET_MARKETING_URL,\n",
            1,
        )
        envp.write_text(env)
        print("env", envp.relative_to(dest))

df = dest / "web/Dockerfile"
if df.is_file():
    text = df.read_text()
    needle = "ARG NEXT_PUBLIC_BASE_PATH\nENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH\n"
    inject = needle + "ARG NEXT_PUBLIC_VET_MARKETING_URL\nENV NEXT_PUBLIC_VET_MARKETING_URL=$NEXT_PUBLIC_VET_MARKETING_URL\n"
    orig = text
    if "NEXT_PUBLIC_VET_MARKETING_URL" not in text and needle in text:
        text = text.replace(needle, inject, 1)
    # 75% of an 8GiB Colima VM OOMs Next.js. Cap the heap and serialize turbo.
    old_build = "RUN NODE_OPTIONS='--max-old-space-size-percentage=75' turbo run build --filter=web..."
    new_build = "RUN NODE_OPTIONS='--max-old-space-size=4096' turbo run build --filter=web... --concurrency=1"
    if old_build in text:
        text = text.replace(old_build, new_build, 1)
    if text != orig:
        df.write_text(text)
        print("dockerfile", df.relative_to(dest))

ncfg = dest / "web/next.config.mjs"
if ncfg.is_file():
    text = ncfg.read_text()
    mkt = os.environ.get("NEXT_PUBLIC_VET_MARKETING_URL", "http://localhost:43173").strip()
    parsed = urlparse(mkt if "://" in mkt else f"http://{mkt}")
    mkt_origin = f"{parsed.scheme}://{parsed.netloc}" if parsed.scheme and parsed.netloc else "http://localhost:43173"
    extra = "" if mkt_origin in ("http://localhost:43173", "http://127.0.0.1:43173") else f" {mkt_origin}"
    old_frame = "  frame-src 'self' https://challenges.cloudflare.com"
    new_frame = (
        "  frame-src 'self' http://localhost:43173 http://127.0.0.1:43173 "
        f"http://localhost:* http://127.0.0.1:*{extra} https://challenges.cloudflare.com"
    )
    old_font = "  font-src ${assetPrefixSrc}'self';"
    new_font = "  font-src ${assetPrefixSrc}'self' https://fonts.gstatic.com https://fonts.googleapis.com;"
    orig = text
    if mkt_origin not in text or "http://localhost:43173" not in text:
        if "http://localhost:43173" not in text:
            text = text.replace(old_frame, new_frame, 1)
        elif extra and mkt_origin not in text:
            text = text.replace(
                "http://localhost:* http://127.0.0.1:* https://challenges.cloudflare.com",
                f"http://localhost:* http://127.0.0.1:*{extra} https://challenges.cloudflare.com",
                1,
            )
    if "https://fonts.gstatic.com" not in text:
        text = text.replace(old_font, new_font, 1)
    if text != orig:
        ncfg.write_text(text)
        print("csp", ncfg.relative_to(dest))

def patch(rel, replacements):
    path = dest / rel
    if not path.is_file():
        raise SystemExit(f"overlay miss: {rel} not found")
    text = path.read_text()
    missing = [a for a, _ in replacements if a not in text]
    if missing:
        preview = missing[0][:80].replace("\n", "\\n")
        raise SystemExit(f"overlay miss {rel}: {preview!r}")
    orig = text
    for a, b in replacements:
        text = text.replace(a, b)
    if text != orig:
        path.write_text(text)
        print("chrome", path.relative_to(dest))

patch("web/src/features/filters/components/filter-builder.tsx", [
    ('label = "Filters"', 'label = "Bộ lọc"'),
])
patch("packages/shared/src/utils/dateRanges.ts", [
    ('label: "Past 5 min"', 'label: "5 phút qua"'),
    ('label: "Past 30 min"', 'label: "30 phút qua"'),
    ('label: "Past 1 hour"', 'label: "1 giờ qua"'),
    ('label: "Past 3 hours"', 'label: "3 giờ qua"'),
    ('label: "Past 6 hours"', 'label: "6 giờ qua"'),
    ('label: "Past 1 day"', 'label: "1 ngày qua"'),
    ('label: "Past 3 days"', 'label: "3 ngày qua"'),
    ('label: "Past 7 days"', 'label: "7 ngày qua"'),
    ('label: "Past 14 days"', 'label: "14 ngày qua"'),
    ('label: "Past 30 days"', 'label: "30 ngày qua"'),
    ('label: "Past 90 days"', 'label: "90 ngày qua"'),
    ('label: "Past 1 year"', 'label: "1 năm qua"'),
    ('label: "All time"', 'label: "Mọi lúc"'),
    ('label: "Custom"', 'label: "Tùy chọn"'),
])
patch("web/src/pages/project/[projectId]/index.tsx", [
    ('?? "Langfuse Home"', '?? "Trang chủ Vết"'),
    ('title="Environment"', 'title="Môi trường"'),
    ('label="Env"', 'label="Môi trường"'),
    (
        'title="Show this dashboard on Home for everyone in this project"',
        'title="Hiện bảng này trên Tổng quan cho mọi người trong dự án"',
    ),
    ("Set default", "Đặt mặc định"),
    (
        'title="Edit this dashboard in Dashboards"',
        'title="Sửa bảng này trong Bảng điều khiển"',
    ),
    (
        "Edit this dashboard in Dashboards",
        "Sửa bảng này trong Bảng điều khiển",
    ),
    ("Configure Tracing", "Cấu hình truy vết"),
])
patch("web/src/features/v4-migration/V4MigrationContent.tsx", [
    (
        '''          <span>·</span>
          <a
            href="https://cal.com/team/langfuse/v4-upgrade"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => capture("v4_migration:contact_book_call_clicked")}
            className="underline"
          >
            Book a call
          </a>''',
        "",
    ),
])
patch("web/src/features/projects/ProjectSettingsPage.tsx", [
    ('title: "General"', 'title: "Chung"'),
    ('title: "API Keys"', 'title: "Khóa API"'),
    ('title: "MCP & CLI"', 'title: "MCP và CLI"'),
    ('title: "LLM Connections"', 'title: "Kết nối LLM"'),
    ('title: "Model Definitions"', 'title: "Định nghĩa model"'),
    ('title: "Protected Prompt Labels"', 'title: "Nhãn prompt khóa"'),
    ('title: "Scores Configs"', 'title: "Cấu hình score"'),
    ('title: "Members"', 'title: "Thành viên"'),
    ('title: "Integrations"', 'title: "Tích hợp"'),
    ('title: "Exports"', 'title: "Xuất dữ liệu"'),
    ('title: "Batch Actions"', 'title: "Thao tác hàng loạt"'),
    ('title: "Audit Logs"', 'title: "Nhật ký audit"'),
    ('title: "Notifications"', 'title: "Thông báo"'),
    ('title: "Billing"', 'title: "Thanh toán"'),
    ('title: "Organization Settings"', 'title: "Cài đặt tổ chức"'),
    ('title: "v4 Migration"', 'title: "Di chuyển v4"'),
    ('<Header title="Debug Information" />', '<Header title="Thông tin gỡ lỗi" />'),
    ('<Header title="Project Members" />', '<Header title="Thành viên dự án" />'),
    ('<Header title="Integrations" />', '<Header title="Tích hợp" />'),
    ('title: "Transfer ownership"', 'title: "Chuyển quyền sở hữu"'),
    (
        "Transfer this project to another organization where you have the ability to create projects.",
        "Chuyển dự án sang tổ chức khác mà bạn được tạo dự án.",
    ),
    ("Transfer Project", "Chuyển dự án"),
    ('title: "Delete this project"', 'title: "Xóa dự án này"'),
    (
        "Once you delete a project, there is no going back. Please be certain.",
        "Xóa dự án là vĩnh viễn.",
    ),
    ("Delete Project", "Xóa dự án"),
    ("              Configure\n", "              Cấu hình\n"),
    ("Integration Docs ↗", "Tài liệu ↗"),
    (
        'href="https://langfuse.com/integrations/analytics/posthog"',
        'href="https://github.com/Dondo0936/langben"',
    ),
    (
        'href="https://langfuse.com/integrations/analytics/mixpanel"',
        'href="https://github.com/Dondo0936/langben"',
    ),
    (
        'href="https://langfuse.com/docs/query-traces#blob-storage"',
        'href="https://github.com/Dondo0936/langben"',
    ),
    (
        """            We have teamed up with PostHog (OSS product analytics) to make
            Langfuse Events/Metrics available in your Posthog Dashboards.""",
        """            Đẩy sự kiện Vết sang dashboard PostHog (OSS).""",
    ),
    (
        """            Integrate with Mixpanel to sync your Langfuse traces, generations,
            and scores for advanced product analytics and insights.""",
        """            Đồng bộ vết, generation và điểm sang Mixpanel.""",
    ),
    (
        """            Configure scheduled exports of your trace data to S3 compatible
            storages or Azure Blob Storage. Set up a scheduled export to your
            own storage for data analysis or backup purposes.""",
        """            Xuất vết định kỳ sang S3 tương thích hoặc Azure Blob.""",
    ),
    (
        """            Connect a Slack workspace and create channel automations to receive
            Langfuse alerts natively in Slack.""",
        """            Nhận cảnh báo Vết trong Slack.""",
    ),
    (
        "    href: \"/v4-migration\",\n    show: showV4Migration,",
        "    href: \"/v4-migration\",\n    show: false,",
    ),
])
patch("web/src/pages/organization/[organizationId]/settings/index.tsx", [
    ('title: "General"', 'title: "Chung"'),
    ('title: "Feature Previews"', 'title: "Xem trước tính năng"'),
    ('title: "API Keys"', 'title: "Khóa API"'),
    ('title: "Members"', 'title: "Thành viên"'),
    ('title: "Audit Logs"', 'title: "Nhật ký audit"'),
    ('title: "Billing"', 'title: "Thanh toán"'),
    ('title: "Projects"', 'title: "Dự án"'),
    ('title: "v4 Migration"', 'title: "Di chuyển v4"'),
    ('<Header title="Debug Information" />', '<Header title="Thông tin gỡ lỗi" />'),
    ('<Header title="Organization Members" />', '<Header title="Thành viên tổ chức" />'),
    ('title: "Delete this organization"', 'title: "Xóa tổ chức này"'),
    (
        "Once you delete an organization, there is no going back. Please be certain.",
        "Xóa tổ chức là vĩnh viễn.",
    ),
    ("Delete Organization", "Xóa tổ chức"),
    (
        "    href: \"/v4-migration\",\n    show: showV4Migration,",
        "    href: \"/v4-migration\",\n    show: false,",
    ),
])
patch("web/src/features/projects/components/RenameProject.tsx", [
    ('<Header title="Project Name" />', '<Header title="Tên dự án" />'),
    ("Your Project will be renamed from", "Đổi tên dự án từ"),
    ("Your Project is currently named", "Tên dự án hiện tại"),
    ("Save", "Lưu"),
])
patch("web/src/pages/account/settings/index.tsx", [
    ('title: "General"', 'title: "Chung"'),
    ('<Header title="Email" />', '<Header title="Email" />'),
    ('<Header title="Password" />', '<Header title="Mật khẩu" />'),
    ("Change Password", "Đổi mật khẩu"),
    ('title: "v4 Migration"', 'title: "Di chuyển v4"'),
    (
        "    href: \"/v4-migration\",\n    show: showV4Migration,",
        "    href: \"/v4-migration\",\n    show: false,",
    ),
    ('title: "Delete your account"', 'title: "Xóa tài khoản"'),
    (
        "You can delete your account if you are not the last owner of any organization. If you are the last owner, please add another owner or delete the organization and all projects first.",
        "Xóa được nếu bạn không phải owner cuối của tổ chức nào.",
    ),
    (
        """              To change your password, we will email a one-time code to your
              address. Enter the code together with your new password.""",
        "              Để đổi mật khẩu, nhập mã gửi về email cùng mật khẩu mới.",
    ),
    ("Your email address:", "Email:"),
])
patch("web/src/features/public-api/components/ApiKeyList.tsx", [
    ('<Header title="API Keys" />', '<Header title="Khóa API" />'),
    (
        "title={startCase(`${scope} API keys`)}",
        'title={scope === "project" ? "Khóa API dự án" : "Khóa API tổ chức"}',
    ),
    ("Access Denied", "Không có quyền"),
    (
        "You do not have permission to view API keys for this {scope}.",
        "Không xem được khóa API của {scope}.",
    ),
    (
        "description: `Learn more about ${scope} API keys`,",
        'description: "Khóa pk/sk để ingest vết vào console.",',
    ),
    (
        """            scope === "project"
              ? "https://langfuse.com/docs/api#authentication"
              : "https://langfuse.com/docs/api#org-scoped-routes",""",
        '            "https://github.com/Dondo0936/langben",',
    ),
    (
        "Secrets are not included, create a new key to copy them.",
        "Không gồm secret. Tạo khóa mới để copy.",
    ),
])
patch("web/src/features/public-api/components/LLMApiKeyList.tsx", [
    ('<Header title="LLM Connections" />', '<Header title="Kết nối LLM" />'),
    ("Access Denied", "Không có quyền"),
    (
        "You do not have permission to view LLM API keys for this project.",
        "Không xem được khóa LLM của dự án này.",
    ),
    (
        "Connect your LLM services to enable evaluations and playground features.",
        "Kết nối LLM cho đánh giá agent và playground.",
    ),
    ("Your provider will charge based on usage.", "Nhà cung cấp tính phí theo usage."),
])
patch("web/src/features/public-api/components/CreateLLMApiKeyDialog.tsx", [
    ("Add LLM Connection", "Thêm kết nối LLM"),
    ("New LLM Connection", "Kết nối LLM mới"),
])
patch("web/src/features/public-api/components/CreateApiKeyButton.tsx", [
    ("Create new API keys", "Tạo khóa API"),
])
patch("web/src/features/projects/components/ConfigureRetention.tsx", [
    ('<Header title="Data Retention" />', '<Header title="Lưu dữ liệu" />'),
    (
        """          Data retention automatically deletes events older than the specified
          number of days. The value must be 0 or at least 3 days. Set to 0 to
          retain data indefinitely. The deletion happens asynchronously, i.e.
          event may be available for a while after they expired.""",
        """          Xóa sự kiện cũ hơn số ngày đã đặt. 0 = giữ vô thời hạn. Tối thiểu 3 ngày nếu không phải 0.""",
    ),
    ("Your Project retains data indefinitely.", "Dự án giữ dữ liệu vô thời hạn."),
])
patch("web/src/features/events/lib/v4Rollout.ts", [
    (
        """export function isV4UpgradeUiAvailable({
  isLangfuseCloud,
  v4WriteMode,
  dualPreviewAvailable,
}: V4UpgradeUiAvailabilityContext): boolean {
  switch (v4WriteMode) {
    case "legacy":
      return false;
    case "dual":
      return dualPreviewAvailable;
    case "events_only":
      return isLangfuseCloud;
  }
}""",
        """export function isV4UpgradeUiAvailable(_ctx: V4UpgradeUiAvailabilityContext): boolean {
  return false;
}""",
    ),
])
patch("web/src/features/rbac/components/MembersTable.tsx", [
    ('return "N/A on plan";', 'return "—";'),
])
patch("web/src/components/nav/AppSidebar/AppSidebar.tsx", [
    (
        'href="https://github.com/langfuse/langfuse/releases"',
        'href="https://github.com/Dondo0936/langben/releases"',
    ),
    (
        """        <DropdownMenuItem asChild>
          <Link href="https://langfuse.com/changelog" target="_blank">
            <Newspaper size={16} className="mr-2" />
            Changelog
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="https://langfuse.com/roadmap" target="_blank">
            <Map size={16} className="mr-2" />
            Roadmap
          </Link>
        </DropdownMenuItem>
        {state.deployment === "self-hosted" && (
          <DropdownMenuItem asChild>
            <Link href="https://langfuse.com/pricing-self-host" target="_blank">
              <Info size={16} className="mr-2" />
              Compare Versions
            </Link>
          </DropdownMenuItem>
        )}""",
        """        <DropdownMenuItem asChild>
          <Link href="https://github.com/Dondo0936/langben" target="_blank">
            <Newspaper size={16} className="mr-2" />
            GitHub
          </Link>
        </DropdownMenuItem>""",
    ),
    (
        """              <Link
                href="https://langfuse.com/docs/deployment/self-host#update"
                target="_blank"
              >""",
        """              <Link
                href="https://github.com/Dondo0936/langben"
                target="_blank"
              >""",
    ),
])
patch("web/src/components/ui/sidebar.tsx", [
    (">Toggle Sidebar<", ">Thu gọn menu<"),
    ('aria-label="Toggle Sidebar"', 'aria-label="Thu gọn menu"'),
    ('title="Toggle Sidebar"', 'title="Thu gọn menu"'),
])
patch("web/src/features/evals/v2/pages/EvaluatorsPage.tsx", [
    ("              New evaluator", "              Bộ đánh giá mới"),
    (
        '"Create reusable evaluator definitions and test them before activation."',
        '"Tạo bộ đánh giá rồi thử trước khi bật."',
    ),
])
patch("web/src/components/table/table-view-presets/components/data-table-view-presets-drawer.tsx", [
    ('title="My Views"', 'title="View của tôi"'),
    ("<span>My Views</span>", "<span>View của tôi</span>"),
])
patch("web/src/components/table/use-cases/scores.tsx", [
    ('header: "Score ID"', 'header: "ID score"'),
    ('header: "Timestamp"', 'header: "Thời gian"'),
    ('header: "Name"', 'header: "Tên"'),
    ('header: "Value"', 'header: "Giá trị"'),
    ('header: "Data Type"', 'header: "Kiểu"'),
    ('header: "Source"', 'header: "Nguồn"'),
    ('header: "Level"', 'header: "Mức"'),
    ('header: "Comment"', 'header: "Ghi chú"'),
    ('header: "Environment"', 'header: "Môi trường"'),
    ('header: "Trace Tags"', 'header: "Tag vết"'),
    ('header: "Metadata"', 'header: "Metadata"'),
    ('header: "Trace Name"', 'header: "Tên vết"'),
    ('header: "Trace"', 'header: "Vết"'),
    ('header: "Observation"', 'header: "Observation"'),
    ('header: "Execution Trace"', 'header: "Vết chạy"'),
    ('header: "Session"', 'header: "Phiên"'),
    ('header: "User"', 'header: "Người dùng"'),
    ('header: "Author"', 'header: "Tác giả"'),
    ("No scores found.", "Chưa có score."),
    (
        """                    <a
                      href="https://langfuse.com/faq/all/what-are-scores"
                      className="text-primary pointer-events-auto italic underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      What are scores?
                    </a>""",
        "",
    ),
])
PY

echo "Overlay applied → $DEST"
